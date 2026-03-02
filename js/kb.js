    // ═══════════════════════════════════════════════════════
    //  KNOWLEDGE BASE
    // ═══════════════════════════════════════════════════════
    const KB_SECTIONS = [
      { id: 'empresa', icon: '🏛', label: 'A Empresa', desc: 'Missão, visão, valores, história, posicionamento' },
      { id: 'os_guia', icon: '⚡', label: 'Império OS — Guia', desc: 'Como o sistema funciona e como a IA deve operar' },
      { id: 'avatares', icon: '🧠', label: 'Avatares Globais', desc: 'Dores, desejos internos/externos, fórmula mágica' },
      { id: 'agentes', icon: '🤖', label: 'Agentes & Squads', desc: 'Estrutura de squads, papéis e responsabilidades' },
      { id: 'frameworks_copy', icon: '✍️', label: 'Frameworks de Copy', desc: 'VSL, Email, Ad copy — estruturas comprovadas' },
      { id: 'frameworks_lancamento', icon: '🚀', label: 'Frameworks de Lançamento', desc: 'PLF, Jeff Walker, Perpétuo, Seminário' },
      { id: 'frameworks_trafego', icon: '📊', label: 'Frameworks de Tráfego', desc: 'Estrutura de campanhas, criativos, funis' },
      { id: 'sops_globais', icon: '📋', label: 'SOPs Globais', desc: 'Processos padrão que se aplicam a todos os projetos' },
      { id: 'referencias', icon: '📌', label: 'Referências & Inspirações', desc: 'Cases, exemplos de copy, criativos, funis que funcionam' },
      // ── AI-FOCUSED SECTIONS ──
      { id: 'persona_ia', icon: '🎭', label: 'Persona das IAs', desc: 'Como cada agente deve se comportar, falar e tomar decisões' },
      { id: 'regras_comunicacao', icon: '📣', label: 'Regras de Comunicação', desc: 'Tom de voz, palavras proibidas, estilo para cada canal' },
      { id: 'objections', icon: '🛡', label: 'Objeções & Respostas', desc: 'As principais objeções dos clientes e como quebrá-las' },
      { id: 'scripts_venda', icon: '🗣', label: 'Scripts de Venda', desc: 'Scripts de VSL, WhatsApp, DM, ligação e fechamento' },
      { id: 'aprendizados', icon: '💡', label: 'Histórico de Aprendizados', desc: 'O que funcionou, o que falhou — memória estratégica' },
    ];

    const KB_DEFAULT_CONTENT = {
      empresa: `# 🏛 Império Digital — A Empresa

## Missão
[Descreva a missão da empresa aqui]

## Visão
[Visão de longo prazo]

## Valores
- [Valor 1]
- [Valor 2]
- [Valor 3]

## Posicionamento
[Como a empresa se posiciona no mercado]

## História
[Contexto e background da empresa]`,

      os_guia: `# ⚡ Império OS — Guia de Operação

## O que é o Império OS
O Império OS é um sistema operacional para negócios digitais. Ele organiza projetos, avatares, agentes de IA, documentação e tarefas em uma interface unificada.

## Como a IA deve ler este sistema

### Estrutura de Projetos
Cada projeto tem:
- **Briefing**: nome, produto, preço, objetivo, contexto, links
- **Avatar**: desejos externos/internos, dores superficiais/profundas, medos, objeções, inimigo, resultado sonhado, trigger event, sub-avatares, storyboard
- **Branding**: arquétipo, manifesto, mecanismo único, tom de voz, cores
- **KPIs**: thumbstop, CTR, CPM, CPC, ROAS, LTV, CAC, CVR
- **Pipeline**: % de conclusão por fase (avatar, funil, copy, prompts, design, tráfego)
- **Assets**: biblioteca de criativos, copies, landing pages
- **Docs**: documentação específica do projeto (SOPs, roteiros, guias)
- **Kanban**: tarefas ativas organizadas por board e status

### Hierarquia de Prioridade
1. Projetos com status "Vendendo" — manter e escalar
2. Projetos "Ativo" — acelerar pipeline
3. Projetos "Em Construção" — completar foundation
4. Projetos "Pausado" — reavaliar

### Squads de Agentes
- **Inteligência de Avatar**: pesquisa, mapeamento psicológico
- **Copy & Conteúdo**: VSL, emails, ads, orgânico
- **Design & Criativo**: thumbnails, criativos, identidade
- **Tráfego**: campanhas Meta/Google/TikTok
- **Estratégia**: produto, lançamento, oferta
- **Dados**: analytics, otimização, relatórios

### Fluxo de Execução
\`\`\`
Projeto → Avatar completo → Branding → Copy → Criativos → Tráfego → Dados → Otimização
\`\`\`

## Regras de Ouro para Agentes
1. Sempre leia o avatar completo antes de qualquer task de copy
2. Use o branding/tom de voz como filtro obrigatório
3. Consulte os SOPs do projeto antes de criar qualquer ativo
4. Documente outputs relevantes nos Docs do projeto
5. Atualize o Kanban após cada entrega`,

      avatares: `# 🧠 Avatares Globais

## Fórmula Mágica de Avatar

### Desejo Externo (O que eles dizem que querem)
[O que o avatar declara publicamente como seu objetivo]

### Desejo Interno (O que eles realmente querem sentir)
[A emoção ou identidade por trás do desejo externo]

### Dores Superficiais
[Os problemas que eles descrevem quando perguntados]

### Dores Profundas
[As dores reais por baixo — vergonha, medo, frustração profunda]

### Inimigo Externo
[Quem ou o quê está entre eles e o resultado que querem]

### Resultado Sonhado
[A transformação completa — o "depois" da jornada]

### Trigger Event
[O que aconteceu que fez eles começarem a buscar solução agora]

---

## Perfis por Vertical

### iGaming
[Avatar específico do vertical iGaming]

### Lançamentos / Infoprodutos
[Avatar específico de compradores de infoprodutos]

### E-commerce / Nutraceuticals
[Avatar do comprador de produtos físicos]`,

      agentes: `# 🤖 Agentes & Squads

## Estrutura de Squads

### 🧠 Squad Avatar
- **Pesquisador de Avatar**: mapeia dores, desejos, objeções via pesquisa
- **Psicólogo de Mercado**: identifica gatilhos emocionais profundos
- **Analista de Concorrentes**: analisa posicionamento e fraquezas da concorrência

### ✍️ Squad Copy
- **Copywriter VSL**: roteiros de vídeo de vendas
- **Email Specialist**: sequências de nutrição e lançamento
- **Ad Copywriter**: copy para anúncios Meta/Google/TikTok

### 🎨 Squad Criativo
- **Art Director**: direção visual e conceito criativo
- **Social Media Designer**: posts, stories, reels
- **Video Editor**: edição e produção de vídeo

### 📊 Squad Tráfego
- **Media Buyer**: gestão de campanhas pagas
- **Analytics Specialist**: análise de dados e otimização
- **Funnel Builder**: criação e otimização de funis

### 🚀 Squad Estratégia
- **Estrategista de Produto**: oferta, posicionamento, pricing
- **Launch Manager**: coordenação de lançamentos
- **Growth Hacker**: identificação de oportunidades de escala`,

      frameworks_copy: `# ✍️ Frameworks de Copy

## VSL Structure (Video Sales Letter)
1. **Hook** — Interrupção e captura da atenção (0-15s)
2. **Problema** — Agitação da dor principal
3. **Identificação** — "Eu já fui onde você está"
4. **Sonho** — O resultado desejado
5. **Inimigo** — Quem ou o quê está bloqueando
6. **Descoberta** — O mecanismo único
7. **Prova** — Depoimentos, resultados, evidências
8. **Oferta** — O que está sendo vendido
9. **Bônus** — Stack de valor
10. **Garantia** — Eliminação de risco
11. **CTA** — Chamada para ação urgente

## Email de Vendas
- Subject line com curiosidade/benefício/urgência
- Abertura com história ou identificação
- Problema agitado
- Solução apresentada
- CTA claro

## Ad Copy (Meta)
- **Hook** (3s): interrupção visual + texto de impacto
- **Problema**: 1-2 frases
- **Solução**: o que você oferece
- **Prova social**: números ou depoimento
- **CTA**: ação específica`,

      frameworks_lancamento: `# 🚀 Frameworks de Lançamento

## PLF (Product Launch Formula) — Jeff Walker
1. **Pré-pré-lançamento**: despertar curiosidade
2. **Pré-lançamento**: 3 vídeos de conteúdo (problema, solução, transformação)
3. **Carrinho aberto**: 7 dias com urgência
4. **Recuperação**: sequência de emails para não-compradores

## Lançamento Perpétuo
- Funil evergreen com sequência de emails automática
- VSL principal + sequência de 7-21 emails
- Webinar gravado ou ao vivo semanal
- Retargeting continuo

## Semente / Mini-lançamento
- Lista pequena (100-500 pessoas)
- Venda direta sem eventos
- Oferta exclusiva por tempo limitado

## Seminário / Webinar
- Convite → Pré-webinar → Ao vivo → Replay → Fechamento`,

      frameworks_trafego: `# 📊 Frameworks de Tráfego

## Estrutura de Campanha Meta
\`\`\`
Campanha (objetivo)
  └── Conjunto (público + orçamento)
        └── Anúncio (criativo + copy)
\`\`\`

## Tipos de Público
- **TOF (Topo)**: interesses, lookalike 2-5%, amplo
- **MOF (Meio)**: engajamento, visualização de vídeo
- **BOF (Fundo)**: retargeting visitantes, abandonos

## Métricas de Referência
- Thumbstop rate: >30%
- CTR link: >1.5%
- CPM: depende do nicho
- ROAS mínimo: >2x (break-even), >3x (escala)

## Regra do Criativo
- Teste mínimo 3-5 ângulos diferentes
- Rotacione a cada 2-3 semanas
- Hook é responsável por 80% do resultado`,

      sops_globais: `# 📋 SOPs Globais

## SOP-001: Briefing de Novo Projeto
1. Preencher todos os campos do briefing
2. Definir avatar primário com dores e desejos
3. Estabelecer branding básico (arquétipo, tom)
4. Definir objetivo de lançamento/escala
5. Criar primeiras tasks no Kanban

## SOP-002: Criação de Copy
1. Ler briefing completo do projeto
2. Ler avatar completo (dores, desejos, storyboard)
3. Verificar branding e tom de voz
4. Usar framework adequado ao formato
5. Entregar 2-3 variações
6. Documentar no Docs do projeto

## SOP-003: Análise de Resultados
1. Coletar dados das plataformas (Meta, Google, Hotmart)
2. Comparar com metas do KPI
3. Identificar top performers e underperformers
4. Propor otimizações
5. Documentar insights nos Docs do projeto`,

      referencias: `# 📌 Referências & Inspirações

## Copy que Converteu
[Cole aqui exemplos de copy, headlines, hooks que funcionaram]

## Criativos de Referência
[Links ou descrições de criativos de referência]

## Cases de Sucesso
[Cases internos e externos para inspiração]

## Funis de Referência
[Estruturas de funis que servem como base]

## Concorrentes a Monitorar
[Lista de concorrentes relevantes por vertical]`,

      persona_ia: `# 🎭 Persona das IAs

## Instrução Global para Todas as IAs
Você opera dentro do sistema Império HQ. Todo output deve ser orientado a conversão e resultado mensurável. Não opine — execute. Quando não tiver informação suficiente, pergunte exatamente o que precisa.

## 🤖 Agente Generalista — Imperius
- **Tom**: Direto, estratégico, sem rodeios. Pensa como CEO experiente.
- **Nunca faz**: pedir desculpas, ser passivo, usar linguagem corporativa genérica
- **Sempre faz**: propor soluções, questionar premissas ruins, dar perspectiva de mercado

## ✍️ Agente de Copy — Copybot
- **Tom**: Persuasivo, empático, orientado ao avatar. Escreve como copywriter de resposta direta.
- **Referência de voz**: [Cole exemplos de copy que você aprova aqui]

## 🎨 Agente Criativo — ClawBot
- **Tom**: Visual-first, orientado a padrões de atenção no primeiro frame
- **Referência**: [Cole exemplos de criativos que performam aqui]`,

      regras_comunicacao: `# 📣 Regras de Comunicação

## Tom de Voz Global
- **Linguagem**: Português brasileiro informal mas profissional
- **Energia**: Alta, positiva, sem ser forçado
- **Estilo**: Como um mentor que já passou pelo mesmo caminho

## Palavras PROIBIDAS
- "Solução inovadora" / "No mundo atual" / "Na era digital"
- Qualquer clichê de autoajuda vazio
- Jargão corporativo: "alavancar", "sinergia", "stakeholder"

## Por Canal

### Meta Ads
- Hook nos primeiros 3 segundos. Máximo 125 chars antes do "ver mais"

### WhatsApp / DM
- Tom conversacional. Mensagens curtas (3-4 linhas). Emojis com moderação ✅

### Email
- Subject: curiosidade ou urgência (máximo 50 chars). CTA único e claro.

### VSL
- Primeiro minuto: problema + identificação. Nunca revelar preço antes do valor.`,

      objections: `# 🛡 Objeções & Respostas

## Framework (4 passos)
1. **Valide** ("Faz sentido você pensar isso")
2. **Reframe** ("A questão é que...")
3. **Prova** (caso, dado, depoimento)
4. **CTA** (próximo passo claro)

## Objeções Mais Comuns

### "É muito caro"
"Entendo. A pergunta real é: quanto está te custando NÃO resolver isso? Se [resultado] vale R$X pra você, o investimento se paga em [prazo]."

### "Não tenho tempo"
"Exatamente por isso esse método foi desenhado — [resultado] em [tempo mínimo]. Quem mais dizia isso hoje são os que mais agradecem."

### "Não sei se funciona pra mim"
"Olha o caso de [case], mesma situação que você: [resultado mensurável]."

### "Preciso pensar"
"O que especificamente está te fazendo hesitar? Geralmente tem uma dúvida específica que ainda não foi respondida."

### "Já tentei outras coisas"
"Me conta o que você tentou. [Ouvir]. O que diferencia é [mecanismo único] — é exatamente por isso que funciona onde outros falham."

## Adicione suas objeções específicas:
- [Objeção]: [Resposta]`,

      scripts_venda: `# 🗣 Scripts de Venda

## WhatsApp — Primeiro Contato (Lead Quente)
\`\`\`
Oi [Nome]! Vi que você se cadastrou sobre [produto].
Queria entender sua situação antes de explicar como funciona.
Me conta: qual é o maior desafio que você tem hoje com [problema]?
\`\`\`

## WhatsApp — Fechamento
\`\`\`
[Nome], entendi tudo.
Olhando sua situação, o [produto] resolve exatamente [dor específica que ele disse].
Temos [X] vagas essa semana. Fechando hoje, você garante [bônus/condição].
Como prefere pagar — cartão ou PIX?
\`\`\`

## DM Instagram — Abordagem Fria
\`\`\`
Ei [Nome]! Vi seu perfil e percebi que você [observação específica].
Tenho trabalhado com pessoas no mesmo momento que você — ajudei [resultado].
Vale um papo de 5 minutos pra ver se faz sentido pra você?
\`\`\`

## Adicione seus scripts:
- [Nome do script]: [Conteúdo]`,

      aprendizados: `# 💡 Histórico de Aprendizados

## Como usar
Registre aqui o que funcionou e o que não funcionou. Este é o CÉREBRO ESTRATÉGICO da empresa — memória que impede repetir erros e acelera o que funciona.

---

## ✅ O que FUNCIONOU

### [Data] — [Campanha/Ação]
- **O que foi feito**: [Descreva]
- **Resultado**: [Métricas]
- **Por que funcionou**: [Análise]
- **Replicar em**: [Próximas oportunidades]

---

## ❌ O que NÃO funcionou

### [Data] — [Campanha/Ação]
- **O que foi tentado**: [Descreva]
- **Resultado**: [Métricas]
- **Por que falhou**: [Análise]

---

## 🧪 Hipóteses para Testar
- [ ] [Hipótese 1]
- [ ] [Hipótese 2]

---

## 📊 Benchmarks do Negócio
- Thumbstop rate médio: [%]
- CTR médio: [%] | CPL médio: R$[X]
- Taxa de conversão: [%] | LTV médio: R$[X]`,

    };

    function kbLoad() {
      const saved = localStorage.getItem('imperio_kb');
      if (!saved) return {};
      return JSON.parse(saved);
    }
    function kbSave(data) {
      localStorage.setItem('imperio_kb', JSON.stringify(data));
    }
    let KB_DATA = kbLoad();

    let kbActiveSection = 'os_guia';

    function showKB() {
      document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('view-kb').classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById('nav-kb').classList.add('active');
      renderKBNav();
      renderKBContent(kbActiveSection);
    }

    function renderKBNav() {
      const nav = document.getElementById('kb-nav');
      nav.innerHTML = KB_SECTIONS.map(s => `
    <div onclick="renderKBContent('${s.id}')" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);transition:.15s;${kbActiveSection === s.id ? 'background:rgba(212,168,67,.1);border-left:3px solid var(--gold);' : 'border-left:3px solid transparent;'}">
      <div style="font-size:12px;font-weight:700;color:${kbActiveSection === s.id ? 'var(--gold)' : 'var(--text2)'}"><span style="margin-right:6px">${s.icon}</span>${s.label}</div>
    </div>
  `).join('');
    }

    function renderKBContent(sectionId) {
      kbActiveSection = sectionId;
      renderKBNav();
      const s = KB_SECTIONS.find(x => x.id === sectionId);
      if (!s) return;
      const content = document.getElementById('kb-content');
      const savedContent = KB_DATA[sectionId] !== undefined ? KB_DATA[sectionId] : (KB_DEFAULT_CONTENT[sectionId] || '');
      const wordCount = savedContent.split(/\s+/).filter(Boolean).length;

      content.innerHTML = `
    <div style="max-width:820px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="font-size:22px">${s.icon}</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--text)">${s.label}</div>
          <div style="font-size:11px;color:var(--text3)">${s.desc} · ${wordCount} palavras</div>
        </div>
        <div style="flex:1"></div>
        <button onclick="resetKBSection('${sectionId}')" style="background:transparent;border:1px solid var(--border2);color:var(--text3);padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer">↩ Resetar padrão</button>
        <button onclick="saveKBSection('${sectionId}')" style="background:var(--gold);color:#0a0a0f;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">💾 Salvar</button>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden">
        <div style="padding:6px 12px;background:var(--surface2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:10px;color:var(--text3);font-weight:700;text-transform:uppercase;letter-spacing:.5px">EDITOR — Markdown suportado</div>
          <label style="cursor:pointer;background:var(--surface);border:1px solid var(--border2);border-radius:5px;padding:3px 10px;font-size:10px;color:var(--text2);white-space:nowrap">📎 Importar .txt/.md<input type="file" accept=".txt,.md,.markdown" style="display:none" onchange="importKBFile(this,'${sectionId}')"></label>
        </div>
        <textarea id="kb-editor-${sectionId}" style="width:100%;min-height:500px;background:transparent;border:none;color:var(--text);font-family:monospace;font-size:12px;line-height:1.7;padding:16px;resize:vertical;outline:none" oninput="autoSaveKB('${sectionId}')">${savedContent}</textarea>
      </div>
      <div style="margin-top:10px;font-size:10px;color:var(--text3);text-align:right" id="kb-save-status-${sectionId}">Auto-salvo</div>
    </div>
  `;
    }

    let kbSaveTimer = null;
    function autoSaveKB(sectionId) {
      clearTimeout(kbSaveTimer);
      document.getElementById(`kb-save-status-${sectionId}`).textContent = 'Editando...';
      kbSaveTimer = setTimeout(() => { saveKBSection(sectionId, true); }, 1500);
    }
    function saveKBSection(sectionId, auto = false) {
      const ta = document.getElementById(`kb-editor-${sectionId}`);
      if (!ta) return;
      KB_DATA[sectionId] = ta.value;
      kbSave(KB_DATA);
      const status = document.getElementById(`kb-save-status-${sectionId}`);
      if (status) status.textContent = auto ? '✅ Auto-salvo' : '✅ Salvo!';
    }
    function resetKBSection(sectionId) {
      if (!confirm('Resetar para o conteúdo padrão? As alterações serão perdidas.')) return;
      KB_DATA[sectionId] = KB_DEFAULT_CONTENT[sectionId] || '';
      kbSave(KB_DATA);
      renderKBContent(sectionId);
    }

    function importKBFile(input, sectionId) {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const ta = document.getElementById('kb-editor-' + sectionId);
        if (!ta) return;
        const separator = '\n\n---\n<!-- Importado: ' + file.name + ' -->\n\n';
        ta.value = ta.value ? (ta.value + separator + e.target.result) : e.target.result;
        autoSaveKB(sectionId);
        const status = document.getElementById('kb-save-status-' + sectionId);
        if (status) status.textContent = '📎 Arquivo importado e salvo!';
      };
      reader.readAsText(file, 'utf-8');
    }
    function exportKBContext() {
      const lines = ['# KNOWLEDGE BASE — IMPÉRIO DIGITAL\n'];
      KB_SECTIONS.forEach(s => {
        const content = KB_DATA[s.id] !== undefined ? KB_DATA[s.id] : (KB_DEFAULT_CONTENT[s.id] || '');
        lines.push(`\n${'='.repeat(60)}\n## ${s.icon} ${s.label.toUpperCase()}\n${'='.repeat(60)}\n${content}`);
      });
      const text = lines.join('\n');
      navigator.clipboard.writeText(text).then(() => alert('✅ Knowledge Base copiada para a área de transferência!')).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        alert('✅ Copiado!');
      });
    }
