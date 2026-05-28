---
title: "Project Management and Kanban going in again"
date: 2026-05-27
author: "Newman"
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---

Today we created the Work Breakdown Structure document and imported it into a GitHub Project using Codex.

I've always wanted to use a Kanban board. The approach makes sense to me, but I've rarely been able to use one consistently across a project. Lately, though, I've been thinking more about how to manage time effectively while juggling multiple projects, and it feels like the right moment to give Kanban another serious try.

This also aligns with a broader goal at Gimbalabs. We used Notion for project management in the past and later moved toward GitHub, but we never fully committed to using GitHub Projects as our primary project management system. I've seen many open source projects use GitHub Projects effectively, and I'd like to better understand how it can support community-driven work.

One thing that feels different now is the arrival of AI assistants. Creating a project board is one thing, but maintaining it has always been the harder challenge. With tools like Codex and ChatGPT, I wonder if project boards will become easier to create, update, refactor, and keep aligned with reality. I'm curious to experiment and learn what works.

The Builder Season Playbook is giving me an opportunity to explore these ideas in a real project. My hope is that by the end of this season I'll have a more informed perspective on project management systems, and perhaps something useful that Gimbalabs can apply when the next season begins.

codex sez: 
• Saved the generator as scripts/update_work_breakdown.py.

  Run it with:

  ./scripts/update_work_breakdown.py

  It pulls Project Newman5/3 via gh project item-list and rewrites templates/admins/
  work-breakdown.md from the Project items.

  We set up GitHub project management for Builder Season Playbook.

  Main outcomes:

  - Authenticated gh with repo and project scopes.
  - Created GitHub Project: https://github.com/users/Newman5/projects/3
  - Created 109 real GitHub Issues from the WBS, #2 through #110.
  - Added all issues to the Project.
  - Created labels for:
      - priority
      - effort
      - artifact type
      - epic
  - Created 8 milestones from W5 Foundation Package through W12 Release.
  - Added Project fields:
      - Kanban Status
      - Epic
      - Priority Tier
      - Effort
      - Artifact Type
      - Target Week
      - Dependencies
  - Populated Project item fields from the WBS.
  - Updated templates/admins/work-breakdown.md so it is now a local snapshot of the
    GitHub Project, with the Project as source of truth.
  - Added scripts/update_work_breakdown.py to regenerate work-breakdown.md from the
    GitHub Project.

  Current repo changes:

  - Modified: templates/admins/work-breakdown.md
  - Added: scripts/update_work_breakdown.py
  - Existing untracked file still present: web/src/posts/2026-05-27-project-management-
    and-kanban-going-in-again.md

  Useful command:

  ./scripts/update_work_breakdown.py

  That refreshes the local WBS from GitHub Project Newman5/3.