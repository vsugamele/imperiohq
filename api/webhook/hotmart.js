// api/webhook/hotmart.js — Webhook Hotmart
const { readBody, sendJson, normalizePhone, leadId } = require('../../lib/helpers');
const { sbUpsert }           = require('../../lib/supabase');
const { sendFBEvent }        = require('../../lib/fb');
const { attributeClick }     = require('../../lib/tracker-server');
const { loadProdutoMap, getProjectFbConfig } = require('../../lib/projeto');

const STATUS_MAP = {
  PURCHASE_COMPLETE:        'aprovado',
  PURCHASE_APPROVED:        'aprovado',
  PURCHASE_BILLET_PRINTED:  'aguardando',
  PURCHASE_WAITING_PAYMENT: 'aguardando',
  PURCHASE_REFUNDED:        'reembolsado',
  PURCHASE_CANCELED:        'cancelado',
  PURCHASE_CHARGEBACK:      'cancelado',
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
    const event    = payload.event   || '';
    const data     = payload.data    || {};
    const buyer    = data.buyer      || {};
    const purchase = data.purchase   || {};
    const product  = data.product    || {};

    const status    = STATUS_MAP[event] || 'aguardando';
    const valor     = Number(purchase.price?.value || purchase.full_price?.value || 0);
    const transId   = purchase.transaction || ('hm_' + Date.now());
    const email     = buyer.email              || null;
    const phone     = buyer.checkout_phone     || null;
    const nome      = buyer.name               || null;
    const lId       = leadId(email, phone);

    // Produto → Projeto
    const produtoMap = await loadProdutoMap();
    const projectId  = produtoMap[String(product.id || '')] || null;

    // Atribuição de clique (sck)
    const sck  = purchase.tracking_parameters?.sck || data.tracking_parameters?.sck || null;
    const utms = sck ? await attributeClick(sck, lId) : null;

    // Lead
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

    // Venda
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

    console.log(`[webhook] Hotmart ${event} — ${nome} (${email}) R$${valor} [${status}]${projectId ? ` proj=${projectId}` : ''}${utms ? ` utm=${utms.utm_source}/${utms.utm_campaign}` : ''}`);
    return sendJson(res, 200, { ok: true });

  } catch (err) {
    console.error('[webhook] Hotmart error:', err);
    return sendJson(res, 500, { error: String(err) });
  }
};
