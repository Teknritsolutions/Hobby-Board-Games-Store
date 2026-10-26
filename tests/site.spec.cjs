const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { products, filter } = require("../assets/js/data.js");
const origin = "http://127.0.0.1:4173";
const counts = {
    index: 10,
    "index-2": 10,
    about: 6,
    products: 6,
    "product-details": 6,
    recommendations: 5,
    events: 6,
    "event-details": 5,
    contact: 6,
    404: 1,
    "coming-soon": 1,
};
const widths = [320, 360, 375, 390, 420, 576, 640, 768, 992, 1024, 1280, 1440, 1920];
const output = path.resolve("test-results");
fs.mkdirSync(output, { recursive: true });
const issues = [];
const report = {
    checks: 0,
    layoutVisits: 0,
    screenshots: [],
    started: new Date().toISOString(),
    issues,
};
function check(condition, message) {
    report.checks++;
    if (!condition) issues.push(message);
}
(async () => {
    // Data-level checks exercise real range boundaries rather than mirroring templates.
    assert.deepEqual(filter(products, { players: "7+", age: "5-7" }), []);
    assert.deepEqual(
        filter(products, { players: "1", category: "Strategy" }).map((p) => p.id),
        ["atlas"],
    );
    assert.ok(
        filter(products, { players: "3-4", age: "8-12" }).every(
            (p) => p.min <= 3 && p.max >= 4 && p.age <= 8,
        ),
    );
    const installedBrowser =
        "C:/Users/Dell/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe";
    const browser = await chromium.launch({
        headless: true,
        ...(fs.existsSync(installedBrowser) ? { executablePath: installedBrowser } : {}),
    });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        colorScheme: "light",
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => issues.push(`Browser error: ${e.message}`));
    const assetErrors = new Set();
    page.on("response", (response) => {
        if (response.status() >= 400 && response.url().startsWith(origin))
            assetErrors.add(`${response.status()} ${response.url()}`);
    });
    const pages = Object.keys(counts);
    for (const name of pages) {
        await page.goto(`${origin}/pages/${name}.html`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        // Load lazy content before full-page captures so offscreen galleries
        // are represented in the QA screenshots as well as the asset checks.
        await page.locator("img[src]").evaluateAll((images) => {
            images.forEach((image) => {
                image.loading = "eager";
            });
        });
        await page.waitForLoadState("networkidle");
        check((await page.locator("h1").count()) === 1, `${name}: exactly one H1`);
        check(
            (await page.locator("main > section").count()) === counts[name],
            `${name}: section count`,
        );
        check(
            Boolean(await page.locator('meta[name="description"]').getAttribute("content")),
            `${name}: meta description`,
        );
        check(
            (await page.locator("header").count()) === (["404", "coming-soon"].includes(name) ? 0 : 1) &&
                (await page.locator("footer").count()) === (["404", "coming-soon"].includes(name) ? 0 : 1),
            `${name}: shared landmarks`,
        );
        const duplicateIds = await page.evaluate(() => {
            const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
            return ids.filter((id, i) => ids.indexOf(id) !== i);
        });
        check(!duplicateIds.length, `${name}: duplicate IDs ${duplicateIds}`);
        const unlabeled = await page.evaluate(() =>
            [...document.querySelectorAll('input:not([type="hidden"]),select,textarea')]
                .filter((e) => !e.labels?.length && !e.getAttribute("aria-label"))
                .map((e) => e.outerHTML),
        );
        check(!unlabeled.length, `${name}: unlabeled forms`);
        for (const theme of ["light", "dark"]) {
            await page.evaluate((theme) => (document.documentElement.dataset.theme = theme), theme);
            for (const width of widths) {
                await page.setViewportSize({ width, height: 1000 });
                await page.evaluate(() => window.scrollTo(0, 0));
                const metrics = await page.evaluate(() => ({
                    scroll: document.documentElement.scrollWidth,
                    width: innerWidth,
                    bad: [
                        ...document.querySelectorAll(
                            "main h1,main h2,main h3,main p,main .btn,.site-header,.container",
                        ),
                    ]
                        .filter((e) => {
                            const r = e.getBoundingClientRect();
                            return r.width > 0 && (r.left < -0.5 || r.right > innerWidth + 0.5);
                        })
                        .map((e) => e.className || e.tagName),
                }));
                check(
                    metrics.scroll <= width + 1,
                    `${name} ${theme} ${width}: overflow ${metrics.scroll}`,
                );
                check(
                    !metrics.bad.length,
                    `${name} ${theme} ${width}: escaped viewport ${metrics.bad}`,
                );
                report.layoutVisits++;
                if ([390, 768, 1440].includes(width)) {
                    const file = `${name}-${width}-${theme}.png`;
                    await page.screenshot({ path: path.join(output, file), fullPage: true });
                    report.screenshots.push(file);
                }
            }
        }
        console.log(`Layout checked: ${name}`);
    }
    // Inspect image loading only after forcing lazy images to load.
    for (const name of pages) {
        await page.goto(`${origin}/pages/${name}.html`, { waitUntil: "networkidle" });
        await page.evaluate(() =>
            document.querySelectorAll("img[src]").forEach((img) => (img.loading = "eager")),
        );
        await page.waitForLoadState("networkidle");
        await page.locator("img[src]").evaluateAll((images) =>
            Promise.all(images.map((image) => image.decode().catch(() => {}))),
        );
        const broken = await page
            .locator("img[src]")
            .evaluateAll((imgs) =>
                imgs
                    .filter((i) => !i.complete || !i.naturalWidth)
                    .map((i) => i.getAttribute("src")),
            );
        check(!broken.length, `${name}: broken images ${broken.join(", ")}`);
        const sources = await page
            .locator("main img[src]")
            .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")));
        check(new Set(sources).size === sources.length, `${name}: duplicate content image`);
        const links = await page
            .locator("a[href]")
            .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
        for (const href of links) {
            if (/^https?:|^mailto:|^tel:/.test(href)) continue;
            const url = new URL(href, `${origin}/pages/${name}.html`);
            const file = path.resolve(".", "." + decodeURIComponent(url.pathname));
            check(fs.existsSync(file), `${name}: missing link target ${href}`);
            if (url.hash && url.pathname === `/pages/${name}.html`)
                check(
                    Boolean(
                        await page
                            .locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`)
                            .count(),
                    ),
                    `${name}: missing anchor ${href}`,
                );
        }
    }
    // Desktop dropdown: keyboard, hover and Escape.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/pages/index.html`);
    const home = page.getByRole("button", { name: "Home", exact: true });
    await home.focus();
    await page.keyboard.press("ArrowDown");
    check(
        await page.getByRole("link", { name: "Home Page 1", exact: true }).isVisible(),
        "Desktop keyboard dropdown opens",
    );
    await page.keyboard.press("Escape");
    check((await home.getAttribute("aria-expanded")) === "false", "Escape closes dropdown");
    await page.getByRole("button", { name: "Products", exact: true }).hover();
    check(
        await page.getByRole("link", { name: "All Products", exact: true }).isVisible(),
        "Desktop hover dropdown",
    );
    await page.mouse.move(0, 400);
    // Mobile menu, nested dropdowns, route navigation.
    await page.setViewportSize({ width: 320, height: 800 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Products", exact: true }).click();
    check(
        await page.getByRole("link", { name: "All Products", exact: true }).isVisible(),
        "Mobile nested dropdown",
    );
    await page.getByRole("link", { name: "All Products", exact: true }).click();
    check(
        (await page
            .getByRole("button", { name: "Open navigation" })
            .getAttribute("aria-expanded")) === "false",
        "Mobile navigation closes on route",
    );
    // Product catalog filters, sorting and empty state.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/pages/products.html?category=Card`);
    check(
        (await page.locator("#catalog-results .product-card").count()) === 2,
        "Category query applies",
    );
    await page.getByRole("link", { name: "All games", exact: true }).click();
    await page.locator("#search").fill("moonlit");
    check((await page.locator("#catalog-results .product-card").count()) === 1, "Search filters");
    await page.locator("#search").fill("no-such-game-xyz");
    check(await page.locator(".empty-state").isVisible(), "Catalog empty state");
    await page.getByRole("button", { name: "Clear all filters", exact: true }).click();
    check((await page.locator("#catalog-results .product-card").count()) === 12, "Catalog reset");
    await page.locator("#sort").selectOption("price-low");
    check(
        (await page.locator("#catalog-results h3").first().textContent()).includes("Orbit"),
        "Ascending price sort",
    );
    await page.locator("#sort").selectOption("price-high");
    check(
        (await page.locator("#catalog-results h3").first().textContent()).includes("Atlas"),
        "Descending price sort",
    );
    await page.locator("#sort").selectOption("name");
    check(
        (await page.locator("#catalog-results h3").first().textContent()).includes("Atlas"),
        "Name sort",
    );
    await page.locator("#catalog-players").selectOption("7+");
    await page.locator("#catalog-age").selectOption("5-7");
    check(
        await page.locator(".empty-state").isVisible(),
        "Age and player intersection produces honest empty state",
    );
    // Finder URL preset, strict ranges and reset.
    await page.goto(`${origin}/pages/recommendations.html?players=7%2B&age=8-12`);
    check(
        (await page.locator("#finder-results .product-card").count()) === 1,
        "Finder URL preset respects ages and player range",
    );
    check(
        (await page.locator("#finder-results h3").textContent()).includes("Orbit"),
        "Finder matching product",
    );
    await page.locator("#finder-category").selectOption("Puzzle");
    check(await page.locator("#finder-results .empty-state").isVisible(), "Finder empty state");
    await page.getByRole("button", { name: "Reset the game finder" }).click();
    await page.waitForTimeout(30);
    check((await page.locator("#finder-results .product-card").count()) === 12, "Finder reset");
    // All product/event IDs and safe fallback, including injection-like invalid IDs.
    for (const p of products) {
        await page.goto(`${origin}/pages/product-details.html?id=${p.id}`);
        check((await page.locator("h1").textContent()) === p.name, `Product route ${p.id}`);
        check(
            (await page.locator(".detail-price").textContent()).includes(String(p.price)),
            `Product price ${p.id}`,
        );
    }
    await page.getByRole("button", { name: /Enlarge/ }).click();
    check(await page.locator("dialog").isVisible(), "Image gallery opens");
    await page.keyboard.press("Escape");
    check(!(await page.locator("dialog").isVisible()), "Image gallery Escape closes");
    for (const id of ["strategy-evening", "family-saturday", "rpg-intro"]) {
        await page.goto(`${origin}/pages/event-details.html?id=${id}`);
        check((await page.locator("#register").count()) === 1, `Event route ${id}`);
    }
    for (const kind of ["product", "event"]) {
        await page.goto(`${origin}/pages/${kind}-details.html?id=%3Cscript%3E`);
        check(
            (await page.locator("h1").textContent()).includes("not found"),
            `${kind} invalid ID fallback`,
        );
    }
    // Theme system preference, manual selection and cross-page persistence.
    await page.goto(`${origin}/pages/index.html`);
    await page.evaluate(() => {
        localStorage.removeItem("table-tale-theme");
    });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    check(
        (await page.locator("html").getAttribute("data-theme")) === "dark",
        "System dark preference",
    );
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await page.goto(`${origin}/pages/about.html`);
    check(
        (await page.locator("html").getAttribute("data-theme")) === "light",
        "Theme persists across pages",
    );
    // Form validation: each visible submit validates locally without posting.
    let posts = 0;
    page.on("request", (r) => {
        if (r.method() === "POST") posts++;
    });
    for (const [url, kind] of [
        ["index.html", "newsletter"],
        ["contact.html", "contact"],
        ["contact.html", "bulk"],
        ["event-details.html", "event"],
    ]) {
        await page.goto(`${origin}/pages/${url}`);
        const form = page.locator(`form[data-kind="${kind}"]`);
        await form.locator('[type="submit"]').click();
        check(
            (await form.locator('[aria-invalid="true"]').count()) > 0,
            `${kind} required validation`,
        );
        for (const input of await form.locator('input:not([type="hidden"])').all()) {
            const type = await input.getAttribute("type");
            if (type === "checkbox") {
                await input.check();
                continue;
            }
            const name = await input.getAttribute("name");
            if (type === "email") await input.fill("test@example.com");
            else if (type === "number") await input.fill(kind === "bulk" ? "25" : "2");
            else if (type === "date") await input.fill("2099-12-01");
            else if (type === "tel") await input.fill("+1 202 555 0148");
            else await input.fill(name?.includes("organization") ? "Sample Club" : "Sample Player");
        }
        for (const select of await form.locator("select").all())
            await select.selectOption({ index: 1 });
        for (const textarea of await form.locator("textarea").all())
            await textarea.fill("Please tell me more about these games for our group.");
        await form.locator('[type="submit"]').click();
        check(
            (await form.locator(".form-status").textContent()).includes("validated"),
            `${kind} honest demo confirmation`,
        );
    }
    check(posts === 0, "Demo forms perform no network submission");
    await page.goto(`${origin}/pages/contact.html`);
    const question = page.locator("details.faq").first();
    await question.locator("summary").click();
    check((await question.getAttribute("open")) !== null, "FAQ opens");
    // RTL menu, form and card checks in both themes.
    for (const name of ["index", "products", "contact"]) {
        await page.goto(`${origin}/pages/${name}.html`);
        for (const theme of ["light", "dark"])
            for (const width of [320, 768, 1440]) {
                await page.setViewportSize({ width, height: 1000 });
                await page.evaluate((theme) => {
                    document.documentElement.dir = "rtl";
                    document.documentElement.dataset.theme = theme;
                }, theme);
                const scroll = await page.evaluate(() => document.documentElement.scrollWidth);
                check(scroll <= width + 1, `RTL ${name} ${width} ${theme} overflow`);
                await page.screenshot({
                    path: path.join(output, `${name}-${width}-${theme}-rtl.png`),
                    fullPage: true,
                });
            }
    }
    for (const error of assetErrors) issues.push(`Asset response: ${error}`);
    report.finished = new Date().toISOString();
    fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
    await browser.close();
    console.log(
        JSON.stringify(
            {
                checks: report.checks,
                layoutVisits: report.layoutVisits,
                screenshots: report.screenshots.length + 18,
                issues,
            },
            null,
            2,
        ),
    );
    if (issues.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    fs.writeFileSync(path.join(output, "failure.txt"), e.stack);
    process.exitCode = 1;
});
