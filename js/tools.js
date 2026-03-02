    // ═══════════════════════════════════════════════════════
    //  NAVIGATION — atualizar showOverview e showSection
    // ═══════════════════════════════════════════════════════
    function activatePanel(viewId, navId) {
      document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
      const view = document.getElementById(viewId);
      if (view) view.classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      if (navId) {
        const nav = document.getElementById(navId);
        if (nav) nav.classList.add('active');
      }
    }

    // ═══════════════════════════════════════════════════════
    //  TOOLS SECTION
    // ═══════════════════════════════════════════════════════
    function showTools() {
      document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('view-tools').classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById('nav-tools').classList.add('active');
      const toolKeys = {
        'apify': 'tool_apify_key', 'vercel': 'tool_vercel_token', 'gemini': 'tool_gemini_key',
        'openrouter_tool': 'openrouter_key', 'replicate': 'tool_replicate_key',
        'meta_api': 'tool_meta_token', 'ga4': 'tool_ga4_id',
        'openclaw_monitor': 'openclaw_url', 'supabase_sync': 'tool_supabase_url'
      };
      Object.entries(toolKeys).forEach(([tool, lsKey]) => {
        const el = document.getElementById('tool-status-' + tool);
        if (!el) return;
        const val = localStorage.getItem(lsKey);
        if (val) { el.textContent = '✓ Conectado'; el.style.color = 'var(--green-bright)'; }
        else { el.textContent = 'Configurar'; el.style.color = 'var(--gold)'; }
      });
    }

    // ── Tools Tabs ──
    function showToolsTab(tab) {
      ['ferramentas', 'links'].forEach(t => {
        const panel = document.getElementById('tools-tab-' + t);
        if (panel) panel.style.display = t === tab ? '' : 'none';
        const tabEl = document.getElementById('ttab-' + t);
        if (tabEl) tabEl.classList.toggle('active', t === tab);
      });
      if (tab === 'links') renderLinks();
    }

    // ═══════════════════════════════════════════════════════
    //  LINKS RÁPIDOS
    // ═══════════════════════════════════════════════════════
    let _qlEditId = null;
    let _qlCatFilter = '';

    function getLinks() { return JSON.parse(localStorage.getItem('imperio_quick_links') || '[]'); }
    function saveLinks(arr) { localStorage.setItem('imperio_quick_links', JSON.stringify(arr)); }

    function openAddLink(editId) {
      _qlEditId = editId || null;
      const modal = document.getElementById('ql-modal');
      const cats = [...new Set(getLinks().map(l => l.cat).filter(Boolean))];
      const dl = document.getElementById('ql-cat-datalist');
      if (dl) dl.innerHTML = cats.map(c => `<option value="${c}">`).join('');
      if (editId) {
        const link = getLinks().find(l => l.id === editId);
        if (!link) return;
        document.getElementById('ql-modal-title').textContent = '✏️ Editar Link';
        document.getElementById('ql-emoji').value = link.emoji || '🔗';
        document.getElementById('ql-nome').value = link.nome || '';
        document.getElementById('ql-url').value = link.url || '';
        document.getElementById('ql-cat').value = link.cat || '';
        document.getElementById('ql-cor').value = link.cor || '#d4af37';
        document.getElementById('ql-desc').value = link.desc || '';
      } else {
        document.getElementById('ql-modal-title').textContent = '🔗 Novo Link';
        ['ql-nome', 'ql-url', 'ql-cat', 'ql-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        document.getElementById('ql-emoji').value = '🔗';
        document.getElementById('ql-cor').value = '#d4af37';
      }
      modal.style.opacity = '1'; modal.style.pointerEvents = 'auto';
    }

    function closeAddLink() {
      const modal = document.getElementById('ql-modal');
      modal.style.opacity = '0'; modal.style.pointerEvents = 'none';
      _qlEditId = null;
    }

    function saveLink() {
      const nome = document.getElementById('ql-nome').value.trim();
      const url = document.getElementById('ql-url').value.trim();
      if (!nome) { alert('Nome é obrigatório'); return; }
      if (!url) { alert('URL é obrigatória'); return; }
      const links = getLinks();
      const entry = {
        id: _qlEditId || ('ql_' + Date.now()),
        emoji: document.getElementById('ql-emoji').value.trim() || '🔗',
        nome, url,
        cat: document.getElementById('ql-cat').value.trim(),
        cor: document.getElementById('ql-cor').value,
        desc: document.getElementById('ql-desc').value.trim()
      };
      const idx = links.findIndex(l => l.id === entry.id);
      if (idx !== -1) links[idx] = entry; else links.push(entry);
      saveLinks(links);
      closeAddLink();
      renderLinks();
    }

    function deleteLink(id) {
      if (!confirm('Remover este link?')) return;
      saveLinks(getLinks().filter(l => l.id !== id));
      renderLinks();
    }

    function qlSetCat(cat) { _qlCatFilter = cat; renderLinks(); }

    function renderLinks() {
      const links = getLinks();
      const grid = document.getElementById('ql-grid');
      const empty = document.getElementById('ql-empty');
      const catBar = document.getElementById('ql-cat-bar');
      if (!grid) return;
      const cats = [...new Set(links.map(l => l.cat).filter(Boolean))];
      catBar.innerHTML = ['', ...cats].map(c => {
        const active = _qlCatFilter === c;
        const label = c || 'Todos';
        return `<span onclick="qlSetCat('${c}')" style="cursor:pointer;font-size:11px;padding:4px 14px;border-radius:12px;border:1px solid ${active ? 'var(--gold)' : 'var(--border)'};color:${active ? 'var(--gold)' : 'var(--text3)'};background:${active ? 'rgba(212,175,55,.1)' : 'var(--surface2)'};transition:.15s">${label}</span>`;
      }).join('');
      const filtered = _qlCatFilter ? links.filter(l => l.cat === _qlCatFilter) : links;
      if (!filtered.length) {
        grid.innerHTML = ''; grid.style.display = 'none';
        empty.style.display = 'block'; return;
      }
      empty.style.display = 'none'; grid.style.display = 'grid';
      grid.innerHTML = filtered.map(l => {
        const cor = l.cor || '#d4af37';
        const catPill = l.cat ? `<span style="font-size:9px;color:var(--text3);border:1px solid var(--border);padding:1px 7px;border-radius:8px;background:var(--surface2)">${l.cat}</span>` : '';
        return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:.2s" onmouseover="this.style.borderColor='${cor}';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--border)';this.style.transform='none'">
          <div style="height:4px;background:${cor}"></div>
          <div style="padding:14px;flex:1;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:22px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--surface2);border-radius:8px;border:1px solid var(--border);flex-shrink:0">${l.emoji || '🔗'}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:3px">${l.nome}</div>
                ${catPill}
              </div>
            </div>
            ${l.desc ? `<div style="font-size:10px;color:var(--text3);line-height:1.45">${l.desc}</div>` : ''}
            <div style="font-size:9px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.55">${l.url}</div>
          </div>
          <div style="padding:10px 14px;border-top:1px solid var(--border);display:flex;gap:6px">
            <a href="${l.url}" target="_blank" rel="noopener" style="flex:1;text-align:center;background:${cor};color:#0a0a0f;border:none;padding:7px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px">↗ Abrir</a>
            <button onclick="openAddLink('${l.id}')" style="background:var(--surface2);border:1px solid var(--border);color:var(--text2);padding:6px 10px;border-radius:7px;font-size:11px;cursor:pointer" title="Editar">✏️</button>
            <button onclick="deleteLink('${l.id}')" style="background:var(--surface2);border:1px solid var(--border);color:#e05c5c;padding:6px 10px;border-radius:7px;font-size:11px;cursor:pointer" title="Remover">✕</button>
          </div>
        </div>`;
      }).join('');
    }

    let currentTool = null;
    function openTool(toolId) {
      currentTool = toolId;
      const panel = document.getElementById('tool-panel');
      const titleEl = document.getElementById('tool-panel-title');
      const body = document.getElementById('tool-panel-body');
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const toolDefs = {
        apify: { name: '🕷️ Apify — Pesquisa de Mercado', lsKey: 'tool_apify_key', label: 'API Token (Apify)', hint: 'Encontre em https://console.apify.com/account/integrations', placeholder: 'apify_api_...', useCases: ['Scraping de perfis de concorrentes', 'Coleta de reviews e avaliações', 'Monitoramento de preços de concorrentes', 'Pesquisa de palavras-chave e tendências'] },
        vercel: { name: '▲ Vercel — Deploy Automático', lsKey: 'tool_vercel_token', label: 'Token de Acesso (Vercel)', hint: 'Encontre em vercel.com/account/tokens', placeholder: 'vercel_...', useCases: ['Deploy automático de páginas de captura', 'CI/CD para funis de vendas', 'Subida de landing pages sem precisar de dev', 'Preview de páginas antes do go-live'] },
        gemini: { name: '✨ Gemini — IA do Google', lsKey: 'tool_gemini_key', label: 'API Key (Google AI Studio)', hint: 'Encontre em aistudio.google.com/apikey', placeholder: 'AIza...', useCases: ['Análise de documentos e PDFs de mercado', 'Geração de conteúdo de longa duração', 'Pesquisa e síntese de dados de concorrência', 'Moderação e análise de comentários'] },
        openrouter_tool: { name: '⚡ OpenRouter — Multi-LLM', lsKey: 'openrouter_key', label: 'API Key (OpenRouter)', hint: 'Encontre em openrouter.ai/keys', placeholder: 'sk-or-...', useCases: ['Acesso a Claude, GPT-4, Gemini com uma única chave', 'Fallback automático entre modelos', 'Comparação de outputs entre modelos', 'Controle de custos por modelo'] },
        replicate: { name: '🎨 Replicate — Geração Visual', lsKey: 'tool_replicate_key', label: 'API Token (Replicate)', hint: 'Encontre em replicate.com/account/api-tokens', placeholder: 'r8_...', useCases: ['Geração de imagens para criativos (Flux, SDXL)', 'Geração de thumbnails de YouTube', 'Criação de assets visuais para anúncios', 'Vídeos curtos para UGC simulados'] },
        meta_api: { name: '📣 Meta API — Marketing', lsKey: 'tool_meta_token', label: 'Access Token (Meta for Developers)', hint: 'Crie em developers.facebook.com/tools/explorer', placeholder: 'EAAGm...', useCases: ['Buscar métricas de campanhas em tempo real', 'Criar e pausar anúncios automaticamente', 'Sincronizar públicos (custom audiences)', 'Relatórios automáticos de performance'] },
        ga4: { name: '📊 Google Analytics 4', lsKey: 'tool_ga4_id', label: 'Measurement ID (GA4)', hint: 'Encontre em analytics.google.com → Admin → Data Streams', placeholder: 'G-XXXXXXXXXX', useCases: ['Monitorar conversões em páginas de captura', 'Acompanhar funil completo de vendas', 'Relatórios de comportamento de usuários', 'Eventos customizados por produto'] },
        openclaw_monitor: { name: '🕷️ Monitor OpenClaw', lsKey: 'openclaw_url', label: 'Webhook URL do OpenClaw', hint: 'Configure o webhook no seu painel OpenClaw', placeholder: 'https://...', useCases: ['Ver status de cada task em execução', 'Monitorar fila de agentes em tempo real', 'Receber notificações de tasks concluídas', 'Debugar execuções com falha'] },
        supabase_sync: { name: '🗄️ Sincronizar Supabase', lsKey: 'tool_supabase_url', label: 'URL do Projeto Supabase', hint: 'Encontre em supabase.com → seu projeto → Settings → API', placeholder: 'https://xxxx.supabase.co', useCases: ['Persistir dados do HQ na nuvem', 'Colaboração em tempo real com o time', 'Backup automático de todos os projetos', 'Acesso de múltiplos dispositivos'] },
      };

      if (toolId === 'roas_calc') {
        titleEl.textContent = '🧮 Calculadora ROAS';
        body.innerHTML = `
          <div class="grid2">
            <div>
              <div class="brief-field"><div class="brief-label">Preço (R$)</div><input id="rc-preco" class="brief-input" type="number" value="497" oninput="calcROAS()"></div>
              <div class="brief-field"><div class="brief-label">Margem (%)</div><input id="rc-margem" class="brief-input" type="number" value="80" oninput="calcROAS()"></div>
              <div class="brief-field"><div class="brief-label">Taxa Plataforma (%)</div><input id="rc-taxa" class="brief-input" type="number" value="10" oninput="calcROAS()"></div>
              <div class="brief-field"><div class="brief-label">Meta Lucro (%)</div><input id="rc-meta" class="brief-input" type="number" value="30" oninput="calcROAS()"></div>
            </div>
            <div id="rc-results" style="display:flex;flex-direction:column;gap:10px"><div class="brief-label">Resultados</div></div>
          </div>`;
        calcROAS(); return;
      }
      if (toolId === 'export_import') {
        titleEl.textContent = '💾 Exportar / Importar Sistema';
        body.innerHTML = `
          <div class="grid2">
            <div class="card">
              <div class="card-title">📤 Exportar Backup</div>
              <p style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.6">Gera um arquivo JSON com todos os dados (Kanban, Docs, KB, Configurações).</p>
              <button onclick="exportBackup()" class="btn btn-gold" style="width:100%">⬇️ Baixar Backup</button>
            </div>
            <div class="card">
              <div class="card-title">📥 Importar Backup</div>
              <p style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.6">Restaure dados. Irá sobrescrever dados atuais.</p>
              <input type="file" id="import-file" accept=".json" onchange="importBackup(event)" style="display:none">
              <button onclick="document.getElementById('import-file').click()" class="btn btn-outline" style="width:100%">⬆️ Carregar JSON</button>
            </div>
          </div>`;
        return;
      }
      const def = toolDefs[toolId];
      if (!def) { panel.style.display = 'none'; return; }
      titleEl.textContent = def.name;
      const currentVal = localStorage.getItem(def.lsKey) || '';
      const isConnected = !!currentVal;
      body.innerHTML = `
        <div class="grid2">
          <div>
            <div class="brief-field">
              <div class="brief-label">${def.label}</div>
              <div style="display:flex;gap:8px">
                <input id="tool-input-${toolId}" class="brief-input" type="password" value="${currentVal}" placeholder="${def.placeholder}">
                <button onclick="saveTool('${toolId}','${def.lsKey}')" class="btn btn-gold">Salvar</button>
                ${isConnected ? `<button onclick="removeTool('${toolId}','${def.lsKey}')" class="btn btn-outline" style="color:#e05c5c;border-color:#e05c5c">Remover</button>` : ''}
              </div>
              <div style="font-size:10px;color:var(--text3);margin-top:4px">${def.hint}</div>
            </div>
            <div style="margin-top:10px;padding:10px;background:${isConnected ? 'rgba(82,183,136,.08)' : 'rgba(212,168,67,.08)'};border:1px solid ${isConnected ? 'rgba(82,183,136,.2)' : 'rgba(212,168,67,.2)'};border-radius:8px;font-size:12px;color:${isConnected ? 'var(--green-bright)' : 'var(--gold)'}">
              ${isConnected ? '✅ Integração ativa' : '⚠️ Configure para ativar'}
            </div>
          </div>
          <div class="card">
            <div class="card-title">💡 Casos de Uso</div>
            ${def.useCases.map(u => `<div style="font-size:12px;color:var(--text2);padding:5px 0;border-bottom:1px solid var(--border);display:flex;gap:8px"><span style="color:var(--gold)">→</span>${u}</div>`).join('')}
          </div>
        </div>`;
    }
    function saveTool(toolId, lsKey) {
      const val = document.getElementById('tool-input-' + toolId).value.trim();
      if (!val) { alert('Insira o valor antes de salvar'); return; }
      localStorage.setItem(lsKey, val);
      const el = document.getElementById('tool-status-' + toolId);
      if (el) { el.textContent = '✓ Conectado'; el.style.color = 'var(--green-bright)'; }
      openTool(toolId);
    }
    function removeTool(toolId, lsKey) {
      if (!confirm('Remover integração?')) return;
      localStorage.removeItem(lsKey);
      const el = document.getElementById('tool-status-' + toolId);
      if (el) { el.textContent = 'Configurar'; el.style.color = 'var(--gold)'; }
      openTool(toolId);
    }
    function closeTool() { document.getElementById('tool-panel').style.display = 'none'; currentTool = null; }
    function calcROAS() {
      const preco = parseFloat(document.getElementById('rc-preco')?.value) || 0;
      const margem = parseFloat(document.getElementById('rc-margem')?.value) || 80;
      const taxa = parseFloat(document.getElementById('rc-taxa')?.value) || 10;
      const meta = parseFloat(document.getElementById('rc-meta')?.value) || 30;
      const receitaLiq = preco * (1 - taxa / 100);
      const custoReal = preco * (1 - margem / 100);
      const contrib = receitaLiq - custoReal;
      const cacMax = contrib * (1 - meta / 100);
      const roasBE = preco / (preco - custoReal - preco * (taxa / 100));
      const roasMeta = preco / cacMax;
      const kpi = (label, value, color = 'var(--text)') => `<div class="card" style="text-align:center"><div style="font-size:22px;font-weight:700;color:${color}">${value}</div><div style="font-size:10px;color:var(--text3);margin-top:4px">${label}</div></div>`;
      document.getElementById('rc-results').innerHTML = `<div class="brief-label">Resultados</div>
        ${kpi('CAC Máx Breakeven', 'R$' + contrib.toFixed(0), 'var(--red-bright)')}
        ${kpi('CAC Máx c/ Meta', 'R$' + cacMax.toFixed(0), 'var(--gold)')}
        ${kpi('ROAS Breakeven', roasBE.toFixed(2) + 'x', 'var(--blue-bright)')}
        ${kpi('ROAS Target', roasMeta.toFixed(2) + 'x', 'var(--green-bright)')}`;
    }
    function exportBackup() {
      const data = { version: '5.0', exportedAt: new Date().toISOString(), kanban: JSON.parse(localStorage.getItem('imperio_kanban') || '[]'), docs: JSON.parse(localStorage.getItem('imperio_docs') || '[]'), kb: JSON.parse(localStorage.getItem('imperio_kb') || '{}') };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `imperio-hq-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    }
    function importBackup(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { try { const data = JSON.parse(e.target.result); if (data.kanban) { localStorage.setItem('imperio_kanban', JSON.stringify(data.kanban)); knCards = knLoad(); } if (data.docs) { localStorage.setItem('imperio_docs', JSON.stringify(data.docs)); DOCS = docsLoad(); } if (data.kb) { localStorage.setItem('imperio_kb', JSON.stringify(data.kb)); KB_DATA = kbLoad(); } alert('✅ Backup importado!'); } catch (err) { alert('❌ Erro: ' + err.message); } };
      reader.readAsText(file);
    }
