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
