---
title: "writing a newsletter and updating the weeks"
date: 2026-05-08
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---
Hello Happy Hackers

I'm not sure why we ended the weeks on a Sunday.  I suppose it was to highlight the 'deadline' or 'due date' aspect.  It could just as easily been ending on Friday, due on Friday.  In future hachathons, this will be configurable.

We addressed the Admin Week and Builder week.  The Admin weeks start when registration begins and the buider weeks start when registration closes. ... hmmm, maybe next time we use the NASA model of Time Minus and Plus.  Weeks before registration closes (LIFTOFF) are Minus weeks and after are plus weeks or just weeks.  

Anyway - happy Friday

and here is what Codex says: 

```
Implemented the week-model change across config, data generation, dashboard UI, and docs.

  The core change is in /home/nsl/ad-ipsum/builder-season-playbook/config/event.yml:18, scripts/event.mjs:18, and src/
  _data/xSearch.js:1. Admin week 1 is now anchored to 2026-04-13 through 2026-04-19, the admin calendar runs for 14 weeks,
  builder updates run for 12 consecutive weeks, and the default builder Week 1 is the week ending 2026-05-03. Builder
  timing is now computed separately from admin week numbering, so a builder’s Week 1 can correctly map to Admin Week 3 and
  their final presentation week can land on 2026-07-19.

  The dashboard and builder pages now explain that distinction instead of hiding it. src/dashboard/index.njk:16 keeps
  admin week labels as the canonical labels, adds builder Week 1 and final presentation columns, and clarifies that the
  GitHub activity section uses the current UTC week. src/builders/builder.njk:45 shows each builder’s Week 1 update
  timing, admin-week offset, and final presentation week. I also updated README.md:30, /home/nsl/ad-ipsum/builder-season-
  playbook/config/repos.yml:1, and the internal reference post at src/posts/2026-05-05-x-search-semi-automated.md:28.

  I used an event-level default for all current builders rather than writing the same first_update_week_end into every
  builder entry. Individual builders can now override that in config/repos.yml when needed.

  Verification: ./node_modules/.bin/eleventy completed successfully, and the generated data confirms Week 1 = Apr 13 to
  Apr 19, Week 2 ends 2026-04-26, default builder Week 1 ends 2026-05-03, and the computed final presentation week ends
  2026-07-19.
```
