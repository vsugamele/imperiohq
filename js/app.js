// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let currentProject = null;
let currentTab = 'briefing';
let currentAgent = null;

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
function init() {
  renderSidebar();
  renderOverviewProjects();
  updateMetrics();
  updateOverviewGreeting();
  initOverviewCanvas();
}

function updateMetrics() {
  const el = document.getElementById('metric-total-projetos');
  if (el) el.textContent = PROJECTS.length;
  const elSell = document.getElementById('metric-selling');
  if (elSell) elSell.textContent = PROJECTS.filter(p => p.vende).length;
}

function renderSidebar() {
  window.projects = PROJECTS; // sync global so OpenClaw Flow & other views can read
  const cats = {};
  const catIcons = { iGaming: '🎰', Lançamentos: '🚀', Infoprodutos: '📦', Nutraceuticos: '🌿', Ecommerce: '🛍️', Forex: '📈' };
  PROJECTS.forEach(p => {
    if (!cats[p.categoria]) cats[p.categoria] = [];
    cats[p.categoria].push(p);
  });
  const container = document.getElementById('sidebar-projects');
  let html = '';
  Object.entries(cats).forEach(([cat, projects]) => {
    html += `<div class="cat-header">${catIcons[cat] || '📁'} ${cat}</div>`;
    projects.forEach(p => {
      const badge = p.vende ? '<span class="badge sell">SELL</span>' : `<span class="badge">${p.status}</span>`;
      html += `<div class="nav-item" onclick="openProject('${p.id}')" id="nav-${p.id}">
        <span class="icon">${p.icon}</span>
        <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nome}</span>
        ${badge}
      </div>`;
    });
  });
  container.innerHTML = html;
}

function renderOverviewProjects() {
  const container = document.getElementById('overview-projects');
  let html = '';
  PROJECTS.forEach(p => {
    const pct = Math.round(Object.values(p.pipeline).reduce((a, b) => a + b, 0) / Object.values(p.pipeline).length);
    const statusClass = p.vende ? 'tag-sell' : (p.status === 'Rascunho' ? 'tag-draft' : 'tag-active');
    html += `<div class="project-row" onclick="openProject('${p.id}')">
      <span class="pr-icon">${p.icon}</span>
      <div class="pr-name">${p.nome}</div>
      <div style="width:80px; margin-right:10px">
        <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div style="font-size:10px; color:var(--text3); width:30px">${pct}%</div>
      <span class="pr-status tag ${statusClass}">${p.vende ? '● SELL' : p.status}</span>
    </div>`;
  });
  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════
function hideAllPanels() {
  // Esconde TODOS os painéis .panel no documento (dentro e fora do #main)
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = '';  // Limpa qualquer inline display
  });
  // Esconde painéis que ficam fora do #main (cron, skills, financas)
  ['view-cron', 'view-skills', 'view-financas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); el.style.display = ''; }
  });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

function showOverview() {
  hideAllPanels();
  document.getElementById('view-overview').classList.add('active');
  document.getElementById('nav-overview').classList.add('active');
  updateOverviewGreeting();
  initOverviewCanvas();
  updateOverviewMetrics();
  renderOverviewProjectCards();
}

// ── Overview: Greeting ──────────────────────────────────────
function updateOverviewGreeting() {
  const h = new Date().getHours();
  const g = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  const el = document.getElementById('ov-greeting');
  if (el) el.textContent = g;
}

// ── Overview: Real Metrics (Sprint 1.5) ────────────────────
function updateOverviewMetrics() {
  // Projetos totais e vendendo
  const total = (window.PROJECTS || []).length;
  const selling = (window.PROJECTS || []).filter(p => p.vende).length;
  const el1 = document.getElementById('metric-total-projetos');
  const el2 = document.getElementById('metric-selling');
  if (el1) el1.textContent = total || '—';
  if (el2) el2.textContent = selling || '—';

  // Tasks abertas (kanban)
  const tasksEl = document.getElementById('metric-tasks-abertas');
  if (tasksEl) {
    const open = (window.knCards || []).filter(c => c.status !== 'done').length;
    tasksEl.textContent = open || '0';
  }

  // Receita rastreada no tracker
  const revEl = document.getElementById('metric-receita');
  if (revEl) {
    const rev = typeof window._trRevenueTotal !== 'undefined' ? window._trRevenueTotal : 0;
    revEl.textContent = rev > 0 ? 'R$' + rev.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '—';
  }

  // Cliques total (tracker)
  const clicksEl = document.getElementById('metric-cliques');
  if (clicksEl) {
    const cl = typeof window._trClicksTotal !== 'undefined' ? window._trClicksTotal : 0;
    clicksEl.textContent = cl > 0 ? cl.toLocaleString('pt-BR') : '—';
  }
}

// ── Overview: Particle Canvas ───────────────────────────────
let _ovAnimFrame = null;

function initOverviewCanvas() {
  if (_ovAnimFrame) { cancelAnimationFrame(_ovAnimFrame); _ovAnimFrame = null; }
  const canvas = document.getElementById('overview-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  const N = 65;
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    a: Math.random() * 0.35 + 0.1
  }));

  function draw() {
    if (!document.getElementById('view-overview').classList.contains('active')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Radial glow centred behind the orb
    const cx = canvas.width / 2;
    const cy = Math.min(canvas.height * 0.37, 270);
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 230);
    grd.addColorStop(0, 'rgba(74,44,110,0.13)');
    grd.addColorStop(1, 'rgba(74,44,110,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Constellation lines between nearby particles
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.032 * (1 - d / 95)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Particles
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.a})`;
      ctx.fill();
    });

    _ovAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

// ── Overview: Toggle project list ───────────────────────────
function toggleOverviewProjects() {
  const el = document.getElementById('overview-projects');
  const icon = document.getElementById('ov-toggle-icon');
  if (!el) return;
  const collapsed = el.classList.toggle('ov-collapsed');
  if (icon) icon.textContent = collapsed ? '▸' : '▾';
}

// ── Overview: Project Cards with Cover (Sprint 2.6) ────────────
function renderOverviewProjectCards() {
  const container = document.getElementById('overview-projects');
  if (!container) return;
  const projects = (window.PROJECTS || []).filter(p => !p.parent_id); // apenas root

  if (!projects.length) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Nenhum projeto cadastrado</div>';
    return;
  }

  const covGrad = [
    'linear-gradient(135deg,#1a2a1a,#2d6a4f)',
    'linear-gradient(135deg,#1a1a2e,#4a2c6e)',
    'linear-gradient(135deg,#1e1000,#7a3d0a)',
    'linear-gradient(135deg,#0a1828,#1a4a6e)',
    'linear-gradient(135deg,#1a0a10,#6e1a2c)',
    'linear-gradient(135deg,#101020,#2a2a5e)',
  ];

  const cards = projects.map((p, i) => {
    const pct = Math.round(Object.values(p.pipeline || {}).reduce((a, b) => a + b, 0) / Math.max(Object.keys(p.pipeline || {}).length, 1));
    const grad = p.coverGrad || covGrad[i % covGrad.length];
    const statusColor = p.vende ? '#52b788' : '#888';
    const statusLabel = p.vende ? '● SELL' : p.status;
    const subCount = (window.PROJECTS || []).filter(sp => sp.parent_id === p.id).length;
    return `<div onclick="openProject('${p.id}')" style="
        cursor:pointer;border:1px solid var(--border);border-radius:12px;overflow:hidden;
        background:var(--surface);transition:.15s;flex-shrink:0;width:200px;
        " onmouseover="this.style.borderColor='rgba(201,168,76,.5)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--border)';this.style.transform=''">
      <div style="height:64px;background:${grad};display:flex;align-items:center;justify-content:center;position:relative">
        <span style="font-size:28px">${p.icon}</span>
        <span style="position:absolute;top:6px;right:8px;font-size:9px;color:${statusColor};font-weight:700">${statusLabel}</span>
      </div>
      <div style="padding:10px 12px">
        <div style="font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.nome}</div>
        <div style="font-size:10px;color:var(--text3);margin-top:1px">${p.categoria}${subCount ? ' · ' + subCount + ' sub' : ''}</div>
        <div style="margin-top:8px">
          <div style="height:3px;background:var(--surface2);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--gold);border-radius:2px"></div>
          </div>
          <div style="font-size:9px;color:var(--text3);margin-top:3px">${pct}% pipeline</div>
        </div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `<div style="display:flex;gap:12px;flex-wrap:wrap;padding:4px 0 8px">${cards}</div>`;
}

function showSection(s) {
  hideAllPanels();
  const el = document.getElementById('view-' + s);
  if (el) el.classList.add('active');
}

function openProject(id) {
  currentProject = PROJECTS.find(p => p.id === id);
  if (!currentProject) return;

  hideAllPanels();
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  document.getElementById('view-project').classList.add('active');

  renderProjectHero();
  showTab('briefing');
}

function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll('#proj-tabs .tab').forEach(t => t.classList.remove('active'));
  const tabs = document.querySelectorAll('#proj-tabs .tab');
  const tabMap = ['briefing', 'expert', 'avatar', 'branding', 'kpis', 'pipeline', 'assets', 'midia', 'docs'];
  const idx = tabMap.indexOf(tab);
  if (tabs[idx]) tabs[idx].classList.add('active');

  document.querySelectorAll('#content .panel').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('tab-' + tab);
  if (el) el.classList.add('active');

  if (tab === 'briefing') renderBriefing();
  if (tab === 'expert') renderExpert();
  if (tab === 'avatar') renderAvatar();
  if (tab === 'branding') renderBranding();
  if (tab === 'kpis') renderKPIs();
  if (tab === 'pipeline') renderPipeline();
  if (tab === 'assets') renderAssets();
  if (tab === 'midia') renderMidia();
  if (tab === 'docs') renderDocs();
}

// ═══════════════════════════════════════════════════════
//  RENDER PROJECT HERO
// ═══════════════════════════════════════════════════════
function renderProjectHero() {
  const p = currentProject;
  const pct = Math.round(Object.values(p.pipeline).reduce((a, b) => a + b, 0) / Object.values(p.pipeline).length);
  const container = document.getElementById('proj-hero-container');
  // Find subprojects
  const subprojects = PROJECTS.filter(sp => sp.parent_id === p.id);
  // Find parent if this is a subproject
  const parent = p.parent_id ? PROJECTS.find(x => x.id === p.parent_id) : null;
  const parentBreadcrumb = parent ? `<div style="font-size:10px;color:var(--text3);margin-bottom:2px;cursor:pointer" onclick="openProject('${parent.id}')">
        ← ${parent.icon} ${parent.nome}
      </div>` : '';
  const subprojectsHtml = subprojects.length > 0 ? `
      <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
        ${subprojects.map(sp => `<span onclick="openProject('${sp.id}')" style="cursor:pointer;font-size:10px;background:var(--surface2);border:1px solid var(--border);padding:3px 10px;border-radius:12px;color:var(--text2);transition:.15s" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">${sp.icon} ${sp.nome}</span>`).join('')}
        <span onclick="openCreateProject('${p.id}')" style="cursor:pointer;font-size:10px;background:transparent;border:1px dashed var(--border2);padding:3px 10px;border-radius:12px;color:var(--text3)">+ Sub</span>
      </div>` : '';
  container.innerHTML = `
    <div class="proj-hero" style="border-radius:0; border-left:none; border-right:none; border-top:none; margin-bottom:0">
      <div class="proj-icon">${p.icon}</div>
      <div class="proj-meta">
        ${parentBreadcrumb}
        <div style="display:flex;align-items:center;gap:8px">
          <div class="proj-name">${p.nome}</div>
          <button onclick="renameProject('${p.id}')" style="background:none;border:1px solid var(--border2);color:var(--text3);padding:2px 8px;border-radius:5px;cursor:pointer;font-size:10px" title="Renomear">✏️</button>
        </div>
        <div class="proj-sub">${p.produto} · ${p.preco}</div>
        <div class="proj-tags">
          <span class="tag tag-cat">${p.categoria}</span>
          ${p.parent_id ? '<span class="tag" style="background:rgba(155,127,232,.12);color:#9b7fe8;border-color:rgba(155,127,232,.3)">SUB</span>' : ''}
          ${p.vende ? '<span class="tag tag-sell">● VENDENDO</span>' : `<span class="tag tag-active">${p.status}</span>`}
        </div>
        ${subprojectsHtml}
      </div>
      <div class="proj-actions">
        <div style="text-align:right">
          <div style="font-size:22px; font-weight:700; color:var(--gold)">${pct}%</div>
          <div style="font-size:10px; color:var(--text3)">Pipeline</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-gold" onclick="showTab('pipeline')">Ver Pipeline</button>
          <button id="hero-save-btn" class="btn btn-sm btn-outline" onclick="saveProjectData()" style="border-color:var(--gold);color:var(--gold)" title="Salvar projeto">💾 Salvar</button>
          ${!p.parent_id ? `<button class="btn btn-sm btn-outline" onclick="openCreateProject('${p.id}')">+ Sub</button>` : ''}
          ${p._custom ? `<button class="btn btn-sm btn-outline" onclick="openDeleteProject()" style="border-color:#e05c5c44;color:#e05c5c88;font-size:13px" title="Deletar projeto">🗑️</button>` : ''}
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════
//  BRIEFING TAB — N PRODUCTS × N FUNNELS
// ═══════════════════════════════════════════════════════
function renderBriefing() {
  const p = currentProject;

  // Auto-migrate legacy single-product projects
  if (!p.produtos) {
    p.produtos = [{
      id: 'prod-' + Date.now(),
      nome: p.produto || 'Produto Principal',
      preco: p.preco || '',
      tipo: 'Digital',
      status: p.status || 'Ativo',
      objetivo: p.objetivo || '',
      contexto: p.contexto || '',
      mecanismo: p.mecanismo || '',
      funis: []
    }];
  }

  const el = document.getElementById('tab-briefing');

  // Migrar p.links (objeto) para p.linksArr (array) se necessário
  if (!p.linksArr) {
    p.linksArr = Object.entries(p.links || {}).map(([tipo, url]) => ({ tipo, url }));
    if (p.linksArr.length === 0) p.linksArr = [{ tipo: '', url: '' }];
  }
  const linksHtml = `
    <div id="project-links-list">
      ${p.linksArr.map((lk, li) => `
      <div class="link-row" style="display:flex;gap:6px;margin-bottom:6px;align-items:center">
        <input class="brief-input link-type" value="${lk.tipo || ''}" placeholder="Tipo (ex: site)" style="flex:0 0 120px" onblur="saveProjectLink(${li},'tipo',this.value)">
        <input class="brief-input link-url" value="${lk.url || ''}" placeholder="https://" style="flex:1" onblur="saveProjectLink(${li},'url',this.value)">
        <button onclick="removeProjectLink(${li})" style="background:none;border:1px solid #e05c5c33;color:#e05c5c;border-radius:5px;padding:2px 8px;font-size:12px;cursor:pointer;flex-shrink:0">✕</button>
      </div>`).join('')}
    </div>
    <button onclick="addProjectLink()" class="btn btn-sm btn-outline" style="margin-top:4px;width:100%">+ Adicionar Link</button>`;

  const produtosHtml = p.produtos.map((prod, pi) => {
    const tipoOpts = ['Digital', 'Físico', 'Serviço', 'Mentoria', 'Software', 'Evento'].map(t =>
      `<option ${prod.tipo === t ? 'selected' : ''}>${t}</option>`).join('');
    const statusOpts = ['Ativo', 'Em Construção', 'Rascunho', 'Pausado', 'Descontinuado'].map(s =>
      `<option ${prod.status === s ? 'selected' : ''}>${s}</option>`).join('');
    const funisHtml = (prod.funis || []).map((f, fi) => `
          <div class="funil-row" style="display:flex;gap:8px;align-items:center;padding:8px;background:var(--surface2);border-radius:6px;margin-bottom:6px">
            <span style="font-size:14px">🔻</span>
            <input class="brief-input" style="flex:2" value="${f.nome}" placeholder="Nome do Funil" onblur="saveFunil(${pi},${fi},'nome',this.value)">
            <select class="brief-input" style="flex:1" onchange="saveFunil(${pi},${fi},'tipo',this.value)">
              ${['Perpétuo', 'Lançamento', 'VSL', 'Webinar', 'Email', 'Outro'].map(t => `<option ${f.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
            <input class="brief-input" style="flex:2" value="${f.url || ''}" placeholder="URL do funil" onblur="saveFunil(${pi},${fi},'url',this.value)">
            <select class="brief-input" style="flex:1" onchange="saveFunil(${pi},${fi},'status',this.value)">
              ${['Ativo', 'Em Construção', 'Rascunho', 'Pausado'].map(s => `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <button onclick="removeFunil(${pi},${fi})" style="background:none;border:1px solid #e05c5c22;color:#e05c5c;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:12px">✕</button>
          </div>`).join('');

    return `<div class="card" style="margin-bottom:12px;border-left:3px solid var(--gold)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:18px">📦</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:var(--text)">${prod.nome || 'Produto ' + (pi + 1)}</div>
                <div style="font-size:11px;color:var(--gold)">${prod.preco ? prod.preco : 'Preço não definido'} · ${prod.tipo}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="toggleProdCard(${pi})" class="btn btn-sm btn-outline" id="prod-toggle-${pi}">▾ Detalhes</button>
              <button onclick="removeProduto(${pi})" class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c">✕</button>
            </div>
          </div>
          <div id="prod-card-${pi}">
            <div class="grid2" style="margin-bottom:10px">
              <div class="brief-field"><div class="brief-label">Nome do Produto</div><input class="brief-input" value="${prod.nome || ''}" onblur="saveProduto(${pi},'nome',this.value)"></div>
              <div class="brief-field"><div class="brief-label">Tipo</div><select class="brief-input" onchange="saveProduto(${pi},'tipo',this.value)">${tipoOpts}</select></div>
              <div class="brief-field"><div class="brief-label">Preço</div><input class="brief-input" value="${prod.preco || ''}" placeholder="R$997" onblur="saveProduto(${pi},'preco',this.value)"></div>
              <div class="brief-field"><div class="brief-label">Status</div><select class="brief-input" onchange="saveProduto(${pi},'status',this.value)">${statusOpts}</select></div>
            </div>
            <div class="brief-field"><div class="brief-label">Objetivo Principal</div><textarea class="brief-input" rows="2" onblur="saveProduto(${pi},'objetivo',this.value)">${prod.objetivo || ''}</textarea></div>
            <div class="brief-field"><div class="brief-label">Contexto Atual / Situação</div><textarea class="brief-input" rows="2" onblur="saveProduto(${pi},'contexto',this.value)">${prod.contexto || ''}</textarea></div>
            <div class="brief-field"><div class="brief-label">Mecanismo Único</div><input class="brief-input" value="${prod.mecanismo || ''}" placeholder="O que torna este produto único..." onblur="saveProduto(${pi},'mecanismo',this.value)"></div>
            <!-- FUNIS -->
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <div style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;text-transform:uppercase">🔻 Funis do Produto (${(prod.funis || []).length})</div>
                <button onclick="addFunil(${pi})" class="btn btn-sm btn-outline">+ Funil</button>
              </div>
              ${funisHtml || '<div style="font-size:11px;color:var(--text3);padding:8px 0">Nenhum funil. Clique em "+ Funil" para adicionar.</div>'}
            </div>
          </div>
        </div>`;
  }).join('');

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">📁 Briefing: ${p.nome}</div>
      <div style="display:flex;gap:8px">
        <button onclick="showTab('expert')" class="btn btn-sm btn-outline">🎤 Ir para Expert</button>
        <button onclick="showTab('avatar')" class="btn btn-sm btn-outline">→ Ir para Avatar</button>
      </div>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-title">📁 Dados do Projeto</div>
          <div class="brief-field"><div class="brief-label">Nome do Projeto</div><input class="brief-input" value="${p.nome}" onblur="currentProject.nome=this.value;renderProjectHero()"></div>
          <div class="brief-field"><div class="brief-label">Categoria</div><input class="brief-input" value="${p.categoria || ''}" onblur="currentProject.categoria=this.value"></div>
          <div class="brief-field"><div class="brief-label">Orçamento Tráfego</div><input class="brief-input" value="${p.orcamento_trafego || ''}" onblur="currentProject.orcamento_trafego=this.value"></div>
          <div class="brief-field"><div class="brief-label">Status Geral</div>
            <select class="brief-input" onchange="currentProject.status=this.value">
              <option ${p.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
              <option ${p.status === 'Rascunho' ? 'selected' : ''}>Rascunho</option>
              <option ${p.status === 'Pausado' ? 'selected' : ''}>Pausado</option>
              <option ${p.status === 'Em Construção' ? 'selected' : ''}>Em Construção</option>
            </select>
          </div>
        </div>
        <div class="card">
          <div class="card-title">🔗 Links do Projeto</div>
          ${linksHtml}
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-title">⚙️ Pipeline Rápido</div>
          ${Object.entries(p.pipeline).map(([dept, pct]) => {
    const deptNames = { avatar: 'Avatar', funil: 'Funil', copy: 'Copy', prompts: 'Prompts', design: 'Design', trafego: 'Tráfego' };
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:11px;color:var(--text2);width:60px">${deptNames[dept] || dept}</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
              <span style="font-size:10px;color:var(--text3);width:28px;text-align:right">${pct}%</span>
            </div>`;
  }).join('')}
        </div>
      </div>
    </div>

    <!-- ANÁLISE DE CONCORRENTES -->
    ${renderConcorrentesSection(p)}

    <!-- PRODUTOS -->
    <div style="margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:13px;font-weight:700;color:var(--text)">📦 Produtos do Projeto <span style="color:var(--text3);font-size:11px;font-weight:400">(${p.produtos.length} produto${p.produtos.length !== 1 ? 's' : ''})</span></div>
      <button onclick="addProduto()" class="btn btn-gold">+ Novo Produto</button>
    </div>
    ${produtosHtml}`;
}

function saveProduto(pi, key, val) {
  if (!currentProject.produtos[pi]) return;
  currentProject.produtos[pi][key] = val;
  // update hero if name/price changed
  if (key === 'nome' || key === 'preco') renderProjectHero();
}

function addProduto() {
  if (!currentProject.produtos) currentProject.produtos = [];
  currentProject.produtos.push({ id: 'prod-' + Date.now(), nome: 'Novo Produto', preco: '', tipo: 'Digital', status: 'Rascunho', objetivo: '', contexto: '', mecanismo: '', funis: [] });
  renderBriefing();
}

function removeProduto(pi) {
  if (!confirm('Remover este produto e seus funis?')) return;
  currentProject.produtos.splice(pi, 1);
  renderBriefing();
}

function toggleProdCard(pi) {
  const el = document.getElementById('prod-card-' + pi);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? '' : 'none';
  const btn = document.getElementById('prod-toggle-' + pi);
  if (btn) btn.textContent = el.style.display === 'none' ? '▸ Detalhes' : '▾ Detalhes';
}

function addFunil(pi) {
  if (!currentProject.produtos[pi].funis) currentProject.produtos[pi].funis = [];
  currentProject.produtos[pi].funis.push({ nome: 'Novo Funil', tipo: 'Perpétuo', url: '', status: 'Rascunho' });
  renderBriefing();
}

function saveFunil(pi, fi, key, val) {
  if (currentProject.produtos[pi] && currentProject.produtos[pi].funis[fi])
    currentProject.produtos[pi].funis[fi][key] = val;
}

function removeFunil(pi, fi) {
  currentProject.produtos[pi].funis.splice(fi, 1);
  renderBriefing();
}

// ═══════════════════════════════════════════════════════
//  AVATAR TAB
// ═══════════════════════════════════════════════════════
function renderAvatar() {
  const av = currentProject.avatar;
  const el = document.getElementById('tab-avatar');

  const makeField = (label, value, multiline = false) => {
    if (multiline) {
      return `<div class="brief-field">
        <div class="brief-label">${label}</div>
        <textarea class="brief-input" rows="2">${value || ''}</textarea>
      </div>`;
    }
    return `<div class="field-row">
      <div class="field-label">${label}</div>
      <div class="field-val editable" contenteditable="true" data-placeholder="Não definido">${value || ''}</div>
    </div>`;
  };

  const makeTagList = (label, items) => `
    <div style="margin-bottom:10px">
      <div class="brief-label">${label}</div>
      <div class="tag-list" style="margin-top:4px">
        ${(items || []).map(i => `<span class="tag-item">${i}</span>`).join('')}
        <span class="tag-item" style="cursor:pointer; color:var(--text3); border-style:dashed">+ add</span>
      </div>
    </div>`;

  const subAvatarsHtml = (av.sub_avatares || []).length > 0
    ? `<div class="grid3" style="margin-top:8px">
        ${av.sub_avatares.map((sa, i) => `
          <div class="sub-avatar-card">
            <div class="sub-avatar-name">${sa.nome}</div>
            <div class="sub-avatar-desc">${sa.desc}</div>
            <div class="score-bar">
              <span class="score-label">Urgência</span>
              <div class="score-dots">${Array.from({ length: 10 }, (_, j) => `<div class="score-dot${j < sa.urgencia ? ' fill' : ''}"></div>`).join('')}</div>
              <span style="font-size:10px;color:var(--gold);margin-left:4px">${sa.urgencia}/10</span>
            </div>
            <div class="score-bar">
              <span class="score-label">Dinheiro</span>
              <div class="score-dots">${Array.from({ length: 10 }, (_, j) => `<div class="score-dot${j < sa.dinheiro ? ' fill' : ''}"></div>`).join('')}</div>
              <span style="font-size:10px;color:var(--gold);margin-left:4px">${sa.dinheiro}/10</span>
            </div>
          </div>`).join('')}
        <div class="sub-avatar-card" style="display:flex;align-items:center;justify-content:center;border-style:dashed;cursor:pointer;color:var(--text3)">
          + Novo Sub-Avatar
        </div>
      </div>`
    : `<div class="empty-state" style="padding:20px">
        <div class="es-icon">👤</div>
        <div class="es-text">Nenhum sub-avatar mapeado</div>
        <div class="es-sub">Execute o Sub-Avatar Mapper</div>
        <button class="btn btn-sm btn-purple" style="margin-top:8px" onclick="openAgent('avatar','sub_avatar_mapper')">▶ Executar Agente</button>
      </div>`;

  const storyboardHtml = (av.storyboard || []).length > 0
    ? av.storyboard.map(s => `<div class="story-card"><div class="story-arc">${s.arc}</div><div class="story-text">${s.text}</div></div>`).join('')
    : `<div class="empty-state" style="padding:20px">
        <div class="es-icon">📖</div>
        <div class="es-text">Storyboard não criado</div>
        <button class="btn btn-sm btn-purple" style="margin-top:8px" onclick="openAgent('avatar','storyboard_creator')">▶ Criar Storyboard</button>
      </div>`;

  el.innerHTML = `
    <!-- HEADER COM AÇÕES -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <div style="font-size:14px; font-weight:600; color:var(--text)">🧠 Avatar: ${currentProject.nome}</div>
      <div style="display:flex; gap:6px">
        <button class="btn btn-sm btn-outline" onclick="openAgent('avatar','market_researcher')">🔍 Pesquisador</button>
        <button class="btn btn-sm btn-purple" onclick="openAgent('avatar','avatar_architect')">🏗️ Avatar Arquiteto</button>
      </div>
    </div>

    <!-- DESEJOS E PSICOLOGIA -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">💫 Desejos & Motivação</div>
      <div class="grid2">
        <div>
          <div class="brief-label" style="margin-bottom:6px">Desejo Externo <span style="color:var(--text3)">(o que diz que quer)</span></div>
          <textarea class="brief-input" rows="2">${av.externo || ''}</textarea>
        </div>
        <div>
          <div class="brief-label" style="margin-bottom:6px">Desejo Interno <span style="color:var(--gold)">★ CORE</span> <span style="color:var(--text3)">(o que realmente quer)</span></div>
          <textarea class="brief-input" rows="2" style="border-color:rgba(201,168,76,.3)">${av.interno || ''}</textarea>
        </div>
      </div>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <!-- DORES -->
      <div class="card">
        <div class="card-title">💔 Dores & Medos</div>
        ${makeTagList('Dores Superficiais (conscientes)', av.dores_superficiais)}
        ${makeTagList('Dores Profundas (emocionais)', av.dores_profundas)}
        ${makeTagList('Medos Específicos', av.medos)}
        ${makeTagList('Objeções Reais', av.objecoes)}
      </div>

      <!-- POSICIONAMENTO -->
      <div class="card">
        <div class="card-title">⚔️ Posicionamento Psicológico</div>
        ${makeField('Inimigo', av.inimigo)}
        ${makeField('Resultado Sonhado', av.resultado_sonhado)}
        ${makeField('Trigger Event', av.trigger_event)}
        ${makeField('Fase de Consciência', av.fase_consciencia)}
      </div>
    </div>

    <!-- SUB-AVATARES -->
    <div class="card" style="margin-bottom:12px">
      <div class="section-header">
        <div class="card-title" style="margin-bottom:0">👥 Sub-Avatares</div>
        <button class="btn btn-sm btn-outline" onclick="openAgent('avatar','sub_avatar_mapper')">🗂️ Sub-Avatar Mapper</button>
      </div>
      ${subAvatarsHtml}
    </div>

    <!-- STORYBOARD -->
    <div class="card" style="margin-bottom:12px">
      <div class="section-header">
        <div class="card-title" style="margin-bottom:0">📖 Storyboard Narrativo</div>
        <button class="btn btn-sm btn-outline" onclick="openAgent('avatar','storyboard_creator')">📖 Criar Storyboard</button>
      </div>
      <div style="margin-top:8px">${storyboardHtml}</div>
    </div>

    <!-- ESCAVADOR DE DESEJOS -->
    ${renderEscavadorCard(av.escavador_desejos)}`;
}

function renderEscavadorCard(esc) {
  if (!esc || !esc.gerado_em) {
    return `<div class="card" style="border-color:rgba(155,127,232,.25);background:rgba(155,127,232,.04)">
          <div class="section-header" style="margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="card-title" style="margin-bottom:0;color:#9b7fe8">🧬 Escavador de Desejos</div>
              <span style="font-size:10px;background:rgba(155,127,232,.15);color:#9b7fe8;padding:2px 8px;border-radius:10px;border:1px solid rgba(155,127,232,.3)">Não gerado</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:14px;background:rgba(155,127,232,.06);border-radius:8px;border:1px dashed rgba(155,127,232,.2)">
            <div style="font-size:28px;flex-shrink:0">🧬</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px">Análise Psicológica Profunda do Avatar</div>
              <div style="font-size:11px;color:var(--text3);line-height:1.5">10 desejos externos · 10 desejos internos · 5 proibidos · gatilhos emocionais · palavras-chave · estratégias de ativação</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-sm" onclick="openEscavadorImport()" style="background:rgba(155,127,232,.15);color:#9b7fe8;border:1px solid rgba(155,127,232,.3);flex:1">🧬 Importar Análise</button>
          </div>
        </div>`;
  }
  // Gerado — mostrar preview top 3
  const ext = (esc.desejos_externos || [])[0];
  const int_ = (esc.desejos_internos || [])[0];
  const proi = (esc.desejos_proibidos || [])[0];
  const dataFmt = new Date(esc.gerado_em).toLocaleDateString('pt-BR');

  function desejoBar(d, cor) {
    if (!d) return '';
    var pct = Math.round((d.pontuacao_total || 0) / 80 * 100);
    return `<div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
            <div style="font-size:11px;font-weight:600;color:var(--text);max-width:85%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${d.nome || ''}</div>
            <div style="font-size:11px;color:${cor};font-weight:700;flex-shrink:0">${d.pontuacao_total || 0}/80</div>
          </div>
          <div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${cor};border-radius:2px;transition:.3s"></div>
          </div>
        </div>`;
  }
  return `<div class="card" style="border-color:rgba(155,127,232,.35)">
        <div class="section-header" style="margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:8px">
            <div class="card-title" style="margin-bottom:0;color:#9b7fe8">🧬 Escavador de Desejos</div>
            <span style="font-size:10px;background:rgba(82,183,136,.12);color:var(--green-bright);padding:2px 8px;border-radius:10px;border:1px solid rgba(82,183,136,.25)">Gerado ${dataFmt}</span>
          </div>
        </div>
        <div style="margin-bottom:8px">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Top Desejos</div>
          ${desejoBar(ext, 'var(--gold)')}
          ${desejoBar(int_, '#9b7fe8')}
          ${proi ? desejoBar(proi, '#e05c5c') : ''}
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-sm btn-outline" onclick="openEscavadorModal()" style="border-color:rgba(155,127,232,.4);color:#9b7fe8;flex:1">📋 Ver Análise Completa</button>
          <button class="btn btn-sm btn-outline" onclick="openEscavadorImport()" style="font-size:11px">↻ Atualizar</button>
        </div>
      </div>`;
}

// ═══════════════════════════════════════════════════════
//  PIPELINE TAB
// ═══════════════════════════════════════════════════════
function renderPipeline() {
  const p = currentProject;
  const el = document.getElementById('tab-pipeline');
  let html = '<div style="margin-bottom:16px; display:flex; align-items:center; justify-content:space-between"><div style="font-size:14px; font-weight:600; color:var(--text)">🏢 Pipeline de Execução</div></div>';

  DEPARTMENTS.forEach(dept => {
    const pct = p.pipeline[dept.id] || 0;
    const agentsHtml = dept.agents.map(ag => {
      const doneThreshold = pct > 60;
      const chipClass = doneThreshold ? 'done' : '';
      return `<div class="agent-chip ${chipClass}" onclick="openAgent('${dept.id}','${ag.id}')">
        <span>${ag.icon}</span>
        <div class="dot"></div>
        <span>${ag.nome}</span>
      </div>`;
    }).join('');

    html += `<div class="dept-card">
      <div class="dept-header">
        <div class="dept-icon">${dept.icon}</div>
        <div class="dept-info">
          <div class="dept-name">${dept.nome}</div>
          <div class="dept-desc">${dept.desc}</div>
        </div>
        <div class="dept-status">
          <div class="dept-pct">${pct}%</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <button class="btn btn-sm btn-gold" onclick="openDept('${dept.id}')">Abrir</button>
        </div>
      </div>
      <div class="dept-agents">${agentsHtml}</div>
    </div>`;
  });

  el.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  ASSETS TAB
// ═══════════════════════════════════════════════════════
function renderAssets() {
  const p = currentProject;
  const el = document.getElementById('tab-assets');
  if (!p.assets) p.assets = [];

  let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:14px;font-weight:700;color:var(--text)">📦 Assets: ${p.nome}</div>
        <button class="btn btn-gold" onclick="openNewAssetModal()">+ Novo Asset</button>
      </div>`;

  if (!p.assets.length) {
    html += `<div class="empty-state">
          <div class="es-icon">📦</div>
          <div class="es-text">Nenhum asset cadastrado</div>
          <div class="es-sub">Adicione assets manualmente ou execute os agentes no Pipeline</div>
          <button class="btn btn-outline" style="margin-top:12px" onclick="showTab('pipeline')">→ Ir para Pipeline</button>
        </div>`;
  } else {
    html += '<div style="display:flex;flex-direction:column;gap:8px">';
    p.assets.forEach((a, i) => {
      const statusColor = a.status === 'Aprovado' ? 'var(--green-bright)' : a.status === 'Rodando' ? 'var(--gold)' : 'var(--text3)';
      const relDoc = (DOCS || []).find(d => d.project === p.nome && (d.title || '').trim().toLowerCase() === (a.nome || '').trim().toLowerCase());
      html += `<div class="asset-card">
            <div class="asset-icon">${a.icon || '📄'}</div>
            <div class="asset-info">
              <div class="asset-name">${a.nome}</div>
              <div class="asset-meta">${a.tipo || 'Asset'} · ${a.data || 'Hoje'}</div>
              ${a.url ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">${a.url}</div>` : ''}
            </div>
            <div class="asset-actions">
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;color:${statusColor};border:1px solid ${statusColor}">${a.status}</span>
              ${a.url ? `<a href="${a.url}" target="_blank" class="btn btn-sm btn-outline" style="margin-left:4px;text-decoration:none">Abrir</a>` : ''}
              ${!a.url && relDoc ? `<button class="btn btn-sm btn-outline" style="margin-left:4px" onclick="openDocModal(null,'${relDoc.id}')">Abrir Doc</button>` : ''}
              <button class="btn btn-sm btn-outline" style="margin-left:4px" onclick="openNewAssetModal(${i})">✏️</button>
              <button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c;margin-left:4px" onclick="removeAsset(${i})">✕</button>
            </div>
          </div>`;
    });
    html += '</div>';
  }
  el.innerHTML = html;
}

function removeAsset(i) {
  if (!confirm('Remover este asset?')) return;
  currentProject.assets.splice(i, 1);
  renderAssets();
}

let _editAssetIdx = -1;
function openNewAssetModal(idx) {
  _editAssetIdx = (idx !== undefined && idx !== null) ? idx : -1;
  const m = document.getElementById('new-asset-modal');
  const title = document.getElementById('na-modal-title');
  if (_editAssetIdx >= 0 && currentProject.assets && currentProject.assets[_editAssetIdx]) {
    const a = currentProject.assets[_editAssetIdx];
    document.getElementById('na-nome').value = a.nome || '';
    document.getElementById('na-url').value = a.url || '';
    const tipoSel = document.getElementById('na-tipo');
    const tipoVal = ['Copy', 'Criativo', 'Página', 'Email', 'Vídeo', 'Script', 'Outro'].includes(a.tipo) ? a.tipo : 'Outro';
    tipoSel.value = tipoVal;
    const statusSel = document.getElementById('na-status');
    const statusVal = ['Rascunho', 'Em Revisão', 'Aprovado', 'Rodando'].includes(a.status) ? a.status : 'Rascunho';
    statusSel.value = statusVal;
    if (title) title.textContent = '✏️ Editar Asset';
  } else {
    document.getElementById('na-nome').value = '';
    document.getElementById('na-url').value = '';
    document.getElementById('na-tipo').value = 'Copy';
    document.getElementById('na-status').value = 'Rascunho';
    if (title) title.textContent = '📦 Novo Asset';
  }
  m.style.opacity = '1'; m.style.pointerEvents = 'all';
}
function closeNewAssetModal() {
  const m = document.getElementById('new-asset-modal');
  m.style.opacity = '0'; m.style.pointerEvents = 'none';
}
function saveNewAsset() {
  const nome = document.getElementById('na-nome').value.trim();
  if (!nome) { alert('Nome obrigatório'); return; }
  if (!currentProject.assets) currentProject.assets = [];
  const icons = { 'Copy': '✍️', 'Criativo': '🎨', 'Página': '📄', 'Email': '📧', 'Vídeo': '🎬', 'Script': '📝', 'Outro': '📦' };
  const tipo = document.getElementById('na-tipo').value;
  const assetData = {
    icon: icons[tipo] || '📦',
    nome, tipo,
    url: document.getElementById('na-url').value.trim(),
    status: document.getElementById('na-status').value,
    data: new Date().toLocaleDateString('pt-BR'),
    agente: 'Manual'
  };
  if (_editAssetIdx >= 0 && currentProject.assets[_editAssetIdx]) {
    Object.assign(currentProject.assets[_editAssetIdx], assetData);
  } else {
    currentProject.assets.push(assetData);
  }
  closeNewAssetModal();
  document.getElementById('na-nome').value = '';
  document.getElementById('na-url').value = '';
  renderAssets();
}

// ═══════════════════════════════════════════════════════
//  AGENT MODAL
// ═══════════════════════════════════════════════════════
function openAgent(deptId, agentId) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  if (!dept) return;
  const agent = dept.agents.find(a => a.id === agentId);
  if (!agent) return;
  currentAgent = agent;

  document.getElementById('modal-agent-icon').textContent = agent.icon;
  document.getElementById('modal-agent-name').textContent = agent.nome;
  document.getElementById('modal-agent-role').textContent = agent.role + (agent.clone ? ` · Clone: ${agent.clone}` : '');
  document.getElementById('modal-agent-desc').textContent = agent.desc;

  document.getElementById('modal-inputs').innerHTML = (agent.inputs || []).map(i => `<div class="io-item">${i}</div>`).join('');
  document.getElementById('modal-outputs').innerHTML = (agent.outputs || []).map(o => `<div class="io-item">${o}</div>`).join('');
  document.getElementById('modal-prompt').textContent = buildPrompt(agent);

  // Reset response
  document.getElementById('response-container').style.display = 'none';
  document.getElementById('response-area').textContent = '';
  document.getElementById('response-area').className = 'response-area';

  // Set exec mode UI
  setExecMode(currentExecMode);

  document.getElementById('agent-modal').classList.add('open');
}

function buildPrompt(agent) {
  const p = currentProject;
  if (!agent.prompt) return 'Prompt não definido.';
  let prompt = agent.prompt;
  if (p) {
    prompt = prompt
      .replace(/\{projeto\}/g, p.nome)
      .replace(/\{produto\}/g, p.produto)
      .replace(/\{preco\}/g, p.preco)
      .replace(/\{nicho\}/g, p.categoria)
      .replace(/\{avatar_resumo\}/g, `Externo: ${p.avatar.externo}. Interno: ${p.avatar.interno}`)
      .replace(/\{resultado_sonhado\}/g, p.avatar.resultado_sonhado || '')
      .replace(/\{inimigo\}/g, p.avatar.inimigo || '')
      .replace(/\{dores\}/g, (p.avatar.dores_superficiais || []).concat(p.avatar.dores_profundas || []).join(', '));
  }
  return prompt;
}

function openDept(deptId) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  if (!dept) return;
  openAgent(deptId, dept.agents[0].id);
}

function closeModal() {
  document.getElementById('agent-modal').classList.remove('open');
}

function copyPrompt() {
  const text = document.getElementById('modal-prompt').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy-prompt');
    btn.textContent = '✓ Copiado!';
    setTimeout(() => btn.textContent = '📋 Copiar Prompt', 1500);
  });
}

function copyResponse() {
  const text = document.getElementById('response-area').textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Resposta copiada!');
  });
}

// ═══════════════════════════════════════════════════════
//  EXECUTION MODES
// ═══════════════════════════════════════════════════════
let currentExecMode = 'openrouter';

function setExecMode(mode) {
  currentExecMode = mode;
  document.querySelectorAll('.exec-mode').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('mode-' + mode);
  if (el) el.classList.add('active');

  const config = document.getElementById('mode-config');
  const key = localStorage.getItem('openrouter_key');
  const clawUrl = localStorage.getItem('openclaw_url');

  if (mode === 'openrouter') {
    config.innerHTML = `<div style="font-size:11px; color:${key ? 'var(--green-bright)' : 'var(--gold)'}; margin-top:6px; padding:6px 10px; background:var(--surface2); border-radius:6px; display:flex; align-items:center; justify-content:space-between">
      <span>${key ? '✓ API Key configurada' : '⚠ Sem API Key — configure em ⚙ API'}</span>
      ${!key ? '<button onclick="openSettings()" style="font-size:10px; padding:2px 8px; background:var(--gold-dim); border:1px solid var(--gold); color:var(--gold); border-radius:4px; cursor:pointer">Configurar</button>' : ''}
    </div>`;
    document.getElementById('btn-run').textContent = '⚡ Executar via OpenRouter';
  } else if (mode === 'claudecode') {
    config.innerHTML = `<div style="font-size:11px; color:var(--blue-bright); margin-top:6px; padding:6px 10px; background:var(--surface2); border-radius:6px">
      💻 Copia o prompt e executa no terminal: <code style="color:var(--gold)">claude "$(cat prompt.txt)"</code>
    </div>`;
    document.getElementById('btn-run').textContent = '💻 Copiar para Claude Code';
  } else if (mode === 'openclaw') {
    config.innerHTML = `<div style="font-size:11px; color:${clawUrl ? 'var(--purple-bright)' : 'var(--gold)'}; margin-top:6px; padding:6px 10px; background:var(--surface2); border-radius:6px; display:flex; align-items:center; justify-content:space-between">
      <span>${clawUrl ? '✓ Webhook configurado' : '⚠ Configure o webhook URL em ⚙ API'}</span>
      ${!clawUrl ? '<button onclick="openSettings()" style="font-size:10px; padding:2px 8px; background:var(--gold-dim); border:1px solid var(--gold); color:var(--gold); border-radius:4px; cursor:pointer">Configurar</button>' : ''}
    </div>`;
    document.getElementById('btn-run').textContent = '🕷️ Enviar ao OpenClaw';
  }
}

async function runAgent() {
  if (!currentAgent) return;

  if (currentExecMode === 'claudecode') {
    copyPrompt();
    const btn = document.getElementById('btn-run');
    btn.textContent = '✓ Prompt copiado! Cole no Claude Code';
    setTimeout(() => btn.textContent = '💻 Copiar para Claude Code', 2000);
    return;
  }

  if (currentExecMode === 'openclaw') {
    const clawUrl = localStorage.getItem('openclaw_url');
    if (!clawUrl) { openSettings(); return; }
    const prompt = buildPrompt(currentAgent);
    try {
      const btn = document.getElementById('btn-run');
      btn.textContent = '⏳ Enviando...';
      btn.disabled = true;
      await fetch(clawUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: currentAgent.nome, project: currentProject?.nome, prompt, task: currentAgent.role })
      });
      btn.textContent = '✓ Enviado ao OpenClaw!';
      setTimeout(() => { btn.textContent = '🕷️ Enviar ao OpenClaw'; btn.disabled = false; }, 2000);
    } catch (e) {
      alert('Erro ao enviar ao OpenClaw: ' + e.message);
      document.getElementById('btn-run').textContent = '🕷️ Enviar ao OpenClaw';
      document.getElementById('btn-run').disabled = false;
    }
    return;
  }

  // OpenRouter execution
  const apiKey = localStorage.getItem('openrouter_key');
  if (!apiKey) { openSettings(); return; }

  const model = localStorage.getItem('openrouter_model') || 'anthropic/claude-sonnet-4-5';
  const prompt = buildPrompt(currentAgent);

  const btn = document.getElementById('btn-run');
  btn.textContent = '⏳ Executando...';
  btn.disabled = true;

  const responseContainer = document.getElementById('response-container');
  const responseArea = document.getElementById('response-area');
  responseContainer.style.display = 'block';
  responseArea.className = 'response-area loading';
  responseArea.innerHTML = '<span class="loading-dot">●</span> Processando com ' + model + '...';

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://imperio-hq.local',
        'X-Title': 'Império HQ'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Erro ' + res.status);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || 'Sem resposta';

    responseArea.className = 'response-area success';
    responseArea.textContent = text;

    btn.textContent = '✓ Executado';
    setTimeout(() => { btn.textContent = '⚡ Executar via OpenRouter'; btn.disabled = false; }, 2000);

  } catch (e) {
    responseArea.className = 'response-area error';
    responseArea.textContent = '❌ Erro: ' + e.message;
    btn.textContent = '⚡ Tentar Novamente';
    btn.disabled = false;
  }
}

// ═══════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════
function openSettings() {
  document.getElementById('input-or-key').value = localStorage.getItem('openrouter_key') || '';
  document.getElementById('input-or-model').value = localStorage.getItem('openrouter_model') || 'anthropic/claude-sonnet-4-5';
  document.getElementById('input-replicate-key').value = localStorage.getItem('tool_replicate_key') || '';
  document.getElementById('input-google-key').value = localStorage.getItem('tool_gemini_key') || '';
  document.getElementById('input-claw-url').value = localStorage.getItem('openclaw_url') || '';
  document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
}

function saveSettings() {
  const key = document.getElementById('input-or-key').value.trim();
  const model = document.getElementById('input-or-model').value;
  const replicateKey = document.getElementById('input-replicate-key').value.trim();
  const googleKey = document.getElementById('input-google-key').value.trim();
  const claw = document.getElementById('input-claw-url').value.trim();
  if (key) localStorage.setItem('openrouter_key', key);
  localStorage.setItem('openrouter_model', model);
  if (replicateKey) { localStorage.setItem('tool_replicate_key', replicateKey); }
  if (googleKey) { localStorage.setItem('tool_gemini_key', googleKey); }
  if (claw) localStorage.setItem('openclaw_url', claw);

  // Update header pill
  const pill = document.getElementById('api-status-pill');
  if (key) {
    pill.style.background = 'rgba(82,183,136,.15)';
    pill.style.color = 'var(--green-bright)';
    pill.style.borderColor = 'rgba(82,183,136,.3)';
    pill.textContent = '⚙ API ✓';
  }
  closeSettings();
  if (currentAgent) setExecMode(currentExecMode);
}

// ═══════════════════════════════════════════════════════
//  CATEGORY MANAGEMENT
// ═══════════════════════════════════════════════════════
let _customCatIcons = JSON.parse(localStorage.getItem('imperio_custom_cat_icons') || '{}');

function openCategoryManager() {
  const modal = document.getElementById('category-manager-modal');
  const list = document.getElementById('category-list');

  // Get all categories from PROJECTS
  const cats = [...new Set(PROJECTS.map(p => p.categoria).filter(Boolean))];

  let html = '';
  cats.forEach(cat => {
    const icon = _customCatIcons[cat] || (typeof _baseCatIcons !== 'undefined' ? _baseCatIcons[cat] : null) || '📁';
    html += `
          <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface2);border-radius:8px;margin-bottom:8px">
            <input class="brief-input cat-icon-input" data-cat="${cat}" style="width:50px;text-align:center;font-size:16px" value="${icon}" maxlength="2">
            <input class="brief-input cat-name-input" data-cat="${cat}" style="flex:1" value="${cat}" disabled title="Para renomear, altere a categoria do projeto no Briefing">
          </div>
        `;
  });
  list.innerHTML = html;

  modal.style.opacity = '1';
  modal.style.pointerEvents = 'all';
}

function closeCategoryManager() {
  const modal = document.getElementById('category-manager-modal');
  modal.style.opacity = '0';
  modal.style.pointerEvents = 'none';
}

function saveCategoryManager() {
  const inputs = document.querySelectorAll('.cat-icon-input');
  inputs.forEach(input => {
    const cat = input.dataset.cat;
    const icon = input.value.trim();
    if (icon) {
      _customCatIcons[cat] = icon;
    }
  });
  localStorage.setItem('imperio_custom_cat_icons', JSON.stringify(_customCatIcons));

  // Refresh sidebar if it exists
  if (typeof renderSidebar === 'function') {
    renderSidebar();
  }
  closeCategoryManager();
}

// ═══════════════════════════════════════════════════════
//  BRANDING TAB
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  { id: 'heroi', name: 'O Herói', desc: 'Supera obstáculos, conquista' },
  { id: 'mentor', name: 'O Mentor', desc: 'Guia, ensina, ilumina' },
  { id: 'fora_lei', name: 'Fora da Lei', desc: 'Disruptivo, anti-sistema' },
  { id: 'explorador', name: 'Explorador', desc: 'Liberdade, descoberta' },
  { id: 'criador', name: 'O Criador', desc: 'Inovação, expressão' },
  { id: 'cuidador', name: 'O Cuidador', desc: 'Proteção, suporte, cura' },
  { id: 'rei', name: 'O Rei', desc: 'Autoridade, ordem, poder' },
  { id: 'mago', name: 'O Mago', desc: 'Transformação, resultados' },
  { id: 'jester', name: 'O Bobo', desc: 'Entretenimento, diversão' }
];

function renderBranding() {
  const p = currentProject;
  const b = p.branding || {};
  const el = document.getElementById('tab-branding');
  if (!b.cores || !Array.isArray(b.cores)) b.cores = [
    { nome: 'Primária', hex: '#c9a84c' },
    { nome: 'Secundária', hex: '#1a1a2e' },
    { nome: 'Acento', hex: '#52b788' },
    { nome: 'Texto', hex: '#e8e8e8' },
    { nome: 'Fundo', hex: '#0d0d1a' }
  ];
  if (!p.branding) p.branding = b;
  p.branding.cores = b.cores;

  const coresHtml = b.cores.map((c, ci) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <div style="position:relative">
            <div id="swatch-${ci}" style="width:52px;height:52px;border-radius:10px;background:${c.hex};border:3px solid rgba(255,255,255,.15);cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.4)" onclick="document.getElementById('cpick-${ci}').click()"></div>
            <input type="color" id="cpick-${ci}" value="${c.hex}" style="position:absolute;opacity:0;width:1px;height:1px" oninput="updateCor(${ci},this.value)">
          </div>
          <input class="brief-input" style="width:70px;font-size:9px;text-align:center;padding:3px;font-family:monospace" value="${c.hex}" onblur="updateCor(${ci},this.value)" id="chex-${ci}">
          <input class="brief-input" style="width:70px;font-size:9px;text-align:center;padding:3px" value="${c.nome}" onblur="updateCorNome(${ci},this.value)" placeholder="Nome">
        </div>`).join('');

  const archetypeHtml = ARCHETYPES.map(a => `
        <div class="archetype-btn ${b.arquetipo === a.name ? 'selected' : ''}" onclick="selectArchetype('${a.name}')">
          <div class="archetype-name">${a.name}</div>
          <div class="archetype-desc">${a.desc}</div>
        </div>`).join('');

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:600;color:var(--text)">🏷️ Branding: ${p.nome}</div>
      <button class="btn btn-sm btn-gold" onclick="openAgent('design','web_designer')">🎨 Pedir Design</button>
    </div>

    <!-- PALETA DE CORES -->
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="card-title" style="margin-bottom:0">🎨 Paleta de Cores</div>
        <div id="cores-preview" style="display:flex;border-radius:8px;overflow:hidden;height:24px;width:180px;border:1px solid var(--border)">
          ${b.cores.map(c => `<div style="flex:1;background:${c.hex}" title="${c.nome}"></div>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">${coresHtml}</div>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">🎭 Arquétipo da Marca</div>
        <div class="archetype-grid">${archetypeHtml}</div>
      </div>
      <div class="card">
        <div class="card-title">⚔️ Posicionamento</div>
        <div class="brief-field"><div class="brief-label">Inimigo Comum</div>
          <textarea class="brief-input" rows="2" onblur="saveBranding('inimigo_comum',this.value)">${b.inimigo_comum || ''}</textarea>
        </div>
        <div class="brief-field"><div class="brief-label">Mecanismo-Chave (o que torna único)</div>
          <textarea class="brief-input" rows="2" onblur="saveBranding('mecanismo_key',this.value)">${b.mecanismo_key || ''}</textarea>
        </div>
        <div class="brief-field"><div class="brief-label">Personalidade da Marca</div>
          <input class="brief-input" value="${b.personalidade || ''}" onblur="saveBranding('personalidade',this.value)">
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">📜 Manifesto da Marca</div>
      <textarea class="brief-input" rows="5" placeholder="O que a marca acredita? Qual é sua missão e promessa central?" onblur="saveBranding('manifesto',this.value)">${b.manifesto || ''}</textarea>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">✅ Linguagem: Usa</div>
        <textarea class="brief-input" rows="4" placeholder="Palavras, expressões, tom que a marca usa..." onblur="saveBrandingArr('usa',this.value)">${(b.linguagem?.usa || []).join('\n')}</textarea>
      </div>
      <div class="card">
        <div class="card-title">❌ Linguagem: Evita</div>
        <textarea class="brief-input" rows="4" placeholder="Termos, clichês e tons que a marca evita..." onblur="saveBrandingArr('evita',this.value)">${(b.linguagem?.evita || []).join('\n')}</textarea>
      </div>
    </div>

    <!-- TIPOGRAFIA -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🔤 Tipografia</div>
      <div class="grid2">
        <div class="brief-field">
          <div class="brief-label">Fonte Principal (Títulos)</div>
          <input class="brief-input" value="${b.tipografia?.principal || ''}" placeholder="Ex: Playfair Display, Montserrat..." onblur="saveBrandingTip('principal',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">Fonte Secundária (Corpo)</div>
          <input class="brief-input" value="${b.tipografia?.secundaria || ''}" placeholder="Ex: Inter, Open Sans, Lato..." onblur="saveBrandingTip('secundaria',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">Peso / Estilo (Títulos)</div>
          <input class="brief-input" value="${b.tipografia?.peso_titulo || ''}" placeholder="Ex: Bold 700, Black 900..." onblur="saveBrandingTip('peso_titulo',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">Tamanho Base / Escala</div>
          <input class="brief-input" value="${b.tipografia?.escala || ''}" placeholder="Ex: 16px base, H1: 48px, H2: 32px..." onblur="saveBrandingTip('escala',this.value)">
        </div>
      </div>
    </div>

    <!-- LOGO -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🖼️ Logo & Identidade Visual</div>
      <div class="grid2">
        <div>
          <div class="brief-field">
            <div class="brief-label">URL do Logo (ou cole base64)</div>
            <div style="display:flex;gap:8px;align-items:center">
              <input class="brief-input" value="${b.logo_url && !b.logo_url.startsWith('data:') ? b.logo_url : ''}" placeholder="https://..." onblur="saveBranding('logo_url',this.value);renderBranding()" style="flex:1">
              <label style="cursor:pointer;background:var(--surface2);border:1px solid var(--border2);border-radius:6px;padding:5px 10px;font-size:11px;color:var(--text2);white-space:nowrap;flex-shrink:0">📂 Upload<input type="file" accept="image/*" style="display:none" onchange="uploadBrandingLogo(this)"></label>
            </div>
          </div>
          <div class="brief-field">
            <div class="brief-label">Fundo do Logo</div>
            <input class="brief-input" value="${b.logo_fundo || ''}" placeholder="Ex: Fundo escuro, Branco, Transparente..." onblur="saveBranding('logo_fundo',this.value)">
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;background:var(--surface2);border:1px solid var(--border);border-radius:8px;min-height:100px;padding:12px">
          ${b.logo_url ? `<img src="${b.logo_url}" style="max-width:100%;max-height:100px;object-fit:contain">` : `<div style="font-size:11px;color:var(--text3);text-align:center">Logo aparecerá aqui<br>após upload</div>`}
        </div>
      </div>
      <div class="brief-field" style="margin-top:8px">
        <div class="brief-label">Variações do Logo (descreva)</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Versão principal (colorida), Versão monocromática, Versão ícone apenas..." onblur="saveBranding('logo_variacoes',this.value)">${b.logo_variacoes || ''}</textarea>
      </div>
    </div>

    <!-- DIRETRIZES -->
    <div class="card">
      <div class="card-title">📋 Diretrizes da Marca</div>
      <div class="brief-field">
        <div class="brief-label">Espaçamento / Uso do Logo</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Área de proteção mínima, não distorcer, não rotacionar..." onblur="saveBranding('diretrizes_logo',this.value)">${b.diretrizes_logo || ''}</textarea>
      </div>
      <div class="brief-field">
        <div class="brief-label">Aplicações Aprovadas</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Fundo escuro com logo dourado, fundo branco com logo escuro..." onblur="saveBranding('aplicacoes_ok',this.value)">${b.aplicacoes_ok || ''}</textarea>
      </div>
      <div class="brief-field">
        <div class="brief-label">Aplicações Proibidas</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Nunca usar rosa, nunca usar fundo cinza, não misturar com outras marcas..." onblur="saveBranding('aplicacoes_nao',this.value)">${b.aplicacoes_nao || ''}</textarea>
      </div>
    </div>`;
}

function updateCor(ci, hex) {
  if (!currentProject.branding) currentProject.branding = {};
  if (!currentProject.branding.cores) return;
  currentProject.branding.cores[ci].hex = hex;
  const swatch = document.getElementById('swatch-' + ci);
  if (swatch) swatch.style.background = hex;
  const hexInput = document.getElementById('chex-' + ci);
  if (hexInput) hexInput.value = hex;
  // Update preview bar
  const preview = document.getElementById('cores-preview');
  if (preview) preview.innerHTML = currentProject.branding.cores.map(c => `<div style="flex:1;background:${c.hex}" title="${c.nome}"></div>`).join('');
  // Update color picker
  const cpick = document.getElementById('cpick-' + ci);
  if (cpick) cpick.value = hex;
}

function updateCorNome(ci, nome) {
  if (!currentProject.branding || !currentProject.branding.cores) return;
  currentProject.branding.cores[ci].nome = nome;
}

function selectArchetype(name) {
  if (!currentProject.branding) currentProject.branding = {};
  currentProject.branding.arquetipo = name;
  renderBranding();
}

function saveBranding(key, value) {
  if (!currentProject.branding) currentProject.branding = {};
  currentProject.branding[key] = value;
}

function saveBrandingArr(subkey, value) {
  if (!currentProject.branding) currentProject.branding = {};
  if (!currentProject.branding.linguagem) currentProject.branding.linguagem = { usa: [], evita: [] };
  currentProject.branding.linguagem[subkey] = value.split('\n').filter(l => l.trim());
}

function saveBrandingTip(key, value) {
  if (!currentProject.branding) currentProject.branding = {};
  if (!currentProject.branding.tipografia) currentProject.branding.tipografia = {};
  currentProject.branding.tipografia[key] = value;
}

function uploadBrandingLogo(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    saveBranding('logo_url', e.target.result);
    renderBranding();
  };
  reader.readAsDataURL(file);
}

function addConcorrente() {
  if (!currentProject.concorrentes) currentProject.concorrentes = [];
  currentProject.concorrentes.push({
    nome: '', url: '', diferencial: '', fraqueza: '', canais: '',
    nicho: '', subnicho: '', publico_alvo: '', mecanismo: '',
    headline: '', hook: '', cta: '',
    oferta_principal: '', preco: '', garantia: '', bonus: '',
    dossie: null
  });
  saveProjectData();
  showTab('briefing');
}

function removeConcorrente(idx) {
  if (!currentProject.concorrentes) return;
  currentProject.concorrentes.splice(idx, 1);
  saveProjectData();
  showTab('briefing');
}

function saveConcorrente(idx, key, val) {
  if (!currentProject.concorrentes) currentProject.concorrentes = [];
  if (!currentProject.concorrentes[idx]) currentProject.concorrentes[idx] = {};
  currentProject.concorrentes[idx][key] = val;
}

function savePosicionamento(key, val) {
  if (!currentProject.posicionamento) currentProject.posicionamento = {};
  currentProject.posicionamento[key] = val;
}

function saveProjectData() {
  if (!currentProject) return;

  // Sempre persistir (inclui projetos seed convertendo para custom)
  var custom = projectsGetCustom();
  var ci = custom.findIndex(function (p) { return p.id === currentProject.id; });
  const snapshot = JSON.parse(JSON.stringify({ ...currentProject, _custom: true }));
  if (ci !== -1) custom[ci] = snapshot;
  else custom.push(snapshot);
  projectsSaveCustom(custom);
  currentProject._custom = true;

  // Se já foi marcado como deletado no passado, remove da lista de deletados
  if (typeof unmarkProjectDeleted === 'function') unmarkProjectDeleted(currentProject.id);

  // Sync best-effort com Supabase
  try {
    if (typeof SB !== 'undefined' && SB.upsertProject) SB.upsertProject(currentProject);
  } catch (e) {
    console.warn('saveProjectData sync warning:', e?.message || e);
  }

  // Flash feedback on all save buttons (concorrentes + hero)
  ['btn-save-project', 'hero-save-btn'].forEach(function (btnId) {
    var btn = document.getElementById(btnId);
    if (btn) {
      var orig = btn.innerHTML;
      var origColor = btn.style.color;
      var origBg = btn.style.background;
      btn.innerHTML = '✓ Salvo!';
      btn.style.background = 'var(--green-bright, #52b788)';
      btn.style.color = '#0a0a0f';
      btn.style.borderColor = 'transparent';
      setTimeout(function () { btn.innerHTML = orig; btn.style.background = origBg; btn.style.color = origColor; btn.style.borderColor = ''; }, 1800);
    }
  });
}

// ── Competitor Section Render ──────────────────────────────────────────────
function renderConcorrentesSection(p) {
  var tabs = ['Visão Geral', 'Mercado', 'Copywriting', 'Oferta', 'Dossiê'];
  var tabBtns = tabs.map(function (t, i) {
    return '<button id="conc-tab-' + i + '" onclick="showConcTab(' + i + ')" style="background:' + (i === 0 ? 'var(--gold)' : 'transparent') + ';color:' + (i === 0 ? '#1a1a1a' : 'var(--text3)') + ';border:none;border-bottom:' + (i === 0 ? '2px solid var(--gold)' : '2px solid transparent') + ';padding:7px 13px;font-size:11px;font-weight:' + (i === 0 ? '700' : '500') + ';cursor:pointer;transition:.15s;border-radius:6px 6px 0 0">' + t + '</button>';
  }).join('');
  return '<div class="card" style="margin-bottom:12px">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
    + '<div class="card-title" style="margin-bottom:0">🥊 Análise de Concorrentes</div>'
    + '<div style="display:flex;gap:8px;align-items:center">'
    + '<button onclick="addConcorrente()" class="btn btn-sm btn-outline">+ Concorrente</button>'
    + '<button id="btn-save-project" onclick="saveProjectData()" class="btn btn-sm btn-gold">💾 Salvar</button>'
    + '</div>'
    + '</div>'
    + '<div style="display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:14px">' + tabBtns + '</div>'
    + '<div id="conc-panel-0">' + buildConcOverviewHtml(p) + '</div>'
    + '<div id="conc-panel-1" style="display:none">' + buildConcMercadoHtml(p) + '</div>'
    + '<div id="conc-panel-2" style="display:none">' + buildConcCopyHtml(p) + '</div>'
    + '<div id="conc-panel-3" style="display:none">' + buildConcOfertaHtml(p) + '</div>'
    + '<div id="conc-panel-4" style="display:none">' + buildConcDossieHtml(p) + '</div>'
    + '</div>';
}

function showConcTab(idx) {
  for (var i = 0; i < 5; i++) {
    var panel = document.getElementById('conc-panel-' + i);
    var tab = document.getElementById('conc-tab-' + i);
    if (panel) panel.style.display = (i === idx) ? '' : 'none';
    if (tab) {
      tab.style.background = (i === idx) ? 'var(--gold)' : 'transparent';
      tab.style.color = (i === idx) ? '#1a1a1a' : 'var(--text3)';
      tab.style.fontWeight = (i === idx) ? '700' : '500';
      tab.style.borderBottom = (i === idx) ? '2px solid var(--gold)' : '2px solid transparent';
    }
  }
}

// Tab 1: Comparison Table
function buildConcOverviewHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado. Clique em "+ Concorrente" para adicionar.</div>';
  var rowDefs = [
    ['Nome', 'nome'], ['URL / Site', 'url'], ['Ponto Forte', 'diferencial'], ['Fraqueza', 'fraqueza'],
    ['Canais Principais', 'canais'], ['Nicho / Subnicho', 'nicho'], ['Público-alvo', 'publico_alvo'], ['Mecanismo Único', 'mecanismo']
  ];
  var proj = p.posicionamento || {};
  var projFields = { nome: p.nome || '', nicho: proj.nicho || '', subnicho: proj.subnicho || '', publico_alvo: proj.publico_alvo || '', mecanismo: proj.mecanismo || '' };
  var h = '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:480px">';
  h += '<thead><tr>';
  h += '<th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text3);font-weight:600;border:1px solid var(--border);white-space:nowrap;min-width:110px">Campo</th>';
  h += '<th style="text-align:left;padding:6px 8px;background:rgba(201,168,76,0.12);color:var(--gold);font-weight:700;border:1px solid var(--border);min-width:130px">⭐ Seu Projeto</th>';
  concs.forEach(function (c, ci) {
    h += '<th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text);font-weight:600;border:1px solid var(--border);min-width:130px">' + (c.nome || ('Conc. ' + (ci + 1))) + '</th>';
  });
  h += '</tr></thead><tbody>';
  rowDefs.forEach(function (rd) {
    var label = rd[0], key = rd[1];
    h += '<tr><td style="padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);white-space:nowrap;font-weight:500">' + label + '</td>';
    var projVal = (projFields[key] !== undefined) ? projFields[key] : '';
    var isProj = ['nicho', 'subnicho', 'publico_alvo', 'mecanismo'].includes(key);
    h += '<td contenteditable="true" style="padding:6px 8px;background:rgba(201,168,76,0.04);color:var(--text);border:1px solid var(--border)" onblur="savePosicionamento(\'' + key + '\',this.textContent)">' + projVal + '</td>';
    concs.forEach(function (c, ci) {
      h += '<td contenteditable="true" style="padding:6px 8px;color:var(--text);border:1px solid var(--border)" onblur="saveConcorrente(' + ci + ',\'' + key + '\',this.textContent)">' + (c[key] || '') + '</td>';
    });
    h += '</tr>';
  });
  // Actions row
  h += '<tr><td style="padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);font-weight:500">Ações</td>';
  h += '<td style="padding:6px 8px;border:1px solid var(--border)"></td>';
  concs.forEach(function (c, ci) {
    h += '<td style="padding:6px 8px;border:1px solid var(--border)">'
      + '<button onclick="removeConcorrente(' + ci + ')" style="background:none;border:1px solid #e05c5c33;color:#e05c5c;border-radius:5px;padding:2px 7px;font-size:10px;cursor:pointer">✕ Remover</button>'
      + '<button onclick="openImportFunnelModal(' + ci + ')" style="background:none;border:1px solid var(--border2);color:var(--text3);border-radius:5px;padding:2px 7px;font-size:10px;cursor:pointer;margin-left:4px">📥 Import</button>'
      + '</td>';
  });
  h += '</tr></tbody></table></div>';
  return h;
}

// Tab 2: Radar de Proximidade + Keywords
function buildConcMercadoHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var colors = ['#52b788', '#e05c5c', '#3b82f6', '#a78bfa', '#fb923c', '#f472b6'];
  var cx = 155, cy = 140, maxR = 105;
  var angDeg = [270, 30, 150, 210, 90, 330];
  var maxScore = 15;
  concs.forEach(function (c) {
    var s = (c.dossie && c.dossie.score_escala != null) ? c.dossie.score_escala : 5;
    if (s > maxScore) maxScore = s;
  });
  var rings = '';
  for (var ri = 1; ri <= 3; ri++) {
    var rr = (maxR / 3) * ri;
    rings += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr.toFixed(0) + '" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,3"/>';
  }
  var bubbles = '';
  var legend = '';
  concs.slice(0, 6).forEach(function (c, ci) {
    var score = (c.dossie && c.dossie.score_escala != null) ? c.dossie.score_escala : 5;
    var ang = (angDeg[ci] || (ci * 60)) * Math.PI / 180;
    var dist = maxR * 0.62;
    var bx = cx + dist * Math.cos(ang);
    var by = cy + dist * Math.sin(ang);
    var br = 18 + (score / maxScore) * 16;
    var col = colors[ci % colors.length];
    var lbl = (c.nome || ('Conc.' + (ci + 1))).substring(0, 9);
    bubbles += '<circle cx="' + bx.toFixed(0) + '" cy="' + by.toFixed(0) + '" r="' + br.toFixed(0) + '" fill="' + col + '" fill-opacity="0.2" stroke="' + col + '" stroke-width="1.5"/>';
    bubbles += '<text x="' + bx.toFixed(0) + '" y="' + (parseFloat(by.toFixed(0)) + 4) + '" text-anchor="middle" font-size="9" fill="' + col + '" font-weight="600">' + lbl + '</text>';
    legend += '<rect x="8" y="' + (206 + ci * 15) + '" width="9" height="9" fill="' + col + '" fill-opacity="0.7" rx="2"/>';
    legend += '<text x="21" y="' + (215 + ci * 15) + '" font-size="9" fill="var(--text3)">' + (c.nome || ('Conc.' + (ci + 1))).substring(0, 16) + '</text>';
  });
  var svgH = 206 + Math.min(concs.length, 6) * 15 + 8;
  var svgBlock = '<svg width="320" height="' + svgH + '" style="display:block">'
    + rings
    + '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="rgba(201,168,76,0.25)" stroke="var(--gold)" stroke-width="2"/>'
    + '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-size="8" fill="var(--gold)" font-weight="700">VOCÊ</text>'
    + bubbles + legend + '</svg>';
  // Bars
  var barsHtml = '<div style="flex:1;min-width:180px">'
    + '<div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Score de Escala</div>';
  concs.forEach(function (c, ci) {
    var score = (c.dossie && c.dossie.score_escala != null) ? c.dossie.score_escala : null;
    var pct = score != null ? Math.min(100, Math.round(score / 15 * 100)) : 0;
    var col = colors[ci % colors.length];
    barsHtml += '<div style="margin-bottom:10px">'
      + '<div style="display:flex;justify-content:space-between;margin-bottom:3px">'
      + '<span style="font-size:11px;color:var(--text)">' + (c.nome || ('Conc.' + (ci + 1))) + '</span>'
      + '<span style="font-size:10px;color:var(--text3)">' + (score != null ? score + '/15' : 'N/A') + '</span>'
      + '</div>'
      + '<div style="height:6px;background:var(--surface2);border-radius:3px">'
      + '<div style="height:100%;width:' + pct + '%;background:' + col + ';border-radius:3px;transition:.3s"></div>'
      + '</div></div>';
  });
  // Keywords
  var kwMap = {};
  concs.forEach(function (c) {
    var kws = (c.dossie && c.dossie.palavras_chave) ? c.dossie.palavras_chave : [];
    kws.forEach(function (kw) { kwMap[kw] = (kwMap[kw] || 0) + 1; });
    if (c.canais) {
      c.canais.split(/[,;]/).forEach(function (k) {
        var t = k.trim();
        if (t && t.length < 30) kwMap[t] = (kwMap[t] || 0) + 1;
      });
    }
  });
  var sortedKws = Object.entries(kwMap).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 18);
  if (sortedKws.length) {
    barsHtml += '<div style="margin-top:14px"><div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Canais & Palavras-chave Comuns</div>';
    barsHtml += '<div style="display:flex;flex-wrap:wrap;gap:5px">';
    sortedKws.forEach(function (entry) {
      var kw = entry[0], cnt = entry[1];
      var op = Math.min(1, 0.35 + cnt / concs.length * 0.65);
      barsHtml += '<span style="background:rgba(201,168,76,' + op.toFixed(2) + ');color:' + (cnt > 1 ? '#1a1a1a' : 'var(--text)') + ';border-radius:20px;padding:3px 9px;font-size:10px;font-weight:' + (cnt > 1 ? '700' : '400') + '">' + kw + (cnt > 1 ? ' ×' + cnt : '') + '</span>';
    });
    barsHtml += '</div></div>';
  }
  barsHtml += '</div>';
  return '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">'
    + '<div style="flex:0 0 auto"><div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Radar de Proximidade Competitiva</div>' + svgBlock + '</div>'
    + barsHtml + '</div>';
}

// Tab 3: Copywriting
function buildConcCopyHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var fields = [['headline', '📰 Headline Principal'], ['hook', '🎣 Hook / Ângulo'], ['cta', '👆 CTA Principal']];
  var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px">';
  concs.forEach(function (c, ci) {
    h += '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">'
      + '<div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)">' + (c.nome || ('Conc. ' + (ci + 1))) + '</div>';
    fields.forEach(function (f) {
      h += '<div style="margin-bottom:9px">'
        + '<div style="font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">' + f[1] + '</div>'
        + '<div contenteditable="true" style="font-size:11px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:5px;padding:5px 7px;min-height:28px;line-height:1.4" onblur="saveConcorrente(' + ci + ',\'' + f[0] + '\',this.textContent)">' + (c[f[0]] || '') + '</div>'
        + '</div>';
    });
    h += '</div>';
  });
  h += '</div>';
  return h;
}

// Tab 4: Oferta
function buildConcOfertaHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var fields = [['oferta_principal', '🎯 Oferta Principal'], ['preco', '💰 Preço'], ['garantia', '🛡️ Garantia'], ['bonus', '🎁 Bônus']];
  var h = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:380px">';
  h += '<thead><tr><th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);min-width:110px">Campo</th>';
  concs.forEach(function (c, ci) {
    h += '<th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text);border:1px solid var(--border);min-width:140px">' + (c.nome || ('Conc.' + (ci + 1))) + '</th>';
  });
  h += '</tr></thead><tbody>';
  fields.forEach(function (f) {
    h += '<tr><td style="padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);font-weight:500;white-space:nowrap">' + f[1] + '</td>';
    concs.forEach(function (c, ci) {
      h += '<td contenteditable="true" style="padding:6px 8px;color:var(--text);border:1px solid var(--border)" onblur="saveConcorrente(' + ci + ',\'' + f[0] + '\',this.textContent)">' + (c[f[0]] || '') + '</td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table></div>';
  return h;
}

// Tab 5: Dossiê (Funnel Hacking data)
function buildConcDossieHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var typeColors = { LP: '#52b788', VSL: '#fb923c', PV: '#3b82f6', CK: '#a78bfa', UP: '#e05c5c', DS: '#f472b6', TY: '#22d3ee', MB: '#94a3b8' };
  var h = '<div style="display:flex;flex-direction:column;gap:12px">';
  concs.forEach(function (c, ci) {
    var d = c.dossie || {};
    var hasData = !!(d.insights || d.trafego_estimado || (d.stack && d.stack.length) || d.ads_ativos != null || (d.paginas_funil && d.paginas_funil.length));
    h += '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px">';
    h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:8px">';
    h += '<div style="font-size:12px;font-weight:700;color:var(--text)">' + (c.nome || ('Concorrente ' + (ci + 1))) + (c.url ? ' <a href="' + c.url + '" target="_blank" style="color:var(--gold);font-size:10px;font-weight:400">' + c.url + '</a>' : '') + '</div>';
    h += '<button onclick="openImportFunnelModal(' + ci + ')" class="btn btn-sm btn-outline" style="font-size:10px;flex-shrink:0">📥 Importar Pesquisa</button>';
    h += '</div>';
    if (!hasData) {
      h += '<div style="font-size:11px;color:var(--text3);text-align:center;padding:18px 0;line-height:1.8">'
        + 'Nenhum dado de pesquisa importado ainda.<br>'
        + '<span style="font-size:10px">Use o <strong style="color:var(--text)">Funnel Hacking Agent</strong> para pesquisar este concorrente e depois clique em "📥 Importar Pesquisa".</span>'
        + '</div>';
    } else {
      if (d.score_escala != null) {
        h += '<div style="display:inline-block;background:rgba(201,168,76,0.15);border:1px solid var(--gold);border-radius:6px;padding:3px 10px;font-size:11px;color:var(--gold);font-weight:700;margin-bottom:10px">🏆 Score de Escala: ' + d.score_escala + '/15</div>';
      }
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:7px;margin-bottom:10px">';
      if (d.trafego_estimado) h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:8px"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Tráfego Est.</div><div style="font-size:12px;color:var(--text);font-weight:600">' + d.trafego_estimado + '</div></div>';
      if (d.ads_ativos != null) h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:8px"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Ads Ativos</div><div style="font-size:12px;color:var(--text);font-weight:600">' + d.ads_ativos + '</div></div>';
      if (d.importado_em) h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:8px"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Importado em</div><div style="font-size:11px;color:var(--text3)">' + new Date(d.importado_em).toLocaleDateString('pt-BR') + '</div></div>';
      h += '</div>';
      if (d.stack && d.stack.length) {
        h += '<div style="margin-bottom:9px"><div style="font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">Stack Tecnológico</div><div style="display:flex;flex-wrap:wrap;gap:5px">';
        d.stack.forEach(function (s) { h += '<span style="background:rgba(59,130,246,0.12);color:#3b82f6;border:1px solid rgba(59,130,246,0.25);border-radius:20px;padding:2px 8px;font-size:10px">' + s + '</span>'; });
        h += '</div></div>';
      }
      if (d.paginas_funil && d.paginas_funil.length) {
        h += '<div style="margin-bottom:9px"><div style="font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">Páginas do Funil Detectadas</div><div style="display:flex;flex-wrap:wrap;gap:5px">';
        d.paginas_funil.forEach(function (t) {
          var col = typeColors[t] || '#94a3b8';
          h += '<span style="border:1px solid ' + col + '44;color:' + col + ';border-radius:4px;padding:2px 7px;font-size:10px;font-weight:600;background:' + col + '11">' + t + '</span>';
        });
        h += '</div></div>';
      }
      if (d.insights) {
        h += '<div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.2);border-radius:7px;padding:10px">'
          + '<div style="font-size:9px;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">💡 Insights</div>'
          + '<div style="font-size:11px;color:var(--text);line-height:1.6;white-space:pre-wrap">' + d.insights.substring(0, 600) + '</div>'
          + '</div>';
      }
    }
    h += '</div>';
  });
  h += '</div>';
  return h;
}

// ── Import Funnel Modal Functions ──────────────────────────────────────────
function openImportFunnelModal(concIdx) {
  window._importFunnelConcIdx = concIdx;
  var m = document.getElementById('import-funnel-modal');
  if (!m) return;
  var name = (currentProject.concorrentes && currentProject.concorrentes[concIdx])
    ? (currentProject.concorrentes[concIdx].nome || ('Concorrente ' + (concIdx + 1))) : '';
  var titleEl = document.getElementById('ifm-title');
  if (titleEl) titleEl.textContent = '📥 Importar Pesquisa — ' + name;
  var contentEl = document.getElementById('ifm-content');
  if (contentEl) contentEl.value = '';
  m.style.opacity = '1';
  m.style.pointerEvents = 'all';
}

function closeImportFunnelModal() {
  var m = document.getElementById('import-funnel-modal');
  if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; }
}

function importFunnelData() {
  var contentEl = document.getElementById('ifm-content');
  var content = contentEl ? contentEl.value.trim() : '';
  var ci = window._importFunnelConcIdx;
  if (!content) { alert('Cole o conteúdo do dossiê antes de importar.'); return; }
  if (ci === undefined || ci === null || ci < 0) return;
  if (!currentProject.concorrentes || !currentProject.concorrentes[ci]) return;
  var parsed = parseFunnelHackingMarkdown(content);
  if (!currentProject.concorrentes[ci].dossie) currentProject.concorrentes[ci].dossie = {};
  Object.assign(currentProject.concorrentes[ci].dossie, parsed, { importado_em: Date.now(), raw: content.substring(0, 2000) });
  saveProjectData();
  closeImportFunnelModal();
  showTab('briefing');
  setTimeout(function () { showConcTab(4); }, 120);
}

function parseFunnelHackingMarkdown(content) {
  var result = {};
  // Score de Escala
  var sm = content.match(/(?:TOTAL|Score\s*Total)[^:\n]*[:\s]+(\d+)/i);
  if (!sm) sm = content.match(/score[^:\n]*[:\s]+(\d+)\s*\/\s*15/i);
  if (sm) result.score_escala = parseInt(sm[1]);
  // Tráfego estimado
  var tm = content.match(/(?:Tr[aá]fego|Traffic|Visitors)[^\n]*?([0-9][0-9.,\s]*[KkMm]?[^\n]{0,20}(?:\/m[eê]s|\/month)?)/i);
  if (tm) result.trafego_estimado = tm[1].trim().split(/\s+/).slice(0, 4).join(' ');
  // Ads ativos
  var am = content.match(/ads?\s*ativos?[:\s]+(\d+)/i);
  if (!am) am = content.match(/(\d+)\s+ads?\s*(?:ativos?|running)/i);
  if (am) result.ads_ativos = parseInt(am[1]);
  // Stack tecnológico
  var stackM = content.match(/Stack[^\n]*\n([\s\S]{0,600}?)(?:\n#|\n\n##|$)/i);
  if (stackM) {
    result.stack = stackM[1].split('\n')
      .map(function (l) { return l.replace(/^[-*•\s\d.]+/, '').trim(); })
      .filter(function (l) { return l.length > 1 && l.length < 60 && !/^#+/.test(l); })
      .slice(0, 12);
  }
  // Páginas do funil
  var pts = content.match(/\b(LP|VSL|PV|CK|OB|UP|DS|TY|MB|WB|CS|BK)\b/g);
  if (pts) result.paginas_funil = pts.filter(function (v, i, a) { return a.indexOf(v) === i; });
  // Palavras-chave / canais
  var kwM = content.match(/(?:Palavras[- ]chave|Keywords|Canais?)[^\n]*\n([\s\S]{0,400}?)(?:\n#|$)/i);
  if (kwM) {
    result.palavras_chave = kwM[1].split(/[\n,;|]+/)
      .map(function (k) { return k.replace(/^[-*•\s]+/, '').trim(); })
      .filter(function (k) { return k.length > 1 && k.length < 40 && !/^#+/.test(k); })
      .slice(0, 20);
  }
  // Insights / Oportunidades
  var insM = content.match(/(?:INSIGHTS?|Oportunidades?|Gaps?)[^\n]*\n([\s\S]{0,800}?)(?:\n##|$)/i);
  if (insM) result.insights = insM[1].trim().substring(0, 600);
  return result;
}

function addProjectLink() {
  if (!currentProject.linksArr) currentProject.linksArr = [];
  currentProject.linksArr.push({ tipo: '', url: '' });
  const li = currentProject.linksArr.length - 1;
  const list = document.getElementById('project-links-list');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'link-row';
  row.style.cssText = 'display:flex;gap:6px;margin-bottom:6px;align-items:center';
  row.innerHTML = `<input class="brief-input link-type" value="" placeholder="Tipo (ex: site)" style="flex:0 0 120px" onblur="saveProjectLink(${li},'tipo',this.value)"><input class="brief-input link-url" value="" placeholder="https://" style="flex:1" onblur="saveProjectLink(${li},'url',this.value)"><button onclick="removeProjectLink(${li})" style="background:none;border:1px solid #e05c5c33;color:#e05c5c;border-radius:5px;padding:2px 8px;font-size:12px;cursor:pointer;flex-shrink:0">✕</button>`;
  list.appendChild(row);
}

function saveProjectLink(idx, key, val) {
  if (!currentProject.linksArr) return;
  if (!currentProject.linksArr[idx]) currentProject.linksArr[idx] = { tipo: '', url: '' };
  currentProject.linksArr[idx][key] = val;
}

function removeProjectLink(idx) {
  if (!currentProject.linksArr) return;
  currentProject.linksArr.splice(idx, 1);
  const tab = document.getElementById('tab-briefing');
  if (tab) { showTab('briefing'); }
}

// ═══════════════════════════════════════════════════════
//  ESCAVADOR DE DESEJOS — Modal + Import
// ═══════════════════════════════════════════════════════
function openEscavadorModal() {
  var m = document.getElementById('escavador-modal');
  if (!m) return;
  var esc = currentProject && currentProject.avatar && currentProject.avatar.escavador_desejos;
  if (!esc) return;
  var raw = esc.raw_output || '(sem conteúdo)';
  // Render raw markdown into readable HTML (basic)
  var html = raw
    .replace(/^### (.+)$/gm, '<h3 style="color:#9b7fe8;margin:14px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.5px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:var(--gold);margin:18px 0 8px;font-size:15px;border-bottom:1px solid var(--border);padding-bottom:6px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:var(--text);margin:0 0 16px;font-size:17px;font-weight:700">$1</h1>')
    .replace(/^\* \*\*(.+?)\*\*: (.+)$/gm, '<li style="margin:4px 0"><strong style="color:var(--text)">$1</strong>: $2</li>')
    .replace(/^\* (.+)$/gm, '<li style="margin:4px 0;color:var(--text2)">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin:0 0 8px;color:var(--text2);font-size:13px;line-height:1.6">')
    .replace(/\n/g, '<br>');
  var dataFmt = new Date(esc.gerado_em).toLocaleDateString('pt-BR');
  var proj = currentProject ? currentProject.nome : '';
  document.getElementById('escavador-modal-title').textContent = '🧬 ' + proj + ' — Escavador de Desejos';
  document.getElementById('escavador-modal-date').textContent = 'Gerado em ' + dataFmt;
  document.getElementById('escavador-modal-body').innerHTML = '<p style="margin:0 0 8px;color:var(--text2);font-size:13px;line-height:1.6">' + html + '</p>';
  m.style.opacity = '1'; m.style.pointerEvents = 'auto';
}
function closeEscavadorModal() {
  var m = document.getElementById('escavador-modal');
  if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; }
}
function openEscavadorImport() {
  var m = document.getElementById('escavador-import-modal');
  if (!m) return;
  document.getElementById('escavador-import-text').value = '';
  document.getElementById('escavador-import-error').style.display = 'none';
  m.style.opacity = '1'; m.style.pointerEvents = 'auto';
  setTimeout(function () { document.getElementById('escavador-import-text').focus(); }, 80);
}
function closeEscavadorImport() {
  var m = document.getElementById('escavador-import-modal');
  if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; }
}
function confirmEscavadorImport() {
  var txt = document.getElementById('escavador-import-text').value.trim();
  var errEl = document.getElementById('escavador-import-error');
  if (!txt || txt.length < 100) {
    errEl.textContent = '❌ Cole o resultado completo gerado pela skill Escavador de Desejos.';
    errEl.style.display = 'block'; return;
  }
  if (!currentProject || !currentProject.avatar) { closeEscavadorImport(); return; }
  // Parse structured data from markdown
  var esc = parseEscavadorMarkdown(txt);
  currentProject.avatar.escavador_desejos = esc;
  saveProjectData();
  closeEscavadorImport();
  // Re-render avatar tab to show the new data
  renderAvatar();
  // Flash success
  var btn = document.querySelector('[onclick="openEscavadorModal()"]');
  if (btn) { var orig = btn.innerHTML; btn.innerHTML = '✓ Importado!'; setTimeout(function () { btn.innerHTML = orig; }, 2000); }
}
function parseEscavadorMarkdown(txt) {
  // Extract structured data from the markdown output
  var esc = {
    gerado_em: new Date().toISOString(),
    perfil_psicologico: '',
    desejos_externos: [],
    desejos_internos: [],
    desejos_proibidos: [],
    vontades_recorrentes: [],
    pequenas_obsessoes: [],
    gostos_pessoais: [],
    gatilhos: { dor: [], desejo: [], vergonha: [] },
    palavras_chave: { dor: [], desejo: [], acao: [], validacao: [], solucao: [] },
    raw_output: txt
  };
  // Parse perfil psicologico
  var perfMatch = txt.match(/##\s*PERFIL PSICOL[ÓO]GICO RESUMIDO\s*\n([\s\S]*?)(?=\n##)/i);
  if (perfMatch) esc.perfil_psicologico = perfMatch[1].trim();
  // Generic parser for desire blocks
  function parseDesires(sectionRegex) {
    var arr = [];
    var sMatch = txt.match(sectionRegex);
    if (!sMatch) return arr;
    var section = sMatch[1];
    var blocks = section.split(/\n###\s+\d+\.\s+/);
    blocks.forEach(function (block) {
      if (!block.trim()) return;
      var lines = block.split('\n');
      var nome = lines[0].replace(/\s*-\s*Pontuação Total.*/, '').trim().replace(/\*\*/g, '');
      var ptMatch = block.match(/Pontuação Total:\s*(\d+)/);
      var intMatch = block.match(/Intensidade:\s*(\d+)/);
      var urgMatch = block.match(/Urgência:\s*(\d+)/);
      var iraMatch = block.match(/Irracionalidade:\s*(\d+)/);
      var subMatch = block.match(/Subconsciente:\s*(\d+)/);
      var autMatch = block.match(/Autossabotagem:\s*(\d+)/);
      var traMatch = block.match(/Trauma:\s*(\d+)/);
      var infMatch = block.match(/Influência:\s*(\d+)/i);
      var trsMatch = block.match(/Transformação:\s*(\d+)/);
      var justMatch = block.match(/\*\*Justificativa\*\*:\s*([\s\S]*?)(?=\n---|\n###|\n##|$)/);
      var classMatch = block.match(/\*\*Classificações\*\*:\s*([^\n]+)/);
      arr.push({
        nome: nome,
        classificacoes: classMatch ? classMatch[1].replace(/\*/g, '').split(',').map(function (s) { return s.trim(); }) : [],
        intensidade: intMatch ? parseInt(intMatch[1]) : 0,
        urgencia: urgMatch ? parseInt(urgMatch[1]) : 0,
        irracionalidade: iraMatch ? parseInt(iraMatch[1]) : 0,
        subconsciente: subMatch ? parseInt(subMatch[1]) : 0,
        autossabotagem: autMatch ? parseInt(autMatch[1]) : 0,
        trauma: traMatch ? parseInt(traMatch[1]) : 0,
        influencia: infMatch ? parseInt(infMatch[1]) : 0,
        transformacao: trsMatch ? parseInt(trsMatch[1]) : 0,
        pontuacao_total: ptMatch ? parseInt(ptMatch[1]) : 0,
        justificativa: justMatch ? justMatch[1].trim() : ''
      });
    });
    return arr;
  }
  esc.desejos_externos = parseDesires(/##\s*TOP\s+10\s+DESEJOS\s+EXTERNOS[\s\S]*?\n([\s\S]*?)(?=\n##\s*TOP)/i);
  esc.desejos_internos = parseDesires(/##\s*TOP\s+10\s+DESEJOS\s+INTERNOS[\s\S]*?\n([\s\S]*?)(?=\n##\s*TOP)/i);
  esc.desejos_proibidos = parseDesires(/##\s*TOP\s+5\s+DESEJOS\s+PROIBIDOS[\s\S]*?\n([\s\S]*?)(?=\n##\s*TOP)/i);
  // Parse palavras-chave sections
  function parsePalavras(sectionName) {
    var rx = new RegExp('###\\s+' + sectionName + '[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n###|\\n##|$)', 'i');
    var m = txt.match(rx);
    if (!m) return [];
    return m[1].match(/[-*]\s+\*\*(.+?)\*\*/g)
      ? m[1].match(/[-*]\s+\*\*(.+?)\*\*/g).map(function (s) { return s.replace(/[-*\s*]/g, '').replace(/\*\*/g, '').trim(); })
      : m[1].match(/\*\*(.+?)\*\*/g)
        ? m[1].match(/\*\*(.+?)\*\*/g).map(function (s) { return s.replace(/\*\*/g, '').trim(); })
        : [];
  }
  esc.palavras_chave.dor = parsePalavras('PALAVRAS DE DOR');
  esc.palavras_chave.desejo = parsePalavras('PALAVRAS DE DESEJO');
  esc.palavras_chave.acao = parsePalavras('PALAVRAS DE AÇÃO');
  esc.palavras_chave.validacao = parsePalavras('PALAVRAS DE VALIDAÇÃO');
  esc.palavras_chave.solucao = parsePalavras('PALAVRAS DE SOLUÇÃO');
  return esc;
}

// ═══════════════════════════════════════════════════════
//  DELETE PROJECT (senha protegida)
// ═══════════════════════════════════════════════════════
function openDeleteProject() {
  var m = document.getElementById('delete-project-modal');
  if (!m) return;
  document.getElementById('dp-senha').value = '';
  document.getElementById('dp-error').style.display = 'none';
  document.getElementById('dp-project-name').textContent = currentProject ? currentProject.nome : '';
  m.style.opacity = '1'; m.style.pointerEvents = 'auto';
  setTimeout(function () { document.getElementById('dp-senha').focus(); }, 80);
}
function closeDeleteProject() {
  var m = document.getElementById('delete-project-modal');
  if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; }
}
function confirmDeleteProject() {
  var senha = document.getElementById('dp-senha').value;
  var errEl = document.getElementById('dp-error');
  if (senha !== '464321') {
    errEl.textContent = '❌ Senha incorreta.';
    errEl.style.display = 'block';
    document.getElementById('dp-senha').value = '';
    document.getElementById('dp-senha').focus();
    return;
  }
  var proj = currentProject;
  if (!proj) { closeDeleteProject(); return; }

  // 1) marca como deletado (impede reaparecer via seed)
  if (typeof markProjectDeleted === 'function') markProjectDeleted(proj.id);

  // 2) remove de custom local
  var custom = projectsGetCustom().filter(function (p) { return p.id !== proj.id; });
  projectsSaveCustom(custom);

  // 3) remove imediatamente da memória
  PROJECTS = PROJECTS.filter(function (p) { return p.id !== proj.id; });
  window.projects = PROJECTS;

  // 4) remove do Supabase (best effort)
  if (typeof SB !== 'undefined' && SB.lett) SB.lett(proj.id);

  // 5) fecha modal e volta ao overview
  closeDeleteProject();
  currentProject = null;
  document.getElementById('view-project').classList.remove('active');
  document.getElementById('view-overview').classList.add('active');
  renderSidebar();
  if (typeof updateMetrics === 'function') updateMetrics();
  if (typeof renderOverviewProjects === 'function') renderOverviewProjects();
}

// ═══════════════════════════════════════════════════════
//  KPIS TAB
// ═══════════════════════════════════════════════════════
function renderKPIs() {
  const p = currentProject;
  const k = p.kpis || {};
  const m = k.meta || {};
  const el = document.getElementById('tab-kpis');

  function kpiCard(label, key, unit = '', suffix = '', benchmarkGood, benchmarkWarn) {
    const val = k[key];
    let statusClass = 'kpi-neutral', statusText = 'Sem dados';
    if (val !== null && val !== undefined) {
      if (benchmarkGood && val >= benchmarkGood) { statusClass = 'kpi-good'; statusText = '● Ótimo'; }
      else if (benchmarkWarn && val >= benchmarkWarn) { statusClass = 'kpi-warn'; statusText = '● Atenção'; }
      else if (benchmarkWarn) { statusClass = 'kpi-bad'; statusText = '● Crítico'; }
      else { statusClass = 'kpi-neutral'; statusText = ''; }
    }
    const display = val !== null && val !== undefined ? unit + val + suffix : '—';
    return `<div class="kpi-card">
      <input class="kpi-input" value="${val !== null && val !== undefined ? val : ''}" placeholder="—" type="number" step="0.01" onblur="saveKPI('${key}',this.value)" title="${label}">
      <div class="kpi-label">${label}</div>
      <div class="kpi-status ${statusClass}">${statusText}</div>
    </div>`;
  }

  el.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <div style="font-size:14px; font-weight:600; color:var(--text)">📊 KPIs: ${p.nome}</div>
      <button class="btn btn-sm btn-gold" onclick="openAgent('trafego','data_analyst')">📈 Analista de Dados</button>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🎯 Métricas Atuais — clique para editar</div>
      <div class="kpi-grid">
        ${kpiCard('Thumbstop %', 'thumbstop', '', '%', 25, 15)}
        ${kpiCard('CTR %', 'ctr', '', '%', 2, 1)}
        ${kpiCard('CPM R$', 'cpm', 'R$', '', null, null)}
        ${kpiCard('CPC R$', 'cpc', 'R$', '', null, null)}
        ${kpiCard('ROAS', 'roas', '', 'x', 3, 1.5)}
        ${kpiCard('CAC R$', 'cac', 'R$', '', null, null)}
        ${kpiCard('LTV R$', 'ltv', 'R$', '', null, null)}
        ${kpiCard('CVR %', 'cvr', '', '%', 3, 1)}
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🏆 Metas do Projeto</div>
      <div class="grid2">
        <div class="brief-field">
          <div class="brief-label">ROAS Target</div>
          <input class="brief-input" type="number" step="0.1" value="${m.roas_target || ''}" placeholder="Ex: 3.0" onblur="saveKPIMeta('roas_target',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">CPA Target (R$)</div>
          <input class="brief-input" type="number" step="1" value="${m.cpa_target || ''}" placeholder="Ex: 80" onblur="saveKPIMeta('cpa_target',this.value)">
        </div>
      </div>
    </div>

    ${k.roas && m.roas_target ? `
    <div class="card" style="border-color:${k.roas >= m.roas_target ? 'rgba(82,183,136,.3)' : 'rgba(230,57,70,.3)'}">
      <div class="card-title">📡 Diagnóstico Rápido</div>
      <div style="font-size:12px; color:var(--text2); line-height:1.8">
        ${k.roas >= m.roas_target
        ? `✅ ROAS <strong style="color:var(--green-bright)">${k.roas}x</strong> acima da meta de ${m.roas_target}x — campanha lucrativa.`
        : `⚠️ ROAS <strong style="color:var(--red-bright)">${k.roas}x</strong> abaixo da meta de ${m.roas_target}x — revisar criativos ou segmentação.`}
        ${k.thumbstop && k.thumbstop < 15 ? '<br>🚨 Thumbstop Rate baixo (' + k.thumbstop + '%) — o hook visual não está prendendo. Testar novos criativos com urgência.' : ''}
        ${k.ctr && k.ctr < 1 ? '<br>🚨 CTR baixo (' + k.ctr + '%) — copy do anúncio ou targeting fraco. Revisar segmentação e headline.' : ''}
      </div>
    </div>` : ''}`;
}

function saveKPI(key, value) {
  if (!currentProject.kpis) currentProject.kpis = {};
  currentProject.kpis[key] = value ? parseFloat(value) : null;
  renderKPIs();
}

function saveKPIMeta(key, value) {
  if (!currentProject.kpis) currentProject.kpis = {};
  if (!currentProject.kpis.meta) currentProject.kpis.meta = {};
  currentProject.kpis.meta[key] = value ? parseFloat(value) : null;
}

// Close modals on backdrop click
document.getElementById('agent-modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
document.getElementById('settings-modal').addEventListener('click', function (e) {
  if (e.target === this) closeSettings();
});

// Init API status indicator
(function initAPIStatus() {
  const key = localStorage.getItem('openrouter_key');
  if (key) {
    const pill = document.getElementById('api-status-pill');
    pill.style.background = 'rgba(82,183,136,.15)';
    pill.style.color = 'var(--green-bright)';
    pill.style.borderColor = 'rgba(82,183,136,.3)';
    pill.textContent = '⚙ API ✓';
  }
})();

// ═══════════════════════════════════════════════════════
//  BUSCA GLOBAL (Sprint 1.3) — Ctrl+K
// ═══════════════════════════════════════════════════════
function globalSearch(q) {
  if (!q) return [];
  const qL = q.toLowerCase();
  const results = [];
  (window.PROJECTS || []).forEach(p => {
    if ([p.nome, p.produto, p.categoria].some(v => (v || '').toLowerCase().includes(qL)))
      results.push({ type: 'projeto', icon: p.icon || '📁', label: p.nome, sub: p.categoria, action: () => openProject(p.id) });
  });
  (typeof DOCS !== 'undefined' ? DOCS : []).forEach(d => {
    if ([d.title, d.body, d.cat].some(v => (v || '').toLowerCase().includes(qL)))
      results.push({ type: 'doc', icon: '📄', label: d.title, sub: (d.cat || '') + (d.project ? ' · ' + d.project : ''), action: () => { showDocsGlobal(); setTimeout(() => openDocModal(null, d.id), 100); } });
  });
  (typeof knCards !== 'undefined' ? knCards : []).forEach(c => {
    if ([c.title, c.notes, c.project].some(v => (v || '').toLowerCase().includes(qL)))
      results.push({ type: 'kanban', icon: '🗂', label: c.title, sub: (c.project || '') + ' · ' + ({ backlog: 'Backlog', doing: 'Fazendo', stuck: 'Travado', done: 'Feito' }[c.status] || c.status), action: () => { showKanban(); setTimeout(() => openKanbanModal(null, c.id), 150); } });
  });
  (typeof getLinks === 'function' ? getLinks() : []).forEach(l => {
    if ([l.title, l.url].some(v => (v || '').toLowerCase().includes(qL)))
      results.push({ type: 'link', icon: '🔗', label: l.title || l.url, sub: l.url, action: () => window.open(l.url, '_blank') });
  });
  return results.slice(0, 12);
}

function openGlobalSearch() {
  if (document.getElementById('gs-modal')) { document.getElementById('gs-modal').remove(); return; }
  const m = document.createElement('div');
  m.id = 'gs-modal';
  m.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding-top:80px;background:rgba(0,0,0,.7);backdrop-filter:blur(6px)';
  m.innerHTML = `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;width:520px;max-width:95vw;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.5)">
    <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--border)">
      <span style="font-size:16px;opacity:.5">🔍</span>
      <input id="gs-input" type="text" placeholder="Buscar projetos, docs, tarefas, links…"
        style="flex:1;background:none;border:none;outline:none;font-size:15px;color:var(--text);caret-color:var(--gold)" autocomplete="off">
      <kbd style="font-size:10px;color:var(--text3);background:var(--surface2);border:1px solid var(--border);border-radius:4px;padding:2px 6px">ESC</kbd>
    </div>
    <div id="gs-results" style="max-height:380px;overflow-y:auto;padding:6px">
      <div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Digite para buscar…</div>
    </div>
  </div>`;
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  document.body.appendChild(m);
  const input = document.getElementById('gs-input');
  const resultsEl = document.getElementById('gs-results');
  const tColor = { projeto: '#c9a84c', doc: '#7aa2f7', kanban: '#9b7fe8', link: '#52b788' };
  const tRgb = { projeto: '201,168,76', doc: '122,162,247', kanban: '155,127,232', link: '82,183,136' };
  const tLabel = { projeto: 'PROJ', doc: 'DOC', kanban: 'TASK', link: 'LINK' };
  function render(q) {
    const items = globalSearch(q);
    window._gsAct = items.map(r => r.action);
    if (!q) { resultsEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Digite para buscar…</div>'; return; }
    if (!items.length) { resultsEl.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Sem resultados para "<b>${q}</b>"</div>`; return; }
    resultsEl.innerHTML = items.map((r, i) =>
      `<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;border-radius:8px;transition:background .1s"
        onmouseover="this.style.background='rgba(201,168,76,.08)'" onmouseout="this.style.background=''"
        onclick="document.getElementById('gs-modal').remove();window._gsAct[${i}]()">
        <span style="font-size:18px;width:24px;text-align:center">${r.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.label}</div>
          <div style="font-size:11px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.sub || ''}</div>
        </div>
        <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;background:rgba(${tRgb[r.type]},.12);color:${tColor[r.type]}">${tLabel[r.type]}</span>
      </div>`
    ).join('');
  }
  input.addEventListener('input', () => render(input.value.trim()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') m.remove();
    if (e.key === 'Enter') { const f = resultsEl.querySelector('[onclick]'); if (f) f.click(); }
  });
  input.focus();
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openGlobalSearch(); }
});
