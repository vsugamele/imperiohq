    function showWhatsApp() {
      showSection('whatsapp');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const nav = document.getElementById('nav-whatsapp');
      if (nav) nav.classList.add('active');
      const badge = document.getElementById('wa-active-badge');
      if (badge) { badge.style.display = 'inline-flex'; badge.textContent = '3'; }
      // Check all session statuses on open
      waCheckAllStatuses();
    }

    // ── WhatsApp Bridge API ──────────────────────────────────────
    const WA_API = 'http://localhost:3000/wa';

    async function waFetch(path, opts = {}) {
      const r = await fetch(WA_API + path, opts);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }

    // Check a single session status and update UI
    async function waCheckStatus(session) {
      const el = document.getElementById(`wa-session-${session}`);
      if (el) el.textContent = 'Verificando...';
      try {
        const data = await waFetch(`/status?session=${session}`);
        if (el) {
          el.textContent = data.connected ? '✅ Conectado' : '⚠ Desconectado';
          el.style.color = data.connected ? 'var(--green-bright)' : 'var(--text3)';
        }
        return data.connected;
      } catch {
        if (el) { el.textContent = '○ Bridge offline'; el.style.color = 'var(--text3)'; }
        return false;
      }
    }

    function waCheckAllStatuses() {
      ['forex', 'igaming', 'eu'].forEach(s => waCheckStatus(s));
    }

    // Generate QR code for a session — main entry point
    async function waGenerateQR(session, force = false) {
      const btn = document.getElementById(`wa-qr-btn-${session}`);
      if (btn) { btn.disabled = true; btn.textContent = '⏳ Gerando...'; }

      try {
        const data = await waFetch(`/qr?session=${session}&force=${force ? 1 : 0}`, { method: 'POST' });

        if (data.qrDataUrl) {
          waShowQRModal(session, data.qrDataUrl);
          waPollStatus(session);           // start polling in background
        } else {
          // Already connected or other message
          const el = document.getElementById(`wa-session-${session}`);
          if (el) { el.textContent = data.message; el.style.color = 'var(--gold)'; }
          if (data.message?.toLowerCase().includes('already linked') ||
              data.message?.toLowerCase().includes('já conectado')) {
            waCheckStatus(session);
          }
        }
      } catch (err) {
        alert(`❌ Bridge offline ou clawdbot não instalado.\n\nCertifique-se que o server.js está rodando.\n\nDetalhe: ${err.message}`);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📱 QR'; }
      }
    }

    // Start bot (for now same as QR but can be extended)
    function waStartBot(session) {
      waGenerateQR(session);
    }

    // ── QR Modal ─────────────────────────────────────────────────
    function waShowQRModal(session, qrDataUrl) {
      // Build modal if it doesn't exist
      let modal = document.getElementById('wa-qr-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'wa-qr-modal';
        modal.style.cssText = `
          position:fixed;inset:0;z-index:9999;
          background:rgba(0,0,0,0.85);
          display:flex;align-items:center;justify-content:center;
          backdrop-filter:blur(6px);
        `;
        modal.onclick = e => { if (e.target === modal) waCloseQRModal(); };
        document.body.appendChild(modal);
      }

      const labels = { forex: '📈 Forex', igaming: '🎰 iGaming', eu: '👤 Pessoal' };
      const label  = labels[session] || session;

      modal.innerHTML = `
        <div style="
          background:var(--surface,#111);
          border:1px solid rgba(201,168,76,.3);
          border-radius:16px;
          padding:28px;
          max-width:360px;
          width:100%;
          text-align:center;
          position:relative;
          box-shadow:0 0 60px rgba(201,168,76,.12);
        ">
          <button onclick="waCloseQRModal()" style="
            position:absolute;top:12px;right:12px;
            background:transparent;border:none;
            font-size:18px;color:var(--text3,#888);cursor:pointer;
          ">✕</button>

          <div style="font-size:13px;font-weight:700;letter-spacing:2px;
                      color:var(--gold,#c9a84c);margin-bottom:6px;text-transform:uppercase">
            ${label} — Scan QR
          </div>
          <div style="font-size:11px;color:var(--text3,#888);margin-bottom:16px">
            Abra WhatsApp → Dispositivos conectados → Conectar dispositivo
          </div>

          <div id="wa-qr-img-wrap" style="
            background:#fff;border-radius:12px;padding:12px;display:inline-block;
            box-shadow:0 0 30px rgba(255,255,255,.05);
          ">
            <img src="${qrDataUrl}" style="width:220px;height:220px;display:block" alt="QR Code">
          </div>

          <div id="wa-qr-status" style="
            font-size:11px;color:var(--text3,#888);
            margin-top:14px;
          ">⏳ Aguardando scan... (expira em 3 min)</div>

          <div style="display:flex;gap:8px;margin-top:16px">
            <button onclick="waGenerateQR('${session}', true)" style="
              flex:1;padding:8px;border-radius:8px;
              border:1px solid rgba(201,168,76,.3);
              background:rgba(201,168,76,.08);
              color:var(--gold,#c9a84c);
              font-size:11px;font-weight:700;cursor:pointer;
            ">🔄 Novo QR</button>
            <button onclick="waCloseQRModal()" style="
              flex:1;padding:8px;border-radius:8px;
              border:1px solid var(--border,#333);
              background:transparent;color:var(--text3,#888);
              font-size:11px;cursor:pointer;
            ">Fechar</button>
          </div>
        </div>`;

      modal.style.display = 'flex';
      // Store current session
      modal.dataset.session = session;
    }

    function waCloseQRModal() {
      const modal = document.getElementById('wa-qr-modal');
      if (modal) { modal.style.display = 'none'; modal.dataset.session = ''; }
      if (_waPollTimer) { clearInterval(_waPollTimer); _waPollTimer = null; }
    }

    // ── Status polling after QR display ─────────────────────────
    let _waPollTimer = null;

    function waPollStatus(session) {
      if (_waPollTimer) clearInterval(_waPollTimer);
      const startAt = Date.now();

      _waPollTimer = setInterval(async () => {
        const modal = document.getElementById('wa-qr-modal');
        const statusEl = document.getElementById('wa-qr-status');

        // Stop if modal closed or 3 min elapsed
        if (!modal || modal.style.display === 'none' || !modal.dataset.session) {
          clearInterval(_waPollTimer); _waPollTimer = null; return;
        }
        if (Date.now() - startAt > 3 * 60 * 1000) {
          if (statusEl) statusEl.textContent = '⏰ QR expirado — clique em "Novo QR"';
          clearInterval(_waPollTimer); _waPollTimer = null; return;
        }

        try {
          const data = await waFetch(`/status?session=${session}`);
          if (data.connected) {
            if (statusEl) { statusEl.textContent = '✅ Conectado com sucesso!'; statusEl.style.color = 'var(--green-bright)'; }
            waCheckStatus(session);
            // Close modal after 2s
            setTimeout(() => waCloseQRModal(), 2000);
            clearInterval(_waPollTimer); _waPollTimer = null;
          }
        } catch { /* bridge may be busy */ }
      }, 3000);
    }

    function goOCStep(n) {
      ocCurrentStep = n;
      renderOCStep();
    }

    function ocNav(delta) {
      const next = ocCurrentStep + delta;
      if (next < 1 || next > 4) return;
      ocCurrentStep = next;
      renderOCStep();
    }

    function renderOCStep() {
      // Update step bar
      [1, 2, 3, 4].forEach(i => {
        const el = document.getElementById('ocstep-' + i);
        if (!el) return;
        el.classList.remove('active', 'done');
        if (i === ocCurrentStep) el.classList.add('active');
        else if (i < ocCurrentStep) el.classList.add('done');
      });
      // Update badge
      const badge = document.getElementById('oc-step-badge');
      if (badge) badge.textContent = `Passo ${ocCurrentStep} de 4`;
      // Show/hide nav
      const prev = document.getElementById('oc-prev-btn');
      const next = document.getElementById('oc-next-btn');
      if (prev) prev.style.display = ocCurrentStep > 1 ? '' : 'none';
      if (next) {
        next.style.display = ocCurrentStep < 4 ? '' : 'none';
        next.textContent = ocCurrentStep === 3 ? 'Gerar Prompt →' : 'Próximo →';
      }

      const el = document.getElementById('oc-content');

      if (ocCurrentStep === 1) {
        // Step 1 — Select Project
        const projectOptions = (window.projects || PROJECTS || []).map(p => `<option value="${p.id}" ${ocData.projectId === p.id ? 'selected' : ''}>${p.icon} ${p.nome}</option>`).join('');
        el.innerHTML = `
          <div class="card" style="margin-bottom:12px">
            <div class="card-title">📁 Selecionar Projeto</div>
            <div class="brief-field"><div class="brief-label">Projeto</div>
              <select id="oc-project-sel" class="brief-input" onchange="ocSelectProject(this.value)">
                <option value="">— Selecione —</option>${projectOptions}
              </select>
            </div>
          </div>
          <div id="oc-proj-preview"></div>`;
        if (ocData.projectId) ocSelectProject(ocData.projectId, false);

      } else if (ocCurrentStep === 2) {
        // Step 2 — Select References
        const refs = JSON.parse(localStorage.getItem('imperio_referencias') || '[]');
        const refHtml = refs.length ? refs.map((r, i) => {
          const sel = ocData.selectedRefs.includes(i);
          return `<div class="oc-ref-item ${sel ? 'selected' : ''}" onclick="ocToggleRef(${i}, this)">
            <input type="checkbox" ${sel ? 'checked' : ''} style="margin-top:2px;accent-color:var(--gold)">
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:700;color:var(--text)">${r.tipo} ${r.nicho ? '· ' + r.nicho : ''}</div>
              <div style="font-size:10px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.url}</div>
              ${r.notas ? `<div style="font-size:10px;color:var(--text2);margin-top:3px">${r.notas}</div>` : ''}
            </div>
            ${r.preview_url ? `<img src="${r.preview_url}" style="width:60px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0" onerror="this.style.display='none'">` : ''}
          </div>`;
        }).join('') : `<div class="empty-state" style="padding:32px"><div class="es-icon">🖼️</div><div class="es-text">Nenhuma referência cadastrada</div><div class="es-sub">Adicione na Biblioteca de Referências primeiro</div><button class="btn btn-outline" style="margin-top:10px" onclick="showReferencias()">→ Ir para Referências</button></div>`;

        el.innerHTML = `
          <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <div class="card-title" style="margin-bottom:0">🖼️ Selecionar Referências</div>
              <span style="font-size:11px;color:var(--gold)">${ocData.selectedRefs.length} selecionada(s)</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">${refHtml}</div>
          </div>`;

      } else if (ocCurrentStep === 3) {
        // Step 3 — Output Spec
        el.innerHTML = `
          <div class="card">
            <div class="card-title">⚙️ Definir Output</div>
            <div class="grid2">
              <div class="brief-field"><div class="brief-label">Tipo de Criativo</div>
                <select id="oc-tipo" class="brief-input" onchange="ocData.outputTipo=this.value">
                  ${['Ad Estático', 'Carrossel', 'Story', 'VSL Thumb', 'Landing Page Thumb', 'Email Header', 'Capa para Ebook'].map(t => `<option ${ocData.outputTipo === t ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
              </div>
              <div class="brief-field"><div class="brief-label">Quantidade</div>
                <input id="oc-qtd" class="brief-input" type="number" min="1" max="20" value="${ocData.outputQtd}" onchange="ocData.outputQtd=+this.value">
              </div>
            </div>
            <div class="grid2">
              <div class="brief-field"><div class="brief-label">Formato (dimensões)</div>
                <select id="oc-formato" class="brief-input" onchange="ocData.outputFormato=this.value">
                  ${['1080x1080 (Feed Quadrado)', '1080x1920 (Story/Reels)', '1200x628 (Link Ad)', '1080x1350 (Retrato)', 'Custom'].map(f => `<option ${ocData.outputFormato === f ? 'selected' : ''}>${f}</option>`).join('')}
                </select>
              </div>
              <div class="brief-field"><div class="brief-label">Plataforma Destino</div>
                <select id="oc-plataforma" class="brief-input" onchange="ocData.outputPlataforma=this.value">
                  ${['Meta Ads', 'TikTok Ads', 'Google Ads', 'Instagram Orgânico', 'Email', 'WhatsApp'].map(p => `<option ${ocData.outputPlataforma === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="brief-field"><div class="brief-label">Instruções Adicionais</div>
              <textarea id="oc-instrucoes" class="brief-input" rows="4" placeholder="Ex: Foco na dor de... / Use o tom de voz do expert / Destaque o gatilho de escassez..." onblur="ocData.instrucoes=this.value">${ocData.instrucoes}</textarea>
            </div>
          </div>`;

      } else if (ocCurrentStep === 4) {
        // Step 4 — Prompt + Save
        const prompt = generateOCPrompt();
        el.innerHTML = `
          <div class="card" style="margin-bottom:12px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <div class="card-title" style="margin-bottom:0">📋 Prompt Gerado para OpenClaw</div>
              <button onclick="copyOCPrompt()" style="background:rgba(91,141,238,.12);color:#5b8dee;border:1px solid rgba(91,141,238,.3);padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📋 Copiar</button>
            </div>
            <pre id="oc-prompt-text" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;font-size:11px;line-height:1.6;white-space:pre-wrap;color:var(--text2);font-family:monospace;overflow-x:auto">${prompt}</pre>
          </div>
          <div class="card">
            <div class="card-title">💾 Salvar Resultado como Asset</div>
            <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Após gerar na OpenClaw, cole as URLs dos criativos abaixo para salvar diretamente no projeto.</div>
            <div class="brief-field"><div class="brief-label">Projeto destino</div>
              <select id="oc-save-proj" class="brief-input">
                ${(window.projects || PROJECTS || []).map(p => `<option value="${p.id}" ${ocData.projectId === p.id ? 'selected' : ''}>${p.icon} ${p.nome}</option>`).join('')}
              </select>
            </div>
            <div class="brief-field"><div class="brief-label">URLs dos Criativos (1 por linha)</div>
              <textarea id="oc-result-urls" class="brief-input" rows="4" placeholder="https://...&#10;https://..."></textarea>
            </div>
            <div class="brief-field"><div class="brief-label">Nome base dos assets</div>
              <input id="oc-asset-nome" class="brief-input" placeholder="Ex: Ad iGaming Aviator Dez24" value="${ocData.outputTipo} ${ocData.outputPlataforma}"></div>
            <div style="display:flex;justify-content:flex-end;margin-top:6px">
              <button onclick="saveOCAssets()" class="btn btn-gold">💾 Salvar Todos como Assets</button>
            </div>
          </div>`;
      }
    }

    function ocSelectProject(id, update = true) {
      if (update) ocData.projectId = id;
      const p = (window.projects || PROJECTS || []).find(x => x.id === id);
      const el = document.getElementById('oc-proj-preview');
      if (!el) return;
      if (!p) { el.innerHTML = ''; return; }
      const b = p.branding || {};
      const ex = p.expert || {};
      el.innerHTML = `
        <div class="card">
          <div class="card-title">📊 Contexto Carregado</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
            <div style="background:var(--surface2);border-radius:8px;padding:10px">
              <div style="font-size:10px;color:var(--text3);margin-bottom:4px">PROJETO</div>
              <div style="font-size:12px;font-weight:700">${p.icon} ${p.nome}</div>
              <div style="font-size:10px;color:var(--text3)">${p.categoria}</div>
            </div>
            <div style="background:var(--surface2);border-radius:8px;padding:10px">
              <div style="font-size:10px;color:var(--text3);margin-bottom:4px">EXPERT</div>
              <div style="font-size:12px;font-weight:700">${ex.nome || 'Não definido'}</div>
              <div style="font-size:10px;color:var(--text3)">${ex.area || ''}</div>
            </div>
            <div style="background:var(--surface2);border-radius:8px;padding:10px">
              <div style="font-size:10px;color:var(--text3);margin-bottom:6px">PALETA</div>
              <div style="display:flex;border-radius:4px;overflow:hidden;height:20px">
                ${(b.cores || []).map(c => `<div style="flex:1;background:${c.hex}" title="${c.nome}"></div>`).join('') || '<div style="flex:1;background:var(--gold)"></div>'}
              </div>
            </div>
          </div>
        </div>`;
    }

    function ocToggleRef(i, el) {
      const idx = ocData.selectedRefs.indexOf(i);
      if (idx >= 0) { ocData.selectedRefs.splice(idx, 1); el.classList.remove('selected'); el.querySelector('input').checked = false; }
      else { ocData.selectedRefs.push(i); el.classList.add('selected'); el.querySelector('input').checked = true; }
      document.querySelector('#oc-content .card span[style*="gold"]').textContent = ocData.selectedRefs.length + ' selecionada(s)';
    }

    function generateOCPrompt() {
      const p = (window.projects || PROJECTS || []).find(x => x.id === ocData.projectId);
      const refs = JSON.parse(localStorage.getItem('imperio_referencias') || '[]');
      const selectedRefs = ocData.selectedRefs.map(i => refs[i]).filter(Boolean);
      const ex = p?.expert || {};
      const b = p?.branding || {};
      const produto = (p?.produtos?.[0]?.nome || p?.produto || 'Não definido');

      let prompt = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ OPENCLAW CREATIVE BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJETO
• Nome: ${p?.nome || 'Não selecionado'}
• Nicho: ${p?.categoria || '—'}
• Produto: ${produto}
• Preço: ${p?.preco || '—'}

🎤 EXPERT
• Nome: ${ex.nome || '—'}
• Área: ${ex.area || '—'}
• Tom de Voz: ${ex.tom_voz || '—'}
• Bio: ${ex.bio || '—'}

🎨 BRANDING
• Arquétipo: ${b.arquetipo || '—'}
• Personalidade: ${b.personalidade || '—'}
• Paleta: ${(b.cores || []).map(c => `${c.nome}(${c.hex})`).join(', ') || 'Padrão'}

🖼️ REFERÊNCIAS SELECIONADAS (${selectedRefs.length})
${selectedRefs.map((r, i) => `${i + 1}. [${r.tipo}] ${r.url}${r.notas ? '\n   Nota: ' + r.notas : ''}`).join('\n') || '• Nenhuma selecionada'}

⚙️ OUTPUT DESEJADO
• Tipo: ${ocData.outputTipo}
• Quantidade: ${ocData.outputQtd} peça(s)
• Formato: ${ocData.outputFormato}
• Plataforma: ${ocData.outputPlataforma}

📝 INSTRUÇÕES ADICIONAIS
${ocData.instrucoes || '• Seguir referências e branding acima'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gerado por Imperio HQ às ${new Date().toLocaleString('pt-BR')}`;
      return prompt;
    }

    function copyOCPrompt() {
      const txt = document.getElementById('oc-prompt-text')?.textContent;
      if (!txt) return;
      const t = document.createElement('textarea');
      t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
      alert('✅ Prompt copiado! Cole na OpenClaw para gerar seus criativos.');
    }

    function saveOCAssets() {
      const projId = document.getElementById('oc-save-proj')?.value;
      const urls = (document.getElementById('oc-result-urls')?.value || '').split('\n').map(u => u.trim()).filter(Boolean);
      const nomeBase = document.getElementById('oc-asset-nome')?.value.trim() || ocData.outputTipo;
      if (!projId) { alert('Selecione um projeto'); return; }
      if (!urls.length) { alert('Cole ao menos uma URL de resultado'); return; }

      const p = (window.projects || PROJECTS || []).find(x => x.id === projId);
      if (!p) { alert('Projeto não encontrado'); return; }
      if (!p.assets) p.assets = [];

      urls.forEach((url, i) => {
        p.assets.push({
          icon: '🎨',
          nome: `${nomeBase} ${i + 1}`,
          tipo: ocData.outputTipo,
          url,
          status: 'Em Revisão',
          data: new Date().toLocaleDateString('pt-BR'),
          agente: 'OpenClaw',
          plataforma: ocData.outputPlataforma
        });
      });

      alert(`✅ ${urls.length} asset(s) salvos no projeto "${p.nome}"!\nAcesse a aba Assets do projeto para visualizá-los.`);
      // Reset step
      ocCurrentStep = 1;
      ocData.selectedRefs = [];
      renderOCStep();
    }
