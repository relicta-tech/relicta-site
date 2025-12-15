# Relicta Docs (Starlight)

Starlight-powered docs for Relicta, hosted separately from the marketing site. Deploy this `docs/` project to `docs.relicta.tech` (or a dedicated Pages project).

## Scripts
```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # outputs to dist/
```

## Build/deploy
- Build: `npm run build`
- Deploy: `wrangler deploy --assets=./dist` (or Cloudflare Pages pointing to `docs/` with output `dist`)

## Content
- Lives in `src/content/docs/*.mdx`
- Sidebar configured in `astro.config.mjs`
- Brand assets in `public/brand/`
