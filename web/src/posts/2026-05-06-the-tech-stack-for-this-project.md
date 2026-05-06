---
title: "The tech stack for this project"
date: 2026-05-06
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---

Here's the tech stack for this repo:

**Core:**

- **Eleventy (11ty) v3.1.2** — Static site generator
- **Nunjucks** — Template engine (`.njk` files)
- **Node.js** — Runtime (ES modules)

**Data & Config:**

- **YAML** (js-yaml v4.1.1) — Configuration files (repos.yml, event.yml)
- **GitHub API** — Source of commit activity data
- **JSON** — Data interchange (activity.json, builders.json, xSearch results)

**Plugins:**

- **@11ty/eleventy-plugin-rss v2.0.4** — Atom feed generation

**Build & Scripts:**

- **npm scripts** — Task runner
- **Node.js ES modules** — Standalone scripts for data generation (`.mjs` files)

**Architecture summary:**

1. **Config layer** → repos.yml (manual registry) + event.yml (event timing)
2. **Data generation** → generate-activity.mjs fetches GitHub API, outputs activity.json
3. **Data aggregation** → _data files (builders.js, activity.json, xSearch.js) provide global template data
4. **Templates** → Nunjucks + custom Eleventy filters (defined in eleventy.config.js)
5. **Output** → Static HTML in _site

The workflow is: 
YAML config → GitHub API → JSON snapshot → Nunjucks templates → Static site.

No framework cruft (React, Vue, etc.) — pure static generation optimized for content and dashboards.
