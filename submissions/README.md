# X Update Submissions

Builders can submit weekly X update evidence as per-builder YAML files.

Recommended path pattern:

- `submissions/x-updates/{builder-id}.yml`

Example:

```yml
builder_id: newman5
x_handle: newman5
posts:
  - url: https://x.com/newman5/status/1234567890
    created_at: 2026-04-21T14:30:00Z
    hashtags:
      - "#yourevent"
      - "#yourcommunity"
    mention_present: true
    text: "Week 1 update #yourevent #yourcommunity @yourcommunity"
    note: Registered and shared repo link
```

The app computes qualifying weeks from `created_at`, `config/event.yml`, and `config/repos.yml`.
