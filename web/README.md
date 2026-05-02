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
- `./scripts/builders-json.sh` normalizes the YAML registry into `src/_data/builders.json`.
- `./scripts/generate-activity.sh` fetches public GitHub commit activity and writes `src/_data/activity.json`.
- `./scripts/generate-x-posts.sh` ingests builder-submitted YAML files from `submissions/x-updates/` and generates both `src/_data/x-posts.json` and `src/_data/x-weeks.json`.
- Eleventy reads those `_data` files and also publishes them at `/data/builders.json` and `/data/activity.json`.

## Tokens

`generate-activity.sh` prefers `GH_ACTIVITY_TOKEN` and falls back to `GITHUB_TOKEN`.

## Notes

- The deploy workflow builds this directory for GitHub Pages with the repo path prefix.
- The scheduled activity workflow refreshes the generated JSON and commits it back to `main`.
- X update tracking is manual-YAML based, not live API based.
- Existing post-management scripts still work from this directory because the source content remains under `src/`.
