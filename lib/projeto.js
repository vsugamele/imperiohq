// ── lib/projeto.js — mapeamento produto→projeto + config FB por projeto ──
const { sbFetch, sbUpsert } = require('./supabase');

// Carrega mapa { produto_id_ext → project_id } do banco (sem cache — serverless)
async function loadProdutoMap() {
  try {
    const projects = await sbFetch('imphq_projects', 'select=id,data');
    const map = {};
    for (const p of (Array.isArray(projects) ? projects : [])) {
      const ids = (p.data && Array.isArray(p.data.produto_ids_ext)) ? p.data.produto_ids_ext : [];
      for (const id of ids) {
        if (id) map[String(id)] = p.id;
      }
    }
    return map;
  } catch (err) {
    console.warn('[produto-map] Erro:', String(err).split('\n')[0]);
    return {};
  }
}

/**
 * Busca configuração FB do projeto.
 * Ordem de prioridade:
 *   1. imphq_projects.fb_pixel_id (por projeto)
 *   2. imphq_empresa cfg_fb_capi  (global via UI)
 *   3. process.env.FB_*           (env vars / .env)
 *
 * @param {string|null} projectId
 * @returns {{ pixelId, accessToken, testEventCode }}
 */
async function getProjectFbConfig(projectId) {
  const envPixel    = process.env.FB_PIXEL_ID        || '';
  const envToken    = process.env.FB_ACCESS_TOKEN    || '';
  const envTestCode = process.env.FB_TEST_EVENT_CODE || '';

  // 1. Config específica do projeto
  if (projectId) {
    try {
      const rows = await sbFetch(
        'imphq_projects',
        `id=eq.${encodeURIComponent(projectId)}&select=fb_pixel_id,fb_access_token,fb_test_event_code&limit=1`
      );
      const proj = rows?.[0];
      if (proj && proj.fb_pixel_id) {
        return {
          pixelId:       proj.fb_pixel_id,
          accessToken:   proj.fb_access_token   || envToken,
          testEventCode: proj.fb_test_event_code || envTestCode,
        };
      }
    } catch (err) {
      console.warn('[fb-config] erro ao buscar projeto:', String(err).split('\n')[0]);
    }
  }

  // 2. Config global salva pela UI (imphq_empresa)
  try {
    const rows = await sbFetch('imphq_empresa', 'id=eq.cfg_fb_capi&select=extra&limit=1');
    const extra = rows?.[0]?.extra;
    if (extra && extra.pixel_id) {
      return {
        pixelId:       extra.pixel_id,
        accessToken:   extra.access_token   || envToken,
        testEventCode: extra.test_event_code || envTestCode,
      };
    }
  } catch (_) {}

  // 3. Fallback: env vars
  return { pixelId: envPixel, accessToken: envToken, testEventCode: envTestCode };
}

/**
 * Salva config FB de um projeto em imphq_projects.
 * Token vazio = mantém o existente.
 */
async function saveProjectFbConfig(projectId, { pixel_id, access_token, test_event_code }) {
  if (!projectId) {
    // Global config → imphq_empresa (compatibilidade com Fase 3D)
    const existing = await sbFetch('imphq_empresa', 'id=eq.cfg_fb_capi&select=extra&limit=1');
    const oldToken = existing?.[0]?.extra?.access_token || process.env.FB_ACCESS_TOKEN || '';
    await sbUpsert('imphq_empresa', {
      id:         'cfg_fb_capi',
      tipo:       'config',
      nome:       'Facebook CAPI',
      extra:      {
        pixel_id,
        access_token:   access_token || oldToken,
        test_event_code: test_event_code || '',
      },
      updated_at: new Date().toISOString(),
    });
    return;
  }

  // Se token vazio, busca o existente para não sobrescrever
  let finalToken = access_token;
  if (!finalToken) {
    try {
      const rows = await sbFetch(
        'imphq_projects',
        `id=eq.${encodeURIComponent(projectId)}&select=fb_access_token&limit=1`
      );
      finalToken = rows?.[0]?.fb_access_token || '';
    } catch (_) {}
  }

  // Usa sbUpdate com PATCH para não tocar em outras colunas do projeto
  const { sbUpdate } = require('./supabase');
  await sbUpdate('imphq_projects', encodeURIComponent(projectId), {
    fb_pixel_id:       pixel_id        || null,
    fb_access_token:   finalToken      || null,
    fb_test_event_code: test_event_code || null,
    updated_at:        new Date().toISOString(),
  });
}

module.exports = { loadProdutoMap, getProjectFbConfig, saveProjectFbConfig };
