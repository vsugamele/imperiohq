// api/fb-config.js — GET/POST config Facebook CAPI por projeto (Fase 3E)
const { sendJson, readBody } = require('../lib/helpers');
const { getProjectFbConfig, saveProjectFbConfig } = require('../lib/projeto');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(204);
    return res.end();
  }

  const urlObj     = new URL(req.url, `https://${req.headers.host}`);
  const projectId  = urlObj.searchParams.get('project_id') || null;

  // GET — retorna config atual (nunca expõe token completo)
  if (req.method === 'GET') {
    try {
      const cfg = await getProjectFbConfig(projectId);
      return sendJson(res, 200, {
        project_id:      projectId,
        pixel_id:        cfg.pixelId        || '',
        has_token:       !!cfg.accessToken,
        token_tail:      cfg.accessToken ? cfg.accessToken.slice(-6) : '',
        test_event_code: cfg.testEventCode  || '',
      });
    } catch (err) {
      return sendJson(res, 500, { error: String(err) });
    }
  }

  // POST — salva config
  if (req.method === 'POST') {
    try {
      const b = await readBody(req);
      const pId = b.project_id || projectId || null;
      await saveProjectFbConfig(pId, {
        pixel_id:        String(b.pixel_id        || '').trim(),
        access_token:    'access_token' in b ? String(b.access_token || '').trim() : '',
        test_event_code: String(b.test_event_code || '').trim(),
      });
      const label = pId ? `projeto ${pId}` : 'global';
      console.log(`[fb-config] salvo (${label}): pixel ${b.pixel_id ? String(b.pixel_id).slice(0, 8) + '…' : '(vazio)'}`);
      return sendJson(res, 200, { ok: true });
    } catch (err) {
      return sendJson(res, 500, { error: String(err) });
    }
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
};
