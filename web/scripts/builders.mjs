import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);
const REPO_ROOT = path.dirname(WEB_DIR);
const CONFIG_FILE = path.join(REPO_ROOT, "config", "repos.yml");

function normalizeRepoPath(repoUrl) {
  return repoUrl
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "")
    .replace(/^\/+/, "");
}

function slugifyBuilder(builderName) {
  return builderName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function loadBuilders() {
  const raw = yaml.load(fs.readFileSync(CONFIG_FILE, "utf8")) || {};
  const repos = Array.isArray(raw.repos) ? raw.repos : [];

  return repos
    .filter((entry) => entry?.ignore !== true)
    .map((entry) => {
      const repoUrl = entry.repo_url || entry.url;
      if (!repoUrl) {
        return null;
      }

      const repoPath = normalizeRepoPath(repoUrl);
      const owner = repoPath.split("/")[0] || "";
      const builderName = entry.builder;
      const builderId =
        entry.id ||
        (typeof builderName === "string" ? slugifyBuilder(builderName) : null) ||
        owner;

      return {
        id: builderId,
        name: entry.name || builderName || builderId,
        github: entry.github || owner,
        x: entry.x || null,
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(loadBuilders(), null, 2)}\n`);
}
