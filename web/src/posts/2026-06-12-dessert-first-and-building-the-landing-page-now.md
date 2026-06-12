---
title: "Dessert First and building the landing page now"
date: 2026-06-12
author: "Newman"
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---

# Builder Season Playbook — Progress Log

This week I found myself mostly writing progress logs about building the product itself rather than documenting the experience of actually running the hackathon. I think there may be an important shift there — the process of running the hackathon is itself part of the product and worth documenting more intentionally.

The biggest lesson this week was the idea of “dessert first” or starting at the end.

I realized I had spent a lot of time planning and organizing, but not enough time actually building the thing people would eventually see and use. Since I’ve never created a digital product for communities to run long-form hackathons before, I really wanted to see the sales page. I needed something visible and concrete.

As a side note, this is one of the things I appreciate most about the Piece of Pie hackathon itself: the goal is not just to build technology, but to build something people might actually buy or use. That means finding real user problems and solving them in a way that creates enough value to support the project financially.

Yesterday I came across someone talking about systems of landing pages and market connection. That pushed me toward a different approach for this work session. Instead of continuing to plan internally, I decided the goal should simply be to create the landing page.

And that’s what I did.

One important decision was to build the landing page directly inside the existing dashboard framework rather than creating a completely separate 11ty setup. I wanted to avoid the overhead of installing and configuring another system, especially since the setup process still feels heavier than I’d like.

A highlight of the session was working through a product positioning conversation with GPT around the Builder Season Playbook. The conversation helped clarify who the users are, what problem the playbook solves, and how to communicate the value more clearly. It also helped generate stronger taglines and positioning language.

By the end of the session I had something real: a landing page that can now act as a foundation instead of just an idea in my head. More importantly, it gives me something concrete to bring into future feedback sessions so I can collect reactions and improve the messaging based on actual conversations.

Looking ahead, I’d like to do a small revamp of the project management side of the work. I’m becoming more aware of the remaining timeline as well as upcoming scheduling conflicts with work and vacation. Part of the challenge — and maybe the game of the hackathon itself — is figuring out how to bring the project home within the available time and energy constraints.

Interestingly, the deeper I get into the hackathon, the more I appreciate the structure of it. I’m increasingly motivated not just to experiment with the idea, but to actually bring the Builder Season Playbook into the world as a real product.

All for now.

## And Codex sez: 

• This session:

  1. Read prompt 2026-06-12.md and inspected the existing web/ Eleventy app, dashboard, progress log,
     build config, and GitHub Pages workflow.

  2. Planned the landing page approach:
      - Recommended using the existing /web site instead of creating a separate site.
      - Recommended replacing / with the product landing page.
      - Kept /dashboard/ as the current/example season proof surface.
      - Chose placeholder CTAs for v1.

  3. Implemented the landing page:
      - Replaced web/src/index.njk with a full product landing page.
      - Added sections for hero, problem, framework, included materials, examples/screenshots, audience,
        philosophy, open-source support, and final CTAs.

      - Added links to the current season dashboard.

  4. Updated shared styling/layout:
      - Modified web/src/_includes/base.njk.
      - Shifted the visual language toward calm docs/editorial/product styling.
      - Added landing-page-specific CSS.
      - Updated header positioning copy and nav labels.

  5. Verified builds:
      - Ran npm run build.
      - Ran npm run build-ghpages.
      - Ran npx @11ty/eleventy for local output.
      - Confirmed / and /dashboard/ returned 200 OK on the local preview server.

  6. Protected generated data files:
      - The build rewrote web/src/_data/activity.json and web/src/_data/project-metadata.json with
        NETWORK_ERROR because GitHub access was sandboxed.

      - Restored those generated cache files so the final change set only includes source/template work.

  7. Started a preview server:
      - Served the built site from web/_site.
      - Final working preview URL was http://127.0.0.1:8081/.

  8. Made the quick follow-up change:
      - Removed the visible /progress-log/ nav link from base.njk.
      - Kept the /progress-log/ route itself intact and buildable as a hidden/share-only link.
      - Verified web/_site/progress-log/index.html still builds and public homepage/dashboard output no
        longer links to it.

  Current tracked source changes are:

  - web/src/index.njk
  - web/src/_includes/base.njk