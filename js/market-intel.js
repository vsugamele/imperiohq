// ═══════════════════════════════════════════════════════
//  MARKET INTEL — Inteligência de Mercado
//  Dados via Supabase | Análises via OpenRouter
// ═══════════════════════════════════════════════════════

let MI = {
    opportunities: [],
    copyAngles: [],
    analyses: [],
    activeTab: 'oportunidades',
    filterNicho: '',
    filterScore: 0,
    filterDias: '',
    decideStep: 0,
    decideAnswers: {},
};

// ── Mostrar View ─────────────────────────────────────────
function showMarketIntel() {
    hideAllPanels && hideAllPanels();
    document.getElementById('view-market-intel')?.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-market-intel')?.classList.add('active');
    miLoad();
}

// ── Carregar dados do Supabase ─────────────────────────
async function miLoad() {
    const body = document.getElementById('mi-body');
    if (!body) return;
    body.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text3)"><div style="font-size:32px;margin-bottom:12px">⏳</div><div>Carregando inteligência de mercado...</div></div>`;
    try {
        const [opRes, cpRes, anRes] = await Promise.all([
            _sb.from('imphq_mi_opportunities').select('*').eq('ativo', true).order('score', { ascending: false }),
            _sb.from('imphq_mi_copy_angles').select('*').order('created_at'),
            _sb.from('imphq_mi_analyses').select('*').order('created_at', { ascending: false }).limit(20),
        ]);
        MI.opportunities = opRes.data || [];
        MI.copyAngles = cpRes.data || [];
        MI.analyses = anRes.data || [];
        miRender();
    } catch (e) {
        body.innerHTML = `<div style="text-align:center;padding:60px;color:#e05c5c">❌ Erro ao carregar: ${e.message}</div>`;
    }
}

// ── Render Principal ─────────────────────────────────
function miRender() {
    const body = document.getElementById('mi-body');
    if (!body) return;
    body.innerHTML = `
    <!-- Tabs -->
    <div style="display:flex;gap:2px;margin-bottom:20px;background:var(--surface2);border-radius:10px;padding:4px;width:fit-content">
      ${[
            ['oportunidades', '🎯 Oportunidades'],
            ['fabrica', '🏭 Fábrica de Ofertas'],
            ['copy', '✍️ Ângulos de Copy'],
            ['analises', '🤖 Análises AI'],
            ['decidir', '⚡ Decidir Agora'],
        ].map(([k, label]) => `
        <button onclick="miSwitchTab('${k}')" id="mi-tab-${k}"
          style="padding:8px 16px;border-radius:7px;border:none;font-size:12px;font-weight:600;cursor:pointer;transition:.15s;
            ${MI.activeTab === k
                ? 'background:var(--gold);color:#0a0a0f'
                : 'background:transparent;color:var(--text2)'}">
          ${label}
        </button>
      `).join('')}
    </div>
    <!-- Tab Content -->
    <div id="mi-tab-content"></div>
  `;
    miRenderTab();
}

function miSwitchTab(tab) {
    MI.activeTab = tab;
    miRender();
}

function miRenderTab() {
    const el = document.getElementById('mi-tab-content');
    if (!el) return;
    if (MI.activeTab === 'oportunidades') el.innerHTML = miTabOportunidades();
    else if (MI.activeTab === 'fabrica') el.innerHTML = miTabFabrica();
    else if (MI.activeTab === 'copy') el.innerHTML = miTabCopy();
    else if (MI.activeTab === 'analises') el.innerHTML = miTabAnalises();
    else if (MI.activeTab === 'decidir') { el.innerHTML = ''; miTabDecidir(el); }
}

// ── TAB 1: Oportunidades ──────────────────────────────
function miTabOportunidades() {
    const nichos = [...new Set(MI.opportunities.map(o => o.nicho))];
    let filtered = MI.opportunities.filter(o => {
        if (MI.filterNicho && o.nicho !== MI.filterNicho) return false;
        if (MI.filterScore && o.score < MI.filterScore) return false;
        if (MI.filterDias === '1-3') {
            const d = parseInt(o.dias_criacao);
            if (d > 3) return false;
        }
        if (MI.filterDias === '4-7') {
            const d = parseInt(o.dias_criacao);
            if (d < 4 || d > 7) return false;
        }
        return true;
    });

    return `
    <!-- Filtros -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <select onchange="MI.filterNicho=this.value;miRender()" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:6px 10px;font-size:12px;color:var(--text);cursor:pointer">
        <option value="">Todos os nichos</option>
        ${nichos.map(n => `<option value="${n}" ${MI.filterNicho === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
      <select onchange="MI.filterScore=parseFloat(this.value);miRender()" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:6px 10px;font-size:12px;color:var(--text);cursor:pointer">
        <option value="0">Qualquer score</option>
        <option value="9.5" ${MI.filterScore === 9.5 ? 'selected' : ''}>Score ≥ 9.5</option>
        <option value="9.0" ${MI.filterScore === 9.0 ? 'selected' : ''}>Score ≥ 9.0</option>
      </select>
      <select onchange="MI.filterDias=this.value;miRender()" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:6px 10px;font-size:12px;color:var(--text);cursor:pointer">
        <option value="">Qualquer prazo</option>
        <option value="1-3" ${MI.filterDias === '1-3' ? 'selected' : ''}>Até 3 dias</option>
        <option value="4-7" ${MI.filterDias === '4-7' ? 'selected' : ''}>4-7 dias</option>
      </select>
      <span style="font-size:11px;color:var(--text3);align-self:center">${filtered.length} de ${MI.opportunities.length} oportunidades</span>
      <button onclick="miNewOpportunity()" style="margin-left:auto;background:var(--gold);color:#0a0a0f;border:none;padding:6px 14px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer">+ Nova</button>
    </div>
    <!-- Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">
      ${filtered.map(o => miOpportunityCard(o)).join('')}
      ${filtered.length === 0 ? `<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text3)">🔍 Nenhuma oportunidade encontrada</div>` : ''}
    </div>
  `;
}

function miOpportunityCard(o) {
    const scoreColor = o.score >= 9.5 ? '#52b788' : o.score >= 9.0 ? 'var(--gold)' : '#e8844a';
    const scoreBg = o.score >= 9.5 ? 'rgba(82,183,136,.12)' : o.score >= 9.0 ? 'rgba(212,168,67,.12)' : 'rgba(232,132,74,.12)';
    const scoreLabel = o.score >= 9.5 ? '🚀 ATACAR AGORA' : o.score >= 9.0 ? '⚡ ALTA PRIORIDADE' : '📋 CONSIDERAR';
    const flagIcons = { 'EVERGREEN': '🟢', 'TENDÊNCIA': '⚡', 'ESCONDIDO': '💎', 'EMERGENTE': '🆕', 'SATURADO': '🔴', 'NARRATIVA': '🔗' };
    const flagHtml = (o.flags || []).map(f => `<span style="font-size:10px;padding:2px 6px;background:var(--surface2);border-radius:4px;color:var(--text3)">${flagIcons[f] || ''} ${f}</span>`).join(' ');
    const barW = Math.round(((o.score - 8.5) / 1.5) * 100);

    return `
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:16px;cursor:pointer;transition:.15s"
         onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border2)'"
         onclick="miOpenOpDetail('${o.id}')">
      <!-- Header -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--text3);margin-bottom:3px">${o.nicho}</div>
          <div style="font-size:13px;font-weight:800;color:var(--text);line-height:1.3">${o.produto}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">${o.micro_nicho}</div>
        </div>
        <div style="text-align:center;background:${scoreBg};border-radius:8px;padding:6px 10px;min-width:52px;flex-shrink:0">
          <div style="font-size:18px;font-weight:900;color:${scoreColor};line-height:1">${o.score}</div>
          <div style="font-size:8px;color:${scoreColor};font-weight:700;margin-top:2px">/10</div>
        </div>
      </div>
      <!-- Score bar -->
      <div style="height:4px;background:var(--surface2);border-radius:2px;margin-bottom:10px">
        <div style="height:4px;background:${scoreColor};border-radius:2px;width:${barW}%;transition:width .4s"></div>
      </div>
      <!-- Stats -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <span style="font-size:11px;color:var(--gold);font-weight:700">💰 R$${o.ticket?.toFixed(0)}</span>
        <span style="font-size:11px;color:var(--text3)">⏱ ${o.dias_criacao} dias</span>
        <span style="font-size:11px;color:var(--text3)">📦 ${o.bump || '—'}</span>
        ${o.sem_rosto ? '<span style="font-size:11px;color:#52b788">👻 Sem rosto</span>' : ''}
      </div>
      <!-- Flags -->
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">${flagHtml}</div>
      <!-- Score label -->
      <div style="font-size:10px;font-weight:700;color:${scoreColor}">${scoreLabel}</div>
    </div>
  `;
}

// ── TAB 2: Fábrica de Ofertas ──────────────────────────
function miTabFabrica() {
    const sorted = [...MI.opportunities].sort((a, b) => parseInt(a.dias_criacao) - parseInt(b.dias_criacao));
    const groups = { '1-2': [], '3-5': [], '5-7': [], '7-12': [] };
    sorted.forEach(o => {
        const d = parseInt(o.dias_criacao);
        if (d <= 2) groups['1-2'].push(o);
        else if (d <= 5) groups['3-5'].push(o);
        else if (d <= 7) groups['5-7'].push(o);
        else groups['7-12'].push(o);
    });

    return `
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">Da ideia ao produto — por velocidade de lançamento</div>
      <div style="font-size:11px;color:var(--text3)">Todos os produtos podem ser criados 100% por IA, sem aparecer em câmera</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
      ${Object.entries(groups).map(([label, items], i) => {
        const colors = ['#52b788', 'var(--gold)', '#e8844a', '#9b5de5'];
        const color = colors[i];
        return `
          <div>
            <div style="text-align:center;padding:8px;background:rgba(${colorRgb(color)},.1);border:1px solid rgba(${colorRgb(color)},.25);border-radius:8px;margin-bottom:8px">
              <div style="font-size:18px;font-weight:900;color:${color}">${label}</div>
              <div style="font-size:10px;color:var(--text3);font-weight:600">DIAS</div>
            </div>
            ${items.map(o => `
              <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:6px">
                <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:4px">${o.produto}</div>
                <div style="font-size:10px;color:var(--text3);margin-bottom:4px">${o.formato || '—'}</div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:10px;color:var(--gold);font-weight:700">R$${o.ticket?.toFixed(0)}</span>
                  <span style="font-size:9px;color:var(--text3)">${o.custo_criacao || '—'}</span>
                </div>
              </div>
            `).join('')}
            ${items.length === 0 ? `<div style="font-size:11px;color:var(--text3);text-align:center;padding:20px 0">—</div>` : ''}
          </div>
        `;
    }).join('')}
    </div>
  `;
}

function colorRgb(color) {
    if (color === '#52b788') return '82,183,136';
    if (color === 'var(--gold)') return '212,168,67';
    if (color === '#e8844a') return '232,132,74';
    return '155,93,229';
}

// ── TAB 3: Ângulos de Copy ─────────────────────────────
function miTabCopy() {
    return `
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">Biblioteca de Ângulos — 12 gatilhos testados</div>
      <div style="font-size:11px;color:var(--text3)">Cada ângulo tem CTR esperado e hook de exemplo pronto para usar</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px">
      ${MI.copyAngles.map((a, i) => `
        <div style="background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:14px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div style="font-size:12px;font-weight:800;color:var(--text)">${a.nome}</div>
            <span style="font-size:10px;background:rgba(82,183,136,.12);color:#52b788;border-radius:4px;padding:2px 6px;font-weight:700;white-space:nowrap;flex-shrink:0;margin-left:8px">${a.ctr_esperado} CTR</span>
          </div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;line-height:1.5">${a.descricao}</div>
          ${a.hook_exemplo ? `
            <div style="background:var(--surface2);border-left:3px solid var(--gold);border-radius:0 6px 6px 0;padding:8px 10px;margin-bottom:8px">
              <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">HOOK DE EXEMPLO</div>
              <div style="font-size:11px;color:var(--text);font-style:italic;line-height:1.5">"${a.hook_exemplo}"</div>
            </div>
          ` : ''}
          <div style="font-size:10px;color:var(--text3)">🎯 ${a.melhor_para}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── TAB 4: Análises AI ─────────────────────────────────
function miTabAnalises() {
    return `
    <!-- Nova análise -->
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:16px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:12px">🤖 Nova Análise de Mercado via OpenRouter</div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <select id="mi-an-tipo" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:7px 10px;font-size:12px;color:var(--text);flex:1;cursor:pointer">
          <option value="DISCOVERY">DISCOVERY — O que está vendendo num nicho?</option>
          <option value="DEEP DIVE">DEEP DIVE — Sub-nichos e micro-nichos</option>
          <option value="SPY">SPY — Espionar concorrente/produto</option>
          <option value="MAPA">MAPA — Mapa de produtos a partir de temas</option>
          <option value="COPY">COPY — Ângulos e hooks de copy</option>
          <option value="VALIDAÇÃO">VALIDAÇÃO — Validar ideia de produto</option>
        </select>
        <select id="mi-an-model" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:7px 10px;font-size:12px;color:var(--text);cursor:pointer">
          <option value="anthropic/claude-opus-4">Claude Opus 4</option>
          <option value="anthropic/claude-sonnet-4-5" selected>Claude Sonnet 4.5</option>
          <option value="google/gemini-2.5-pro-preview">Gemini 2.5 Pro</option>
          <option value="openai/gpt-4o">GPT-4o</option>
        </select>
      </div>
      <textarea id="mi-an-prompt" rows="4" style="width:100%;box-sizing:border-box;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;font-size:12px;color:var(--text);resize:vertical;line-height:1.6;font-family:inherit;outline:none"
        placeholder="Ex: Analise o nicho de ansiedade com foco em jovens 18-30 anos. Quero saber os sub-nichos mais quentes, produtos existentes e o melhor ângulo de copy."></textarea>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
        <span style="font-size:11px;color:var(--text3);align-self:center">Usa o OpenRouter configurado em ⚙️ Settings</span>
        <button onclick="miRunAnalysis()"
          style="background:var(--gold);color:#0a0a0f;border:none;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer" id="mi-run-btn">
          ▶ Analisar
        </button>
      </div>
    </div>
    <!-- Análises salvas -->
    <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:10px">Análises Anteriores (${MI.analyses.length})</div>
    <div id="mi-analyses-list">
      ${MI.analyses.length === 0
            ? `<div style="text-align:center;padding:40px;color:var(--text3);font-size:13px">Nenhuma análise ainda. Execute a primeira acima.</div>`
            : MI.analyses.map(a => miAnalysisCard(a)).join('')}
    </div>
  `;
}

function miAnalysisCard(a) {
    const dt = new Date(a.created_at).toLocaleDateString('pt-BR');
    const preview = (a.output_md || '').replace(/[#*`]/g, '').slice(0, 200) + '...';
    return `
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:14px;margin-bottom:8px;cursor:pointer"
         onclick="this.querySelector('.mi-an-full').style.display = this.querySelector('.mi-an-full').style.display==='none' ? 'block' : 'none'">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(212,168,67,.12);color:var(--gold)">${a.tipo}</span>
        <span style="font-size:11px;color:var(--text2);font-weight:600">${a.nicho || 'Geral'}</span>
        <span style="font-size:10px;color:var(--text3);margin-left:auto">${dt} · ${a.model?.split('/')[1] || a.model}</span>
      </div>
      <div style="font-size:11px;color:var(--text3);line-height:1.5">${preview}</div>
      <div class="mi-an-full" style="display:none;margin-top:12px">
        <div style="border-top:1px solid var(--border);padding-top:12px">
          <div style="font-size:11px;color:var(--text2);white-space:pre-wrap;line-height:1.7">${(a.output_md || '').replace(/</g, '&lt;')}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:8px;gap:6px">
          <button onclick="event.stopPropagation();miDeleteAnalysis('${a.id}')"
            style="font-size:11px;padding:4px 10px;border-radius:5px;border:1px solid rgba(224,92,92,.3);background:rgba(224,92,92,.08);color:#e05c5c;cursor:pointer">🗑 Excluir</button>
          <button onclick="event.stopPropagation();miSaveOpFromAnalysis('${a.id}')"
            style="font-size:11px;padding:4px 10px;border-radius:5px;border:1px solid rgba(82,183,136,.3);background:rgba(82,183,136,.08);color:#52b788;cursor:pointer">+ Salvar como Oportunidade</button>
        </div>
      </div>
    </div>
  `;
}

// ── TAB 5: Decidir Agora ──────────────────────────────
function miTabDecidir(container) {
    const q = [
        {
            key: 'tempo', label: 'Quanto tempo você tem para criar?', opts: [
                { v: 'urgente', l: '⚡ 1-3 dias — quero lançar rápido' },
                { v: 'normal', l: '📋 4-7 dias — ritmo normal' },
                { v: 'longo', l: '🏗️ 7+ dias — posso me dedicar' },
            ]
        },
        {
            key: 'ticket', label: 'Qual faixa de ticket você prefere?', opts: [
                { v: 'baixo', l: '🪙 Até R$37 — entrada fácil, volume' },
                { v: 'medio', l: '💰 R$37-97 — equilibrio' },
                { v: 'alto', l: '💎 R$97+ — posicionamento premium' },
            ]
        },
        {
            key: 'nicho', label: 'Qual nicho te interessa mais?', opts: [
                { v: 'SAÚDE', l: '💊 Saúde e bem-estar' },
                { v: 'FINANÇAS', l: '💵 Finanças e renda online' },
                { v: 'RELAC.', l: '❤️ Relacionamentos' },
                { v: 'ESPIRIT.', l: '🔮 Espiritualidade' },
                { v: 'qualquer', l: '🎲 Qualquer um — me surpreende' },
            ]
        },
    ];

    function renderStep() {
        if (MI.decideStep >= q.length) {
            renderResult();
            return;
        }
        const step = q[MI.decideStep];
        container.innerHTML = `
      <div style="max-width:560px;margin:0 auto">
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:11px;color:var(--text3);margin-bottom:4px">PASSO ${MI.decideStep + 1} de ${q.length}</div>
          <div style="font-size:16px;font-weight:800;color:var(--text)">${step.label}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${step.opts.map(opt => `
            <button onclick="miDecideAnswer('${step.key}','${opt.v}')"
              style="background:var(--surface);border:2px solid var(--border2);border-radius:10px;padding:14px 18px;
                     font-size:13px;color:var(--text);cursor:pointer;text-align:left;font-weight:600;transition:.15s"
              onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border2)'">
              ${opt.l}
            </button>
          `).join('')}
        </div>
        ${MI.decideStep > 0 ? `
          <button onclick="MI.decideStep--;miTabDecidir(document.getElementById('mi-tab-content'))"
            style="margin-top:14px;background:transparent;border:none;color:var(--text3);font-size:12px;cursor:pointer">
            ← Voltar
          </button>
        ` : ''}
      </div>
    `;
    }

    function renderResult() {
        const { tempo, ticket, nicho } = MI.decideAnswers;
        const maxDias = tempo === 'urgente' ? 3 : tempo === 'normal' ? 7 : 999;
        const minTicket = ticket === 'baixo' ? 0 : ticket === 'medio' ? 37 : 97;
        const maxTicket = ticket === 'baixo' ? 37 : ticket === 'medio' ? 97 : 9999;

        let matches = MI.opportunities.filter(o => {
            const d = parseInt(o.dias_criacao);
            const t = o.ticket || 0;
            const n = nicho === 'qualquer' || o.nicho === nicho;
            return d <= maxDias && t >= minTicket && t <= maxTicket && n;
        }).sort((a, b) => b.score - a.score);

        const best = matches[0];
        container.innerHTML = `
      <div style="max-width:600px;margin:0 auto">
        ${best ? `
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:32px;margin-bottom:8px">🚀</div>
            <div style="font-size:18px;font-weight:900;color:var(--text)">Sua melhor oportunidade hoje:</div>
          </div>
          <div style="background:linear-gradient(135deg,rgba(212,168,67,.1),rgba(82,183,136,.08));border:2px solid var(--gold);border-radius:14px;padding:24px;margin-bottom:16px">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${best.nicho} · ${best.sub_nicho}</div>
            <div style="font-size:22px;font-weight:900;color:var(--text);margin-bottom:8px">${best.produto}</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:16px;">${best.nano_publico}</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
              ${[
                    ['Score', `${best.score}/10`, '#52b788'],
                    ['Ticket', `R$${best.ticket}`, 'var(--gold)'],
                    ['Bump', best.bump, 'var(--text2)'],
                    ['Criação', `${best.dias_criacao} dias`, 'var(--text2)'],
                ].map(([l, v, c]) => `
                <div style="text-align:center;background:var(--surface2);border-radius:8px;padding:10px">
                  <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${l}</div>
                  <div style="font-size:13px;font-weight:800;color:${c}">${v || '—'}</div>
                </div>
              `).join('')}
            </div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:4px">📦 Formato: ${best.formato || '—'}</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:4px">💸 Custo: ${best.custo_criacao || 'R$0'}</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:4px">🎯 Plataforma: ${best.plataforma || '—'}</div>
            <div style="font-size:12px;color:var(--text3)">✍️ Ângulo: ${best.angulo_principal || '—'}</div>
          </div>
          ${matches.slice(1, 3).length > 0 ? `
            <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px">Outras opções que match:</div>
            ${matches.slice(1, 3).map(o => `
              <div style="background:var(--surface);border:1px solid var(--border2);border-radius:8px;padding:10px 14px;margin-bottom:6px;display:flex;justify-content:space-between">
                <div style="font-size:12px;font-weight:600;color:var(--text)">${o.produto}</div>
                <div style="display:flex;gap:10px;font-size:11px;color:var(--text3)">
                  <span style="color:var(--gold)">R$${o.ticket}</span>
                  <span>${o.score}/10</span>
                </div>
              </div>
            `).join('')}
          ` : ''}
        ` : `
          <div style="text-align:center;padding:40px;color:var(--text3)">
            <div style="font-size:36px;margin-bottom:12px">😕</div>
            <div style="font-size:14px">Nenhuma oportunidade match com seus critérios.</div>
            <div style="font-size:12px;margin-top:6px">Tente ampliar os filtros.</div>
          </div>
        `}
        <div style="text-align:center;margin-top:20px">
          <button onclick="MI.decideStep=0;MI.decideAnswers={};miTabDecidir(document.getElementById('mi-tab-content'))"
            style="background:var(--surface2);border:1px solid var(--border2);color:var(--text2);padding:8px 20px;border-radius:8px;font-size:12px;cursor:pointer">
            🔄 Tentar de novo
          </button>
        </div>
      </div>
    `;
    }

    MI.decideStep = MI.decideStep || 0;
    renderStep();

    window.miDecideAnswer = function (key, value) {
        MI.decideAnswers[key] = value;
        MI.decideStep++;
        renderStep();
    };
}

// ── Executar Análise via OpenRouter ────────────────────
async function miRunAnalysis() {
    const prompt = document.getElementById('mi-an-prompt')?.value.trim();
    if (!prompt) { alert('Digite o que você quer analisar.'); return; }
    const tipo = document.getElementById('mi-an-tipo')?.value;
    const model = document.getElementById('mi-an-model')?.value;
    const apiKey = localStorage.getItem('openrouter_key') || '';
    if (!apiKey) { alert('Configure sua OpenRouter API Key em ⚙️ Settings primeiro.'); return; }

    const btn = document.getElementById('mi-run-btn');
    if (btn) btn.textContent = '⏳ Analisando...';
    if (btn) btn.disabled = true;

    const systemPrompt = `Você é um especialista em inteligência de mercado para infoprodutos brasileiros.
Modo: ${tipo}
Regras: pesquise nichos, sub-nichos, produtos, ângulos de copy. Entregue análise estruturada em Markdown.
Use headers (##), tabelas, bullets e scores /10 nos critérios: Demanda, Anúncios ativos, Saturação, Ticket viável, Funil com bump/upsell.
Seja objetivo, direto e baseado em dados reais do mercado brasileiro (Hotmart, Kiwify, Monetizze).`;

    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://imperio-hq.vercel.app',
                'X-Title': 'Império HQ — Market Intel',
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 4096,
            }),
        });
        const data = await res.json();
        const output = data.choices?.[0]?.message?.content || '❌ Sem resposta';
        const tokens = data.usage?.total_tokens || 0;
        const nicho = prompt.split(' ').slice(0, 3).join(' ');

        // Salvar no Supabase
        const { data: saved } = await _sb.from('imphq_mi_analyses').insert({
            tipo, nicho, input_prompt: prompt, output_md: output, model, tokens_usado: tokens, status: 'done',
        }).select().single();

        if (saved) MI.analyses.unshift(saved);
        // Refresh tab
        MI.activeTab = 'analises';
        miRender();
    } catch (e) {
        alert('Erro ao chamar OpenRouter: ' + e.message);
        if (btn) { btn.textContent = '▶ Analisar'; btn.disabled = false; }
    }
}

// ── Excluir Análise ────────────────────────────────────
async function miDeleteAnalysis(id) {
    if (!confirm('Excluir esta análise?')) return;
    await _sb.from('imphq_mi_analyses').delete().eq('id', id);
    MI.analyses = MI.analyses.filter(a => a.id !== id);
    document.getElementById('mi-analyses-list').innerHTML = MI.analyses.length === 0
        ? `<div style="text-align:center;padding:40px;color:var(--text3)">Nenhuma análise</div>`
        : MI.analyses.map(a => miAnalysisCard(a)).join('');
}

// ── Nova oportunidade manual ────────────────────────────
function miNewOpportunity() {
    const m = document.createElement('div');
    m.id = 'mi-op-modal';
    m.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:20px';
    m.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:14px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:15px;font-weight:800">+ Nova Oportunidade</div>
        <button onclick="document.getElementById('mi-op-modal').remove()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:20px">×</button>
      </div>
      <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">
        ${[
            ['Produto *', 'mi-new-produto', 'text', 'Ex: Afiliado Fantasma'],
            ['Nicho', 'mi-new-nicho', 'text', 'Ex: FINANÇAS, SAÚDE'],
            ['Nano-público', 'mi-new-nano', 'text', 'Quem exatamente vai comprar'],
            ['Ticket (R$)', 'mi-new-ticket', 'number', '47'],
            ['Score /10', 'mi-new-score', 'number', '9.5'],
            ['Dias de criação', 'mi-new-dias', 'text', '4-6'],
            ['Bump/Upsell', 'mi-new-bump', 'text', 'R$27 / R$197'],
            ['Plataforma', 'mi-new-plataforma', 'text', 'Kiwify'],
            ['Custo de criação', 'mi-new-custo', 'text', 'R$0'],
        ].map(([label, id, type, ph]) => `
          <div>
            <label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">${label}</label>
            <input id="${id}" type="${type}" placeholder="${ph}" value="" class="brief-input" style="width:100%;box-sizing:border-box;margin-top:4px">
          </div>
        `).join('')}
        <div style="display:flex;gap:8px;justify-content:flex-end;padding-top:8px">
          <button onclick="document.getElementById('mi-op-modal').remove()" class="btn btn-outline">Cancelar</button>
          <button onclick="miSaveNewOp()" class="btn btn-gold">💾 Salvar</button>
        </div>
      </div>
    </div>
  `;
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    document.body.appendChild(m);
}

async function miSaveNewOp() {
    const produto = document.getElementById('mi-new-produto')?.value.trim();
    if (!produto) { alert('Produto é obrigatório'); return; }
    const op = {
        produto,
        nicho: document.getElementById('mi-new-nicho')?.value.trim() || 'GERAL',
        nano_publico: document.getElementById('mi-new-nano')?.value.trim(),
        ticket: parseFloat(document.getElementById('mi-new-ticket')?.value) || null,
        score: parseFloat(document.getElementById('mi-new-score')?.value) || null,
        dias_criacao: document.getElementById('mi-new-dias')?.value.trim(),
        bump: document.getElementById('mi-new-bump')?.value.trim(),
        plataforma: document.getElementById('mi-new-plataforma')?.value.trim(),
        custo_criacao: document.getElementById('mi-new-custo')?.value.trim(),
        source: 'manual',
    };
    const { data } = await _sb.from('imphq_mi_opportunities').insert(op).select().single();
    if (data) MI.opportunities.unshift(data);
    document.getElementById('mi-op-modal')?.remove();
    miRender();
}

async function miOpenOpDetail(id) {
    const o = MI.opportunities.find(x => x.id === id);
    if (!o) return;
    const m = document.createElement('div');
    m.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:20px';
    const scoreColor = o.score >= 9.5 ? '#52b788' : o.score >= 9.0 ? 'var(--gold)' : '#e8844a';
    m.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:14px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;color:var(--text3);font-weight:600">${o.nicho} · ${o.sub_nicho || ''}</div>
          <div style="font-size:16px;font-weight:900;color:var(--text)">${o.produto}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div style="font-size:22px;font-weight:900;color:${scoreColor}">${o.score}</div>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:20px">×</button>
        </div>
      </div>
      <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;font-size:12px">
        ${[
            ['👤 Nano-público', o.nano_publico],
            ['💰 Ticket', o.ticket ? `R$${o.ticket}` : null],
            ['📦 Bump/Upsell', o.bump],
            ['⏱ Dias para criar', o.dias_criacao],
            ['💸 Custo de criação', o.custo_criacao],
            ['📱 Plataforma', o.plataforma],
            ['🎞 Formato', o.formato],
            ['✍️ Ângulo principal', o.angulo_principal],
            ['👻 Sem rosto', o.sem_rosto ? 'Sim ✅' : 'Não'],
        ].filter(([, v]) => v).map(([l, v]) => `
          <div style="display:flex;gap:8px;padding:8px 10px;background:var(--surface2);border-radius:6px">
            <span style="color:var(--text3);min-width:150px">${l}</span>
            <span style="color:var(--text);font-weight:600">${v}</span>
          </div>
        `).join('')}
      </div>
      <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end">
        <button onclick="miDeleteOp('${o.id}');this.closest('div[style*=fixed]').remove()"
          style="background:rgba(224,92,92,.1);border:1px solid rgba(224,92,92,.3);color:#e05c5c;padding:7px 14px;border-radius:7px;font-size:12px;cursor:pointer">🗑 Excluir</button>
        <button onclick="this.closest('div[style*=fixed]').remove()"
          style="background:var(--surface2);border:1px solid var(--border2);color:var(--text2);padding:7px 14px;border-radius:7px;font-size:12px;cursor:pointer">Fechar</button>
      </div>
    </div>
  `;
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    document.body.appendChild(m);
}

async function miDeleteOp(id) {
    if (!confirm('Excluir esta oportunidade?')) return;
    await _sb.from('imphq_mi_opportunities').delete().eq('id', id);
    MI.opportunities = MI.opportunities.filter(o => o.id !== id);
    miRender();
}

async function miSaveOpFromAnalysis(analysisId) {
    alert('Abra a análise, identifique o produto e clique em "+ Nova" para cadastrá-lo manualmente.');
}
