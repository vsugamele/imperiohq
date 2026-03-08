// ── lib/helpers.js — utilitários compartilhados ───────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1e6) reject(new Error('Payload too large')); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

function normalizePhone(p) {
  if (!p) return null;
  return p.replace(/\D/g, '').replace(/^0+/, '').slice(-11);
}

function leadId(email, phone) {
  if (email) return 'lead_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const p = normalizePhone(phone);
  return p ? 'lead_' + p : 'lead_' + Date.now();
}

function sendJson(res, status, data) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

module.exports = { readBody, normalizePhone, leadId, sendJson };
