/* Download only Latin WOFF2 font subsets from the official Google Fonts CSS. */
const fs = require("node:fs");
const path = require("node:path");
(async () => {
    const root = path.resolve(__dirname, "..");
    const url =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap";
    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        },
    });
    if (!response.ok) throw new Error(`Font CSS: ${response.status}`);
    const css = await response.text();
    fs.writeFileSync(path.join(root, "assets/fonts/google-fonts-source.css"), css);
    const blocks = [...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(
        (x) => x[1],
    );
    if (!blocks.length) throw new Error("No Latin font subset found");
    let final = "/* Self-hosted Google Fonts, Latin subsets. See documentation/credits.md. */\n";
    const cache = new Map();
    for (const block of blocks) {
        const source = block.match(/url\(([^)]+)\)/)[1];
        const family = block.match(/font-family:\s*'([^']+)'/)[1].toLowerCase();
        const weight = block.match(/font-weight:\s*([^;]+)/)[1].replace(/\s/g, "-");
        let file = cache.get(source);
        if (!file) {
            file = `${family}-${weight}-latin.woff2`;
            const download = await fetch(source);
            if (!download.ok) throw new Error(`Font: ${download.status}`);
            fs.writeFileSync(
                path.join(root, "assets/fonts", file),
                Buffer.from(await download.arrayBuffer()),
            );
            cache.set(source, file);
        }
        final += block.replace(source, `./${file}`) + "\n";
    }
    fs.writeFileSync(path.join(root, "assets/fonts/fonts.css"), final);
    for (const [name, url] of [
        ["Inter-OFL.txt", "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt"],
        [
            "Outfit-OFL.txt",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/OFL.txt",
        ],
    ]) {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`License: ${r.status}`);
        fs.writeFileSync(path.join(root, "assets/fonts", name), await r.text());
    }
    console.log(`Downloaded ${cache.size} font files and both OFL licenses.`);
})().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
});
