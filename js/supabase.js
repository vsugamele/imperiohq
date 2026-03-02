    // ── Config ──────────────────────────────────────────
    const SUPA_URL = localStorage.getItem('imphq_supa_url') || 'https://tkbivipqiewkfnhktmqq.supabase.co';
    const SUPA_KEY = localStorage.getItem('imphq_supa_anon') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrYml2aXBxaWV3a2ZuaGt0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NzY4NDgsImV4cCI6MjA1NDA1Mjg0OH0.2TnLj4lriG7eoPQWDo0mV8u8YHor6bd5ItZCHYhkym0';
    const _sb = supabase.createClient(SUPA_URL, SUPA_KEY);

    // ── Helpers ─────────────────────────────────────────
    const SB = {

      // ── QUICK LINKS ──────────────────────────────────────────────
      async loadLinks() {
        const { data, error } = await _sb.from('imphq_quick_links').select('*').order('order_idx');
        if (error) { console.warn('[SB] loadLinks', error); return; }
        const mapped = (data || []).map(r => ({ id: r.id, emoji: r.emoji, nome: r.nome, url: r.url, cat: r.cat, cor: r.cor, desc: r.descricao }));
        localStorage.setItem('imperio_quick_links', JSON.stringify(mapped));
        if (typeof renderLinks === 'function') renderLinks();
      },
      async upsertLink(link) {
        const row = { id: link.id, emoji: link.emoji || '🔗', nome: link.nome, url: link.url, cat: link.cat || null, cor: link.cor || '#d4af37', descricao: link.desc || null, updated_at: new Date().toISOString() };
        const { error } = await _sb.from('imphq_quick_links').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertLink', error);
      },
      async deleteLink(id) {
        const { error } = await _sb.from('imphq_quick_links').delete().eq('id', id);
        if (error) console.warn('[SB] deleteLink', error);
      },

      // ── PROJETOS (com dados ricos via coluna data JSONB) ──────────
      async loadProjects() {
        const { data, error } = await _sb.from('imphq_projects').select('*').order('created_at');
        if (error) { console.warn('[SB] loadProjects', error); return; }
        if (!data || !data.length) return;
        const fromSupa = data.map(r => {
          const rich = r.data || {};
          return {
            id: r.id, icon: r.icon || '🚀', nome: r.name,
            categoria: r.category, vertical_color: r.color,
            parent_id: r.parent_id, description: r.description,
            members: r.members || [], _custom: true,
            // Restore rich data or use defaults
            status: rich.status || 'ativo', vende: rich.vende || false,
            produto: rich.produto || '', preco: rich.preco || '',
            objetivo: rich.objetivo || '', contexto: rich.contexto || '',
            orcamento_trafego: rich.orcamento_trafego || 'A definir',
            links: rich.links || { site: '', ads: '', analytics: '', criativos: '' },
            avatar: rich.avatar || { externo: '', interno: '', dores_superficiais: [], dores_profundas: [], medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '', fase_consciencia: '', sub_avatares: [], storyboard: [] },
            pipeline: rich.pipeline || { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
            branding: rich.branding || { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
            kpis: rich.kpis || { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
            assets: rich.assets || []
          };
        });
        // Supabase é a fonte da verdade para evitar duplicatas por resquício local
        if (typeof projectsSaveCustom === 'function') projectsSaveCustom(fromSupa);
      },
      async upsertProject(proj) {
        if (!proj._custom) return;
        // Store all rich data in the data JSONB column
        const richData = {
          status: proj.status, vende: proj.vende, produto: proj.produto,
          preco: proj.preco, objetivo: proj.objetivo, contexto: proj.contexto,
          orcamento_trafego: proj.orcamento_trafego, links: proj.links,
          avatar: proj.avatar, pipeline: proj.pipeline, branding: proj.branding,
          kpis: proj.kpis, assets: proj.assets
        };
        const row = {
          id: proj.id, name: proj.nome || proj.name,
          category: proj.categoria || proj.category || null,
          color: proj.vertical_color || proj.color || '#d4af37',
          parent_id: proj.parent_id || null, icon: proj.icon || '📁',
          description: proj.description || null, members: proj.members || [],
          data: richData, updated_at: new Date().toISOString()
        };
        const { error } = await _sb.from('imphq_projects').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertProject', error);
      },
      async lett(id) {
        const { error } = await _sb.from('imphq_projects').delete().eq('id', id);
        if (error) console.warn('[SB] deleteProject', error);
        else console.log('[SB] 🗑 Projeto deletado do Supabase:', id);
      },

      // ── KANBAN ───────────────────────────────────────────────────
      async loadKanban() {
        const { data, error } = await _sb.from('imphq_kanban').select('*').order('order_idx');
        if (error) { console.warn('[SB] loadKanban', error); return; }
        if (typeof knCards !== 'undefined' && Array.isArray(knCards)) {
          const fromSupa = (data || []).map(r => {
            const proj = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS))
              ? PROJECTS.find(p => p.id === r.project_id)
              : null;
            return {
              id: r.id,
              project: proj?.nome || proj?.name || r.project_id,
              title: r.title,
              description: r.description,
              notes: r.description || '',
              status: r.status || 'backlog',
              priority: r.priority || 'media',
              owner: r.assignee,
              deadline: r.due_date,
              tags: r.tags || []
            };
          });
          // Supabase substitui completamente o local para evitar divergência.
          knCards.length = 0;
          fromSupa.forEach(c => knCards.push(c));
          const _orig = localStorage.setItem.bind(localStorage);
          _orig('imperio_kanban', JSON.stringify(knCards));
        }
      },
      async upsertCard(card) {
        if (!card || !card.id) return;
        const projectRef = card.project || null;
        let projectId = projectRef;
        if (projectRef && typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) {
          const byName = PROJECTS.find(p => p?.nome === projectRef || p?.name === projectRef);
          if (byName?.id) projectId = byName.id;

          if (!projectId && typeof projectRef === 'string') {
            const slug = projectRef
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
              .slice(0, 28) || ('proj_' + Date.now());
            const autoProject = {
              id: slug,
              nome: projectRef,
              categoria: 'Operação',
              vertical_color: '#d4af37',
              icon: '📁',
              _custom: true,
              status: 'Ativo',
              vende: false,
              produto: '',
              preco: '',
              objetivo: '',
              contexto: '',
              orcamento_trafego: 'A definir',
              links: { site: '', ads: '', analytics: '', criativos: '' },
              avatar: { externo: '', interno: '', dores_superficiais: [], dores_profundas: [], medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '', fase_consciencia: '', sub_avatares: [], storyboard: [] },
              pipeline: { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
              branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
              kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
              assets: []
            };
            await SB.upsertProject(autoProject);
            PROJECTS.push(autoProject);
            projectId = autoProject.id;
          }
        }
        if (!projectId) return;

        const row = {
          id: card.id,
          project_id: projectId,
          title: card.title,
          description: card.description || card.notes || null,
          status: card.status || 'backlog',
          priority: card.priority || 'media',
          assignee: card.owner || null,
          due_date: card.deadline || null,
          tags: card.tags || [],
          order_idx: 0,
          updated_at: new Date().toISOString()
        };
        const { error } = await _sb.from('imphq_kanban').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertCard', error, row);
      },
      async deleteCard(id) {
        const { error } = await _sb.from('imphq_kanban').delete().eq('id', id);
        if (error) console.warn('[SB] deleteCard', error);
        else console.log('[SB] 🗑 Card deletado do Supabase:', id);
      },

      // ── DOCS ──────────────────────────────────────────────────────
      async loadDocs() {
        const { data, error } = await _sb.from('imphq_docs').select('*').order('created_at');
        if (error) { console.warn('[SB] loadDocs', error); return; }
        if (!data || !data.length) return;
        const fromSupa = data.map(r => ({
          id: r.id, title: r.title, cat: r.cat, project: r.project_id,
          body: r.body || r.content || '', tags: r.tags || [],
          created: r.created_at, updated: r.updated_at
        }));
        // Merge without overwriting local-only docs
        if (typeof DOCS !== 'undefined' && Array.isArray(DOCS)) {
          const supaIds = fromSupa.map(d => d.id);
          const localOnly = DOCS.filter(d => !supaIds.includes(d.id));
          DOCS.length = 0;
          [...localOnly, ...fromSupa].forEach(d => DOCS.push(d));
          const _orig = localStorage.setItem.bind(localStorage);
          _orig('imperio_docs', JSON.stringify(DOCS));
        }
      },
      async upsertDoc(doc) {
        const row = { id: doc.id, title: doc.title, project_id: doc.project || null, cat: doc.cat || null, body: doc.body || null, content: doc.body || null, tags: doc.tags || [], updated_at: new Date().toISOString() };
        const { error } = await _sb.from('imphq_docs').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertDoc', error);
      },
      async deleteDoc(id) {
        const { error } = await _sb.from('imphq_docs').delete().eq('id', id);
        if (error) console.warn('[SB] deleteDoc', error);
        else console.log('[SB] 🗑 Doc deletado do Supabase:', id);
      },

      // ── KNOWLEDGE BASE ────────────────────────────────────────────
      async loadKB() {
        const { data, error } = await _sb.from('imphq_kb').select('*').order('order_idx');
        if (error) { console.warn('[SB] loadKB', error); return; }
        if (!data || !data.length) return;
        const kbMap = {};
        (data || []).forEach(r => { kbMap[r.section_key] = r.content; });
        if (typeof KB_DATA !== 'undefined') {
          Object.assign(KB_DATA, kbMap);
          const _orig = localStorage.setItem.bind(localStorage);
          _orig('imperio_kb', JSON.stringify(KB_DATA));
        }
      },
      async upsertKBSection(sectionKey, content) {
        const s = typeof KB_SECTIONS !== 'undefined' ? KB_SECTIONS.find(x => x.id === sectionKey) : null;
        const row = { id: 'kb_' + sectionKey, section_key: sectionKey, title: s ? s.label : sectionKey, content, updated_at: new Date().toISOString() };
        const { error } = await _sb.from('imphq_kb').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertKBSection', error);
      },

      // ── EMPRESA ───────────────────────────────────────────────────
      async upsertEmpresaItem(item) {
        const row = { id: item.id || ('emp_' + Date.now()), tipo: item.tipo || 'outro', nome: item.nome, valor: item.valor || null, extra: item.extra || {}, updated_at: new Date().toISOString() };
        const { error } = await _sb.from('imphq_empresa').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertEmpresa', error);
      },
      async loadEmpresa() {
        const { data, error } = await _sb.from('imphq_empresa').select('*').order('created_at');
        if (error) { console.warn('[SB] loadEmpresa', error); return; }
        if (data && data.length) localStorage.setItem('imphq_empresa', JSON.stringify(data));
      },

      // ── BOOTSTRAP (seed inicial quando tabelas estão vazias) ──────
      async _countTable(table) {
        const { count, error } = await _sb.from(table).select('*', { count: 'exact', head: true });
        if (error) { console.warn('[SB] countTable', table, error); return null; }
        return count || 0;
      },
      async bootstrapCoreData() {
        const [projectsCount, kanbanCount] = await Promise.all([
          SB._countTable('imphq_projects'),
          SB._countTable('imphq_kanban')
        ]);

        if (projectsCount === 0 && typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) {
          for (const p of PROJECTS) {
            await SB.upsertProject({ ...p, _custom: true });
          }
          console.log('[SB] 🌱 Seed inicial de projetos concluído');
        }

        // Kanban seed desativado para evitar cards de exemplo/fake em produção.
        // Os cards reais devem vir do fluxo operacional (Ops/CRM/ações do time).
      },

      // ── INIT ──────────────────────────────────────────────────────
      async init() {
        console.log('[SB] 🔄 Sincronizado com Supabase…');
        // Limpa cache local legado do Kanban para evitar cards fantasma.
        localStorage.removeItem('knCards');
        await SB.bootstrapCoreData();
        await Promise.all([SB.loadLinks(), SB.loadProjects(), SB.loadKanban(), SB.loadKB(), SB.loadDocs(), SB.loadEmpresa()]);
        console.log('[SB] ✅ Sincronização concluída');
        if (typeof renderSidebar === 'function') renderSidebar();
      },

      // Timer refs for debounce
      _kanbanTimer: null,
      _docsTimer: null,
      // Track deleted IDs to propagate deletes
      _deletedCards: new Set(),
      _deletedDocs: new Set()
    };

    // ══════════════════════════════════════════════════════════════
    //  PATCHES — interceptam TODAS as escritas e deletes
    // ══════════════════════════════════════════════════════════════

    // ── Links Rápidos ─────────────────────────────────────────────
    const _origSaveLink = saveLink;
    saveLink = function () {
      _origSaveLink();
      const links = getLinks();
      if (_qlEditId) { const l = links.find(x => x.id === _qlEditId); if (l) SB.upsertLink(l); }
      else { const last = links[links.length - 1]; if (last) SB.upsertLink(last); }
    };
    const _origDeleteLink = deleteLink;
    deleteLink = function (id) {
      SB._deletedCards.add('ql_' + id);
      _origDeleteLink(id);
      SB.deleteLink(id);
    };

    // ── Projetos — patch projectsSaveCustom ───────────────────────
    if (typeof projectsSaveCustom === 'function') {
      const _origSaveCustom = projectsSaveCustom;
      let _prevCustomIds = new Set((typeof projectsGetCustom === 'function' ? projectsGetCustom() : []).map(p => p.id));
      projectsSaveCustom = function (arr) {
        _origSaveCustom(arr);
        const newIds = new Set((arr || []).map(p => p.id));
        // Detect deletes: IDs that were in prev but not in new
        _prevCustomIds.forEach(oldId => {
          if (!newIds.has(oldId)) SB.deleteProject(oldId);
        });
        _prevCustomIds = newIds;
        // Upsert all custom projects (with full rich data)
        (arr || []).forEach(p => { if (p._custom) SB.upsertProject(p); });
      };
    }

    // ── Docs — patch deleteDoc to track delete ────────────────────
    const _origDeleteDoc = deleteDoc;
    deleteDoc = function () {
      const deletingId = docEditId; // captured before the fn clears it
      SB._deletedDocs.add(deletingId);
      _origDeleteDoc();
      if (deletingId) SB.deleteDoc(deletingId);
    };

    // ── localStorage intercept — Kanban + Docs + KB ───────────────
    const _origSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      _origSetItem(key, value);

      if (key === 'knCards' || key === 'imperio_kanban') {
        clearTimeout(SB._kanbanTimer);
        SB._kanbanTimer = setTimeout(() => {
          try {
            const cards = JSON.parse(value) || [];
            const currentIds = new Set(cards.map(c => c.id));
            // Delete cards that disappeared
            SB._deletedCards.forEach(id => {
              if (id.startsWith('ql_')) return; // skip link delete markers
              if (!currentIds.has(id)) { SB.deleteCard(id); SB._deletedCards.delete(id); }
            });
            cards.forEach(c => SB.upsertCard(c));
          } catch (e) { }
        }, 600);
      }

      if (key === 'imperio_docs') {
        clearTimeout(SB._docsTimer);
        SB._docsTimer = setTimeout(() => {
          try {
            const docs = JSON.parse(value) || [];
            docs.forEach(d => SB.upsertDoc(d));
          } catch (e) { }
        }, 600);
      }

      if (key === 'imperio_kb') {
        try {
          const data = JSON.parse(value);
          Object.entries(data || {}).forEach(([k, v]) => SB.upsertKBSection(k, v));
        } catch (e) { }
      }
    };

    // ── Boot ──────────────────────────────────────────────────────
    window.addEventListener('load', () => { setTimeout(() => SB.init(), 400); });
    window.SB = SB;

    // ═══════════════════════════════════════════════════════
    //  OPEN FLOW ENGINE
    // ═══════════════════════════════════════════════════════
    const OF = {
      nodes: {},
      connections: [],
      nodeCounter: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      isPanning: false,
      panStart: null,
      draggingNode: null,
      dragOffset: { x: 0, y: 0 },
      connectingFrom: null,
      selectedNode: null,
      running: false,
    };

    function showOpenFlow() {
      hideAllPanels();
      document.getElementById('view-openflow').classList.add('active');
      const nav = document.getElementById('nav-openflow');
      if (nav) nav.classList.add('active');
      if (Object.keys(OF.nodes).length === 0) ofLoadTemplate('model_product');
      ofRender();
    }

    function ofAddNode(type, x, y) {
      const wrap = document.getElementById('of-canvas-wrap');
      const rect = wrap.getBoundingClientRect();
      if (x == null) {
        x = (rect.width / 2 - OF.offsetX) / OF.scale - 120;
        y = (rect.height / 2 - OF.offsetY) / OF.scale - 80;
        x += (Math.random() - 0.5) * 60;
        y += (Math.random() - 0.5) * 60;
      }
      const id = 'n' + (++OF.nodeCounter);
      const node = { id, type, x, y, data: {} };
      if (type === 'image') { node.data.src = null; node.data.label = 'IMAGEM'; }
      if (type === 'prompt') { node.data.text = ''; }
      if (type === 'model') { node.data.model = 'claude'; node.data.ratio = '1:1'; }
      if (type === 'output') { node.data.result = null; node.data.filename = ''; }
      if (type === 'note') { node.data.text = 'Anotação...'; }
      OF.nodes[id] = node;
      ofRenderNode(node);
      return id;
    }

    function ofRender() {
      const canvas = document.getElementById('of-canvas');
      canvas.innerHTML = '';
      Object.values(OF.nodes).forEach(n => ofRenderNode(n));
      ofRenderConnections();
    }

    function ofRenderNode(node) {
      const existing = document.getElementById('of-node-' + node.id);
      if (existing) existing.remove();
      const el = document.createElement('div');
      el.id = 'of-node-' + node.id;
      el.className = 'of-node of-node-' + node.type;
      el.style.left = node.x + 'px';
      el.style.top = node.y + 'px';
      if (OF.selectedNode === node.id) el.classList.add('selected');
      const configs = {
        image: { icon: '🖼', label: 'IMAGEM', bg: 'rgba(72,149,239,.15)', color: '#4895ef' },
        prompt: { icon: '✍️', label: 'PROMPT', bg: 'rgba(82,183,136,.1)', color: '#52b788' },
        model: { icon: '⚡', label: 'MODELO IA', bg: 'rgba(201,168,76,.1)', color: '#c9a84c' },
        output: { icon: '📤', label: 'SAÍDA', bg: 'rgba(155,93,229,.1)', color: '#9b5de5' },
        note: { icon: '📝', label: 'NOTA', bg: 'rgba(80,80,80,.2)', color: '#888' },
      };
      const cfg = configs[node.type] || configs.note;
      el.innerHTML = `
    <div class="of-node-header" data-node="${node.id}">
      <div class="of-node-icon" style="background:${cfg.bg};color:${cfg.color}">${cfg.icon}</div>
      <div class="of-node-label" style="color:${cfg.color}">${cfg.label}</div>
      <div class="of-node-close" onclick="ofDeleteNode('${node.id}')">×</div>
    </div>
    <div class="of-node-body">
      ${ofNodeBody(node)}
    </div>
  `;
      ofAddPorts(el, node);
      el.querySelector('.of-node-header').addEventListener('mousedown', e => {
        if (e.target.classList.contains('of-node-close')) return;
        e.stopPropagation();
        OF.draggingNode = node.id;
        const rect = el.getBoundingClientRect();
        OF.dragOffset.x = e.clientX - rect.left;
        OF.dragOffset.y = e.clientY - rect.top;
        OF.selectedNode = node.id;
        document.querySelectorAll('.of-node').forEach(n => n.classList.remove('selected'));
        el.classList.add('selected');
      });
      document.getElementById('of-canvas').appendChild(el);
    }

    function ofNodeBody(node) {
      if (node.type === 'image') {
        const imgTag = node.data.src ? `<img src="${node.data.src}" alt="">` : `<div class="of-img-drop-hint"><span>🖼</span>Clique ou arraste<br>uma imagem aqui</div>`;
        return `<div class="of-img-drop" onclick="document.getElementById('of-img-${node.id}').click()" id="of-imgdrop-${node.id}">${imgTag}</div>
      <input type="file" accept="image/*" class="of-img-input" id="of-img-${node.id}" onchange="ofImageLoad('${node.id}',this)">`;
      }
      if (node.type === 'prompt') {
        return `<textarea placeholder="Descreva o que você quer gerar..." id="of-prompt-${node.id}" onchange="OF.nodes['${node.id}'].data.text=this.value">${node.data.text || ''}</textarea>`;
      }
      if (node.type === 'model') {
        return `<div class="of-model-name"><span class="dot"></span> CLAUDE AI</div>
      <select class="of-model-select" onchange="OF.nodes['${node.id}'].data.model=this.value">
        <option value="claude">Claude Sonnet (Análise)</option>
        <option value="describe">Descrever Imagem</option>
        <option value="enhance">Melhorar Prompt</option>
        <option value="concept">Gerar Conceito</option>
      </select>
      <div class="of-model-ratio">
        ${['1:1', '16:9', '9:16', '4:3'].map(r => `<div class="of-ratio-btn${node.data.ratio === r ? ' active' : ''}" onclick="ofSetRatio('${node.id}','${r}')">${r}</div>`).join('')}
      </div>
      <div class="of-model-run-hint">Clique em ▶ Executar</div>`;
      }
      if (node.type === 'output') {
        let content = '';
        if (node.data.loading) {
          content = `<div class="of-output-loading"><div class="of-spinner"></div><span>Processando...</span></div>`;
        } else if (node.data.result) {
          content = `<div class="of-output-result-text">${node.data.result}</div>`;
        } else {
          content = `<div class="of-output-placeholder"><span>📤</span><p>Aguardando<br>resultado</p></div>`;
        }
        return `<div class="of-output-img" id="of-output-${node.id}">${content}</div>
      <input class="of-output-filename" placeholder="Nome do arquivo (opcional)" value="${node.data.filename || ''}">`;
      }
      if (node.type === 'note') {
        return `<textarea style="width:100%;background:transparent;border:none;color:var(--text2);font-size:11px;line-height:1.6;resize:none;outline:none;min-height:60px" onchange="OF.nodes['${node.id}'].data.text=this.value">${node.data.text || ''}</textarea>`;
      }
      return '';
    }

    function ofAddPorts(el, node) {
      if (node.type === 'image') {
        const p = ofCreatePort('out', 'image');
        el.appendChild(p);
        p.addEventListener('mousedown', e => { e.stopPropagation(); ofStartConnect(node.id, 'out', p, 'image'); });
      }
      if (node.type === 'prompt') {
        const p = ofCreatePort('out', 'text');
        el.appendChild(p);
        p.addEventListener('mousedown', e => { e.stopPropagation(); ofStartConnect(node.id, 'out', p, 'text'); });
      }
      if (node.type === 'model') {
        const pi1 = ofCreatePort('in', 'image'); pi1.style.top = '52px'; el.appendChild(pi1);
        const lbl1 = document.createElement('div'); lbl1.className = 'of-port-label of-port-label-in'; lbl1.style.top = '52px'; lbl1.textContent = 'Imagem'; el.appendChild(lbl1);
        const pi2 = ofCreatePort('in', 'text'); pi2.style.top = '82px'; el.appendChild(pi2);
        const lbl2 = document.createElement('div'); lbl2.className = 'of-port-label of-port-label-in'; lbl2.style.top = '82px'; lbl2.textContent = 'Prompt'; el.appendChild(lbl2);
        const po = ofCreatePort('out', 'result'); po.style.top = '50%'; el.appendChild(po);
        [pi1, pi2].forEach(p => p.addEventListener('mousedown', e => { e.stopPropagation(); ofEndConnect(node.id, p); }));
        po.addEventListener('mousedown', e => { e.stopPropagation(); ofStartConnect(node.id, 'out', po, 'result'); });
      }
      if (node.type === 'output') {
        const p = ofCreatePort('in', 'result');
        el.appendChild(p);
        p.addEventListener('mousedown', e => { e.stopPropagation(); ofEndConnect(node.id, p); });
      }
    }

    function ofCreatePort(dir, type) {
      const p = document.createElement('div');
      p.className = 'of-port of-port-' + dir;
      p.dataset.portType = type;
      p.dataset.portDir = dir;
      return p;
    }

    function ofStartConnect(nodeId, dir, portEl, portType) {
      OF.connectingFrom = { nodeId, portEl, portType };
    }

    function ofEndConnect(nodeId, portEl) {
      if (!OF.connectingFrom) return;
      if (OF.connectingFrom.nodeId !== nodeId) {
        OF.connections.push({ from: OF.connectingFrom.nodeId, to: nodeId });
        ofRenderConnections();
      }
      OF.connectingFrom = null;
      document.getElementById('of-svg').querySelector('.of-conn-preview')?.remove();
    }

    function ofRenderConnections() {
      const svg = document.getElementById('of-svg');
      const preview = svg.querySelector('.of-conn-preview');
      svg.innerHTML = '';
      if (preview) svg.appendChild(preview);
      OF.connections.forEach((conn, i) => {
        const fromEl = document.getElementById('of-node-' + conn.from);
        const toEl = document.getElementById('of-node-' + conn.to);
        if (!fromEl || !toEl) return;
        const cRect = document.getElementById('of-canvas').getBoundingClientRect();
        const fromPort = fromEl.querySelector('.of-port-out');
        const toPort = toEl.querySelector('.of-port-in');
        if (!fromPort || !toPort) return;
        const fp = fromPort.getBoundingClientRect();
        const tp = toPort.getBoundingClientRect();
        const x1 = (fp.left + fp.width / 2 - cRect.left) / OF.scale;
        const y1 = (fp.top + fp.height / 2 - cRect.top) / OF.scale;
        const x2 = (tp.left + tp.width / 2 - cRect.left) / OF.scale;
        const y2 = (tp.top + tp.height / 2 - cRect.top) / OF.scale;
        const cx = (x1 + x2) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'of-conn');
        path.setAttribute('d', `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);
        path.addEventListener('dblclick', () => { OF.connections.splice(i, 1); ofRenderConnections(); });
        svg.appendChild(path);
      });
    }

    function ofImageLoad(nodeId, input) {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        OF.nodes[nodeId].data.src = e.target.result;
        const drop = document.getElementById('of-imgdrop-' + nodeId);
        if (drop) { drop.innerHTML = `<img src="${e.target.result}" alt="">`; }
      };
      reader.readAsDataURL(file);
    }

    function ofSetRatio(nodeId, ratio) {
      OF.nodes[nodeId].data.ratio = ratio;
      const btns = document.querySelectorAll(`#of-node-${nodeId} .of-ratio-btn`);
      btns.forEach(b => b.classList.toggle('active', b.textContent === ratio));
    }

    function ofDeleteNode(nodeId) {
      delete OF.nodes[nodeId];
      OF.connections = OF.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
      const el = document.getElementById('of-node-' + nodeId);
      if (el) el.remove();
      ofRenderConnections();
    }

    async function ofExecute() {
      if (OF.running) return;
      OF.running = true;
      const btn = document.getElementById('of-exec-btn');
      const lbl = document.getElementById('of-exec-label');
      btn.classList.add('running');
      lbl.textContent = 'Rodando...';
      const images = Object.values(OF.nodes).filter(n => n.type === 'image' && n.data.src).map(n => n.data.src);
      const prompts = Object.values(OF.nodes).filter(n => n.type === 'prompt').map(n => n.data.text || '').filter(Boolean);
      const modelNode = Object.values(OF.nodes).find(n => n.type === 'model');
      const outputNodes = Object.values(OF.nodes).filter(n => n.type === 'output');
      outputNodes.forEach(n => {
        n.data.loading = true;
        n.data.result = null;
        const outEl = document.getElementById('of-output-' + n.id);
        if (outEl) outEl.innerHTML = `<div class="of-output-loading"><div class="of-spinner"></div><span>Processando...</span></div>`;
      });
      try {
        const modelType = modelNode?.data?.model || 'claude';
        let systemPrompt = '';
        let userContent = [];
        if (modelType === 'describe') {
          systemPrompt = 'Você é um especialista em análise visual. Descreva a imagem em detalhes, focando em composição, iluminação, estilo, cores e elementos presentes. Responda em português.';
        } else if (modelType === 'enhance') {
          systemPrompt = 'Você é um especialista em engenharia de prompts para geração de imagens AI. Receba um prompt e melhore-o significativamente, adicionando detalhes de iluminação, composição, estilo fotográfico, qualidade e câmera. Retorne APENAS o prompt melhorado em inglês, sem explicações.';
        } else if (modelType === 'concept') {
          systemPrompt = 'Você é um diretor criativo especialista em campanhas de marketing visual. Gere um conceito criativo detalhado baseado nas imagens e prompt fornecidos. Inclua: conceito central, referências visuais, paleta de cores, tipografia sugerida, e prompt para geração de imagem. Responda em português.';
        } else {
          systemPrompt = 'Você é um assistente criativo especializado em marketing visual e produção de conteúdo. Analise as imagens e o prompt fornecidos, e gere uma resposta criativa e detalhada. Responda em português.';
        }
        if (images.length > 0) {
          images.forEach(src => {
            const base64 = src.split(',')[1];
            const mimeMatch = src.match(/data:([^;]+);/);
            const mediaType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            userContent.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } });
          });
        }
        const promptText = prompts.join('\n') || 'Analise e processe as imagens fornecidas.';
        userContent.push({ type: 'text', text: promptText });
        const apiKey = localStorage.getItem('imperio_anthropic_key') || '';
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userContent }]
          })
        });
        const data = await response.json();
        const result = data.content?.[0]?.text || data.error?.message || 'Sem resultado.';
        outputNodes.forEach(n => {
          n.data.loading = false;
          n.data.result = result;
          const outEl = document.getElementById('of-output-' + n.id);
          if (outEl) outEl.innerHTML = `<div class="of-output-result-text">${result.replace(/\n/g, '<br>')}</div>`;
        });
      } catch (err) {
        outputNodes.forEach(n => {
          n.data.loading = false;
          n.data.result = '❌ Erro: ' + err.message;
          const outEl = document.getElementById('of-output-' + n.id);
          if (outEl) outEl.innerHTML = `<div class="of-output-result-text" style="color:var(--red-bright)">❌ ${err.message}</div>`;
        });
      }
      OF.running = false;
      btn.classList.remove('running');
      lbl.textContent = 'Executar';
    }

    function ofLoadTemplate(name) {
      OF.nodes = {};
      OF.connections = [];
      OF.nodeCounter = 0;
      document.querySelectorAll('.of-template-chip').forEach(c => c.classList.remove('active'));
      if (name === 'model_product') {
        document.querySelector(`.of-template-chip[onclick*="model_product"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Modelo + Produto';
        const img1 = ofAddNode('image', 60, 60);
        const img2 = ofAddNode('image', 60, 280);
        const img3 = ofAddNode('image', 60, 500);
        const model = ofAddNode('model', 400, 200);
        const prompt = ofAddNode('prompt', 400, 460);
        const output = ofAddNode('output', 720, 200);
        OF.nodes[prompt].data.text = 'Crie um anúncio de moda mostrando a modelo usando o produto. A modelo deve estar em uma pose confiante e estilosa com os produtos posicionados naturalmente.';
        OF.connections = [{ from: model, to: output }, { from: img1, to: model }, { from: prompt, to: model }];
      } else if (name === 'prompt_enhance') {
        document.querySelector(`.of-template-chip[onclick*="prompt_enhance"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Melhorar Prompt';
        const prompt = ofAddNode('prompt', 80, 120);
        const model = ofAddNode('model', 380, 120);
        const output = ofAddNode('output', 680, 120);
        OF.nodes[prompt].data.text = 'Mulher confiante em cenário urbano, luz dourada do fim de tarde';
        OF.nodes[model].data.model = 'enhance';
        OF.connections = [{ from: prompt, to: model }, { from: model, to: output }];
      } else if (name === 'analyze') {
        document.querySelector(`.of-template-chip[onclick*="analyze"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Analisar Imagem';
        const img = ofAddNode('image', 80, 120);
        const model = ofAddNode('model', 380, 120);
        const output = ofAddNode('output', 680, 120);
        OF.nodes[model].data.model = 'describe';
        OF.connections = [{ from: img, to: model }, { from: model, to: output }];
      } else {
        document.querySelector(`.of-template-chip[onclick*="blank"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Novo Flow';
      }
      ofRender();
    }

    function ofClearCanvas() {
      if (!confirm('Limpar todo o canvas?')) return;
      OF.nodes = {};
      OF.connections = [];
      document.getElementById('of-canvas').innerHTML = '';
      document.getElementById('of-svg').innerHTML = '';
    }

    function ofSaveTemplate() {
      const name = document.getElementById('of-flow-name').value || 'Flow';
      alert(`✅ Template "${name}" salvo! (Em breve: persistência real)`);
    }

    function ofResetView() {
      OF.scale = 1;
      OF.offsetX = 0;
      OF.offsetY = 0;
      ofApplyTransform();
    }

    function ofApplyTransform() {
      const canvas = document.getElementById('of-canvas');
      const grid = document.querySelector('.of-grid');
      canvas.style.transform = `translate(${OF.offsetX}px,${OF.offsetY}px) scale(${OF.scale})`;
      grid.style.backgroundPosition = `${OF.offsetX}px ${OF.offsetY}px`;
      grid.style.backgroundSize = `${28 * OF.scale}px ${28 * OF.scale}px`;
      document.getElementById('of-zoom-label').textContent = Math.round(OF.scale * 100) + '%';
      ofRenderConnections();
    }

    function ofInitEvents() {
      const wrap = document.getElementById('of-canvas-wrap');
      if (!wrap) return;
      wrap.addEventListener('mousedown', e => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
          OF.isPanning = true;
          OF.panStart = { x: e.clientX - OF.offsetX, y: e.clientY - OF.offsetY };
          wrap.classList.add('panning');
          e.preventDefault();
        }
        if (e.target === wrap || e.target.classList.contains('of-grid') || e.target === document.getElementById('of-canvas')) {
          OF.connectingFrom = null;
          document.getElementById('of-svg').querySelector('.of-conn-preview')?.remove();
          OF.selectedNode = null;
          document.querySelectorAll('.of-node').forEach(n => n.classList.remove('selected'));
        }
      });
      wrap.addEventListener('contextmenu', e => {
        e.preventDefault();
        ofShowCtxMenu(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', e => {
        if (OF.isPanning) {
          OF.offsetX = e.clientX - OF.panStart.x;
          OF.offsetY = e.clientY - OF.panStart.y;
          ofApplyTransform();
        }
        if (OF.draggingNode) {
          const cRect = document.getElementById('of-canvas-wrap').getBoundingClientRect();
          const node = OF.nodes[OF.draggingNode];
          node.x = (e.clientX - cRect.left - OF.dragOffset.x - OF.offsetX) / OF.scale;
          node.y = (e.clientY - cRect.top - OF.dragOffset.y - OF.offsetY) / OF.scale;
          const el = document.getElementById('of-node-' + OF.draggingNode);
          if (el) { el.style.left = node.x + 'px'; el.style.top = node.y + 'px'; }
          ofRenderConnections();
        }
        if (OF.connectingFrom) {
          const svg = document.getElementById('of-svg');
          const fromPort = OF.connectingFrom.portEl;
          const fp = fromPort.getBoundingClientRect();
          const cRect = document.getElementById('of-canvas-wrap').getBoundingClientRect();
          const x1 = fp.left + fp.width / 2 - cRect.left;
          const y1 = fp.top + fp.height / 2 - cRect.top;
          const x2 = e.clientX - cRect.left;
          const y2 = e.clientY - cRect.top;
          const cx = (x1 + x2) / 2;
          let preview = svg.querySelector('.of-conn-preview');
          if (!preview) { preview = document.createElementNS('http://www.w3.org/2000/svg', 'path'); preview.setAttribute('class', 'of-conn-preview'); svg.appendChild(preview); }
          preview.setAttribute('d', `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);
        }
      });
      window.addEventListener('mouseup', e => {
        if (e.button === 1 || OF.isPanning) {
          OF.isPanning = false;
          wrap.classList.remove('panning');
        }
        if (OF.draggingNode) { OF.draggingNode = null; }
        if (OF.connectingFrom && e.target.classList.contains('of-port')) {
          const nodeEl = e.target.closest('.of-node');
          if (nodeEl) {
            const toId = nodeEl.id.replace('of-node-', '');
            ofEndConnect(toId, e.target);
          }
        } else if (OF.connectingFrom && e.target !== OF.connectingFrom.portEl) {
          OF.connectingFrom = null;
          document.getElementById('of-svg').querySelector('.of-conn-preview')?.remove();
        }
      });
      wrap.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const rect = wrap.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        OF.offsetX = mouseX - (mouseX - OF.offsetX) * delta;
        OF.offsetY = mouseY - (mouseY - OF.offsetY) * delta;
        OF.scale = Math.max(0.2, Math.min(3, OF.scale * delta));
        ofApplyTransform();
      }, { passive: false });
    }

    function ofShowCtxMenu(x, y) {
      document.querySelectorAll('.of-ctx-menu').forEach(m => m.remove());
      const menu = document.createElement('div');
      menu.className = 'of-ctx-menu';
      menu.innerHTML = `
    <div class="of-ctx-section">Adicionar Nó</div>
    <div class="of-ctx-item" onclick="ofAddNode('image');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">🖼</span> Imagem</div>
    <div class="of-ctx-item" onclick="ofAddNode('prompt');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">✍️</span> Prompt</div>
    <div class="of-ctx-item" onclick="ofAddNode('model');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">⚡</span> Modelo IA</div>
    <div class="of-ctx-item" onclick="ofAddNode('output');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">📤</span> Saída</div>
    <div class="of-ctx-item" onclick="ofAddNode('note');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">📝</span> Nota</div>
    <div class="of-ctx-sep"></div>
    <div class="of-ctx-item" onclick="ofResetView();this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">⌂</span> Reset View</div>
    <div class="of-ctx-item" onclick="ofClearCanvas();this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">🗑</span> Limpar Canvas</div>
  `;
      menu.style.left = x + 'px';
      menu.style.top = y + 'px';
      document.body.appendChild(menu);
      setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 0);
    }

    // Init Open Flow events
    document.addEventListener('DOMContentLoaded', () => { ofInitEvents(); });

    // ═══════════════════════════════════════════════════════
    //  WHATSAPP CONVERSATIONS (API)
    // ═══════════════════════════════════════════════════════
    const WA_API_URL = 'http://localhost:3003/api/whatsapp';
    let currentWaLeadId = null;
    let currentWaProject = null;

    // Load status for all projects
    async function waLoadStatus() {
      try {
        const res = await fetch(`${WA_API_URL}/status`);
        const status = await res.json();

        const projects = ['forex', 'igaming', 'eu'];
        projects.forEach(p => {
          const dot = document.getElementById(`wa-dot-${p}`);
          const session = document.getElementById(`wa-session-${p}`);
          if (dot && session && status[p]) {
            const s = status[p];
            if (s.hasSession) {
              dot.style.background = 'var(--green-bright)';
              session.innerHTML = `<span style="color:var(--green-bright)">✓ Conectado</span> · ${s.sessionPath}`;
            } else {
              dot.style.background = 'var(--text3)';
              session.innerHTML = `<span style="color:var(--gold)">⚠ Precisa parear</span>`;
            }
          }
        });
      } catch (err) {
        console.error('WA Status error:', err);
      }
    }

    // Generate/show QR code instructions
    async function waGenerateQR(project) {
      try {
        const res = await fetch(`${WA_API_URL}/qr/${project}`);
        const data = await res.json();

        const modal = document.getElementById('wa-qr-modal');
        const title = document.getElementById('wa-qr-title');
        const desc = document.getElementById('wa-qr-desc');
        const content = document.getElementById('wa-qr-content');
        const instructions = document.getElementById('wa-qr-instructions');

        title.textContent = project.toUpperCase();

        if (data.needsQr) {
          desc.textContent = 'Execute o comando para gerar QR Code';
          content.innerHTML = `
            <div style="color:#333;font-size:14px;line-height:1.8;text-align:left">
              <div style="margin-bottom:12px;font-weight:700;color:var(--gold)">PASO 1: Abra o terminal</div>
              <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;word-break:break-all">
cd C:\\Users\\vsuga\\clawd\\scripts\\whatsapp-bot<br>
.\\start-${project}.ps1
              </div>
              <div style="margin-top:12px;margin-bottom:12px;font-weight:700;color:var(--gold)">PASO 2: Escaneie o QR</div>
              <div style="font-size:12px;color:#666">O QR Code aparecerá no terminal. Escaneie com o WhatsApp.</div>
              <div style="margin-top:12px;padding:10px;background:#e8f5e9;border-radius:8px;font-size:11px;color:#2e7d32">
                ✅ Após parear, clique em "Verificar Status" nesta página
              </div>
            </div>
          `;
          instructions.innerHTML = `<button onclick="waVerifyStatus('${project}')" style="background:var(--green-bright);border:none;color:white;padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;margin-right:8px">✓ Verificar Status</button>
            <button onclick="document.getElementById('wa-qr-modal').style.display='none'" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);padding:10px 20px;border-radius:8px;font-size:12px;cursor:pointer">Fechar</button>`;
        } else {
          desc.textContent = 'Já está conectado!';
          content.innerHTML = `
            <div style="font-size:48px">✅</div>
            <div style="font-size:14px;color:#333;margin-top:12px">Sessão Ativa</div>
            <div style="font-size:11px;color:#666;margin-top:4px">${data.sessionPath}</div>
            <div style="margin-top:16px;font-size:11px;color:#666">
              Para reconectar:<br>Delete a pasta de sessão
            </div>
          `;
          instructions.innerHTML = `<button onclick="document.getElementById('wa-qr-modal').style.display='none'" style="background:var(--gold);border:none;color:var(--bg);padding:10px 24px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">OK</button>`;
        }

        modal.style.display = 'flex';
      } catch (err) {
        alert('Erro: ' + err.message);
      }
    }

    async function waVerifyStatus(project) {
      await waLoadStatus();
      document.getElementById('wa-qr-modal').style.display = 'none';
    }

    // Start bot instructions
    async function waStartBot(project) {
      try {
        const res = await fetch(`${WA_API_URL}/start/${project}`);
        const data = await res.json();

        const modal = document.getElementById('wa-qr-modal');
        const title = document.getElementById('wa-qr-title');
        const desc = document.getElementById('wa-qr-desc');
        const content = document.getElementById('wa-qr-content');
        const instructions = document.getElementById('wa-qr-instructions');

        title.textContent = 'Iniciar Bot - ' + project.toUpperCase();

        if (data.scriptExists) {
          desc.textContent = 'Siga os passos para iniciar';
          content.innerHTML = `
            <div style="color:#333;font-size:14px;line-height:1.8">
              <div style="margin-bottom:12px;font-weight:700;color:var(--gold)">PASO 1: Abra o terminal</div>
              <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;word-break:break-all">
cd C:\\Users\\vsuga\\clawd\\scripts\\whatsapp-bot<br>
.\\start-${project}.ps1
              </div>
              <div style="margin-top:16px;font-size:12px;color:#666">
                O bot vai iniciar. Se precisar parear, o QR Code aparecerá no terminal.
              </div>
            </div>
          `;
          instructions.innerHTML = `<button onclick="waVerifyStatus('${project}')" style="background:var(--green-bright);border:none;color:white;padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;margin-right:8px">✓ Verificar Status</button>
            <button onclick="document.getElementById('wa-qr-modal').style.display='none'" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);padding:10px 20px;border-radius:8px;font-size:12px;cursor:pointer">Fechar</button>`;
        } else {
          desc.textContent = 'Script não encontrado';
          content.innerHTML = `<div style="font-size:32px">❌</div><div style="color:#666;margin-top:8px">Script não encontrado para este projeto</div>`;
          instructions.innerHTML = `<button onclick="document.getElementById('wa-qr-modal').style.display='none'" style="background:var(--gold);border:none;color:var(--bg);padding:10px 24px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">OK</button>`;
        }

        modal.style.display = 'flex';
      } catch (err) {
        alert('Erro: ' + err.message);
      }
    }

    // Get lead info from Supabase
    async function waGetLeadInfo(leadId) {
      try {
        const res = await fetch(`${WA_API_URL}/leads?id=eq.${leadId}`);
        const leads = await res.json();
        return leads && leads.length > 0 ? leads[0] : null;
      } catch {
        return null;
      }
    }

    async function waLoadConversations() {
      const container = document.getElementById('wa-conversations-list');
      const project = document.getElementById('wa-project-filter')?.value || '';

      if (!container) return;

      container.innerHTML = '<div style="font-size:11px;color:var(--text3);padding:20px;text-align:center">Carregando...</div>';

      try {
        const url = project ? `${WA_API_URL}/conversations?project=${project}&limit=20` : `${WA_API_URL}/conversations?limit=20`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data || data.length === 0) {
          container.innerHTML = '<div style="font-size:11px;color:var(--text3);padding:20px;text-align:center">Nenhuma conversa encontrada</div>';
          return;
        }

        container.innerHTML = data.map(conv => {
          const time = new Date(conv.last_time).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
          const directionIcon = conv.direction === 'inbound' ? '📥' : '📤';
          const unreadBadge = conv.unread ? '<span style="background:var(--red-bright);color:white;padding:2px 6px;border-radius:10px;font-size:9px;margin-left:8px">NOVO</span>' : '';

          return `
            <div onclick="waOpenChat(${conv.lead_id}, '${conv.project_id}')" 
                 style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:.15s">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                <div style="font-size:11px;font-weight:700;color:var(--text)">${conv.lead_name || 'Lead #' + conv.lead_id}</div>
                <div style="font-size:10px;color:var(--text3)">${time}</div>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:12px">${directionIcon}</span>
                <div style="font-size:11px;color:var(--text2);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${conv.last_message || '(sem mensagem)'}</div>
                ${unreadBadge}
              </div>
              <div style="font-size:9px;color:var(--text3);margin-top:4px">Projeto: ${conv.project_id}</div>
            </div>
          `;
        }).join('');

      } catch (err) {
        container.innerHTML = `<div style="font-size:11px;color:var(--red-bright);padding:20px;text-align:center">Erro: ${err.message}</div>`;
      }
    }

    async function waOpenChat(leadId, project) {
      currentWaLeadId = leadId;
      currentWaProject = project;
      const container = document.getElementById('wa-conversations-list');
      container.innerHTML = '<div style="font-size:11px;color:var(--text3);padding:20px;text-align:center">Carregando chat...</div>';

      try {
        // Get lead info and messages in parallel
        const [msgsRes, leadsRes] = await Promise.all([
          fetch(`${WA_API_URL}/messages/${leadId}${project ? '?project=' + project : ''}`),
          fetch(`${WA_API_URL}/leads?id=eq.${leadId}`)
        ]);

        const messages = await msgsRes.json();
        const leads = await leadsRes.json();
        const lead = leads && leads.length > 0 ? leads[0] : null;

        if (!messages || messages.length === 0) {
          container.innerHTML = '<div style="font-size:11px;color:var(--text3);padding:20px;text-align:center">Nenhuma mensagem</div>';
          return;
        }

        // Lead header with info
        const leadName = lead?.name || `Lead #${leadId}`;
        const leadPhone = lead?.phone || 'Sem telefone';
        const leadAvatar = lead?.avatar || leadName.charAt(0).toUpperCase();

        container.innerHTML = `
          <div style="margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
              <button onclick="waLoadConversations()" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer">← Voltar</button>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px;display:flex;align-items:center;gap:12px">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--gold);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700">${leadAvatar}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:700;color:var(--text)">${leadName}</div>
                <div style="font-size:11px;color:var(--text3)">📱 ${leadPhone}</div>
                <div style="font-size:10px;color:var(--text3)">Projeto: ${project}</div>
              </div>
            </div>
          </div>
          
          <div style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;margin-bottom:12px">
            ${messages.map(m => {
          const time = new Date(m.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
          const isOutbound = m.direction === 'outbound';
          return `
                <div style="background:${isOutbound ? 'var(--surface3)' : 'var(--gold-dim)'};border:1px solid ${isOutbound ? 'var(--border)' : 'var(--gold)'};border-radius:8px;padding:10px;${isOutbound ? '' : 'border-left:3px solid var(--gold)'}">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:10px;font-weight:700;color:${isOutbound ? 'var(--blue-bright)' : 'var(--gold)'}">${isOutbound ? '📤 Você' : '📥 Lead'}</span>
                    <span style="font-size:9px;color:var(--text3)">${time}</span>
                  </div>
                  <div style="font-size:12px;color:var(--text)">${m.content || '(sem texto)'}</div>
                </div>
              `;
        }).join('')}
          </div>
          
          <!-- Enviar mensagem -->
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">
            <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:8px">✉️ Responder</div>
            <textarea id="wa-msg-input" placeholder="Digite sua mensagem..." rows="3" style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:10px;color:var(--text);font-size:12px;resize:none;margin-bottom:8px"></textarea>
            <button onclick="waSendMessage()" style="width:100%;padding:10px;background:var(--gold);color:var(--bg);border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">📤 Enviar Mensagem</button>
            <div id="wa-send-status" style="font-size:10px;color:var(--text3);margin-top:6px;text-align:center"></div>
          </div>
        `;

      } catch (err) {
        container.innerHTML = `<div style="font-size:11px;color:var(--red-bright);padding:20px;text-align:center">Erro: ${err.message}</div>`;
      }
    }

    async function waSendMessage() {
      const input = document.getElementById('wa-msg-input');
      const status = document.getElementById('wa-send-status');
      const message = input?.value?.trim();

      if (!message || !currentWaLeadId || !currentWaProject) {
        alert('Selecione um chat primeiro');
        return;
      }

      status.innerHTML = 'Enviando...';

      try {
        const res = await fetch(`${WA_API_URL}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: currentWaProject,
            leadId: currentWaLeadId,
            message: message
          })
        });

        const data = await res.json();

        if (data.success) {
          status.innerHTML = '<span style="color:var(--green-bright)">✓ Mensagem registrada!</span>';
          input.value = '';
          // Refresh chat
          setTimeout(() => waOpenChat(currentWaLeadId, currentWaProject), 1000);
        } else {
          status.innerHTML = `<span style="color:var(--red-bright)">Erro: ${data.error}</span>`;
        }
      } catch (err) {
        status.innerHTML = `<span style="color:var(--red-bright)">Erro: ${err.message}</span>`;
      }
    }

    // Auto-load WhatsApp conversations and status when view is shown
    const _origShowWhatsApp = window.showWhatsApp;
    window.showWhatsApp = function () {
      if (_origShowWhatsApp) _origShowWhatsApp();
      setTimeout(() => {
        waLoadStatus();
        waLoadConversations();
      }, 500);
    };