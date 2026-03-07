// ═══════════════════════════════════════════════════════════════════
//  LEADS MODULE — Imperio HQ
//  View dedicada para visualizar leads por projeto com dados de vendas
// ═══════════════════════════════════════════════════════════════════

// ── Module State ─────────────────────────────────────────────────
let ldActiveProjectId = null;
let ldLeadsCache      = {};   // { projectId: [lead, ...] }
let ldVendasCache     = {};   // { leadId: [venda, ...] }
let ldSortField       = 'criado_em';
let ldSortDir         = 'desc';
let ldSearchQuery     = '';
let ldFilterStatus    = '';
let ldFilterPlat      = '';

// ── Entry Point ───────────────────────────────────────────────────
async function showLeads() {
  if (typeof hideAllPanels === 'function') hideAllPanels();
  const panel = document.getElementById('view-leads');
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-leads');
  if (nav) nav.classList.add('active');
  await renderLeadsView();
}

// ── Main Render ───────────────────────────────────────────────────
async function renderLeadsView() {
  // Default: mostrar todos os leads na primeira abertura
  if (ldActiveProjectId === null) ldActiveProjectId = '__all__';
  ldRenderProjectList();
  await ldLoadAndRenderLeads(ldActiveProjectId);
}

// ── Project Sidebar ───────────────────────────────────────────────
function ldRenderProjectList() {
  const projects = typeof PROJECTS !== 'undefined' ? PROJECTS : [];
  const list = document.getElementById('ld-proj-list');
  if (!list) return;

  function projItem(id, icon, nome, isActive, isSpecial) {
    const count = ldLeadsCache[id] !== undefined ? ldLeadsCache[id].length : '';
    const countEl = count !== ''
      ? `<span style="margin-left:auto;font-size:10px;background:rgba(82,183,136,.15);color:#52b788;padding:1px 6px;border-radius:8px;flex-shrink:0">${count}</span>`
      : '';
    const cfgBtn = !isSpecial
      ? `<span onclick="event.stopPropagation();ldToggleProdutoConfig('${id}')"
           title="Vincular IDs de produto"
           style="cursor:pointer;color:var(--text3);opacity:.5;font-size:10px;margin-left:4px;flex-shrink:0;line-height:1"
           onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">⚙</span>`
      : '';
    const cfgPanel = !isSpecial
      ? `<div id="ld-prod-cfg-${id}" style="display:none;padding:8px 10px 10px;background:rgba(0,0,0,.18);border-bottom:1px solid var(--border)">
           <div style="font-size:10px;color:var(--text3);margin-bottom:5px">IDs de produto (Hotmart / Ticto) — separados por vírgula:</div>
           <div style="display:flex;gap:5px">
             <input id="ld-prod-ids-${id}" type="text" placeholder="ex: 12345, 67890"
               style="flex:1;background:var(--surface);border:1px solid var(--border2);border-radius:6px;padding:4px 8px;font-size:11px;color:var(--text);outline:none"
               onkeydown="if(event.key==='Enter')ldSaveProdutoIds('${id}')">
             <button id="ld-prod-save-${id}" onclick="ldSaveProdutoIds('${id}')"
               style="background:rgba(82,183,136,.15);border:1px solid rgba(82,183,136,.3);color:#52b788;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer">Salvar</button>
           </div>
         </div>`
      : '';
    return `
      <div>
        <div class="fn-proj-item-hdr"
             style="${isActive ? 'background:rgba(212,168,67,.08);color:var(--gold)' : ''}"
             onclick="ldSelectProject('${id}')">
          <span style="font-size:13px">${icon}</span>
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">${nome}</span>
          ${countEl}${cfgBtn}
        </div>
        ${cfgPanel}
      </div>`;
  }

  const items = [];
  // Entradas especiais
  items.push(projItem('__all__',  '🌐', 'Todos os leads', ldActiveProjectId === '__all__',  true));
  items.push(projItem('__null__', '📭', 'Sem projeto',    ldActiveProjectId === '__null__', true));
  // Separador
  items.push('<div style="border-top:1px solid var(--border);margin:4px 0"></div>');
  // Projetos reais
  projects.forEach(proj => {
    items.push(projItem(proj.id, proj.icon || '📁', proj.nome, proj.id === ldActiveProjectId, false));
  });

  list.innerHTML = items.join('');

  // Update total badge (todos os leads conhecidos)
  const badge = document.getElementById('ld-nav-badge');
  const allLeads = ldLeadsCache['__all__'];
  const total = allLeads ? allLeads.length : Object.values(ldLeadsCache).reduce((s, arr) => s + arr.length, 0);
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? '' : 'none';
  }
}

async function ldSelectProject(projectId) {
  ldActiveProjectId = projectId;
  ldRenderProjectList();
  await ldLoadAndRenderLeads(projectId);
}

// ── Load Leads from Supabase ──────────────────────────────────────
async function ldLoadAndRenderLeads(projectId) {
  const canvas = document.getElementById('ld-canvas-content');
  if (!canvas) return;

  // Show loading
  canvas.innerHTML = ldSkeletonHTML();

  try {
    if (typeof SB !== 'undefined' && SB.loadLeads) {
      // '__all__' → sem filtro de projeto (todos); '__null__' → sem projeto
      const sbProjectId = projectId === '__all__' ? null : projectId;
      const leads = await SB.loadLeads(sbProjectId);
      ldLeadsCache[projectId] = leads || [];
    } else {
      ldLeadsCache[projectId] = [];
    }
    ldRenderProjectList(); // update count badge
    ldRenderLeadsTable(projectId);
  } catch (err) {
    console.error('[leads] loadLeads', err);
    canvas.innerHTML = `<div style="padding:40px;text-align:center;color:#e05c5c;font-size:13px">
      ⚠️ Erro ao carregar leads: ${err.message || err}
    </div>`;
  }
}

// ── Table Render ──────────────────────────────────────────────────
function ldRenderLeadsTable(projectId) {
  const canvas = document.getElementById('ld-canvas-content');
  if (!canvas) return;

  const specialNames = { '__all__': 'Todos os leads', '__null__': 'Sem projeto' };
  const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === projectId);
  const projNome = specialNames[projectId] || (proj ? proj.nome : projectId);
  let leads = (ldLeadsCache[projectId] || []).slice();

  // Filter
  if (ldSearchQuery) {
    const q = ldSearchQuery.toLowerCase();
    leads = leads.filter(l =>
      (l.nome || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.phone || '').toLowerCase().includes(q)
    );
  }
  if (ldFilterStatus) leads = leads.filter(l => l.status === ldFilterStatus);
  if (ldFilterPlat)   leads = leads.filter(l => l.plataforma === ldFilterPlat);

  // Sort
  leads.sort((a, b) => {
    let va = a[ldSortField] || '';
    let vb = b[ldSortField] || '';
    if (ldSortField === 'total_gasto' || ldSortField === 'score') {
      va = parseFloat(va) || 0;
      vb = parseFloat(vb) || 0;
    }
    if (va < vb) return ldSortDir === 'asc' ? -1 : 1;
    if (va > vb) return ldSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const total = (ldLeadsCache[projectId] || []).length;

  canvas.innerHTML = `
    <!-- Header bar -->
    <div style="padding:16px 20px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0;background:var(--surface)">
      <div>
        <div style="font-size:15px;font-weight:700;color:var(--text)">👤 ${projNome}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${total} lead${total !== 1 ? 's' : ''} no projeto</div>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
        <input id="ld-search" type="text" placeholder="Buscar nome, email, telefone..."
          value="${ldEscape(ldSearchQuery)}"
          oninput="ldOnSearch(this.value)"
          style="background:var(--surface2);border:1px solid var(--border2);border-radius:7px;padding:5px 10px;font-size:12px;color:var(--text);outline:none;width:200px">
        <select id="ld-filter-plat" onchange="ldOnFilterPlat(this.value)"
          style="background:var(--surface2);border:1px solid var(--border2);border-radius:7px;padding:5px 8px;font-size:12px;color:var(--text);outline:none">
          <option value="">Todas plataformas</option>
          <option value="hotmart" ${ldFilterPlat==='hotmart'?'selected':''}>Hotmart</option>
          <option value="ticto" ${ldFilterPlat==='ticto'?'selected':''}>Ticto</option>
          <option value="manual" ${ldFilterPlat==='manual'?'selected':''}>Manual</option>
        </select>
        <select id="ld-filter-status" onchange="ldOnFilterStatus(this.value)"
          style="background:var(--surface2);border:1px solid var(--border2);border-radius:7px;padding:5px 8px;font-size:12px;color:var(--text);outline:none">
          <option value="">Todos status</option>
          <option value="lead" ${ldFilterStatus==='lead'?'selected':''}>Lead</option>
          <option value="cliente" ${ldFilterStatus==='cliente'?'selected':''}>Cliente</option>
          <option value="vip" ${ldFilterStatus==='vip'?'selected':''}>VIP</option>
          <option value="inativo" ${ldFilterStatus==='inativo'?'selected':''}>Inativo</option>
        </select>
        <button onclick="ldLoadAndRenderLeads('${projectId}')"
          style="background:rgba(212,168,67,.1);border:1px solid rgba(212,168,67,.3);color:var(--gold);padding:5px 12px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer">↻</button>
      </div>
    </div>

    <!-- Table -->
    <div style="flex:1;overflow-y:auto">
      ${leads.length === 0
        ? `<div style="padding:60px;text-align:center;color:var(--text3);font-size:13px">
            ${total === 0
              ? '📭 Nenhum lead ainda. Os leads chegam via webhook Hotmart / Ticto.'
              : '🔍 Nenhum lead encontrado para os filtros selecionados.'}
           </div>`
        : `<table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="background:var(--surface);position:sticky;top:0;z-index:1">
                ${ldThCell('nome',       'Nome')}
                ${ldThCell('plataforma', 'Plataforma')}
                ${ldThCell('status',     'Status')}
                ${ldThCell('score',      'Score')}
                ${ldThCell('total_gasto','Gasto Total')}
                ${ldThCell('criado_em',  'Desde')}
                <th style="padding:8px 14px;text-align:right;color:var(--text3);font-weight:600;border-bottom:1px solid var(--border)">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${leads.map(l => ldRenderRow(l, projectId)).join('')}
            </tbody>
           </table>`
      }
    </div>

    <!-- Stats Footer -->
    ${leads.length > 0 ? ldStatsFooter(leads) : ''}
  `;
}

// ── Table helpers ─────────────────────────────────────────────────
function ldThCell(field, label) {
  const isActive = ldSortField === field;
  const arrow = isActive ? (ldSortDir === 'asc' ? ' ↑' : ' ↓') : '';
  return `<th onclick="ldSort('${field}')"
    style="padding:8px 14px;text-align:left;color:${isActive ? 'var(--gold)' : 'var(--text3)'};
           font-weight:600;border-bottom:1px solid var(--border);cursor:pointer;white-space:nowrap;
           user-select:none">
    ${label}${arrow}
  </th>`;
}

function ldRenderRow(l, projectId) {
  const statusColors = {
    lead:    { bg: 'rgba(212,168,67,.12)',  color: 'var(--gold)'  },
    cliente: { bg: 'rgba(82,183,136,.12)',  color: '#52b788'      },
    vip:     { bg: 'rgba(155,127,232,.15)', color: '#9b7fe8'      },
    inativo: { bg: 'rgba(120,120,120,.12)', color: 'var(--text3)' },
  };
  const platIcons = { hotmart: '🔥', ticto: '⚡', manual: '✏️' };
  const sc = statusColors[l.status] || statusColors['lead'];
  const platIcon = platIcons[l.plataforma] || '•';
  const gasto = parseFloat(l.total_gasto || 0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  const score = parseInt(l.score || 0);
  const scoreFill = Math.min(100, score);
  const dataStr = l.criado_em ? l.criado_em.slice(0,10) : '—';

  return `
    <tr onclick="ldOpenLead('${l.id}','${ldEscape(projectId)}')"
        style="border-bottom:1px solid var(--border);cursor:pointer;transition:.1s"
        onmouseover="this.style.background='rgba(255,255,255,.03)'"
        onmouseout="this.style.background=''">
      <td style="padding:10px 14px;color:var(--text)">
        <div style="font-weight:600">${ldEscape(l.nome || '—')}</div>
        <div style="font-size:10px;color:var(--text3)">${ldEscape(l.email || l.phone || '')}</div>
      </td>
      <td style="padding:10px 14px;color:var(--text2)">${platIcon} ${l.plataforma || '—'}</td>
      <td style="padding:10px 14px">
        <span style="background:${sc.bg};color:${sc.color};padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">
          ${l.status || 'lead'}
        </span>
      </td>
      <td style="padding:10px 14px">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:48px;height:5px;background:var(--surface2);border-radius:3px;overflow:hidden">
            <div style="width:${scoreFill}%;height:100%;background:${score > 70 ? '#52b788' : score > 40 ? 'var(--gold)' : '#e05c5c'};border-radius:3px"></div>
          </div>
          <span style="color:var(--text2);font-size:11px">${score}</span>
        </div>
      </td>
      <td style="padding:10px 14px;color:${parseFloat(l.total_gasto || 0) > 0 ? '#52b788' : 'var(--text3)'}">
        ${gasto}
      </td>
      <td style="padding:10px 14px;color:var(--text3);font-size:11px">${dataStr}</td>
      <td style="padding:10px 14px;text-align:right">
        <button onclick="event.stopPropagation();ldOpenLead('${l.id}','${ldEscape(projectId)}')"
          style="background:rgba(212,168,67,.1);border:1px solid rgba(212,168,67,.2);color:var(--gold);
                 padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer">Ver</button>
      </td>
    </tr>`;
}

function ldStatsFooter(leads) {
  const totalGasto = leads.reduce((s, l) => s + parseFloat(l.total_gasto || 0), 0);
  const clientes   = leads.filter(l => l.status === 'cliente' || l.status === 'vip').length;
  const avgScore   = leads.length ? Math.round(leads.reduce((s, l) => s + parseInt(l.score || 0), 0) / leads.length) : 0;
  const vips       = leads.filter(l => l.status === 'vip').length;

  return `
    <div style="padding:12px 20px;border-top:1px solid var(--border);background:var(--surface);
                display:flex;gap:24px;flex-shrink:0;font-size:12px">
      <div style="color:var(--text3)">
        Total exibido: <strong style="color:var(--text)">${leads.length}</strong>
      </div>
      <div style="color:var(--text3)">
        Clientes: <strong style="color:#52b788">${clientes}</strong>
      </div>
      <div style="color:var(--text3)">
        VIPs: <strong style="color:#9b7fe8">${vips}</strong>
      </div>
      <div style="color:var(--text3)">
        Score médio: <strong style="color:var(--gold)">${avgScore}</strong>
      </div>
      <div style="color:var(--text3);margin-left:auto">
        Receita: <strong style="color:#52b788">${totalGasto.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>
      </div>
    </div>`;
}

function ldSkeletonHTML() {
  const rows = Array(5).fill(0).map(() =>
    `<tr style="border-bottom:1px solid var(--border)">
      ${Array(6).fill(0).map(() =>
        `<td style="padding:12px 14px"><div style="height:12px;background:var(--surface2);border-radius:4px;animation:pulse 1.5s infinite"></div></td>`
      ).join('')}
    </tr>`
  ).join('');
  return `
    <div style="padding:16px 20px 12px;border-bottom:1px solid var(--border);background:var(--surface);flex-shrink:0">
      <div style="height:16px;width:160px;background:var(--surface2);border-radius:5px;animation:pulse 1.5s infinite"></div>
    </div>
    <div style="flex:1;overflow:hidden">
      <table style="width:100%;border-collapse:collapse">${rows}</table>
    </div>`;
}

function ldRenderEmpty(msg) {
  const canvas = document.getElementById('ld-canvas-content');
  if (!canvas) return;
  canvas.innerHTML = `
    <div style="height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--text3)">
      <div style="font-size:36px">👤</div>
      <div style="font-size:13px">${msg}</div>
    </div>`;
}

// ── Lead Detail Modal ─────────────────────────────────────────────
async function ldOpenLead(leadId, projectId) {
  const leads = ldLeadsCache[projectId] || [];
  const lead  = leads.find(l => l.id === leadId);
  if (!lead) return;

  // Load vendas for this lead (leadId filter; project is irrelevant here)
  let vendas = [];
  try {
    if (typeof SB !== 'undefined' && SB.loadVendas) {
      const sbProjId = (projectId === '__all__' || projectId === '__null__') ? null : projectId;
      vendas = await SB.loadVendas(sbProjId, leadId) || [];
    }
  } catch(e) { console.warn('[leads] loadVendas', e); }

  const platIcons = { hotmart: '🔥', ticto: '⚡', manual: '✏️' };
  const platIcon  = platIcons[lead.plataforma] || '•';
  const gasto     = parseFloat(lead.total_gasto || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const score     = parseInt(lead.score || 0);
  const tags      = (lead.tags || []).join(', ') || '—';
  const extra     = lead.data ? (typeof lead.data === 'string' ? JSON.parse(lead.data) : lead.data) : {};

  const vendasHtml = vendas.length === 0
    ? '<div style="color:var(--text3);font-size:12px;padding:12px 0">Nenhuma venda registrada</div>'
    : vendas.map(v => {
        const valor = parseFloat(v.valor || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
        const cor   = v.status === 'approved' ? '#52b788' : v.status === 'refunded' ? '#e05c5c' : 'var(--text3)';
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:13px">${platIcons[v.plataforma] || '•'}</span>
            <div style="flex:1">
              <div style="font-size:12px;font-weight:600;color:var(--text)">${ldEscape(v.produto_nome || v.produto_id_ext || '—')}</div>
              <div style="font-size:10px;color:var(--text3)">${(v.data_venda || '').slice(0,10)} · ${v.status || '—'}</div>
            </div>
            <span style="font-size:13px;font-weight:700;color:${cor}">${valor}</span>
          </div>`;
      }).join('');

  let modal = document.getElementById('ld-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ld-detail-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:3200;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.onclick = (e) => { if (e.target === modal) ldCloseDetail(); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:14px;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column">
      <!-- Header -->
      <div style="padding:16px 20px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;flex-shrink:0">
        <div style="flex:1">
          <div style="font-size:16px;font-weight:700;color:var(--text)">${ldEscape(lead.nome || '—')}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">${platIcon} ${lead.plataforma || '—'} · ${lead.status || 'lead'}</div>
        </div>
        <button onclick="ldCloseDetail()"
          style="width:28px;height:28px;border-radius:7px;border:1px solid var(--border2);background:var(--surface2);color:var(--text2);cursor:pointer;font-size:15px">✕</button>
      </div>

      <!-- Body -->
      <div style="overflow-y:auto;flex:1;padding:20px;display:flex;flex-direction:column;gap:16px">

        <!-- Score + gasto -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
          ${ldStatCard('Score', score + ' pts', score > 70 ? '#52b788' : score > 40 ? 'var(--gold)' : '#e05c5c')}
          ${ldStatCard('Gasto Total', gasto, '#52b788')}
          ${ldStatCard('Vendas', vendas.length + ' compra' + (vendas.length !== 1 ? 's' : ''), 'var(--gold)')}
        </div>

        <!-- Contact info -->
        <div style="background:var(--surface2);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:8px">
          ${ldInfoRow('📧', 'Email',    lead.email)}
          ${ldInfoRow('📱', 'Telefone', lead.phone)}
          ${ldInfoRow('🏷️', 'Tags',     tags)}
          ${ldInfoRow('📅', 'Desde',    (lead.criado_em || '').slice(0,10))}
          ${extra.utm_source ? ldInfoRow('🎯', 'UTM Source', extra.utm_source) : ''}
          ${extra.utm_campaign ? ldInfoRow('📢', 'UTM Campaign', extra.utm_campaign) : ''}
        </div>

        <!-- Vendas -->
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px">📦 Histórico de Compras</div>
          ${vendasHtml}
        </div>
      </div>
    </div>`;

  modal.style.display = 'flex';
}

function ldCloseDetail() {
  const modal = document.getElementById('ld-detail-modal');
  if (modal) modal.style.display = 'none';
}

function ldStatCard(label, value, color) {
  return `
    <div style="background:var(--surface2);border-radius:8px;padding:12px;text-align:center">
      <div style="font-size:18px;font-weight:700;color:${color}">${value}</div>
      <div style="font-size:10px;color:var(--text3);margin-top:3px">${label}</div>
    </div>`;
}

function ldInfoRow(icon, label, value) {
  if (!value) return '';
  return `
    <div style="display:flex;gap:8px;align-items:baseline;font-size:12px">
      <span>${icon}</span>
      <span style="color:var(--text3);width:80px;flex-shrink:0">${label}</span>
      <span style="color:var(--text)">${ldEscape(String(value))}</span>
    </div>`;
}

// ── Filters & Sort ────────────────────────────────────────────────
function ldOnSearch(val) {
  ldSearchQuery = val.trim();
  if (ldActiveProjectId) ldRenderLeadsTable(ldActiveProjectId);
}
function ldOnFilterPlat(val) {
  ldFilterPlat = val;
  if (ldActiveProjectId) ldRenderLeadsTable(ldActiveProjectId);
}
function ldOnFilterStatus(val) {
  ldFilterStatus = val;
  if (ldActiveProjectId) ldRenderLeadsTable(ldActiveProjectId);
}
function ldSort(field) {
  if (ldSortField === field) {
    ldSortDir = ldSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    ldSortField = field;
    ldSortDir   = field === 'criado_em' ? 'desc' : 'asc';
  }
  if (ldActiveProjectId) ldRenderLeadsTable(ldActiveProjectId);
}

// ── Produto IDs Config ────────────────────────────────────────────
function ldToggleProdutoConfig(projectId) {
  const el = document.getElementById(`ld-prod-cfg-${projectId}`);
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  // Close all other config panels first
  document.querySelectorAll('[id^="ld-prod-cfg-"]').forEach(p => { p.style.display = 'none'; });
  if (!isOpen) {
    el.style.display = 'block';
    // Pre-fill with existing IDs from PROJECTS
    const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === projectId);
    const input = document.getElementById(`ld-prod-ids-${projectId}`);
    if (input && proj) input.value = (proj.produto_ids_ext || []).join(', ');
    if (input) input.focus();
  }
}

async function ldSaveProdutoIds(projectId) {
  const input  = document.getElementById(`ld-prod-ids-${projectId}`);
  const saveBtn = document.getElementById(`ld-prod-save-${projectId}`);
  if (!input) return;

  const ids = input.value.split(',').map(s => s.trim()).filter(Boolean);

  // Update local PROJECTS cache
  const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === projectId);
  if (proj) proj.produto_ids_ext = ids;

  if (saveBtn) { saveBtn.textContent = '…'; saveBtn.disabled = true; }

  // Persist to Supabase
  if (typeof SB !== 'undefined' && SB.updateProdutoIds) {
    const ok = await SB.updateProdutoIds(projectId, ids);
    if (!ok) {
      if (saveBtn) { saveBtn.textContent = '✗ Erro'; saveBtn.disabled = false; }
      setTimeout(() => { if (saveBtn) { saveBtn.textContent = 'Salvar'; } }, 2000);
      return;
    }
  }

  // Notify server to refresh its in-memory map
  try { await fetch('/api/refresh-produto-map', { method: 'POST' }); } catch(_) {}

  // Close panel and give feedback
  const el = document.getElementById(`ld-prod-cfg-${projectId}`);
  if (el) el.style.display = 'none';
  if (saveBtn) { saveBtn.textContent = 'Salvar'; saveBtn.disabled = false; }
  console.log(`[leads] produto_ids_ext salvo para ${projectId}:`, ids);
}

// ── Utilities ─────────────────────────────────────────────────────
function ldEscape(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
