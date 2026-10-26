# Page structure

Every main page has one H1, shared navigation/footer and complete semantic content sections. Header, footer, generated modal and noscript notice do not count as major content sections.

| File                         | Major sections | Content                                                                                                                                                                                        |
| ---------------------------- | -------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/index.html`           |             10 | Split hero; five categories; game of the week; four new arrivals; store benefits; game finder promotion; three popular games; three event previews; three demo testimonials; newsletter        |
| `pages/index-2.html`         |             10 | Editorial community hero; play styles; four collections; three editorial staff picks; selection process; featured game night; group sizes; story preview; asymmetric gallery; community signup |
| `pages/about.html`           |              6 | Inner introduction; store story; mission/values; distinguishing benefits; three illustrative team profiles; community CTA                                                                      |
| `pages/products.html`        |              6 | Introduction; category and search/player/age filters; sorting/results; staff recommendations; selection guide; personal game-finder CTA                                                        |
| `pages/product-details.html` |              6 | Product introduction; photograph/enlargement and details; specifications; how to play/features; related games; enquiry CTA                                                                     |
| `pages/recommendations.html` |              6 | Introduction; player-count choices; age choices; interactive finder; deterministic results; personal enquiry CTA                                                                               |
| `pages/events.html`          |              6 | Introduction; featured evening; three sessions; activity types; joining process; session enquiry CTA                                                                                           |
| `pages/event-details.html`   |              5 | Introduction; overview/photo; schedule/information; participation FAQ; interest preview form                                                                                                   |
| `pages/contact.html`         |              6 | Introduction; contact cards/social; map placeholder/hours; contact form; bulk order form; FAQ                                                                                                  |
| `pages/404.html`             |              1 | Custom dice illustration, error message and two recovery actions                                                                                                                               |
| `pages/coming-soon.html`     |              1 | Unique tile illustration, maintenance message, interest form, social and home link                                                                                                             |

## URL selection

- `products.html?category=Strategy` (also Card, Family, Puzzle and RPG).
- `products.html?sort=name`, `price-low` or `price-high`.
- `product-details.html?id=atlas` (also moon, canopy, orbit, bloom, dice, harbor, fox, trail and tower).
- `recommendations.html?players=3-4&age=8-12&category=Family`.
- `event-details.html?id=strategy-evening`, `family-saturday` or `rpg-intro`.
- `contact.html?product=atlas#contact-form` pre-fills a contextual product enquiry.

Missing detail IDs use the featured item. Invalid IDs show a clear fallback, recovery link and noindex metadata. All optional URL values are validated against known data; arbitrary values are never interpolated into HTML.
