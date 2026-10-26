# Customization and integration

## Design system

Change the central tokens in `assets/css/style.css`: container width, 8px-based spacing, gutters, section padding, grid gap, card padding, radii, type scale, header height and button height. Dark tokens live in `dark-mode.css`; responsive adaptations in `responsive.css`. Outfit is used for headings and Inter for body text. Both are self-hosted Latin WOFF2 fonts with included OFL licenses.

The primary logo geometry is defined in `scripts/brand.cjs` and the header mark in `scripts/build.cjs`. SVG files are included under `assets/icons/`. If changing identity, update both sources and regenerate PNG/ICO icons with your preferred image tool.

## Content and shared components

`scripts/build.cjs` is the source for all page sections, shared header and footer, metadata and generated product/event detail content. Rebuild after editing. You may edit delivered HTML directly if you do not intend to rebuild.

`assets/js/data.js` owns games, event information, category names, filter predicates and card rendering. Each game has a stable ID, category, USD sample price, minimum and maximum players, recommended minimum age, duration, description, features and introduction steps. Add the required image variants when adding a game. Update page-specific featured selections in the builder as necessary.

## Recommendation semantics

- `1` and `2` require support for that exact count.
- `3-4` and `5-6` require support for the full selected range.
- `7+` means 7–8 for this dataset. Expand the range and wording together if adding larger-group games.
- Ages 5–7, 8–12 and 13–17 match against the youngest age in the range (5, 8 and 13).
- Adults match a minimum recommended age of 18 or below.
- All ages means ages 5+ in this collection, and only matches products with a minimum age of 5 or below.
- Blank preferences apply no restriction. Results are never random.

## Formspree / Netlify Forms

Current `forms.js` deliberately prevents submission and never sends or stores personal data. It displays an explicit demo confirmation after validation. To enable a real integration:

1. Select and configure your own Formspree or Netlify account.
2. Set each form's real `action`, `method="POST"`, stable form name and field names.
3. For Netlify, add `data-netlify="true"` and the matching hidden `form-name` input to the static generated HTML.
4. Replace the demo branch in `forms.js` with a provider submission only after local validation succeeds.
5. Display success only after a successful provider response; preserve user input and show a useful error when submission fails.
6. Replace the demo consent copy with your actual privacy information and legal basis. Provide a real privacy policy.
7. Test provider spam controls and delivery on your hosting account. Never put a private API key in frontend JavaScript.

## Mailchimp / ConvertKit

Use your provider's supported embedded form action or a secure backend integration. Replace newsletter submission behavior and consent copy, then verify success, failure and unsubscribe behavior. Do not change demo feedback to a delivery claim without a confirmed provider response.

## Store, social and map

Replace the square-bracket address, `.example` email, fictional phone number and opening hours in the builder. Change social platform homepage URLs to verified profiles. Replace the accessible map placeholder with a real embed or directions link for a verified store address. Give an iframe a useful title and retain a text address; load maps on demand where practical.

## RTL and accessibility

Set `<html dir="rtl">` to use the supplied RTL rules. Logical properties preserve spacing. Images are not mirrored. If localizing beyond Latin, supply an appropriately licensed font subset. Retain the skip link, heading hierarchy, labels, focus states, button semantics and reduced-motion rules. Menus open by click or ArrowDown, close with Escape, and support touch.
