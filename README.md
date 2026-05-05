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

Useful commands from `web/`:

```bash
npm ci
python3 -m pip install -r requirements.txt
npm run build:data
npm run build
```

`npm run build:data` normalizes `config/repos.yml` into `web/src/_data/builders.json` and refreshes `web/src/_data/activity.json`.

Builder normalization now runs through `python3` + `PyYAML`. The separate X submission pipeline still contains inline Ruby for now, so `npm run build:data:x` continues to require Ruby until that follow-on migration happens.

The activity updater prefers `GH_ACTIVITY_TOKEN` and falls back to `GITHUB_TOKEN`. Phase 1 counts all public commits on each tracked repo during the current UTC week.

For X weekly update tracking:

- add X handles and optional per-builder X rules to `config/repos.yml`
- add per-builder evidence files under `submissions/x-updates/`
- run `npm run build:data:x` from `web/` to refresh the X archive and weekly verifier JSON
- no live X API access is required
