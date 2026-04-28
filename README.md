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
