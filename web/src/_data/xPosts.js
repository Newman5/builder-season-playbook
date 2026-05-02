import fs from "node:fs";

export default function () {
  const file = new URL("./x-posts.json", import.meta.url);

  if (!fs.existsSync(file)) {
    return {
      generatedAt: null,
      sourceType: "manual_yaml",
      buildStart: null,
      eventDurationWeeks: 0,
      configError: "MISSING_X_POSTS_FILE",
      defaultHashtags: [],
      defaultMention: null,
      builders: [],
      posts: [],
    };
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}
