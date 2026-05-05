import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);
const REPO_ROOT = path.dirname(WEB_DIR);
const CONFIG_FILE = path.join(REPO_ROOT, "config", "event.yml");

function isoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

export function loadEvent() {
  const raw = yaml.load(fs.readFileSync(CONFIG_FILE, "utf8")) || {};
  const buildStart = isoDate(raw.build_start);
  const duration = Number.parseInt(raw.event_duration_weeks, 10);
  const validDuration = Number.isInteger(duration) && duration > 0 ? duration : null;

  return {
    eventName: raw.event_name || null,
    communityName: raw.community_name || null,
    buildStart,
    eventDurationWeeks: validDuration,
    weeklyUpdateHashtags: Array.isArray(raw.weekly_update_hashtags)
      ? raw.weekly_update_hashtags
      : [],
    weeklyUpdateMention: raw.weekly_update_mention || null,
    configError: !buildStart
      ? "INVALID_BUILD_START"
      : !validDuration
        ? "INVALID_EVENT_DURATION_WEEKS"
        : null,
  };
}
