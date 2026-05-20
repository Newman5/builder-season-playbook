---
title: "Little fixes that build up over time"
date: 2026-05-20
author: "Newman"
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---
# Newman's thought this week
## Builder Season Playbook Progress Log

### Dashboard / Infrastructure Updates

Current improvements and cleanup tasks for the dashboard:

* use `active: true/false` instead of `ignore` in the `repos.yml` and ingestion scripts
* make the "Deploy to GitHub Pages" script run after the "Update GitHub Activity" script

  * activity updates daily, but the site is still manually deployed, which means the dashboard can get out of date quickly
  * goal: automatically deploy at least once per day after the activity script runs
* the dashboard page is too long

  * remove the "Builder X Searches" section
  * move recent commits to the top

    * shorten commit messages to a reasonable length
  * explore simple toggle headlines / collapsible sections using native HTML if possible

    * keep it as lightweight and simple as possible
* make X handles clickable links in the Builders section

---

So, here are my updates while working on the Builder Season Playbook.

To be honest, I was having some trouble motivating myself to really dive in and do the work. The list above is a collection of issues and observations I’ve been keeping track of over the last week or so. I had intended to sit down and knock them all out in a focused work session, but it was tougher than expected to get started.

One thing that helped was a hackathon member pointing out problems with the X search functions — specifically that some posts are not showing up correctly in the standard URL searches. That motivated me to spend about an hour and a half working in Codex, developing a clearer plan for the dashboard and refining it into something I liked.

Building with Codex is fun. I’m very glad I have enough coding background to not be afraid to dig down into the code when needed. Honestly, some of these tasks would have taken me an entire afternoon or longer on my own, especially the kinds of annoying debugging sessions where you’re stuck asking “why is this even breaking?”

It really does feel like a gift. It’s not without drawbacks, but building with Codex is allowing me to build the kinds of things I actually want to build. A lot of these improvements are fairly simple, but they are very focused on making the dashboard genuinely usable.

At this point, I feel the dashboard is becoming usable enough that I want to start getting feedback on it.

My next steps are:

* gather feedback from builders
* plan a dedicated feedback session
* continue attending the GameChanger live coding sessions on Tuesdays at 15:30 UTC

  * it was nice hearing other builders actively working on their projects

After that, I really want to think more deeply about the final product I want this playbook to become.

I think there’s a considerable chance that Gimbalabs will run this hackathon format again in the future, and that realization is motivating me to turn this into a reusable product — something that could help others recreate and facilitate this style of builder season themselves.

OK — in the interest of brevity, I’ll stop here.



# The Codex Plan aka "Mr. Codex sez"

  ## Summary - Dashboard + Automation Cleanup

  Implement four coordinated changes:

  - Replace ignore with active across builder registry parsing and docs.
  - Make the daily activity workflow also deploy GitHub Pages so the public site refreshes after snapshot updates.
  - Shorten the dashboard by prioritizing recent commits, removing the builder-by-builder X search table, and collapsing the remaining X search area with
    simple native HTML.
  - Make builder X handles clickable in the dashboard Builders table.

  ## Key Changes

  - Registry semantics:
      - Update config/repos.yml usage so active: false excludes a builder from site output and activity ingestion.
      - Change the registry loader to treat missing active as active by default.
      - Remove ignore from docs/examples and replace it with active.
      - Update any ownership/source-of-truth docs that currently describe ignore.
  - GitHub Actions:
      - Convert the scheduled update-activity workflow into the daily source of truth for both data refresh and Pages deployment.
      - Keep the existing build steps, commit/push updated activity.json and project-metadata.json, then build the Pages artifact and deploy in the same
        workflow run.
      - Retain the separate deploy.yml for normal human pushes to main, but daily freshness should no longer depend on that push triggering another
        workflow.
      - Add whatever Pages permissions are needed to the scheduled workflow so it can upload and deploy directly.
  - Dashboard layout and behavior:
      - Move Recent Commits above the Builders table, directly after the summary cards.
      - Trim commit messages in the recent-commit feed to a fixed reasonable preview length, preserving the full commit via the existing link.
      - Remove the entire Builder X Searches section from the dashboard.
      - Keep Weekly Global Searches, but wrap it in a native <details><summary> disclosure so it is collapsed by default with no JS dependency.
      - Keep the existing X summary cards unless they become redundant during implementation.
  - Builders table:
      - In the dashboard Builders section, render the X handle as a clickable https://x.com/{handle} link when present.
      - If the table does not currently have an X column, add one; if it already gains the link through a different layout tweak, keep the simplest
        readable version.

  ## Public Interface / Content Changes

  - config/repos.yml contract changes from ignore: true to active: false.
  - Builders are considered included unless active is explicitly false.
  - Dashboard content changes:
      - Builder X Searches removed.
      - Weekly Global Searches becomes collapsible.
      - Recent Commits appears earlier and shows shortened commit text.
      - Builders table exposes linked X handles.

  ## Test Plan

  - Registry:
      - Confirm a builder with active: false is absent from the homepage facepile, dashboard builders list, builder detail pages, and activity snapshot
        generation.
      - Confirm a builder without active still appears normally.
      - Confirm no code path still depends on ignore.
  - Dashboard rendering:
      - Build the site and verify section order: summary cards, recent commits, builders, X weekly searches.
      - Verify the Builder X Searches section is gone.
      - Verify the Weekly Global Searches block is collapsed by default and expands with native browser behavior.
      - Verify long commit messages are truncated cleanly without breaking links or timestamps.
      - Verify builder X handles open the correct X profile URLs.
  - Automation:
      - Review both workflow files for valid trigger/permission structure.
      - Ensure the scheduled workflow contains both data refresh and Pages deployment steps.
      - Ensure the manual/push deployment workflow still remains valid for normal site changes.

  ## Assumptions

  - active fully replaces ignore; backward compatibility for ignore is not required.
  - The simplest toggle requested is native <details>/<summary> with no JavaScript.
  - The collapsed section should be the remaining X search area, not the core activity or builders sections.
  - “Reasonable” commit shortening means a fixed preview length implemented in template/filter logic rather than CSS-only clipping.


