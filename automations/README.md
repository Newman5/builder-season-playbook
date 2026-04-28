# Automations

This folder is reserved for optional scripts and automation tools that support event operations.

## Purpose

Automations can help with:

- tracking participant progress (weekly updates, repository activity)
- generating participant status reports
- sending reminders or notifications
- calculating reward distributions
- building registration pipelines

## Philosophy

Keep automations simple. A shell script or Python script that does one thing well is better than a complex system.

Bias toward:

- tools that can be run manually
- scripts that output readable reports
- lightweight integrations (GitHub Actions, simple webhooks)

Avoid:

- automation that participants depend on for qualification
- systems that introduce hidden dependencies
- automation that requires significant ongoing maintenance

## Suggested Starting Points

If you want to add automations, consider starting with:

1. **Progress tracker** — a script that checks each registered project's repository for recent commits and produces a weekly status CSV
2. **Tweet tracker** — a script that verifies weekly update links against the required format
3. **Reward calculator** — a script that reads final participation data and outputs payout amounts per qualified participant
4. **Registration ingestion** — a script that reads form submissions and creates a participant registry file

## Notes

All automations in this folder are optional. The playbook works without them.

If you build something useful, consider contributing it back upstream via a pull request.
