# Web

This directory contains the Eleventy site for the Builder Season Playbook.

The site now publishes:

- landing page at `/`
- GitHub activity dashboard at `/dashboard/`
- progress log at `/progress-log/`
- builder pages at `/builders/{id}/`
- raw JSON links at `/data/`

## Basic use

From this directory:

```bash
npm ci
npm run build:data
npm run sync:repos
npm start
```

Other useful commands:

```bash
npm run build
ELEVENTY_SITE_URL="https://your-site.example.com/" npm run build
```

## Data flow

- `config/repos.yml` is the tracked builder registry and the source of admin-only fields.
- Builder repos can publish a root-level `project.yml` with builder-owned project/profile metadata.
- `config/event.yml` defines the admin week calendar and the builder update cadence.
- `./scripts/build-data.mjs` fetches root-level `project.yml` files from tracked repos and writes the cache to `src/_data/project-metadata.json`.
- `src/_data/builders.js` reads and normalizes `config/repos.yml`, then merges fetched `project.yml` metadata into each builder with fallback to the manual registry when metadata is missing.
- `./scripts/generate-activity.mjs` fetches public GitHub commit activity and writes `src/_data/activity.json`.
- `./scripts/sync-repos.mjs` optionally writes selected fetched profile fields back into `config/repos.yml` and prints a field-level change summary.
- Eleventy publishes the merged builder registry at `/data/builders.json`, the fetched project metadata cache at `/data/project-metadata.json`, and the cached GitHub snapshot at `/data/activity.json`.

Current precedence rules:

- `config/repos.yml` controls membership, `id`, pies, notes, active flags, and X/week override fields.
- `project.yml` controls builder/project profile fields such as project name, builder name, handles, URLs, status, and update summaries.
- When `project.yml` is missing or incomplete, those fields fall back to `config/repos.yml`.

## Week model

- Admin week numbering is canonical for the dashboard. Week 1 runs Monday `2026-04-13` through Sunday `2026-04-19`.
- Builder update timing is separate. A builder's "Week 1 update" is the first Sunday-ending week they use for public updates, which can happen in a later admin week.
- `config/event.yml` sets the shared defaults:
  - `admin_week_1_start`
  - `admin_duration_weeks`
  - `builder_update_duration_weeks`
  - `default_builder_week_1_end`
- `config/repos.yml` can override the default builder start with `first_update_week_end` on an individual builder record.
- The dashboard no longer generates weekly X search links; it links builder handles to simple `from:{handle} pieceofpie` searches.

## Tokens

The fetch scripts prefer `GH_ACTIVITY_TOKEN` and fall back to `GITHUB_TOKEN`.

## Notes

- The deploy workflow builds this directory for GitHub Pages with the repo path prefix.
- The scheduled activity workflow refreshes the generated JSON, commits it back to `main`, and deploys GitHub Pages.
- X update tracking is manual-search based through simple builder-handle searches, not live API based.
- Existing post-management scripts still work from this directory because the source content remains under `src/`.
