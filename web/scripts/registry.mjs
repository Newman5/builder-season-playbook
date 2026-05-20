import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);
export const REPO_ROOT = path.dirname(WEB_DIR);
export const REPOS_CONFIG_FILE = path.join(REPO_ROOT, "config", "repos.yml");

export function normalizeRepoPath(repoUrl) {
  return repoUrl
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "")
    .replace(/^\/+/, "");
}

export function slugifyBuilder(builderName) {
  return builderName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function stripAtPrefix(value) {
  return typeof value === "string" ? value.replace(/^@+/, "") : null;
}

export function loadReposConfig() {
  return yaml.load(fs.readFileSync(REPOS_CONFIG_FILE, "utf8")) || {};
}

export function loadBaseBuilders() {
  const raw = loadReposConfig();
  const repos = Array.isArray(raw.repos) ? raw.repos : [];

  return repos
    .filter((entry) => entry?.active !== false)
    .map((entry) => {
      const repoUrl = entry.repo_url || entry.url;
      if (!repoUrl) {
        return null;
      }

      const repoPath = normalizeRepoPath(repoUrl);
      const owner = repoPath.split("/")[0] || "";
      const builderName = entry.builder || entry.name;
      const builderId =
        entry.id ||
        (typeof builderName === "string" ? slugifyBuilder(builderName) : null) ||
        owner;

      return {
        id: builderId,
        name: entry.name || builderName || builderId,
        github: entry.github || owner,
        x: stripAtPrefix(entry.x) || null,
        firstUpdateWeekEnd:
          entry.first_update_week_end || entry.firstUpdateWeekEnd || null,
        xRequiredHashtags:
          entry.x_required_hashtags || entry.xRequiredHashtags || [],
        xRequiredMention:
          entry.x_required_mention || entry.xRequiredMention || null,
        xIgnore: entry.x_ignore === true,
        projectName: entry.project_name || entry.projectName || null,
        projectUrl: entry.project_url || entry.projectUrl || null,
        repoUrl,
        pies: entry.pies || [],
        notes: entry.notes || null,
      };
    })
    .filter(Boolean);
}
