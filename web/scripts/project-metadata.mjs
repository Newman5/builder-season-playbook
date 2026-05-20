import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

import {
  REPOS_CONFIG_FILE,
  loadBaseBuilders,
  loadReposConfig,
  normalizeRepoPath,
  stripAtPrefix,
} from "./registry.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);
const OUTPUT_FILE = path.join(
  WEB_DIR,
  "src",
  "_data",
  "project-metadata.json"
);
const TOKEN = process.env.GH_ACTIVITY_TOKEN || process.env.GITHUB_TOKEN || "";

function cleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function cleanIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

function normalizeUpdates(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const week = Number.parseInt(entry.week, 10);

      return {
        week: Number.isInteger(week) && week > 0 ? week : null,
        date: cleanIsoDate(entry.date),
        xUrl: cleanString(entry.x_url || entry.xUrl),
        summary: cleanString(entry.summary),
      };
    })
    .filter((entry) => entry && (entry.week || entry.date || entry.summary));
}

function normalizeProjectDocument(raw, fallbackRepoUrl = null) {
  const project = raw && typeof raw === "object" ? raw : {};
  const builder = project.builder && typeof project.builder === "object"
    ? project.builder
    : {};
  const demoUrl = cleanString(project.demo_url || project.demoUrl);
  const websiteUrl = cleanString(project.website_url || project.websiteUrl);

  return {
    projectId: cleanString(project.id),
    projectName: cleanString(project.name),
    tagline: cleanString(project.tagline),
    builderName: cleanString(builder.name),
    builderGithub: cleanString(
      builder.github_handle || builder.githubHandle || builder.github
    ),
    builderXHandle: stripAtPrefix(cleanString(builder.x_handle || builder.xHandle)),
    repoUrl: cleanString(project.repo_url || project.repoUrl) || fallbackRepoUrl,
    demoUrl,
    websiteUrl,
    projectUrl: demoUrl || websiteUrl || null,
    status: cleanString(project.status),
    updates: normalizeUpdates(project.updates),
  };
}

function statusToError(status) {
  if (status === 404) {
    return "NOT_FOUND";
  }
  if (status === 403) {
    return "RATE_LIMITED";
  }
  if (status === 409) {
    return "REPO_NOT_FOUND";
  }
  if (!status) {
    return "NETWORK_ERROR";
  }
  if (status >= 200 && status < 300) {
    return null;
  }
  return `API_ERROR_${status}`;
}

async function githubRequest(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "builder-season-project-metadata-script",
  };

  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  return fetch(url, { headers });
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

async function fetchProjectMetadataForBuilder(builder) {
  if (!builder.repoUrl) {
    return {
      builderId: builder.id,
      repoUrl: null,
      fetchedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      found: false,
      error: "MISSING_REPO_URL",
      project: null,
    };
  }

  const repoPath = normalizeRepoPath(builder.repoUrl);
  if (!repoPath || !repoPath.includes("/")) {
    return {
      builderId: builder.id,
      repoUrl: builder.repoUrl,
      fetchedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      found: false,
      error: "MISSING_REPO_URL",
      project: null,
    };
  }

  const url = `https://api.github.com/repos/${repoPath}/contents/project.yml`;
  const fetchedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const result = await fetchJson(url);

  if (!result.ok) {
    return {
      builderId: builder.id,
      repoUrl: builder.repoUrl,
      fetchedAt,
      found: false,
      error: statusToError(result.status),
      project: null,
    };
  }

  const content = cleanString(result.data?.content);
  const encoding = cleanString(result.data?.encoding);
  if (!content || encoding !== "base64") {
    return {
      builderId: builder.id,
      repoUrl: builder.repoUrl,
      fetchedAt,
      found: false,
      error: "INVALID_CONTENT_RESPONSE",
      project: null,
    };
  }

  const decoded = Buffer.from(content, "base64").toString("utf8");
  let parsed = null;

  try {
    parsed = yaml.load(decoded) || {};
  } catch {
    return {
      builderId: builder.id,
      repoUrl: builder.repoUrl,
      fetchedAt,
      found: true,
      error: "INVALID_YAML",
      project: null,
    };
  }

  return {
    builderId: builder.id,
    repoUrl: builder.repoUrl,
    fetchedAt,
    found: true,
    error: null,
    project: normalizeProjectDocument(parsed, builder.repoUrl),
  };
}

export function loadProjectMetadataSnapshot() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return { generatedAt: null, builders: [] };
  }

  try {
    const raw = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
    return {
      generatedAt: raw?.generatedAt || null,
      builders: Array.isArray(raw?.builders) ? raw.builders : [],
    };
  } catch {
    return { generatedAt: null, builders: [] };
  }
}

export function metadataRecordMap(snapshot = loadProjectMetadataSnapshot()) {
  const records = Array.isArray(snapshot?.builders) ? snapshot.builders : [];
  return new Map(records.map((record) => [record.builderId, record]));
}

export function mergeBuilderWithProjectMetadata(builder, record) {
  const project = record?.project;
  const merged = {
    ...builder,
    projectMetadataFound: record?.found === true && !!project,
    projectMetadataError: record?.error || null,
  };

  if (!project) {
    return merged;
  }

  return {
    ...merged,
    name: project.builderName || builder.name,
    github: project.builderGithub || builder.github,
    x: project.builderXHandle || builder.x,
    projectId: project.projectId || null,
    projectName: project.projectName || builder.projectName,
    tagline: project.tagline || null,
    projectUrl: project.projectUrl || builder.projectUrl,
    repoUrl: project.repoUrl || builder.repoUrl,
    demoUrl: project.demoUrl || null,
    websiteUrl: project.websiteUrl || null,
    status: project.status || null,
    updates: project.updates || [],
  };
}

export async function generateProjectMetadataSnapshot() {
  const builders = loadBaseBuilders();
  const records = [];

  for (const builder of builders) {
    records.push(await fetchProjectMetadataForBuilder(builder));
  }

  return {
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    builders: records,
  };
}

export function writeProjectMetadataSnapshot(snapshot) {
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

function syncValue(target, key, nextValue, changes) {
  const normalizedNext = nextValue || null;
  const current = target[key] ?? null;

  if (current === normalizedNext) {
    return;
  }

  if (normalizedNext === null) {
    delete target[key];
  } else {
    target[key] = normalizedNext;
  }

  changes.push({ field: key, before: current, after: normalizedNext });
}

export function syncReposConfigFromProjectMetadata() {
  const snapshot = loadProjectMetadataSnapshot();
  const byId = metadataRecordMap(snapshot);
  const rawConfig = loadReposConfig();
  const repos = Array.isArray(rawConfig.repos) ? rawConfig.repos : [];
  const report = {
    scanned: repos.length,
    validMetadata: 0,
    skipped: [],
    changedBuilders: [],
    wroteFile: false,
  };

  for (const entry of repos) {
    const builderId = entry?.id || null;
    if (!builderId) {
      report.skipped.push({ id: null, reason: "MISSING_ID" });
      continue;
    }

    const record = byId.get(builderId);
    if (!record) {
      report.skipped.push({ id: builderId, reason: "NO_FETCH_RECORD" });
      continue;
    }

    if (!record.project || record.error) {
      report.skipped.push({ id: builderId, reason: record.error || "NO_PROJECT" });
      continue;
    }

    report.validMetadata += 1;
    const changes = [];
    const project = record.project;

    syncValue(entry, "name", project.builderName, changes);
    syncValue(entry, "github", project.builderGithub, changes);
    syncValue(entry, "x", project.builderXHandle, changes);
    syncValue(entry, "project_name", project.projectName, changes);
    syncValue(entry, "project_url", project.projectUrl, changes);
    syncValue(entry, "repo_url", project.repoUrl, changes);

    if (changes.length > 0) {
      report.changedBuilders.push({ id: builderId, changes });
    }
  }

  if (report.changedBuilders.length > 0) {
    fs.writeFileSync(
      REPOS_CONFIG_FILE,
      yaml.dump(rawConfig, {
        noRefs: true,
        lineWidth: -1,
        sortKeys: false,
      }),
      "utf8"
    );
    report.wroteFile = true;
  }

  return report;
}

function formatSyncValue(value) {
  return value === null || value === undefined || value === "" ? "(empty)" : `${value}`;
}

export function printSyncReport(report) {
  process.stdout.write(`Scanned builders: ${report.scanned}\n`);
  process.stdout.write(`Builders with valid project metadata: ${report.validMetadata}\n`);
  process.stdout.write(`Builders updated: ${report.changedBuilders.length}\n`);
  process.stdout.write(`Builders skipped: ${report.skipped.length}\n`);

  if (report.changedBuilders.length > 0) {
    process.stdout.write("\nUpdated builders:\n");
    for (const builder of report.changedBuilders) {
      process.stdout.write(`- ${builder.id}\n`);
      for (const change of builder.changes) {
        process.stdout.write(
          `  ${change.field}: ${formatSyncValue(change.before)} -> ${formatSyncValue(change.after)}\n`
        );
      }
    }
  }

  if (report.skipped.length > 0) {
    process.stdout.write("\nSkipped builders:\n");
    for (const skipped of report.skipped) {
      process.stdout.write(`- ${skipped.id || "(missing id)"}: ${skipped.reason}\n`);
    }
  }

  if (!report.wroteFile) {
    process.stdout.write("\nNo config/repos.yml changes were written.\n");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const snapshot = await generateProjectMetadataSnapshot();
  writeProjectMetadataSnapshot(snapshot);
}
