---
title: "X search semi automated"
date: 2026-05-05
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---

Working on shifting to Python and to a simple data model
Moving away from Python to node 
Codex says:
```
• The activity pipeline is now Node-based.

  I replaced web/scripts/generate-activity.sh:1 with web/scripts/generate-activity.mjs:1 and updated web/
  package.json:1 so npm run build:data now runs node ./scripts/generate-activity.mjs. The new script keeps the
  same output shape in web/src/_data/activity.json, but the date math, GitHub requests, pagination, and JSON
  shaping all live in one Node module now.
  ```

## Questions
What is normalization?
When to use Bash, Python, or Node?
is there a way to have a "don't hit the API" flag?
The problem of builders starting in different weeks.  Could each builder have a "start week" attribute?  
