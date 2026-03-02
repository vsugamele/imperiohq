    // ═══════════════════════════════════════════════════════
    //  BIBLIOTECA DE REFERÊNCIAS
    // ═══════════════════════════════════════════════════════
    let referencias = JSON.parse(localStorage.getItem('imperio_referencias') || '[]');
    let refEditIdx = null;
    const tipoEmojis = { 'Criativo': '🎬', 'Página de Captura': '📋', 'VSL': '🎥', 'Funil': '🔻', 'Copy': '✍️', 'Landing Page': '🌐', 'Email': '📧' };

    function showReferencias() {
      hideAllPanels();
      document.getElementById('view-referencias').classList.add('active');
      document.getElementById('nav-referencias').classList.add('active');
      renderReferencias();
    }

    function renderReferencias() {
      const search = (document.getElementById('ref-search')?.value || '').toLowerCase();
      const tipo = document.getElementById('ref-filter-tipo')?.value || '';
      let items = referencias.filter(r => {
        const matchSearch = !search || r.url?.toLowerCase().includes(search) || r.notas?.toLowerCase().includes(search) || r.nicho?.toLowerCase().includes(search) || r.tags?.toLowerCase().includes(search);
        const matchTipo = !tipo || r.tipo === tipo;
        return matchSearch && matchTipo;
      });
      const grid = document.getElementById('ref-grid');
      const empty = document.getElementById('ref-empty');
      if (!items.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
      empty.style.display = 'none';
      const realIdx = (item) => referencias.indexOf(item);
      grid.innerHTML = items.map(r => {
        const idx = realIdx(r);
        const tags = (r.tags || '').split(',').filter(t => t.trim()).map(t => `<span class="tool-tag">${t.trim()}</span>`).join('');
        const thumbUrl = r.url ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(r.url)}&sz=64` : '';
        const emoji = tipoEmojis[r.tipo] || '🔗';
        return `<div class="ref-card">
          <div class="ref-card-thumb">
            ${thumbUrl ? `<img src="${thumbUrl}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" style="width:48px;height:48px;border-radius:8px;object-fit:contain">` : ''}
            <div class="ref-card-thumb-placeholder" ${thumbUrl ? 'style="display:none"' : ''}>${emoji}</div>
            <div class="ref-card-type">${r.tipo || 'Link'}</div>
          </div>
          <div class="ref-card-body">
            <div class="ref-card-url" title="${r.url || ''}">${r.url || 'Sem URL'}</div>
            ${r.nicho ? `<div style="font-size:10px;color:var(--gold);margin-bottom:6px">📍 ${r.nicho}</div>` : ''}
            <div class="ref-card-tags">${tags}</div>
            ${r.notas ? `<div class="ref-card-notes">${r.notas}</div>` : ''}
            <div class="ref-card-actions">
              ${r.url ? `<a href="${r.url}" target="_blank" class="btn btn-sm btn-outline" style="text-decoration:none">🔗 Abrir</a>` : ''}
              <button class="btn btn-sm btn-outline" onclick="editRef(${idx})">✏ Editar</button>
              <button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteRef(${idx})">✕</button>
            </div>
          </div>
        </div>`;
      }).join('');
    }

    function openRefModal(idx = null) {
      refEditIdx = idx;
      const r = idx !== null ? referencias[idx] : {};
      const isEdit = idx !== null;
      const projOpts = PROJECTS.map(p => `<option value="${p.nome}" ${r.projeto === p.nome ? 'selected' : ''}>${p.nome}</option>`).join('');
      const m = document.getElementById('ref-modal');
      m.querySelector('#ref-modal-title').textContent = isEdit ? '✏ Editar Referência' : '➕ Adicionar Referência';
      m.querySelector('#ref-modal-fields').innerHTML = `
        <div class="brief-field"><div class="brief-label">URL *</div><input id="rf-url" class="brief-input" value="${r.url || ''}" placeholder="https://..."></div>
        <div class="brief-field"><div class="brief-label">Tipo</div><select id="rf-tipo" class="brief-input"><option value="">Selecionar...</option>${Object.keys(tipoEmojis).map(t => `<option value="${t}" ${r.tipo === t ? 'selected' : ''}>${tipoEmojis[t]} ${t}</option>`).join('')}</select></div>
        <div class="brief-field"><div class="brief-label">Nicho</div><input id="rf-nicho" class="brief-input" value="${r.nicho || ''}" placeholder="Ex: Saúde, Imobiliário..."></div>
        <div class="brief-field"><div class="brief-label">Tags (separadas por vírgula)</div><input id="rf-tags" class="brief-input" value="${r.tags || ''}" placeholder="emagrecimento, highticket, video curto..."></div>
        <div class="brief-field"><div class="brief-label">Notas / Por que é uma boa referência?</div><textarea id="rf-notas" class="brief-input" rows="3" placeholder="O que tem de bom nessa referência...">${r.notas || ''}</textarea></div>
        <div class="brief-field"><div class="brief-label">Projeto Vinculado</div><select id="rf-projeto" class="brief-input"><option value="">Nenhum específico (geral)</option>${projOpts}</select></div>`;
      m.style.opacity = '1'; m.style.pointerEvents = 'all';
    }

    function closeRefModal() {
      const m = document.getElementById('ref-modal');
      m.style.opacity = '0'; m.style.pointerEvents = 'none';
    }

    function saveRef() {
      const url = document.getElementById('rf-url').value.trim();
      if (!url) { alert('URL é obrigatória'); return; }
      const obj = { url, tipo: document.getElementById('rf-tipo').value, nicho: document.getElementById('rf-nicho').value.trim(), tags: document.getElementById('rf-tags').value, notas: document.getElementById('rf-notas').value.trim(), projeto: document.getElementById('rf-projeto').value, data: new Date().toLocaleDateString('pt-BR') };
      if (refEditIdx !== null) referencias[refEditIdx] = obj; else referencias.push(obj);
      localStorage.setItem('imperio_referencias', JSON.stringify(referencias));
      closeRefModal(); renderReferencias();
    }

    function editRef(idx) { openRefModal(idx); }
    function deleteRef(idx) { if (!confirm('Excluir referência?')) return; referencias.splice(idx, 1); localStorage.setItem('imperio_referencias', JSON.stringify(referencias)); renderReferencias(); }

    function exportRefContexto() {
      if (!referencias.length) { alert('Nenhuma referência cadastrada para exportar'); return; }
      let ctx = `# 🖼️ BIBLIOTECA DE REFERÊNCIAS — IMPÉRIO HQ\n\nUse estas referências como inspiração para criar conteúdos, criativos e páginas alinhados às melhores práticas do mercado.\n\n`;
      const byTipo = {};
      referencias.forEach(r => { if (!byTipo[r.tipo || 'Geral']) byTipo[r.tipo || 'Geral'] = []; byTipo[r.tipo || 'Geral'].push(r); });
      Object.entries(byTipo).forEach(([tipo, items]) => {
        ctx += `## ${tipoEmojis[tipo] || '🔗'} ${tipo}\n`;
        items.forEach(r => {
          ctx += `- **URL:** ${r.url}\n`;
          if (r.nicho) ctx += `  **Nicho:** ${r.nicho}\n`;
          if (r.tags) ctx += `  **Tags:** ${r.tags}\n`;
          if (r.notas) ctx += `  **Notas:** ${r.notas}\n`;
          ctx += '\n';
        });
      });
      ctx += `\nTotal de referências: ${referencias.length}`;
      const out = document.createElement('textarea');
      out.value = ctx; document.body.appendChild(out); out.select(); document.execCommand('copy'); document.body.removeChild(out);
      alert(`✅ Contexto copiado! ${referencias.length} referências exportadas. Cole no agente de IA.`);
    }
