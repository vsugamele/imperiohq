// api/webhook/ticto.js — Webhook Ticto
const { readBody, sendJson, normalizePhone, leadId } = require('../../lib/helpers');
const { sbUpsert }           = require('../../lib/supabase');
const { sendFBEvent }        = require('../../lib/fb');
const { attributeClick }     = require('../../lib/tracker-server');
const { loadProdutoMap, getProjectFbConfig } = require('../../lib/projeto');

const STATUS_MAP = {
  'order.approved':   'aprovado',
  'order.completed':  'aprovado',
  'order.pending':    'aguardando',
  'order.refunded':   'reembolsado',
  'order.canceled':   'cancelado',
  'order.chargeback': 'cancelado',
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const payload  = await readBody(req);
    const event    = payload.event || '';
    const order    = payload.data?.order    || payload.order    || {};
    const product  = payload.data?.product  || payload.product  || {};
    const customer = payload.data?.customer || payload.customer || {};

    const status    = STATUS_MAP[event] || 'aguardando';
    const valor     = Number(order.total || order.amount || 0);
    const transId   = String(order.id || ('tc_' + Date.now()));
    const email     = customer.email || null;
    const phone     = customer.phone || null;
    const nome      = customer.name  || null;
    const lId       = leadId(email, phone);

    // Produto → Projeto
    const produtoMap = await loadProdutoMap();
    const projectId  = produtoMap[String(product.id || '')] || null;

    // Atribuição de clique (sck)
    const sck  = order.tracking?.sck || order.sale?.tracking?.sck || payload.tracking?.sck || null;
    const utms = sck ? await attributeClick(sck, lId) : null;

    // Lead
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

    // Venda
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
      utm_campaign:   utms?.utm_campaign || null,
      utm_content:    utms?.utm_content  || null,
      utm_term:       utms?.utm_term     || null,
    });

    // Facebook CAPI — pixel do projeto (Fase 3E)
    const fbCfg    = await getProjectFbConfig(projectId);
    const fbUser   = { email, phone: normalizePhone(phone), nome };
    const fbCustom = { currency: 'BRL', value: valor, content_name: product.name || undefined };
    if (status === 'aprovado')   sendFBEvent(fbCfg.pixelId, fbCfg.accessToken, fbCfg.testEventCode, 'Purchase',         fbUser, fbCustom);
    if (status === 'aguardando') sendFBEvent(fbCfg.pixelId, fbCfg.accessToken, fbCfg.testEventCode, 'InitiateCheckout', fbUser, fbCustom);

    console.log(`[webhook] Ticto ${event} — ${nome} (${email}) R$${valor} [${status}]${projectId ? ` proj=${projectId}` : ''}${utms ? ` utm=${utms.utm_source}/${utms.utm_campaign}` : ''}`);
    return sendJson(res, 200, { ok: true });

  } catch (err) {
    console.error('[webhook] Ticto error:', err);
    return sendJson(res, 500, { error: String(err) });
  }
};
