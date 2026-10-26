const { chromium } = require("playwright");
const fs = require("node:fs");
const refs = [
    [
        "farm",
        "https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/index.html",
    ],
    ["events", "https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html"],
    ["books", "https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/index.html"],
    ["food", "https://teknrit-maker.github.io/FoodTruck/Pages/menu.html"],
    ["yarn", "https://ravivarmaadepu123.github.io/boutique-yarn-and-craft-supply/pages/"],
];
(async () => {
    fs.mkdirSync(".qa/references", { recursive: true });
    const installedBrowser =
        "C:/Users/Dell/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe";
    const b = await chromium.launch({
        headless: true,
        ...(fs.existsSync(installedBrowser) ? { executablePath: installedBrowser } : {}),
    });
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    const results = [];
    for (const [name, url] of refs) {
        const result = { name, url, pages: [] };
        try {
            const r = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
            result.status = r.status();
            if (r.status() < 400) {
                await p.screenshot({ path: `.qa/references/${name}-desktop.png`, fullPage: true });
                const summary = await p.evaluate(() => ({
                    title: document.title,
                    headings: [...document.querySelectorAll("h1,h2")].map((e) => e.innerText),
                    links: [...document.querySelectorAll("a[href]")].map((e) => e.href),
                }));
                result.pages.push({ url, title: summary.title, headings: summary.headings });
                const base = new URL(url);
                const repo = base.pathname.split("/")[1];
                const queue = [...new Set(summary.links)].filter((h) => {
                    try {
                        const x = new URL(h);
                        return (
                            x.origin === base.origin &&
                            x.pathname.split("/")[1] === repo &&
                            /\.html$|\/$/.test(x.pathname) &&
                            x.pathname !== base.pathname &&
                            !x.hash
                        );
                    } catch {
                        return false;
                    }
                });
                for (const target of queue) {
                    try {
                        const rr = await p.goto(target, {
                            waitUntil: "domcontentloaded",
                            timeout: 15000,
                        });
                        if (rr.status() < 400)
                            result.pages.push({
                                url: target,
                                ...(await p.evaluate(() => ({
                                    title: document.title,
                                    headings: [...document.querySelectorAll("h1,h2")].map(
                                        (e) => e.innerText,
                                    ),
                                }))),
                            });
                    } catch (e) {
                        result.pages.push({ url: target, error: e.message.split("\n")[0] });
                    }
                }
                await p.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
                await p.setViewportSize({ width: 390, height: 844 });
                await p.screenshot({ path: `.qa/references/${name}-mobile.png`, fullPage: true });
                await p.setViewportSize({ width: 1440, height: 1000 });
            }
        } catch (e) {
            result.error = e.message.split("\n")[0];
        }
        results.push(result);
        console.log(name, result.status, result.pages.length, result.error || "");
    }
    fs.writeFileSync(".qa/references/results.json", JSON.stringify(results, null, 2));
    await b.close();
})();
