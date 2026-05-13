import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.dirname(SCRIPT_DIR);

function usage() {
  console.error(
    [
      "Usage: node ./scripts/create-post.mjs --title \"Post Title\" [options]",
      "",
      "Options:",
      "  --author <name>     Front matter author value",
      "  --summary <text>    Short summary to seed the body",
      "  --body <markdown>   Full markdown body override",
      "  --date <YYYY-MM-DD> Override the post date",
      "  --dry-run           Print target paths and content without writing",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const args = {
    author: "Newman with Codex",
    body: "",
    date: "",
    dryRun: false,
    summary: "",
    title: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      continue;
    }

    const value = argv[index + 1];
    if (value === undefined) {
      throw new Error(`Missing value for ${arg}`);
    }

    if (arg === "--title") {
      args.title = value;
    } else if (arg === "--author") {
      args.author = value;
    } else if (arg === "--summary") {
      args.summary = value;
    } else if (arg === "--body") {
      args.body = value;
    } else if (arg === "--date") {
      args.date = value;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }

    index += 1;
  }

  return args;
}

function cleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeDate(value) {
  const candidate = cleanString(value);
  if (candidate) {
    return candidate;
  }

  return new Date().toISOString().slice(0, 10);
}

function buildBody({ summary, body }) {
  const fullBody = cleanString(body);
  if (fullBody) {
    return `${fullBody}\n`;
  }

  const intro = cleanString(summary) || "Write today's Builder Season update here.";

  return [
    `${intro}`,
    "",
    "## What Changed",
    "",
    "- Capture the main implementation work here.",
    "- Link any relevant files, pages, or commands.",
    "",
    "## Notes",
    "",
    "Add follow-up context, open questions, or verification notes.",
    "",
  ].join("\n");
}

function buildFrontMatter({ title, date, author }) {
  return [
    "---",
    `title: "${title}"`,
    `date: ${date}`,
    `author: "${author}"`,
    "tags:",
    "  - blog",
    "layout: post.njk",
    "og_image: /images/og/11ty-blog-OG-default.jpg",
    "---",
    "",
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const title = cleanString(args.title);

  if (!title) {
    usage();
    process.exitCode = 1;
    return;
  }

  const date = normalizeDate(args.date);
  const slug = slugify(title);

  if (!slug) {
    throw new Error("Could not derive a valid slug from the title");
  }

  const filename = path.join(WEB_DIR, "src", "posts", `${date}-${slug}.md`);
  const imageDir = path.join(WEB_DIR, "src", "images", "posts", `${date}-${slug}`);
  const content = `${buildFrontMatter({
    title,
    date,
    author: cleanString(args.author) || "Newman with Codex",
  })}${buildBody(args)}`;

  if (fs.existsSync(filename)) {
    throw new Error(`File already exists: ${filename}`);
  }

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          content,
          filename,
          imageDir,
        },
        null,
        2
      )
    );
    return;
  }

  fs.mkdirSync(imageDir, { recursive: true });
  fs.writeFileSync(filename, content, "utf8");

  console.log(
    JSON.stringify(
      {
        filename,
        imageDir,
      },
      null,
      2
    )
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
