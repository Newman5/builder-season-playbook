#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${WEB_DIR}/.." && pwd)"
BUILDERS_FILE="${WEB_DIR}/src/_data/builders.json"
OUTPUT_FILE="${WEB_DIR}/src/_data/activity.json"
TOKEN="${GH_ACTIVITY_TOKEN:-${GITHUB_TOKEN:-}}"

"${SCRIPT_DIR}/builders-json.sh"

now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
today_midnight_epoch="$(date -u -d "$(date -u +%F) 00:00:00" +%s)"
weekday="$(date -u +%u)"
week_start_epoch="$((today_midnight_epoch - (weekday - 1) * 86400))"
week_end_epoch="$((week_start_epoch + 6 * 86400 + 86399))"
week_start="$(date -u -d "@${week_start_epoch}" +"%Y-%m-%dT%H:%M:%SZ")"
week_end="$(date -u -d "@${week_end_epoch}" +"%Y-%m-%dT%H:%M:%SZ")"

tmp_records="$(mktemp)"
cleanup() {
  rm -f "${tmp_records}"
}
trap cleanup EXIT

normalize_repo() {
  local repo_input="$1"
  local repo="${repo_input#https://github.com/}"
  repo="${repo#http://github.com/}"
  repo="${repo#git@github.com:}"
  repo="${repo%.git}"
  repo="${repo#/}"
  printf '%s' "${repo}"
}

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

github_request() {
  local url="$1"
  local headers_file="$2"
  local -a curl_args=(
    -sS -L
    -H "Accept: application/vnd.github+json"
    -H "User-Agent: builder-season-activity-script"
    -D "${headers_file}"
  )

  if [[ -n "${TOKEN}" ]]; then
    curl_args+=(-H "Authorization: Bearer ${TOKEN}")
  fi

  curl "${curl_args[@]}" "${url}"
}

while IFS= read -r builder_json; do
  id="$(jq -r '.id' <<<"${builder_json}")"
  name="$(jq -r '.name' <<<"${builder_json}")"
  repo_url="$(jq -r '.repoUrl // empty' <<<"${builder_json}")"
  repo="$(normalize_repo "${repo_url}")"

  total_commits=0
  page=1
  last_activity_at=""
  error=""
  recent_commits='[]'

  if [[ -z "${repo}" || "${repo}" != */* ]]; then
    error="INVALID_REPO_URL"
  else
    while :; do
      headers_file="$(mktemp)"
      api_url="https://api.github.com/repos/${repo}/commits?since=${week_start}&until=${week_end}&per_page=100&page=${page}"
      body=""
      if ! body="$(github_request "${api_url}" "${headers_file}" 2>/dev/null)"; then
        status=""
        error="NETWORK_ERROR"
        rm -f "${headers_file}"
        break
      fi

      status="$(awk 'toupper($1) ~ /^HTTP\// { code=$2 } END { print code }' "${headers_file}")"
      rm -f "${headers_file}"

      if [[ ! "${status}" =~ ^2[0-9][0-9]$ ]]; then
        error="$(status_to_error "${status}")"
        break
      fi

      page_count="$(jq 'if type == "array" then length else 0 end' <<<"${body}")"
      total_commits="$((total_commits + page_count))"

      if [[ "${page}" -eq 1 ]]; then
        last_activity_at="$(jq -r 'if type == "array" and length > 0 then .[0].commit.author.date else empty end' <<<"${body}")"
        recent_commits="$(jq --arg repo "${repo}" 'if type == "array" then .[:5] | map({
          repo: $repo,
          message: .commit.message,
          url: .html_url,
          committedAt: .commit.author.date
        }) else [] end' <<<"${body}")"
      fi

      if [[ "${page_count}" -lt 100 ]]; then
        break
      fi

      page="$((page + 1))"
    done

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
done < <(jq -c '.[]' "${BUILDERS_FILE}")

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
