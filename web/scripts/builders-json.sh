#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${WEB_DIR}/.." && pwd)"
CONFIG_FILE="${REPO_ROOT}/config/repos.yml"
OUTPUT_FILE="${WEB_DIR}/src/_data/builders.json"

mkdir -p "$(dirname "${OUTPUT_FILE}")"

CONFIG_FILE="${CONFIG_FILE}" OUTPUT_FILE="${OUTPUT_FILE}" ruby <<'RUBY'
require "json"
require "yaml"

config_file = ENV.fetch("CONFIG_FILE")
output_file = ENV.fetch("OUTPUT_FILE")
raw = YAML.load_file(config_file) || {}
repos = raw.fetch("repos", [])

builders = repos.filter_map do |entry|
  next if entry["ignore"] == true

  repo_url = entry["repo_url"] || entry["url"]
  next unless repo_url

  repo_path = repo_url.sub(%r{\Ahttps?://github\.com/}, "").sub(%r{\Agit@github\.com:}, "").sub(/\.git\z/, "").sub(%r{\A/}, "")
  owner = repo_path.split("/")[0]

  id = entry["id"] || entry["builder"]&.downcase&.gsub(/[^a-z0-9]+/, "-") || owner
  name = entry["name"] || entry["builder"] || id
  github = entry["github"] || owner

  {
    "id" => id,
    "name" => name,
    "github" => github,
    "x" => entry["x"],
    "projectName" => entry["project_name"] || entry["projectName"],
    "projectUrl" => entry["project_url"] || entry["projectUrl"],
    "repoUrl" => repo_url,
    "pies" => entry["pies"] || [],
    "notes" => entry["notes"]
  }
end

File.write(output_file, JSON.pretty_generate(builders) + "\n")
RUBY
