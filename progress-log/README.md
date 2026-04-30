# Progress Log

Small 11ty blog for project updates. Build output goes to `_site/`, source content lives in `src/`, and the helper scripts in `scripts/` handle common post-management tasks.

## Basic use

From this directory:

```bash
npm install
npm start
```

Other useful commands:

```bash
npm run build
ELEVENTY_SITE_URL="https://your-site.example.com/" npm run build
```

The `ELEVENTY_SITE_URL` variable is important when you want the Atom feed URLs to use your real deployed domain.

## `blog-cli.sh` vs `blog-menu.sh`

- `./blog-cli.sh` is the better default here. It matches the current `package.json` more closely and supports both direct commands and an interactive menu.
- `./blog-menu.sh` is another menu-driven wrapper, but this copy appears to be from a slightly different version. It mentions extra commands like `test` and `import-days`, but those scripts are not present in this directory.

If you only keep one launcher, keep `blog-cli.sh`.

## Top-level launchers

- `./blog-cli.sh`
  Interactive menu or direct command runner for the blog tools.
  Example: `./blog-cli.sh`, `./blog-cli.sh drafts`, `./blog-cli.sh new "My post title"`

- `./blog-menu.sh`
  Alternate interactive wrapper. Similar purpose, but this copy is partially out of sync with the files in this directory.
  Example: `./blog-menu.sh`

## Scripts

- `./scripts/new-post.sh "Post Title"`
  Creates a new Markdown post in `src/posts/`, creates a matching image folder in `src/images/posts/`, and opens the file in your editor.

- `./scripts/new-link-post.sh <url> [description]`
  Creates a link-style post in `src/posts/`, tries to fetch the page title, creates an image folder, and opens the file in your editor.
  Example: `./scripts/new-link-post.sh https://example.com "Useful article"`

- `./scripts/list-drafts.sh`
  Lists draft files in `src/drafts/` with titles and word counts.

- `./scripts/edit-draft.sh <slug>`
  Opens a draft in your editor by slug.
  Example: `./scripts/edit-draft.sh my-draft`

- `./scripts/publish-draft.sh <slug>`
  Moves a draft from `src/drafts/` to `src/posts/`, updates the date to today, and renames the file with today’s date.

- `./scripts/find-post.sh <keyword>`
  Searches posts and drafts by keyword in titles and content.
  Example: `./scripts/find-post.sh eleventy`

- `./scripts/check-links.sh`
  Extracts external URLs from posts and drafts and checks them with `curl`.

- `./scripts/post-stats.sh`
  Shows basic stats such as post count, draft count, total words, top tags, and recent posts.

- `./scripts/generate-summary.sh [YYYY-MM]`
  Creates a monthly summary post for a given month, or for the current month if no argument is supplied.
  Example: `./scripts/generate-summary.sh 2026-01`

## Notes

- Several scripts open files using `$EDITOR`. If that is not set, some scripts fall back to `code` or `vim`.
- `blog-cli.sh` currently calls `pnpm` for `build`, `dev`, and `deploy`, but this directory’s `package.json` uses `npm` scripts. Running `npm start` and `npm run build` directly is the safest path.
