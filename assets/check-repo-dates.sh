#!/usr/bin/env bash

CUTOFF="2026-04-14"

repos=(
"https://github.com/Mhizta-gab/Book-Worm-AI"
"https://github.com/murmurations-ai/flyway"
"https://github.com/Dammy7942/accordiax"
)
echo "repo,earliest_commit,before_${CUTOFF}"

for repo in "${repos[@]}"; do
  repo_input="$repo"
  repo="${repo_input#https://github.com/}"
  repo="${repo#http://github.com/}"
  repo="${repo#git@github.com:}"
  repo="${repo%.git}"
  repo="${repo#/}"

  if [[ "$repo" != */* ]]; then
    echo "$repo_input,,UNKNOWN_INVALID_REPO_FORMAT"
    continue
  fi

  api_url="https://api.github.com/repos/${repo}/commits?per_page=1"

  headers=$(mktemp)
  curl_args=(
    -sS -L
    -H "Accept: application/vnd.github+json"
    -H "User-Agent: repo-date-check"
    -D "$headers"
  )
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    curl_args+=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
  fi

  body=$(curl "${curl_args[@]}" "$api_url")
  status=$(awk 'toupper($1) ~ /^HTTP\// { code=$2 } END { print code }' "$headers")

  last_url=$(grep -i '^link:' "$headers" \
    | sed -n 's/.*<\([^>]*\)>; rel="last".*/\1/p')

  if [[ "$status" =~ ^2[0-9][0-9]$ && -n "$last_url" ]]; then
    last_curl_args=(
      -sS -L
      -H "Accept: application/vnd.github+json"
      -H "User-Agent: repo-date-check"
    )
    if [[ -n "${GITHUB_TOKEN:-}" ]]; then
      last_curl_args+=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
    fi
    body=$(curl "${last_curl_args[@]}" "$last_url")
  fi

  date=$(echo "$body" | jq -r 'if type == "array" and length > 0 then .[0].commit.author.date else empty end' | cut -c1-10)

  if [[ -z "$date" ]]; then
    if [[ "$status" == "404" ]]; then
      result="UNKNOWN_REPO_NOT_FOUND"
    elif [[ "$status" == "409" ]]; then
      result="UNKNOWN_EMPTY_REPO_OR_NO_COMMITS"
    elif [[ "$status" == "403" ]]; then
      result="UNKNOWN_FORBIDDEN_OR_RATE_LIMITED"
    elif [[ "$status" =~ ^2[0-9][0-9]$ ]]; then
      result="UNKNOWN_OR_NO_COMMITS"
    else
      result="UNKNOWN_API_ERROR_${status:-NA}"
    fi
  elif [[ "$date" < "$CUTOFF" ]]; then
    result="YES"
  else
    result="NO"
  fi

  echo "$repo_input,$date,$result"

  rm "$headers"
done