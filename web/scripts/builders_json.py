#!/usr/bin/env python3

"""
Generate the normalized builder registry JSON used by the Eleventy site.

This script reads config/repos.yml from the repo root and writes the
frontend-friendly builder list to web/src/_data/builders.json.
"""

import json
import re
from pathlib import Path

import yaml


# Find important directories relative to this script's location.
# This keeps the script working no matter where it is run from.
SCRIPT_DIR = Path(__file__).resolve().parent
WEB_DIR = SCRIPT_DIR.parent
REPO_ROOT = WEB_DIR.parent

# Source config and output paths.
# repos.yml is the canonical input; builders.json is generated for the site.
CONFIG_FILE = REPO_ROOT / "config" / "repos.yml"
OUTPUT_FILE = WEB_DIR / "src" / "_data" / "builders.json"


def normalize_repo_path(repo_url: str) -> str:
    """Convert supported GitHub URL formats into an owner/repo path."""
    repo_path = re.sub(r"^https?://github\.com/", "", repo_url)
    repo_path = re.sub(r"^git@github\.com:", "", repo_path)
    repo_path = re.sub(r"\.git$", "", repo_path)
    return repo_path.lstrip("/")


def slugify_builder(builder_name: str) -> str:
    """Match the existing builder-to-id slug behavior from the Ruby script."""
    return re.sub(r"[^a-z0-9]+", "-", builder_name.lower())


def main() -> None:
    # Ensure the destination folder exists before writing the JSON file.
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Load the YAML config.
    # Default to an empty object so missing/blank files do not crash the script.
    raw = yaml.safe_load(CONFIG_FILE.read_text(encoding="utf-8")) or {}

    # Pull out the repo list. If the key is missing, use an empty list.
    repos = raw.get("repos", [])

    builders = []

    # Convert each repo entry into one normalized builder record for the site.
    for entry in repos:
        # Skip repos explicitly marked to ignore in repos.yml.
        if entry.get("ignore") is True:
            continue

        # Support either repo_url or url in the config for backwards compatibility.
        repo_url = entry.get("repo_url") or entry.get("url")

        # If there is no repo URL, we cannot build a builder record.
        if not repo_url:
            continue

        # Normalize GitHub URLs into an owner/repo-style path.
        # Examples:
        # https://github.com/foo/bar.git -> foo/bar
        # git@github.com:foo/bar.git    -> foo/bar
        repo_path = normalize_repo_path(repo_url)

        # Use the GitHub owner as a fallback identity source.
        owner = repo_path.split("/")[0]

        # Build stable display fields with fallback rules:
        # - id prefers explicit config, then a slugified builder name, then owner
        # - name prefers explicit config, then builder, then id
        # - github prefers explicit config, then owner
        builder_name = entry.get("builder")
        builder_id = entry.get("id") or (
            slugify_builder(builder_name) if isinstance(builder_name, str) else None
        ) or owner
        name = entry.get("name") or builder_name or builder_id
        github = entry.get("github") or owner

        # Emit the frontend-friendly builder shape.
        # Each field also tolerates both snake_case and camelCase config keys
        # where the repo config currently contains both styles.
        builders.append(
            {
                "id": builder_id,
                "name": name,
                "github": github,
                "x": entry.get("x"),
                "xRequiredHashtags": entry.get("x_required_hashtags")
                or entry.get("xRequiredHashtags")
                or [],
                "xRequiredMention": entry.get("x_required_mention")
                or entry.get("xRequiredMention"),
                "xIgnore": entry.get("x_ignore") is True,
                "projectName": entry.get("project_name") or entry.get("projectName"),
                "projectUrl": entry.get("project_url") or entry.get("projectUrl"),
                "repoUrl": repo_url,
                "pies": entry.get("pies") or [],
                "notes": entry.get("notes"),
            }
        )

    # Pretty-print the JSON and add a trailing newline for cleaner diffs.
    OUTPUT_FILE.write_text(
        json.dumps(builders, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
