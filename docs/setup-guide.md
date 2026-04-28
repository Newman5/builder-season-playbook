# Setup Guide

This guide walks you through forking and running this playbook for your own event.

---

## Step 1 — Fork or Use This Template

Click **"Use this template"** (or fork) on GitHub to create your own copy of this repository.

Give your repo a name that reflects your event or community.

---

## Step 2 — Configure Your Event

Open `config/event.yml` and fill in your values:

- Event name, dates, and duration
- Reward pool amounts and currency
- Community links (website, Discord, registration form)
- Sponsor names
- Admin names
- Feature flags (toggle tracks on/off)

This is the **one file you must edit** before anything else makes sense.

---

## Step 3 — Update the Docs

The `/docs` folder contains participant-facing documentation with `{{variable_name}}` placeholders.

After updating `config/event.yml`, search for remaining `{{` patterns in `/docs` and replace them with your actual values.

Key files to review:

| File | What it covers |
|---|---|
| `docs/overview.md` | What your event is |
| `docs/timeline.md` | Key phases and dates |
| `docs/rewards.md` | Reward structure |
| `docs/registration.md` | How participants register |
| `docs/verification.md` | How qualification is confirmed |
| `docs/faq.md` | Common questions |

---

## Step 4 — Customize the Rules

Copy the rule templates from `/templates/rules/` into `/docs/rules/` and customize them:

```
cp templates/rules/builder-rules.md docs/rules/builder-rules.md
cp templates/rules/feedback-rules.md docs/rules/feedback-rules.md
cp templates/rules/reward-track-rules.md docs/rules/reward-track-rules.md
```

Replace all `{{placeholders}}` with your specific values.

Add or remove rule sections to fit your event design.

---

## Step 5 — Update the README

Edit the root `README.md` to reflect your event:

- Update the title and description
- Update all links (website, Discord, registration)
- Update the "Start Here" section with correct file links
- Remove or update the "Contributing" section as appropriate

---

## Step 6 — Set Up Registration

Create a registration form (Google Forms, Airtable, Typeform, etc.) and:

1. Update the `registration_form_url` in `config/event.yml`
2. Update `docs/registration.md` with the correct link and any custom instructions

---

## Step 7 — Announce and Go Live

Make the repository public if it isn't already.

Share the repo link as the official public handbook for your event.

Communicate to participants that this is the **source of truth** for rules, dates, and clarifications.

---

## Ongoing During the Event

Use GitHub Issues to:

- Publish official clarifications
- Record formal rulings on edge cases
- Respond to participant questions in the open

This keeps all official communication transparent and discoverable.

---

## After the Event

Move event-specific materials into `/archive/` for future reference:

```
archive/
  season-1/
    event.yml          ← snapshot of the config used
    results.md         ← final participation and payout summary
    notes.md           ← lessons learned
```

This gives future organizers a concrete example to learn from.

---

## Optional: Static Site

If you want a public-facing website (not just a GitHub repo), the `/site` folder can hold an [11ty](https://www.11ty.dev/) or [Astro](https://astro.build/) project that renders the markdown docs as HTML.

This is optional. The repo alone works as a minimal public handbook.

---

## Checklist

- [ ] Fork or use template
- [ ] Fill in `config/event.yml`
- [ ] Update `docs/` with final values
- [ ] Copy and customize rule templates from `templates/rules/`
- [ ] Update root `README.md`
- [ ] Set up registration form and update link
- [ ] Make repo public
- [ ] Announce to participants
