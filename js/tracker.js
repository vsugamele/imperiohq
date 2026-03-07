// ── Tracker de Links (Fase 3A) ─────────────────────────────────────
// Estado
let trLinks    = [];   // tracking links carregados
let trClicks   = [];   // clicks carregados
let trLoading  = false;
let trDetailId = null; // link selecionado para ver cliques

// ── Entry point ───────────────────────────────────────────────────
async function showTracker() {
  showSection('tracker');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-tracker');
  if (nav) nav.classList.add('active');

  trDetailId = null;
  trRender('loading');
  trLinks  = await SB.loadTrackingLinks('__all__');
  trClicks = await SB.loadClicksStats('__all__');
  trRender();
}

// ── Render principal ──────────────────────────────────────────────
function trRender(state) {
  const el = document.getElementById('tracker-body');
  if (!el) return;
  if (state === 'loading') {
    el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text3);font-size:13px">⏳ Carregando links…</div>`;
    return;
  }

  // Mapa de cliques por link
  const clicksByLink = {};
  const convByLink   = {};
  for (const c of trClicks) {
    if (!c.link_id) continue;
    clicksByLink[c.link_id] = (clicksByLink[c.link_id] || 0) + 1;
    if (c.convertido) convByLink[c.link_id] = (convByLink[c.link_id] || 0) + 1;
  }

  const totalCliques = trClicks.length;
  const totalConv    = trClicks.filter(c => c.convertido).length;
  const totalLinks   = trLinks.length;
  const cvr          = totalCliques > 0 ? ((totalConv / totalCliques) * 100).toFixed(1) : '0.0';

  const baseUrl = `${location.protocol}//${location.host}`;

  // ── Stats cards ───────────────────────────────────────────────
  let html = `
  <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
    ${trStatCard('🔗', 'Links Ativos', trLinks.filter(l => l.ativo).length + ' / ' + totalLinks, 'var(--gold)')}
    ${trStatCard('👆', 'Cliques Totais', totalCliques.toLocaleString('pt-BR'), '#7aa2f7')}
    ${trStatCard('💰', 'Conversões', totalConv.toLocaleString('pt-BR'), '#52b788')}
    ${trStatCard('📈', 'CVR Médio', cvr + '%', '#bb9af7')}
  </div>`;

  // ── Tabela de links ───────────────────────────────────────────
  if (trLinks.length === 0) {
    html += `<div style="text-align:center;padding:60px 20px;color:var(--text3)">
      <div style="font-size:32px;margin-bottom:12px">🔗</div>
      <div style="font-size:14px;margin-bottom:6px">Nenhum link criado ainda</div>
      <div style="font-size:12px;margin-bottom:16px">Crie seu primeiro link de rastreamento para capturar cliques e atribuir vendas</div>
      <button onclick="trOpenModal()" style="background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);color:var(--gold);padding:8px 20px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">+ Novo Link</button>
    </div>`;
    el.innerHTML = html;
    return;
  }

  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden">
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="border-bottom:1px solid var(--border);background:rgba(0,0,0,.15)">
          <th style="text-align:left;padding:10px 14px;color:var(--text3);font-weight:600;white-space:nowrap">Nome / Slug</th>
          <th style="text-align:left;padding:10px 8px;color:var(--text3);font-weight:600">Destino</th>
          <th style="text-align:left;padding:10px 8px;color:var(--text3);font-weight:600">Fonte</th>
          <th style="text-align:center;padding:10px 8px;color:var(--text3);font-weight:600">Cliques</th>
          <th style="text-align:center;padding:10px 8px;color:var(--text3);font-weight:600">Conv.</th>
          <th style="text-align:center;padding:10px 8px;color:var(--text3);font-weight:600">CVR</th>
          <th style="text-align:right;padding:10px 14px;color:var(--text3);font-weight:600">Ações</th>
        </tr>
      </thead>
      <tbody>`;

  trLinks.forEach((link, i) => {
    const clicks = clicksByLink[link.id] || 0;
    const conv   = convByLink[link.id]   || 0;
    const cvr    = clicks > 0 ? ((conv / clicks) * 100).toFixed(1) : '–';
    const trackUrl = `${baseUrl}/r/${link.id}`;
    const projeto  = typeof PROJECTS !== 'undefined'
      ? (PROJECTS.find(p => p.id === link.project_id) || null)
      : null;
    const projLabel = projeto ? `${projeto.icon || '📁'} ${projeto.nome}` : '';
    const fonteLabel = [link.utm_source, link.utm_medium].filter(Boolean).join(' / ') || '–';

    html += `<tr style="border-bottom:1px solid var(--border);${!link.ativo ? 'opacity:.4' : ''}transition:background .15s"
               onmouseover="this.style.background='rgba(255,255,255,.03)'"
               onmouseout="this.style.background='transparent'">
      <td style="padding:10px 14px">
        <div style="font-weight:700;color:var(--text);margin-bottom:2px">${trEsc(link.nome || link.id)}</div>
        <div style="display:flex;align-items:center;gap:4px">
          <code style="font-size:10px;color:var(--text3);background:rgba(0,0,0,.2);padding:1px 5px;border-radius:4px">/r/${trEsc(link.id)}</code>
          ${!link.ativo ? '<span style="font-size:9px;color:#e05c5c;background:rgba(224,92,92,.12);padding:1px 5px;border-radius:8px">inativo</span>' : ''}
        </div>
        ${projLabel ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">${trEsc(projLabel)}</div>` : ''}
      </td>
      <td style="padding:10px 8px;max-width:180px">
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text2);font-size:11px" title="${trEsc(link.destino)}">${trEsc(trDomain(link.destino))}</div>
      </td>
      <td style="padding:10px 8px;color:var(--text2)">${trEsc(fonteLabel)}</td>
      <td style="padding:10px 8px;text-align:center">
        <button onclick="trShowClicks('${link.id}')" style="background:none;border:none;cursor:pointer;color:${clicks > 0 ? '#7aa2f7' : 'var(--text3)'};font-size:13px;font-weight:700;padding:0"
          title="Ver cliques">${clicks > 0 ? clicks : '–'}</button>
      </td>
      <td style="padding:10px 8px;text-align:center;color:${conv > 0 ? '#52b788' : 'var(--text3)'}">
        <strong>${conv > 0 ? conv : '–'}</strong>
      </td>
      <td style="padding:10px 8px;text-align:center;color:${cvr !== '–' ? 'var(--text2)' : 'var(--text3)'}">${cvr !== '–' ? cvr + '%' : '–'}</td>
      <td style="padding:10px 14px;text-align:right;white-space:nowrap">
        <button onclick="trCopyUrl('${trEsc(trackUrl)}')" title="Copiar link de rastreio"
          style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:14px;padding:2px 5px"
          onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text3)'">📋</button>
        <button onclick="trOpenModal('${link.id}')" title="Editar"
          style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:14px;padding:2px 5px"
          onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text3)'">✏️</button>
        <button onclick="trDelete('${link.id}')" title="Excluir"
          style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:14px;padding:2px 5px"
          onmouseover="this.style.color='#e05c5c'" onmouseout="this.style.color='var(--text3)'">🗑</button>
      </td>
    </tr>`;
  });

  html += `</tbody></table></div>`;

  // ── Painel de cliques (se link selecionado) ───────────────────
  if (trDetailId) {
    html += trClicksPanel();
  }

  el.innerHTML = html;
}

// ── Stat card helper ──────────────────────────────────────────────
function trStatCard(icon, label, value, color) {
  return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 18px;min-width:130px;flex:1">
    <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${icon} ${label}</div>
    <div style="font-size:22px;font-weight:800;color:${color}">${value}</div>
  </div>`;
}

// ── Render painel de cliques ──────────────────────────────────────
function trClicksPanel() {
  const link = trLinks.find(l => l.id === trDetailId);
  if (!link) return '';
  const clicks = (window._trClicksDetail || []);

  const rows = clicks.length === 0
    ? `<div style="padding:20px;text-align:center;color:var(--text3);font-size:12px">Nenhum clique registrado ainda</div>`
    : clicks.slice(0, 100).map(c => {
        const dt = c.created_at ? new Date(c.created_at).toLocaleString('pt-BR') : '–';
        return `<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:7px 12px;font-size:11px;color:var(--text2)">${dt}</td>
          <td style="padding:7px 8px;font-size:11px;color:var(--text3);font-family:monospace">${trEsc((c.id || '').slice(0, 12))}…</td>
          <td style="padding:7px 8px;font-size:11px;color:var(--text2)">${trEsc(c.utm_source || '–')}</td>
          <td style="padding:7px 8px;font-size:11px;color:var(--text2)">${trEsc(c.utm_campaign || '–')}</td>
          <td style="padding:7px 8px;text-align:center">
            ${c.convertido ? '<span style="color:#52b788;font-size:11px">✓</span>' : '<span style="color:var(--text3);font-size:11px">–</span>'}
          </td>
        </tr>`;
      }).join('');

  return `
  <div style="margin-top:20px;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border)">
      <div style="font-size:13px;font-weight:700;color:var(--text)">
        👆 Cliques — <span style="color:var(--text3)">${trEsc(link.nome || link.id)}</span>
        <span style="font-size:11px;color:var(--text3);font-weight:400;margin-left:8px">(${clicks.length})</span>
      </div>
      <button onclick="trDetailId=null;trRender()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:18px;line-height:1;padding:0">×</button>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="background:rgba(0,0,0,.15)">
          <th style="text-align:left;padding:8px 12px;color:var(--text3);font-weight:600">Data/Hora</th>
          <th style="text-align:left;padding:8px 8px;color:var(--text3);font-weight:600">Click ID</th>
          <th style="text-align:left;padding:8px 8px;color:var(--text3);font-weight:600">Fonte</th>
          <th style="text-align:left;padding:8px 8px;color:var(--text3);font-weight:600">Campanha</th>
          <th style="text-align:center;padding:8px 8px;color:var(--text3);font-weight:600">Conv.</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

// ── Mostrar cliques de um link ────────────────────────────────────
async function trShowClicks(linkId) {
  trDetailId = linkId;
  window._trClicksDetail = null;
  trRender();
  window._trClicksDetail = await SB.loadClicks(linkId);
  trRender();
}

// ── Modal criar/editar ────────────────────────────────────────────
function trOpenModal(editId) {
  const link = editId ? (trLinks.find(l => l.id === editId) || {}) : {};
  const isEdit = !!editId;

  const projOpts = (typeof PROJECTS !== 'undefined' ? PROJECTS : [])
    .map(p => `<option value="${trEsc(p.id)}" ${link.project_id === p.id ? 'selected' : ''}>${trEsc(p.icon || '📁')} ${trEsc(p.nome)}</option>`)
    .join('');

  const html = `
  <div id="tr-modal" onclick="if(event.target===this)trCloseModal()"
    style="position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(3px);z-index:999;display:flex;align-items:center;justify-content:center">
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:800;color:var(--text)">${isEdit ? '✏️ Editar Link' : '🔗 Novo Link de Rastreio'}</div>
        <button onclick="trCloseModal()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:20px;line-height:1">×</button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">

        <div>
          <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:5px">NOME DO LINK *</label>
          <input id="tr-f-nome" type="text" value="${trEsc(link.nome || '')}" placeholder="Ex: Laíse — FB Jan/26"
            oninput="if(!document.getElementById('tr-f-id-manual').checked)trAutoSlug(this.value)"
            style="${trInputStyle()}">
        </div>

        <div>
          <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:5px">
            SLUG (ID DO LINK) *
            ${isEdit ? '' : '<label style="margin-left:8px;cursor:pointer"><input type="checkbox" id="tr-f-id-manual" onchange="document.getElementById(\'tr-f-id\').readOnly=!this.checked"> editar manualmente</label>'}
          </label>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:12px;color:var(--text3);white-space:nowrap">${location.protocol}//${location.host}/r/</span>
            <input id="tr-f-id" type="text" value="${trEsc(link.id || '')}" placeholder="ex-laise-fb-jan"
              ${isEdit ? '' : 'readonly'}
              style="${trInputStyle()}flex:1">
          </div>
        </div>

        <div>
          <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:5px">URL DE DESTINO * (link do checkout Hotmart/Ticto)</label>
          <input id="tr-f-destino" type="url" value="${trEsc(link.destino || '')}" placeholder="https://pay.hotmart.com/PRODUCTID"
            style="${trInputStyle()}">
        </div>

        <div>
          <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:5px">PROJETO</label>
          <select id="tr-f-projeto" style="${trInputStyle()}">
            <option value="">— sem projeto —</option>
            ${projOpts}
          </select>
        </div>

        <div style="background:rgba(0,0,0,.15);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:10px">
          <div style="font-size:11px;color:var(--text3);font-weight:700;margin-bottom:2px">🏷 UTM PARAMETERS</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${trField('tr-f-src',      'utm_source',   'facebook',   link.utm_source   || '')}
            ${trField('tr-f-med',      'utm_medium',   'paid',       link.utm_medium   || '')}
            ${trField('tr-f-camp',     'utm_campaign', 'jan-2026',   link.utm_campaign  || '')}
            ${trField('tr-f-content',  'utm_content',  'criativo-1', link.utm_content   || '')}
          </div>
        </div>

        ${isEdit ? `
        <div style="display:flex;align-items:center;gap:8px">
          <input type="checkbox" id="tr-f-ativo" ${link.ativo !== false ? 'checked' : ''} style="accent-color:var(--gold)">
          <label for="tr-f-ativo" style="font-size:12px;color:var(--text2);cursor:pointer">Link ativo (recebe cliques)</label>
        </div>` : ''}

      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;border-top:1px solid var(--border)">
        <button onclick="trCloseModal()" style="background:transparent;border:1px solid var(--border);color:var(--text2);padding:8px 18px;border-radius:8px;font-size:13px;cursor:pointer">Cancelar</button>
        <button id="tr-save-btn" onclick="trSave('${editId || ''}')"
          style="background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.35);color:var(--gold);padding:8px 22px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">
          ${isEdit ? 'Salvar' : 'Criar Link'}
        </button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

function trCloseModal() {
  const m = document.getElementById('tr-modal');
  if (m) m.remove();
}

function trAutoSlug(nome) {
  const slug = nome
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  const el = document.getElementById('tr-f-id');
  if (el && !el.readOnly === false) return; // manual mode
  if (el) el.value = slug;
}

async function trSave(editId) {
  const nome    = document.getElementById('tr-f-nome')?.value.trim();
  const id      = document.getElementById('tr-f-id')?.value.trim().replace(/\s+/g, '-');
  const destino = document.getElementById('tr-f-destino')?.value.trim();
  const projEl  = document.getElementById('tr-f-projeto');

  if (!id)      { alert('Informe o slug do link'); return; }
  if (!destino) { alert('Informe a URL de destino'); return; }

  const btn = document.getElementById('tr-save-btn');
  if (btn) { btn.textContent = '…'; btn.disabled = true; }

  const link = {
    id,
    nome:         nome || id,
    destino,
    project_id:   projEl?.value || null,
    utm_source:   document.getElementById('tr-f-src')?.value.trim()     || null,
    utm_medium:   document.getElementById('tr-f-med')?.value.trim()     || null,
    utm_campaign: document.getElementById('tr-f-camp')?.value.trim()    || null,
    utm_content:  document.getElementById('tr-f-content')?.value.trim() || null,
    ativo:        editId ? (document.getElementById('tr-f-ativo')?.checked !== false) : true,
    created_at:   editId
      ? (trLinks.find(l => l.id === editId)?.created_at || new Date().toISOString())
      : new Date().toISOString(),
  };

  const ok = await SB.upsertTrackingLink(link);
  if (!ok) {
    if (btn) { btn.textContent = '✗ Erro'; btn.disabled = false; }
    return;
  }

  trCloseModal();
  trLinks  = await SB.loadTrackingLinks('__all__');
  trClicks = await SB.loadClicksStats('__all__');
  trRender();
}

async function trDelete(id) {
  const link = trLinks.find(l => l.id === id);
  if (!confirm(`Excluir link "${link?.nome || id}"? Todos os cliques associados serão removidos.`)) return;
  await SB.deleteTrackingLink(id);
  trLinks  = trLinks.filter(l => l.id !== id);
  trClicks = trClicks.filter(c => c.link_id !== id);
  if (trDetailId === id) trDetailId = null;
  trRender();
}

function trCopyUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    // feedback visual no botão que clicou é difícil sem ref, usa toast simples
    trToast('🔗 Link copiado!');
  }).catch(() => {
    prompt('Copie o link:', url);
  });
}

function trToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:var(--surface);border:1px solid var(--border);border-radius:8px;
    padding:10px 16px;font-size:13px;color:var(--text);
    box-shadow:0 4px 20px rgba(0,0,0,.4);pointer-events:none;
    animation:fadeIn .2s ease`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

// ── Helpers ───────────────────────────────────────────────────────
function trEsc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function trDomain(url) {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}
function trInputStyle() {
  return `width:100%;box-sizing:border-box;background:var(--surface);border:1px solid var(--border2);
    border-radius:7px;padding:7px 10px;font-size:12px;color:var(--text);outline:none;`;
}
function trField(id, label, placeholder, value) {
  return `<div>
    <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:3px">${label.toUpperCase()}</label>
    <input id="${id}" type="text" value="${trEsc(value)}" placeholder="${placeholder}"
      style="${trInputStyle()}">
  </div>`;
}
