import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadBuilders } from "./builders.mjs";
import { loadEvent } from "./event.mjs";
import { generateActivitySnapshotForWindow } from "./generate-activity.mjs";
import { loadProjectMetadataSnapshot, metadataRecordMap } from "./project-metadata.mjs";
import { loadReposConfig } from "./registry.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);
const OUTPUT_FILE = path.join(WEB_DIR, "src", "_data", "impact.json");

function toWindowStart(date) {
  return `${date}T00:00:00Z`;
}

function toWindowEnd(date) {
  return `${date}T23:59:59Z`;
}

function emptyPieStats() {
  return {
    projects: 0,
    activeProjects: 0,
    inactiveProjects: 0,
    unknownProjects: 0,
    commits: 0,
    projectsWithFetchErrors: 0,
  };
}

function displayPieName(pie) {
  const names = {
    builders: "Builders Pie",
    cardano: "Cardano Pie",
    feedback: "Feedback Pie",
    "real-user": "Real User Pie",
  };

  return names[pie] || pie;
}

function countDemoOrWebsite(builders) {
  return builders.filter((builder) => builder.demoUrl || builder.websiteUrl || builder.projectUrl).length;
}

function buildPieStats(builders, activityById) {
  const pieStats = new Map();

  for (const builder of builders) {
    const activity = activityById.get(builder.id) || {};
    const commits = activity.commitsThisWeek || 0;
    const hasFetchError = !!activity.error;
    const isActive = commits > 0;

    for (const pie of builder.pies || []) {
      if (!pieStats.has(pie)) {
        pieStats.set(pie, emptyPieStats());
      }

      const stats = pieStats.get(pie);
      stats.projects += 1;
      stats.commits += commits;
      if (hasFetchError) {
        stats.projectsWithFetchErrors += 1;
      }
      if (isActive) {
        stats.activeProjects += 1;
      } else if (hasFetchError) {
        stats.unknownProjects += 1;
      } else {
        stats.inactiveProjects += 1;
      }
    }
  }

  return [...pieStats.entries()]
    .map(([id, stats]) => ({
      id,
      name: displayPieName(id),
      ...stats,
    }))
    .sort((a, b) => b.projects - a.projects || a.name.localeCompare(b.name));
}

function buildProjectRows(builders, activityById) {
  return builders
    .map((builder) => {
      const activity = activityById.get(builder.id) || {};
      const commits = activity.commitsThisWeek || 0;
      const hasFetchError = !!activity.error;
      const activityStatus = commits > 0
        ? hasFetchError
          ? "active (partial)"
          : "active"
        : hasFetchError
          ? "unknown"
          : "inactive";

      return {
        id: builder.id,
        builderName: builder.name,
        projectName: builder.projectName || "Not listed",
        repoUrl: builder.repoUrl || null,
        projectUrl: builder.projectUrl || null,
        demoUrl: builder.demoUrl || null,
        websiteUrl: builder.websiteUrl || null,
        pies: builder.pies || [],
        commits,
        lastActivityAt: activity.lastActivityAt || null,
        activityStatus,
        error: activity.error || null,
      };
    })
    .sort((a, b) => b.commits - a.commits || a.builderName.localeCompare(b.builderName));
}

export async function generateImpactSummary() {
  const event = loadEvent();
  const rawConfig = loadReposConfig();
  const registry = Array.isArray(rawConfig.repos) ? rawConfig.repos : [];
  const builders = loadBuilders();
  const metadataById = metadataRecordMap(loadProjectMetadataSnapshot());

  const windowStartDate = event.adminWeek1Start;
  const windowEndDate = event.buildEnd;
  const activity = await generateActivitySnapshotForWindow({
    builders,
    windowStart: toWindowStart(windowStartDate),
    windowEnd: toWindowEnd(windowEndDate),
  });
  const activityById = new Map(activity.builders.map((record) => [record.id, record]));
  const activeProjects = activity.builders.filter((record) => (record.commitsThisWeek || 0) > 0).length;
  const unknownProjects = activity.builders.filter(
    (record) => (record.commitsThisWeek || 0) === 0 && !!record.error
  ).length;
  const projectsWithFetchErrors = activity.builders.filter((record) => !!record.error).length;
  const projectsWithPartialCommitCounts = activity.builders.filter(
    (record) => !!record.error && (record.commitsThisWeek || 0) > 0
  ).length;
  const totalCommits = activity.builders.reduce(
    (sum, record) => sum + (record.commitsThisWeek || 0),
    0
  );
  const pieStats = buildPieStats(builders, activityById);
  const cardanoPie = pieStats.find((pie) => pie.id === "cardano") || {
    id: "cardano",
    name: "Cardano Pie",
    ...emptyPieStats(),
  };

  return {
    generatedAt: activity.generatedAt,
    reportWindow: {
      start: windowStartDate,
      end: windowEndDate,
      startDateTime: activity.weekStart,
      endDateTime: activity.weekEnd,
    },
    sponsor: {
      primary: event.sponsoredTrackSponsor || "Cardano Foundation",
      trackName: event.sponsoredTrackName || "Cardano Pie",
    },
    totals: {
      registeredProjects: registry.length,
      publishedProjects: builders.length,
      registryInactiveProjects: registry.filter((entry) => entry?.active === false).length,
      githubActiveProjects: activeProjects,
      githubInactiveProjects: builders.length - activeProjects - unknownProjects,
      githubUnknownProjects: unknownProjects,
      fullSeasonCommits: totalCommits,
      projectsWithActivityFetchErrors: projectsWithFetchErrors,
      projectsWithPartialCommitCounts,
      fullSeasonCommitCountIncomplete: projectsWithFetchErrors > 0,
      projectsWithProjectMetadata: builders.filter((builder) => metadataById.get(builder.id)?.found === true).length,
      projectsWithDemoOrWebsite: countDemoOrWebsite(builders),
    },
    cardano: {
      projects: cardanoPie.projects,
      activeProjects: cardanoPie.activeProjects,
      inactiveProjects: cardanoPie.inactiveProjects,
      unknownProjects: cardanoPie.unknownProjects,
      commits: cardanoPie.commits,
      projectsWithFetchErrors: cardanoPie.projectsWithFetchErrors,
      projectsWithDemoOrWebsite: builders.filter(
        (builder) =>
          (builder.pies || []).includes("cardano") &&
          (builder.demoUrl || builder.websiteUrl || builder.projectUrl)
      ).length,
    },
    pies: pieStats,
    projects: buildProjectRows(builders, activityById),
    activity,
  };
}

export function writeImpactSummary(snapshot) {
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeImpactSummary(await generateImpactSummary());
}
