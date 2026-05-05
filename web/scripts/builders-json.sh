#!/usr/bin/env bash

# Make the script safer:
# -e: exit if any command fails
# -u: error if using an undefined variable
# -o pipefail: fail if any command in a pipeline fails
set -euo pipefail

# Find important directories relative to this script's location.
# This keeps the script working no matter where it is run from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${WEB_DIR}/.." && pwd)"

# Source config and output paths.
# repos.yml is the canonical input; builders.json is generated for the site.
CONFIG_FILE="${REPO_ROOT}/config/repos.yml"
OUTPUT_FILE="${WEB_DIR}/src/_data/builders.json"

# Ensure the destination folder exists before writing the JSON file.
mkdir -p "$(dirname "${OUTPUT_FILE}")"

# Run a small Ruby program inline because YAML parsing and JSON generation
# are much simpler in Ruby than in pure shell.
# The shell passes paths through environment variables so the Ruby block
# stays self-contained and does not depend on shell interpolation inside it.
CONFIG_FILE="${CONFIG_FILE}" OUTPUT_FILE="${OUTPUT_FILE}" ruby <<'RUBY'
require "json"
require "yaml"

# Read the input/output paths from the environment.
config_file = ENV.fetch("CONFIG_FILE")
output_file = ENV.fetch("OUTPUT_FILE")

# Load the YAML config.
# Default to an empty object so missing/blank files do not crash the script.
raw = YAML.load_file(config_file) || {}

# Pull out the repo list. If the key is missing, use an empty array.
repos = raw.fetch("repos", [])

# Convert each repo entry into one normalized builder record for the frontend.
# filter_map lets us both skip entries and transform the remaining ones.
builders = repos.filter_map do |entry|
  # Skip repos explicitly marked to ignore in repos.yml.
  next if entry["ignore"] == true

  # Support either repo_url or url in the config for backwards compatibility.
  repo_url = entry["repo_url"] || entry["url"]

  # If there is no repo URL, we cannot build a builder record.
  next unless repo_url

  # Normalize GitHub URLs into an owner/repo-style path.
  # Examples:
  # https://github.com/foo/bar.git -> foo/bar
  # git@github.com:foo/bar.git    -> foo/bar
  repo_path = repo_url.sub(%r{\Ahttps?://github\.com/}, "").sub(%r{\Agit@github\.com:}, "").sub(/\.git\z/, "").sub(%r{\A/}, "")

  # Use the GitHub owner as a fallback identity source.
  owner = repo_path.split("/")[0]

  # Build stable display fields with fallback rules:
  # - id prefers explicit config, then a slugified builder name, then owner
  # - name prefers explicit config, then builder, then id
  # - github prefers explicit config, then owner
  id = entry["id"] || entry["builder"]&.downcase&.gsub(/[^a-z0-9]+/, "-") || owner
  name = entry["name"] || entry["builder"] || id
  github = entry["github"] || owner

  # Emit the frontend-friendly builder shape.
  # Each field also tolerates both snake_case and camelCase config keys
  # where the repo config currently contains both styles.
  {
    "id" => id,
    "name" => name,
    "github" => github,
    "x" => entry["x"],
    "xRequiredHashtags" => entry["x_required_hashtags"] || entry["xRequiredHashtags"] || [],
    "xRequiredMention" => entry["x_required_mention"] || entry["xRequiredMention"],
    "xIgnore" => entry["x_ignore"] == true,
    "projectName" => entry["project_name"] || entry["projectName"],
    "projectUrl" => entry["project_url"] || entry["projectUrl"],
    "repoUrl" => repo_url,
    "pies" => entry["pies"] || [],
    "notes" => entry["notes"]
  }
end

# Pretty-print the JSON and add a trailing newline for cleaner diffs.
File.write(output_file, JSON.pretty_generate(builders) + "\n")
RUBY
