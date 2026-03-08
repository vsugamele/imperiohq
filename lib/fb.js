// ── lib/fb.js — Facebook Conversions API ─────────────────────────
const https  = require('https');
const crypto = require('crypto');

function sha256(str) {
  if (!str) return null;
  return crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
}

/**
 * Envia evento para o CAPI com credenciais explícitas do projeto.
 * @param {string} pixelId
 * @param {string} accessToken
 * @param {string|null} testEventCode
 * @param {string} eventName  — 'Purchase' | 'InitiateCheckout'
 * @param {object} userData   — { email, phone, nome }
 * @param {object} customData — { currency, value, content_name }
 */
function sendFBEvent(pixelId, accessToken, testEventCode, eventName, userData = {}, customData = {}) {
  if (!pixelId || !accessToken) return;

  const ud = {};
  if (userData.email) ud.em = [sha256(userData.email)];
  if (userData.phone) ud.ph = [sha256('55' + userData.phone)];
  if (userData.nome)  ud.fn = [sha256(userData.nome.split(' ')[0])];

  const payload = {
    data: [{
      event_name:    eventName,
      event_time:    Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data:     ud,
      custom_data:   customData,
    }],
  };
  if (testEventCode) payload.test_event_code = testEventCode;

  const body  = JSON.stringify(payload);
  const fbReq = https.request({
    hostname: 'graph.facebook.com',
    path:     `/v19.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    method:   'POST',
    headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  }, fbRes => {
    let d = '';
    fbRes.on('data', c => d += c);
    fbRes.on('end', () => {
      if (fbRes.statusCode >= 200 && fbRes.statusCode < 300)
        console.log(`[fb-capi] ✓ ${eventName} (pixel ${pixelId.slice(0, 8)}…)`);
      else
        console.warn(`[fb-capi] ✗ ${eventName} status=${fbRes.statusCode}:`, d.slice(0, 200));
    });
  });
  fbReq.on('error', err => console.warn('[fb-capi] erro:', String(err).split('\n')[0]));
  fbReq.write(body);
  fbReq.end();
}

module.exports = { sha256, sendFBEvent };
