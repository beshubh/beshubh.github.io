# Shubham Kumar — portfolio

A React portfolio designed for GitHub Pages and built with Vite. The homepage is
laid out like a man page, in light and dark themes, and long-form writing stays
in Markdown so publishing remains independent from the application shell.

## Edit the portfolio

The shell and homepage live in `src/App.jsx`; the writing index and articles
live in `src/content/ContentViews.jsx`. The homepage's options and experience,
including the LimeChat highlights, live in `src/content/manual.js`. All styles
and theme colors are in `src/styles.css`.

Contact links come from `content/site.json`. Add `"x"` and `"resume"` URLs there
to show them in the header and the SEE ALSO section.

The homepage's PROJECTS section reads the list items in
`content/pages/projects.md` (``- [name](url) — Description. `language` ``). The
story page renders `content/pages/about.md`.

## Add a writing

Copy `content/writings/_template.md` to `content/writings/your-post-slug.md`, complete the frontmatter, and change `status` to `published`.

Required frontmatter:

```yaml
---
title: Your post title
date: 2026-07-04
summary: One sentence shown on the writing index.
tags: [systems, reliability]
status: published
---
```

Commit and push the Markdown change to `main`, then publish the generated site with:

```sh
npm run deploy
```

The deploy command is retained as a manual fallback. The normal path is the
GitHub Actions workflow described below. Generated files do not need to be
committed to `main`.

## Publish from the browser

Writings can be published from a private publisher hosted by the
`shubh-portfolio-admin` Cloudflare Worker. The site does not link to it; open
`/admin/` on the Worker directly. GitHub OAuth restricts publishing to
the configured `ALLOWED_GITHUB_LOGIN`, and the Worker creates the Markdown file
on `main` through GitHub's contents API. No database or long-lived server is
required.

The Worker configuration uses `keep_vars` so a Wrangler deploy preserves the
variables and encrypted secrets configured in the Cloudflare dashboard. Deploy
the Worker and its `/admin/` assets with:

```sh
npm run deploy:admin
```

The Cloudflare Worker must have these text variables:

- `GITHUB_CLIENT_ID`
- `ALLOWED_GITHUB_LOGIN`
- `REPO_OWNER`
- `REPO_NAME`
- `FRONTEND_ORIGIN`

It must also have these encrypted secrets:

- `GITHUB_CLIENT_SECRET`
- `SESSION_SECRET`

The OAuth application's callback URL is:

```text
https://shubh-portfolio-admin.shubhamkumar7051.workers.dev/auth/callback
```

Publishing pushes a Markdown file to `main`. The GitHub Actions Pages workflow
then tests, builds, and deploys the updated portfolio automatically. In the
repository's **Settings → Pages**, set **Source** to **GitHub Actions** once.

## Run locally

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:4173`. Use `npm run build` to generate the deployable `dist/` directory without starting a server, or `npm run preview` to serve the production build locally.

Vite watches the React source, CSS, Markdown content, and page shell. The writing index is regenerated before both development and production builds.

The public writing routes remain:

- `?page=writing` for the writing index.
- `?post=your-post-slug` for an individual essay.

The story is at `?page=about`. Older `?page=history` links still open it, and
older `?page=projects` links open the homepage.

## Verify

```sh
npm test
npm run test:build
```

The build-output check confirms that the published Markdown and site configuration are copied into `dist/` without content changes.

## GitHub Pages

Pages is deployed by `.github/workflows/deploy-pages.yml` after each push to
`main`. The site supports both user sites and repository subpaths because all
asset and content URLs are relative.
