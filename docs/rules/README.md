# Rules

This folder holds the event-specific rule documents for your implementation.

## Setup

Copy the rule templates from `/templates/rules/` into this folder and customize them:

```bash
cp templates/rules/builder-rules.md docs/rules/builder-rules.md
cp templates/rules/feedback-rules.md docs/rules/feedback-rules.md
cp templates/rules/reward-track-rules.md docs/rules/your-track-name-rules.md
```

Then replace all `{{placeholder}}` values with your event-specific details.

## Typical Rule Files

| File | Purpose |
|---|---|
| `builder-rules.md` | Core builder qualification requirements |
| `feedback-rules.md` | Feedback track requirements and credit system |
| `your-track-name-rules.md` | Ecosystem or sponsor track (rename as appropriate) |

## Notes

- Keep each track's rules in a separate file
- Link to rule files from `docs/rewards.md` and `docs/overview.md`
- Make sure the README at the root links to the correct files under `docs/`
