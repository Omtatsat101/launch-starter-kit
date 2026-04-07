# Launch Starter Kit

Reusable launch system for the projects and ideas already present in `Organized`.

## What this ships

- A project manifest grounded in local files and idea docs
- A static generator that outputs starter pages for each identified product surface
- Adapter files for Shopify, Next.js, Electron, and Tauri
- Production-leaning launch shells for stores, portfolios, chatbots, local apps, and desktop-style tools

## Included launch starters

- KiddieGo
- GoGoMaya AI Design Lab
- KiddieSketch HQ
- RiketPatel Portfolio
- Legacy Bridge Brokerage
- KiddieSpeech
- KiddieWordle
- Translation App
- Windows AI Remote Controller
- Resume Agent SaaS
- Multi-Account Hub
- Local Assist Workbench
- Digital Deals
- AI Website Cloner

## Source grounding

This kit is built from local repo context including:

- `primer.md`
- `docs/ideas/inbox.md`
- `docs/ideas/prioritized.md`
- `docs/product/kiddiespeech-prd.md`
- `projects/kiddiego/*`
- `projects/kiddiesketch/*`
- `projects/brokerage/README.md`
- `plugins/multi-account-hub/README.md`
- `data-export/projects.json`

## Commands

Generate all starter outputs:

```powershell
node .\scripts\generate.mjs
```

Or:

```powershell
npm run generate
```

Outputs are written to:

- `output/index.html`
- `output/sites/*.html`
- `output/projects.json`

## Adapters

- `adapters/next-app/` for React / Next.js usage
- `adapters/shopify/` for Shopify themes
- `adapters/electron/` for desktop renderer shells
- `adapters/tauri/` for Tauri webview shells

## Production use

- Start with `output/sites/<project>.html` when you need a launch page immediately.
- Port that surface into the matching adapter when the project needs framework integration.
- Use the manifest as the single list of products, themes, and launch surfaces already grounded in Organized.

## Notes

- The generated pages are static launch starters by design so they can be deployed quickly.
- The framework adapters give you a path to port the same design language into production stacks.
- This kit does not modify the archived Claude Code ZIP or depend on it.
