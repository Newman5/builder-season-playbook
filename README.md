# Piece of Pie Playbook

A reusable, forkable template for running a **builder-first community sprint** — with accountability, incentives, and open-web tooling baked in.

Inspired by the [Gimbalabs Piece of Pie Hackathon](https://github.com/gimbalabs/Piece-of-Pie-Hackathon).

---

## What This Is

**Piece of Pie Playbook** is a generalized template repository that any community can fork, customize, and run.

Think of it as:

- A hackathon-in-a-box
- A community builder sprint template
- An accountability + incentives operating system
- An open-source playbook for running builder seasons

This repo separates **the framework** (evergreen, reusable) from **the event details** (specific to each implementation).

---

## Quick Start

1. **Fork this repo**
2. **Edit `config/event.yml`** — fill in your event name, dates, prize pools, links, and community info
3. **Review `docs/`** — replace any remaining `{{placeholders}}` with your specifics
4. **Review `templates/`** — copy rule templates into `docs/rules/` and customize them
5. **Publish** — use this repo as the public source of truth for your event

Full walkthrough: [`docs/setup-guide.md`](docs/setup-guide.md)

---

## Repository Structure

```
/config         ← Your event variables (start here)
/docs           ← Participant-facing documentation
/templates      ← Reusable rule and doc templates
/automations    ← Optional scripts for tracking and coordination
/assets         ← Logos, diagrams, images
/web            ← Published Eleventy site and dashboard
/examples       ← Reference implementations
/archive        ← Historical event snapshots
/project.yml    ← Optional per-builder project metadata for GitHub ingestion
```

---

## Start Here

- [Setup Guide](docs/setup-guide.md) — how to fork and run this playbook
- [Design Principles](docs/design-principles.md) — the evergreen ideas behind the framework
- [Overview](docs/overview.md) — what this event format is
- [Timeline](docs/timeline.md) — phases and key dates
- [Rewards](docs/rewards.md) — reward tracks and pool structure
- [Registration](docs/registration.md) — how participants register
- [Verification](docs/verification.md) — how qualification is confirmed
- [FAQ](docs/faq.md) — common questions

---

## Core Principle

> Qualify through consistent, verifiable participation — not competition.

---

## Contributing

Issues, suggestions, and forks are welcome. This playbook is meant to be improved through real use.

If you run an event using this template, consider opening an issue or PR to share what you learned.

## Website Dashboard

The published web surface now lives in `web/` and is built with Eleventy.

Key routes:

- `/` landing page
- `/dashboard/` GitHub Activity Dashboard
- `/progress-log/` project progress log
- `/builders/{id}/` builder detail pages
- `/data/` published JSON links

Builder registrations are maintained in `config/repos.yml`.

Each builder repo can also publish a root-level `project.yml` for distributed metadata ingestion through the GitHub API. This repo includes one at [`project.yml`](project.yml).
There is also a reusable template at [`templates/builders/project.yml.example`](templates/builders/project.yml.example).

Useful commands from `web/`:

```bash
npm ci
npm run build:data
npm run sync:repos
npm run build
```

`config/repos.yml` is the current manual source of truth for builders in this repo. Eleventy reads it directly and publishes the normalized registry at `/data/builders.json`. `config/event.yml` drives the computed X search links for each hackathon week. `npm run build:data` refreshes the cached GitHub snapshot in `web/src/_data/activity.json`.

The root `project.yml` is a companion format intended for cross-repo ingestion. It gives each builder repository a self-contained metadata file that an admin script can fetch through the GitHub API before normalizing it for 11ty.

Current data flow:

1. `config/repos.yml` defines which builders and repos are tracked.
2. `npm run build:data` fetches each tracked repo's root `project.yml` when present and caches the results in `web/src/_data/project-metadata.json`.
3. The builder loader merges builder-owned profile fields from fetched `project.yml` into the manual registry with fallback to `config/repos.yml` when the file is missing or incomplete.
4. Eleventy publishes the merged builder registry at `/data/builders.json` and uses it for dashboard and builder pages.
5. `npm run sync:repos` lets admins write selected fields from fetched `project.yml` back into `config/repos.yml` with a per-builder change report.

Field ownership:

- `config/repos.yml` owns builder membership, `id`, pies, notes, ignore flags, and X/week admin overrides.
- `project.yml` owns builder/project profile fields such as project name, tagline, builder display name, GitHub handle, X handle, repo URL, demo URL, website URL, status, and update summaries.
- If `project.yml` is missing, the site falls back to `config/repos.yml` and the builder still renders normally.

X review is now manual-search based. The dashboard generates X live-search links from the configured hashtags, mention, builder handles, and weekly date windows, so there is no X API dependency and no separate X data build step.

The activity updater prefers `GH_ACTIVITY_TOKEN` and falls back to `GITHUB_TOKEN`. Phase 1 counts all public commits on each tracked repo during the current UTC week.

For X weekly update tracking:

- add X handles and optional per-builder X rules to `config/repos.yml`
- set `weekly_update_hashtags`, `weekly_update_mention`, `build_start`, and `event_duration_weeks` in `config/event.yml`
- use the dashboard and builder pages to open per-week live-search links on X
- no live X API access is required
