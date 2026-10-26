const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const mark =
    '<path d="m22 1 19 11v21L22 44 3 33V12z" fill="currentColor"/><path d="m9 15 13-7 13 7-13 8z" fill="#faf8f4"/><path d="M9 20v10l10 6V26z" fill="#d99a36"/><path d="m25 26 10-6v10l-10 6z" fill="#faf8f4"/><circle cx="22" cy="15" r="2.7" fill="#343b78"/>';
const svg = (body, width, height, color) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="color:${color}">${body}</svg>`;
fs.writeFileSync(path.join(root, "favicon.svg"), svg(mark, 44, 44, "#343b78"));
fs.writeFileSync(path.join(root, "assets/icons/logo-mark.svg"), svg(mark, 44, 44, "#343b78"));
for (const [mode, color] of [
    ["light", "#343b78"],
    ["dark", "#a5b4fc"],
]) {
    const horizontal = `<g transform="translate(0 1)">${mark}</g><text x="57" y="29" fill="${color}" font-family="Outfit, Arial, sans-serif" font-size="31" font-weight="600" letter-spacing="-1.5">Table & Tale</text><text x="59" y="44" fill="${color}" font-family="Inter, Arial, sans-serif" font-size="7.5" letter-spacing="2">GAMES &amp; GOOD COMPANY</text>`;
    fs.writeFileSync(
        path.join(root, `assets/icons/logo-${mode}.svg`),
        svg(horizontal, 245, 50, color),
    );
}
fs.copyFileSync(
    path.join(root, "assets/icons/logo-light.svg"),
    path.join(root, "assets/icons/logo-primary.svg"),
);
fs.copyFileSync(
    path.join(root, "node_modules/bootstrap/LICENSE"),
    path.join(root, "assets/css/Bootstrap-LICENSE.txt"),
);
console.log("SVG brand assets created.");
