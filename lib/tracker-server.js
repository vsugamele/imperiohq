// ── lib/tracker-server.js — redirect + atribuição de cliques ─────
const crypto = require('crypto');
const { sbFetch, sbUpsert, sbUpdate } = require('./supabase');

async function handleTrackerRedirect(req, res, slug) {
  if (!slug) { res.writeHead(302, { Location: '/' }); return res.end(); }

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

  let dest;
  try { dest = new URL(link.destino); } catch {
    res.writeHead(302, { Location: link.destino }); return res.end();
  }
  dest.searchParams.set('sck', clickId);
  dest.searchParams.set('src', clickId); // Ticto usa 'src'

  const clickRow = {
    id:           clickId,
    link_id:      link.id,
    project_id:   link.project_id  || null,
    utm_source:   link.utm_source  || null,
    utm_medium:   link.utm_medium  || null,
    utm_campaign: link.utm_campaign || null,
    utm_content:  link.utm_content  || null,
    utm_term:     link.utm_term     || null,
    ip:      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null,
    ua:      req.headers['user-agent'] || null,
    referer: req.headers['referer']    || null,
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

module.exports = { handleTrackerRedirect, attributeClick };
