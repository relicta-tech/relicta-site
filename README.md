# Relicta Site (Astro)

Astro-based marketing page for the Relicta CLI and GitHub Action. Lives in a separate repo so the CLI stays lean. Cloudflare Pages can host the built site and handle redirects to the docs.

## Prereqs
- Node.js 18+
- npm (bundled with Node)

## Setup & local dev
```bash
npm install
npm run dev    # http://localhost:4321
```

## Build
```bash
npm run build  # outputs to dist/
```

## Deploy to Cloudflare Pages
1. Push this repo (e.g., `relicta-site`) to GitHub.
2. In Cloudflare Pages, create a new project pointing at the repo.
3. Build settings: command `npm run build`, output directory `dist`.
4. Deploy. The Starlight docs are served at `/docs/` (no redirects needed).
5. For wrangler-based deploys, use the included `wrangler.jsonc` or run `npx wrangler deploy --assets=./dist` after `npm run build`.

## Updating brand assets
Replace the SVGs in `public/brand/` with updates from the main Relicta repo (`../relicta/brand/`).

## Design tokens
Tokens live in `src/styles/tokens.css` (colors, gradients, radii, shadows, spacing, typography). Components/styles pull from these CSS variables via `global.css`; add new primitives there before consuming them in pages or components.

## Docs (Starlight)
- Content lives in `src/content/docs/` as `.mdx`.
- Sidebar/nav is configured in `astro.config.mjs`.
- Collection schema is in `src/content/config.ts`.
