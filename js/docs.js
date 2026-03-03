    // ═══════════════════════════════════════════════════════
    //  DOCS
    // ═══════════════════════════════════════════════════════

    function docsLoad() {
      let d = JSON.parse(localStorage.getItem('imperio_docs') || 'null');
      if (!d) { d = docsSeed(); docsSave(d); }
      return d;
    }
    let DOCS = docsLoad();
    function docsSave(d) { d = d || DOCS; localStorage.setItem('imperio_docs', JSON.stringify(d)); }
    function docsUid() { return Math.random().toString(36).slice(2, 10); }
    let docEditId = null;

    function docsSeed() {
      const now = new Date().toISOString();
      return [
        { id: docsUid(), title: 'SOP — Fluxo de Criação de Criativos', cat: 'SOP', project: 'Segredos da Captação', tags: ['criativo', 'processo', 'tráfego'], body: `# Fluxo de Criação de Criativos\n\n## 1. Briefing\n- Definir objetivo (awareness / conversão)\n- Identificar dor principal do avatar\n- Escolher formato (feed / stories / reels)\n\n## 2. Copy\n- Hook: primeiros 3 segundos\n- Corpo: Pain → Amplify → Solution\n- CTA: claro e direto\n\n## 3. Arte\n- Enviar brief para designer ou agente\n- Formatos: 1080x1080 + 1080x1920\n\n## 4. Aprovação\n- Revisar copy + arte juntos\n- Testar hook em 3 variações\n\n## 5. Publicação\n- Upload no Gerenciador de Anúncios\n- Registrar no Kanban como "Publicado"`, created: now, updated: now },
        { id: docsUid(), title: 'Roteiro VSL — Segredos da Captação', cat: 'Roteiro', project: 'Segredos da Captação', tags: ['vsl', 'roteiro', 'copy'], body: `# VSL — Segredos da Captação\n\n## Hook (0:00 – 0:30)\n"Se você está no mercado imobiliário e ainda depende de indicação para captar imóveis, este vídeo vai mudar o seu jogo..."\n\n## Problema (0:30 – 2:00)\nApresente a dor: corretores presos na dependência de indicações, sem previsibilidade, sem escalabilidade.\n\n## Amplificação (2:00 – 4:00)\nMostre o custo do problema: concorrência, tempo perdido, receita instável.\n\n## Solução (4:00 – 7:00)\nIntroduza o método: sistema de atração que traz proprietários prontos para assinar.\n\n## Prova (7:00 – 10:00)\nDepoimentos + números + resultados reais.\n\n## Oferta (10:00 – 12:00)\nApresente o produto, bônus e garantia.\n\n## CTA Final\n"Clique no botão abaixo agora."`, created: now, updated: now },
        { id: docsUid(), title: 'Guia de Tom de Voz — Deep Networking', cat: 'Referência', project: 'Deep Networking', tags: ['branding', 'voz', 'tom'], body: `# Tom de Voz — Deep Networking\n\n## Arquétipo: Mentor\nVocê fala como um sócio sênior que já cometeu os erros e quer que o outro pule etapas.\n\n## Palavras que USAMOS\n- "estratégico", "posicionamento", "conexão real"\n- "nível acima", "acesso", "bastidores"\n- "quem você conhece define onde você chega"\n\n## Palavras que EVITAMOS\n- "segredo", "fórmula mágica", "rico rápido"\n- Linguagem de guru motivacional\n- Excessos de exclamações\n\n## Tom por Formato\n- **LinkedIn:** profissional, denso, dados\n- **Stories:** direto, provocativo, curto\n- **Email:** narrativa pessoal + lição`, created: now, updated: now },
        { id: docsUid(), title: 'Estratégia de Lançamento — Kit Tráfego', cat: 'Estratégia', project: 'Kit Tráfego', tags: ['lançamento', 'funil', 'estratégia'], body: `# Estratégia de Lançamento\n\n## Fase 1 — Aquecimento (D-14 a D-7)\n- Conteúdo orgânico: 3 posts por semana sobre dores do avatar\n- Stories: bastidores da construção do produto\n- Objetivo: engajamento e lista de espera\n\n## Fase 2 — Pré-venda (D-7 a D-1)\n- Lançar página de captura com bônus de early bird\n- Campanha de tráfego para lista (CPL < R$8)\n- Email diário com valor + antecipação\n\n## Fase 3 — Abertura de Carrinho (D-Day)\n- Email às 7h + 12h + 21h\n- Live de lançamento ao vivo\n- Anúncio de conversão direto para checkout\n\n## Fase 4 — Encerramento (D+3)\n- Escassez real: fechar às 23h59\n- Email de últimas horas\n- Bump de oferta no checkout`, created: now, updated: now },
        { id: docsUid(), title: 'SOP — Processo de Onboarding Comunidade', cat: 'SOP', project: 'Comunidade', tags: ['onboarding', 'processo', 'comunidade'], body: `# Onboarding — Comunidade Império\n\n## Passo 1 — Boas-vindas (D+0)\n- Enviar email de boas-vindas com acesso\n- Adicionar ao grupo exclusivo\n- Enviar kit de boas-vindas (PDF)\n\n## Passo 2 — Ativação (D+1 a D+3)\n- Sequência de 3 emails com as primeiras ações\n- Convidar para a live de integração\n- Incentivar primeira interação no grupo\n\n## Passo 3 — Engajamento (D+7)\n- Check-in personalizado\n- Indicar o próximo passo no conteúdo\n- Pedir feedback da experiência`, created: now, updated: now },
        { id: docsUid(), title: 'Copy — Anúncios Fundo de Funil', cat: 'Copy', project: '', tags: ['copy', 'anúncio', 'conversão'], body: `# Templates de Copy — Fundo de Funil\n\n## Template 1 — Prova Social\n"[Nome] saiu de R$0 para R$[valor] em [tempo] usando [método]. Sem [objeção]. Clica e vê como funciona."\n\n## Template 2 — Urgência\n"Última vez que abrimos em [ano], esgotou em [X] horas. Estamos abrindo [X] vagas agora. Não garanto que vai estar disponível amanhã."\n\n## Template 3 — Inversão de Risco\n"Entra, aplica, e se em [prazo] não funcionar, eu devolvo cada centavo. Sem perguntas. Sem burocracia."\n\n## Template 4 — Dor Direta\n"Você ainda está [situação dolorosa]? Isso não é falta de esforço. É falta de [solução]. É exatamente isso que o [produto] resolve."`, created: now, updated: now },

        // ── GUIAS GLOBAIS ─────────────────────────────────────────
        { id: docsUid(), title: 'Império X OS — Arquitetura Completa', cat: 'Framework', project: '', tags: ['sistema', 'os', 'arquitetura'], body: `<iframe src="imperio-x-os.html" style="width:100%; height:80vh; border:none; border-radius:12px;"></iframe>`, created: now, updated: now },
        { id: docsUid(), title: 'Império OS — Guia de Operação', cat: 'Framework', project: '', tags: ['sistema', 'os', 'agentes', 'ia'], body: `# ⚡ Império OS — Guia de Operação\n\n## O que é o Império OS\nO Império OS é um sistema operacional para negócios digitais. Organiza projetos, avatares, agentes de IA, documentação e tarefas em uma interface unificada.\n\n## Arquitetura\n\n\'\'\'\nPROJETOS → cada negócio / produto / campanha\n  ├── Briefing     → objetivo, produto, links, contexto\n  ├── Avatar       → psicologia completa do cliente\n  ├── Branding     → arquétipo, tom de voz, mecanismo\n  ├── KPIs         → métricas de performance\n  ├── Pipeline     → % de evolução por área\n  ├── Assets       → biblioteca de criativos\n  ├── Docs         → SOPs, roteiros, guias do projeto\n  └── Kanban       → tarefas ativas\n\nKNOWLEDGE BASE → conhecimento estático da empresa\nDOCS GLOBAIS   → referências que transcendem projetos\nCONTEXTO IA   → gera prompt estruturado\n\'\'\'\n\n## Fluxo de Execução por Agente\n1. Recebe task com nome do projeto\n2. Lê Briefing → entende o negócio\n3. Lê Avatar → entende para quem fala\n4. Lê Branding → entende como falar\n5. Consulta Docs do projeto (SOPs, roteiros)\n6. Consulta KB (frameworks, métodos)\n7. Executa a task\n8. Documenta output nos Docs\n9. Atualiza Kanban\n\n## Regras de Ouro\n- Nunca crie copy sem ler o avatar completo\n- Sempre use o tom de voz do branding como filtro\n- Consulte SOPs antes de executar processos recorrentes\n- Documente tudo — o sistema cresce com uso\n- O Kanban reflete a realidade — atualize sempre\n\n## Hierarquia de Prioridade\n1. Projetos Vendendo → manter e escalar\n2. Projetos Ativo → acelerar pipeline\n3. Projetos Em Construção → completar foundation\n4. Projetos Pausado → reavaliar ou arquivar`, created: now, updated: now },

        { id: docsUid(), title: 'Fórmula Mágica de Avatar — Template', cat: 'Avatar', project: '', tags: ['avatar', 'formula', 'dores', 'desejos', 'interno', 'externo'], body: `# 👤 Fórmula Mágica de Avatar\n\n> Use este template para mapear qualquer avatar. Preencha do externo para o interno.\n\n---\n\n## 🎯 Desejo Externo\n*O que o avatar diz em voz alta que quer.*\n\n[Ex: "Quero ganhar dinheiro na internet sem depender de chefe"]\n\n---\n\n## ❤️ Desejo Interno\n*O que ele quer SENTIR. Identidade, status, liberdade, aprovação.*\n\n[Ex: "Quero provar para minha família que sou capaz"]\n\n---\n\n## 😤 Dores Superficiais\n*O que ele descreve quando você pergunta qual é o problema.*\n\n- [Dor 1]\n- [Dor 2]\n\n---\n\n## 🩸 Dores Profundas\n*Vergonha, medo de julgamento, medos existenciais. Raramente dito em voz alta.*\n\n- [Dor profunda 1]\n- [Dor profunda 2]\n\n---\n\n## 😱 Medos\n*O cenário que paralisa.*\n\n- [Medo 1]\n- [Medo 2]\n\n---\n\n## 🤔 Objeções\n*Os "mas e se..." na cabeça dele. Por que ele ainda não agiu.*\n\n- [Objeção 1]\n- [Objeção 2]\n\n---\n\n## 👹 Inimigo Externo\n*Quem ou o quê está bloqueando o resultado. Use para criar "nós vs eles".*\n\n[Ex: O sistema financeiro que fecha portas para quem não tem diploma]\n\n---\n\n## 🌟 Resultado Sonhado\n*A transformação completa. O "depois". Seja específico: número, tempo, sensação.*\n\n[Ex: R$10k/mês, 4h/dia, de onde quiser, sem chefe]\n\n---\n\n## ⚡ Trigger Event\n*O que aconteceu que fez ele buscar solução AGORA.*\n\n[Ex: Demissão, discussão, conta no vermelho, amigo que conseguiu]\n\n---\n\n## 🧠 Fase de Consciência\n- [ ] Inconsciente do problema\n- [ ] Consciente do problema, não da solução\n- [ ] Consciente da solução, não do produto\n- [ ] Consciente do produto\n- [ ] Mais consciente / pronto para comprar\n\n---\n\n## 👥 Sub-Avatares\n| Nome | Descrição | Urgência (1-10) | Poder de Compra (1-10) |\n|------|-----------|-----------------|------------------------|\n| [Nome] | [Desc] | | |\n\n---\n\n## 📖 Storyboard\n**Antes:** [Situação inicial]\n\n**Trigger:** [O momento que muda tudo]\n\n**Busca:** [Como ele pesquisa — o que vê, o que compara]\n\n**Decisão:** [Por que escolhe você e não o concorrente]`, created: now, updated: now },

        { id: docsUid(), title: 'Perfil da Empresa — Império Digital', cat: 'Empresa', project: '', tags: ['empresa', 'missão', 'visão', 'valores', 'posicionamento'], body: `# 🏛 Império Digital — Perfil da Empresa\n\n## Missão\n[Por que a empresa existe? Que problema resolve no mundo?]\n\n## Visão\n[Onde quer chegar em 5-10 anos?]\n\n## Valores\n- Resultado acima de discurso\n- Documentação como ativo estratégico\n- Sistemas antes de esforço bruto\n- [Adicione seus valores]\n\n## Posicionamento\n[Como a empresa se diferencia? Para quem é? Por que é melhor?]\n\n## Ofertas Principais\n| Produto | Preço | Status |\n|---------|-------|--------|\n| [Produto 1] | R$ | |\n| [Produto 2] | R$ | |\n\n## Tom de Voz Global\n- Arquétipo principal: [ex: Governante + Criador]\n- Palavras que USAMOS: estratégico, sistema, escala, resultado real\n- Palavras que EVITAMOS: guru, fórmula mágica, fique rico rápido\n- Personalidade: direto, técnico quando preciso, sem enrolação\n\n## Mercados que Operamos\n- [Vertical 1: ex. iGaming]\n- [Vertical 2: ex. Infoprodutos]\n\n## Diferenciais\n[O que faz o Império diferente de qualquer outra operação?]`, created: now, updated: now },
      ];
    }

    // ── Render Docs (dentro do projeto)
    function renderDocs() {
      const el = document.getElementById('tab-docs');
      if (!el || !currentProject) return;
      const projDocs = DOCS.filter(d => d.project === currentProject.nome);

      const cats = ['SOP', 'Roteiro', 'Copy', 'Estratégia', 'Criativo', 'Referência', 'Empresa', 'Framework', 'Avatar'];
      const catIcons = { SOP: '📋', Roteiro: '🎬', Copy: '✍️', Estratégia: '🎯', Criativo: '🎨', Referência: '📌', Empresa: '🏢', Framework: '🧩', Avatar: '👤' };

      let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div style="font-size:13px;color:var(--text2)">${projDocs.length} documento${projDocs.length !== 1 ? 's' : ''} neste projeto</div>
    <button onclick="openDocModal('${currentProject.nome}')" style="background:var(--gold);color:#0a0a0f;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">+ Novo Doc</button>
  </div>`;

      if (!projDocs.length) {
        html += `<div style="text-align:center;padding:50px 20px;color:var(--text3)">
      <div style="font-size:32px;margin-bottom:12px">📭</div>
      <div style="font-size:13px;margin-bottom:8px">Nenhum documento ainda</div>
      <div style="font-size:11px">SOPs, roteiros, copies, estratégias — tudo aqui</div>
    </div>`;
      } else {
        cats.forEach(cat => {
          const catDocs = projDocs.filter(d => d.cat === cat);
          if (!catDocs.length) return;
          html += `<div class="docs-section-title">${catIcons[cat]} ${cat}</div>
        <div class="docs-grid">${catDocs.map(d => docCardHtml(d)).join('')}</div>`;
        });
        const uncatDocs = projDocs.filter(d => !cats.includes(d.cat));
        if (uncatDocs.length) html += `<div class="docs-section-title">📄 Outros</div><div class="docs-grid">${uncatDocs.map(d => docCardHtml(d)).join('')}</div>`;
      }
      el.innerHTML = html;
    }

    // ── Render Docs Global
    function showDocsGlobal() {
      document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('view-docs').classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById('nav-docs-global').classList.add('active');

      const sel = document.getElementById('docs-filter-proj');
      if (sel && sel.options.length <= 1) {
        PROJECTS.forEach(p => { sel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
      }
      const fsel = document.getElementById('doc-f-project');
      if (fsel && fsel.options.length <= 1) {
        PROJECTS.forEach(p => { fsel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
      }
      renderDocsGlobal();
    }

    function renderDocsGlobal() {
      const body = document.getElementById('docs-global-body');
      if (!body) return;
      const q = (document.getElementById('docs-search') || {}).value || '';
      const pf = (document.getElementById('docs-filter-proj') || {}).value || '';
      const cf = (document.getElementById('docs-filter-cat') || {}).value || '';

      let filtered = DOCS.filter(d => {
        if (pf && d.project !== pf) return false;
        if (cf && d.cat !== cf) return false;
        if (q) {
          const ql = q.toLowerCase();
          return d.title.toLowerCase().includes(ql) || d.body.toLowerCase().includes(ql) || (d.tags || []).some(t => t.toLowerCase().includes(ql));
        }
        return true;
      });

      if (!filtered.length) {
        body.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text3)"><div style="font-size:36px;margin-bottom:14px">🔍</div><div>Nenhum documento encontrado</div></div>`;
        return;
      }

      // Group by project
      const byProj = {};
      filtered.forEach(d => {
        const k = d.project || '📌 Geral';
        if (!byProj[k]) byProj[k] = [];
        byProj[k].push(d);
      });

      let html = '';
      Object.entries(byProj).forEach(([proj, docs]) => {
        const p = PROJECTS.find(x => x.nome === proj);
        html += `<div class="docs-section-title">${p ? p.icon + ' ' : ''}${proj} <span style="color:var(--text3);font-weight:400">(${docs.length})</span></div>
      <div class="docs-grid">${docs.map(d => docCardHtml(d)).join('')}</div>`;
      });
      body.innerHTML = html;
    }

    function docCardHtml(d) {
      const preview = d.body.replace(/#+\s*/g, '').replace(/\*\*/g, '').slice(0, 120) + '...';
      const tagsHtml = (d.tags || []).map(t => `<span class="doc-tag">${t}</span>`).join('');
      const updated = d.updated ? new Date(d.updated).toLocaleDateString('pt-BR') : '';
      return `<div class="doc-card" onclick="openDocModal(null,'${d.id}')">
    <span class="doc-cat-badge doc-cat-${d.cat}">${d.cat}</span>
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:5px;line-height:1.3">${d.title}</div>
    <div style="font-size:11px;color:var(--text3);line-height:1.5;margin-bottom:8px">${preview}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">${tagsHtml}</div>
    <div style="font-size:10px;color:var(--text3)">${updated ? '🕐 ' + updated : ''}</div>
  </div>`;
    }

    // ── Doc Modal
    function openDocModal(defaultProject, docId) {
      docEditId = docId || null;
      const modal = document.getElementById('doc-modal');
      const delBtn = document.getElementById('doc-del-btn');

      const fsel = document.getElementById('doc-f-project');
      if (fsel && fsel.options.length <= 1) {
        PROJECTS.forEach(p => { fsel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
      }

      if (docId) {
        const d = DOCS.find(x => x.id === docId);
        document.getElementById('doc-modal-title').textContent = 'Editar Documento';
        document.getElementById('doc-f-title').value = d.title;
        document.getElementById('doc-f-cat').value = d.cat;
        document.getElementById('doc-f-project').value = d.project || '';
        document.getElementById('doc-f-body').value = d.body;
        document.getElementById('doc-f-tags').value = (d.tags || []).join(', ');
        delBtn.style.display = 'block';
      } else {
        document.getElementById('doc-modal-title').textContent = 'Novo Documento';
        document.getElementById('doc-f-title').value = '';
        document.getElementById('doc-f-cat').value = 'SOP';
        document.getElementById('doc-f-project').value = defaultProject || (currentProject ? currentProject.nome : '');
        document.getElementById('doc-f-body').value = '';
        document.getElementById('doc-f-tags').value = '';
        delBtn.style.display = 'none';
      }

      modal.style.opacity = '1'; modal.style.pointerEvents = 'all';
      modal.onclick = (e) => { if (e.target === modal) closeDocModal(); };
    }

    function closeDocModal() {
      const modal = document.getElementById('doc-modal');
      modal.style.opacity = '0'; modal.style.pointerEvents = 'none';
      docEditId = null;
    }

    function saveDoc() {
      const title = document.getElementById('doc-f-title').value.trim();
      if (!title) { document.getElementById('doc-f-title').focus(); return; }
      const now = new Date().toISOString();
      const doc = {
        id: docEditId || docsUid(),
        title,
        cat: document.getElementById('doc-f-cat').value,
        project: document.getElementById('doc-f-project').value,
        body: document.getElementById('doc-f-body').value,
        tags: document.getElementById('doc-f-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        created: docEditId ? (DOCS.find(d => d.id === docEditId) || {}).created || now : now,
        updated: now,
      };
      if (docEditId) {
        const idx = DOCS.findIndex(d => d.id === docEditId);
        if (idx !== -1) DOCS[idx] = doc;
      } else {
        DOCS.push(doc);
      }
      docsSave();
      closeDocModal();
      // Refresh whatever view is active
      const activeDoc = document.getElementById('view-docs');
      if (activeDoc && activeDoc.classList.contains('active')) renderDocsGlobal();
      else renderDocs();
    }

    function deleteDoc() {
      if (!docEditId) return;
      if (!confirm('Excluir este documento?')) return;
      DOCS = DOCS.filter(d => d.id !== docEditId);
      docsSave();
      closeDocModal();
      const activeDoc = document.getElementById('view-docs');
      if (activeDoc && activeDoc.classList.contains('active')) renderDocsGlobal();
      else renderDocs();
    }

    // ═══════════════════════════════════════════════════════
    //  CREATE PROJECT
    // ═══════════════════════════════════════════════════════
    let _cpParentId = null;
    function openCreateProject(parentId) {
      _cpParentId = parentId || null;
      const m = document.getElementById('create-project-modal');
      const titleEl = m.querySelector('div[style*="font-size:15px"]');
      if (parentId) {
        const parent = PROJECTS.find(p => p.id === parentId);
        if (titleEl) titleEl.textContent = '➕ Novo Subprojeto de ' + (parent ? parent.nome : '');
        // Pre-select parent's category
        const catSel = document.getElementById('cp-cat');
        if (catSel && parent) catSel.value = parent.categoria;
      } else {
        if (titleEl) titleEl.textContent = '➕ Novo Projeto';
      }
      m.style.opacity = '1'; m.style.pointerEvents = 'auto';
    }
    function closeCreateProject() {
      _cpParentId = null;
      const m = document.getElementById('create-project-modal');
      m.style.opacity = '0'; m.style.pointerEvents = 'none';
      ['cp-icon', 'cp-nome', 'cp-produto', 'cp-preco', 'cp-objetivo', 'cp-contexto'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = id === 'cp-icon' ? '🚀' : '';
      });
      const titleEl = m.querySelector('div[style*="font-size:15px"]');
      if (titleEl) titleEl.textContent = '➕ Novo Projeto';
    }
    function saveNewProject() {
      const nome = document.getElementById('cp-nome').value.trim();
      if (!nome) { alert('Nome do projeto é obrigatório'); return; }
      const parentId = _cpParentId;
      const parent = parentId ? PROJECTS.find(p => p.id === parentId) : null;
      const proj = {
        id: projectUid(),
        icon: document.getElementById('cp-icon').value.trim() || '🚀',
        nome,
        produto: document.getElementById('cp-produto').value.trim(),
        preco: document.getElementById('cp-preco').value.trim(),
        categoria: parent ? parent.categoria : document.getElementById('cp-cat').value,
        vertical_color: parent ? parent.vertical_color : document.getElementById('cp-cor').value,
        status: document.getElementById('cp-status').value,
        objetivo: document.getElementById('cp-objetivo').value.trim(),
        contexto: document.getElementById('cp-contexto').value.trim(),
        vende: false, orcamento_trafego: 'A definir',
        links: { site: '', ads: '', analytics: '', criativos: '' },
        avatar: {
          externo: '', interno: '', dores_superficiais: [], dores_profundas: [],
          medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '',
          fase_consciencia: '', sub_avatares: [], storyboard: [], escavador_desejos: null
        },
        pipeline: { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: [],
        _custom: true
      };
      if (parentId) proj.parent_id = parentId;
      const custom = projectsGetCustom();
      custom.push(proj);
      projectsSaveCustom(custom);
      PROJECTS.push(proj);
      closeCreateProject();
      renderSidebar();
      updateMetrics();
      openProject(proj.id);
    }

    // ── Rename Project ──
    function renameProject(projId) {
      const p = PROJECTS.find(x => x.id === projId);
      if (!p) return;
      const newName = prompt('Novo nome para o projeto:', p.nome);
      if (!newName || !newName.trim()) return;
      p.nome = newName.trim();
      // Persist if custom
      const custom = projectsGetCustom();
      const ci = custom.findIndex(x => x.id === projId);
      if (ci !== -1) { custom[ci].nome = p.nome; projectsSaveCustom(custom); }
      renderSidebar();
      updateMetrics();
      if (currentProject && currentProject.id === projId) renderProjectHero();
    }
