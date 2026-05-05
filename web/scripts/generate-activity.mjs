import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadBuilders } from "./builders.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);
const OUTPUT_FILE = path.join(WEB_DIR, "src", "_data", "activity.json");
const TOKEN = process.env.GH_ACTIVITY_TOKEN || process.env.GITHUB_TOKEN || "";

function startOfUtcDay(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function currentWeekWindow() {
  const now = new Date();
  const todayMidnight = startOfUtcDay(now);
  const weekday = now.getUTCDay() === 0 ? 7 : now.getUTCDay();
  const weekStartEpoch = todayMidnight - (weekday - 1) * 86400_000;
  const weekEndEpoch = weekStartEpoch + 7 * 86400_000 - 1000;

  return {
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    weekStart: new Date(weekStartEpoch).toISOString().replace(/\.\d{3}Z$/, "Z"),
    weekEnd: new Date(weekEndEpoch).toISOString().replace(/\.\d{3}Z$/, "Z"),
  };
}

function normalizeRepo(repoInput) {
  return repoInput
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/^http:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "")
    .replace(/^\/+/, "");
}

function statusToError(status) {
  if (status === 404) {
    return "REPO_NOT_FOUND";
  }
  if (status === 409) {
    return "EMPTY_REPO_OR_NO_COMMITS";
  }
  if (status === 403) {
    return "FORBIDDEN_OR_RATE_LIMITED";
  }
  if (!status) {
    return "NETWORK_ERROR";
  }
  if (status >= 200 && status < 300) {
    return "";
  }
  return `API_ERROR_${status}`;
}

async function githubRequest(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "builder-season-activity-script",
  };

  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const response = await fetch(url, { headers });
  return response;
}

async function fetchJson(url) {
  let response;

  try {
    response = await githubRequest(url);
  } catch {
    return { ok: false, status: 0, data: null };
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
}

function summarizeRecentCommits(repo, commits) {
  if (!Array.isArray(commits)) {
    return [];
  }

  return commits.slice(0, 5).map((commit) => ({
    repo,
    message: commit?.commit?.message || "",
    url: commit?.html_url || null,
    committedAt: commit?.commit?.author?.date || null,
  }));
}

async function fetchBuilderActivity(builder, weekStart, weekEnd) {
  const repoUrl = builder.repoUrl || "";
  const repo = normalizeRepo(repoUrl);

  if (!repo || !repo.includes("/")) {
    return {
      id: builder.id,
      name: builder.name,
      lastActivityAt: null,
      commitsThisWeek: 0,
      recentCommits: [],
      error: "INVALID_REPO_URL",
    };
  }

  let totalCommits = 0;
  let page = 1;
  let lastActivityAt = null;
  let error = "";
  let recentCommits = [];

  while (true) {
    const apiUrl = `https://api.github.com/repos/${repo}/commits?since=${weekStart}&until=${weekEnd}&per_page=100&page=${page}`;
    const result = await fetchJson(apiUrl);

    if (!result.ok) {
      error = statusToError(result.status);
      break;
    }

    const commits = Array.isArray(result.data) ? result.data : [];
    totalCommits += commits.length;

    if (page === 1) {
      lastActivityAt = commits[0]?.commit?.author?.date || null;
      recentCommits = summarizeRecentCommits(repo, commits);
    }

    if (commits.length < 100) {
      break;
    }

    page += 1;
  }

  if (!lastActivityAt && !error) {
    const latestUrl = `https://api.github.com/repos/${repo}/commits?per_page=1`;
    const result = await fetchJson(latestUrl);
    if (result.ok && Array.isArray(result.data)) {
      lastActivityAt = result.data[0]?.commit?.author?.date || null;
    }
  }

  return {
    id: builder.id,
    name: builder.name,
    lastActivityAt,
    commitsThisWeek: totalCommits,
    recentCommits,
    error: error || null,
  };
}

export async function generateActivitySnapshot() {
  const builders = loadBuilders();
  const { generatedAt, weekStart, weekEnd } = currentWeekWindow();

  const records = [];
  for (const builder of builders) {
    records.push(await fetchBuilderActivity(builder, weekStart, weekEnd));
  }

  return {
    generatedAt,
    weekStart,
    weekEnd,
    builders: records,
  };
}

async function main() {
  const snapshot = await generateActivitySnapshot();
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
