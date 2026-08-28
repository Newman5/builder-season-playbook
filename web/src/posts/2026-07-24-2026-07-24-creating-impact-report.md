---
title: "2026-07-24 creating impact report"
date: 2026-07-24
author: "Newman"
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---


Ultimately, the goal of Builder Season is impact.

We build software, write documentation, organize communities, and mentor builders—but the question is always the same: **Did it create meaningful change?**

Measuring that isn't easy. Throughout Piece of Pie, I looked for metrics that could tell part of the story. GitHub commits are one indicator of activity, though an imperfect one. The number of completed projects tells us a little more. The number of projects that reached real users tells us even more.

One of the most meaningful metrics came from the **Real User Pie**.

To qualify, a project had to do more than demonstrate technical ability. It had to be deployed on mainnet and have a way for someone to actually purchase or pay for the product. That simple requirement changes the nature of the challenge. It encourages builders to think beyond writing code and toward solving real problems for real people.

This is a subtle but important shift. We don't simply need more example repositories on GitHub. We need builders who are comfortable taking an idea through the entire journey—from identifying a problem, to building a solution, to sharing it with users, to learning from the market, and improving it again.

That journey transforms a developer into something broader: a builder, entrepreneur, product creator, and problem solver.

We intentionally introduced a small amount of productive pressure by requiring projects to reach mainnet and be available for purchase. The goal wasn't to make the hackathon harder. The goal was to help builders experience the complete cycle of creating value.

Looking back, I think that decision had a meaningful impact—not only on the projects that were built, but on the confidence and mindset of the people who built them.


And Codex says: 
• Implemented the impact report.

  Key changes:

  - Added full-season impact generation in web/scripts/impact-summary.mjs:120.
  - Wired it into npm run build:data via web/scripts/build-data.mjs:11.
  - Added /impact/ sponsor page at web/src/impact/index.njk:16.
  - Added raw /data/impact.json output at web/src/data/impact.json.njk:1.
  - Added an Impact Report nav link in web/src/_includes/base.njk:1605.
  - Added a guard so a fully failed weekly GitHub fetch does not overwrite useful cached activity data in web/scripts/generate-activity.mjs:201.

  Verification:

  - npm run build passed with network access.
  - npx @11ty/eleventy passed locally without regenerating data.
  - /impact/ and /data/impact.json were generated.

  One important note: GitHub rate-limited unauthenticated full-season fetching, so the generated impact JSON marks affected projects as unknown and flags commit
  totals as incomplete. For final sponsor numbers, run with GH_ACTIVITY_TOKEN or GITHUB_TOKEN set. config/repos.yml was already modified before my work; I left it
  alone.
