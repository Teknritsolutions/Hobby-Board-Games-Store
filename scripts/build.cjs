/* Build complete static pages. No runtime fetch or framework is required. */
const fs = require("node:fs");
const path = require("node:path");
const D = require("../assets/js/data.js");
const { products, events, categories, money, escape: esc, card } = D;
const root = path.resolve(__dirname, "..");
const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), value, "utf8");
};
const icon = (name, cls = "") => {
    const shapes = {
        dice: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" stroke-width="3"/>',
        card: '<rect x="7" y="3" width="13" height="18" rx="2"/><path d="M4 6v12a2 2 0 0 0 2 2m8-12 3 4-3 4-3-4z"/>',
        people: '<circle cx="9" cy="7" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-2-4"/>',
        puzzle: '<path d="M4 4h5a3 3 0 1 1 6 0h5v5a3 3 0 1 0 0 6v5h-5a3 3 0 1 0-6 0H4v-5a3 3 0 1 1 0-6z"/>',
        mountain: '<path d="m2 20 7-13 4 7 3-5 6 11zM7 11l2 2 2-2"/>',
        star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.6l6.2-.9z"/>',
        heart: '<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 4 1 9 8 15 7-6 12-11 8-15z"/>',
        check: '<path d="m5 12 4 4L19 6"/>',
        moon: '<path d="M20 14a8 8 0 0 1-10-10 9 9 0 1 0 10 10z"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        close: '<path d="m6 6 12 12M6 18 18 6"/>',
        location:
            '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        book: '<path d="M12 5v16M3 3c5 0 7 1 9 3 2-2 4-3 9-3v15c-5 0-7 1-9 3-2-2-4-3-9-3z"/>',
        zoom: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6m-3-3v6"/>',
        arrow: '<path d="M12 20V4m-6 6 6-6 6 6"/>',
        gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-8 0-8-7-4-6 3 0 4 6 4 6s1-6 4-6c4-1 4 6-4 6z"/>',
    };
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] || shapes.dice}</svg>`;
};
const mark =
    '<svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="m22 2 19 11v20L22 44 3 33V13z" fill="currentColor"/><path d="m9 15 13-7 13 7-13 8z" fill="#faf8f4"/><path d="M9 20v10l10 6V26z" fill="#d99a36"/><path d="m25 26 10-6v10l-10 6z" fill="#faf8f4"/><circle cx="22" cy="15" r="2.7" fill="#343b78"/></svg>';
const logo = `<a class="logo" href="index.html">${mark}<span>Table & Tale<small>Games & good company</small></span></a>`;
const link = (url, text, cls = "text-link") =>
    `<a class="${cls}" href="${url}">${text}<span class="arrow" aria-hidden="true">↗</span></a>`;
const image = (file, alt, cls = "", eager = false) =>
    `<img src="../assets/images/${file}.webp" alt="${esc(alt)}" width="1200" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}${cls ? ` class="${cls}"` : ""}>`;
const eyebrow = (text) => `<span class="eyebrow">${text}</span>`;
const heading = (tag, title, description = "", extra = "") =>
    `<div class="section-heading"><div>${eyebrow(tag)}<h2>${title}</h2></div>${description ? `<p>${description}</p>` : ""}${extra}</div>`;
const section = (label, content, cls = "") =>
    `\n<!-- ${label} -->\n<section class="section ${cls}" aria-label="${label}"><div class="container">${content}</div></section>`;
const intro = (title, text, tag = "Make room for play") =>
    `<section class="inner-hero"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>${title}</span></nav>${eyebrow(tag)}<h1>${title}</h1><p class="lead">${text}</p></div></section>`;
const categoryIcons = ["mountain", "card", "people", "puzzle", "dice"];
const categoryName = (c) =>
    c === "RPG" ? "RPG accessories" : c === "Puzzle" ? "Puzzles" : `${c} games`;
const cards = (items, view = "catalog", cls = "grid-4") =>
    `<div class="grid ${cls} product-grid">${items.map((p) => card(p, view)).join("")}</div>`;
const cta = (title, text, url = "contact.html", action = "Let’s talk games") =>
    section(
        "Let’s find your next game",
        `<div class="cta-band"><div><h2>${title}</h2><p>${text}</p></div>${link(url, action, "btn")}</div>`,
    );
const featureItems = [
    [
        "star",
        "Considered, not crowded",
        "A thoughtful selection, with a reason behind every game on the shelf.",
    ],
    [
        "book",
        "A little guidance goes far",
        "Clear player counts, age guides and play times to help you choose.",
    ],
    [
        "people",
        "Everyone gets a seat",
        "From first-time players to seasoned strategists, there’s a table for you.",
    ],
    [
        "heart",
        "More than a game box",
        "Shared stories, small discoveries and the joy of time spent together.",
    ],
];
const benefits = () =>
    `<div class="grid grid-4 benefits-grid">${featureItems.map(([ic, title, text]) => `<article class="feature"><span class="feature-icon">${icon(ic)}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
const steps = (
    items = [
        [
            "Find your people",
            "Start with the number of players and the youngest age at your table.",
        ],
        [
            "Pick your pace",
            "A quick warm-up or a long, thoughtful evening? Choose your time together.",
        ],
        ["Follow your curiosity", "Try a familiar favourite or let a new play style surprise you."],
    ],
) =>
    `<div class="grid grid-3">${items.map(([title, text], i) => `<article class="process"><span class="number">0${i + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
const faq = (items) =>
    items
        .map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`)
        .join("");
const eventCard = (e) =>
    `<article class="event-card"><div class="date-tile"><span>${e.month}</span><div class="date-day">${e.day}</div><span>2026</span></div><div class="stack"><span class="pill">${e.category}</span><h3 class="mt-16">${e.title}</h3><div class="meta"><span>${e.time}</span></div><p>Demo · Table & Tale community table<br>${e.description.split(".")[0]}.</p>${link(`event-details.html?id=${e.id}`, "Session details")}</div></article>`;
const social =
    '<div class="social-links" aria-label="Social platforms"><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram platform (demo link)">Instagram ↗</a><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook platform (demo link)">Facebook ↗</a></div>';
let formIndex = 0;
const newsletterForm = () => {
    const id = `newsletter-${++formIndex}`;
    return `<form class="newsletter-form demo-form" novalidate data-kind="newsletter"><div class="field"><label for="${id}">Your email address</label><div class="inline-form"><input id="${id}" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="254"><button class="btn btn-light" type="submit">Count me in <span aria-hidden="true">↗</span></button></div></div><label class="check-label"><input type="checkbox" name="consent" required> I agree to receive game news and can unsubscribe at any time.</label><p class="form-status" role="status" aria-live="polite"></p><span class="small">Template demo. Your email is not sent or stored.</span></form>`;
};
const newsletter = (alternative = false) =>
    alternative
        ? section(
              "Join the community",
              `<div class="narrow">${eyebrow("There’s always room for one more")}<h2>Good company starts here.</h2><p>Fresh discoveries, thoughtful game guides and a little inspiration for your next night around the table.</p>${newsletterForm()}</div>`,
              "join-community",
          )
        : section(
              "Community newsletter",
              `<div class="newsletter"><div>${eyebrow("A little more play in your inbox")}<h2>Your next favourite.<br>Before everyone else’s.</h2><p>New discoveries, table talk and game night inspiration. A thoughtful note, never a crowded inbox.</p></div>${newsletterForm()}</div>`,
          );
const options = (values, first) =>
    `<option value="">${first}</option>${values.map(([v, label]) => `<option value="${v}">${label}</option>`).join("")}`;
const playerOptions = [
    ["1", "1 player"],
    ["2", "2 players"],
    ["3-4", "3–4 players"],
    ["5-6", "5–6 players"],
    ["7+", "7+ players"],
];
const ageOptions = [
    ["5-7", "Ages 5–7"],
    ["8-12", "Ages 8–12"],
    ["13-17", "Ages 13–17"],
    ["18", "Adults"],
    ["all", "All ages (5+)"],
];
const field = (id, label, type = "text", extra = "") =>
    `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" required ${extra}></div>`;
const messageField = (id) =>
    `<div class="field full"><label for="${id}">Tell us a little more</label><textarea id="${id}" name="message" required minlength="10" maxlength="3000" placeholder="What would you like to know?"></textarea></div>`;
const consent =
    '<label class="check-label full"><input type="checkbox" name="consent" required> I understand this is a demo form and no message or reservation will be sent.</label>';
const submit = (label) =>
    `<div class="full"><button class="btn" type="submit">${label} <span aria-hidden="true">↗</span></button><p class="form-status" role="status" aria-live="polite"></p></div>`;
const contactForm = () =>
    `<form class="demo-form form-box" novalidate data-kind="contact"><div class="form-grid">${field("contact-name", "Full name", "text", 'autocomplete="name" minlength="2" maxlength="100"')}${field("contact-email", "Email address", "email", 'autocomplete="email" maxlength="254"')}<div class="field full"><label for="contact-subject">What can we help with?</label><select id="contact-subject" name="subject" required>${options(
        [
            ["game", "Choosing a game"],
            ["event", "Game nights"],
            ["product", "Product enquiry"],
            ["other", "Something else"],
        ],
        "Choose a topic",
    )}</select></div>${messageField("contact-message")}${consent}${submit("Preview my enquiry")}</div></form>`;
const registrationForm = () =>
    `<form class="demo-form form-box" novalidate data-kind="event"><div class="form-grid">${field("event-name", "Full name", "text", 'autocomplete="name" minlength="2" maxlength="100"')}${field("event-email", "Email address", "email", 'autocomplete="email" maxlength="254"')}${field("event-guests", "Number of players", "number", 'min="1" max="8" step="1"')}<div class="field"><label for="event-experience">Your experience</label><select id="event-experience" name="experience" required>${options(
        [
            ["new", "First time at the table"],
            ["some", "A few games under my belt"],
            ["regular", "Regular player"],
        ],
        "Choose an option",
    )}</select></div><div class="field full"><label for="event-notes">Access needs or questions (optional)</label><textarea id="event-notes" name="notes" maxlength="2000"></textarea></div>${consent}${submit("Preview my interest")}</div></form>`;
const bulkForm = () =>
    `<form class="demo-form form-box" novalidate data-kind="bulk"><div class="form-grid">${field("bulk-name", "Full name", "text", 'autocomplete="name" minlength="2" maxlength="100"')}${field("bulk-organization", "Business or organization", "text", 'autocomplete="organization" minlength="2" maxlength="150"')}${field("bulk-email", "Email address", "email", 'autocomplete="email" maxlength="254"')}${field("bulk-phone", "Phone number", "tel", 'autocomplete="tel" pattern="[+0-9() .-]{7,25}"')}<div class="field"><label for="bulk-category">Product or game category</label><select id="bulk-category" name="category" required>${options(
        categories.map((c) => [c, categoryName(c)]),
        "Choose a category",
    )}</select></div>${field("bulk-quantity", "Estimated quantity", "number", 'min="10" max="10000" step="1"')}${field("bulk-date", "Required date", "date", "data-future-date")}<div class="field"><label for="bulk-product">Specific game (optional)</label><input id="bulk-product" name="product" maxlength="150"></div>${messageField("bulk-details")}${consent}${submit("Preview bulk enquiry")}</div></form>`;
const dropdown = (label, items, active) =>
    `<li class="nav-item"><button class="nav-trigger${active ? " active" : ""}" type="button" aria-expanded="false" aria-controls="nav-${label.replace(/ /g, "-").toLowerCase()}">${label}<span class="chevron" aria-hidden="true"></span></button><ul class="dropdown" id="nav-${label.replace(/ /g, "-").toLowerCase()}">${items.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join("")}</ul></li>`;
const header = (page) =>
    `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner">${logo}<nav class="main-nav" id="main-nav" aria-label="Main navigation"><ul class="nav-list">${dropdown(
        "Home",
        [
            ["index.html", "Home Page 1"],
            ["index-2.html", "Home Page 2"],
        ],
        page.startsWith("index"),
    )}<li class="nav-item"><a href="about.html"${page === "about" ? ' aria-current="page"' : ""}>About Us</a></li>${dropdown("Products", [["products.html", "All Products"], ["product-details.html?id=atlas", "Product Details"], ...categories.map((c) => [`products.html?category=${c}`, categoryName(c)])], page.includes("product"))}<li class="nav-item"><a href="recommendations.html"${page === "recommendations" ? ' aria-current="page"' : ""}>Recommendations</a></li>${dropdown(
        "Game Nights",
        [
            ["events.html", "Upcoming Events"],
            ["event-details.html?id=strategy-evening", "Event Details"],
        ],
        page.includes("event"),
    )}<li class="nav-item"><a href="contact.html"${page === "contact" ? ' aria-current="page"' : ""}>Contact Us</a></li></ul></nav><div class="header-actions"><button type="button" class="icon-button theme-toggle" aria-label="Switch to dark theme">${icon("moon")}</button>${link("products.html", "Explore Games", "btn btn-small")}<button type="button" class="icon-button menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">${icon("menu")}</button></div></div></header>`;
const footer = () =>
    `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand">${logo}<p>Good games bring us together.<br>Find a new favourite. Make a little time.<br>Pull up a chair.</p>${social}</div><div><h2>Find your game</h2><ul class="footer-links">${categories.map((c) => `<li><a href="products.html?category=${c}">${categoryName(c)}</a></li>`).join("")}</ul></div><div><h2>Around the table</h2><ul class="footer-links"><li><a href="about.html">Our story</a></li><li><a href="recommendations.html">Game finder</a></li><li><a href="events.html">Game nights</a></li><li><a href="contact.html">Get in touch</a></li><li><a href="coming-soon.html">Coming soon</a></li><li><a href="404.html">404 page</a></li></ul></div><div><h2>A place for good company</h2><p class="small">This is a demonstration store.<br>Replace contact details before launch.</p><ul class="footer-links"><li><a href="contact.html#visit">Visit & opening hours</a></li><li><a href="contact.html#bulk">Bulk order enquiries</a></li><li><a href="../documentation/installation.md">Template documentation</a></li></ul></div></div><div class="footer-bottom"><span>© 2026 Table & Tale. Demonstration HTML template.</span><span>Made for the moments around the table.</span></div></div></footer><button type="button" class="icon-button back-top" aria-label="Back to top" hidden>${icon("arrow")}</button>`;
const pages = {};
pages.index = {
    title: "Table & Tale — Good games. Great company.",
    description:
        "Discover a thoughtfully curated world of strategy games, family favourites, puzzles and tabletop adventures at Table & Tale.",
    body:
        `<section class="hero"><div class="container split"><div>${eyebrow("For the love of the game")}<h1>Good games.<br><em>Great company.</em></h1><p class="lead">A clever move. A shared laugh. One more round.<br>Discover thoughtfully chosen games that turn a little time together into something memorable.</p><div class="actions">${link("products.html", "Find your next game", "btn")}${link("events.html", "Pull up a chair", "btn btn-outline")}</div><div class="hero-foot"><span>${icon("check")}Thoughtfully curated</span><span>${icon("check")}For every kind of player</span></div></div><div class="hero-image">${image("home/tabletop-hero", "Hands exploring an original terrain strategy game with indigo and amber wooden pieces", "", true)}<div class="hero-note">${icon("dice")}<div><strong>A little less screen time.</strong><span>A little more face-to-face time.</span></div></div></div></div></section>` +
        section(
            "Featured game categories",
            `${heading("Your table, your kind of play", "What’s your next move?", "", "")}<div class="grid grid-5">${categories.map((c, i) => `<a class="category-card" href="products.html?category=${c}">${icon(categoryIcons[i])}<div><h3>${c === "RPG" ? "Roleplaying" : c === "Puzzle" ? "Puzzles" : c}</h3><small>${["Think a little deeper", "Deal in the fun", "Bring everyone in", "Find your flow", "Tell a new story"][i]}</small></div></a>`).join("")}</div>`,
            "section-sm line-top",
        ) +
        section(
            "Game of the week",
            `<div class="spotlight"><div class="spotlight-image">${image("home/weekly-atlas", "Atlas of the Wild terrain map, game box and wooden explorers")}</div><div class="spotlight-content">${eyebrow("On our table this week")}<h2>A world worth<br>getting lost in.</h2><h3>Atlas of the Wild</h3><p>${products[0].description}</p><div class="meta"><span>${icon("people")}1–4 players</span><span>${icon("clock")}60–90 min</span><span>Ages 12+</span></div><div class="actions"><span class="price">${money(54)}</span>${link("product-details.html?id=atlas", "Explore the game", "btn")}</div></div></div>`,
        ) +
        section(
            "New arrivals",
            `${heading("Fresh on the shelf", "New games. New possibilities.", "", link("products.html", "Browse all games"))}${cards(products.slice(0, 4), "home")}`,
        ) +
        section(
            "Why choose our store",
            `${heading("A good game is just the beginning", "A small store. A lot of heart.", "We believe the best games make room for everyone. Here’s how we help you find yours.")}${benefits()}`,
            "surface",
        ) +
        section(
            "Find your perfect game",
            `<div class="split"><div>${eyebrow("Less searching, more playing")}<h2>There’s a game<br>with your name on it.</h2><p class="lead">Two players or a full house? Five minutes or a whole evening? Let’s find something that feels right for your table.</p><div class="meta"><span>${icon("people")}Start with your group</span><span>${icon("heart")}Choose by age</span></div><div class="actions mt-24">${link("recommendations.html", "Find my kind of game", "btn")}</div></div>${image("home/find-your-game", "Friends choosing a game together from a boutique shelf")}</div>`,
        ) +
        section(
            "Popular games",
            `<div class="popular-layout"><div class="popular-intro">${eyebrow("The ones we come back to")}<h2>One more round?<br>Always.</h2><p>Comforting favourites and conversation starters. Games that earn a permanent place at the table.</p>${link("products.html?sort=popular", "Meet the favourites", "btn btn-light")}</div><div class="popular-list">${products
                .slice(4, 7)
                .map((p) => card(p, "home"))
                .join("")}</div></div>`,
        ) +
        section(
            "Upcoming game nights",
            `${heading("Find your people", "A seat at the table.", "", link("events.html", "All game nights"))}<p class="notice">Illustrative November 2026 sessions. Demo schedules and venue; no real reservations.</p><div class="grid grid-3 events-grid">${events.map(eventCard).join("")}</div>`,
            "soft",
        ) +
        section(
            "Player testimonials",
            `${heading("Around our table", "Little moments. Lasting memories.", "Illustrative player stories for this demonstration template.")}<div class="grid grid-3">${[
                [
                    "Finally, a game our whole family wants to play. The simple age guides made choosing something for our youngest feel easy.",
                    "Alex R.",
                    "Family game explorer",
                ],
                [
                    "We came for a strategy game and stayed for the conversation. A welcoming place to discover a new favourite with friends.",
                    "Jamie L.",
                    "Strategy game enthusiast",
                ],
                [
                    "I had never played an RPG before. The friendly session guide made that first adventure feel like a natural place to start.",
                    "Sam T.",
                    "First-time adventurer",
                ],
            ]
                .map(
                    ([q, n, t]) =>
                        `<article class="quote-card"><div class="stars" role="img" aria-label="Illustrative five out of five stars">★★★★★</div><blockquote>“${q}”</blockquote><div class="quote-author"><span class="avatar">${n
                            .split(" ")
                            .map((x) => x[0])
                            .join(
                                "",
                            )}</span><div><strong>${n}</strong><br><span class="muted">${t} · Demo</span></div></div></article>`,
                )
                .join("")}</div>`,
        ) +
        newsletter(),
};
pages["index-2"] = {
    title: "The Table Is Open — Table & Tale Community",
    description:
        "Find your people and a new way to play. Explore curated tabletop collections, staff picks and welcoming demonstration game nights.",
    body:
        `<section class="editorial-hero"><div class="container">${eyebrow("Good people. A shared table.")}<h1>Some of the best stories<br>start with “your turn”.</h1><p class="lead">For the curious, the competitive and the just-here-for-the-company. Find your people. Discover your next game.</p><div class="actions">${link("events.html", "Join a game night", "btn")}${link("products.html", "Discover the collection", "btn btn-outline")}</div>${image("home-2/community-hero", "Four friends sharing a board game at a warmly lit communal table", "", true)}</div></section>` +
        section(
            "Discover by play style",
            `<div class="split"><div>${eyebrow("How do you like to play?")}<h2>Follow your<br>kind of fun.</h2><p>There’s no right way to spend an evening. Only the way that brings your table together.</p></div><div>${[
                ["Strategy lovers", "Meaningful moves. Satisfying discoveries.", "Strategy"],
                ["Casual players", "Easy to learn. Hard to put away.", "Family"],
                ["Party groups", "Good laughs and a little friendly rivalry.", "Card"],
                ["Puzzle fans", "Find a little quiet in the pieces.", "Puzzle"],
            ]
                .map(
                    ([t, d, c]) =>
                        `<a class="style-row" href="products.html?category=${c}"><div><h3>${t}</h3><p>${d}</p></div><span class="arrow" aria-hidden="true">↗</span></a>`,
                )
                .join("")}</div></div>`,
        ) +
        section(
            "Curated collections",
            `${heading("A shelf for every occasion", "A little inspiration for your table.")}<div class="grid grid-2">${[
                [
                    "book",
                    "An easy first turn",
                    "Approachable favourites for a new player.",
                    "recommendations.html?age=8-12",
                ],
                [
                    "heart",
                    "The family weekend",
                    "Make a little time for everyone.",
                    "products.html?category=Family",
                ],
                [
                    "mountain",
                    "Something to think about",
                    "Layered choices for your strategy night.",
                    "products.html?category=Strategy",
                ],
                [
                    "people",
                    "The more, the merrier",
                    "Conversation starters for a full house.",
                    "recommendations.html?players=7%2B",
                ],
            ]
                .map(
                    ([ic, t, d, u]) =>
                        `<a class="collection" href="${u}">${icon(ic)}<div><h3>${t}</h3><p>${d}</p></div><span class="arrow" aria-hidden="true">↗</span></a>`,
                )
                .join("")}</div>`,
            "soft",
        ) +
        section(
            "Staff picks",
            `${heading("From our table to yours", "A few personal favourites.", "Demo recommendations from our fictional store team.")}${[
                [
                    products[0],
                    "Mara",
                    "For the moment a map opens up and you realise there are three wonderful ways forward.",
                ],
                [
                    products[7],
                    "Ellis",
                    "A gentle way to turn a family evening into a story nobody could have planned.",
                ],
                [
                    products[8],
                    "Jules",
                    "A little pocket of calm. Just you, a winding trail and one satisfying solution.",
                ],
            ]
                .map(
                    ([p, n, t], i) =>
                        `<article class="staff-pick"><span class="number">0${i + 1}</span><div><span class="eyebrow">${n}’s pick · ${p.category}</span><h3>${p.name}</h3><p>${t}</p></div>${link(`product-details.html?id=${p.id}`, money(p.price) + " · Explore")}</article>`,
                )
                .join("")}`,
        ) +
        section(
            "How to choose a game",
            `${heading("Your next favourite, in three steps", "A good place to start.")}${steps()}`,
        ) +
        section(
            "Featured community game night",
            `<div class="split">${image("home-2/featured-night", "Friends planning a strategy move together over a coastal board game")}<div>${eyebrow("An evening well spent")}<h2>A new game.<br>A familiar feeling.</h2><p>There’s something about sitting down with people who love a good game. Our hosted strategy evening makes the first turn easy.</p><p class="notice">Demo event · November 6, 2026 · 6:30–9:00 PM<br>Table & Tale community table · Location to be configured</p>${link("event-details.html?id=strategy-evening", "Meet your next game night", "btn")}</div></div>`,
            "soft",
        ) +
        section(
            "Games for every group",
            `${heading("Bring your people", "How many around your table?")}<div class="grid grid-4">${[
                [
                    "02",
                    "Just the two of you",
                    "A shared challenge. A little friendly competition.",
                    "2",
                ],
                [
                    "3–4",
                    "Your regular crew",
                    "Bring something new to your next get-together.",
                    "3-4",
                ],
                ["5–6", "The whole family", "Keep everyone involved from the first turn.", "5-6"],
                ["7+", "A very full house", "Big laughs and room for one more.", "7+"],
            ]
                .map(
                    ([n, t, d, p]) =>
                        `<article class="group-card"><span class="number">${n}</span><h3>${t}</h3><p>${d}</p>${link(`recommendations.html?players=${encodeURIComponent(p)}`, "Find your game")}</article>`,
                )
                .join("")}</div>`,
        ) +
        section(
            "Store story preview",
            `<div class="split"><div>${eyebrow("A place to belong")}<h2>Built around<br>the table.</h2><p class="lead">Table & Tale is a fictional little store with a simple idea: a good game is a lovely excuse to spend time together.</p><p>Our template imagines a welcoming space for curious beginners, thoughtful collectors and anyone who has ever said “shall we play something?”</p>${link("about.html", "Read our story")}</div>${image("home-2/store-story", "Sunlit board game boutique with an inviting wooden communal table")}</div>`,
        ) +
        section(
            "Community moments",
            `${heading("The in-between moments", "Less scrolling. More stories.", "Original AI-created imagery illustrates the community we imagine.")}<div class="gallery">${image("home-2/moment-one", "Two friends laughing during a card game")}${image("home-2/moment-two", "Amber dice rolling on an indigo felt mat")}${image("home-2/moment-three", "A family sharing a woodland animal game")}</div>`,
        ) +
        newsletter(true),
};
pages.about = {
    title: "Our Story — Table & Tale",
    description:
        "Meet the idea behind Table & Tale: a fictional independent board game boutique built around thoughtful choices and welcoming tables.",
    body:
        intro(
            "A small store.<br>A shared love of play.",
            "We’re here for the clever moves, the unexpected laughs and the people on the other side of the board.",
            "The story behind the shelf",
        ) +
        section(
            "Our story",
            `<div class="split">${image("about/our-story", "An inviting independent tabletop game store with natural wooden shelves")}<div>${eyebrow("It started with “one more game”")}<h2>Good things happen<br>around a table.</h2><p>Imagine a place where choosing a game feels like a conversation with a friend. Somewhere to ask the small questions, discover something unexpected and feel welcome to stay a while.</p><p>That’s the idea behind Table & Tale. This demonstration boutique brings together a considered collection of original sample games and the kind of guidance we’d want for our own tables.</p><p class="small">Table & Tale is a fictional store created for this template. Stories, team profiles and customer quotes are illustrative.</p></div></div>`,
        ) +
        section(
            "Mission and values",
            `${heading("What brings us together", "More room for play.")}<div>${[
                [
                    "Curiosity before expertise",
                    "You don’t need to know the rules to belong here. Good questions are the beginning of good discoveries.",
                ],
                [
                    "Care in every choice",
                    "A small, thoughtful shelf makes choosing easier. We explain who a game suits, how long it takes and what makes it interesting.",
                ],
                [
                    "Company over competition",
                    "Winning is fun. Making everyone feel part of the game matters more. Our tables make room for different ages, paces and play styles.",
                ],
            ]
                .map(([t, d]) => `<article class="value-line"><h3>${t}</h3><p>${d}</p></article>`)
                .join("")}</div>`,
            "soft",
        ) +
        section(
            "What makes us different",
            `${heading("A thoughtful way to play", "A little guidance. A warm welcome.")}${benefits()}`,
        ) +
        section(
            "Meet our team",
            `${heading("The people behind the picks", "Always happy to talk games.", "Illustrative team members. Portraits are AI-generated for this template.")}<div class="grid grid-3">${[
                [
                    "mara",
                    "Mara Bennett",
                    "The thoughtful curator",
                    "Loves a game with a beautiful map, an interesting choice and a gentle learning curve.",
                ],
                [
                    "ellis",
                    "Ellis Parker",
                    "The community host",
                    "Keeps the table welcoming, the rules approachable and the next round ready to go.",
                ],
                [
                    "jules",
                    "Jules Morgan",
                    "The adventure guide",
                    "Believes the best stories are the ones a table discovers together, one choice at a time.",
                ],
            ]
                .map(
                    ([id, n, t, d]) =>
                        `<article class="team-card">${image(`about/team-${id}`, `AI-created illustrative portrait of ${n}`)}<h3>${n}</h3><p><strong>${t}</strong></p><p>${d}</p></article>`,
                )
                .join("")}</div>`,
            "surface",
        ) +
        cta(
            "There’s a place for you here.",
            "Discover a game night, ask for a recommendation or simply follow your curiosity.",
            "events.html",
            "Find a game night",
        ),
};
const categoryChips = (attribute = "data-category") =>
    `<div class="filter-chips" role="group" aria-label="Game categories"><button type="button" class="chip" ${attribute}="" aria-pressed="true">All games</button>${categories.map((c) => `<button type="button" class="chip" ${attribute}="${c}" aria-pressed="false">${categoryName(c)}</button>`).join("")}</div>`;
const selectionGuide = () =>
    section(
        "Game selection guide",
        `${heading("Choose with confidence", "A game that fits your evening.")}${steps()}`,
        "soft",
    );
pages.products = {
    title: "Explore All Games — Table & Tale",
    description:
        "Search and filter ten original demonstration games by category, player count, age and price. Discover the right game for your table.",
    body:
        intro(
            "Find your next<br>“one more round”.",
            "From thoughtful strategy to wonderfully silly evenings. A considered collection for every kind of table.",
            "The game shelf",
        ) +
        section(
            "Category navigation and filters",
            `${categoryChips()}<form id="catalog-filters" class="filter-layout"><div class="field"><label for="search">Search the shelf</label><input id="search" name="search" type="search" placeholder="Game name or a little inspiration"></div><div class="field"><label for="catalog-players">Players</label><select name="players" id="catalog-players">${options(playerOptions, "Any group size")}</select></div><div class="field"><label for="catalog-age">Youngest player</label><select name="age" id="catalog-age">${options(ageOptions, "Any age rating")}</select></div><button class="btn btn-outline" type="reset">Clear filters</button></form>`,
            "section-sm",
        ) +
        section(
            "Search sorting and results",
            `<div class="catalog-toolbar"><div><h2>Good games, thoughtfully chosen.</h2><p id="result-count" role="status" aria-live="polite">10 games to discover · Sample USD prices</p></div><div class="field"><label for="sort">Sort the shelf</label><select id="sort" name="sort"><option value="featured">Featured first</option><option value="name">Name: A to Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div></div><div id="catalog-results">${cards(products)}</div>`,
        ) +
        section(
            "Staff recommended products",
            `${heading("Not sure where to begin?", "Two good places to start.")}<div class="grid grid-2"><article class="info-card"><span class="pill">For a thoughtful evening</span><h3 class="mt-20">Atlas of the Wild</h3><p>A modular wilderness, a satisfying puzzle and a new journey every time. 1–4 players, ages 12+.</p>${link("product-details.html?id=atlas", "Meet Mara’s favourite")}</article><article class="info-card"><span class="pill">For the whole family</span><h3 class="mt-20">Little Canopy</h3><p>A gentle woodland adventure that gives younger players a place at the table. 2–4 players, ages 5+.</p>${link("product-details.html?id=canopy", "Meet the family favourite")}</article></div>`,
        ) +
        selectionGuide() +
        cta(
            "A little help choosing?",
            "Tell us who’s playing and what you enjoy. Start with the game finder or preview a personal enquiry.",
            "recommendations.html",
            "Find my game",
        ),
};
const productDetailsBody = (p) =>
    intro(p.name, p.description, `${categoryName(p.category)} · Original demo game`) +
    section(
        "Product gallery and details",
        `<div class="split"><div class="product-gallery">${image(`products/${p.id}-detail`, `${p.name} open box and original playing components`)}<button class="icon-button" type="button" data-open-gallery aria-label="Enlarge ${p.name} product photograph">${icon("zoom")}</button></div><div><span class="pill">${p.badge}</span><h2>Your next table favourite.</h2><div class="detail-price price">${money(p.price)}</div><p>Sample price in USD. This is a fictional demonstration product, with no live inventory or online checkout.</p><dl class="detail-specs"><div><dt>Players</dt><dd>${p.min}–${p.max}</dd></div><div><dt>Age guide</dt><dd>${p.age}+ years</dd></div><div><dt>Play time</dt><dd>${p.duration}</dd></div></dl>${link(`contact.html?product=${p.id}#contact-form`, "Enquire about this game", "btn")}<p class="small mt-20">Explore the details, then ask us anything.</p></div></div><dialog id="product-gallery"><button type="button" class="icon-button" data-close-gallery aria-label="Close product photograph">${icon("close")}</button><img data-gallery-image alt="Enlarged product photograph" width="1200" height="1200"></dialog>`,
    ) +
    section(
        "Gameplay overview and specifications",
        `<div class="split"><div>${eyebrow("A closer look")}<h2>A little about the experience.</h2><p class="lead">${p.description}</p><p>These specifications describe an original sample product created for this template. Check the final manufacturer guidance when adding real products.</p></div><div><table class="spec-table"><caption class="visually-hidden">${p.name} specifications</caption><tbody>${[
            ["Category", categoryName(p.category)],
            ["Players", `${p.min}–${p.max}`],
            ["Recommended age", `${p.age}+`],
            ["Typical session", p.duration],
            [
                "Product format",
                p.id === "dice"
                    ? "Dice set and case"
                    : p.category === "Puzzle"
                      ? "Tabletop puzzle"
                      : "Boxed tabletop game",
            ],
            ["Price", `${money(p.price)} USD · Sample`],
        ]
            .map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`)
            .join("")}</tbody></table></div></div>`,
        "soft",
    ) +
    section(
        "How to play and features",
        `${heading("Your first turn", "Easy to begin. Lovely to return to.")}<div class="grid grid-3">${p.steps.map((s, i) => `<article class="process"><span class="number">0${i + 1}</span><h3>${["Set the scene", "Find your rhythm", "Enjoy the discovery"][i]}</h3><p>${s}</p></article>`).join("")}</div><div class="grid grid-3 mt-40">${p.features.map((f) => `<div class="feature-row"><span class="feature-icon">${icon("check")}</span><p>${f}</p></div>`).join("")}</div>`,
    ) +
    section(
        "Related games",
        `${heading("Keep exploring", "Something else you might love.")}${cards(products.filter((x) => x.id !== p.id).slice(0, 3), "related", "grid-3")}`,
    ) +
    cta(
        "Curious about the details?",
        "A player count, a gift idea or something specific about this game — we’re happy to help.",
        "contact.html?product=" + p.id + "#contact-form",
        "Ask about this game",
    );
pages["product-details"] = {
    title: "Atlas of the Wild — Product Details — Table & Tale",
    description:
        "Explore the original demo game Atlas of the Wild, including player counts, age guidance, play time, features and sample pricing.",
    body: productDetailsBody(products[0]),
};
pages.recommendations = {
    title: "Find Your Perfect Game — Table & Tale",
    description:
        "Choose your player count, youngest age and preferred play style. Our game finder matches actual ranges from the demonstration product collection.",
    body:
        intro(
            "Your table.<br>Your kind of game.",
            "Start with the people you’re playing with. We’ll help you find a little inspiration for your next turn.",
            "The game finder",
        ) +
        section(
            "Find games by player count",
            `${heading("First, gather your people", "How many seats at the table?")}<div class="filter-chips" role="group" aria-label="Choose a player count">${playerOptions.map(([v, t]) => `<button type="button" class="chip" data-finder-players="${v}" aria-pressed="false">${t}</button>`).join("")}</div><p class="small">Group ranges match games that support every player count in that range. “7+” matches 7–8 players in this sample collection.</p>`,
            "section-sm",
        ) +
        section(
            "Discover games by age group",
            `${heading("Make room for everyone", "Who’s the youngest player?")}<div class="filter-chips" role="group" aria-label="Choose an age group">${ageOptions.map(([v, t]) => `<button type="button" class="chip" data-finder-age="${v}" aria-pressed="false">${t}</button>`).join("")}</div><p class="small">We use the youngest age in each range, so the whole group can join in. “All ages” means ages 5 and above in this demonstration collection.</p>`,
            "section-sm soft",
        ) +
        section(
            "Interactive game finder",
            `<div class="finder-panel">${heading("Fine-tune your next game", "A few details. A better match.")}<form id="finder-form"><div class="form-grid"><div class="field"><label for="finder-players">Number of players</label><select id="finder-players" name="players">${options(playerOptions, "Any player count")}</select></div><div class="field"><label for="finder-age">Youngest player</label><select id="finder-age" name="age">${options(ageOptions, "Any age rating")}</select></div><div class="field full"><label for="finder-category">Preferred category</label><select id="finder-category" name="category">${options(
                categories.map((c) => [c, categoryName(c)]),
                "Surprise me · All categories",
            )}</select></div><div class="full actions"><button type="submit" class="btn">Find my game <span aria-hidden="true">↗</span></button><button type="reset" class="btn btn-outline">Start fresh</button></div></div></form></div>`,
        ) +
        section(
            "Recommended game results",
            `${heading("Made for your table", "Your next favourites.")}<p id="finder-count" role="status" aria-live="polite">10 games in the sample collection. Choose your preferences to narrow the shelf.</p><div id="finder-results">${cards(products, "finder")}</div>`,
        ) +
        cta(
            "Sometimes, a conversation helps.",
            "Tell us about your group, the games you already love and what you’d like to try next.",
            "contact.html#contact-form",
            "Ask for a recommendation",
        ),
};
pages.events = {
    title: "Game Nights & Community Sessions — Table & Tale",
    description:
        "Explore illustrative strategy evenings, family afternoons and beginner roleplaying sessions. All events are demonstration content.",
    body:
        intro(
            "Bring your curiosity.<br>We’ll bring the games.",
            "New to the table or always up for another round? Find an evening that feels like your kind of company.",
            "Around the community table",
        ) +
        section(
            "Featured upcoming event",
            `<div class="event-feature"><div class="split">${image("events/strategy", "Players learning a mountain strategy game at a welcoming table")}<div>${eyebrow("The next seat is yours")}<h2>The strategy table</h2><p>${events[0].description}</p><div class="meta"><span>November 6, 2026</span><span>6:30–9:00 PM</span><span>Strategy · Ages 12+</span></div><p class="notice">Demonstration session at the Table & Tale community table. Venue and schedule must be replaced before launch.</p>${link("event-details.html?id=strategy-evening", "Take a closer look", "btn")}</div></div></div>`,
        ) +
        section(
            "Upcoming sessions grid",
            `${heading("Find an evening for you", "Good company. A few good games.")}<div class="grid grid-3 events-grid">${events.map(eventCard).join("")}</div><p class="small mt-24">All listed dates, hosts and locations are sample content. No actual event is scheduled or reserved.</p>`,
            "soft",
        ) +
        section(
            "Event types and activities",
            `${heading("There’s more than one way to play", "Find your place at the table.")}<div class="grid grid-3">${[
                [
                    "mountain",
                    "A thoughtful evening",
                    "Learn a strategy game, explore a fresh map and take your time with a satisfying challenge.",
                ],
                [
                    "people",
                    "A family afternoon",
                    "Short, welcoming games that bring young players and grown-ups into the same adventure.",
                ],
                [
                    "dice",
                    "A shared adventure",
                    "A friendly first step into roleplaying, with a host to guide the story and explain the rules.",
                ],
            ]
                .map(
                    ([ic, t, d]) =>
                        `<article class="feature"><span class="feature-icon">${icon(ic)}</span><h3>${t}</h3><p>${d}</p></article>`,
                )
                .join("")}</div>`,
        ) +
        section(
            "How to join a game night",
            `${heading("Your first visit, made easy", "Just bring yourself. And a little curiosity.")}${steps(
                [
                    [
                        "Choose your evening",
                        "Read the age guide, play style and schedule to find a session that suits you.",
                    ],
                    [
                        "Ask us anything",
                        "Preview an enquiry with your group size and any access needs. This demo does not reserve a seat.",
                    ],
                    [
                        "Settle into the table",
                        "A host introduces the game and explains the first turn. Previous experience is welcome, never required.",
                    ],
                ],
            )}`,
        ) +
        cta(
            "Ready for your next shared story?",
            "Take a look at a session and preview your interest. Connect a real registration service before launch.",
            "event-details.html?id=strategy-evening#register",
            "Explore a session",
        ),
};
const eventDetailsBody = (e) =>
    intro(
        e.title,
        "A welcoming table, a friendly host and a game worth sharing. No previous experience needed.",
        `${e.category} game night · Demo session`,
    ) +
    section(
        "Featured event image and overview",
        `<div class="split">${image(`events/${e.image}-detail`, `${e.game} tabletop session with tactile game components`)}<div><span class="pill">A seat for the curious</span><h2>An evening to<br>look forward to.</h2><p>${e.description}</p><div class="meta"><span>${icon("people")}${e.age}</span><span>${icon("clock")}${e.duration}</span></div><p class="notice mt-24">Demo event · ${e.month} ${e.day}, 2026 · ${e.time}<br>Table & Tale community table · Venue address to be configured</p>${link("#register", "Preview your interest", "btn")}</div></div>`,
    ) +
    section(
        "Schedule and event information",
        `<div class="split"><div>${eyebrow("A little structure. Plenty of play.")}<h2>Here’s how it unfolds.</h2><ul class="timeline"><li><time>First 15 min</time><div><h3>Welcome to the table</h3><p>Meet your host, find a seat and get to know your fellow players.</p></div></li><li><time>Next 20 min</time><div><h3>A friendly first turn</h3><p>A guided introduction, a practice round and time for every question.</p></div></li><li><time>The rest</time><div><h3>Make it your game</h3><p>Settle into play, swap stories and enjoy the evening at your own pace.</p></div></li></ul></div><div class="info-card"><h3>The useful details</h3><table class="spec-table"><tbody>${[
            ["Date", `${e.month} ${e.day}, 2026`],
            ["Time", e.time],
            ["Host", e.host],
            ["Featured game", e.game],
            ["Age guidance", e.age],
            ["Location", "Demo community table · Address pending"],
            ["Participation", "Sample session · No paid booking"],
        ]
            .map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`)
            .join("")}</tbody></table></div></div>`,
        "soft",
    ) +
    section(
        "Participation details and FAQ",
        `<div class="narrow">${heading("Before you pull up a chair", "A few good questions.")}${faq(
            [
                [
                    "Do I need to know the rules?",
                    "No. Your host introduces the game and guides the opening turns. You can ask questions at any time.",
                ],
                [
                    "Can I come on my own?",
                    "Absolutely. The idea is to make it easy to meet other players. Mention your group size in the enquiry preview.",
                ],
                [
                    "What should I bring?",
                    "Just your curiosity. Games and playing materials are part of the illustrative session. Confirm the final details with the real organiser before attending.",
                ],
                [
                    "What about accessibility and younger players?",
                    "Share any access needs in the enquiry. Age guidance is listed above; a guardian should accompany under-18s. This demo does not verify venue accessibility.",
                ],
            ],
        )}</div>`,
    ) +
    section(
        "Registration and enquiry form",
        `<div class="split" id="register"><div>${eyebrow("One more around the table")}<h2>We’d love to<br>hear from you.</h2><p>Preview an enquiry for <strong>${e.title}</strong>. Share your group size and any questions so a future organiser can help you find the right session.</p><p class="notice">This template validates your details locally. It does not send your information, book a seat or make a reservation.</p></div>${registrationForm()}</div>`,
    );
pages["event-details"] = {
    title: "The Strategy Table — Event Details — Table & Tale",
    description:
        "See the sample strategy evening schedule, participation guidance and enquiry form. This demonstration event does not accept real reservations.",
    body: eventDetailsBody(events[0]),
};
pages.contact = {
    title: "Get in Touch & Bulk Enquiries — Table & Tale",
    description:
        "Preview a game recommendation enquiry, ask about a demonstration session or explore bulk ordering. Contact details and forms are clearly marked demo content.",
    body:
        intro(
            "Let’s talk games.",
            "A thoughtful gift, a group recommendation or a question about the next game night. We’re always up for a good conversation.",
            "A little help goes a long way",
        ) +
        section(
            "Contact information",
            `${heading("Here to help", "A few ways to reach the table.")}<div class="grid grid-3">${[
                [
                    "location",
                    "Come say hello",
                    "[Your store address]<br>[City, region, postal code]",
                ],
                ["mail", "Drop us a note", "hello@Table & Tale.example<br>Demo email · Not monitored"],
                ["people", "Give us a call", "+1 (202) 555-0148<br>Fictional sample number"],
            ]
                .map(
                    ([ic, t, d]) =>
                        `<article class="info-card"><span class="feature-icon">${icon(ic)}</span><h3>${t}</h3><p>${d}</p></article>`,
                )
                .join(
                    "",
                )}</div><p class="small mt-24">All contact information is demonstration content and must be replaced before launch. Social links lead to platform homepages.</p>${social}`,
        ) +
        section(
            "Store location and opening hours",
            `<div class="split" id="visit"><div class="map-placeholder" role="img" aria-label="Map integration placeholder, no actual store location"><span class="feature-icon">${icon("location")}</span><h3>Meet us here.</h3><p>Real address, real directions.<br>Add your store map before launch.</p></div><div>${eyebrow("Make a little time for play")}<h2>The door is<br>always a good idea.</h2><p>Illustrative opening hours. Confirm your actual store schedule and address before publishing.</p><ul class="opening-hours"><li><span>Monday – Thursday</span><span>10 AM – 7 PM</span></li><li><span>Friday – Saturday</span><span>10 AM – 9 PM</span></li><li><span>Sunday</span><span>11 AM – 5 PM</span></li></ul><p class="small">Game night hours may differ. Replace this sample schedule with verified opening times.</p></div></div>`,
            "soft",
        ) +
        section(
            "General contact form",
            `<div class="split" id="contact-form"><div>${eyebrow("Every good game starts somewhere")}<h2>What’s on<br>your mind?</h2><p class="lead">Tell us who’s playing, what you enjoy or which game caught your eye. A little detail helps us give a better answer.</p><p class="notice">Demo enquiry preview. Nothing is sent or stored. Configure your form provider before accepting real messages.</p></div>${contactForm()}</div>`,
        ) +
        section(
            "Bulk order enquiry",
            `<div class="section-heading" id="bulk"><div>${eyebrow("For a bigger kind of game night")}<h2>Good games. In good numbers.</h2></div><p>Gifts for your team, games for your classroom or something for a community event. Preview an enquiry for 10 or more items.</p></div>${bulkForm()}`,
            "soft",
        ) +
        section(
            "Frequently asked questions",
            `<div class="narrow">${heading("A few things you might wonder", "Happy to help.")}${faq(
                [
                    [
                        "Can you help me choose a gift?",
                        "Use the game finder to narrow the choices by age, player count and category. The enquiry preview lets you add a little context about the recipient.",
                    ],
                    [
                        "Do you offer delivery or online checkout?",
                        "This frontend template does not take payments or show live inventory. Add verified delivery policies and a real commerce service when adapting it for a store.",
                    ],
                    [
                        "Can our group organise a private game night?",
                        "The bulk and general enquiry forms can be adapted for group sessions. This demonstration does not confirm availability or make bookings.",
                    ],
                    [
                        "Where does my enquiry go?",
                        "At present, nowhere. The forms validate in your browser and display a demo confirmation. No information is sent or saved.",
                    ],
                ],
            )}${link("products.html", "Keep exploring the shelf")}</div>`,
        ),
};
const errorArt = (maintenance = false) =>
    `<svg class="error-art" viewBox="0 0 340 200" role="img" aria-label="${maintenance ? "Playing tiles waiting for the next game" : "A board game path with a misplaced die"}"><path d="M20 160h300M60 160v-30h40v-30h40V70h40v30h40v30h40v30" fill="none" stroke="currentColor" opacity=".2" stroke-width="2" stroke-dasharray="6 6"/><g transform="translate(${maintenance ? "136 45" : "112 36"}) rotate(-12 50 50)"><rect width="100" height="100" rx="20" fill="currentColor"/>${[
        [27, 27],
        [73, 27],
        [50, 50],
        [27, 73],
        [73, 73],
    ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#faf8f4"/>`)
        .join(
            "",
        )}</g><rect x="240" y="110" width="42" height="42" rx="8" fill="#d99a36" transform="rotate(14 261 131)"/><circle cx="261" cy="131" r="4" fill="#343b78"/><circle cx="60" cy="80" r="8" fill="#c66c62"/><path d="M45 50h16m-8-8v16M278 55h12m-6-6v12" stroke="currentColor" stroke-width="2" opacity=".5"/></svg>`;
pages["404"] = {
    title: "A Turn Off the Board — 404 — Table & Tale",
    description:
        "This page has wandered off the board. Return to Table & Tale or explore the game collection.",
    body: `<section class="error-page"><div class="container">${errorArt()}${eyebrow("A little off the board")}<h1>Looks like a wrong turn.</h1><p>Error 404. This page has wandered out of play. Let’s get you back to something good.</p><div class="actions">${link("index.html", "Back to home", "btn")}${link("products.html", "Explore the games", "btn btn-outline")}</div></div></section>`,
};
pages["coming-soon"] = {
    title: "A New Chapter Is Coming — Table & Tale",
    description:
        "A little something new is taking shape at Table & Tale. Preview a newsletter interest signup while the next chapter is prepared.",
    body: `<section class="coming-soon"><div class="container">${errorArt(true)}${eyebrow("A little something is taking shape")}<h1>Setting the table<br>for something new.</h1><p class="lead">We’re getting the next chapter ready. Leave a little room for new discoveries, good company and another round.</p>${newsletterForm()}<div class="actions justify-center">${link("index.html", "Back to the game shelf", "btn btn-outline")}</div><div class="social-center">${social}</div></div></section>`,
};
const pageHTML = (key, p) =>
    `<!doctype html>\n<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${p.title}</title><meta name="description" content="${esc(p.description)}"><meta name="theme-color" content="#faf8f4"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Table & Tale"><link rel="canonical" href="https://example.com/table-and-tale/pages/${key}.html"><meta property="og:url" content="https://example.com/table-and-tale/pages/${key}.html"><link rel="icon" href="../favicon.svg" type="image/svg+xml"><link rel="icon" href="../assets/icons/favicon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="../apple-touch-icon.png"><script src="../assets/js/theme.js"></script><link rel="stylesheet" href="../assets/css/bootstrap.min.css"><link rel="stylesheet" href="../assets/fonts/fonts.css"><link rel="stylesheet" href="../assets/css/style.css"><link rel="stylesheet" href="../assets/css/dark-mode.css"><link rel="stylesheet" href="../assets/css/responsive.css"><link rel="stylesheet" href="../assets/css/rtl.css"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: p.title, description: p.description, isAccessibleForFree: true })}</script><script src="../assets/js/data.js" defer></script><script src="../assets/js/main.js" defer></script><script src="../assets/js/forms.js" defer></script>${key === "products" || key === "product-details" ? '<script src="../assets/js/products.js" defer></script>' : ""}${key === "recommendations" ? '<script src="../assets/js/recommendations.js" defer></script>' : ""}${key === "event-details" ? '<script src="../assets/js/events.js" defer></script>' : ""}</head><body data-page="${key}">${header(key)}<main id="main" tabindex="-1">${p.body}</main>${footer()}<noscript><div class="notice">JavaScript is required for filters, theme switching, mobile menus and form previews. Browse game links directly or enable JavaScript for all features.</div></noscript></body></html>`;
for (const [key, p] of Object.entries(pages)) write(`pages/${key}.html`, pageHTML(key, p));

// Dynamic details use pre-rendered original templates, embedded locally without fetch.
write(
    "assets/js/detail-content.js",
    `window.TableTaleDetails = ${JSON.stringify({ products: Object.fromEntries(products.map((p) => [p.id, productDetailsBody(p)])), events: Object.fromEntries(events.map((e) => [e.id, eventDetailsBody(e)])) })};\n`,
);
for (const key of ["product-details", "event-details"]) {
    const file = path.join(root, `pages/${key}.html`);
    const html = fs
        .readFileSync(file, "utf8")
        .replace(
            '<script src="../assets/js/main.js" defer>',
            '<script src="../assets/js/detail-content.js" defer></script><script src="../assets/js/main.js" defer>',
        );
    fs.writeFileSync(file, html);
}
write(
    "index.html",
    fs.readFileSync(path.join(root, "pages/index.html"), "utf8").replace(
        "<head>",
        '<head>\n        <base href="./pages/" />',
    ),
);
write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
        pages,
    )
        .filter((k) => !["404", "coming-soon"].includes(k))
        .map((k) => `<url><loc>https://example.com/table-and-tale/pages/${k}.html</loc></url>`)
        .join("")}</urlset>`,
);
write(
    "robots.txt",
    "User-agent: *\nAllow: /\n# Replace example.com with your production origin.\nSitemap: https://example.com/table-and-tale/sitemap.xml\n",
);
fs.copyFileSync(
    path.join(root, "node_modules/bootstrap/dist/css/bootstrap.min.css"),
    path.join(root, "assets/css/bootstrap.min.css"),
);
// Keep generated development HTML readable after every rebuild.
(async () => {
    const prettier = require("prettier");
    for (const key of Object.keys(pages)) {
        const file = path.join(root, `pages/${key}.html`);
        const formatted = await prettier.format(fs.readFileSync(file, "utf8"), {
            parser: "html",
            tabWidth: 4,
            printWidth: 100,
            htmlWhitespaceSensitivity: "ignore",
        });
        fs.writeFileSync(file, formatted);
    }
    console.log(`Built and formatted ${Object.keys(pages).length} complete static pages.`);
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
