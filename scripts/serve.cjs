const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const mime = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json",
    ".webp": "image/webp",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".ico": "image/x-icon",
    ".md": "text/plain; charset=utf-8",
    ".xml": "application/xml",
};
const port = Number(process.env.PORT || 4173);
http.createServer((req, res) => {
    let requested;
    try {
        requested = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
        res.writeHead(400);
        res.end();
        return;
    }
    const file = path.resolve(
        root,
        "." + (requested.endsWith("/") ? requested + "index.html" : requested),
    );
    if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
    }
    fs.readFile(file, (error, data) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end(
                '<h1>Page not found</h1><p><a href="/pages/404.html">Visit the Table & Tale 404 page</a></p>',
            );
            return;
        }
        res.writeHead(200, {
            "Content-Type": mime[path.extname(file)] || "application/octet-stream",
            "Cache-Control": "no-cache",
        });
        res.end(data);
    });
}).listen(port, "127.0.0.1", () =>
    console.log(`Table & Tale preview: http://127.0.0.1:${port}/pages/index.html`),
);
