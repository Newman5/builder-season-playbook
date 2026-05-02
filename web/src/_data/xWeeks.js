import fs from "node:fs";

export default function () {
  const file = new URL("./x-weeks.json", import.meta.url);

  if (!fs.existsSync(file)) {
    return {
      generatedAt: null,
      buildStart: null,
      eventDurationWeeks: 0,
      configError: "MISSING_X_WEEKS_FILE",
      weeks: [],
      builders: [],
    };
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}
