# Table & Tale — Hobby & Board Games Store

A complete, original static HTML template for a welcoming tabletop game boutique.

## Open the site

Open `pages/index.html` in your browser, or run:

```sh
npm install
npm start
```

Visit `http://127.0.0.1:4173/pages/index.html`. The root `index.html` forwards to the main homepage. No framework, database or backend is required. All fonts, images and Bootstrap CSS are local.

## Included

- Eleven complete pages, two distinct homepages, shared responsive navigation and footer.
- Ten original sample games with category, price, age and player ranges.
- Product search, category/player/age filters, sorting and helpful empty states.
- A deterministic recommendation finder and URL-selected product/event details.
- System-aware light/dark themes, saved manual preference, keyboard navigation and RTL styles.
- Contact, bulk enquiry, newsletter and event-interest forms with accessible local validation.
- Original generated photography, product artwork, SVG identity and PNG/ICO favicons.

This is a frontend demonstration. Products, prices, events, staff, testimonials and contact information are sample content. Forms do not send or save data, reserve seats or place orders. Social links open platform homepages.

## Edit and rebuild

Edit `scripts/build.cjs` for page content and shared components, `assets/js/data.js` for product/event data, and `assets/css/` for the design system. Run `npm run build`, then format with `npx prettier --write pages assets/css/style.css assets/css/responsive.css assets/css/dark-mode.css assets/css/rtl.css assets/js scripts tests README.md documentation`.

The generated HTML is fully editable and usable as delivered. Rebuilding overwrites generated page edits. Shared navigation is included at build time, so it does not rely on a server or a JavaScript fetch.

## Verify

Start `npm start` in one terminal and run `npm test` in another. Install a compatible Chromium with `npx playwright install chromium` if needed. Tests check page structure, local links, assets, responsive overflow, themes, menus, filters, detail routes, forms and representative RTL layouts. The test runner also supports the already-installed local Chromium on the development machine.

See `documentation/installation.md`, `customization.md`, `page-structure.md`, `image-manifest.md`, `credits.md`, `qa-report.md` and `changelog.md`.

## Before using for a real business

Replace canonical URLs and sitemap origin; replace all demo business/product/event information; configure verified social accounts, a real location/map and form/newsletter providers. Read the integration instructions in `documentation/customization.md`.

No Lighthouse score or production performance target is claimed without a measured audit. This project is prepared for static hosting, including GitHub Pages; it has not been publicly deployed as part of the local template delivery.
