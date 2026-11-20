#!/usr/bin/env node
/* Local preview of dist/ with clean URLs, the 404 page and _redirects. Not used in production. */
const http = require("http"), fs = require("fs"), path = require("path");
const DIST = path.resolve(__dirname, "../dist");
const PORT = Number(process.env.PORT) || 5173;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain" };
const rules = () => {
  const f = path.join(DIST, "_redirects");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").map((l) => l.trim().split(/\s+/)).filter((r) => r.length === 3 && r[0].startsWith("/")) : [];
};
http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost");
  const r = rules().find(([from]) => from === u.pathname);
  if (r) { res.writeHead(Number(r[2]), { Location: r[1] + u.search }); return res.end(); }
  let p = path.join(DIST, decodeURIComponent(u.pathname));
  if (!p.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
    if (!u.pathname.endsWith("/")) { res.writeHead(301, { Location: u.pathname + "/" + u.search }); return res.end(); }
    p = path.join(p, "index.html");
  }
  if (!fs.existsSync(p)) { res.writeHead(404, { "Content-Type": TYPES[".html"] }); return res.end(fs.readFileSync(path.join(DIST, "404.html"))); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
