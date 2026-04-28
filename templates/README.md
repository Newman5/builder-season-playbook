# Templates

This folder contains reusable template files for your event.

## How to Use Templates

1. Copy the template file you need into the appropriate location (usually `/docs/rules/`)
2. Replace all `{{placeholder}}` values with your actual event details
3. Add, remove, or modify sections to fit your event design

## Available Templates

### rules/

| File | Purpose |
|---|---|
| `builder-rules.md` | Core builder qualification requirements |
| `feedback-rules.md` | Feedback track qualification requirements |
| `reward-track-rules.md` | Generic reward track rules (copy and adapt for each track) |

## Placeholder Convention

All placeholders use double curly braces: `{{variable_name}}`

The corresponding variable names match keys in `config/event.yml`.

## Customization Notes

- You are not required to use all tracks. Remove tracks that don't apply.
- You can rename tracks (e.g., "Builder Pie" → "Sprint Track" or "Season Pass")
- You can add new tracks — just copy `reward-track-rules.md` and adapt it
- The core principle (participation over competition, equal splits) can be adjusted, but think carefully before doing so — it's a load-bearing design decision
