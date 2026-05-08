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
npm start
```

Other useful commands:

```bash
npm run build
ELEVENTY_SITE_URL="https://your-site.example.com/" npm run build
```

## Data flow

- `config/repos.yml` is the manual builder registry.
- `config/event.yml` defines the admin week calendar, the builder update cadence, and the weekly X search rules.
- `src/_data/builders.js` reads and normalizes `config/repos.yml` directly at Eleventy build time.
- `src/_data/xSearch.js` computes admin-week windows plus per-builder update timing and X live-search links directly at Eleventy build time.
- `./scripts/generate-activity.mjs` fetches public GitHub commit activity and writes `src/_data/activity.json`.
- Eleventy publishes the normalized builder registry at `/data/builders.json`, the cached GitHub snapshot at `/data/activity.json`, and the computed X search metadata at `/data/x-search.json`.

## Week model

- Admin week numbering is canonical for the dashboard. Week 1 runs Monday `2026-04-13` through Sunday `2026-04-19`.
- Builder update timing is separate. A builder's "Week 1 update" is the first Sunday-ending week they use for public updates, which can happen in a later admin week.
- `config/event.yml` sets the shared defaults:
  - `admin_week_1_start`
  - `admin_duration_weeks`
  - `builder_update_duration_weeks`
  - `default_builder_week_1_end`
- `config/repos.yml` can override the default builder start with `first_update_week_end` on an individual builder record.
- The dashboard keeps admin week labels on search links and shows builder-relative timing as supporting context.

## Tokens

`generate-activity.mjs` prefers `GH_ACTIVITY_TOKEN` and falls back to `GITHUB_TOKEN`.

## Notes

- The deploy workflow builds this directory for GitHub Pages with the repo path prefix.
- The scheduled activity workflow refreshes the generated JSON and commits it back to `main`.
- X update tracking is manual-search based, not live API based.
- Existing post-management scripts still work from this directory because the source content remains under `src/`.
