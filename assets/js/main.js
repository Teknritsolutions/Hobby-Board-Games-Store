(() => {
    const { products, events } = window.TableTale;
    const page = document.body.dataset.page;
    const query = new URLSearchParams(location.search);
    if (page === "product-details" || page === "event-details") {
        const isProduct = page === "product-details";
        const items = isProduct ? products : events;
        const id = query.get("id") || items[0].id;
        const item = items.find((x) => x.id === id);
        const main = document.querySelector("main");
        if (item) {
            main.innerHTML = window.TableTaleDetails[isProduct ? "products" : "events"][id];
            const title = `${item.name || item.title} — ${isProduct ? "Game" : "Event"} Details — Table & Tale`;
            document.title = title;
            const description = item.description;
            document.querySelector('meta[name="description"]').content = description;
            document.querySelector('meta[property="og:title"]').content = title;
            document.querySelector('meta[property="og:description"]').content = description;
            const canonical = document.querySelector('link[rel="canonical"]');
            canonical.href = `${canonical.href.split("?")[0]}?id=${encodeURIComponent(id)}`;
            document.querySelector('meta[property="og:url"]').content = canonical.href;
            document.querySelector('script[type="application/ld+json"]').textContent =
                JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: title,
                    description,
                    isAccessibleForFree: true,
                });
        } else {
            main.innerHTML = `<section class="error-page"><div class="container"><span class="eyebrow">A little off the board</span><h1>${isProduct ? "Game" : "Session"} not found.</h1><p>That link doesn’t match anything on our shelf. There’s plenty more to discover.</p><a class="btn" href="${isProduct ? "products" : "events"}.html">Explore ${isProduct ? "all games" : "game nights"} ↗</a></div></section>`;
            document.title = `${isProduct ? "Game" : "Session"} not found — Table & Tale`;
            const robots = document.createElement("meta");
            robots.name = "robots";
            robots.content = "noindex";
            document.head.append(robots);
        }
    }

    // Alternate immersive photography with editorial split heroes.
    const heroDesigns = {
        about: ["split", "heroes/about.webp", "A welcoming game store with thoughtfully arranged shelves"],
        products: ["cover", "heroes/products.webp", "Detailed tabletop game pieces and a richly illustrated board"],
        recommendations: ["split", "heroes/recommendations.webp", "Discovering a new board game in the store"],
        events: ["cover", "heroes/events.webp", "Friends gathered for a welcoming game night"],
        contact: ["split", "heroes/contact.webp", "The warm interior of our tabletop game store"],
        "product-details": ["cover", "products/" + (query.get("id") || "atlas") + "-catalog.webp", "A closer look at the game and its playing pieces"],
        "event-details": ["split", "events/" + ({"strategy-evening":"strategy", "family-saturday":"family", "rpg-intro":"rpg"}[query.get("id")] || "strategy") + ".webp", "A shared tabletop adventure"],
        "coming-soon": ["cover", "heroes/coming.webp", "Good company around a game table"],
        "404": ["split", "heroes/notfound.webp", "A tabletop adventure waiting to be discovered"]
    };
    const hero = document.querySelector("main > section");
    if (document.body.classList.contains("standalone-page")) {
        // Standalone pages supply their own full-screen composition.
    } else if (page === "index-2") {
        hero.classList.add("hero-cover");
        const photo = hero.querySelector("img");
        photo.classList.add("hero-photo");
        hero.append(photo);
    } else if (heroDesigns[page] && ((hero.matches(".inner-hero, .coming-soon") || page === "404"))) {
        const [layout, source, alt] = heroDesigns[page];
        const container = hero.querySelector(".container");
        const copy = document.createElement("div");
        copy.className = "hero-copy";
        while (container.firstChild) copy.append(container.firstChild);
        container.append(copy);
        const photo = document.createElement("img");
        photo.className = "hero-photo";
        photo.src = "../assets/images/" + source;
        photo.alt = layout === "cover" ? "" : alt;
        photo.width = 1200;
        photo.height = 800;
        photo.fetchPriority = "high";
        hero.classList.add("hero-" + layout);
        (layout === "cover" ? hero : container).append(photo);
    }

    const themeButton = document.querySelector(".theme-toggle");
    const moon = '<path d="M20 14a8 8 0 0 1-10-10 9 9 0 1 0 10 10z"/>';
    const sun =
        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
    const syncTheme = () => {
        const dark = document.documentElement.dataset.theme === "dark";
        themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
        themeButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">${dark ? sun : moon}</svg>`;
        document.querySelector('meta[name="theme-color"]').content = dark ? "#111524" : "#faf8f4";
    };
    syncTheme();
    themeButton.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("table-tale-theme", next);
        } catch (_) {
            /* Theme still works for this page. */
        }
        syncTheme();
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        let saved;
        try {
            saved = localStorage.getItem("table-tale-theme");
        } catch (_) {
            /* Continue with system preference. */
        }
        if (!saved) {
            document.documentElement.dataset.theme = e.matches ? "dark" : "light";
            syncTheme();
        }
    });

    const directionButton = document.createElement("button");
    directionButton.type = "button";
    directionButton.className = "icon-button direction-toggle";
    themeButton.after(directionButton);
    function syncDirection() {
        const rtl = document.documentElement.dir === "rtl";
        const label = rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout";
        directionButton.setAttribute("aria-label", label);
        directionButton.setAttribute("aria-pressed", String(rtl));
        directionButton.title = label;
        directionButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16M4 9h10M4 13h16"/><path d="' + (rtl ? 'M19 19H5m4-3-4 3 4 3' : 'M5 19h14m-4-3 4 3-4 3') + '"/></svg><span class="direction-label">' + (rtl ? 'LTR' : 'RTL') + '</span>';
    }
    syncDirection();
    directionButton.addEventListener("click", () => {
        const next = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
        document.documentElement.dir = next;
        try { localStorage.setItem("table-tale-direction", next); } catch (_) {}
        syncDirection();
    });
    const currentPath = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".dropdown a").forEach((link) => {
        const target = new URL(link.href);
        const targetPage = target.pathname.split("/").pop();
        const activeCategory = new URLSearchParams(location.search).get("category");
        const samePage = targetPage === currentPath;
        const categoryMatches = targetPage !== "products.html" || (target.searchParams.get("category") || "") === (activeCategory || "");
        if (samePage && categoryMatches) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    const menu = document.querySelector(".main-nav");
    const menuToggle = document.querySelector(".menu-toggle");
    if (menu && menuToggle) {
    const triggers = [...document.querySelectorAll(".nav-trigger")];
    function closeDropdowns(except) {
        triggers.forEach((t) => {
            if (t !== except) {
                t.setAttribute("aria-expanded", "false");
                t.parentElement.classList.remove("open");
            }
        });
    }
    function closeMenu() {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        closeDropdowns();
    }
    menuToggle.addEventListener("click", () => {
        const open = !menu.classList.contains("is-open");
        menu.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", `${open ? "Close" : "Open"} navigation`);
        if (!open) closeDropdowns();
    });
    triggers.forEach((trigger) => {
        const parent = trigger.parentElement;
        const open = () => {
            closeDropdowns(trigger);
            parent.classList.add("open");
            trigger.setAttribute("aria-expanded", "true");
        };
        trigger.addEventListener("click", (e) => {
            if (window.innerWidth >= 1200 && e.detail > 0) {
                open();
                return;
            }
            const shouldOpen = !parent.classList.contains("open");
            closeDropdowns();
            if (shouldOpen) open();
        });
        trigger.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                open();
                parent.querySelector(".dropdown a").focus();
            }
        });
        parent.addEventListener("pointerenter", (e) => {
            if (e.pointerType === "mouse" && window.innerWidth >= 1200) open();
        });
        parent.addEventListener("pointerleave", () => {
            if (window.innerWidth >= 1200 && !parent.contains(document.activeElement))
                closeDropdowns();
        });
        parent.addEventListener("focusout", (e) => {
            if (!parent.contains(e.relatedTarget)) closeDropdowns();
        });
    });
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-item")) closeDropdowns();
        if (!e.target.closest(".site-header")) closeMenu();
    });
    menu.addEventListener("click", (e) => {
        if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const expanded = triggers.find((t) => t.getAttribute("aria-expanded") === "true");
            if (expanded) {
                closeDropdowns();
                expanded.focus();
            } else if (menu.classList.contains("is-open")) {
                closeMenu();
                menuToggle.focus();
            }
        }
    });
    window.matchMedia("(min-width: 1200px)").addEventListener("change", closeMenu);
    }

    const topButton = document.querySelector(".back-top");
    if (topButton) {
    window.addEventListener(
        "scroll",
        () => {
            topButton.hidden = scrollY < 700;
        },
        { passive: true },
    );
    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
        document.querySelector(".logo").focus({ preventScroll: true });
    });

    }
    document.querySelector("[data-go-back]")?.addEventListener("click", () => {
        if (history.length > 1) history.back();
        else location.href = "index.html";
    });

    const dialog = document.querySelector("#product-gallery");
    if (dialog) {
        document.querySelector("[data-open-gallery]").addEventListener("click", () => {
            const source = document.querySelector(".product-gallery img");
            const target = dialog.querySelector("img");
            target.src = source.src;
            target.alt = source.alt;
            dialog.showModal();
        });
        dialog
            .querySelector("[data-close-gallery]")
            .addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (e) => {
            if (e.target === dialog) dialog.close();
        });
    }
    const product = products.find((p) => p.id === query.get("product"));
    if (product && page === "contact") {
        document.querySelector("#contact-subject").value = "product";
        document.querySelector("#contact-message").value =
            `I’d like to know more about ${product.name}. `;
        document.querySelector("#bulk-product").value = product.name;
    }
})();
