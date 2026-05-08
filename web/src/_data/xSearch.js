import { loadBuilders } from "../../scripts/builders.mjs";
import { loadEvent } from "../../scripts/event.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Date(date.getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

function displayRange(startDate, endDateExclusive) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${addDays(endDateExclusive, -1)}T00:00:00Z`);
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${fmt.format(start)} to ${fmt.format(end)}`;
}

function inclusiveEndDate(endDateExclusive) {
  return addDays(endDateExclusive, -1);
}

function weekDiff(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  return Math.round((end.getTime() - start.getTime()) / DAY_MS / 7);
}

function buildSearchUrl({ hashtags, mention, handle, since, until }) {
  const terms = [];

  for (const hashtag of hashtags) {
    terms.push(`(${hashtag})`);
  }

  if (handle) {
    terms.push(`(from:${handle})`);
  }

  if (mention) {
    terms.push(`(${mention})`);
  }

  terms.push(`until:${until}`);
  terms.push(`since:${since}`);

  return `https://x.com/search?f=live&q=${encodeURIComponent(
    terms.join(" ")
  )}&src=typed_query`;
}

export default function () {
  const event = loadEvent();
  const builders = loadBuilders();
  const activeBuilders = builders.filter((builder) => builder.xIgnore !== true);

  if (event.configError) {
    return {
      ...event,
      weeks: [],
      builders: activeBuilders.map((builder) => ({
        id: builder.id,
        name: builder.name,
        xHandle: builder.x || null,
        searchUrl: null,
        weeks: [],
      })),
    };
  }

  const weeks = Array.from({ length: event.adminDurationWeeks }, (_, index) => {
    const startDate = addDays(event.adminWeek1Start, index * 7);
    const endDateExclusive = addDays(startDate, 7);
    return {
      index: index + 1,
      startDate,
      endDateExclusive,
      endDateInclusive: inclusiveEndDate(endDateExclusive),
      label: `Week ${index + 1}`,
      dateRangeLabel: displayRange(startDate, endDateExclusive),
      searchUrl: buildSearchUrl({
        hashtags: event.weeklyUpdateHashtags,
        mention: event.weeklyUpdateMention,
        handle: null,
        since: startDate,
        until: endDateExclusive,
      }),
    };
  });

  const today = new Date().toISOString().slice(0, 10);
  const currentWeek =
    weeks.find(
      (week) => week.startDate <= today && today < week.endDateExclusive
    ) || null;

  return {
    ...event,
    currentAdminWeekIndex: currentWeek?.index || null,
    weeks,
    builders: activeBuilders.map((builder) => {
      const hashtags =
        builder.xRequiredHashtags?.length > 0
          ? builder.xRequiredHashtags
          : event.weeklyUpdateHashtags;
      const mention = builder.xRequiredMention || event.weeklyUpdateMention;
      const firstUpdateWeekEnd = builder.firstUpdateWeekEnd || null;
      const firstUpdateWeekStart = firstUpdateWeekEnd
        ? addDays(firstUpdateWeekEnd, -6)
        : null;
      const firstAdminWeekIndex =
        firstUpdateWeekStart && firstUpdateWeekStart >= event.adminWeek1Start
          ? weekDiff(event.adminWeek1Start, firstUpdateWeekStart) + 1
          : null;
      const finalPresentationWeekEnd = firstUpdateWeekEnd
        ? addDays(
            firstUpdateWeekEnd,
            (event.builderUpdateDurationWeeks - 1) * 7
          )
        : null;

      return {
        id: builder.id,
        name: builder.name,
        xHandle: builder.x || null,
        firstUpdateWeekStart,
        firstUpdateWeekEnd,
        firstAdminWeekIndex,
        builderUpdateDurationWeeks: event.builderUpdateDurationWeeks,
        finalPresentationWeekEnd,
        searchUrl: builder.x
          ? buildSearchUrl({
              hashtags,
              mention,
              handle: builder.x,
              since: event.adminWeek1Start,
              until: weeks.at(-1).endDateExclusive,
            })
          : null,
        weeks: weeks.map((week) => ({
          ...week,
          builderWeekIndex:
            firstAdminWeekIndex && week.index >= firstAdminWeekIndex
              ? week.index - firstAdminWeekIndex + 1
              : null,
          builderWeekLabel:
            firstAdminWeekIndex && week.index >= firstAdminWeekIndex
              ? `Builder Week ${week.index - firstAdminWeekIndex + 1}`
              : null,
          searchUrl: builder.x
            ? buildSearchUrl({
                hashtags,
                mention,
                handle: builder.x,
                since: week.startDate,
                until: week.endDateExclusive,
              })
            : null,
        })),
      };
    }),
  };
}
