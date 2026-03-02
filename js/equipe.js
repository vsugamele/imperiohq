    // ═══════════════════════════════════════════════════════
    //  EQUIPE
    // ═══════════════════════════════════════════════════════
    const EQUIPE_SEED = [
      { id: 'mb_vinicius', emoji: '⚡', nome: 'Vinicius', cargo: 'Founder / Operações', foto: '', email: '', whatsapp: '', especialidade: 'Estratégia e operação', status: 'Ativo' },
      { id: 'mb_bruno', emoji: '🧠', nome: 'Bruno', cargo: 'Operações', foto: '', email: '', whatsapp: '', especialidade: 'Execução operacional', status: 'Ativo' },
      { id: 'mb_taisa', emoji: '🎯', nome: 'Taísa', cargo: 'Marketing', foto: '', email: '', whatsapp: '', especialidade: 'Conteúdo e gestão', status: 'Ativo' },
      { id: 'mb_wagner', emoji: '🛠️', nome: 'Wagner', cargo: 'Tech / Suporte', foto: '', email: '', whatsapp: '', especialidade: 'Integrações e suporte', status: 'Ativo' },
      { id: 'mb_arthur', emoji: '🚀', nome: 'Arthur', cargo: 'Growth', foto: '', email: '', whatsapp: '', especialidade: 'Growth e performance', status: 'Ativo' },
      { id: 'mb_alessandra', emoji: '📋', nome: 'Alessandra', cargo: 'Projetos', foto: '', email: '', whatsapp: '', especialidade: 'Coordenação de projetos', status: 'Ativo' }
    ];

    function mergeEquipeSeed(existing) {
      const out = Array.isArray(existing) ? [...existing] : [];
      const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      const byName = new Set(out.map(m => norm(m.nome)));
      EQUIPE_SEED.forEach(seed => {
        if (!byName.has(norm(seed.nome))) out.push(seed);
      });
      return out;
    }

    let EQUIPE = mergeEquipeSeed(JSON.parse(localStorage.getItem('imperio_equipe') || '[]'));
    let editingMembroIdx = -1;

    function saveEquipe() { localStorage.setItem('imperio_equipe', JSON.stringify(EQUIPE)); }
    saveEquipe();

    function showEquipe() {
      showSection('equipe');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const nav = document.getElementById('nav-equipe');
      if (nav) nav.classList.add('active');
      renderEquipe();
    }

    function renderEquipe() {
      const search = (document.getElementById('equipe-search')?.value || '').toLowerCase();
      const statusFilter = document.getElementById('equipe-filter-status')?.value || '';
      let members = EQUIPE.filter(m =>
        (!search || m.nome.toLowerCase().includes(search) || (m.cargo || '').toLowerCase().includes(search)) &&
        (!statusFilter || m.status === statusFilter)
      );

      const grid = document.getElementById('equipe-grid');
      const empty = document.getElementById('equipe-empty');
      if (!members.length) {
        grid.style.display = 'none'; empty.style.display = 'block'; return;
      }
      grid.style.display = 'grid'; empty.style.display = 'none';

      const statusColors = { Ativo: '#52b788', 'Férias': 'var(--gold)', Off: '#e05c5c' };

      grid.innerHTML = members.map((m, i) => {
        const realIdx = EQUIPE.indexOf(m);
        // Count kanban tasks assigned to this member
        const kanbanData = JSON.parse(localStorage.getItem('imperio_kanban') || '[]');
        const taskCount = kanbanData.filter(c => c.assignee === (m.id || m.nome)).length;
        const color = statusColors[m.status] || 'var(--text3)';
        const avatarHtml = m.foto
          ? `<img src="${m.foto}" alt="${m.nome}">`
          : m.emoji || '👤';
        return `
        <div class="membro-card">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
            <div class="membro-avatar">${typeof avatarHtml === 'string' && avatarHtml.startsWith('<img') ? avatarHtml : `<span>${avatarHtml}</span>`}</div>
            <div style="flex:1;min-width:0">
              <div class="membro-name">${m.nome}</div>
              <div class="membro-role">${m.cargo || '—'}</div>
              <div style="margin-top:4px;font-size:10px">
                <span class="membro-status-dot" style="background:${color}"></span>
                <span style="color:${color}">${m.status}</span>
              </div>
            </div>
          </div>
          ${m.especialidade ? `<div style="font-size:10px;color:var(--text3);margin-bottom:10px;line-height:1.4">🎯 ${m.especialidade}</div>` : ''}
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            ${m.email ? `<a href="mailto:${m.email}" style="font-size:10px;color:var(--text3);text-decoration:none;border:1px solid var(--border);border-radius:4px;padding:2px 7px" title="${m.email}">✉️ Email</a>` : ''}
            ${m.whatsapp ? `<a href="https://wa.me/${m.whatsapp.replace(/\D/g, '')}" target="_blank" style="font-size:10px;color:var(--text3);text-decoration:none;border:1px solid var(--border);border-radius:4px;padding:2px 7px">💬 WhatsApp</a>` : ''}
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="viewMemberBacklog('${m.id || m.nome}', '${m.nome}')" class="btn btn-sm btn-outline" style="flex:1;font-size:10px">
              📋 Backlog ${taskCount ? `<span style="background:var(--gold);color:#000;border-radius:8px;padding:0 5px;font-size:9px;margin-left:3px">${taskCount}</span>` : ''}
            </button>
            <button onclick="openMembroModal(${realIdx})" class="btn btn-sm btn-outline" style="font-size:10px">✏️</button>
            <button onclick="removeMembro(${realIdx})" class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c;font-size:10px">✕</button>
          </div>
        </div>`;
      }).join('');
    }

    function openMembroModal(idx = -1) {
      editingMembroIdx = idx;
      const m = idx >= 0 ? EQUIPE[idx] : null;
      document.getElementById('membro-modal-title').textContent = m ? '✏️ Editar Membro' : '👥 Novo Membro';
      document.getElementById('mb-emoji').value = m?.emoji || '👤';
      document.getElementById('mb-nome').value = m?.nome || '';
      document.getElementById('mb-cargo').value = m?.cargo || '';
      document.getElementById('mb-foto').value = m?.foto || '';
      document.getElementById('mb-email').value = m?.email || '';
      document.getElementById('mb-whats').value = m?.whatsapp || '';
      document.getElementById('mb-especialidade').value = m?.especialidade || '';
      document.getElementById('mb-status').value = m?.status || 'Ativo';
      const ml = document.getElementById('membro-modal');
      ml.style.opacity = '1'; ml.style.pointerEvents = 'all';
    }
    function closeMembroModal() {
      const ml = document.getElementById('membro-modal');
      ml.style.opacity = '0'; ml.style.pointerEvents = 'none';
    }
    function saveMembroModal() {
      const nome = document.getElementById('mb-nome').value.trim();
      if (!nome) { alert('Nome obrigatório'); return; }
      const data = {
        id: editingMembroIdx >= 0 ? EQUIPE[editingMembroIdx].id : 'mb_' + Date.now(),
        emoji: document.getElementById('mb-emoji').value.trim() || '👤',
        nome, cargo: document.getElementById('mb-cargo').value.trim(),
        foto: document.getElementById('mb-foto').value.trim(),
        email: document.getElementById('mb-email').value.trim(),
        whatsapp: document.getElementById('mb-whats').value.trim(),
        especialidade: document.getElementById('mb-especialidade').value.trim(),
        status: document.getElementById('mb-status').value
      };
      if (editingMembroIdx >= 0) EQUIPE[editingMembroIdx] = data;
      else EQUIPE.push(data);
      saveEquipe();
      closeMembroModal();
      renderEquipe();
    }
    function removeMembro(idx) {
      if (!confirm(`Remover ${EQUIPE[idx].nome}?`)) return;
      EQUIPE.splice(idx, 1);
      saveEquipe();
      renderEquipe();
    }

    function viewMemberBacklog(memberId, nome) {
      const kanbanData = JSON.parse(localStorage.getItem('imperio_kanban') || '[]');
      const tasks = kanbanData.filter(c => c.assignee === memberId);
      const panel = document.getElementById('equipe-backlog-panel');
      document.getElementById('backlog-panel-title').textContent = `📋 Backlog de ${nome}`;
      const container = document.getElementById('backlog-cards');

      if (!tasks.length) {
        container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text3);font-size:12px">Nenhuma task atribuída a ${nome}<br>
          <button onclick="openKanbanTaskForMember('${memberId}')" class="btn btn-outline" style="margin-top:10px;font-size:11px">+ Criar Task</button></div>`;
      } else {
        const statColors = { 'A Fazer': 'var(--text3)', 'Em Andamento': 'var(--gold)', 'Revisão': '#5b8dee', 'Concluído': 'var(--green-bright)', 'Bloqueado': '#e05c5c' };
        container.innerHTML = tasks.map(t => `
          <div class="backlog-task-card">
            <span style="font-size:16px">${t.icon || '📌'}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;color:var(--text)">${t.title}</div>
              <div style="font-size:10px;color:var(--text3)">${t.projeto || 'Geral'} · ${t.dept || ''}</div>
            </div>
            <span style="font-size:10px;color:${statColors[t.status] || 'var(--text3)'};border:1px solid ${statColors[t.status] || 'var(--border)'};padding:2px 7px;border-radius:8px;white-space:nowrap">${t.status}</span>
          </div>`).join('') +
          `<button onclick="openKanbanTaskForMember('${memberId}')" class="btn btn-outline" style="width:100%;font-size:11px;margin-top:6px">+ Criar Nova Task</button>`;
      }
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function closeBacklogPanel() {
      document.getElementById('equipe-backlog-panel').style.display = 'none';
    }
    function openKanbanTaskForMember(memberId) {
      // Switch to Kanban and pre-fill assignee
      showKanban();
      // store for kanban modal to read
      window._prefilledAssignee = memberId;
    }
