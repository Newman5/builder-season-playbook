#!/usr/bin/env bash

# Make the script safer:
# -e: exit if any command fails
# -u: error if using an undefined variable
# -o pipefail: fail if any command in a pipeline fails
set -euo pipefail


# Find important directories relative to this script's location.
# This makes the script work even if you run it from another folder.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${WEB_DIR}/.." && pwd)"

# Input and output data files.
BUILDERS_FILE="${WEB_DIR}/src/_data/builders.json"
OUTPUT_FILE="${WEB_DIR}/src/_data/activity.json"

# Use a GitHub token if one exists.
# Prefer GH_ACTIVITY_TOKEN, otherwise fall back to GITHUB_TOKEN.
TOKEN="${GH_ACTIVITY_TOKEN:-${GITHUB_TOKEN:-}}"

# Generate or refresh builders.json before collecting activity.
"${SCRIPT_DIR}/builders-json.sh"

# Current UTC timestamp.
now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Calculate the current week in UTC.
# This assumes the week starts on Monday and ends Sunday.
today_midnight_epoch="$(date -u -d "$(date -u +%F) 00:00:00" +%s)"
weekday="$(date -u +%u)"
week_start_epoch="$((today_midnight_epoch - (weekday - 1) * 86400))"
week_end_epoch="$((week_start_epoch + 6 * 86400 + 86399))"

# Convert week start/end back into ISO timestamps for the GitHub API.
week_start="$(date -u -d "@${week_start_epoch}" +"%Y-%m-%dT%H:%M:%SZ")"
week_end="$(date -u -d "@${week_end_epoch}" +"%Y-%m-%dT%H:%M:%SZ")"

# Create a temporary file to store one JSON object per builder.
tmp_records="$(mktemp)"

# Delete the temp file when the script exits.
cleanup() {
  rm -f "${tmp_records}"
}
trap cleanup EXIT

# Convert many possible GitHub repo formats into owner/repo.
# Examples:
# https://github.com/foo/bar.git -> foo/bar
# git@github.com:foo/bar.git    -> foo/bar
normalize_repo() {
  local repo_input="$1"
  local repo="${repo_input#https://github.com/}"
  repo="${repo#http://github.com/}"
  repo="${repo#git@github.com:}"
  repo="${repo%.git}"
  repo="${repo#/}"
  printf '%s' "${repo}"
}

# Translate GitHub HTTP status codes into useful error labels.
status_to_error() {
  local status="${1:-}"
  case "${status}" in
    404) printf 'REPO_NOT_FOUND' ;;
    409) printf 'EMPTY_REPO_OR_NO_COMMITS' ;;
    403) printf 'FORBIDDEN_OR_RATE_LIMITED' ;;
    2*) printf '' ;;
    '') printf 'NETWORK_ERROR' ;;
    *) printf 'API_ERROR_%s' "${status}" ;;
  esac
}

# Wrapper around curl for GitHub API requests.
# It adds standard GitHub headers and optionally adds auth.
github_request() {
  local url="$1"
  local headers_file="$2"
  local -a curl_args=(
    -sS -L
    -H "Accept: application/vnd.github+json"
    -H "User-Agent: builder-season-activity-script"
    -D "${headers_file}"
  )

# Add Authorization header only if a token is available.
  if [[ -n "${TOKEN}" ]]; then
    curl_args+=(-H "Authorization: Bearer ${TOKEN}")
  fi

  curl "${curl_args[@]}" "${url}"
}

# Read each builder object from builders.json as compact JSON.
while IFS= read -r builder_json; do

  # Extract fields from the builder record.
  id="$(jq -r '.id' <<<"${builder_json}")"
  name="$(jq -r '.name' <<<"${builder_json}")"
  repo_url="$(jq -r '.repoUrl // empty' <<<"${builder_json}")"
  
  # Normalize the repo URL into owner/repo format.
  repo="$(normalize_repo "${repo_url}")"

  # Initialize per-builder values.
  total_commits=0
  page=1
  last_activity_at=""
  error=""
  recent_commits='[]'

  # Repo must look like owner/repo.
  if [[ -z "${repo}" || "${repo}" != */* ]]; then
    error="INVALID_REPO_URL"
  else

    # Fetch commit pages from GitHub.
    # Each page can contain up to 100 commits.
    while :; do
      headers_file="$(mktemp)"
      
      # GitHub commits API for the current repo and current week.
      api_url="https://api.github.com/repos/${repo}/commits?since=${week_start}&until=${week_end}&per_page=100&page=${page}"
      body=""
      
      # Make the API request.
      # If curl itself fails, record a network error and stop.
      if ! body="$(github_request "${api_url}" "${headers_file}" 2>/dev/null)"; then
        status=""
        error="NETWORK_ERROR"
        rm -f "${headers_file}"
        break
      fi

      # Extract the final HTTP status code from response headers.
      status="$(awk 'toupper($1) ~ /^HTTP\// { code=$2 } END { print code }' "${headers_file}")"
      rm -f "${headers_file}"

      # If GitHub did not return success, convert status to an error.
      if [[ ! "${status}" =~ ^2[0-9][0-9]$ ]]; then
        error="$(status_to_error "${status}")"
        break
      fi
      
      # Count commits on this page.
      page_count="$(jq 'if type == "array" then length else 0 end' <<<"${body}")"
      
      # Add this page's commits to the weekly total.
      total_commits="$((total_commits + page_count))"

      # On the first page only:
      # - capture the most recent commit date
      # - save the 5 most recent commit summaries
      if [[ "${page}" -eq 1 ]]; then
        last_activity_at="$(jq -r 'if type == "array" and length > 0 then .[0].commit.author.date else empty end' <<<"${body}")"
        recent_commits="$(jq --arg repo "${repo}" 'if type == "array" then .[:5] | map({
          repo: $repo,
          message: .commit.message,
          url: .html_url,
          committedAt: .commit.author.date
        }) else [] end' <<<"${body}")"
      fi

      # If fewer than 100 commits came back, this was the last page.
      if [[ "${page_count}" -lt 100 ]]; then
        break
      fi

      # Otherwise fetch the next page.
      page="$((page + 1))"
    done

    # If there were zero commits this week, get the latest commit overall.
    # This lets the dashboard show "last activity" even when weekly commits = 0.
    if [[ -z "${last_activity_at}" && -z "${error}" ]]; then
      headers_file="$(mktemp)"
      latest_url="https://api.github.com/repos/${repo}/commits?per_page=1"
      latest_body=""
      if latest_body="$(github_request "${latest_url}" "${headers_file}" 2>/dev/null)"; then
        status="$(awk 'toupper($1) ~ /^HTTP\// { code=$2 } END { print code }' "${headers_file}")"
        if [[ "${status}" =~ ^2[0-9][0-9]$ ]]; then
          last_activity_at="$(jq -r 'if type == "array" and length > 0 then .[0].commit.author.date else empty end' <<<"${latest_body}")"
        fi
      fi
      rm -f "${headers_file}"
    fi
  fi
  
  # Create one JSON object for this builder and append it to tmp_records.
  jq -n \
    --arg id "${id}" \
    --arg name "${name}" \
    --arg lastActivityAt "${last_activity_at}" \
    --arg error "${error}" \
    --argjson commitsThisWeek "${total_commits}" \
    --argjson recentCommits "${recent_commits}" \
    '{
      id: $id,
      name: $name,
      lastActivityAt: ($lastActivityAt | if . == "" then null else . end),
      commitsThisWeek: $commitsThisWeek,
      recentCommits: $recentCommits,
      error: ($error | if . == "" then null else . end)
    }' >> "${tmp_records}"
# Feed each builder from builders.json into the while loop.
done < <(jq -c '.[]' "${BUILDERS_FILE}")

# Wrap all builder records into the final activity.json structure.
jq -s \
  --arg generatedAt "${now_iso}" \
  --arg weekStart "${week_start}" \
  --arg weekEnd "${week_end}" \
  '{
    generatedAt: $generatedAt,
    weekStart: $weekStart,
    weekEnd: $weekEnd,
    builders: .
  }' "${tmp_records}" > "${OUTPUT_FILE}"
