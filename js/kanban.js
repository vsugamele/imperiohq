// ═══════════════════════════════════════════════════════
//  LAUNCH
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
//  KANBAN
// ═══════════════════════════════════════════════════════

const KN_COLS = [
  { id: 'backlog', label: '📥 Backlog', cls: '' },
  { id: 'doing', label: '⚡ Fazendo', cls: 'kn-col-doing' },
  { id: 'stuck', label: '⚠ Travado', cls: 'kn-col-stuck' },
  { id: 'review', label: '🔍 Revisão', cls: 'kn-col-review' },
  { id: 'done', label: '✅ Feito', cls: 'kn-col-done' }
];
const KN_BOARDS = ['agentes', 'humanas', 'criativos', 'campanhas'];
let knBoard = 'agentes';
let knEditId = null;
let knPrio = 'media';

function knUid() { return Math.random().toString(36).slice(2, 10); }
function knLoad() {
  // Evita semear cards locais fake; Supabase é a fonte principal.
  let d = JSON.parse(localStorage.getItem('imperio_kanban') || 'null');
  if (!d) d = [];
  return d;
}
let knCards = knLoad();
function knSave(c) { c = c || knCards; localStorage.setItem('imperio_kanban', JSON.stringify(c)); }

function knSeed() {
  const t = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
  return [
    { id: knUid(), board: 'agentes', title: 'Gerar copies VSL Segredos da Captação', status: 'doing', project: 'Segredos da Captação', owner: 'Agente', priority: 'alta', deadline: t(1), notes: '', blocked_by: '' },
    { id: knUid(), board: 'agentes', title: 'Análise de concorrentes Deep Networking', status: 'stuck', project: 'Deep Networking', owner: 'Agente', priority: 'alta', deadline: t(-1), notes: '', blocked_by: 'Falta URL dos perfis para scraping' },
    { id: knUid(), board: 'agentes', title: 'Mapear avatar Kit Tráfego', status: 'review', project: 'Kit Tráfego', owner: 'Agente', priority: 'media', deadline: t(7), notes: '', blocked_by: '' },
    { id: knUid(), board: 'agentes', title: 'Roteiro email onboarding Expert IA', status: 'backlog', project: 'Expert IA', owner: 'Agente', priority: 'baixa', deadline: '', notes: '', blocked_by: '' },
    { id: knUid(), board: 'humanas', title: 'Aprovar copies VSL — prazo amanhã', status: 'doing', project: 'Segredos da Captação', owner: 'Você', priority: 'alta', deadline: t(1), notes: 'Revisar 5 variações', blocked_by: '' },
    { id: knUid(), board: 'humanas', title: 'Gravar VSL principal', status: 'stuck', project: 'Segredos da Captação', owner: 'Você', priority: 'alta', deadline: t(-1), notes: '', blocked_by: 'Studio sem disponibilidade até quinta' },
    { id: knUid(), board: 'humanas', title: 'Configurar pixel Meta nas páginas', status: 'backlog', project: 'Kit Tráfego', owner: 'Você', priority: 'alta', deadline: t(5), notes: '', blocked_by: '' },
    { id: knUid(), board: 'humanas', title: 'Revisão módulo 3 Expert IA', status: 'review', project: 'Expert IA', owner: 'Você', priority: 'media', deadline: t(7), notes: '', blocked_by: '' },
    { id: knUid(), board: 'criativos', title: 'Criativo hook "Estou travado" carrossel', status: 'doing', project: 'Segredos da Captação', owner: 'Agente', priority: 'alta', deadline: t(1), notes: '', blocked_by: '' },
    { id: knUid(), board: 'criativos', title: 'Thumb YouTube Deep Networking', status: 'stuck', project: 'Deep Networking', owner: 'Você', priority: 'media', deadline: '', notes: '', blocked_by: 'Aguardando foto profissional' },
    { id: knUid(), board: 'criativos', title: '3 headlines Kit Tráfego', status: 'backlog', project: 'Kit Tráfego', owner: 'Agente', priority: 'media', deadline: '', notes: '', blocked_by: '' },
    { id: knUid(), board: 'criativos', title: 'Vídeo UGC simulado Manual Fechamento', status: 'review', project: 'Manual Fechamento', owner: 'Você', priority: 'alta', deadline: t(1), notes: '', blocked_by: '' },
    { id: knUid(), board: 'campanhas', title: 'Campanha fundo funil Segredos', status: 'doing', project: 'Segredos da Captação', owner: 'Você', priority: 'alta', deadline: t(7), notes: '3 públicos + 2 criativos', blocked_by: '' },
    { id: knUid(), board: 'campanhas', title: 'Retargeting 3 dias Kit Tráfego', status: 'stuck', project: 'Kit Tráfego', owner: 'Você', priority: 'alta', deadline: t(-1), notes: '', blocked_by: 'Pixel sem dados suficientes (<500 eventos)' },
    { id: knUid(), board: 'campanhas', title: 'Campanha awareness Expert IA', status: 'backlog', project: 'Expert IA', owner: 'Você', priority: 'media', deadline: '', notes: '', blocked_by: '' },
    { id: knUid(), board: 'campanhas', title: 'A/B criativos Deep Networking', status: 'review', project: 'Deep Networking', owner: 'Você', priority: 'media', deadline: t(7), notes: '', blocked_by: '' },
  ];
}

function showKanban() {
  document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('view-kanban').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-kanban').classList.add('active');
  // Populate project select if needed
  const sel = document.getElementById('kn-filter-proj');
  if (sel && sel.options.length <= 1) {
    PROJECTS.forEach(p => { sel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
  }
  const fsel = document.getElementById('kn-f-project');
  if (fsel && fsel.options.length <= 1) {
    PROJECTS.forEach(p => { fsel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
  }
  // Populate assignee filter with EQUIPE members (always refresh)
  const afilter = document.getElementById('kn-filter-assignee');
  if (afilter) {
    afilter.innerHTML = '<option value="">👥 Todos os membros</option>' +
      EQUIPE.map(m => `<option value="${m.id}">${m.emoji || '👤'} ${m.nome}</option>`).join('');
  }
  renderKanban();
}

function setKnBoard(b) { knBoard = b; renderKanban(); }

function knFilteredCards(boardFilter) {
  const pf = (document.getElementById('kn-filter-proj') || {}).value || '';
  const of = (document.getElementById('kn-filter-owner') || {}).value || '';
  const af = (document.getElementById('kn-filter-assignee') || {}).value || '';
  return knCards.filter(c => {
    if (boardFilter && boardFilter !== 'all' && c.board !== boardFilter) return false;
    if (pf && c.project !== pf) return false;
    if (of === 'Você' && c.owner !== 'Você') return false;
    if (of === 'Agente' && c.owner !== 'Agente') return false;
    if (af && c.assignee !== af) return false;
    return true;
  });
}

// ── Priority filter state per column (Sprint 3.1) ───────────
let _knColPrioFilter = {};
function knToggleColPrio(colId, prio) {
  _knColPrioFilter[colId] = _knColPrioFilter[colId] === prio ? null : prio;
  renderKanban();
}

function renderKanban() {
  const board = document.getElementById('kn-board');
  if (!board) return;
  // 7.2 — responsivo: scroll horizontal no mobile
  board.style.cssText = 'display:flex;gap:10px;overflow-x:auto;padding-bottom:12px;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory';
  const isAll = knBoard === 'all';

  KN_BOARDS.forEach(b => {
    const tab = document.getElementById('kntab-' + b);
    if (tab) tab.className = 'kn-btab' + (b === knBoard ? ' active' : '');
    const cnt = document.getElementById('knc-' + b);
    if (cnt) cnt.textContent = knCards.filter(c => c.board === b && c.status !== 'done').length;
  });
  const allTab = document.getElementById('kntab-all');
  if (allTab) allTab.className = 'kn-btab' + (knBoard === 'all' ? ' active' : '');

  board.innerHTML = KN_COLS.map(col => {
    let list = knFilteredCards(isAll ? null : knBoard).filter(c => c.status === col.id);
    // Apply priority filter if set for this column
    const pf = _knColPrioFilter[col.id];
    if (pf) list = list.filter(c => c.priority === pf);
    const cardsHtml = list.length
      ? list.map(c => knRenderCard(c)).join('')
      : `<div class="kn-empty">Nenhuma tarefa</div>`;
    const prioChips = ['alta', 'media', 'baixa'].map(p => {
      const colors = { alta: '#e05c5c', media: 'var(--gold)', baixa: '#52b788' };
      const labels = { alta: '🔴', media: '🟡', baixa: '🟢' };
      const active = pf === p;
      return `<span onclick="knToggleColPrio('${col.id}','${p}')" title="Filtrar ${p}"
        style="cursor:pointer;font-size:9px;padding:1px 5px;border-radius:8px;
        background:${active ? `rgba(${p === 'alta' ? '224,92,92' : p === 'media' ? '201,168,76' : '82,183,136'},.2)` : 'transparent'};
        color:${active ? colors[p] : 'var(--text3)'};border:1px solid ${active ? colors[p] : 'transparent'};
        transition:.12s">${labels[p]}</span>`;
    }).join('');
    return `<div class="kn-col ${col.cls}">
      <div class="kn-col-hdr">
        <div class="kn-col-hdr-title">${col.label}</div>
        <div class="kn-col-cnt">${list.length}</div>
        <button class="kn-col-add" onclick="openKanbanModal('${col.id}')">+</button>
      </div>
      <div style="display:flex;gap:3px;padding:2px 10px 6px">${prioChips}</div>
      <div class="kn-cards">${cardsHtml}</div>
    </div>`;
  }).join('');

  // Stats
  const all = knFilteredCards(null);
  const stuck = all.filter(c => c.status === 'stuck').length;
  const doing = all.filter(c => c.status === 'doing').length;
  const done = all.filter(c => c.status === 'done').length;
  const stEl = document.getElementById('kn-stat-stuck');
  const doEl = document.getElementById('kn-stat-doing');
  const dnEl = document.getElementById('kn-stat-done');
  if (stEl) stEl.textContent = `⚠ ${stuck} Travado${stuck !== 1 ? 's' : ''}`;
  if (doEl) doEl.textContent = `⚡ ${doing} Fazendo`;
  if (dnEl) dnEl.textContent = `✅ ${done} Feito${done !== 1 ? 's' : ''}`;

  // Sidebar badge
  const badge = document.getElementById('kanban-stuck-badge');
  if (badge) { badge.textContent = stuck; badge.style.display = stuck > 0 ? 'inline-flex' : 'none'; }

  // ── Drag-and-drop wiring ──────────────────────────────────────────
  board.querySelectorAll('.kn-card[draggable]').forEach(card => {
    card.addEventListener('dragstart', e => {
      _knDragId = card.dataset.knId;
      card.style.opacity = '0.45';
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.style.opacity = '';
      board.querySelectorAll('.kn-cards').forEach(col => col.classList.remove('kn-drag-over'));
    });
  });

  board.querySelectorAll('.kn-cards').forEach(colCards => {
    colCards.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      board.querySelectorAll('.kn-cards').forEach(c => c.classList.remove('kn-drag-over'));
      colCards.classList.add('kn-drag-over');
    });
    colCards.addEventListener('dragleave', () => colCards.classList.remove('kn-drag-over'));
    colCards.addEventListener('drop', e => {
      e.preventDefault();
      colCards.classList.remove('kn-drag-over');
      if (!_knDragId) return;
      // Determine target column id from the kn-col parent
      const colEl = colCards.closest('.kn-col');
      if (!colEl) return;
      const colIdx = [...board.querySelectorAll('.kn-col')].indexOf(colEl);
      const newStatus = KN_COLS[colIdx]?.id;
      if (!newStatus) return;
      const c = knCards.find(x => x.id === _knDragId);
      if (c && c.status !== newStatus) {
        c.status = newStatus;
        knSave();
        renderKanban();
      }
      _knDragId = null;
    });
  });
}

function knRenderCard(c) {
  const today = new Date().toISOString().slice(0, 10);
  let dlHtml = '';
  if (c.deadline) {
    if (c.deadline < today) dlHtml = `<span style="font-size:10px;color:#e05c5c;font-weight:600">🔴 ${c.deadline.slice(5).replace('-', '/')}</span>`;
    else if (c.deadline === today) dlHtml = `<span style="font-size:10px;color:#e8844a;font-weight:600">🟡 Hoje</span>`;
    else dlHtml = `<span style="font-size:10px;color:var(--text3)">📅 ${c.deadline.slice(5).replace('-', '/')}</span>`;
  }
  const blockedHtml = c.status === 'stuck' && c.blocked_by
    ? `<div style="margin-top:6px;padding:5px 7px;border-radius:5px;background:rgba(224,92,92,.1);border:1px solid rgba(224,92,92,.2);font-size:10px;color:#e05c5c">⚠ ${c.blocked_by}</div>` : '';
  const bNames = { agentes: 'Agente', humanas: 'Humana', criativos: 'Criativo', campanhas: 'Campanha' };
  const bColors = { agentes: 'rgba(155,127,232,.12);color:#9b7fe8', humanas: 'rgba(91,141,238,.12);color:#5b8dee', criativos: 'rgba(232,132,74,.12);color:#e8844a', campanhas: 'rgba(82,183,136,.12);color:#52b788' };
  // Look up member from EQUIPE for assignee display
  const assigneeMember = c.assignee ? EQUIPE.find(m => m.id === c.assignee || m.nome === c.assignee) : null;
  const assigneeHtml = assigneeMember
    ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--text2);background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:2px 7px">${assigneeMember.foto ? `<img src="${assigneeMember.foto}" style="width:14px;height:14px;border-radius:50%;object-fit:cover">` : assigneeMember.emoji || '👤'} ${assigneeMember.nome.split(' ')[0]}</span>` : '';
  const hasPreview = !!(c.notes || c.deadline || c.blocked_by);
  return `<div class="kn-card kp-${c.priority}" draggable="true" data-kn-id="${c.id}" onclick="openKanbanModal(null,'${c.id}')"
    ${hasPreview ? `onmouseenter="knShowCardTooltip(event,'${c.id.replace(/'/g, "\\'")}')"
    onmouseleave="knHideCardTooltip()"` : ''}>
    ${c.project ? `<div style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(212,168,67,.12);color:var(--gold);text-transform:uppercase;letter-spacing:.3px;margin-bottom:5px;display:inline-block">${c.project.slice(0, 14)}</div>` : ''}
    <div style="font-size:12px;font-weight:600;line-height:1.4;color:var(--text)">${c.title}</div>
    ${blockedHtml}
    <div style="display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap">
      ${c.owner ? `<span style="font-size:10px;color:var(--text3)">👤 ${c.owner}</span>` : ''}
      ${assigneeHtml}
      ${dlHtml}
    </div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">
      <span style="font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;background:${bColors[c.board]}">${bNames[c.board]}</span>
      ${c.priority === 'alta' ? `<span style="font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;background:rgba(224,92,92,.12);color:#e05c5c">ALTA</span>` : ''}
      ${hasPreview ? `<span style="font-size:9px;color:var(--text3);margin-left:auto">💬</span>` : ''}
    </div>
  </div>`;
}

// ── 3.3 Card Preview Tooltip ─────────────────────────────────
let _knTooltipTimer = null;
function knShowCardTooltip(e, cardId) {
  knHideCardTooltip();
  _knTooltipTimer = setTimeout(() => {
    const c = knCards.find(x => x.id === cardId);
    if (!c) return;
    const tip = document.createElement('div');
    tip.id = 'kn-tooltip';
    const today = new Date().toISOString().slice(0, 10);
    const dlColor = c.deadline ? (c.deadline < today ? '#e05c5c' : c.deadline === today ? '#e8844a' : 'var(--text3)') : null;
    tip.style.cssText = 'position:fixed;z-index:8888;max-width:260px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:11px 13px;box-shadow:0 12px 32px rgba(0,0,0,.45);pointer-events:none;font-size:11px;color:var(--text2);line-height:1.5;animation:fadeInUp .12s ease';
    tip.innerHTML = `
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px">${c.title}</div>
      ${c.deadline ? `<div style="color:${dlColor};margin-bottom:4px">📅 Deadline: ${c.deadline}</div>` : ''}
      ${c.notes ? `<div style="color:var(--text3);white-space:pre-wrap;max-height:80px;overflow:hidden">${c.notes.slice(0, 180)}${c.notes.length > 180 ? '…' : ''}</div>` : ''}
      ${c.blocked_by ? `<div style="margin-top:6px;padding:5px 7px;border-radius:5px;background:rgba(224,92,92,.1);border:1px solid rgba(224,92,92,.2);color:#e05c5c">⚠ ${c.blocked_by}</div>` : ''}
    `;
    document.body.appendChild(tip);
    // Position near cursor
    const rect = e.currentTarget.getBoundingClientRect();
    let top = rect.top + window.scrollY;
    let left = rect.right + 10;
    if (left + 270 > window.innerWidth) left = rect.left - 270;
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }, 300);
}
function knHideCardTooltip() {
  clearTimeout(_knTooltipTimer);
  const t = document.getElementById('kn-tooltip');
  if (t) t.remove();
}

function openKanbanModal(defaultStatus, cardId) {
  knEditId = cardId || null;
  knPrio = 'media';
  const modal = document.getElementById('kn-modal');
  const delBtn = document.getElementById('kn-del-btn');
  const moveBtns = document.getElementById('kn-move-btns');

  // Populate assignee dropdown with team members
  const asel = document.getElementById('kn-f-assignee');
  if (asel) {
    asel.innerHTML = '<option value="">— Sem atribuição —</option>' +
      EQUIPE.map(m => `<option value="${m.id}">${m.emoji || '👤'} ${m.nome} (${m.cargo || 'Membro'})</option>`).join('');
  }

  if (cardId) {
    const c = knCards.find(x => x.id === cardId);
    document.getElementById('kn-modal-title').textContent = 'Editar Tarefa';
    document.getElementById('kn-f-title').value = c.title;
    document.getElementById('kn-f-board').value = c.board;
    document.getElementById('kn-f-status').value = c.status;
    document.getElementById('kn-f-project').value = c.project || '';
    document.getElementById('kn-f-owner').value = c.owner || '';
    if (asel) asel.value = c.assignee || '';
    document.getElementById('kn-f-deadline').value = c.deadline || '';
    document.getElementById('kn-f-blocked').value = c.blocked_by || '';
    document.getElementById('kn-f-notes').value = c.notes || '';
    knPrio = c.priority || 'media';
    delBtn.style.display = 'block';
    moveBtns.style.display = 'flex';
    knToggleBlocked(c.status);
  } else {
    document.getElementById('kn-modal-title').textContent = 'Nova Tarefa';
    document.getElementById('kn-f-title').value = '';
    document.getElementById('kn-f-board').value = knBoard !== 'all' ? knBoard : 'agentes';
    document.getElementById('kn-f-status').value = defaultStatus || 'backlog';
    document.getElementById('kn-f-project').value = '';
    document.getElementById('kn-f-owner').value = '';
    if (asel) asel.value = window._prefilledAssignee || '';
    window._prefilledAssignee = null;
    document.getElementById('kn-f-deadline').value = '';
    document.getElementById('kn-f-blocked').value = '';
    document.getElementById('kn-f-notes').value = '';
    knPrio = 'media';
    delBtn.style.display = 'none';
    moveBtns.style.display = 'none';
    knToggleBlocked(defaultStatus || 'backlog');
  }
  knRenderPrio();
  modal.style.opacity = '1'; modal.style.pointerEvents = 'all';
  modal.onclick = (e) => { if (e.target === modal) closeKanbanModal(); };
}

function closeKanbanModal() {
  const modal = document.getElementById('kn-modal');
  modal.style.opacity = '0'; modal.style.pointerEvents = 'none';
  knEditId = null;
}

function knToggleBlocked(status) {
  const grp = document.getElementById('kn-blocked-grp');
  if (grp) grp.style.display = status === 'stuck' ? 'flex' : 'none';
}

function setKnPrio(p) { knPrio = p; knRenderPrio(); }

function knRenderPrio() {
  const opts = document.querySelectorAll('.kn-prio');
  const prios = ['alta', 'media', 'baixa'];
  const styles = {
    alta: 'background:rgba(224,92,92,.12);border:1px solid rgba(224,92,92,.4);color:#e05c5c',
    media: 'background:rgba(212,168,67,.12);border:1px solid rgba(212,168,67,.4);color:var(--gold)',
    baixa: 'background:rgba(82,183,136,.12);border:1px solid rgba(82,183,136,.4);color:#52b788'
  };
  opts.forEach((el, i) => {
    const p = prios[i];
    el.style.cssText = `flex:1;text-align:center;padding:6px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;transition:.15s;` +
      (p === knPrio ? styles[p] : 'background:transparent;border:1px solid var(--border2);color:var(--text3)');
  });
}

function saveKanbanCard() {
  const title = document.getElementById('kn-f-title').value.trim();
  if (!title) { document.getElementById('kn-f-title').focus(); return; }
  const card = {
    id: knEditId || knUid(),
    title,
    board: document.getElementById('kn-f-board').value,
    status: document.getElementById('kn-f-status').value,
    project: document.getElementById('kn-f-project').value,
    owner: document.getElementById('kn-f-owner').value,
    assignee: document.getElementById('kn-f-assignee')?.value || '',
    priority: knPrio,
    deadline: document.getElementById('kn-f-deadline').value,
    blocked_by: document.getElementById('kn-f-blocked').value,
    notes: document.getElementById('kn-f-notes').value,
  };
  if (knEditId) {
    const idx = knCards.findIndex(c => c.id === knEditId);
    if (idx !== -1) knCards[idx] = card;
  } else {
    knCards.push(card);
  }
  knSave();
  closeKanbanModal();
  renderKanban();
}

function knDeleteCard() {
  if (!knEditId) return;
  if (!confirm('Excluir esta tarefa?')) return;
  knCards = knCards.filter(c => c.id !== knEditId);
  knSave();
  closeKanbanModal();
  renderKanban();
}

function knMoveCard(dir) {
  if (!knEditId) return;
  const c = knCards.find(x => x.id === knEditId);
  if (!c) return;
  const colIds = KN_COLS.map(x => x.id);
  const idx = colIds.indexOf(c.status);
  if (dir === 'prev' && idx > 0) c.status = colIds[idx - 1];
  if (dir === 'next' && idx < colIds.length - 1) c.status = colIds[idx + 1];
  document.getElementById('kn-f-status').value = c.status;
  knToggleBlocked(c.status);
  knSave();
  renderKanban();
}

