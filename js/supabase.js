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
            avatar: Object.assign({ externo: '', interno: '', dores_superficiais: [], dores_profundas: [], medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '', fase_consciencia: '', sub_avatares: [], storyboard: [], escavador_desejos: null }, rich.avatar || {}),
            pipeline: rich.pipeline || { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
            branding: rich.branding || { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
            kpis: rich.kpis || { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
            assets: rich.assets || [],
            concorrentes: rich.concorrentes || [],
            produto_ids_ext: rich.produto_ids_ext || []
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
          kpis: proj.kpis, assets: proj.assets,
          concorrentes: proj.concorrentes || [],
          produto_ids_ext: proj.produto_ids_ext || []
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
      async deleteProject(id) {
        const { error } = await _sb.from('imphq_projects').delete().eq('id', id);
        if (error) console.warn('[SB] deleteProject', error);
        else console.log('[SB] 🗑 Projeto deletado do Supabase:', id);
      },
      async lett(id) { return this.deleteProject(id);
      },
      async updateProdutoIds(projectId, ids) {
        const { data, error } = await _sb.from('imphq_projects').select('data').eq('id', projectId).single();
        if (error) { console.warn('[SB] updateProdutoIds fetch', error); return false; }
        const richData = Object.assign({}, data?.data || {}, { produto_ids_ext: ids });
        const { error: e2 } = await _sb.from('imphq_projects')
          .update({ data: richData, updated_at: new Date().toISOString() })
          .eq('id', projectId);
        if (e2) { console.warn('[SB] updateProdutoIds update', e2); return false; }
        return true;
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

      // ── FUNIS ─────────────────────────────────────────────────────
      async loadFunis() {
        const { data, error } = await _sb.from('imphq_funis').select('*').order('criado_em');
        if (error) { console.warn('[SB] loadFunis', error); return; }
        // Reconstrói o objeto { [id]: funilData } e salva no localStorage como fonte local
        const overrides = {};
        (data || []).forEach(r => {
          const rich = r.data || {};
          overrides[r.id] = {
            id: r.id,
            _projectId: r.project_id,
            _produtoId: r.produto_id,
            nome: r.nome,
            tipo: r.tipo || 'Perpétuo',
            status: r.status || 'Rascunho',
            url: r.url || '',
            notas_gerais: r.notas_gerais || '',
            etapas:          rich.etapas          || [],
            sequencias:      rich.sequencias      || [],
            fontes_trafego:  rich.fontes_trafego  || [],
            integracoes:     rich.integracoes     || { analytics: {}, pagamentos: {} },
            criativos:       rich.criativos       || [],
            criado_em:       r.criado_em          || new Date().toISOString().slice(0,10),
          };
        });
        localStorage.setItem('imperio_funis_v2', JSON.stringify(overrides));
        if (typeof renderFunisView === 'function') renderFunisView();
      },
      async upsertFunil(funil) {
        if (!funil || !funil.id) return;
        const richData = {
          etapas:         funil.etapas         || [],
          sequencias:     funil.sequencias     || [],
          fontes_trafego: funil.fontes_trafego || [],
          integracoes:    funil.integracoes    || { analytics: {}, pagamentos: {} },
          criativos:      funil.criativos      || [],
        };
        const row = {
          id:           funil.id,
          project_id:   funil._projectId   || null,
          produto_id:   funil._produtoId   || null,
          nome:         funil.nome         || 'Funil',
          tipo:         funil.tipo         || 'Perpétuo',
          status:       funil.status       || 'Rascunho',
          url:          funil.url          || null,
          notas_gerais: funil.notas_gerais || null,
          data:         richData,
          updated_at:   new Date().toISOString(),
        };
        const { error } = await _sb.from('imphq_funis').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertFunil', error);
      },
      async deleteFunil(id) {
        const { error } = await _sb.from('imphq_funis').delete().eq('id', id);
        if (error) console.warn('[SB] deleteFunil', error);
        else console.log('[SB] 🗑 Funil deletado do Supabase:', id);
      },

      // ── LEADS ─────────────────────────────────────────────────────
      async loadLeads(projectId) {
        // projectId === '__null__'  → leads sem projeto
        // projectId === null/undefined → todos os leads
        let q = _sb.from('imphq_leads').select('*').order('score', { ascending: false });
        if (projectId === '__null__') {
          q = q.is('project_id', null);
        } else if (projectId) {
          q = q.eq('project_id', projectId);
        }
        const { data, error } = await q;
        if (error) { console.warn('[SB] loadLeads', error); return []; }
        return data || [];
      },
      async upsertLead(lead) {
        if (!lead || !lead.id) return;
        const row = {
          id:          lead.id,
          nome:        lead.nome        || null,
          phone:       lead.phone       || null,
          email:       lead.email       || null,
          project_id:  lead.project_id  || null,
          funil_id:    lead.funil_id    || null,
          plataforma:  lead.plataforma  || null,
          status:      lead.status      || 'lead',
          score:       lead.score       || 0,
          tags:        lead.tags        || [],
          total_gasto: lead.total_gasto || 0,
          data:        lead.data        || {},
          updated_at:  new Date().toISOString(),
        };
        const { error } = await _sb.from('imphq_leads').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertLead', error);
      },

      // ── VENDAS ────────────────────────────────────────────────────
      async loadVendas(projectId, leadId) {
        let q = _sb.from('imphq_vendas').select('*').order('data_venda', { ascending: false });
        if (projectId) q = q.eq('project_id', projectId);
        if (leadId)    q = q.eq('lead_id', leadId);
        const { data, error } = await q;
        if (error) { console.warn('[SB] loadVendas', error); return []; }
        return data || [];
      },
      async upsertVenda(venda) {
        if (!venda || !venda.id) return;
        const row = {
          id:             venda.id,
          lead_id:        venda.lead_id        || null,
          project_id:     venda.project_id     || null,
          funil_id:       venda.funil_id       || null,
          produto_nome:   venda.produto_nome   || null,
          produto_id_ext: venda.produto_id_ext || null,
          valor:          venda.valor          || 0,
          plataforma:     venda.plataforma,
          status:         venda.status         || 'aprovado',
          data_venda:     venda.data_venda     || new Date().toISOString(),
          data:           venda.data           || {},
        };
        const { error } = await _sb.from('imphq_vendas').upsert(row, { onConflict: 'id' });
        if (error) console.warn('[SB] upsertVenda', error);
        else {
          // Atualiza total_gasto e status do lead automaticamente
          if (venda.lead_id && venda.status === 'aprovado') {
            const { data: vendas } = await _sb.from('imphq_vendas')
              .select('valor').eq('lead_id', venda.lead_id).eq('status', 'aprovado');
            const total = (vendas || []).reduce((s, v) => s + Number(v.valor), 0);
            await _sb.from('imphq_leads').update({
              total_gasto: total,
              status: 'cliente',
              updated_at: new Date().toISOString(),
            }).eq('id', venda.lead_id);
          }
        }
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

      // ── TRACKING LINKS ────────────────────────────────────────────
      async loadTrackingLinks(projectId) {
        let q = _sb.from('imphq_tracking_links').select('*').order('created_at', { ascending: false });
        if (projectId && projectId !== '__all__') q = q.eq('project_id', projectId);
        const { data, error } = await q;
        if (error) { console.warn('[SB] loadTrackingLinks', error); return []; }
        return data || [];
      },
      async upsertTrackingLink(link) {
        const row = {
          id:           link.id,
          nome:         link.nome         || null,
          destino:      link.destino      || '',
          project_id:   link.project_id   || null,
          utm_source:   link.utm_source   || null,
          utm_medium:   link.utm_medium   || null,
          utm_campaign: link.utm_campaign  || null,
          utm_content:  link.utm_content   || null,
          utm_term:     link.utm_term      || null,
          ativo:        link.ativo !== false,
          updated_at:   new Date().toISOString(),
        };
        if (!row.created_at) row.created_at = new Date().toISOString();
        const { error } = await _sb.from('imphq_tracking_links').upsert(row, { onConflict: 'id' });
        if (error) { console.warn('[SB] upsertTrackingLink', error); return false; }
        return true;
      },
      async deleteTrackingLink(id) {
        const { error } = await _sb.from('imphq_tracking_links').delete().eq('id', id);
        if (error) { console.warn('[SB] deleteTrackingLink', error); return false; }
        return true;
      },
      async loadClicks(linkId) {
        let q = _sb.from('imphq_clicks').select('*').order('created_at', { ascending: false });
        if (linkId) q = q.eq('link_id', linkId);
        const { data, error } = await q.limit(500);
        if (error) { console.warn('[SB] loadClicks', error); return []; }
        return data || [];
      },
      async loadClicksStats(projectId) {
        // Retorna {total, convertidos} de cliques
        let q = _sb.from('imphq_clicks').select('id, convertido, link_id, utm_source, utm_campaign, created_at');
        if (projectId && projectId !== '__all__') q = q.eq('project_id', projectId);
        const { data, error } = await q;
        if (error) { console.warn('[SB] loadClicksStats', error); return []; }
        return data || [];
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
        await Promise.all([SB.loadLinks(), SB.loadProjects(), SB.loadKanban(), SB.loadKB(), SB.loadDocs(), SB.loadEmpresa(), SB.loadFunis()]);
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
      if (type === 'image-gen') { node.data.model = 'flux-schnell'; node.data.ratio = '1:1'; node.data.result = null; }
      if (type === 'video-gen') { node.data.model = 'wan-t2v'; node.data.duration = 5; node.data.result = null; }
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
        'image-gen': { icon: '🎨', label: 'GERAR IMAGEM', bg: 'rgba(255,107,107,.12)', color: '#ff6b6b' },
        'video-gen': { icon: '🎬', label: 'GERAR VÍDEO', bg: 'rgba(150,100,255,.12)', color: '#9664ff' },
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
        <optgroup label="── Claude (Anthropic) ──">
          <option value="claude">Claude Sonnet (Análise)</option>
          <option value="describe">Descrever Imagem</option>
          <option value="enhance">Melhorar Prompt</option>
          <option value="concept">Gerar Conceito</option>
        </optgroup>
        <optgroup label="── Google Gemini ──">
          <option value="gemini-pro">Gemini 2.0 Flash</option>
          <option value="gemini-vision">Gemini Vision (Imagem)</option>
        </optgroup>
        <optgroup label="── OpenRouter ──">
          <option value="or-gpt4o">GPT-4o</option>
          <option value="or-llama4">Llama 4 Maverick</option>
          <option value="or-deepseek">DeepSeek R1</option>
        </optgroup>
      </select>
      <div class="of-model-ratio">
        ${['1:1', '16:9', '9:16', '4:3'].map(r => `<div class="of-ratio-btn${node.data.ratio === r ? ' active' : ''}" onclick="ofSetRatio('${node.id}','${r}')">${r}</div>`).join('')}
      </div>
      <div class="of-model-run-hint">Clique em ▶ Executar</div>`;
      }
      if (node.type === 'image-gen') {
        return `<div class="of-model-name" style="color:#ff6b6b"><span class="dot" style="background:#ff6b6b"></span> REPLICATE</div>
      <select class="of-model-select" onchange="OF.nodes['${node.id}'].data.model=this.value">
        <optgroup label="── FLUX (Imagem) ──">
          <option value="flux-schnell">FLUX Schnell (rápido)</option>
          <option value="flux-dev">FLUX Dev (qualidade)</option>
          <option value="flux-pro">FLUX 1.1 Pro (premium)</option>
        </optgroup>
        <optgroup label="── Stable Diffusion ──">
          <option value="sdxl">SDXL (geral)</option>
          <option value="sd3">SD3 Medium</option>
        </optgroup>
      </select>
      <div class="of-model-ratio">
        ${['1:1', '16:9', '9:16', '4:3'].map(r => `<div class="of-ratio-btn${node.data.ratio === r ? ' active' : ''}" onclick="OF.nodes['${node.id}'].data.ratio='${r}';ofRenderNode(OF.nodes['${node.id}'])">${r}</div>`).join('')}
      </div>
      <div class="of-model-run-hint" style="color:#ff6b6b">Clique em ▶ Executar</div>`;
      }
      if (node.type === 'video-gen') {
        return `<div class="of-model-name" style="color:#9664ff"><span class="dot" style="background:#9664ff"></span> REPLICATE</div>
      <select class="of-model-select" onchange="OF.nodes['${node.id}'].data.model=this.value">
        <optgroup label="── Vídeo ──">
          <option value="wan-t2v">Wan T2V (texto→vídeo)</option>
          <option value="wan-i2v">Wan I2V (imagem→vídeo)</option>
          <option value="kling-t2v">Kling 1.6 (qualidade)</option>
          <option value="minimax-video">MiniMax Video</option>
        </optgroup>
      </select>
      <div style="display:flex;align-items:center;gap:8px;margin:8px 0;font-size:11px;color:var(--text2)">
        Duração:
        <select class="of-model-select" style="flex:1" onchange="OF.nodes['${node.id}'].data.duration=+this.value">
          <option value="3"${node.data.duration===3?' selected':''}>3s</option>
          <option value="5"${node.data.duration===5?' selected':''}>5s</option>
          <option value="10"${node.data.duration===10?' selected':''}>10s</option>
        </select>
      </div>
      <div class="of-model-run-hint" style="color:#9664ff">Clique em ▶ Executar</div>`;
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
      if (node.type === 'image-gen') {
        const pi = ofCreatePort('in', 'text'); pi.style.top = '52px'; el.appendChild(pi);
        const lbl = document.createElement('div'); lbl.className = 'of-port-label of-port-label-in'; lbl.style.top = '52px'; lbl.textContent = 'Prompt'; el.appendChild(lbl);
        const po = ofCreatePort('out', 'image'); po.style.top = '50%'; el.appendChild(po);
        pi.addEventListener('mousedown', e => { e.stopPropagation(); ofEndConnect(node.id, pi); });
        po.addEventListener('mousedown', e => { e.stopPropagation(); ofStartConnect(node.id, 'out', po, 'image'); });
      }
      if (node.type === 'video-gen') {
        const pi1 = ofCreatePort('in', 'text'); pi1.style.top = '52px'; el.appendChild(pi1);
        const lbl1 = document.createElement('div'); lbl1.className = 'of-port-label of-port-label-in'; lbl1.style.top = '52px'; lbl1.textContent = 'Prompt'; el.appendChild(lbl1);
        const pi2 = ofCreatePort('in', 'image'); pi2.style.top = '82px'; el.appendChild(pi2);
        const lbl2 = document.createElement('div'); lbl2.className = 'of-port-label of-port-label-in'; lbl2.style.top = '82px'; lbl2.textContent = 'Imagem'; el.appendChild(lbl2);
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

    // ── Replicate helpers ────────────────────────────────────────────────────
    const REPLICATE_MODELS = {
      'flux-schnell': 'black-forest-labs/flux-schnell',
      'flux-dev':     'black-forest-labs/flux-dev',
      'flux-pro':     'black-forest-labs/flux-1.1-pro',
      'sdxl':         'stability-ai/sdxl:39ed52f2319f9f0f24bc6578fd7e6c9c2c2c7b39f6e5a4c0a3b5c2b2b2b2b2b',
      'sd3':          'stability-ai/stable-diffusion-3-medium',
      'wan-t2v':      'wavespeedai/wan-2.1-t2v-480p',
      'wan-i2v':      'wavespeedai/wan-2.1-i2v-480p',
      'kling-t2v':    'klingai/kling-v1-6-standard',
      'minimax-video':'minimax/video-01',
    };

    async function ofCallReplicate(modelKey, input) {
      const apiKey = localStorage.getItem('tool_replicate_key');
      if (!apiKey) throw new Error('Chave Replicate não configurada. Acesse Ferramentas → 🎨 Replicate.');
      const modelId = REPLICATE_MODELS[modelKey] || modelKey;
      // Criar prediction
      const createRes = await fetch('https://api.replicate.com/v1/models/' + modelId + '/predictions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Prefer': 'wait' },
        body: JSON.stringify({ input })
      });
      if (!createRes.ok) {
        // Fallback para endpoint genérico
        const createRes2 = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Prefer': 'wait' },
          body: JSON.stringify({ version: modelId.includes(':') ? modelId.split(':')[1] : undefined, model: modelId.includes(':') ? undefined : modelId, input })
        });
        if (!createRes2.ok) throw new Error('Replicate: ' + (await createRes2.text()));
        const pred = await createRes2.json();
        return await ofPollReplicate(pred.id, apiKey);
      }
      const pred = await createRes.json();
      if (pred.status === 'succeeded') return pred.output;
      if (pred.error) throw new Error('Replicate: ' + pred.error);
      return await ofPollReplicate(pred.id, apiKey);
    }

    async function ofPollReplicate(predId, apiKey) {
      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const res = await fetch('https://api.replicate.com/v1/predictions/' + predId, {
          headers: { 'Authorization': 'Bearer ' + apiKey }
        });
        const pred = await res.json();
        if (pred.status === 'succeeded') return pred.output;
        if (pred.status === 'failed' || pred.status === 'canceled') throw new Error('Replicate falhou: ' + (pred.error || pred.status));
      }
      throw new Error('Replicate: timeout após 3 minutos');
    }

    async function ofCallGemini(prompt, imageSrc) {
      const apiKey = localStorage.getItem('tool_gemini_key');
      if (!apiKey) throw new Error('Chave Google AI não configurada. Acesse Ferramentas → ✨ Gemini.');
      const parts = [];
      if (imageSrc) {
        const base64 = imageSrc.split(',')[1];
        const mime = (imageSrc.match(/data:([^;]+);/) || [])[1] || 'image/jpeg';
        parts.push({ inlineData: { mimeType: mime, data: base64 } });
      }
      parts.push({ text: prompt });
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });
      const data = await res.json();
      if (data.error) throw new Error('Google AI: ' + data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resultado.';
    }

    function ofSetOutputLoading(nodes) {
      nodes.forEach(n => {
        n.data.loading = true; n.data.result = null;
        const el = document.getElementById('of-output-' + n.id);
        if (el) el.innerHTML = `<div class="of-output-loading"><div class="of-spinner"></div><span>Processando...</span></div>`;
      });
    }

    function ofSetOutputResult(nodes, result, isImage, isVideo) {
      nodes.forEach(n => {
        n.data.loading = false; n.data.result = result;
        const el = document.getElementById('of-output-' + n.id);
        if (!el) return;
        if (isImage && result) {
          el.innerHTML = `<div style="text-align:center"><img src="${result}" style="max-width:100%;border-radius:8px;margin-bottom:8px"><br><a href="${result}" target="_blank" style="font-size:10px;color:var(--gold)">↗ Abrir original</a></div>`;
        } else if (isVideo && result) {
          const url = Array.isArray(result) ? result[0] : result;
          el.innerHTML = `<div style="text-align:center"><video src="${url}" controls style="max-width:100%;border-radius:8px;margin-bottom:8px"></video><br><a href="${url}" target="_blank" style="font-size:10px;color:var(--gold)">↗ Download</a></div>`;
        } else {
          const txt = Array.isArray(result) ? result.join('\n') : String(result);
          el.innerHTML = `<div class="of-output-result-text">${txt.replace(/\n/g, '<br>')}</div>`;
        }
      });
    }

    function ofSetOutputError(nodes, err) {
      nodes.forEach(n => {
        n.data.loading = false;
        const el = document.getElementById('of-output-' + n.id);
        if (el) el.innerHTML = `<div class="of-output-result-text" style="color:var(--red-bright)">❌ ${err}</div>`;
      });
    }

    async function ofExecute() {
      if (OF.running) return;
      OF.running = true;
      const btn = document.getElementById('of-exec-btn');
      const lbl = document.getElementById('of-exec-label');
      btn.classList.add('running');
      lbl.textContent = 'Rodando...';

      const images  = Object.values(OF.nodes).filter(n => n.type === 'image' && n.data.src).map(n => n.data.src);
      const prompts = Object.values(OF.nodes).filter(n => n.type === 'prompt').map(n => n.data.text || '').filter(Boolean);
      const promptText = prompts.join('\n') || 'Analise e processe as imagens fornecidas.';

      const modelNode    = Object.values(OF.nodes).find(n => n.type === 'model');
      const imageGenNode = Object.values(OF.nodes).find(n => n.type === 'image-gen');
      const videoGenNode = Object.values(OF.nodes).find(n => n.type === 'video-gen');
      const outputNodes  = Object.values(OF.nodes).filter(n => n.type === 'output');

      ofSetOutputLoading(outputNodes);

      try {
        // ── 1. GERAÇÃO DE IMAGEM via Replicate ───────────────────────────────
        if (imageGenNode) {
          const modelKey = imageGenNode.data.model || 'flux-schnell';
          const ratio = imageGenNode.data.ratio || '1:1';
          const [w, h] = ratio === '16:9' ? [1280,720] : ratio === '9:16' ? [720,1280] : ratio === '4:3' ? [1024,768] : [1024,1024];
          lbl.textContent = `Gerando imagem (${modelKey})...`;
          const input = { prompt: promptText, width: w, height: h, num_outputs: 1 };
          if (modelKey.startsWith('flux')) { input.output_format = 'webp'; input.output_quality = 90; }
          const output = await ofCallReplicate(modelKey, input);
          const imgUrl = Array.isArray(output) ? output[0] : output;
          // Salva como fonte para video-gen encadeado
          if (videoGenNode) videoGenNode.data._generatedImg = imgUrl;
          ofSetOutputResult(outputNodes, imgUrl, true, false);
        }

        // ── 2. GERAÇÃO DE VÍDEO via Replicate ───────────────────────────────
        if (videoGenNode) {
          const modelKey = videoGenNode.data.model || 'wan-t2v';
          const duration = videoGenNode.data.duration || 5;
          lbl.textContent = `Gerando vídeo (${modelKey})... pode levar 1-2 min`;
          const srcImg = videoGenNode.data._generatedImg || images[0] || null;
          let input = { prompt: promptText, duration };
          if (modelKey.includes('i2v') && srcImg) { input.image = srcImg; }
          const output = await ofCallReplicate(modelKey, input);
          ofSetOutputResult(outputNodes, output, false, true);
        }

        // ── 3. MODELO IA (análise/texto) ──────────────────────────────────────
        if (modelNode && !imageGenNode && !videoGenNode) {
          const modelType = modelNode.data.model || 'claude';

          // Google Gemini
          if (modelType.startsWith('gemini')) {
            lbl.textContent = 'Consultando Gemini...';
            const result = await ofCallGemini(promptText, images[0] || null);
            ofSetOutputResult(outputNodes, result, false, false);

          // OpenRouter (GPT, Llama, DeepSeek)
          } else if (modelType.startsWith('or-')) {
            lbl.textContent = 'Consultando OpenRouter...';
            const orKey = localStorage.getItem('openrouter_key');
            if (!orKey) throw new Error('Chave OpenRouter não configurada. Acesse Ferramentas → ⚡ OpenRouter.');
            const orModelMap = { 'or-gpt4o': 'openai/gpt-4o', 'or-llama4': 'meta-llama/llama-4-maverick', 'or-deepseek': 'deepseek/deepseek-r1' };
            const orModel = orModelMap[modelType] || 'openai/gpt-4o';
            const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + orKey, 'Content-Type': 'application/json' },
              body: JSON.stringify({ model: orModel, messages: [{ role: 'user', content: promptText }] })
            });
            const orData = await orRes.json();
            const result = orData.choices?.[0]?.message?.content || orData.error?.message || 'Sem resultado.';
            ofSetOutputResult(outputNodes, result, false, false);

          // Claude (Anthropic) — padrão
          } else {
            lbl.textContent = 'Consultando Claude...';
            const systemMap = {
              describe: 'Você é um especialista em análise visual. Descreva a imagem em detalhes, focando em composição, iluminação, estilo, cores e elementos. Responda em português.',
              enhance:  'Você é um especialista em prompts para geração de imagens AI. Melhore o prompt recebido com detalhes de iluminação, composição, estilo fotográfico e qualidade. Retorne APENAS o prompt melhorado em inglês.',
              concept:  'Você é um diretor criativo. Gere um conceito visual detalhado incluindo: conceito central, paleta de cores, tipografia sugerida e prompt para geração de imagem. Responda em português.',
            };
            const systemPrompt = systemMap[modelType] || 'Você é um assistente criativo especializado em marketing visual. Analise as imagens e o prompt fornecidos, e gere uma resposta criativa e detalhada. Responda em português.';
            let userContent = [];
            images.forEach(src => {
              const base64 = src.split(',')[1];
              const mime = (src.match(/data:([^;]+);/) || [])[1] || 'image/jpeg';
              userContent.push({ type: 'image', source: { type: 'base64', media_type: mime, data: base64 } });
            });
            userContent.push({ type: 'text', text: promptText });
            const apiKey = localStorage.getItem('imperio_anthropic_key') || '';
            const res = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
              body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: systemPrompt, messages: [{ role: 'user', content: userContent }] })
            });
            const data = await res.json();
            const result = data.content?.[0]?.text || data.error?.message || 'Sem resultado.';
            ofSetOutputResult(outputNodes, result, false, false);
          }
        }
      } catch (err) {
        ofSetOutputError(outputNodes, err.message);
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
      } else if (name === 'generate_image') {
        document.querySelector(`.of-template-chip[onclick*="generate_image"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Gerar Imagem';
        const prompt = ofAddNode('prompt', 80, 150);
        const imgGen = ofAddNode('image-gen', 380, 150);
        const output = ofAddNode('output', 680, 150);
        OF.nodes[prompt].data.text = 'Mulher elegante com bolsa de luxo, fotografia editorial, luz natural suave, fundo neutro';
        OF.connections = [{ from: prompt, to: imgGen }, { from: imgGen, to: output }];
      } else if (name === 'generate_video') {
        document.querySelector(`.of-template-chip[onclick*="generate_video"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Gerar Vídeo';
        const prompt = ofAddNode('prompt', 80, 150);
        const vidGen = ofAddNode('video-gen', 380, 150);
        const output = ofAddNode('output', 680, 150);
        OF.nodes[prompt].data.text = 'Modelo caminhando em passarela de moda, câmera lenta, luzes dramáticas, estilo editorial';
        OF.connections = [{ from: prompt, to: vidGen }, { from: vidGen, to: output }];
      } else if (name === 'prompt_to_video') {
        document.querySelector(`.of-template-chip[onclick*="prompt_to_video"]`)?.classList.add('active');
        document.getElementById('of-flow-name').value = 'Prompt → Imagem → Vídeo';
        const prompt = ofAddNode('prompt', 60, 200);
        const imgGen = ofAddNode('image-gen', 340, 200);
        const vidGen = ofAddNode('video-gen', 620, 200);
        const output = ofAddNode('output', 900, 200);
        OF.nodes[prompt].data.text = 'Modelo com vestido dourado em cenário urbano noturno, iluminação cinematográfica';
        OF.connections = [
          { from: prompt, to: imgGen },
          { from: imgGen, to: vidGen },
          { from: vidGen, to: output }
        ];
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
    <div class="of-ctx-item" onclick="ofAddNode('image');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">🖼</span> Imagem (upload)</div>
    <div class="of-ctx-item" onclick="ofAddNode('prompt');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">✍️</span> Prompt</div>
    <div class="of-ctx-item" onclick="ofAddNode('model');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">⚡</span> Modelo IA (análise)</div>
    <div class="of-ctx-item" onclick="ofAddNode('image-gen');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">🎨</span> Gerar Imagem (Replicate)</div>
    <div class="of-ctx-item" onclick="ofAddNode('video-gen');this.closest('.of-ctx-menu').remove()"><span class="of-ctx-item-icon">🎬</span> Gerar Vídeo (Replicate)</div>
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