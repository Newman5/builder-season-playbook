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
  const adminWeek1Start = isoDate(raw.admin_week_1_start || raw.build_start);
  const adminDuration = Number.parseInt(
    raw.admin_duration_weeks ?? raw.event_duration_weeks,
    10
  );
  const builderDuration = Number.parseInt(
    raw.builder_update_duration_weeks ?? 12,
    10
  );
  const validAdminDuration =
    Number.isInteger(adminDuration) && adminDuration > 0 ? adminDuration : null;
  const validBuilderDuration =
    Number.isInteger(builderDuration) && builderDuration > 0
      ? builderDuration
      : null;
  const defaultBuilderWeek1End = isoDate(raw.default_builder_week_1_end);

  return {
    eventName: raw.event_name || null,
    seasonName: raw.season_name || null,
    communityName: raw.community_name || null,
    adminWeek1Start,
    adminDurationWeeks: validAdminDuration,
    builderUpdateDurationWeeks: validBuilderDuration,
    defaultBuilderWeek1End,
    weeklyUpdateHashtags: Array.isArray(raw.weekly_update_hashtags)
      ? raw.weekly_update_hashtags
      : [],
    weeklyUpdateMention: raw.weekly_update_mention || null,
    configError: !adminWeek1Start
      ? "INVALID_ADMIN_WEEK_1_START"
      : !validAdminDuration
        ? "INVALID_ADMIN_DURATION_WEEKS"
        : !validBuilderDuration
          ? "INVALID_BUILDER_UPDATE_DURATION_WEEKS"
          : !defaultBuilderWeek1End
            ? "INVALID_DEFAULT_BUILDER_WEEK_1_END"
            : null,
  };
}
