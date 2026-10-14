const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".appcache": "text/cache-manifest; charset=utf-8",
  ".manifest": "text/cache-manifest; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".bin": "application/octet-stream",
  ".dat": "application/octet-stream",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, headers, body) {
  res.writeHead(status, Object.assign({ "Cache-Control": "no-store" }, headers));
  if (body) res.end(body);
  else res.end();
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch (e) {
    return send(res, 400, {}, "bad request");
  }

  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) return send(res, 403, {}, "forbidden");

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      console.log(`${req.method} ${urlPath} -> 404`);
      return send(res, 404, { "Content-Type": "text/plain" }, "not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    fs.readFile(filePath, (rerr, data) => {
      if (rerr) {
        console.log(`${req.method} ${urlPath} -> 500`);
        return send(res, 500, {}, "read error");
      }
      console.log(`${req.method} ${urlPath} -> 200 (${data.length} bytes)`);
      send(
        res,
        200,
        { "Content-Type": type, "Content-Length": data.length },
        data,
      );
    });
  });
});

server.listen(PORT, HOST, () => {
  const nets = os.networkInterfaces();
  const addrs = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) addrs.push(net.address);
    }
  }
  console.log("PS4 Jailbreak (13.02-13.52) self-host running");
  console.log(`  Local:   http://localhost:${PORT}/`);
  for (const a of addrs) console.log(`  Network: http://${a}:${PORT}/  <-- use this on the PS4`);
  console.log(`  Serving: ${ROOT}`);
  console.log("Press Ctrl+C to stop.");
});
