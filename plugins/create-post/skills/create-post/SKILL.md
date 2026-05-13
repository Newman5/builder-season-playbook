---
name: create-post
description: Create a new Builder Season Playbook blog post in `web/src/posts/` using the repo's post format, author defaults, and image-directory conventions. Use this when the user wants a new post, a daily summary draft, or a scaffold from current work.
metadata:
  short-description: Create a Builder Season Playbook post
---

# Create Post

Use this skill when the user wants a new Builder Season Playbook post or post draft.

## Workflow

1. Work from the existing repo conventions in `web/scripts/new-post.sh`, `web/scripts/new-link-post.sh`, and the post templates in `web/src/_includes/`.
2. For a normal post, create the file in `web/src/posts/YYYY-MM-DD-slug.md`.
3. Create the matching image directory in `web/src/images/posts/YYYY-MM-DD-slug/`.
4. Use this front matter order:
   - `title`
   - `date`
   - `author`
   - `tags`
   - `layout`
   - `og_image`
5. Default `author`:
   - `Newman` for the manual shell scaffolds.
   - `Newman with Codex` for posts you create through this skill.
6. Prefer using `node ./scripts/create-post.mjs --title ... --summary ... --author "Newman with Codex"` from the `web/` directory.
7. Seed the body with a concise summary of the work from the current conversation instead of placeholder text.

## Content Rules

- Keep the tone consistent with the existing posts: practical, reflective, and lightweight.
- Mention the main change, where it landed in the repo, and how it was verified.
- If the user gives a title, use it. If not, infer one from the current work and keep it short.
- If the user wants only a scaffold, omit `--summary` and let the script write the default sections.

## Verification

- Confirm the target markdown file path and image directory path are correct.
- If the repo changed in a way that affects rendering, run the local Eleventy build from `web/`.
