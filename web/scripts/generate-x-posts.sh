#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${WEB_DIR}/.." && pwd)"
BUILDERS_FILE="${WEB_DIR}/src/_data/builders.json"
EVENT_FILE="${REPO_ROOT}/config/event.yml"
SUBMISSIONS_DIR="${REPO_ROOT}/submissions/x-updates"
OUTPUT_POSTS_FILE="${WEB_DIR}/src/_data/x-posts.json"
OUTPUT_WEEKS_FILE="${WEB_DIR}/src/_data/x-weeks.json"

python3 "${SCRIPT_DIR}/builders_json.py"

tmp_event="$(mktemp)"
tmp_submission_list="$(mktemp)"
tmp_posts="$(mktemp)"
tmp_builders="$(mktemp)"

cleanup() {
  rm -f "${tmp_event}" "${tmp_submission_list}" "${tmp_posts}" "${tmp_builders}"
}
trap cleanup EXIT

EVENT_FILE="${EVENT_FILE}" ruby <<'RUBY' > "${tmp_event}"
require "json"
require "yaml"

raw = YAML.load_file(ENV.fetch("EVENT_FILE")) || {}
build_start = raw["build_start"]
duration = raw["event_duration_weeks"]
valid_date = build_start.is_a?(String) && build_start.match?(/^\d{4}-\d{2}-\d{2}$/)
valid_duration = duration.is_a?(Integer) || duration.to_s.match?(/^\d+$/)

payload = {
  "buildStart" => build_start,
  "eventDurationWeeks" => valid_duration ? duration.to_i : nil,
  "defaultHashtags" => raw["weekly_update_hashtags"] || [],
  "defaultMention" => raw["weekly_update_mention"],
  "configError" => nil,
}

if !valid_date
  payload["configError"] = "INVALID_BUILD_START"
elsif !valid_duration || payload["eventDurationWeeks"] <= 0
  payload["configError"] = "INVALID_EVENT_DURATION_WEEKS"
end

puts JSON.generate(payload)
RUBY

BUILDERS_FILE="${BUILDERS_FILE}" SUBMISSIONS_DIR="${SUBMISSIONS_DIR}" ruby <<'RUBY' > "${tmp_submission_list}"
require "json"
require "yaml"

builders = JSON.parse(File.read(ENV.fetch("BUILDERS_FILE")))
builder_ids = builders.map { |b| b["id"] }.to_h { |id| [id, true] }
submissions_dir = ENV.fetch("SUBMISSIONS_DIR")
records = []

if Dir.exist?(submissions_dir)
  Dir.children(submissions_dir).grep(/\.ya?ml$/).sort.each do |name|
    path = File.join(submissions_dir, name)
    raw = YAML.load_file(path) || {}
    records << {
      "path" => path,
      "builderId" => raw["builder_id"],
      "xHandle" => raw["x_handle"],
      "posts" => raw["posts"] || [],
      "knownBuilder" => builder_ids.key?(raw["builder_id"]),
    }
  end
end

puts JSON.pretty_generate(records)
RUBY

default_hashtags="$(jq -c '.defaultHashtags' "${tmp_event}")"
default_mention="$(jq -r '.defaultMention // empty' "${tmp_event}")"
build_start_date="$(jq -r '.buildStart // empty' "${tmp_event}")"
event_duration_weeks="$(jq -r '.eventDurationWeeks // 0' "${tmp_event}")"
config_error="$(jq -r '.configError // empty' "${tmp_event}")"
generated_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

if [[ -n "${build_start_date}" && -z "${config_error}" ]]; then
  build_start_epoch="$(date -u -d "${build_start_date} 00:00:00" +%s)"
  build_end_epoch="$((build_start_epoch + (event_duration_weeks * 7 * 86400) - 1))"
else
  build_start_epoch=0
  build_end_epoch=0
fi

normalize_url() {
  local url="$1"
  printf '%s' "${url}" | sed -E 's#^https?://(www\.)?x\.com/#https://x.com/#'
}

extract_post_id() {
  local url="$1"
  printf '%s' "${url}" | sed -nE 's#^.*/status/([0-9]+).*$#\1#p'
}

while IFS= read -r builder_json; do
  builder_id="$(jq -r '.id' <<<"${builder_json}")"
  x_handle="$(jq -r '.x // empty' <<<"${builder_json}")"
  x_ignore="$(jq -r '.xIgnore // false' <<<"${builder_json}")"
  required_hashtags="$(jq -c 'if (.xRequiredHashtags // []) | length > 0 then .xRequiredHashtags else empty end' <<<"${builder_json}")"
  [[ -z "${required_hashtags}" ]] && required_hashtags="${default_hashtags}"
  required_mention="$(jq -r '.xRequiredMention // empty' <<<"${builder_json}")"
  [[ -z "${required_mention}" ]] && required_mention="${default_mention}"

  submission_json="$(jq -c --arg builder_id "${builder_id}" '.[] | select(.builderId == $builder_id)' "${tmp_submission_list}")"
  submission_error=""
  submitted_count=0
  qualifying_count=0

  if [[ "${x_ignore}" == "true" ]]; then
    submission_error="X_IGNORED"
  elif [[ -z "${x_handle}" ]]; then
    submission_error="NO_X_HANDLE"
  elif [[ -z "${submission_json}" ]]; then
    submission_error="NO_SUBMISSION_FILE"
  else
    submitted_count="$(jq '.posts | length' <<<"${submission_json}")"
    submitted_handle="$(jq -r '.xHandle // empty' <<<"${submission_json}")"
    if [[ -n "${submitted_handle}" && "${submitted_handle}" != "${x_handle}" ]]; then
      submission_error="HANDLE_MISMATCH"
    fi

    while IFS= read -r post_json; do
      url="$(jq -r '.url // empty' <<<"${post_json}")"
      created_at="$(jq -r '.created_at // empty' <<<"${post_json}")"
      text="$(jq -r '.text // ""' <<<"${post_json}")"
      note="$(jq -r '.note // empty' <<<"${post_json}")"
      hashtags_present="$(jq -c '.hashtags // []' <<<"${post_json}")"
      mention_present="$(jq -r 'if (.mention_present // null) != null then .mention_present else empty end' <<<"${post_json}")"
      normalized_url="$(normalize_url "${url}")"
      post_id="$(extract_post_id "${normalized_url}")"

      if [[ -z "${url}" || -z "${created_at}" ]]; then
        qualifies="false"
        validation_error="MISSING_URL_OR_CREATED_AT"
      elif [[ "${normalized_url}" != https://x.com/*/status/* ]]; then
        qualifies="false"
        validation_error="INVALID_X_URL"
      else
        if [[ -z "${mention_present}" ]]; then
          if [[ -n "${required_mention}" ]]; then
            mention_token="$(printf '%s' "${required_mention}" | tr '[:upper:]' '[:lower:]')"
            text_lower="$(printf '%s' "${text}" | tr '[:upper:]' '[:lower:]')"
            [[ "${text_lower}" == *"${mention_token}"* ]] && mention_present="true" || mention_present="false"
          else
            mention_present="true"
          fi
        fi

        created_epoch="$(date -u -d "${created_at}" +%s 2>/dev/null || printf '0')"
        if [[ "${created_epoch}" -eq 0 ]]; then
          validation_error="INVALID_CREATED_AT"
        elif [[ -z "${config_error}" && ( "${created_epoch}" -lt "${build_start_epoch}" || "${created_epoch}" -gt "${build_end_epoch}" ) ]]; then
          validation_error="OUTSIDE_EVENT_WINDOW"
        else
          validation_error=""
        fi

        qualifies="$(jq -n \
          --argjson required "${required_hashtags}" \
          --argjson present "${hashtags_present}" \
          --argjson mentionPresent "$( [[ "${mention_present}" == "true" ]] && printf 'true' || printf 'false' )" \
          '((($required | map(ascii_downcase)) - ($present | map(ascii_downcase))) | length == 0) and $mentionPresent')"
      fi

      [[ "${qualifies}" == "true" ]] && qualifying_count=$((qualifying_count + 1))

      jq -n \
        --arg builderId "${builder_id}" \
        --arg username "${x_handle}" \
        --arg postId "${post_id}" \
        --arg postUrl "${normalized_url}" \
        --arg createdAt "${created_at}" \
        --arg text "${text}" \
        --arg note "${note}" \
        --argjson hashtagsPresent "${hashtags_present}" \
        --argjson requiredHashtags "${required_hashtags}" \
        --arg requiredMention "${required_mention}" \
        --argjson mentionPresent "$( [[ "${mention_present}" == "true" ]] && printf 'true' || printf 'false' )" \
        --argjson qualifies "${qualifies}" \
        --arg validationError "${validation_error}" \
        --arg source "manual_submission" \
        '{
          builderId: $builderId,
          username: $username,
          postId: ($postId | if . == "" then null else . end),
          postUrl: $postUrl,
          createdAt: $createdAt,
          text: $text,
          note: ($note | if . == "" then null else . end),
          hashtagsPresent: $hashtagsPresent,
          requiredHashtags: $requiredHashtags,
          requiredMention: ($requiredMention | if . == "" then null else . end),
          mentionPresent: $mentionPresent,
          qualifies: $qualifies,
          validationError: ($validationError | if . == "" then null else . end),
          source: $source
        }' >> "${tmp_posts}"
    done < <(jq -c '.posts[]?' <<<"${submission_json}")
  fi

  jq -n \
    --arg id "${builder_id}" \
    --arg xHandle "${x_handle}" \
    --arg error "${submission_error}" \
    --argjson submittedCount "${submitted_count}" \
    --argjson qualifyingCount "${qualifying_count}" \
    '{
      id: $id,
      xHandle: ($xHandle | if . == "" then null else . end),
      error: ($error | if . == "" then null else . end),
      submittedCount: $submittedCount,
      qualifyingCount: $qualifyingCount
    }' >> "${tmp_builders}"
done < <(jq -c '.[]' "${BUILDERS_FILE}")

posts='[]'
[[ -s "${tmp_posts}" ]] && posts="$(jq -s 'unique_by(.postUrl) | sort_by(.createdAt) | reverse' "${tmp_posts}")"
builder_summaries='[]'
[[ -s "${tmp_builders}" ]] && builder_summaries="$(jq -s '.' "${tmp_builders}")"

jq -n \
  --arg generatedAt "${generated_at}" \
  --arg buildStart "${build_start_date}" \
  --argjson eventDurationWeeks "${event_duration_weeks:-0}" \
  --arg configError "${config_error}" \
  --argjson defaultHashtags "${default_hashtags}" \
  --arg defaultMention "${default_mention}" \
  --argjson builders "${builder_summaries}" \
  --argjson posts "${posts}" \
  '{
    generatedAt: $generatedAt,
    sourceType: "manual_yaml",
    buildStart: ($buildStart | if . == "" then null else . end),
    eventDurationWeeks: $eventDurationWeeks,
    configError: ($configError | if . == "" then null else . end),
    defaultHashtags: $defaultHashtags,
    defaultMention: ($defaultMention | if . == "" then null else . end),
    builders: $builders,
    posts: $posts
  }' > "${OUTPUT_POSTS_FILE}"

weeks='[]'
if [[ -z "${config_error}" ]]; then
  weeks="$(
    for index in $(seq 1 "${event_duration_weeks}"); do
      week_start_epoch="$((build_start_epoch + (index - 1) * 7 * 86400))"
      week_end_epoch="$((week_start_epoch + 7 * 86400 - 1))"
      jq -n \
        --argjson index "${index}" \
        --arg start "$(date -u -d "@${week_start_epoch}" +"%Y-%m-%dT%H:%M:%SZ")" \
        --arg endAt "$(date -u -d "@${week_end_epoch}" +"%Y-%m-%dT%H:%M:%SZ")" \
        '{index: $index, start: $start, end: $endAt}'
    done | jq -s '.'
  )"
fi

jq -n \
  --arg generatedAt "${generated_at}" \
  --arg buildStart "${build_start_date}" \
  --argjson eventDurationWeeks "${event_duration_weeks:-0}" \
  --arg configError "${config_error}" \
  --argjson weeks "${weeks}" \
  --argjson builders "$(jq -c '.' "${BUILDERS_FILE}")" \
  --argjson posts "${posts}" \
  '{
    generatedAt: $generatedAt,
    buildStart: ($buildStart | if . == "" then null else . end),
    eventDurationWeeks: $eventDurationWeeks,
    configError: ($configError | if . == "" then null else . end),
    weeks: $weeks,
    builders: (
      $builders | map(
        . as $builder |
        ($posts | map(select(.builderId == $builder.id and .qualifies == true))) as $builderPosts |
        {
          id: $builder.id,
          name: $builder.name,
          xHandle: ($builder.x // null),
          xIgnored: ($builder.xIgnore // false),
          allWeeksCovered: false,
          qualifiedWeeks: 0,
          missingWeeks: [],
          weeks: (
            if ($configError | length) > 0 then []
            else
              $weeks | map(
                . as $week |
                ($builderPosts | map(select(.createdAt >= $week.start and .createdAt <= $week.end))) as $weekPosts |
                {
                  index: $week.index,
                  start: $week.start,
                  end: $week.end,
                  qualifies: ($weekPosts | length > 0),
                  posts: ($weekPosts | map({ postUrl, createdAt, source }))
                }
              )
            end
          )
        }
        | .qualifiedWeeks = (.weeks | map(select(.qualifies == true)) | length)
        | .missingWeeks = (.weeks | map(select(.qualifies == false) | .index))
        | .allWeeksCovered = (
          ($configError | length) == 0
          and ((.xHandle // "") != "")
          and (.xIgnored != true)
          and ((.missingWeeks | length) == 0)
        )
      )
    )
  }' > "${OUTPUT_WEEKS_FILE}"
