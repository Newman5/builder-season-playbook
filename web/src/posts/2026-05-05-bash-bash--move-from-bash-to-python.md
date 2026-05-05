---
title: "Bash Bash?  move from Bash to Python"
date: 2026-05-05
tags:
  - blog
layout: post.njk
og_image: /images/og/11ty-blog-OG-default.jpg
---

I wanted to make sure I was using the right tooling and I think Python fits here.  I'm using a script to take yml data - that I manually input and that outputs JSON for the 11ty to build the frontend... but why?  Why not just use the yaml?  Im pretty sure 11ty can use yml as well as JSON.  

I think it's part of the iterative process to go back and rebuild when I 'see' it better.  And, it underlines the data model first building method that I've seen some folks use.  ... and that's what I'll do tomorrow.

PS: I'm pleased with the current Piece of pie hackathon.  we closed the registration and have over 20 builders - which meets our goal.  And, I'm happy with creating this repo to 'productize' the hackathon and make it a replicable safe space for builders of tomorrow.  (yeah, I really think like that)

Codex says: 
```
Implemented the Python migration. The builder normalization logic now lives in web/scripts/builders_json.py:1, with comments at the
  same intent-level as the shell scripts, and the old builders-json.sh entrypoint has been removed. Callers now invoke python3
  directly from web/package.json:7, web/scripts/generate-activity.sh:25, and web/scripts/generate-x-posts.sh:13.

  I also added the minimal Python dependency file at web/requirements.txt:1, updated both GitHub Actions workflows to install Python
  and PyYAML before builds (.github/workflows/update-activity.yml:30, .github/workflows/deploy.yml:37), and refreshed the docs in
  README.md:90 and web/README.md:15 to reflect the new runtime and the fact that the X pipeline still uses Ruby for now.

  Verification: python3 web/scripts/builders_json.py passed, and npm run build:data:x passed end-to-end. I did not fully verify npm
  run build:data because that path calls the live GitHub API. One generated file changed in-repo: web/src/_data/builders.json:1. Its
  content is equivalent, but empty arrays are now rendered as [] instead of Ruby’s multiline empty-array formatting.
  ```
