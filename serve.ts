// NusaStat — serve.ts
// Tiny static server for app/ on http://localhost:8080.
// Node 22, stdlib only. Usage: node serve.ts [--port <n>]

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = resolve(new URL(".", import.meta.url).pathname);
const root = join(here, "app");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

let port = 8080;
const portFlag = process.argv.indexOf("--port");
if (portFlag !== -1 && process.argv[portFlag + 1]) {
  const p = Number(process.argv[portFlag + 1]);
  if (Number.isInteger(p) && p > 0 && p < 65536) port = p;
}

const server = createServer((req, res) => {
  const raw = decodeURIComponent((req.url || "/").split("?")[0]);
  // Only GET/HEAD are served; anything else is a client error.
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "content-type": "text/plain" });
    res.end("method not allowed\n");
    return;
  }
  const rel = normalize(raw === "/" ? "index.html" : raw.replace(/^\//, ""));
  const file = join(root, rel);
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found\n");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`NusaStat serving app/ at http://localhost:${port}`);
});
