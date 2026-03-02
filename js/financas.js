    function showFinancas() {
      showSection('financas');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const nav = document.getElementById('nav-financas');
      if (nav) nav.classList.add('active');
      window._finTab = window._finTab || 'geral';
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
      const tabLabels = { geral: '📊 Visão Geral', ferramentas: '🔧 Ferramentas', apis: '⚡ APIs & Ads' };

      let html = `<div style="display:flex;gap:4px;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px">`;
      ['geral', 'ferramentas', 'apis'].forEach(t => {
        const active = tab === t;
        html += `<button onclick="window._finTab='${t}';renderFinancas()" style="padding:6px 14px;border-radius:6px;border:1px solid ${active ? 'var(--gold)' : 'var(--border)'};background:${active ? 'rgba(212,175,55,.12)' : 'transparent'};color:${active ? 'var(--gold)' : 'var(--text3)'};font-size:12px;font-weight:${active ? '700' : '400'};cursor:pointer">${tabLabels[t]}</button>`;
      });
      html += `</div>`;

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
            <div style="font-size:12px;font-weight:700;color:var(--gold);flex-shrink:0">$${c.valor || 0}</div>
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
              <div style="font-size:14px;font-weight:700;color:var(--gold)">$${c.valor}</div>
              <button onclick="editCusto(${idx})" style="background:var(--surface3);border:1px solid var(--border);color:var(--text2);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">✏️</button>
              <button onclick="deleteCusto(${idx})" style="background:transparent;border:1px solid var(--red-bright);color:var(--red-bright);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">🗑</button>
            </div>
          </div>`;
        });
        html += `</div>`;

      } else {
        const ocUrl = localStorage.getItem('openclaw_url');
        const adsEntry = apiCustos.find(c => c.is_ads) || { valor: 0 };
        const adsIdx = apiCustos.findIndex(c => c.is_ads);
        html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:12px;color:var(--text3)">Gastos variáveis com APIs e campanhas</div>
          <button onclick="addApiCusto()" style="background:var(--gold);border:none;color:var(--bg);padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">+ API</button>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px">
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
          ${!ocUrl ? `<div style="font-size:11px;color:var(--text3);margin-top:10px">⚙️ Configure a URL do OpenClaw nas Configurações para habilitar sincronização automática</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">`;
        apiCustos.forEach((c, idx) => {
          if (c.is_ads) return;
          html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13px;color:var(--text)">${c.nome}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${((c.valor || 0) * cotacao).toLocaleString('pt-BR', {maximumFractionDigits:0})}/mês</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <input type="number" value="${c.valor || 0}" min="0" step="1" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:13px;font-weight:700;width:80px" onchange="updateApiCusto(${idx}, parseFloat(this.value)||0)">
              <span style="font-size:11px;color:var(--text3)">USD</span>
              <button onclick="deleteApiCusto(${idx})" style="background:transparent;border:1px solid var(--red-bright);color:var(--red-bright);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">🗑</button>
            </div>
          </div>`;
        });
        html += `</div>`;
      }

      el.innerHTML = html;
    }

    function addCusto() {
      const n = prompt('Nome da ferramenta:');
      if (!n) return;
      const v = parseFloat(prompt('Valor mensal (USD):', '0') || '0');
      if (isNaN(v)) return;
      const custos = getCustos();
      custos.push({ nome: n, valor: v, dolar: true });
      saveCustos(custos);
      renderFinancas();
    }

    function editCusto(idx) {
      const custos = getCustos();
      const c = custos[idx];
      const n = prompt('Nome:', c.nome);
      if (n === null) return;
      const v = parseFloat(prompt('Valor USD:', c.valor));
      if (isNaN(v)) return;
      custos[idx] = { nome: n, valor: v, dolar: true };
      saveCustos(custos);
      renderFinancas();
    }

    function deleteCusto(idx) {
      if (!confirm('Excluir?')) return;
      const custos = getCustos();
      custos.splice(idx, 1);
      saveCustos(custos);
      renderFinancas();
    }

    function addApiCusto() {
      const n = prompt('Nome da API:');
      if (!n) return;
      const v = parseFloat(prompt('Gasto estimado este mês (USD):', '0') || '0');
      const arr = getApiCustos();
      arr.push({ nome: n, valor: isNaN(v) ? 0 : v, moeda: 'USD' });
      saveApiCustos(arr);
      renderFinancas();
    }

    function updateApiCusto(idx, val) {
      const arr = getApiCustos();
      if (arr[idx] !== undefined) { arr[idx].valor = val; saveApiCustos(arr); }
    }

    function deleteApiCusto(idx) {
      const arr = getApiCustos();
      if (!arr[idx] || arr[idx].is_ads) return;
      arr.splice(idx, 1);
      saveApiCustos(arr);
      renderFinancas();
    }

    function syncGoogleAds() {
      const ocUrl = localStorage.getItem('openclaw_url');
      if (!ocUrl) { alert('Configure a URL do OpenClaw nas Configurações primeiro.'); return; }
      alert('Endpoint Google Ads via OpenClaw ainda não implementado.\nDigite o valor manualmente por enquanto.');
    }

    function renderSkills() {
      const el = document.getElementById('skills-body');
      if (!el) return;
      const tagColor = 'rgba(212,175,55,.12)';
      let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">`;
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
      el.innerHTML = html;
    }
