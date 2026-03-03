const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { URL } = require('url');

const PORT = parseInt(process.env.PORT || '3000', 10);
const ROOT = __dirname;  // project root

// ── WhatsApp Bridge ─────────────────────────────────────────────
function findClawdbotRoot() {
  try {
    const npmRoot = execSync('npm root -g', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return path.join(npmRoot, 'clawdbot');
  } catch {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    return path.join(home, 'AppData', 'Roaming', 'npm', 'node_modules', 'clawdbot');
  }
}

let _clawdbotRoot = null;
let _loginQrModule = null;

async function getLoginQrModule() {
  if (_loginQrModule) return _loginQrModule;
  if (!_clawdbotRoot) _clawdbotRoot = findClawdbotRoot();
  const filePath = path.join(_clawdbotRoot, 'dist', 'web', 'login-qr.js');
  const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');
  _loginQrModule = await import(fileUrl);
  return _loginQrModule;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, data) {
  setCors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function handleWaRoute(req, res, urlObj) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const session = urlObj.searchParams.get('session') || 'default';
  const force   = urlObj.searchParams.get('force') === '1';

  // POST /wa/qr — generate QR code
  if (req.method === 'POST' && urlObj.pathname === '/wa/qr') {
    try {
      const mod = await getLoginQrModule();
      const result = await mod.startWebLoginWithQr({ accountId: session, force });
      return sendJson(res, 200, {
        qrDataUrl: result.qrDataUrl || null,
        message:   result.message  || ''
      });
    } catch (err) {
      return sendJson(res, 500, { error: String(err) });
    }
  }

  // GET /wa/status — quick connection check (non-blocking)
  if (req.method === 'GET' && urlObj.pathname === '/wa/status') {
    try {
      const mod = await getLoginQrModule();
      const result = await mod.waitForWebLogin({ accountId: session, timeoutMs: 800 });
      return sendJson(res, 200, {
        connected: result.connected,
        message:   result.message || ''
      });
    } catch (err) {
      return sendJson(res, 500, { error: String(err) });
    }
  }

  return sendJson(res, 404, { error: 'Not found' });
}

// ── Static file MIME map ─────────────────────────────────────────
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2'
};

// ── HTTP server ─────────────────────────────────────────────────
http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);

  // Route: WhatsApp bridge API
  if (urlObj.pathname.startsWith('/wa/')) {
    return handleWaRoute(req, res, urlObj).catch(err => {
      if (!res.headersSent) sendJson(res, 500, { error: String(err) });
    });
  }

  // Route: static files
  let urlPath = urlObj.pathname;
  if (urlPath === '/') urlPath = '/imperio-hq-v5.html';

  const filePath = path.join(ROOT, urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end(`Not found: ${urlPath}`);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n✅ Imperio HQ rodando em http://localhost:${PORT}`);
  console.log(`   API WhatsApp disponível em /wa/qr e /wa/status`);

  // Warm up the clawdbot module import in background
  getLoginQrModule()
    .then(() => console.log('   ✓ clawdbot módulo carregado'))
    .catch(err => console.warn('   ⚠ clawdbot não encontrado:', String(err).split('\n')[0]));
});
