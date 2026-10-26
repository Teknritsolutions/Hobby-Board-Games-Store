# Quality assurance — October 19, 2026

## Automated browser verification

The final Playwright run completed **1,248 checks with zero reported issues**. It covered **286 layout combinations**: eleven pages × thirteen widths × two themes. Test widths: 320, 360, 375, 390, 420, 576, 640, 768, 992, 1024, 1280, 1440 and 1920px.

- Exactly one H1 on every page and exact required major section counts.
- Shared header/footer, metadata, form labels and unique element IDs.
- Local links and anchors, loaded image assets and no repeated image source within a rendered page.
- Root horizontal overflow and escaped headings, paragraphs, buttons and containers at every tested size.
- Desktop hover and keyboard dropdowns, ArrowDown entry, Escape dismissal, mobile nested navigation and route selection.
- Category query parameters, search, category/player/age filtering, name/price sorting, reset and empty results.
- Deterministic game-finder matches, URL presets, full-range player matching and helpful no-match results.
- All ten product IDs, all three event IDs, invalid-ID recovery and product image enlargement/Escape dismissal.
- System dark preference, manual switching and saved preference across page navigation.
- Newsletter, contact, bulk enquiry and event-interest validation and honest demo confirmations; zero form POST requests.
- FAQ accordions and representative RTL layouts for home, catalog and contact at 320, 768 and 1440px in both themes.

**84 screenshots** were captured: all eleven pages at 390, 768 and 1440px in light/dark themes, plus eighteen representative RTL captures. Full test output is recorded in `qa-results.json`. Screenshots remain in the development folder `test-results/`.

## Accessibility

Axe automated checks for WCAG 2.0/2.1 A and AA reported **zero violations** on all eleven pages in both themes, plus the contact form's visible validation-error state (23 scans total). Details, including checks requiring human review, are in `accessibility-results.json`.

This is an automated scan, not a certification of complete WCAG conformance. Screen-reader usability and all browser/assistive-technology combinations have not been exhaustively audited.

## Assets and source

- 66 separately generated, locally stored WebP assets; all SHA-256 checksums distinct.
- Original SVG brand mark, horizontal theme variants, favicon SVG/ICO, 16/32px PNGs and 180px touch icon.
- Local Bootstrap CSS and self-hosted Inter/Outfit fonts with licenses.
- Delivered HTML, CSS and JavaScript formatted with Prettier; generated pages remain readable after rebuilding.
- WebPage JSON-LD avoids fabricated business, review, offer or inventory claims.

## Issues corrected during QA

- Prevented a featured-game grid track from forcing the tablet text column offscreen.
- Removed a duplicate search-change render that replaced the reset button before its click could finish.
- Preserved visible content in accessible link names by removing redundant ARIA overrides.
- Removed button background transitions that could briefly reduce text contrast while changing themes.
- Kept validation errors inside their corresponding form fields to preserve the form grid.
- Stacked narrow-screen hero CTAs, improved mobile product text/touch targets and centered the standalone illustration layouts.

## Verification limits and launch configuration

- Lighthouse scores, production LCP/CLS/INP and real-world network performance were not measured; no performance score is claimed.
- Tested with Chromium on Windows. Safari, Firefox, real-device touch and screen-reader combinations were not exhaustively tested.
- Forms intentionally do not send data. Configure Formspree/Netlify Forms and Mailchimp/ConvertKit before real use.
- Replace demo address, phone, email, store hours, team, testimonials, products, prices, social links and event schedules with verified content.
- Replace canonical and sitemap example URLs and configure a real map.
- Product-detail zoom deliberately uses the same photo at larger size. Related-product routes retain each product's dedicated related-view asset to preserve identity.
- No payment, checkout, live inventory, actual reservation, public deployment or server integration is included.
