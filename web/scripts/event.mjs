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
  const numberValue = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const builderPrizePool = numberValue(raw.builder_prize_pool);
  const sponsoredTrackPrizePool = numberValue(raw.sponsored_track_prize_pool);
  const realUserPrizePool = numberValue(raw.real_user_prize_pool);
  const feedbackPrizePool = numberValue(raw.feedback_prize_pool);

  return {
    eventName: raw.event_name || null,
    seasonName: raw.season_name || null,
    communityName: raw.community_name || null,
    tagline: raw.tagline || null,
    enrollmentStart: isoDate(raw.enrollment_start),
    enrollmentEnd: isoDate(raw.enrollment_end),
    buildEnd: isoDate(raw.build_end),
    finalPresentationStart: isoDate(raw.final_presentation_start),
    finalPresentationEnd: isoDate(raw.final_presentation_end),
    payoutStart: isoDate(raw.payout_start),
    payoutEnd: isoDate(raw.payout_end),
    adminWeek1Start,
    adminDurationWeeks: validAdminDuration,
    builderUpdateDurationWeeks: validBuilderDuration,
    defaultBuilderWeek1End,
    rewardCurrency: raw.reward_currency || null,
    builderPrizePool,
    sponsoredTrackPrizePool,
    sponsoredTrackName: raw.sponsored_track_name || null,
    sponsoredTrackSponsor: raw.sponsored_track_sponsor || null,
    realUserPrizePool,
    feedbackPrizePool,
    totalParticipantRewards:
      builderPrizePool + sponsoredTrackPrizePool + realUserPrizePool + feedbackPrizePool,
    registrationFormUrl: raw.registration_form_url || null,
    websiteUrl: raw.website_url || null,
    discordUrl: raw.discord_url || null,
    discordFeedbackChannelUrl: raw.discord_feedback_channel_url || null,
    discordDiscussionChannelUrl: raw.discord_discussion_channel_url || null,
    githubOrgUrl: raw.github_org_url || null,
    twitterHandle: raw.twitter_handle || null,
    sponsorNames: Array.isArray(raw.sponsor_names) ? raw.sponsor_names : [],
    maxFeedbackCreditsPerParticipant: numberValue(
      raw.max_feedback_credits_per_participant
    ),
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
