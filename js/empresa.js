    // ═══════════════════════════════════════════════════════
    //  CONTROLE DA EMPRESA
    // ═══════════════════════════════════════════════════════
    let empresaEmails = JSON.parse(localStorage.getItem('empresa_emails') || '[]');
    let empresaIGs = JSON.parse(localStorage.getItem('empresa_igs') || '[]');
    let empresaTTs = JSON.parse(localStorage.getItem('empresa_tts') || '[]');
    let empresaEditIdx = null;
    let empresaEditType = null;

    function showEmpresa() {
      document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('view-empresa').classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById('nav-empresa').classList.add('active');
      showEmpresaTab('emails');
    }

    function showEmpresaTab(tab) {
      document.querySelectorAll('.empresa-tab').forEach(t => t.style.display = 'none');
      document.getElementById('empresa-' + tab).style.display = 'block';
      document.querySelectorAll('#view-empresa .tab').forEach(t => t.classList.remove('active'));
      document.getElementById('etab-' + tab).classList.add('active');
      if (tab === 'emails') renderEmailTable();
      if (tab === 'instagram') renderIGTable();
      if (tab === 'tiktok') renderTTTable();
    }

    function statusBadge(status) {
      const map = { 'Ativo': 'badge-ativo', 'Inativo': 'badge-inativo', 'Aquecendo': 'badge-aquecendo', 'Bloqueado': 'badge-bloqueado' };
      return `<span class="${map[status] || 'badge-inativo'}">${status}</span>`;
    }

    function renderEmailTable() {
      const tbody = document.getElementById('email-table-body');
      const empty = document.getElementById('email-empty');
      if (!empresaEmails.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
      empty.style.display = 'none';
      tbody.innerHTML = empresaEmails.map((e, i) => `<tr class="empresa-table-row">
        <td>${e.gmail}</td>
        <td><div class="pass-cell"><span id="epass-${i}">${'•'.repeat(8)}</span><button class="pass-reveal" onclick="togglePass('epass-${i}','${e.senha || ''}')">👁</button></div></td>
        <td><label class="toggle"><input type="checkbox" ${e.em_uso ? 'checked' : ''} onchange="toggleEmailUso(${i},this.checked)"><span class="toggle-slider"></span></label></td>
        <td>${e.telefone || '—'}</td>
        <td>${statusBadge(e.aquecido || 'Inativo')}</td>
        <td>${e.data_compra || '—'}</td>
        <td>${e.perfil_ig || '—'}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-sm btn-outline" onclick="editEmpresa('email',${i})">✏</button><button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteEmpresa('email',${i})">✕</button></div></td>
      </tr>`).join('');
    }

    function renderIGTable() {
      const tbody = document.getElementById('ig-table-body');
      const empty = document.getElementById('ig-empty');
      if (!empresaIGs.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
      empty.style.display = 'none';
      tbody.innerHTML = empresaIGs.map((a, i) => `<tr class="empresa-table-row">
        <td>@${a.usuario}</td>
        <td><div class="pass-cell"><span id="igpass-${i}">${'•'.repeat(8)}</span><button class="pass-reveal" onclick="togglePass('igpass-${i}','${a.senha || ''}')">👁</button></div></td>
        <td>${a.email_vinculado || '—'}</td>
        <td>${a.projeto || '—'}</td>
        <td>${statusBadge(a.status || 'Inativo')}</td>
        <td>${a.seguidores || '—'}</td>
        <td>${a.nicho || '—'}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-sm btn-outline" onclick="editEmpresa('instagram',${i})">✏</button><button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteEmpresa('instagram',${i})">✕</button></div></td>
      </tr>`).join('');
    }

    function renderTTTable() {
      const tbody = document.getElementById('tt-table-body');
      const empty = document.getElementById('tt-empty');
      if (!empresaTTs.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
      empty.style.display = 'none';
      tbody.innerHTML = empresaTTs.map((a, i) => `<tr class="empresa-table-row">
        <td>@${a.usuario}</td>
        <td><div class="pass-cell"><span id="ttpass-${i}">${'•'.repeat(8)}</span><button class="pass-reveal" onclick="togglePass('ttpass-${i}','${a.senha || ''}')">👁</button></div></td>
        <td>${a.email_vinculado || '—'}</td>
        <td>${a.projeto || '—'}</td>
        <td>${statusBadge(a.status || 'Inativo')}</td>
        <td>${a.seguidores || '—'}</td>
        <td>${a.nicho || '—'}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-sm btn-outline" onclick="editEmpresa('tiktok',${i})">✏</button><button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteEmpresa('tiktok',${i})">✕</button></div></td>
      </tr>`).join('');
    }

    function togglePass(spanId, realPass) {
      const el = document.getElementById(spanId);
      if (!el) return;
      el.textContent = el.textContent.includes('•') ? realPass : '•'.repeat(8);
    }

    function toggleEmailUso(idx, val) {
      empresaEmails[idx].em_uso = val;
      localStorage.setItem('empresa_emails', JSON.stringify(empresaEmails));
    }

    function openEmpresaModal(type) {
      empresaEditType = type; empresaEditIdx = null;
      buildEmpresaModal(type, null);
      openModal_emp();
    }

    function editEmpresa(type, idx) {
      empresaEditType = type; empresaEditIdx = idx;
      const data = type === 'email' ? empresaEmails[idx] : type === 'instagram' ? empresaIGs[idx] : empresaTTs[idx];
      buildEmpresaModal(type, data);
      openModal_emp();
    }

    function deleteEmpresa(type, idx) {
      if (!confirm('Excluir esta conta?')) return;
      if (type === 'email') { empresaEmails.splice(idx, 1); localStorage.setItem('empresa_emails', JSON.stringify(empresaEmails)); renderEmailTable(); }
      if (type === 'instagram') { empresaIGs.splice(idx, 1); localStorage.setItem('empresa_igs', JSON.stringify(empresaIGs)); renderIGTable(); }
      if (type === 'tiktok') { empresaTTs.splice(idx, 1); localStorage.setItem('empresa_tts', JSON.stringify(empresaTTs)); renderTTTable(); }
    }

    function buildEmpresaModal(type, data) {
      const isEdit = !!data;
      const m = document.getElementById('empresa-modal');
      const title = type === 'email' ? '📧 Email' : type === 'instagram' ? '📸 Instagram' : '🎵 TikTok';
      const projOpts = PROJECTS.map(p => `<option value="${p.nome}" ${data?.projeto === p.nome ? 'selected' : ''}>${p.nome}</option>`).join('');
      let fields = '';
      if (type === 'email') {
        fields = `
          <div class="brief-field"><div class="brief-label">Gmail *</div><input id="emp-gmail" class="brief-input" value="${data?.gmail || ''}" placeholder="nome@gmail.com"></div>
          <div class="brief-field"><div class="brief-label">Senha</div><input id="emp-senha" class="brief-input" type="password" value="${data?.senha || ''}" placeholder="Senha da conta"></div>
          <div class="brief-field"><div class="brief-label">Telefone</div><input id="emp-tel" class="brief-input" value="${data?.telefone || ''}" placeholder="+55 11 9xxxx-xxxx"></div>
          <div class="brief-field"><div class="brief-label">Status de Aquecimento</div><select id="emp-aquecido" class="brief-input"><option ${data?.aquecido === 'Inativo' || !data?.aquecido ? 'selected' : ''}>Inativo</option><option ${data?.aquecido === 'Aquecendo' ? 'selected' : ''}>Aquecendo</option><option ${data?.aquecido === 'Ativo' ? 'selected' : ''}>Ativo</option></select></div>
          <div class="brief-field"><div class="brief-label">Data de Compra</div><input id="emp-data" class="brief-input" type="date" value="${data?.data_compra || ''}"></div>
          <div class="brief-field"><div class="brief-label">Perfil Instagram Vinculado</div><input id="emp-perfil-ig" class="brief-input" value="${data?.perfil_ig || ''}" placeholder="@nomedo perfil"></div>`;
      } else {
        fields = `
          <div class="brief-field"><div class="brief-label">Usuário @ *</div><input id="emp-usuario" class="brief-input" value="${data?.usuario || ''}" placeholder="nomeusuario (sem @)"></div>
          <div class="brief-field"><div class="brief-label">Senha</div><input id="emp-senha" class="brief-input" type="password" value="${data?.senha || ''}" placeholder="Senha da conta"></div>
          <div class="brief-field"><div class="brief-label">Email Vinculado</div><select id="emp-email-vin" class="brief-input"><option value="">Selecionar...</option>${empresaEmails.map(e => `<option value="${e.gmail}" ${data?.email_vinculado === e.gmail ? 'selected' : ''}>${e.gmail}</option>`).join('')}</select></div>
          <div class="brief-field"><div class="brief-label">Projeto Vinculado</div><select id="emp-projeto" class="brief-input"><option value="">Nenhum</option>${projOpts}</select></div>
          <div class="brief-field"><div class="brief-label">Status</div><select id="emp-status" class="brief-input"><option ${data?.status === 'Inativo' || !data?.status ? 'selected' : ''}>Inativo</option><option ${data?.status === 'Aquecendo' ? 'selected' : ''}>Aquecendo</option><option ${data?.status === 'Ativo' ? 'selected' : ''}>Ativo</option><option ${data?.status === 'Bloqueado' ? 'selected' : ''}>Bloqueado</option></select></div>
          <div class="brief-field"><div class="brief-label">Seguidores</div><input id="emp-seguidores" class="brief-input" type="number" value="${data?.seguidores || ''}" placeholder="0"></div>
          <div class="brief-field"><div class="brief-label">Nicho</div><input id="emp-nicho" class="brief-input" value="${data?.nicho || ''}" placeholder="Ex: Imobiliário, Saúde..."></div>`;
      }
      m.querySelector('#empresa-modal-title').textContent = (isEdit ? 'Editar ' : 'Adicionar ') + title;
      m.querySelector('#empresa-modal-fields').innerHTML = fields;
    }

    function openModal_emp() {
      const m = document.getElementById('empresa-modal');
      m.style.opacity = '1'; m.style.pointerEvents = 'all';
    }
    function closeEmpresaModal() {
      const m = document.getElementById('empresa-modal');
      m.style.opacity = '0'; m.style.pointerEvents = 'none';
    }

    function saveEmpresaModal() {
      const type = empresaEditType;
      let obj = {};
      if (type === 'email') {
        obj = { gmail: document.getElementById('emp-gmail').value.trim(), senha: document.getElementById('emp-senha').value, telefone: document.getElementById('emp-tel').value.trim(), aquecido: document.getElementById('emp-aquecido').value, data_compra: document.getElementById('emp-data').value, perfil_ig: document.getElementById('emp-perfil-ig').value.trim(), em_uso: empresaEditIdx !== null ? empresaEmails[empresaEditIdx].em_uso : false };
        if (!obj.gmail) { alert('Gmail é obrigatório'); return; }
        if (empresaEditIdx !== null) empresaEmails[empresaEditIdx] = obj; else empresaEmails.push(obj);
        localStorage.setItem('empresa_emails', JSON.stringify(empresaEmails));
        closeEmpresaModal(); renderEmailTable();
      } else {
        obj = { usuario: document.getElementById('emp-usuario').value.trim().replace('@', ''), senha: document.getElementById('emp-senha').value, email_vinculado: document.getElementById('emp-email-vin').value, projeto: document.getElementById('emp-projeto').value, status: document.getElementById('emp-status').value, seguidores: document.getElementById('emp-seguidores').value, nicho: document.getElementById('emp-nicho').value.trim() };
        if (!obj.usuario) { alert('Usuário é obrigatório'); return; }
        if (type === 'instagram') { if (empresaEditIdx !== null) empresaIGs[empresaEditIdx] = obj; else empresaIGs.push(obj); localStorage.setItem('empresa_igs', JSON.stringify(empresaIGs)); closeEmpresaModal(); renderIGTable(); }
        else { if (empresaEditIdx !== null) empresaTTs[empresaEditIdx] = obj; else empresaTTs.push(obj); localStorage.setItem('empresa_tts', JSON.stringify(empresaTTs)); closeEmpresaModal(); renderTTTable(); }
      }
    }
