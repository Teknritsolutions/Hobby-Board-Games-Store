# Credits and content provenance

- **Design, code, copy and identity:** original Table & Tale demonstration template created for this project. The SVG dice/tile mark and error/maintenance artwork are code-native vector designs.
- **Photography and packaging artwork:** original AI-generated images made with the built-in ImageGen tool. Individual scenes and product views were generated separately, then resized and converted to local WebP with ImageMagick. See `image-manifest.md` and `image-prompts.json` for asset provenance.
- **Bootstrap:** 5.3.8, MIT license. Local CSS at `assets/css/bootstrap.min.css`; license included beside it.
- **Inter:** Google Fonts / Inter project, SIL Open Font License 1.1. License included in `assets/fonts/Inter-OFL.txt`.
- **Outfit:** Google Fonts / Outfit project, SIL Open Font License 1.1. License included in `assets/fonts/Outfit-OFL.txt`.
- **Icons:** original minimal inline SVG paths; no icon font or emoji branding.
- **Development tools:** Node.js, Playwright, Prettier and ImageMagick. They are not required to browse the delivered site.

All game names, packaging, product specifications, prices, team identities, customer stories and events are illustrative. AI portraits do not depict verified employees. Social links intentionally open platform homepages. No stock images are hotlinked. No source code, branding or images from the reference sites were copied.

## Requested reference sites

The initial web inspection tool returned “not accessible” for all five supplied URLs, and the connected-browser inventory was empty. After local Playwright was installed, all five URLs returned HTTP 200. Playwright read 57 accessible pages linked from the supplied entry pages (16 farm, 10 events, 9 bookstore, 11 food truck and 11 yarn), collecting their titles and section headings. Desktop and mobile screenshots were captured for the five supplied entry pages. The original Table & Tale design follows the requested palette, typography and spacing rather than copying the references. The exact inspected-page inventory is recorded in `reference-analysis.json`.

- Local Farm / CSA: `https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/index.html`
- High-End Event Planning: `https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html`
- Local Indie Bookstore: `https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/index.html`
- Food Truck: `https://teknrit-maker.github.io/FoodTruck/Pages/menu.html`
- Boutique Yarn and Craft Supply: `https://ravivarmaadepu123.github.io/boutique-yarn-and-craft-supply/pages/`
