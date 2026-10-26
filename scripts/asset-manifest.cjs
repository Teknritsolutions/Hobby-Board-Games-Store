const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { products } = require("../assets/js/data.js");
const assets = fs
    .readdirSync("assets/images", { recursive: true })
    .filter((f) => f.endsWith(".webp"))
    .map((f) => f.replace(/\\/g, "/"))
    .sort();
const identify = spawnSync(
    "magick",
    ["identify", "-format", "%f|%w|%h\n", ...assets.map((f) => path.join("assets/images", f))],
    { encoding: "utf8" },
);
if (identify.status !== 0) throw new Error(identify.stderr);
const dimensions = new Map(
    identify.stdout
        .trim()
        .split("\n")
        .map((line) => {
            const [name, w, h] = line.split("|");
            return [name, [Number(w), Number(h)]];
        }),
);
const scopes = {
    catalog: "pages/products.html",
    detail: "pages/product-details.html",
    related: "pages/product-details.html · Related games",
    finder: "pages/recommendations.html",
    home: "pages/index.html",
};
const manifest = [];
for (const file of assets) {
    const bytes = fs.readFileSync(path.join("assets/images", file));
    const parts = path.basename(file, ".webp").split("-");
    const product = products.find((p) => p.id === parts[0]);
    const scope = parts.at(-1);
    const page = product
        ? scopes[scope]
        : file.startsWith("home-2/")
          ? "pages/index-2.html"
          : file.startsWith("home/")
            ? "pages/index.html"
            : file.startsWith("about/")
              ? "pages/about.html"
              : file.includes("-detail")
                ? "pages/event-details.html"
                : file === "events/strategy.webp"
                  ? "pages/events.html"
                  : "Optional event photograph supplied in asset library";
    const [width, height] = dimensions.get(path.basename(file));
    manifest.push({
        file: "assets/images/" + file,
        page,
        subject: product
            ? `${product.name} · ${scope} view`
            : path.basename(file, ".webp").replace(/-/g, " "),
        width,
        height,
        bytes: bytes.length,
        sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    });
}
const duplicate = manifest.filter((m, i) => manifest.findIndex((x) => x.sha256 === m.sha256) !== i);
if (duplicate.length)
    throw new Error("Duplicate image bytes: " + duplicate.map((x) => x.file).join(", "));
const text = `# Image and identity inventory\n\n${manifest.length} original locally stored WebP photographs/product views, generated separately with the built-in ImageGen tool and optimized with ImageMagick. All images retain their aspect ratio; page layouts crop with object-fit where appropriate. Hero assets load eagerly; below-fold images use lazy loading.\n\nEach game has different catalog, detail, related-game and finder images. Seven additional homepage product shots and one game-of-the-week scene are included. A zoom dialog displays the selected detail photo at a larger size; it is intentionally the same photograph rather than a new content image. Related product routes use the same related-game asset for the same product identity.\n\nTwo extra event photos are supplied as optional library assets. They are not repeated in live page content.\n\n| File | Intended page / placement | Subject | Dimensions | KB |\n| --- | --- | --- | --- | ---: |\n${manifest.map((x) => `| \`${x.file}\` | ${x.page} | ${x.subject} | ${x.width} × ${x.height} | ${(x.bytes / 1024).toFixed(1)} |`).join("\n")}\n\n## Brand assets\n\n- \`assets/icons/logo-primary.svg\`, \`logo-light.svg\`, \`logo-dark.svg\`: primary horizontal and theme variants.\n- \`assets/icons/logo-mark.svg\`: compact dice/tile mark.\n- \`favicon.svg\`, \`favicon.ico\`: root favicons.\n- \`assets/icons/favicon-16.png\`, \`favicon-32.png\`: PNG icons.\n- \`apple-touch-icon.png\`: 180 × 180 touch icon.\n- Error and maintenance illustrations: distinct inline SVG compositions in the respective HTML pages.\n\n## Generation provenance\n\nSee \`image-prompts.json\` for the generation prompt set and \`image-inventory.json\` for dimensions, byte counts and SHA-256 hashes. All checksums are distinct. Generated originals remain in the development machine's Codex generated_images folder; optimized deliverables are self-contained in this project. No third-party images are hotlinked.\n`;
fs.writeFileSync("documentation/image-manifest.md", text);
fs.writeFileSync("documentation/image-inventory.json", JSON.stringify(manifest, null, 2));
const packaging = {
    atlas: "indigo box with gold mountain linework and a compass, landscape hex tiles and wooden explorers",
    moon: "navy box with crescent moon and copper lantern illustration, trading cards and amber tokens",
    canopy: "coral box with forest animals and oak leaves, chunky woodland tiles",
    orbit: "lavender box with abstract planets and silver rings, playing cards with orbital patterns",
    bloom: "ivory box with intricate illustrated flowers, jigsaw pieces",
    dice: "small charcoal dice case with brass dragon emblem, translucent amber polyhedral dice",
    harbor: "terracotta box with coastal village illustration, little wooden boats and resource tokens",
    fox: "ochre box with charming fox illustration, animal storytelling cards",
    trail: "sage gray box with indigo hiking trail illustration, map cards and a single wooden hiker",
    tower: "deep purple box with geometric tower illustration, wooden balancing blocks",
};
const lifestyle = {
    "home/tabletop-hero":
        "Close three-quarter overhead view of a richly detailed original tabletop strategy game on a warm walnut table, ivory hexagonal landscape tiles, small indigo and amber wooden playing pieces, tasteful illustrated cards, a pair of hands moving a piece, warm natural afternoon window light, tactile paper and wood, sophisticated cozy mood, crisp realistic photography, landscape 3:2 composition. No readable text, no logos, no watermark.",
    "home/weekly-atlas":
        "A premium strategy game with indigo and gold mountain themed Atlas of the Wild box on an oak table, expansive terrain hex board and tiny wooden explorers, overhead closeup",
    "home/find-your-game":
        "two friends choosing illustrated games from a boutique board game shelf, closeup of hands and beautiful boxes",
    "home-2/community-hero":
        "diverse group of four adult friends enjoying a tactile strategy board game at a warm inviting boutique table, candid editorial wide shot",
    "home-2/featured-night":
        "overhead view of four friends hands around a beautifully arranged board game with wooden boats and tiles, evening warm light",
    "home-2/store-story":
        "quiet beautiful boutique board game shop interior with walnut shelving, indigo painted wall and oak gaming table",
    "home-2/moment-one":
        "two adults laughing over a light card game at a boutique game cafe, intimate candid editorial photo",
    "home-2/moment-two":
        "closeup of a hand rolling amber dice on an indigo felt gaming mat, shallow depth of field",
    "home-2/moment-three":
        "family of parents and two school age children playing colorful animal tiles at a cozy table",
    "about/our-story":
        "beautiful independent tabletop game boutique with wooden shelves and sunlit communal table, original photography",
    "about/team-mara":
        "friendly adult woman game curator in casual indigo shirt, candid environmental portrait in board game shop",
    "about/team-ellis":
        "friendly adult man events host in cream overshirt, environmental portrait with game shelves",
    "about/team-jules":
        "friendly nonbinary adult tabletop designer with short curly hair in amber sweater, environmental portrait in studio",
    "events/strategy":
        "adults learning a mountain exploration strategy game at a welcoming communal table, no readable text",
    "events/family":
        "parents and young children playing woodland animal board game on oak table, welcoming daylight",
    "events/rpg":
        "small group of adults playing tabletop roleplaying game, illustrated maps, amber polyhedral dice and paper character sheets",
    "events/strategy-detail":
        "close overhead view of a strategy board with hexagonal mountain terrain and hands placing indigo explorer pieces",
    "events/family-detail":
        "cozy close view of wooden animal game tokens and little hands on woodland board",
    "events/rpg-detail":
        "cinematic close photograph of amber roleplay dice, handwritten adventure notebook and fantasy map on walnut table",
};
const prompts = manifest.map((asset) => {
    const file = asset.file.replace("assets/images/", "").replace(".webp", "");
    const [id, view] = path.basename(file).split("-");
    const p = products.find((p) => p.id === id);
    let prompt;
    if (p && view === "home")
        prompt = `Use case: product-mockup. One sophisticated tabletop game product photo of fictional "${p.name}": ${packaging[id]}. Game box with readable title "${p.name}" and a few components on a warm pale tabletop, viewed from eye level at a three-quarter angle. Elegant natural shadows, premium editorial studio style, square composition, no watermark, no third-party logos.`;
    else if (p)
        prompt = `Use case: product-mockup. One premium realistic studio photograph of a fictional boutique tabletop game named "${p.name}". Product identity: ${packaging[id]}. ${view === "catalog" ? "Sealed box standing three-quarter view on a warm ivory seamless background." : view === "detail" ? "Open box and complete playing components thoughtfully arranged on a light oak table, close overhead view." : view === "related" ? "Low side angle of the game box and a few distinctive components on a neutral stone plinth." : "Game components laid out ready to play on a warm linen tabletop, diagonal overhead view, box visible."} Tasteful original packaging, accurate readable title "${p.name}", no third party logos, no watermark. Soft natural light, refined indigo amber and ivory accents. Square image, generous breathing room, clear full product.`;
    else
        prompt = `Use case: photorealistic-natural. One premium original editorial photograph for Table & Tale fictional board game boutique. ${lifestyle[file]}. Warm natural lighting, refined tactile materials, indigo and warm ivory color accents, authentic unstaged mood, landscape 3:2 framing. No logos, no watermark, no prominent readable text.`;
    return { file: asset.file, prompt };
});
fs.writeFileSync(
    "documentation/image-prompts.json",
    JSON.stringify(
        {
            tool: "Built-in ImageGen",
            optimization: "ImageMagick WebP, quality 80 (hero 82), width 1200 (hero 1400)",
            assets: prompts,
        },
        null,
        2,
    ),
);
console.log(
    `${manifest.length} unique images inventoried; ${(manifest.reduce((s, a) => s + a.bytes, 0) / 1024 / 1024).toFixed(2)} MiB total.`,
);
