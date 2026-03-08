    async function showFinancas() {
      showSection('financas');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const nav = document.getElementById('nav-financas');
      if (nav) nav.classList.add('active');
      window._finTab = window._finTab || 'geral';
      window._finSynced = null;
      renderFinancas();
      window._finSynced = await _custosLoadFromSupa();
      renderFinancas();
    }

    function renderFinancas() {
      const el = document.getElementById('financas-body');
      if (!el) return;
      const tab = window._finTab || 'geral';
      const cfg = getFinancasConfig();
      const cotacao = cfg.cotacao_usd || 5.00;
      const custos = getCustos();
      const apiCustos = getApiCustos();
      const totalFerrUSD = custos.reduce((s, c) => s + (c.valor || 0), 0);
      const totalApisUSD = apiCustos.reduce((s, c) => s + (c.valor || 0), 0);
      const totalUSD = totalFerrUSD + totalApisUSD;

      const syncBadge = window._finSynced === null
        ? `<span style="font-size:10px;color:var(--text3);background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:2px 8px">⏳ sincronizando...</span>`
        : window._finSynced
          ? `<span style="font-size:10px;color:var(--green-bright);background:rgba(82,183,136,.1);border:1px solid rgba(82,183,136,.25);border-radius:10px;padding:2px 8px">☁️ Supabase</span>`
          : `<span style="font-size:10px;color:var(--gold);background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);border-radius:10px;padding:2px 8px">💾 Local</span>`;

      const tabLabels = { geral: '📊 Visão Geral', ferramentas: '🔧 Ferramentas', apis: '⚡ APIs & Ads' };
      let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:12px">
        <div style="display:flex;gap:4px">`;
      ['geral', 'ferramentas', 'apis'].forEach(t => {
        const active = tab === t;
        html += `<button onclick="window._finTab='${t}';renderFinancas()" style="padding:6px 14px;border-radius:6px;border:1px solid ${active ? 'var(--gold)' : 'var(--border)'};background:${active ? 'rgba(212,175,55,.12)' : 'transparent'};color:${active ? 'var(--gold)' : 'var(--text3)'};font-size:12px;font-weight:${active ? '700' : '400'};cursor:pointer">${tabLabels[t]}</button>`;
      });
      html += `</div>${syncBadge}</div>`;

      if (tab === 'geral') {
        html += `
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="font-size:12px;color:var(--text3);flex-shrink:0">💱 Cotação USD/BRL</div>
            <input id="fin-cotacao" type="number" value="${cotacao}" step="0.05" min="1" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:13px;font-weight:700;width:80px" onchange="saveFinancasConfig(Object.assign(getFinancasConfig(),{cotacao_usd:parseFloat(this.value)||5}));renderFinancas()">
            <div style="font-size:11px;color:var(--text3)">R$ por $1 USD</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:12px">
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px">
              <div style="font-size:11px;color:var(--text3);margin-bottom:4px">🔧 Ferramentas Fixas</div>
              <div style="font-size:20px;font-weight:700;color:var(--gold)">$${totalFerrUSD.toFixed(0)}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${(totalFerrUSD * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}/mês</div>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px">
              <div style="font-size:11px;color:var(--text3);margin-bottom:4px">⚡ APIs & Ads</div>
              <div style="font-size:20px;font-weight:700;color:var(--accent)">$${totalApisUSD.toFixed(0)}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${(totalApisUSD * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}/mês</div>
            </div>
          </div>
          <div style="background:var(--surface2);border:2px solid var(--gold);border-radius:12px;padding:16px;text-align:center;margin-bottom:16px">
            <div style="font-size:11px;color:var(--text3);margin-bottom:6px;letter-spacing:.05em">TOTAL MENSAL</div>
            <div style="font-size:32px;font-weight:700;color:var(--gold)">R$ ${(totalUSD * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}</div>
            <div style="font-size:12px;color:var(--text3);margin-top:4px">$${totalUSD.toFixed(0)} USD · R$ ${(totalUSD * cotacao * 12).toLocaleString('pt-BR', {maximumFractionDigits:0})}/ano</div>
          </div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;font-weight:600">Top gastos</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">`;
        [...custos, ...apiCustos].sort((a, b) => (b.valor || 0) - (a.valor || 0)).slice(0, 6).forEach(c => {
          html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:12px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px">${c.nome}</div>
            <div style="font-size:12px;font-weight:700;color:var(--gold);flex-shrink:0">$${(c.valor || 0).toFixed(2)}</div>
          </div>`;
        });
        html += `</div>`;

      } else if (tab === 'ferramentas') {
        html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:12px;color:var(--text3)">Assinaturas e ferramentas fixas mensais</div>
          <button onclick="addCusto()" style="background:var(--gold);border:none;color:var(--bg);padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">+ Adicionar</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">`;
        if (custos.length === 0) html += `<div style="text-align:center;color:var(--text3);font-size:12px;padding:30px">Nenhuma ferramenta cadastrada</div>`;
        custos.forEach((c, idx) => {
          html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13px;color:var(--text)">${c.nome}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${((c.valor || 0) * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}/mês</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:14px;font-weight:700;color:var(--gold)">$${(c.valor || 0).toFixed(2)}</div>
              <button onclick="editCusto(${idx})" style="background:var(--surface3);border:1px solid var(--border);color:var(--text2);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">✏️</button>
              <button onclick="deleteCusto(${idx})" style="background:transparent;border:1px solid var(--red-bright);color:var(--red-bright);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">🗑</button>
            </div>
          </div>`;
        });
        html += `</div>`;

      } else {
        // APIs & Ads tab
        const ocUrl = localStorage.getItem('openclaw_url');
        const adsEntry = apiCustos.find(c => c.is_ads) || { valor: 0 };
        const adsIdx = apiCustos.findIndex(c => c.is_ads);
        const detected = _getDetectedApis();

        html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:12px;color:var(--text3)">Gastos variáveis com APIs e campanhas</div>
          <button onclick="addApiCusto()" style="background:var(--gold);border:none;color:var(--bg);padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">+ API</button>
        </div>`;

        // Detectadas mas não cadastradas
        if (detected.length) {
          html += `<div style="background:rgba(212,175,55,.06);border:1px dashed rgba(212,175,55,.3);border-radius:10px;padding:12px;margin-bottom:12px">
            <div style="font-size:11px;color:var(--gold);font-weight:700;margin-bottom:8px">💡 APIs configuradas — adicione o custo estimado</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">`;
          detected.forEach(d => {
            html += `<button onclick="addApiCustoDetected('${d.nome.replace(/'/g, "\\'")}')" style="font-size:11px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);color:var(--gold);padding:4px 12px;border-radius:8px;cursor:pointer">${d.nome} <span style="opacity:.6">+</span></button>`;
          });
          html += `</div></div>`;
        }

        // Google Ads block
        html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">📢 Google Ads</div>
              <div style="font-size:11px;color:var(--text3)">Gasto do mês atual</div>
            </div>
            <button onclick="syncGoogleAds()" ${ocUrl ? '' : 'disabled'} style="background:${ocUrl ? 'var(--accent)' : 'var(--surface3)'};border:1px solid ${ocUrl ? 'var(--accent)' : 'var(--border)'};color:${ocUrl ? '#fff' : 'var(--text3)'};padding:6px 12px;border-radius:6px;font-size:11px;cursor:${ocUrl ? 'pointer' : 'not-allowed'}">🔄 ${ocUrl ? 'Sincronizar via OpenClaw' : 'OpenClaw (em breve)'}</button>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;color:var(--text3);font-weight:700">$</span>
            <input type="number" value="${adsEntry.valor || 0}" min="0" step="10" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:6px 10px;font-size:16px;font-weight:700;width:120px" onchange="updateApiCusto(${adsIdx}, parseFloat(this.value)||0)">
            <span style="font-size:12px;color:var(--text3)">≈ R$ ${((adsEntry.valor || 0) * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}</span>
          </div>
          ${!ocUrl ? `<div style="font-size:11px;color:var(--text3);margin-top:10px">⚙️ Configure o OpenClaw nas Ferramentas para sincronização automática</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">`;
        apiCustos.forEach((c, idx) => {
          if (c.is_ads) return;
          html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between">
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.nome}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${((c.valor || 0) * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}/mês</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              <input type="number" value="${c.valor || 0}" min="0" step="0.5" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:13px;font-weight:700;width:88px" onchange="updateApiCusto(${idx}, parseFloat(this.value)||0)">
              <span style="font-size:11px;color:var(--text3)">USD</span>
              <button onclick="deleteApiCusto(${idx})" style="background:transparent;border:1px solid var(--red-bright);color:var(--red-bright);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">🗑</button>
            </div>
          </div>`;
        });
        html += `</div>`;
      }

      el.innerHTML = html;
    }

    async function addCusto() {
      const n = prompt('Nome da ferramenta:');
      if (!n) return;
      const v = parseFloat(prompt('Valor mensal (USD):', '0') || '0');
      if (isNaN(v)) return;
      const custos = getCustos();
      const entry = { nome: n, valor: v, dolar: true };
      custos.push(entry);
      saveCustos(custos);
      renderFinancas();
      await _custoUpsertSupa(entry, 'ferramenta');
      saveCustos(custos); // salva id atribuído pelo Supabase
    }

    async function editCusto(idx) {
      const custos = getCustos();
      const c = custos[idx];
      const n = prompt('Nome:', c.nome);
      if (n === null) return;
      const v = parseFloat(prompt('Valor USD:', c.valor));
      if (isNaN(v)) return;
      custos[idx] = { ...c, nome: n, valor: v };
      saveCustos(custos);
      renderFinancas();
      await _custoUpsertSupa(custos[idx], 'ferramenta');
      saveCustos(custos);
    }

    async function deleteCusto(idx) {
      if (!confirm('Excluir?')) return;
      const custos = getCustos();
      const item = custos[idx];
      custos.splice(idx, 1);
      saveCustos(custos);
      renderFinancas();
      await _custoDeleteSupa(item.id);
    }

    async function addApiCusto() {
      const n = prompt('Nome da API:');
      if (!n) return;
      const v = parseFloat(prompt('Gasto estimado este mês (USD):', '0') || '0');
      const arr = getApiCustos();
      const entry = { nome: n, valor: isNaN(v) ? 0 : v, moeda: 'USD' };
      arr.push(entry);
      saveApiCustos(arr);
      renderFinancas();
      await _custoUpsertSupa(entry, 'api');
      saveApiCustos(arr);
    }

    async function addApiCustoDetected(nome) {
      const v = parseFloat(prompt(`Custo estimado de "${nome}" este mês (USD):`, '0') || '0');
      const arr = getApiCustos();
      const entry = { nome, valor: isNaN(v) ? 0 : v, moeda: 'USD' };
      arr.push(entry);
      saveApiCustos(arr);
      renderFinancas();
      await _custoUpsertSupa(entry, 'api');
      saveApiCustos(arr);
    }

    function updateApiCusto(idx, val) {
      const arr = getApiCustos();
      if (arr[idx] !== undefined) {
        arr[idx].valor = val;
        saveApiCustos(arr);
        // Sync ao Supabase em background (não-ads apenas)
        if (!arr[idx].is_ads) _custoUpsertSupa(arr[idx], 'api');
      }
    }

    async function deleteApiCusto(idx) {
      const arr = getApiCustos();
      if (!arr[idx] || arr[idx].is_ads) return;
      const item = arr[idx];
      arr.splice(idx, 1);
      saveApiCustos(arr);
      renderFinancas();
      await _custoDeleteSupa(item.id);
    }

    function syncGoogleAds() {
      const ocUrl = localStorage.getItem('openclaw_url');
      if (!ocUrl) { alert('Configure o OpenClaw nas Ferramentas primeiro.'); return; }
      alert('Endpoint Google Ads via OpenClaw ainda não implementado.\nDigite o valor manualmente por enquanto.');
    }

    // ── Marketing Skills Data (V2 — embedded) ──────────────────
    const MARKETING_SKILLS = [
      {
        id: 'avatar-architect-v7',
        name: 'Avatar Architect V7.0',
        icon: '🧠',
        version: 'V7.0',
        desc: 'God-Mode Engine™ — O mais avançado sistema de Engenharia de Avatar. Gera um Tomo de Onisciência com mapeamento psicológico profundo, Framework de Trauma em 7 Passos, Sistema de Benefícios em 3 Camadas e Estratégias de Ativação em 8 Fases.',
        tags: ['avatar', 'psicologia', 'copy', 'trauma', 'desejos'],
        badge: 'Análise de Avatar',
        badgeColor: '#9b5de5',
        file: 'skill-avatar-architect-v7.md'
      },
      {
        id: 'dossie-problemas-v2',
        name: 'Dossiê de Problemas V2.0',
        icon: '🔍',
        version: 'V2.0',
        desc: 'Identifica, mapeia e prioriza problemas reais do avatar em 13 categorias. Sistema de pontuação de 7 critérios (score máximo 35), Gatilhos de Voyerismo com template expandido e Matriz de Copy Estratégica.',
        tags: ['problemas', 'copy', 'mapeamento', 'priorização'],
        badge: 'Pesquisa',
        badgeColor: '#e05c5c',
        file: 'skill-dossie-problemas-v2.md'
      },
      {
        id: 'devastador-v4',
        name: 'Devastador Copy V4.0',
        icon: '💣',
        version: 'V4.0',
        desc: 'Apocalypse Engine™ — Constrói Manifestos de Redenção. 7 Blocos obrigatórios de copy, 6 Templates de Order Bump, Arsenal VSL estruturado, Scripts de Upsell e Adaptação Demográfica.',
        tags: ['copy', 'vsl', 'upsell', 'anúncio', 'manifesto'],
        badge: 'Copywriting',
        badgeColor: '#d4af37',
        file: 'skill-devastador-v4.md'
      },
      {
        id: 'mapeamento-desejos-v2',
        name: 'Mapeamento de Desejos V2.0',
        icon: '💎',
        version: 'V2.0',
        desc: 'Transforma um briefing de avatar em um mapa psicológico profundo de desejos com 11 blocos: Desejos Externos, Internos, Proibidos, Vontades Recorrentes, Obsessões, Gostos Reveladores, Gatilhos Emocionais e Estratégias de Ativação.',
        tags: ['desejos', 'psicologia', 'copy', 'avatar'],
        badge: 'Análise',
        badgeColor: '#5b8dee',
        file: 'skill-mapeamento-desejos-v2.md'
      },
      {
        id: 'funnel-hacking-v2',
        name: 'Funnel Hacking Supremo V2.0',
        icon: '🔀',
        version: 'V2.0',
        desc: 'Engenharia reversa de funis de alta conversão. Analisa concorrentes, mapeia estrutura de funis, identifica estratégias de follow-up e extrai insights para replicação inteligente.',
        tags: ['funil', 'análise', 'concorrente', 'estratégia'],
        badge: 'Estratégia',
        badgeColor: '#52b788',
        file: 'skill-funnel-hacking-supremo-v2.md'
      },
      {
        id: 'tripwire-matador-v2',
        name: 'Tripwire Matador V2.0',
        icon: '⚡',
        version: 'V2.0',
        desc: 'Criação de ofertas de entrada irresistíveis (tripwires) que convertem leads frios em compradores. Sistema de precificação estratégica e design de oferta de alta conversão.',
        tags: ['tripwire', 'oferta', 'conversão', 'precificação'],
        badge: 'Oferta',
        badgeColor: '#f77f00',
        file: 'skill-tripwire-matador-v2.md'
      },
      {
        id: 'reposicionamento-v2',
        name: 'Reposicionamento Estratégico V2.0',
        icon: '🎯',
        version: 'V2.0',
        desc: 'Reposiciona um produto/marca para se destacar no mercado saturado. Identifica ângulos únicos, diferenciadores competitivos e ajusta o posicionamento para o avatar ideal.',
        tags: ['posicionamento', 'marca', 'diferenciação', 'estratégia'],
        badge: 'Branding',
        badgeColor: '#9b5de5',
        file: 'skill-reposicionamento-v2.md'
      },
      {
        id: 'mecanismo-unico-v2',
        name: 'Mecanismo Único V2.0',
        icon: '🔮',
        version: 'V2.0',
        desc: 'Cria o Mecanismo Único Proprietário do produto/método. Nomeia e estrutura a lógica central que diferencia a solução de todos os outros no mercado, gerando percepção de exclusividade.',
        tags: ['mecanismo', 'diferenciação', 'copy', 'posicionamento'],
        badge: 'Identidade',
        badgeColor: '#00b4d8',
        file: 'skill-mecanismo-unico-v2.md'
      },
      {
        id: 'lp-persuasiva-v2',
        name: 'LP Persuasiva V2.0',
        icon: '📄',
        version: 'V2.0',
        desc: 'Arquitetura completa de Landing Pages de alta conversão. Estrutura de blocos persuasivos, hierarquia de argumentos, design de copy por seção e otimização para conversão.',
        tags: ['landing page', 'copy', 'conversão', 'estrutura'],
        badge: 'Página',
        badgeColor: '#d4af37',
        file: 'skill-lp-persuasiva-v2.md'
      }
    ];

    // ── Skills Modal ──────────────────────────────────────────
    function openSkillModal(skillId) {
      const skill = MARKETING_SKILLS.find(s => s.id === skillId);
      if (!skill) return;
      const existing = document.getElementById('skill-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'skill-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:stretch;justify-content:flex-end;z-index:5000;backdrop-filter:blur(4px)';
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

      modal.innerHTML = `
        <div style="width:min(700px,95vw);background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;height:100%;overflow:hidden;animation:slideIn .25s ease">
          <div style="display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--surface2)">
            <span style="font-size:28px">${skill.icon}</span>
            <div style="flex:1">
              <div style="font-size:16px;font-weight:700;color:var(--text)">${skill.name}</div>
              <div style="font-size:11px;color:var(--text3)">${skill.file}</div>
            </div>
            <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;background:${skill.badgeColor}22;color:${skill.badgeColor};border:1px solid ${skill.badgeColor}44">${skill.badge}</span>
            <button onclick="document.getElementById('skill-modal').remove()" style="background:transparent;border:1px solid var(--border2);color:var(--text3);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px">✕ Fechar</button>
          </div>
          <div style="padding:16px 20px;background:var(--surface2);border-bottom:1px solid var(--border);flex-shrink:0">
            <div style="font-size:12px;color:var(--text2);line-height:1.6">${skill.desc}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
              ${skill.tags.map(t => `<span style="font-size:10px;background:rgba(212,175,55,.12);color:var(--gold);padding:2px 8px;border-radius:8px;border:1px solid rgba(212,175,55,.2)">${t}</span>`).join('')}
            </div>
          </div>
          <div style="flex:1;overflow-y:auto;padding:24px 28px" id="skill-md-content">
            <div style="color:var(--text3);font-size:12px;text-align:center;padding:40px">⏳ Carregando...</div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Add slide-in animation
      if (!document.getElementById('skill-modal-style')) {
        const s = document.createElement('style');
        s.id = 'skill-modal-style';
        s.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}} #skill-md-content h1,#skill-md-content h2,#skill-md-content h3{color:var(--gold);margin:16px 0 8px} #skill-md-content h1{font-size:18px;border-bottom:1px solid var(--border);padding-bottom:8px} #skill-md-content h2{font-size:15px} #skill-md-content h3{font-size:13px;color:var(--text)} #skill-md-content p{font-size:12px;color:var(--text2);line-height:1.7;margin:8px 0} #skill-md-content ul,#skill-md-content ol{padding-left:20px;margin:8px 0} #skill-md-content li{font-size:12px;color:var(--text2);line-height:1.7;margin:3px 0} #skill-md-content table{width:100%;border-collapse:collapse;margin:12px 0;font-size:11px} #skill-md-content th{background:var(--surface2);color:var(--gold);padding:6px 10px;text-align:left;border:1px solid var(--border)} #skill-md-content td{padding:6px 10px;border:1px solid var(--border);color:var(--text2)} #skill-md-content code,#skill-md-content pre{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:2px 6px;font-family:monospace;font-size:11px;color:#a0f0b0} #skill-md-content pre{display:block;padding:12px;overflow-x:auto;line-height:1.6} #skill-md-content blockquote{border-left:3px solid var(--gold);background:rgba(212,175,55,.05);padding:8px 14px;margin:8px 0;border-radius:0 6px 6px 0} #skill-md-content blockquote p{color:var(--gold)} #skill-md-content strong{color:var(--text);font-weight:700} #skill-md-content hr{border:none;border-top:1px solid var(--border);margin:16px 0}`;
        document.head.appendChild(s);
      }

      // Load markdown from the skills/ folder
      fetch(`/skills/${skill.file}`)
        .then(r => {
          if (!r.ok) throw new Error('not found');
          return r.text();
        })
        .then(md => {
          document.getElementById('skill-md-content').innerHTML = _mdToHtml(md);
        })
        .catch(() => {
          document.getElementById('skill-md-content').innerHTML = `<div style="color:var(--text3);font-size:12px;padding:20px;background:var(--surface2);border-radius:8px;border:1px solid var(--border)"><strong style="color:var(--gold)">📄 ${skill.name}</strong><br><br>${skill.desc}<br><br><em style="font-size:11px">Arquivo: ${skill.file}</em></div>`;
        });
    }

    // Simple markdown-to-HTML converter for skill display
    function _mdToHtml(md) {
      let html = md
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        // Fenced code blocks
        .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Headers
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$2</h2>'.replace('$2','$1'))
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^#### (.+)$/gm, '<h3 style="font-size:12px;color:var(--text2)">$1</h3>')
        // HR
        .replace(/^---+$/gm, '<hr>')
        // Blockquote
        .replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        // Bold/italic
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Tables (simple)
        .replace(/^\|(.+)\|$/gm, (match) => {
          if (match.includes('---')) return '';
          const cells = match.slice(1,-1).split('|').map(c=>c.trim());
          return '<tr>' + cells.map(c=>`<td>${c}</td>`).join('') + '</tr>';
        })
        // Wrap table rows
        .replace(/(<tr>.*<\/tr>\n?)+/g, m => `<table>${m.replace(/<\/tr>\n<tr>/g,'</tr><tr>')}</table>`)
        // Convert first row of each table to th
        .replace(/<table><tr>(.*?)<\/tr>/gs, (m, row) => {
          const header = row.replace(/<td>/g,'<th>').replace(/<\/td>/g,'</th>');
          return `<table><tr>${header}</tr>`;
        })
        // Lists
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        .replace(/^  - (.+)$/gm, '<li style="margin-left:16px">$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Wrap consecutive li in ul
        .replace(/(<li>.*?<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
        // Paragraphs (lines that are not already html)
        .replace(/^([^<\n].+)$/gm, '<p>$1</p>')
        // Clean up
        .replace(/<\/ul>\n<ul>/g, '')
        .replace(/<\/table>\n<table>/g, '')
        .replace(/<p><\/p>/g, '')
        .replace(/\n{3,}/g, '\n\n');
      return html;
    }

    function renderSkills() {
      const el = document.getElementById('skills-body');
      if (!el) return;

      const tab = window._skillsTab || 'marketing';

      let html = `
        <!-- TABS -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:12px">
          <div style="display:flex;gap:4px">
            <button onclick="window._skillsTab='marketing';renderSkills()" style="padding:7px 16px;border-radius:7px;border:1px solid ${tab==='marketing'?'var(--gold)':'var(--border)'};background:${tab==='marketing'?'rgba(212,175,55,.12)':'transparent'};color:${tab==='marketing'?'var(--gold)':'var(--text3)'};font-size:12px;font-weight:${tab==='marketing'?'700':'400'};cursor:pointer">🧠 Skills Marketing</button>
            <button onclick="window._skillsTab='tech';renderSkills()" style="padding:7px 16px;border-radius:7px;border:1px solid ${tab==='tech'?'var(--gold)':'var(--border)'};background:${tab==='tech'?'rgba(212,175,55,.12)':'transparent'};color:${tab==='tech'?'var(--gold)':'var(--text3)'};font-size:12px;font-weight:${tab==='tech'?'700':'400'};cursor:pointer">⚙️ Skills Técnicas</button>
          </div>
          <span style="font-size:11px;color:var(--text3)">${tab==='marketing'?MARKETING_SKILLS.length+' metodologias':SKILLS_LIST.length+' capacidades'}</span>
        </div>
      `;

      if (tab === 'marketing') {
        html += `
          <div style="margin-bottom:14px;padding:10px 14px;background:rgba(155,93,229,.06);border:1px solid rgba(155,93,229,.2);border-radius:8px;font-size:11px;color:var(--text2)">
            💡 <strong style="color:var(--gold)">Skills de Metodologia Marketing</strong> — Clique em qualquer skill para abrir o protocolo completo. Use o conteúdo para configurar agentes de IA com o contexto certo.
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px">
        `;
        MARKETING_SKILLS.forEach(skill => {
          html += `
            <div onclick="openSkillModal('${skill.id}')" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor='var(--gold)';this.style.background='rgba(212,175,55,.04)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
              <div style="display:flex;align-items:flex-start;gap:12px">
                <span style="font-size:26px;flex-shrink:0;line-height:1">${skill.icon}</span>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;flex-wrap:wrap">
                    <div style="font-size:13px;font-weight:700;color:var(--text)">${skill.name}</div>
                    <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:8px;background:${skill.badgeColor}22;color:${skill.badgeColor};border:1px solid ${skill.badgeColor}44;white-space:nowrap">${skill.badge}</span>
                  </div>
                  <div style="font-size:10px;color:var(--text3);font-weight:600;opacity:.6">${skill.file}</div>
                </div>
              </div>
              <div style="font-size:11px;color:var(--text2);line-height:1.6">${skill.desc}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto">
                <div style="display:flex;gap:4px;flex-wrap:wrap">
                  ${skill.tags.slice(0,3).map(t => `<span style="font-size:10px;background:rgba(212,175,55,.1);color:var(--gold);padding:2px 7px;border-radius:8px">${t}</span>`).join('')}
                </div>
                <span style="font-size:10px;color:var(--text3)">📖 Ler →</span>
              </div>
            </div>
          `;
        });
        html += `</div>`;
      } else {
        // Tech skills tab
        const tagColor = 'rgba(212,175,55,.12)';
        html += `
          <div style="margin-bottom:14px;padding:10px 14px;background:rgba(82,183,136,.06);border:1px solid rgba(82,183,136,.2);border-radius:8px;font-size:11px;color:var(--text2)">
            ⚙️ <strong style="color:#52b788">Skills Técnicas OpenClaw</strong> — Capacidades da IA para automações, geração de conteúdo e integrações técnicas.
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        `;
        SKILLS_LIST.forEach(skill => {
          const col = skill.status === 'ativo' ? '#52b788' : '#e05c5c';
          html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px">${skill.icon}</span>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:700;color:var(--text)">${skill.name}</div>
                <span style="font-size:10px;color:${col}">● ${skill.status}</span>
              </div>
            </div>
            <div style="font-size:11px;color:var(--text3);line-height:1.5">${skill.desc}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              ${skill.tags.map(t => `<span style="font-size:10px;background:${tagColor};color:var(--gold);padding:2px 7px;border-radius:8px">${t}</span>`).join('')}
            </div>
          </div>`;
        });
        html += `</div>`;
      }

      el.innerHTML = html;
    }
