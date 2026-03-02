    // ═══════════════════════════════════════════════════════
    //  EXPERT TAB
    // ═══════════════════════════════════════════════════════
    function renderExpert() {
      const p = currentProject;
      if (!p.expert) p.expert = { nome: '', foto: '', bio: '', area: '', anos_exp: '', alunos: '', certificacoes: '', tom_voz: '', palavras_usa: '', palavras_evita: '', metodo: '', pilares: '', transformacao: '', conteudos: '' };
      const ex = p.expert;
      const el = document.getElementById('tab-expert');

      el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">🎤 Expert / Especialista: ${p.nome}</div>
      <button onclick="exportExpertContexto()" style="background:rgba(91,141,238,.12);color:#5b8dee;border:1px solid rgba(91,141,238,.3);padding:7px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📋 Exportar para IA</button>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">👤 Dados Pessoais</div>
        <div style="display:flex;gap:12px;margin-bottom:12px">
          <div style="flex-shrink:0">
            ${ex.foto ? `<img src="${ex.foto}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid var(--gold)">` : `<div style="width:72px;height:72px;border-radius:50%;background:var(--surface2);border:3px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:28px">👤</div>`}
          </div>
          <div style="flex:1">
            <div class="brief-field"><div class="brief-label">Nome Completo</div><input class="brief-input" value="${ex.nome || ''}" placeholder="Nome do Expert" onblur="saveExpert('nome',this.value)"></div>
            <div class="brief-field"><div class="brief-label">Foto do Expert</div><div style="display:flex;gap:8px;align-items:center"><input class="brief-input" value="${ex.foto && !ex.foto.startsWith('data:') ? ex.foto : ''}" placeholder="https://..." onblur="saveExpert('foto',this.value);renderExpert()" style="flex:1"><label style="cursor:pointer;background:var(--surface2);border:1px solid var(--border2);border-radius:6px;padding:5px 10px;font-size:11px;color:var(--text2);white-space:nowrap;flex-shrink:0">📂 Upload<input type="file" accept="image/*" style="display:none" onchange="uploadFotoExpert(this)"></label></div></div>
          </div>
        </div>
        <div class="brief-field"><div class="brief-label">Área de Atuação</div><input class="brief-input" value="${ex.area || ''}" placeholder="Ex: Saúde Integrativa, Imobiliário..." onblur="saveExpert('area',this.value)"></div>
        <div class="brief-field"><div class="brief-label">Bio Curta (para copy)</div><textarea class="brief-input" rows="3" placeholder="Quem ele é e por que é autoridade neste assunto..." onblur="saveExpert('bio',this.value)">${ex.bio || ''}</textarea></div>
        <div class="grid2">
          <div class="brief-field"><div class="brief-label">Anos de Experiência</div><input class="brief-input" value="${ex.anos_exp || ''}" placeholder="Ex: 12 anos" onblur="saveExpert('anos_exp',this.value)"></div>
          <div class="brief-field"><div class="brief-label">Alunos / Clientes</div><input class="brief-input" value="${ex.alunos || ''}" placeholder="Ex: +3.000 alunos" onblur="saveExpert('alunos',this.value)"></div>
        </div>
        <div class="brief-field"><div class="brief-label">Certificações / Formações</div><textarea class="brief-input" rows="2" placeholder="Formações, certificações, prova social acadêmica..." onblur="saveExpert('certificacoes',this.value)">${ex.certificacoes || ''}</textarea></div>
      </div>

      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-title">🗣️ Como Ele Fala</div>
          <div class="brief-field"><div class="brief-label">Tom de Voz</div><input class="brief-input" value="${ex.tom_voz || ''}" placeholder="Ex: Autoritário mas acessível, direto, empático..." onblur="saveExpert('tom_voz',this.value)"></div>
          <div class="brief-field"><div class="brief-label">Palavras / Expressões que Usa Muito</div><textarea class="brief-input" rows="3" placeholder="Expressões características, gírias, jargões..." onblur="saveExpert('palavras_usa',this.value)">${ex.palavras_usa || ''}</textarea></div>
          <div class="brief-field"><div class="brief-label">Palavras / Expressões que Evita</div><textarea class="brief-input" rows="2" placeholder="O que ele nunca diria, termos que rejeita..." onblur="saveExpert('palavras_evita',this.value)">${ex.palavras_evita || ''}</textarea></div>
        </div>
        <div class="card">
          <div class="card-title">🧠 O que Ele Ensina</div>
          <div class="brief-field"><div class="brief-label">Método / Framework Principal</div><input class="brief-input" value="${ex.metodo || ''}" placeholder="Ex: Método XYZ, Framework dos 3 Pilares..." onblur="saveExpert('metodo',this.value)"></div>
          <div class="brief-field"><div class="brief-label">Pilares do Ensino</div><textarea class="brief-input" rows="3" placeholder="Os 3-5 pilares centrais do que ele ensina..." onblur="saveExpert('pilares',this.value)">${ex.pilares || ''}</textarea></div>
          <div class="brief-field"><div class="brief-label">Transformação Prometida</div><textarea class="brief-input" rows="2" placeholder="O resultado concreto que o aluno alcança..." onblur="saveExpert('transformacao',this.value)">${ex.transformacao || ''}</textarea></div>
          <div class="brief-field"><div class="brief-label">Temas / Conteúdos Principais</div><textarea class="brief-input" rows="2" placeholder="Assuntos sobre os quais ele cria conteúdo..." onblur="saveExpert('conteudos',this.value)">${ex.conteudos || ''}</textarea></div>
        </div>
      </div>
    </div>`;
    }

    function saveExpert(key, val) {
      if (!currentProject.expert) currentProject.expert = {};
      currentProject.expert[key] = val;
    }

    function uploadFotoExpert(input) {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        saveExpert('foto', e.target.result);
        renderExpert();
      };
      reader.readAsDataURL(file);
    }

    function exportExpertContexto() {
      const ex = currentProject.expert || {};
      const p = currentProject;
      let ctx = `# 🎤 EXPERT PROFILE — ${p.nome}\n\n`;
      ctx += `## Dados Pessoais\n- **Nome:** ${ex.nome || '—'}\n- **Área:** ${ex.area || '—'}\n- **Experiência:** ${ex.anos_exp || '—'}\n- **Alunos:** ${ex.alunos || '—'}\n- **Certificações:** ${ex.certificacoes || '—'}\n\n`;
      ctx += `## Bio\n${ex.bio || '—'}\n\n`;
      ctx += `## Como Fala\n- **Tom:** ${ex.tom_voz || '—'}\n- **Usa muito:** ${ex.palavras_usa || '—'}\n- **Evita:** ${ex.palavras_evita || '—'}\n\n`;
      ctx += `## O que Ensina\n- **Método:** ${ex.metodo || '—'}\n- **Pilares:** ${ex.pilares || '—'}\n- **Transformação:** ${ex.transformacao || '—'}\n- **Conteúdos:** ${ex.conteudos || '—'}\n`;
      const out = document.createElement('textarea');
      out.value = ctx; document.body.appendChild(out); out.select(); document.execCommand('copy'); document.body.removeChild(out);
      alert('✅ Perfil do Expert copiado para o clipboard! Cole no agente de IA.');
    }

    // ═══════════════════════════════════════════════════════
    //  MÍDIA TAB
    // ═══════════════════════════════════════════════════════
    function renderMidia() {
      const p = currentProject;
      if (!p.midia) p.midia = { expert: [], produtos: [], complementar: [] };
      const m = p.midia;
      const el = document.getElementById('tab-midia');

      function midiaSection(title, icon, key, addLabel) {
        const items = m[key] || [];
        const cardsHtml = items.map((item, i) => `
          <div style="position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:var(--surface2)">
            <img src="${item.url}" alt="${item.legenda || ''}" style="width:100%;height:120px;object-fit:cover" onerror="this.style.display='none'">
            ${!item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) ? `<div style="height:80px;display:flex;align-items:center;justify-content:center;font-size:28px">${icon}</div>` : ''}
            <div style="padding:8px">
              <div style="font-size:11px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.legenda || item.url}</div>
              <div style="display:flex;gap:6px;margin-top:6px">
                <a href="${item.url}" target="_blank" class="btn btn-sm btn-outline" style="font-size:10px;text-decoration:none">Abrir</a>
              </div>
            </div>
            <button onclick="removeMidia('${key}',${i})" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.7);border:none;color:#e05c5c;border-radius:4px;cursor:pointer;font-size:11px;padding:2px 7px">✕</button>
          </div>`).join('');

        return `<div class="card" style="margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div class="card-title" style="margin-bottom:0">${icon} ${title}</div>
            <button onclick="openMidiaModal('${key}','${addLabel}')" class="btn btn-sm btn-outline">+ ${addLabel}</button>
          </div>
          ${items.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px">${cardsHtml}</div>` : `<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">Nenhuma imagem adicionada<br><span style="font-size:11px;opacity:.6">Clique em + ${addLabel} para adicionar</span></div>`}
        </div>`;
      }

      el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">🖼️ Galeria de Mídia: ${p.nome}</div>
      <div style="font-size:11px;color:var(--text3)">${(m.expert.length + m.produtos.length + m.complementar.length)} arquivo(s)</div>
    </div>
    ${midiaSection('Fotos do Expert', '👤', 'expert', 'Foto Expert')}
    ${midiaSection('Fotos dos Produtos', '📦', 'produtos', 'Foto Produto')}
    ${midiaSection('Imagens Complementares', '🌟', 'complementar', 'Imagem')}`;
    }

    function openMidiaModal(key, label) {
      const m = document.getElementById('midia-modal');
      m.querySelector('#midia-modal-title').textContent = '+ ' + label;
      m.dataset.key = key;
      m.style.opacity = '1'; m.style.pointerEvents = 'all';
      document.getElementById('midia-url').value = '';
      document.getElementById('midia-legenda').value = '';
    }
    function closeMidiaModal() {
      const m = document.getElementById('midia-modal');
      m.style.opacity = '0'; m.style.pointerEvents = 'none';
    }
    function saveMidia() {
      const url = document.getElementById('midia-url').value.trim();
      if (!url) { alert('URL obrigatória'); return; }
      const key = document.getElementById('midia-modal').dataset.key;
      const legenda = document.getElementById('midia-legenda').value.trim();
      if (!currentProject.midia) currentProject.midia = { expert: [], produtos: [], complementar: [] };
      if (!currentProject.midia[key]) currentProject.midia[key] = [];
      currentProject.midia[key].push({ url, legenda });
      closeMidiaModal();
      renderMidia();
    }
    function removeMidia(key, i) {
      currentProject.midia[key].splice(i, 1);
      renderMidia();
    }
