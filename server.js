const http   = require('http');
const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { URL } = require('url');

// ── Supabase config (mesmas credenciais do frontend) ─────────────
const SUPA_URL = process.env.SUPA_URL || 'https://tkbivipqiewkfnhktmqq.supabase.co';
const SUPA_KEY = process.env.SUPA_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrYml2aXBxaWV3a2ZuaGt0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NzY4NDgsImV4cCI6MjA1NDA1Mjg0OH0.2TnLj4lriG7eoPQWDo0mV8u8YHor6bd5ItZCHYhkym0';

// ── Supabase REST helper ─────────────────────────────────────────
function sbUpsert(table, row) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(Array.isArray(row) ? row : [row]);
    const urlObj = new URL(`${SUPA_URL}/rest/v1/${table}?on_conflict=id`);
    const opts = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname + urlObj.search,
      method:   'POST',
      headers:  {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey':         SUPA_KEY,
        'Authorization':  `Bearer ${SUPA_KEY}`,
        'Prefer':         'resolution=merge-duplicates',
      },
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(d);
        else reject(new Error(`Supabase ${res.statusCode}: ${d}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
function sbUpdate(table, id, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`);
    const opts = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname + urlObj.search,
      method:   'PATCH',
      headers:  {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey':         SUPA_KEY,
        'Authorization':  `Bearer ${SUPA_KEY}`,
      },
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Supabase GET helper ──────────────────────────────────────────
function sbFetch(table, query) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${SUPA_URL}/rest/v1/${table}?${query}`);
    const opts = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname + urlObj.search,
      method:   'GET',
      headers:  { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` },
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve([]); } });
    });
    req.on('error', reject);
    req.end();
  });
}

// ── Produto → Projeto map ────────────────────────────────────────
let _produtoMap = {};   // { produto_id_ext → project_id }

async function refreshProdutoMap() {
  try {
    const projects = await sbFetch('imphq_projects', 'select=id,data');
    const map = {};
    for (const p of (Array.isArray(projects) ? projects : [])) {
      const ids = (p.data && Array.isArray(p.data.produto_ids_ext)) ? p.data.produto_ids_ext : [];
      for (const id of ids) {
        if (id) map[String(id)] = p.id;
      }
    }
    _produtoMap = map;
    const n = Object.keys(map).length;
    if (n > 0) console.log(`[produto-map] ${n} mapeamento${n !== 1 ? 's' : ''} carregado${n !== 1 ? 's' : ''}`);
  } catch (err) {
    console.warn('[produto-map] Erro ao carregar:', String(err).split('\n')[0]);
  }
}

function getProjectForProduct(produtoIdExt) {
  return _produtoMap[String(produtoIdExt || '')] || null;
}

// ── Tracker: redirect + click logging ────────────────────────────
async function handleTrackerRedirect(req, res, urlObj) {
  const slug = urlObj.pathname.replace(/^\/r\//, '').split('?')[0];
  if (!slug) { res.writeHead(302, { Location: '/' }); return res.end(); }

  // Busca o link pelo slug (id)
  let links;
  try {
    links = await sbFetch('imphq_tracking_links', `id=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
  } catch (_) { links = []; }

  if (!Array.isArray(links) || !links[0] || !links[0].ativo) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Link não encontrado ou inativo');
  }

  const link    = links[0];
  const clickId = crypto.randomUUID();

  // Monta URL de destino com sck embutido
  let dest;
  try { dest = new URL(link.destino); } catch {
    res.writeHead(302, { Location: link.destino }); return res.end();
  }
  dest.searchParams.set('sck', clickId);
  dest.searchParams.set('src', clickId); // Ticto usa 'src'

  // Registra o clique (fire-and-forget — não bloqueia o redirect)
  const clickRow = {
    id:           clickId,
    link_id:      link.id,
    project_id:   link.project_id  || null,
    utm_source:   link.utm_source  || null,
    utm_medium:   link.utm_medium  || null,
    utm_campaign: link.utm_campaign || null,
    utm_content:  link.utm_content  || null,
    utm_term:     link.utm_term     || null,
    ip:     req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || null,
    ua:     req.headers['user-agent'] || null,
    referer: req.headers['referer'] || null,
    convertido:  false,
    created_at:  new Date().toISOString(),
  };
  sbUpsert('imphq_clicks', clickRow).catch(err =>
    console.warn('[tracker] erro ao salvar clique:', String(err).split('\n')[0])
  );

  console.log(`[tracker] /r/${slug} → ${dest.hostname} click=${clickId}`);
  res.writeHead(302, { Location: dest.toString() });
  res.end();
}

// ── attributeClick: liga sck → click, retorna UTMs para venda ────
async function attributeClick(sck, lId) {
  if (!sck) return null;
  let clicks;
  try {
    clicks = await sbFetch('imphq_clicks', `id=eq.${encodeURIComponent(sck)}&select=*&limit=1`);
  } catch (_) { return null; }
  if (!Array.isArray(clicks) || !clicks[0]) {
    console.log(`[tracker] sck "${sck}" não encontrado em imphq_clicks`);
    return null;
  }
  const c = clicks[0];
  // Marca clique como convertido (fire-and-forget)
  sbUpdate('imphq_clicks', encodeURIComponent(sck), {
    convertido:   true,
    lead_id:      lId,
    converted_at: new Date().toISOString(),
  }).catch(err => console.warn('[tracker] attributeClick patch:', String(err).split('\n')[0]));

  console.log(`[tracker] atribuído click=${sck} → lead=${lId} utm=${c.utm_source}/${c.utm_campaign}`);
  return {
    click_id:     sck,
    utm_source:   c.utm_source   || null,
    utm_medium:   c.utm_medium   || null,
    utm_campaign: c.utm_campaign || null,
    utm_content:  c.utm_content  || null,
    utm_term:     c.utm_term     || null,
  };
}

// ── Body parser ──────────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1e6) reject(new Error('Payload too large')); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

// ── Normaliza telefone para id único ────────────────────────────
function normalizePhone(p) {
  if (!p) return null;
  return p.replace(/\D/g, '').replace(/^0+/, '').slice(-11);
}
function leadId(email, phone) {
  if (email) return 'lead_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const p = normalizePhone(phone);
  return p ? 'lead_' + p : 'lead_' + Date.now();
}

// ── Webhook: Hotmart ──────────────────────────────────────────────
// Docs: https://developers.hotmart.com/docs/pt-BR/webhooks/overview/
async function handleHotmart(req, res) {
  const payload = await readBody(req);
  const event   = payload.event || '';
  const data    = payload.data  || {};
  const buyer   = data.buyer    || {};
  const purchase = data.purchase || {};
  const product  = data.product  || {};

  const statusMap = {
    PURCHASE_COMPLETE:         'aprovado',
    PURCHASE_APPROVED:         'aprovado',
    PURCHASE_BILLET_PRINTED:   'aguardando',
    PURCHASE_WAITING_PAYMENT:  'aguardando',
    PURCHASE_REFUNDED:         'reembolsado',
    PURCHASE_CANCELED:         'cancelado',
    PURCHASE_CHARGEBACK:       'cancelado',
  };

  const status    = statusMap[event] || 'aguardando';
  const valor     = Number(purchase.price?.value || purchase.full_price?.value || 0);
  const transId   = purchase.transaction || ('hm_' + Date.now());
  const email     = buyer.email  || null;
  const phone     = buyer.checkout_phone || null;
  const nome      = buyer.name   || null;
  const lId       = leadId(email, phone);
  const projectId = getProjectForProduct(product.id);

  // Atribuição: extrai sck enviado pelo Hotmart como tracking parameter
  const sck  = purchase.tracking_parameters?.sck || data.tracking_parameters?.sck || null;
  const utms = sck ? await attributeClick(sck, lId) : null;

  // Salva lead
  await sbUpsert('imphq_leads', {
    id:         lId,
    nome,
    email,
    phone:      normalizePhone(phone),
    plataforma: 'hotmart',
    project_id: projectId,
    status:     status === 'aprovado' ? 'cliente' : 'lead',
    score:      status === 'aprovado' ? 20 : 5,
    updated_at: new Date().toISOString(),
  });

  // Salva venda (com UTMs atribuídos se vieram pelo tracker)
  await sbUpsert('imphq_vendas', {
    id:             transId,
    lead_id:        lId,
    project_id:     projectId,
    produto_nome:   product.name      || null,
    produto_id_ext: String(product.id || ''),
    valor,
    plataforma:     'hotmart',
    status,
    data_venda:     purchase.approved_date || new Date().toISOString(),
    data:           payload,
    created_at:     new Date().toISOString(),
    click_id:       utms?.click_id    || null,
    utm_source:     utms?.utm_source  || null,
    utm_medium:     utms?.utm_medium  || null,
    utm_campaign:   utms?.utm_campaign|| null,
    utm_content:    utms?.utm_content || null,
    utm_term:       utms?.utm_term    || null,
  });

  console.log(`[webhook] Hotmart ${event} — ${nome} (${email}) R$${valor} [${status}]${utms ? ` utm=${utms.utm_source}/${utms.utm_campaign}` : ''}`);
  sendJson(res, 200, { ok: true });
}

// ── Webhook: Ticto ────────────────────────────────────────────────
// Docs: https://docs.ticto.com.br/webhooks
async function handleTicto(req, res) {
  const payload  = await readBody(req);
  const event    = payload.event || '';
  const order    = payload.data?.order    || payload.order    || {};
  const product  = payload.data?.product  || payload.product  || {};
  const customer = payload.data?.customer || payload.customer || {};

  const statusMap = {
    'order.approved':  'aprovado',
    'order.completed': 'aprovado',
    'order.pending':   'aguardando',
    'order.refunded':  'reembolsado',
    'order.canceled':  'cancelado',
    'order.chargeback':'cancelado',
  };

  const status    = statusMap[event] || 'aguardando';
  const valor     = Number(order.total || order.amount || 0);
  const transId   = String(order.id || ('tc_' + Date.now()));
  const email     = customer.email || null;
  const phone     = customer.phone || null;
  const nome      = customer.name  || null;
  const lId       = leadId(email, phone);
  const projectId = getProjectForProduct(product.id);

  // Atribuição: extrai sck enviado pelo Ticto como tracking parameter
  const sck  = order.tracking?.sck || order.sale?.tracking?.sck || payload.tracking?.sck || null;
  const utms = sck ? await attributeClick(sck, lId) : null;

  await sbUpsert('imphq_leads', {
    id:         lId,
    nome,
    email,
    phone:      normalizePhone(phone),
    plataforma: 'ticto',
    project_id: projectId,
    status:     status === 'aprovado' ? 'cliente' : 'lead',
    score:      status === 'aprovado' ? 20 : 5,
    updated_at: new Date().toISOString(),
  });

  await sbUpsert('imphq_vendas', {
    id:             transId,
    lead_id:        lId,
    project_id:     projectId,
    produto_nome:   product.name      || null,
    produto_id_ext: String(product.id || ''),
    valor,
    plataforma:     'ticto',
    status,
    data_venda:     order.created_at || new Date().toISOString(),
    data:           payload,
    created_at:     new Date().toISOString(),
    click_id:       utms?.click_id    || null,
    utm_source:     utms?.utm_source  || null,
    utm_medium:     utms?.utm_medium  || null,
    utm_campaign:   utms?.utm_campaign|| null,
    utm_content:    utms?.utm_content || null,
    utm_term:       utms?.utm_term    || null,
  });

  console.log(`[webhook] Ticto ${event} — ${nome} (${email}) R$${valor} [${status}]${utms ? ` utm=${utms.utm_source}/${utms.utm_campaign}` : ''}`);
  sendJson(res, 200, { ok: true });
}

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

  // Route: Tracking redirect  GET /r/:slug
  if (req.method === 'GET' && urlObj.pathname.startsWith('/r/')) {
    return handleTrackerRedirect(req, res, urlObj).catch(err => {
      console.error('[tracker] redirect error:', err);
      if (!res.headersSent) { res.writeHead(302, { Location: '/' }); res.end(); }
    });
  }

  // Route: API produto-map
  if (req.method === 'GET' && urlObj.pathname === '/api/produto-map') {
    return sendJson(res, 200, _produtoMap);
  }
  if (req.method === 'POST' && urlObj.pathname === '/api/refresh-produto-map') {
    refreshProdutoMap().catch(() => {});
    return sendJson(res, 200, { ok: true });
  }

  // Route: Webhooks de plataformas de venda
  if (req.method === 'POST' && urlObj.pathname === '/webhook/hotmart') {
    return handleHotmart(req, res).catch(err => {
      console.error('[webhook] Hotmart error:', err);
      if (!res.headersSent) sendJson(res, 500, { error: String(err) });
    });
  }
  if (req.method === 'POST' && urlObj.pathname === '/webhook/ticto') {
    return handleTicto(req, res).catch(err => {
      console.error('[webhook] Ticto error:', err);
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
  console.log(`   API WhatsApp  → /wa/qr  /wa/status`);
  console.log(`   Webhook Hotmart → POST /webhook/hotmart`);
  console.log(`   Webhook Ticto   → POST /webhook/ticto`);

  // Load produto→projeto map at startup and refresh every 5 min
  refreshProdutoMap().catch(() => {});
  setInterval(refreshProdutoMap, 5 * 60 * 1000);

  // Warm up the clawdbot module import in background
  getLoginQrModule()
    .then(() => console.log('   ✓ clawdbot módulo carregado'))
    .catch(err => console.warn('   ⚠ clawdbot não encontrado:', String(err).split('\n')[0]));
});
