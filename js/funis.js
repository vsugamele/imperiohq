// ═══════════════════════════════════════════════════════════════════
//  FUNIS MODULE — Imperio HQ
//  View dedicada para mapear funis completos por produto/projeto
// ═══════════════════════════════════════════════════════════════════

// ── Module State ─────────────────────────────────────────────────
let fnActiveProjectId = null;
let fnActiveFunilId   = null;
let fnEditData        = null;
let fnModalSection    = 'geral';

// ── Persistence ───────────────────────────────────────────────────
function fnLoadOverrides() {
  try { return JSON.parse(localStorage.getItem('imperio_funis_v2') || '{}'); }
  catch (_) { return {}; }
}
function fnSaveOverrides(o) {
  localStorage.setItem('imperio_funis_v2', JSON.stringify(o));
}
function fnSaveFunil(funil) {
  // Salva localmente (imediato) e persiste no Supabase
  const overrides = fnLoadOverrides();
  overrides[funil.id] = funil;
  fnSaveOverrides(overrides);
  if (typeof SB !== 'undefined' && SB.upsertFunil) {
    SB.upsertFunil(funil).catch(e => console.warn('[funis] upsertFunil', e));
  }
}
function fnDeleteFunil(funilId) {
  const overrides = fnLoadOverrides();
  // Remove do projeto também
  const all = getAllFunnelsFlat();
  const entry = all.find(x => x.funil.id === funilId);
  if (entry) {
    const prod = entry.proj.produtos?.find(p => p.id === entry.prod.id);
    if (prod) prod.funis = (prod.funis || []).filter(f => f.id !== funilId);
    if (typeof projectsSaveCustom === 'function') projectsSaveCustom();
  }
  delete overrides[funilId];
  fnSaveOverrides(overrides);
  if (typeof SB !== 'undefined' && SB.deleteFunil) {
    SB.deleteFunil(funilId).catch(e => console.warn('[funis] deleteFunil', e));
  }
}
function fnUid() {
  return 'fn_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
}

// ── Entry Point ───────────────────────────────────────────────────
function showFunis() {
  if (typeof hideAllPanels === 'function') hideAllPanels();
  const panel = document.getElementById('view-funis');
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-funis');
  if (nav) nav.classList.add('active');
  renderFunisView();
}

// ── Core: build flat array of all funnels ─────────────────────────
function getAllFunnelsFlat() {
  const overrides = fnLoadOverrides();
  const result = [];
  (typeof PROJECTS !== 'undefined' ? PROJECTS : []).forEach(proj => {
    (proj.produtos || []).forEach(prod => {
      (prod.funis || []).forEach(f => {
        const fid = f.id || ('fn_' + proj.id + '_' + (prod.id || '') + '_' + f.nome.replace(/\s+/g,'_').toLowerCase());
        // Merge: base from PROJECTS + override from localStorage
        const merged = Object.assign({
          id: fid,
          etapas: [],
          sequencias: [],
          fontes_trafego: fnDefaultFontes(),
          integracoes: { analytics: {}, pagamentos: {} },
          criativos: [],
          notas_gerais: '',
          criado_em: new Date().toISOString().slice(0, 10),
        }, f, { id: fid }, overrides[fid] || {});
        result.push({ proj, prod, funil: merged });
      });
    });
  });
  // Also add standalone funnels from overrides not in PROJECTS
  Object.values(overrides).forEach(ov => {
    if (!result.find(x => x.funil.id === ov.id)) {
      const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === ov._projectId) || { id: ov._projectId, icon: '📁', nome: ov._projectNome || 'Projeto', categoria: '', pipeline: {}, produtos: [] };
      const prod = { id: ov._produtoId || '', nome: ov._produtoNome || 'Produto', funis: [] };
      result.push({ proj, prod, funil: ov });
    }
  });
  return result;
}

function fnDefaultFontes() {
  return [
    { tipo: 'Meta Ads',    ativo: false, budget_diario: '', notas: '' },
    { tipo: 'TikTok Ads',  ativo: false, budget_diario: '', notas: '' },
    { tipo: 'Google Ads',  ativo: false, budget_diario: '', notas: '' },
    { tipo: 'YouTube',     ativo: false, budget_diario: '', notas: '' },
    { tipo: 'Email List',  ativo: false, budget_diario: '', notas: '' },
    { tipo: 'WhatsApp',    ativo: false, budget_diario: '', notas: '' },
    { tipo: 'Orgânico',    ativo: false, budget_diario: '', notas: '' },
    { tipo: 'Parceiros',   ativo: false, budget_diario: '', notas: '' },
  ];
}

// ── Render: full view ─────────────────────────────────────────────
function renderFunisView() {
  renderFunisProjectList();
  const all = getAllFunnelsFlat();
  // Update nav badge
  const badge = document.getElementById('fn-nav-badge');
  if (badge) {
    const total = all.length;
    badge.textContent = total;
    badge.style.display = total ? 'inline-block' : 'none';
  }
  if (fnActiveProjectId) {
    renderFunisCanvas(fnActiveProjectId);
  } else {
    // Auto-select first project that has funnels
    const first = all[0];
    if (first) {
      fnActiveProjectId = first.proj.id;
      fnActiveFunilId = first.funil.id;
    }
    if (fnActiveProjectId) renderFunisCanvas(fnActiveProjectId);
    else fnRenderEmpty();
  }
}

function fnRenderEmpty() {
  const canvas = document.getElementById('fn-canvas-content');
  if (!canvas) return;
  canvas.innerHTML = `
    <div class="fn-empty-state">
      <div style="font-size:48px">🔀</div>
      <div style="font-size:16px;font-weight:700;color:var(--text)">Nenhum funil encontrado</div>
      <div style="font-size:12px;color:var(--text3)">Adicione produtos e funis na aba Briefing de cada projeto.</div>
    </div>`;
}

// ── Render: left accordion ────────────────────────────────────────
function renderFunisProjectList() {
  const container = document.getElementById('fn-proj-list');
  if (!container) return;
  const all = getAllFunnelsFlat();

  // Group by project
  const byProj = {};
  all.forEach(x => {
    if (!byProj[x.proj.id]) byProj[x.proj.id] = { proj: x.proj, funnels: [] };
    byProj[x.proj.id].funnels.push(x);
  });

  if (!Object.keys(byProj).length) {
    container.innerHTML = `<div style="padding:16px;font-size:11px;color:var(--text3)">Nenhum projeto com funis ainda.</div>`;
    return;
  }

  container.innerHTML = Object.values(byProj).map(({ proj, funnels }) => {
    const isOpen = proj.id === fnActiveProjectId;
    const subsHtml = funnels.map(x => `
      <div class="fn-funil-sub ${fnActiveFunilId === x.funil.id ? 'fn-active' : ''}"
           onclick="fnSelectFunil('${proj.id}','${x.funil.id}')">
        <span style="width:7px;height:7px;border-radius:50%;background:${fnStatusColor(x.funil.status)};display:inline-block;flex-shrink:0"></span>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${x.funil.nome}</span>
      </div>`).join('');

    return `
      <div class="fn-proj-item">
        <div class="fn-proj-item-hdr ${isOpen ? 'fn-active' : ''}"
             onclick="fnToggleProject('${proj.id}')">
          <span>${proj.icon || '📁'}</span>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${proj.nome}</span>
          <span class="fn-proj-badge">${funnels.length}</span>
          <span style="font-size:10px;color:var(--text3)">${isOpen ? '▾' : '▸'}</span>
        </div>
        ${isOpen ? `<div class="fn-proj-subs">${subsHtml}<div class="fn-funil-sub" onclick="fnAddFunil('${proj.id}')" style="color:var(--text3);font-style:italic">+ Novo funil</div></div>` : ''}
      </div>`;
  }).join('');
}

function fnStatusColor(status) {
  if (!status) return 'var(--text3)';
  const s = status.toLowerCase();
  if (s === 'ativo') return 'var(--green-bright)';
  if (s === 'pausado') return '#e05c5c';
  if (s === 'rascunho') return 'var(--text3)';
  return 'var(--gold)';
}

function fnToggleProject(projId) {
  if (fnActiveProjectId === projId) {
    fnActiveProjectId = null;
    fnActiveFunilId = null;
    renderFunisView();
  } else {
    const all = getAllFunnelsFlat().filter(x => x.proj.id === projId);
    fnActiveProjectId = projId;
    fnActiveFunilId = all[0]?.funil.id || null;
    renderFunisView();
  }
}

function fnSelectFunil(projId, funilId) {
  fnActiveProjectId = projId;
  fnActiveFunilId = funilId;
  renderFunisProjectList();
  renderFunisCanvas(projId);
}

// ── Render: right canvas ──────────────────────────────────────────
function renderFunisCanvas(projectId) {
  const canvas = document.getElementById('fn-canvas-content');
  if (!canvas) return;

  const all = getAllFunnelsFlat().filter(x => x.proj.id === projectId);
  if (!all.length) {
    canvas.innerHTML = `<div class="fn-empty-state" style="height:60vh">
      <div style="font-size:36px">🔀</div>
      <div style="font-size:14px;color:var(--text2)">Este projeto não tem funis ainda.</div>
      <button class="btn btn-outline btn-sm" onclick="fnAddFunil('${projectId}')">+ Adicionar Funil</button>
    </div>`;
    return;
  }

  // Ensure active funil is valid
  if (!fnActiveFunilId || !all.find(x => x.funil.id === fnActiveFunilId)) {
    fnActiveFunilId = all[0].funil.id;
  }

  const activeEntry = all.find(x => x.funil.id === fnActiveFunilId);
  const proj = all[0].proj;

  // Tab strip
  const tabsHtml = all.map(x => `
    <button class="fn-tab ${x.funil.id === fnActiveFunilId ? 'fn-active' : ''}"
            onclick="fnSelectFunil('${projectId}','${x.funil.id}')">
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${fnStatusColor(x.funil.status)};margin-right:5px"></span>
      ${x.funil.nome}
    </button>`).join('');

  canvas.innerHTML = `
    <div class="fn-canvas-hdr">
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">
          ${proj.icon} ${proj.nome} · ${activeEntry.prod.nome}
        </div>
        <div class="fn-tabs">
          ${tabsHtml}
          <button class="fn-tab-add" onclick="fnAddFunil('${projectId}')" title="Novo funil">＋</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-sm btn-outline" onclick="fnCopyAIContext()" title="Copiar contexto para IA">🤖 IA</button>
        <button class="btn btn-sm btn-outline" onclick="openFunilModal('geral')">✏️ Editar Funil</button>
      </div>
    </div>
    ${renderFunilFlow(activeEntry.funil)}`;
}

// ── Render: visual funnel flow ────────────────────────────────────
function renderFunilFlow(funil) {
  return `
    <div class="fn-flow-wrap">
      ${renderFontesTrafego(funil.fontes_trafego)}
      <div class="fn-flow-main">${renderEtapasFlow(funil.etapas)}</div>
      ${funil.sequencias?.length ? renderSequencias(funil.sequencias) : ''}
      ${renderIntegracoes(funil.integracoes)}
      ${funil.url ? renderPagePreview(funil) : ''}
      ${funil.notas_gerais ? `<div style="padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:10px;font-size:11px;color:var(--text2);line-height:1.6"><span style="font-size:9px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:5px">NOTAS</span>${funil.notas_gerais}</div>` : ''}
    </div>`;
}

// Sources row
function renderFontesTrafego(fontes) {
  const lista = (fontes || fnDefaultFontes());
  const ativas = lista.filter(f => f.ativo);
  const inativas = lista.filter(f => !f.ativo);
  const all = [...ativas, ...inativas];

  return `
    <div class="fn-sources-row">
      <div class="fn-row-label">TRÁFEGO</div>
      <div class="fn-sources-list">
        ${all.map(f => `
          <div class="fn-source-badge ${f.ativo ? 'fn-src-on' : 'fn-src-off'}">
            ${fnSourceIcon(f.tipo)} ${f.tipo}
            ${f.ativo && f.budget_diario ? `<span class="fn-src-budget">${f.budget_diario}/dia</span>` : ''}
          </div>`).join('')}
      </div>
      <div class="fn-flow-arrow">→→→</div>
    </div>`;
}

function fnSourceIcon(tipo) {
  const icons = { 'Meta Ads': '⬡', 'TikTok Ads': '♪', 'Google Ads': '◉', 'YouTube': '▶', 'Email List': '📧', 'WhatsApp': '💬', 'Orgânico': '🌱', 'Parceiros': '🤝' };
  return icons[tipo] || '○';
}

// Main flow row — horizontal stage chain
function renderEtapasFlow(etapas) {
  if (!etapas || !etapas.length) {
    return `<div class="fn-empty-flow" onclick="openFunilModal('etapas')">
      Nenhuma etapa configurada — <strong>clique para adicionar</strong>
    </div>`;
  }

  return `<div class="fn-etapas-row">
    ${etapas.map((e, i) => {
      const typeKey = (e.tipo || 'custom').toLowerCase().replace(/\s+/g,'');
      const statusKey = (e.status || 'rascunho').toLowerCase().replace(/\s+/g,'');
      return `${i > 0 ? '<div class="fn-arrow">→</div>' : ''}
      <div class="fn-stage-card fn-stage-${typeKey}" onclick="openFunilModal('etapas')">
        ${e.url ? `<a class="fn-stage-link" href="${e.url}" target="_blank" onclick="event.stopPropagation()" title="${e.url}">↗</a>` : ''}
        <div class="fn-stage-type">${fnStageIcon(e.tipo)} ${e.tipo}</div>
        <div class="fn-stage-name">${e.nome}</div>
        ${e.cvr !== null && e.cvr !== undefined ? `<div class="fn-stage-cvr">${e.cvr}% CVR</div>` : ''}
        <div class="fn-stage-status fn-st-${statusKey}">${e.status}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function fnStageIcon(tipo) {
  const icons = { LP:'📄', VSL:'🎬', Optin:'📋', Checkout:'💳', OB:'🎁', Upsell:'⬆️', Downsell:'⬇️', TY:'✅', Webinar:'💻', Blog:'✍️', Custom:'⚙️' };
  return icons[tipo] || '◈';
}

// Sequencias row
function renderSequencias(sequencias) {
  const seqIcon = { Email:'📧', WhatsApp:'💬', SMS:'📱' };
  return `
    <div class="fn-seqs-row">
      <div class="fn-row-label">SEQUÊNCIAS</div>
      ${sequencias.map(s => `
        <div class="fn-seq-card fn-seq-${(s.tipo||'').toLowerCase()}">
          <div class="fn-seq-icon">${seqIcon[s.tipo] || '📨'}</div>
          <div>
            <div class="fn-seq-nome">${s.nome}</div>
            <div class="fn-seq-meta">${s.ferramenta} · ${s.total_msgs || 0} msgs</div>
          </div>
          <div class="fn-seq-status">${s.status}</div>
        </div>`).join('')}
    </div>`;
}

// Integrations bar
function renderIntegracoes(integracoes) {
  const a = integracoes?.analytics || {};
  const p = integracoes?.pagamentos || {};

  const badges = [
    a.google_analytics && { label:'GA4',         color:'#ff6d00', icon:'📊' },
    a.meta_pixel       && { label:'Meta Pixel',   color:'#1877f2', icon:'⬡'  },
    a.tiktok_pixel     && { label:'TikTok Px',    color:'#ff0050', icon:'♪'  },
    a.clarity          && { label:'Clarity',       color:'#4895ef', icon:'👁' },
    a.resend           && { label:'Resend',         color:'#9b5de5', icon:'📨' },
    p.hotmart          && { label:'Hotmart',        color:'#e6640a', icon:'🔥' },
    p.ticto            && { label:'Ticto',          color:'#52b788', icon:'✓' },
    p.kiwifi           && { label:'Kiwifi',         color:'#c9a84c', icon:'📶' },
  ].filter(Boolean);

  return `
    <div class="fn-integracoes-bar">
      <div class="fn-row-label">INTEGRAÇÕES</div>
      <div class="fn-integ-badges">
        ${badges.length
          ? badges.map(b => `<span class="fn-integ-badge" style="border-color:${b.color}33;color:${b.color}">${b.icon} ${b.label}</span>`).join('')
          : '<span class="fn-integ-none">Nenhuma integração ativa</span>'}
      </div>
      <button class="btn btn-sm btn-outline" style="flex-shrink:0" onclick="openFunilModal('integracoes')">⚙ Configurar</button>
    </div>`;
}

// URL page preview
function renderPagePreview(funil) {
  let domain = '';
  try { domain = new URL(funil.url).hostname; } catch(_) { domain = funil.url; }
  const fid = funil.id.replace(/[^a-z0-9]/gi, '_');

  return `
    <div class="fn-preview-wrap">
      <div class="fn-preview-header">
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">
          PREVIEW — Página Principal
        </div>
        <a href="${funil.url}" target="_blank" class="btn btn-sm btn-outline">↗ Abrir</a>
      </div>
      <div class="fn-preview-frame-wrap" id="fnfr_${fid}">
        <iframe
          src="${funil.url}"
          class="fn-preview-iframe"
          sandbox="allow-scripts allow-same-origin"
          onload="fnCheckIframe(this,'${fid}')"
          onerror="fnShowFallback('${fid}','${domain}','${funil.url}')">
        </iframe>
        <div class="fn-preview-fallback" id="fnfb_${fid}">
          <img class="fn-preview-favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=64"
               onerror="this.style.display='none'" alt="">
          <div class="fn-preview-domain">${domain}</div>
          <div class="fn-preview-url">${funil.url}</div>
        </div>
      </div>
    </div>`;
}

function fnCheckIframe(iframe, fid) {
  setTimeout(() => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body || doc.body.innerHTML === '') fnShowFallback(fid);
    } catch(e) {
      // Cross-origin error = loaded but sandboxed (OK, keep iframe)
    }
  }, 1800);
}

function fnShowFallback(fid) {
  const wrap = document.getElementById('fnfr_' + fid);
  if (!wrap) return;
  const iframe = wrap.querySelector('iframe');
  const fb = document.getElementById('fnfb_' + fid);
  if (iframe) iframe.style.display = 'none';
  if (fb) fb.style.display = 'flex';
}

// ── Add new funnel ────────────────────────────────────────────────
function fnAddFunil(projectId) {
  const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === projectId);
  if (!proj) return;

  // Ensure at least one product exists
  if (!proj.produtos || !proj.produtos.length) {
    alert('Adicione um produto ao projeto primeiro (aba Briefing).');
    return;
  }

  const prod = proj.produtos[0]; // Add to first product by default
  if (!prod.funis) prod.funis = [];

  const newFunil = {
    id: fnUid(),
    nome: 'Novo Funil',
    tipo: 'Perpétuo',
    url: '',
    status: 'Rascunho',
    etapas: [
      { id: fnUid(), tipo: 'LP', nome: 'Página de Vendas', url: '', status: 'Em Construção', cvr: null, notas: '' },
      { id: fnUid(), tipo: 'OB', nome: 'Order Bump', url: '', status: 'Em Construção', cvr: null, notas: '' },
      { id: fnUid(), tipo: 'Upsell', nome: 'Upsell 1', url: '', status: 'Em Construção', cvr: null, notas: '' },
      { id: fnUid(), tipo: 'TY', nome: 'Obrigado', url: '', status: 'Em Construção', cvr: null, notas: '' },
    ],
    sequencias: [],
    fontes_trafego: fnDefaultFontes(),
    integracoes: { analytics: { google_analytics: false, meta_pixel: false, pixel_id: '', tiktok_pixel: false, tiktok_id: '', clarity: false, resend: false, resend_domain: '' }, pagamentos: { hotmart: false, ticto: false, kiwifi: false } },
    criativos: [],
    notas_gerais: '',
    criado_em: new Date().toISOString().slice(0, 10),
    _projectId: projectId,
    _projectNome: proj.nome,
    _produtoId: prod.id,
    _produtoNome: prod.nome,
  };

  prod.funis.push({ id: newFunil.id, nome: newFunil.nome, tipo: newFunil.tipo, url: '', status: 'Rascunho' });
  if (typeof projectsSaveCustom === 'function') projectsSaveCustom();
  fnSaveFunil(newFunil);

  fnActiveProjectId = projectId;
  fnActiveFunilId = newFunil.id;
  renderFunisView();
  openFunilModal('geral');
}

// ══════════════════════════════════════════════════════════════════
//  MODAL — Edit Funnel
// ══════════════════════════════════════════════════════════════════

function openFunilModal(section) {
  if (!fnActiveFunilId) return;
  fnModalSection = section || 'geral';

  // Deep clone the active funil into fnEditData
  const all = getAllFunnelsFlat();
  const entry = all.find(x => x.funil.id === fnActiveFunilId);
  if (!entry) return;
  fnEditData = JSON.parse(JSON.stringify(entry.funil));

  fnRenderModal();

  const modal = document.getElementById('fn-modal');
  if (modal) { modal.style.opacity = '1'; modal.style.pointerEvents = 'all'; }
}

function closeFunilModal() {
  const modal = document.getElementById('fn-modal');
  if (modal) { modal.style.opacity = '0'; modal.style.pointerEvents = 'none'; }
  fnEditData = null;
}

function saveFunilModal() {
  if (!fnEditData) return;

  // Update the PROJECTS in-memory reference
  const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === fnEditData._projectId);
  if (proj) {
    (proj.produtos || []).forEach(prod => {
      const fi = (prod.funis || []).findIndex(f => f.id === fnEditData.id);
      if (fi >= 0) {
        prod.funis[fi] = Object.assign(prod.funis[fi], {
          nome: fnEditData.nome, tipo: fnEditData.tipo,
          url: fnEditData.url, status: fnEditData.status
        });
      }
    });
    if (typeof projectsSaveCustom === 'function') projectsSaveCustom();
  }

  fnSaveFunil(fnEditData);
  closeFunilModal();
  renderFunisView();
}

// ── Modal Render ──────────────────────────────────────────────────
function fnRenderModal() {
  const modal = document.getElementById('fn-modal');
  if (!modal || !fnEditData) return;

  const tabs = [
    { id: 'geral',       label: '⚙ Geral' },
    { id: 'etapas',      label: '🔀 Etapas' },
    { id: 'trafego',     label: '🎯 Tráfego' },
    { id: 'sequencias',  label: '📧 Sequências' },
    { id: 'integracoes', label: '🔌 Integrações' },
    { id: 'criativos',   label: '🎨 Criativos' },
  ];

  const tabsHtml = tabs.map(t => `
    <button class="fn-modal-tab ${fnModalSection === t.id ? 'fn-active' : ''}"
            onclick="fnSwitchModalTab('${t.id}')">${t.label}</button>`).join('');

  modal.innerHTML = `
    <div class="fn-modal-inner" onclick="event.stopPropagation()">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div style="font-size:14px;font-weight:700;color:var(--text)">✏️ ${fnEditData.nome}</div>
        <button onclick="closeFunilModal()" style="background:transparent;border:1px solid var(--border2);color:var(--text3);padding:3px 10px;border-radius:6px;cursor:pointer;font-size:13px">✕</button>
      </div>
      <div style="display:flex;gap:2px;padding:10px 20px 0;border-bottom:1px solid var(--border);flex-shrink:0;overflow-x:auto">
        ${tabsHtml}
      </div>
      <div id="fn-modal-body" style="padding:18px 20px;overflow-y:auto;flex:1">
        ${fnRenderModalSection(fnModalSection)}
      </div>
      <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-shrink:0">
        <div style="display:flex;gap:8px">
          <button onclick="fnCopyAIContext()" class="btn btn-sm btn-outline" title="Copia contexto formatado para IA">🤖 Copiar para IA</button>
          <button onclick="fnConfirmDelete()" class="btn btn-sm" style="background:rgba(224,92,92,.1);border:1px solid rgba(224,92,92,.3);color:#e05c5c">🗑 Excluir Funil</button>
        </div>
        <div style="display:flex;gap:8px">
          <button onclick="closeFunilModal()" class="btn btn-outline">Cancelar</button>
          <button onclick="saveFunilModal()" class="btn btn-gold">💾 Salvar</button>
        </div>
      </div>
    </div>`;
}

function fnSwitchModalTab(section) {
  fnModalSection = section;
  const body = document.getElementById('fn-modal-body');
  if (body) body.innerHTML = fnRenderModalSection(section);
  // Update tab active state
  document.querySelectorAll('.fn-modal-tab').forEach(t => {
    t.classList.toggle('fn-active', t.textContent.includes(section) || t.getAttribute('onclick')?.includes(`'${section}'`));
  });
  // Rebuild the full modal to re-render tab highlights
  fnRenderModal();
  const modal = document.getElementById('fn-modal');
  if (modal) { modal.style.opacity = '1'; modal.style.pointerEvents = 'all'; }
}

function fnRenderModalSection(section) {
  if (!fnEditData) return '';
  switch(section) {
    case 'geral':       return fnModalGeral();
    case 'etapas':      return fnModalEtapas();
    case 'trafego':     return fnModalTrafego();
    case 'sequencias':  return fnModalSequencias();
    case 'integracoes': return fnModalIntegracoes();
    case 'criativos':   return fnModalCriativos();
    default:            return fnModalGeral();
  }
}

// ── Section: Geral ────────────────────────────────────────────────
function fnModalGeral() {
  const tipoOptions = ['Perpétuo','Lançamento','VSL','Webinar','Email','Quiz','Produto Físico','Outro'];
  const statusOpts  = ['Ativo','Rascunho','Em Construção','Pausado','Arquivado'];
  return `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div>
        <label class="brief-label">Nome do Funil</label>
        <input class="brief-input" value="${fnEditData.nome}"
               oninput="fnEditData.nome=this.value" placeholder="Ex: Funil Principal Perpétuo">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <label class="brief-label">Tipo</label>
          <select class="brief-input" onchange="fnEditData.tipo=this.value">
            ${tipoOptions.map(t => `<option ${fnEditData.tipo===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="brief-label">Status</label>
          <select class="brief-input" onchange="fnEditData.status=this.value">
            ${statusOpts.map(s => `<option ${fnEditData.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label class="brief-label">URL Principal (Página de Entrada)</label>
        <input class="brief-input" value="${fnEditData.url||''}"
               oninput="fnEditData.url=this.value" placeholder="https://...">
      </div>
      <div>
        <label class="brief-label">Notas Gerais</label>
        <textarea class="brief-input" rows="3" oninput="fnEditData.notas_gerais=this.value"
                  placeholder="Observações, contexto, hipóteses de teste...">${fnEditData.notas_gerais||''}</textarea>
      </div>
    </div>`;
}

// ── Section: Etapas ───────────────────────────────────────────────
function fnModalEtapas() {
  const tiposEtapa = ['LP','VSL','Optin','Checkout','OB','Upsell','Downsell','TY','Webinar','Blog','Custom'];
  const statusOpts = ['Ativo','Em Construção','Rascunho','Pausado'];

  const rows = (fnEditData.etapas || []).map((e, i) => `
    <div class="fn-etapa-row">
      <div style="font-size:11px;color:var(--text3);width:22px;text-align:center;flex-shrink:0">${i+1}</div>
      <select class="brief-input" style="width:100px;flex-shrink:0" onchange="fnEditData.etapas[${i}].tipo=this.value;fnRenderEtapaRows()">
        ${tiposEtapa.map(t => `<option ${e.tipo===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <input class="brief-input" style="flex:2" value="${e.nome}" placeholder="Nome da etapa"
             oninput="fnEditData.etapas[${i}].nome=this.value">
      <input class="brief-input" style="flex:3" value="${e.url||''}" placeholder="URL"
             oninput="fnEditData.etapas[${i}].url=this.value">
      <input class="brief-input" style="width:60px" value="${e.cvr ?? ''}" placeholder="CVR%" type="number" step="0.1"
             oninput="fnEditData.etapas[${i}].cvr=this.value?parseFloat(this.value):null">
      <select class="brief-input" style="width:120px;flex-shrink:0" onchange="fnEditData.etapas[${i}].status=this.value">
        ${statusOpts.map(s => `<option ${e.status===s?'selected':''}>${s}</option>`).join('')}
      </select>
      <button onclick="fnRemoveEtapa(${i})"
              style="background:none;border:1px solid rgba(224,92,92,.3);color:#e05c5c;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:12px;flex-shrink:0">✕</button>
    </div>`).join('');

  return `
    <div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">
        Cada etapa é um nó no flow visual. Arraste para reordenar (em breve).
      </div>
      <div id="fn-etapa-rows">${rows}</div>
      <button onclick="fnAddEtapa()" class="btn btn-sm btn-outline" style="margin-top:8px">+ Adicionar Etapa</button>
    </div>`;
}

function fnRenderEtapaRows() {
  const body = document.getElementById('fn-modal-body');
  if (body && fnModalSection === 'etapas') body.innerHTML = fnModalEtapas();
}

function fnAddEtapa() {
  if (!fnEditData.etapas) fnEditData.etapas = [];
  fnEditData.etapas.push({ id: fnUid(), tipo: 'LP', nome: 'Nova Etapa', url: '', status: 'Rascunho', cvr: null, notas: '' });
  fnRenderEtapaRows();
}

function fnRemoveEtapa(i) {
  fnEditData.etapas.splice(i, 1);
  fnRenderEtapaRows();
}

// ── Section: Tráfego ─────────────────────────────────────────────
function fnModalTrafego() {
  if (!fnEditData.fontes_trafego || !fnEditData.fontes_trafego.length) {
    fnEditData.fontes_trafego = fnDefaultFontes();
  }

  const rows = fnEditData.fontes_trafego.map((f, i) => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:7px;margin-bottom:5px">
      <input type="checkbox" ${f.ativo ? 'checked' : ''} onchange="fnEditData.fontes_trafego[${i}].ativo=this.checked" style="width:14px;height:14px;cursor:pointer">
      <span style="font-size:12px;min-width:110px">${fnSourceIcon(f.tipo)} ${f.tipo}</span>
      <input class="brief-input" value="${f.budget_diario||''}" placeholder="Budget/dia (ex: R$150)"
             style="flex:1" oninput="fnEditData.fontes_trafego[${i}].budget_diario=this.value">
      <input class="brief-input" value="${f.notas||''}" placeholder="Notas..."
             style="flex:2" oninput="fnEditData.fontes_trafego[${i}].notas=this.value">
    </div>`).join('');

  return `
    <div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Marque as fontes ativas para este funil.</div>
      ${rows}
    </div>`;
}

// ── Section: Sequências ───────────────────────────────────────────
function fnModalSequencias() {
  if (!fnEditData.sequencias) fnEditData.sequencias = [];
  const tipoSeq = ['Email','WhatsApp','SMS'];
  const ferramentas = { Email: ['Resend','ActiveCampaign','MailChimp','Klaviyo','Outro'], WhatsApp: ['clawdbot','ManyChat','Outro'], SMS: ['Twilio','Outro'] };

  const rows = fnEditData.sequencias.map((s, i) => `
    <div style="display:flex;align-items:center;gap:6px;padding:8px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:7px;margin-bottom:5px">
      <select class="brief-input" style="width:100px;flex-shrink:0" onchange="fnEditData.sequencias[${i}].tipo=this.value">
        ${tipoSeq.map(t => `<option ${s.tipo===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <select class="brief-input" style="width:130px;flex-shrink:0" onchange="fnEditData.sequencias[${i}].ferramenta=this.value">
        ${(ferramentas[s.tipo] || ferramentas.Email).map(f => `<option ${s.ferramenta===f?'selected':''}>${f}</option>`).join('')}
      </select>
      <input class="brief-input" style="flex:2" value="${s.nome}" placeholder="Nome da sequência"
             oninput="fnEditData.sequencias[${i}].nome=this.value">
      <input class="brief-input" style="width:55px" value="${s.total_msgs||0}" placeholder="Msgs" type="number" min="1"
             oninput="fnEditData.sequencias[${i}].total_msgs=parseInt(this.value)||0">
      <select class="brief-input" style="width:130px;flex-shrink:0" onchange="fnEditData.sequencias[${i}].status=this.value">
        ${['Ativo','Em Construção','Rascunho','Pausado'].map(st => `<option ${s.status===st?'selected':''}>${st}</option>`).join('')}
      </select>
      <button onclick="fnRemoveSeq(${i})"
              style="background:none;border:1px solid rgba(224,92,92,.3);color:#e05c5c;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:12px;flex-shrink:0">✕</button>
    </div>`).join('');

  return `
    <div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Sequências de follow-up que se conectam ao funil.</div>
      ${rows}
      <button onclick="fnAddSeq()" class="btn btn-sm btn-outline" style="margin-top:8px">+ Adicionar Sequência</button>
    </div>`;
}

function fnAddSeq() {
  fnEditData.sequencias.push({ id: fnUid(), tipo: 'Email', ferramenta: 'Resend', nome: 'Nova Sequência', total_msgs: 7, status: 'Rascunho', notas: '' });
  const body = document.getElementById('fn-modal-body');
  if (body) body.innerHTML = fnModalSequencias();
}

function fnRemoveSeq(i) {
  fnEditData.sequencias.splice(i, 1);
  const body = document.getElementById('fn-modal-body');
  if (body) body.innerHTML = fnModalSequencias();
}

// ── Section: Integrações ──────────────────────────────────────────
function fnModalIntegracoes() {
  if (!fnEditData.integracoes) fnEditData.integracoes = { analytics: {}, pagamentos: {} };
  const a = fnEditData.integracoes.analytics || {};
  const p = fnEditData.integracoes.pagamentos || {};

  function chk(key, obj, label, icon, color, extraHtml) {
    const checked = obj[key];
    return `
      <div class="fn-integ-check ${checked ? 'fn-on' : ''}"
           onclick="this.classList.toggle('fn-on');fnEditData.integracoes.${obj === a ? 'analytics' : 'pagamentos'}['${key}']=this.classList.contains('fn-on')">
        <span style="font-size:14px">${icon}</span>
        <span style="color:${color};font-weight:700;font-size:11px">${label}</span>
      </div>`;
  }

  return `
    <div style="display:flex;flex-direction:column;gap:14px">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">ANALYTICS & RASTREAMENTO</div>
        <div class="fn-integ-grid">
          ${chk('meta_pixel',       a,'Meta Pixel',  '⬡','#1877f2','')}
          ${chk('tiktok_pixel',     a,'TikTok Pixel','♪','#ff0050','')}
          ${chk('google_analytics', a,'GA4',          '📊','#ff6d00','')}
          ${chk('clarity',          a,'Clarity',      '👁','#4895ef','')}
          ${chk('resend',           a,'Resend',        '📨','#9b5de5','')}
        </div>
        <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">
          <div style="display:flex;gap:8px;align-items:center">
            <label style="font-size:11px;color:var(--text3);width:100px">Pixel ID (Meta)</label>
            <input class="brief-input" style="flex:1" value="${a.pixel_id||''}" placeholder="Ex: 123456789"
                   oninput="fnEditData.integracoes.analytics.pixel_id=this.value">
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <label style="font-size:11px;color:var(--text3);width:100px">Pixel ID (TikTok)</label>
            <input class="brief-input" style="flex:1" value="${a.tiktok_id||''}" placeholder="Ex: CNXXXXXXXX"
                   oninput="fnEditData.integracoes.analytics.tiktok_id=this.value">
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <label style="font-size:11px;color:var(--text3);width:100px">Resend Domain</label>
            <input class="brief-input" style="flex:1" value="${a.resend_domain||''}" placeholder="mail.seudominio.com"
                   oninput="fnEditData.integracoes.analytics.resend_domain=this.value">
          </div>
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">PLATAFORMAS DE PAGAMENTO</div>
        <div class="fn-integ-grid">
          ${chk('hotmart', p,'Hotmart','🔥','#e6640a','')}
          ${chk('ticto',   p,'Ticto',  '✓','#52b788','')}
          ${chk('kiwifi',  p,'Kiwifi', '📶','#c9a84c','')}
        </div>
      </div>
    </div>`;
}

// ── Section: Criativos ────────────────────────────────────────────
function fnModalCriativos() {
  if (!fnEditData.criativos) fnEditData.criativos = [];
  const tipos = ['Video','Estático','Story','Carrossel','Copy','Email','Outro'];

  const rows = fnEditData.criativos.map((c, i) => `
    <div class="fn-cria-row">
      <select class="brief-input" style="width:100px;flex-shrink:0" onchange="fnEditData.criativos[${i}].tipo=this.value">
        ${tipos.map(t => `<option ${c.tipo===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <input class="brief-input" style="flex:2" value="${c.nome}" placeholder="Nome do criativo"
             oninput="fnEditData.criativos[${i}].nome=this.value">
      <input class="brief-input" style="flex:3" value="${c.url||''}" placeholder="URL do Drive / Ads Library"
             oninput="fnEditData.criativos[${i}].url=this.value">
      <select class="brief-input" style="width:100px;flex-shrink:0" onchange="fnEditData.criativos[${i}].status=this.value">
        ${['Rodando','Em Teste','Pausado','Rascunho'].map(s => `<option ${c.status===s?'selected':''}>${s}</option>`).join('')}
      </select>
      <button onclick="fnRemoveCria(${i})"
              style="background:none;border:1px solid rgba(224,92,92,.3);color:#e05c5c;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:12px;flex-shrink:0">✕</button>
    </div>`).join('');

  return `
    <div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Criativos vinculados a este funil.</div>
      ${rows}
      <button onclick="fnAddCria()" class="btn btn-sm btn-outline" style="margin-top:8px">+ Adicionar Criativo</button>
    </div>`;
}

function fnAddCria() {
  fnEditData.criativos.push({ id: fnUid(), tipo: 'Video', nome: 'Novo Criativo', url: '', status: 'Rascunho' });
  const body = document.getElementById('fn-modal-body');
  if (body) body.innerHTML = fnModalCriativos();
}

function fnRemoveCria(i) {
  fnEditData.criativos.splice(i, 1);
  const body = document.getElementById('fn-modal-body');
  if (body) body.innerHTML = fnModalCriativos();
}

// ── Delete funnel ─────────────────────────────────────────────────
function fnConfirmDelete() {
  if (!fnEditData) return;
  if (!confirm(`Excluir o funil "${fnEditData.nome}"? Esta ação não pode ser desfeita.`)) return;
  const fid = fnEditData.id;
  closeFunilModal();
  fnDeleteFunil(fid);
  fnActiveFunilId = null;
  renderFunisView();
}

// ══════════════════════════════════════════════════════════════════
//  AI CONTEXT — Structured funnel data for AI consumption
// ══════════════════════════════════════════════════════════════════

function getFunnelAIContext(funnelId) {
  const all = getAllFunnelsFlat();
  const target = funnelId || fnActiveFunilId;
  const entry = all.find(x => x.funil.id === target);
  if (!entry) return '// Funil não encontrado';

  const { proj, prod, funil } = entry;
  const lines = [];

  lines.push('╔══════════════════════════════════════════════════════╗');
  lines.push('  FUNIL — CONTEXTO COMPLETO PARA IA');
  lines.push('╚══════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`Projeto:  ${proj.icon} ${proj.nome} (${proj.categoria || 'N/A'})`);
  lines.push(`Produto:  ${prod.nome}`);
  lines.push(`Funil:    ${funil.nome}`);
  lines.push(`Tipo:     ${funil.tipo}`);
  lines.push(`Status:   ${funil.status}`);
  lines.push(`URL:      ${funil.url || '(não definida)'}`);
  lines.push('');

  // Etapas
  lines.push('── ETAPAS DO FUNIL ─────────────────────────────────────');
  if (funil.etapas?.length) {
    funil.etapas.forEach((e, i) => {
      const cvr = e.cvr !== null && e.cvr !== undefined ? ` · CVR: ${e.cvr}%` : '';
      lines.push(`  ${i+1}. [${e.tipo}] ${e.nome}${cvr} · ${e.status}`);
      if (e.url) lines.push(`         URL: ${e.url}`);
    });
  } else lines.push('  (nenhuma etapa configurada)');
  lines.push('');

  // Fontes de tráfego
  const ativas = (funil.fontes_trafego || []).filter(f => f.ativo);
  lines.push('── FONTES DE TRÁFEGO ───────────────────────────────────');
  if (ativas.length) {
    ativas.forEach(f => lines.push(`  ✓ ${f.tipo}${f.budget_diario ? ' · ' + f.budget_diario + '/dia' : ''}${f.notas ? ' · ' + f.notas : ''}`));
  } else lines.push('  (nenhuma fonte ativa)');
  lines.push('');

  // Sequências
  lines.push('── SEQUÊNCIAS DE FOLLOW-UP ─────────────────────────────');
  if (funil.sequencias?.length) {
    funil.sequencias.forEach(s => lines.push(`  • ${s.tipo} via ${s.ferramenta}: "${s.nome}" · ${s.total_msgs || 0} mensagens · ${s.status}`));
  } else lines.push('  (nenhuma sequência configurada)');
  lines.push('');

  // Integrações
  const a = funil.integracoes?.analytics || {};
  const p = funil.integracoes?.pagamentos || {};
  lines.push('── INTEGRAÇÕES ATIVAS ───────────────────────────────────');
  const analyticsAtivos = [
    a.meta_pixel && `Meta Pixel${a.pixel_id ? ' (ID: ' + a.pixel_id + ')' : ''}`,
    a.tiktok_pixel && `TikTok Pixel${a.tiktok_id ? ' (ID: ' + a.tiktok_id + ')' : ''}`,
    a.google_analytics && 'GA4',
    a.clarity && 'Clarity',
    a.resend && `Resend${a.resend_domain ? ' (domain: ' + a.resend_domain + ')' : ''}`,
  ].filter(Boolean);
  const pagAtivos = [p.hotmart && 'Hotmart', p.ticto && 'Ticto', p.kiwifi && 'Kiwifi'].filter(Boolean);
  lines.push(`  Analytics: ${analyticsAtivos.join(', ') || 'nenhuma'}`);
  lines.push(`  Pagamentos: ${pagAtivos.join(', ') || 'nenhuma'}`);
  lines.push('');

  // Criativos
  if (funil.criativos?.length) {
    lines.push('── CRIATIVOS ───────────────────────────────────────────');
    funil.criativos.forEach(c => lines.push(`  • [${c.tipo}] ${c.nome} · ${c.status}${c.url ? ' → ' + c.url : ''}`));
    lines.push('');
  }

  if (funil.notas_gerais) {
    lines.push('── NOTAS ───────────────────────────────────────────────');
    lines.push(funil.notas_gerais);
    lines.push('');
  }

  return lines.join('\n');
}

function getAllFunnelsAIContextForProject(projectId) {
  const pid = projectId || fnActiveProjectId;
  return getAllFunnelsFlat()
    .filter(x => x.proj.id === pid)
    .map(x => getFunnelAIContext(x.funil.id))
    .join('\n\n' + '═'.repeat(56) + '\n\n');
}

function fnCopyAIContext() {
  const text = getFunnelAIContext(fnActiveFunilId);
  navigator.clipboard.writeText(text).then(() => {
    const btn = event?.target;
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✅ Copiado!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }
  }).catch(() => {
    prompt('Copie o contexto:', text);
  });
}
