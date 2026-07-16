# Config

This folder contains the central configuration for your event.

## event.yml

`event.yml` is the **single source of truth** for all event-specific values.

Edit this file to customize the playbook for your event. Values defined here correspond to `{{variable_name}}` placeholders used throughout `/docs` and `/templates`.

### How to Use

1. Open `event.yml`
2. Fill in every field marked with `"YYYY-MM-DD"` or placeholder text
3. Save and commit
4. Search your repo for any remaining `{{` placeholders in `/docs` and `/templates` to confirm everything is updated

### Key Sections

| Section | What to fill in |
|---|---|
| Core Identity | Event name, community name, tagline |
| Key Dates | Enrollment, build, presentation, payout windows |
| Reward Pools | Prize amounts and currency |
| Administration | Admin names |
| Community Links | Website, Discord, registration form, GitHub, Twitter |
| Sponsors | Sponsor names, optional VC pitch opportunity |
| Rules | Weekly update requirements, final demo requirements |
| Optional Features | Toggle tracks on/off |

### Format Note

This file uses YAML. YAML is whitespace-sensitive. Keep indentation consistent.

If you prefer JSON, you can rename this file to `event.json` and reformat accordingly.

## repos.yml

`repos.yml` is the manual registry for the website dashboard.

Each entry in `repos:` should describe one builder and one tracked repository for Phase 1. Eleventy reads this YAML directly and normalizes it for the website dashboard.

Suggested fields:

- `id`
- `name`
- `github`
- `project_name`
- `project_url`
- `repo_url`
- `x`
- `pies`
- `notes`
- `active`

Use `active: false` when you want to keep an entry in the registry without publishing it on the site or including it in activity generation.

`repos.yml` also remains the source of truth for:

- builder membership in the dashboard
- `id`
- `pies`
- `notes`
- `active`
- per-builder week timing overrides

For X tracking, add:

- `x`

## project.yml

`project.yml` is the distributed per-repo metadata file for builder projects.

Place it at the root of each builder repository when you want admins to collect project metadata through the GitHub API and ingest it into an Eleventy data loader or another aggregation script.

Current shape:

- `id`
- `name`
- `tagline`
- `builder.name`
- `builder.x_handle`
- `builder.github_handle`
- `repo_url`
- `demo_url`
- `website_url`
- `status`
- `updates[]`

Each `updates[]` item should include:

- `week`
- `date`
- `x_url`
- `summary`

In this repo, see [`project.yml`](../project.yml) for the canonical example.

Builder/project field mapping:

- `project.yml > id` becomes builder `projectId`
- `project.yml > name` becomes builder `projectName`
- `project.yml > tagline` becomes builder `tagline`
- `project.yml > builder.name` becomes builder display `name`
- `project.yml > builder.github_handle` becomes builder `github`
- `project.yml > builder.x_handle` becomes builder `x` after removing the leading `@`
- `project.yml > repo_url` becomes builder `repoUrl`
- `project.yml > demo_url` becomes builder `demoUrl`
- `project.yml > website_url` becomes builder `websiteUrl`
- `project.yml > demo_url` or `website_url` becomes builder `projectUrl`
- `project.yml > status` becomes builder `status`
- `project.yml > updates` becomes builder `updates`

Fallback and precedence:

- `config/repos.yml` seeds the tracked repo list.
- When fetched `project.yml` metadata is present, builder/project profile fields are merged into the normalized builder data.
- When fetched `project.yml` is missing or partial, the missing fields fall back to `repos.yml`.
- Admin-only controls in `repos.yml` are never overwritten during the site build.

Admin sync:

- Run `npm run build:data` from `web/` to refresh fetched `project.yml` cache data.
- Run `npm run sync:repos` from `web/` to update selected profile fields in `config/repos.yml`.
- The sync command prints which builders and fields changed and skips builders with missing or invalid metadata.

## Builder X Review

The website links builder X handles to simple manual searches for `pieceofpie` updates.

Use this field to shape the search links:

- `x` in `repos.yml`

The dashboard and builder pages expose `from:{handle} pieceofpie` search URLs for manual review.
