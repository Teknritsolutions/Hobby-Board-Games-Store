(function (root) {
    const products = [
        {
            id: "atlas",
            name: "Atlas of the Wild",
            category: "Strategy",
            price: 54,
            min: 1,
            max: 4,
            age: 12,
            duration: "60–90 min",
            badge: "Staff favourite",
            description:
                "Chart a world that changes with every expedition. Build trails, gather discoveries and find your own route through a beautifully unfolding wilderness.",
            features: [
                "A modular landscape with a different map every game",
                "A thoughtful solo expedition mode",
                "Wooden explorers and tactile terrain tiles",
            ],
            steps: [
                "Build your wilderness from the terrain tiles.",
                "Take turns exploring, collecting and connecting trails.",
                "Complete discoveries and score your expedition.",
            ],
        },
        {
            id: "moon",
            name: "Moonlit Market",
            category: "Card",
            price: 24,
            min: 2,
            max: 6,
            age: 8,
            duration: "20–30 min",
            badge: "New arrival",
            description:
                "Trade curiosities beneath the lanterns in a lively card game of clever swaps and unexpected combinations. Easy to learn, with just enough mischief.",
            features: [
                "Quick rounds that fit into a busy evening",
                "A compact box for travel",
                "Playful trading with simple scoring",
            ],
            steps: [
                "Deal a hand of market cards to every player.",
                "Trade, collect sets and watch the changing stalls.",
                "Count your collections when the market closes.",
            ],
        },
        {
            id: "canopy",
            name: "Little Canopy",
            category: "Family",
            price: 32,
            min: 2,
            max: 4,
            age: 5,
            duration: "15–25 min",
            badge: "Family favourite",
            description:
                "Make a little woodland together. Match friendly animals to their habitats and help your forest grow, one delightfully chunky tile at a time.",
            features: [
                "Gentle matching for younger players",
                "Chunky illustrated woodland tiles",
                "A cooperative way to learn together",
            ],
            steps: [
                "Choose a woodland board for your family.",
                "Match an animal to a welcoming habitat.",
                "Help every animal find a home before sunset.",
            ],
        },
        {
            id: "orbit",
            name: "Orbit & Echo",
            category: "Card",
            price: 19,
            min: 3,
            max: 8,
            age: 8,
            duration: "15–20 min",
            badge: "Game night pick",
            description:
                "Read the room, follow the rhythm and find the connection. A sociable party card game where the best moments come from thinking alike.",
            features: [
                "Room for up to eight players",
                "Short turns with everyone involved",
                "Simple prompts with surprising connections",
            ],
            steps: [
                "Reveal a prompt and choose your connection.",
                "Compare your choices with the group.",
                "Collect points for shared ideas and play again.",
            ],
        },
        {
            id: "bloom",
            name: "Botanical Hours",
            category: "Puzzle",
            price: 28,
            min: 1,
            max: 4,
            age: 8,
            duration: "At your pace",
            badge: "Slow afternoon",
            description:
                "A quiet garden for your tabletop. Piece together an original botanical illustration filled with small details, seasonal colour and a little room to breathe.",
            features: [
                "500 carefully cut jigsaw pieces",
                "An original botanical illustration",
                "Enjoy solo or share a quiet afternoon",
            ],
            steps: [
                "Sort your pieces by colour and edge.",
                "Build the border and find the first blossoms.",
                "Take your time bringing the garden together.",
            ],
        },
        {
            id: "dice",
            name: "Emberstone Dice",
            category: "RPG",
            price: 22,
            min: 1,
            max: 8,
            age: 13,
            duration: "Campaign ready",
            badge: "For your next quest",
            description:
                "A warm amber dice set for stories yet to be told. Seven polyhedral dice in a lined travel case make a thoughtful companion for your next campaign.",
            features: [
                "Seven standard polyhedral dice",
                "A lined compact storage case",
                "Clear numbers for easy table reading",
            ],
            steps: [
                "Choose the die your game calls for.",
                "Roll on a suitable tray or padded surface.",
                "Let the result guide the next part of your story.",
            ],
        },
        {
            id: "harbor",
            name: "Harbor & Hearth",
            category: "Strategy",
            price: 46,
            min: 2,
            max: 5,
            age: 10,
            duration: "45–60 min",
            badge: "Table favourite",
            description:
                "Build a welcoming coastal village through clever resource choices and careful planning. Every boat brings a new opportunity to make your harbour thrive.",
            features: [
                "Accessible resource management",
                "Meaningful choices on every turn",
                "A welcoming illustrated coastal world",
            ],
            steps: [
                "Set up your harbour and starting resources.",
                "Trade, build and welcome visiting boats.",
                "Score a thriving village at the end of the season.",
            ],
        },
        {
            id: "fox",
            name: "Fox & Fable",
            category: "Family",
            price: 26,
            min: 2,
            max: 6,
            age: 5,
            duration: "20–30 min",
            badge: "Little storytellers",
            description:
                "Follow a curious fox into a story of your own making. Illustrated prompts invite young players and grown-ups to imagine, connect and laugh together.",
            features: [
                "Open-ended storytelling prompts",
                "Welcoming for early readers",
                "A gentle game for mixed-age groups",
            ],
            steps: [
                "Choose a character and a starting scene.",
                "Add a card and tell the next part of the story.",
                "Bring your shared adventure to a happy ending.",
            ],
        },
        {
            id: "trail",
            name: "Solo Trail",
            category: "Puzzle",
            price: 21,
            min: 1,
            max: 1,
            age: 8,
            duration: "15–30 min",
            badge: "Just for you",
            description:
                "A pocket-sized escape into the hills. Connect a route through a sequence of map challenges, with satisfying puzzles for a little time to yourself.",
            features: [
                "Designed for one player",
                "Progressive route-building challenges",
                "Compact enough for a weekend bag",
            ],
            steps: [
                "Pick a route challenge and lay out the map.",
                "Connect the landmarks using your trail cards.",
                "Check the route, then try the next challenge.",
            ],
        },
        {
            id: "tower",
            name: "The Quiet Tower",
            category: "RPG",
            price: 38,
            min: 2,
            max: 6,
            age: 13,
            duration: "60–120 min",
            badge: "A new adventure",
            description:
                "An introductory storytelling kit for a small band of adventurers. Explore a mysterious tower with illustrated scene cards, wooden markers and an easy-to-follow guide.",
            features: [
                "A guided first roleplaying adventure",
                "Reusable scene cards and wooden markers",
                "Includes a host guide and character prompts",
            ],
            steps: [
                "Choose a character and let one player host.",
                "Explore scenes and make choices together.",
                "Resolve challenges using the included story rules.",
            ],
        },
        {"id":"citadel","name":"Cedar Citadel","category":"Strategy","price":46,"min":2,"max":4,"age":10,"duration":"40-60 min","badge":"Build your city","description":"Raise a woodland city one clever choice at a time. Balance your resources, connect thriving districts and shape a citadel that is entirely your own.","features":["Modular city tiles with a different layout every game","Tactile wooden towers and resource pieces","Multiple paths to a flourishing city"],"steps":["Lay out the shared woodland map and starting districts.","Draft tiles, gather resources and build connected neighborhoods.","Score your landmarks and the city connections you have created."]},
        {"id":"starlight","name":"Starlight Routes","category":"Strategy","price":38,"min":2,"max":5,"age":10,"duration":"30-45 min","badge":"A new discovery","description":"Chart a course across a sky full of possibilities. Link constellations, plan your observatory network and discover a new route among the stars.","features":["A beautifully illustrated constellation map","Simple turns with thoughtful route-building choices","Private objectives for a fresh challenge each session"],"steps":["Choose your observatory and draw your discovery objectives.","Collect star cards and connect matching constellations.","Complete routes and compare the discoveries in your sky."]},
    ];
    const events = [
        {
            id: "strategy-evening",
            title: "The strategy table",
            date: "2026-11-06",
            day: "06",
            month: "Nov",
            time: "6:30–9:00 PM",
            category: "Strategy",
            image: "strategy",
            description:
                "An unhurried evening of exploration, clever choices and new friends. Our host walks everyone through Atlas of the Wild before the first turn.",
            host: "Ellis · Community host",
            age: "Ages 12+ with a guardian for under-18s",
            game: "Atlas of the Wild",
            duration: "2½ hours",
        },
        {
            id: "family-saturday",
            title: "Small players, big adventures",
            date: "2026-11-14",
            day: "14",
            month: "Nov",
            time: "2:00–4:00 PM",
            category: "Family",
            image: "family",
            description:
                "A relaxed afternoon for curious little players and their grown-ups. Try woodland matching, tell a shared story and discover a new family favourite.",
            host: "Mara · Game curator",
            age: "Ages 5+ with a participating grown-up",
            game: "Little Canopy & Fox & Fable",
            duration: "2 hours",
        },
        {
            id: "rpg-intro",
            title: "Your first quest",
            date: "2026-11-20",
            day: "20",
            month: "Nov",
            time: "6:00–8:30 PM",
            category: "RPG",
            image: "rpg",
            description:
                "Step into a shared story with a friendly host and a ready-to-play character. No rulebook homework or previous roleplaying experience needed.",
            host: "Jules · Tabletop guide",
            age: "Ages 13+ with a guardian for under-18s",
            game: "The Quiet Tower",
            duration: "2½ hours",
        },
    ];
    const categories = ["Strategy", "Card", "Family", "Puzzle", "RPG"];
    const money = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(value);
    const escape = (value) =>
        String(value).replace(
            /[&<>"']/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
        );
    const playersMatch = (p, value) => {
        if (!value) return true;
        const [lo, hi = lo] = value === "7+" ? [7, 8] : value.split("-").map(Number);
        return p.min <= lo && p.max >= hi;
    };
    const ageMatch = (p, value) =>
        !value || value === "all" ? !value || p.age <= 5 : p.age <= Number(value.split("-")[0]);
    const filter = (items, options = {}) =>
        items.filter(
            (p) =>
                (!options.category || p.category === options.category) &&
                (!options.search ||
                    `${p.name} ${p.category} ${p.description}`
                        .toLowerCase()
                        .includes(options.search.toLowerCase())) &&
                playersMatch(p, options.players) &&
                ageMatch(p, options.age),
        );
    const card = (p, view = "catalog") =>
        `<article class="product-card"><a class="product-image" href="product-details.html?id=${p.id}"><img src="../assets/images/products/${p.id}-${view}.webp" width="800" height="800" alt="${escape(p.name)} original game ${view === "detail" ? "components" : "box and tabletop components"}" loading="lazy"><span class="pill">${escape(p.badge)}</span></a><div class="product-body"><span class="product-category">${escape(p.category === "RPG" ? "RPG accessories" : p.category + " games")}</span><h3><a href="product-details.html?id=${p.id}">${escape(p.name)}</a></h3><div class="meta"><span>${p.min === p.max ? p.min : p.min + "–" + p.max} player${p.max > 1 ? "s" : ""}</span><span>Ages ${p.age}+</span></div><div class="product-bottom"><span class="price">${money(p.price)}</span><a href="product-details.html?id=${p.id}">Explore game <span class="arrow" aria-hidden="true">↗</span></a></div></div></article>`;
    const data = {
        products,
        events,
        categories,
        money,
        escape,
        filter,
        playersMatch,
        ageMatch,
        card,
    };
    if (typeof module !== "undefined") module.exports = data;
    else root.TableTale = data;
})(typeof window !== "undefined" ? window : globalThis);
