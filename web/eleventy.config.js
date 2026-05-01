import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const siteUrl = process.env.ELEVENTY_SITE_URL || "https://example.com/";
const sitePathPrefix = (process.env.SITE_PATH_PREFIX || "").replace(/\/$/, "");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("sitePathPrefix", sitePathPrefix);

  eleventyConfig.addFilter("withBase", (path) => {
    if (!path) {
      return path;
    }

    if (!sitePathPrefix) {
      return path;
    }

    if (path.startsWith(sitePathPrefix + "/") || path === sitePathPrefix) {
      return path;
    }

    if (path === "/") {
      return `${sitePathPrefix}/`;
    }

    if (path.startsWith("/")) {
      return `${sitePathPrefix}${path}`;
    }

    return `${sitePathPrefix}/${path}`;
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) {
      return "Unknown";
    }

    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("readableDateTime", (dateObj) => {
    if (!dateObj) {
      return "Unknown";
    }

    return new Date(dateObj).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) {
      return "";
    }

    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    const excerpt = content.replace(/(<([^>]+)>)/gi, "");
    return excerpt.substring(0, 200) + (excerpt.length > 200 ? "..." : "");
  });

  eleventyConfig.addFilter("date", (dateObj, format) => {
    const date = new Date(dateObj);

    if (format === "YYYY") {
      return date.getFullYear().toString();
    }
    if (format === "MMM DD") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
      });
    }

    return date.toISOString();
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("json", (value, spaces = 2) =>
    JSON.stringify(value, null, spaces)
  );

  eleventyConfig.addFilter("activityForBuilder", (activity, builderId) => {
    const records = activity?.builders || [];
    return records.find((entry) => entry.id === builderId) || null;
  });

  eleventyConfig.addFilter("flattenRecentCommits", (activity) => {
    const records = activity?.builders || [];

    return records
      .flatMap((entry) =>
        (entry.recentCommits || []).map((commit) => ({
          ...commit,
          builderId: entry.id,
          builderName: entry.name || entry.id,
        }))
      )
      .sort((a, b) => new Date(b.committedAt) - new Date(a.committedAt));
  });

  eleventyConfig.addFilter("activitySummary", (builders, activity) => {
    const registry = Array.isArray(builders) ? builders : [];
    const records = activity?.builders || [];

    return {
      totalBuilders: registry.length,
      activeThisWeek: records.filter((entry) => (entry.commitsThisWeek || 0) > 0).length,
      totalCommitsThisWeek: records.reduce(
        (sum, entry) => sum + (entry.commitsThisWeek || 0),
        0
      ),
      lastUpdated: activity?.generatedAt || null,
    };
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/feed/pretty-atom-feed.xsl");

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Builder Season Playbook",
      subtitle: "Dashboard, progress log, and builder activity site",
      base: siteUrl,
      author: {
        name: "Builder Season Playbook",
      },
    },
  });
}

export const config = {
  dir: {
    input: "src",
    includes: "_includes",
    output: "_site",
  },
  templateFormats: ["md", "njk", "html"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
