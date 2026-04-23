# AGENTS.md

## Project Snapshot
- Static Hebrew (RTL) memorial/education website.
- Primary stack: plain HTML, CSS, and browser JavaScript.
- Deployment target: Netlify (static pages + Netlify Functions).
- No package manager or build pipeline is configured.

## Start Here
- Main entry pages: `index.html`, `home.html`.
- Shared source data: `data/sources.json`.
- Sources UI logic: `sources.js`.
- AI widget: `ai-widget.js`.
- Netlify AI function code currently lives in `chat.js` (verify final function path and format before relying on it).
- HTML lint configuration: `.hintrc`.

## Working Rules For Agents
- Preserve Hebrew content and RTL behavior (`lang="he"`, `dir="rtl"`).
- Prefer minimal edits to existing page structure; many styles are inline per-page.
- Before changing visual design, check whether the same pattern appears in multiple HTML files.
- Do not introduce a build system unless explicitly requested.
- Keep external API secrets out of repo; use Netlify environment variables (for example `OPENAI_API_KEY`).

## Known Pitfalls
- The stylesheet filename contains hidden RTL Unicode marks (`*styles.css`). Do not rename it casually; verify links if you touch it.
- Routing/payload mismatch risk exists between widget and serverless function:
  - `ai-widget.js` posts to `/.netlify/functions/ask` with `{ question, page }`.
  - `chat.js` expects `{ message }`.
  Keep endpoint and payload contract aligned when editing either side.
- Some references in navigation point to pages that may not exist in this repo (for example `media.html`, `visitors.html`). Validate links after menu edits.

## Validation Checklist (No Automated Tests)
- Open changed pages in browser and verify Hebrew text renders correctly.
- Verify RTL layout on desktop and mobile widths.
- Click all changed navigation links.
- If sources were touched, confirm `sources.html` still loads and filters `data/sources.json`.
- If AI chat was touched, test the Netlify function request/response path and error handling.

## When To Add More Customization
Create focused follow-up customizations if work becomes repetitive:
- `.github/instructions/frontend.instructions.md` for shared HTML/CSS component patterns.
- `.github/instructions/content.instructions.md` for Hebrew tone and historical-content consistency.
- `.github/skills/link-audit/SKILL.md` for recurring internal-link and asset checks.
