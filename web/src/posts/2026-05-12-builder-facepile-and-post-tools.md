---
title: "Builder facepile and post tools"
date: 2026-05-12
author: "Newman with Codex"
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---
Today I made two related improvements to the Builder Season Playbook: a new builder facepile on the homepage and a smoother post-writing workflow for future updates.

## Builder Facepile

The homepage now includes a GitHub-profile-image facepile built from the existing normalized builder registry. The data still flows from `config/repos.yml`, optional `project.yml` overlays, and then through the shared `builders` array that Eleventy already consumes.

I added a small normalization step so each builder exposes `githubProfileUrl`, `githubAvatarUrl`, `displayName`, and `builderPageUrl`. The avatar URLs use the stable GitHub pattern `https://avatars.githubusercontent.com/{username}?s=80`, and the landing page renders those images with accessible markup, explicit dimensions, and lazy loading.

The section fits the site’s current warm editorial look: overlapping circular avatars, subtle hover and focus states, and wrapping that still works on mobile.

## Post Authoring

I also updated the posting workflow so new posts can include an explicit author line without rewriting the older archive by hand. The shell scaffolds now default to `author: "Newman"`, while the post templates render `Author: Newman` when a post does not define an author.

For agent-authored posts, there is now a dedicated `create-post` routine and repo-local plugin bundle. The script can generate a markdown file, create the matching image directory, and prefill a short summary body. That gives us a cleaner path for turning work sessions into publishable updates without having to reconstruct the front matter every time.

## Verification

I ran the local Eleventy build after these changes. The homepage facepile rendered, existing posts displayed the new author line correctly, and the post-creation dry run produced the expected file path, image directory, and front matter.

That should make the site feel a little more personal on the front page and a little easier to maintain behind the scenes.
