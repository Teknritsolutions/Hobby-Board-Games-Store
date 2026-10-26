# Reference analysis

All five supplied entry URLs were accessed successfully through Playwright after the initial web-tool failures. Linked pages were visited without logging in, submitting forms or changing remote data. Scope: the entry pages and their same-repository links exposed from the entry-page anchor inventory; this is not a claim to have discovered every unlinked route.

| Reference                      | Accessible pages read | Entry screenshots               |
| ------------------------------ | --------------------: | ------------------------------- |
| Local Farm / CSA               |                    16 | 1440px desktop and 390px mobile |
| High-End Event Planning        |                    10 | 1440px desktop and 390px mobile |
| Local Indie Bookstore          |                     9 | 1440px desktop and 390px mobile |
| Food Truck                     |                    11 | 1440px desktop and 390px mobile |
| Boutique Yarn and Craft Supply |                    11 | 1440px desktop and 390px mobile |

The inspected page-title and section-heading inventory is in `reference-analysis.json`. Reference screenshots are development QA material under `.qa/references/`, not site assets.

The useful structural principles are a clear navigation hierarchy, restrained content widths, distinct introductory and product sections, consistent card grids, editorial story sections, direct enquiry routes, and a footer that groups navigation by visitor intent. Table & Tale applies these through a shared 1240px container, explicit responsive gutters, equal-height grid cards, varied editorial and product compositions, and one shared navigation/footer source. Its community homepage follows a different progression from its storefront homepage.

Remote theme toggles, every remote dropdown state and remote keyboard behavior were not exhaustively tested. Those behaviors were implemented and tested on the local Table & Tale site. Reference admin, cart, login and registration pages were only read where linked; none of those features were added to Table & Tale.
