const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("node:fs");
const pages = [
    "index",
    "index-2",
    "about",
    "products",
    "product-details",
    "recommendations",
    "events",
    "event-details",
    "contact",
    "404",
    "coming-soon",
];
(async () => {
    const installedBrowser =
        "C:/Users/Dell/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe";
    const b = await chromium.launch({
        headless: true,
        ...(fs.existsSync(installedBrowser) ? { executablePath: installedBrowser } : {}),
    });
    const context = await b.newContext({ viewport: { width: 1440, height: 1000 } });
    const p = await context.newPage();
    const results = [];
    for (const page of pages) {
        await p.goto(`http://127.0.0.1:4173/pages/${page}.html`, { waitUntil: "networkidle" });
        for (const theme of ["light", "dark"]) {
            await p.evaluate((theme) => (document.documentElement.dataset.theme = theme), theme);
            const r = await new AxeBuilder({ page: p })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
                .analyze();
            results.push({
                page,
                theme,
                violations: r.violations.map((v) => ({
                    id: v.id,
                    impact: v.impact,
                    description: v.description,
                    nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
                })),
                incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
            });
            console.log(page, theme, r.violations.length);
        }
    }
    await p.goto("http://127.0.0.1:4173/pages/contact.html");
    await p.getByRole("button", { name: "Preview my enquiry" }).click();
    const r = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
    results.push({
        page: "contact validation errors",
        violations: r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    });
    fs.writeFileSync("test-results/accessibility.json", JSON.stringify(results, null, 2));
    await b.close();
    if (results.some((r) => r.violations.length)) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
