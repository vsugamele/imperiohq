import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// HACKERVERSO × AIOS — INTEGRATION MAP
// ═══════════════════════════════════════════════════════════════

const INTEGRATION_OVERVIEW = {
  whatItIs: "O HackerVerso NÃO é só mais um clone dentro do AIOS. É um SQUAD completo — com seu próprio pipeline de 14 etapas, seus próprios clones especializados (copywriters clássicos), e um workflow que transforma 'nicho definido' em 'oferta validada com copy pronta'. Ele é o motor de fundação estratégica que alimenta TODOS os outros squads.",
  whereItFits: "O HackerVerso é a camada ANTERIOR ao Squad Marketing e Squad Vendas. Ele cria a fundação estratégica (avatar, posicionamento, mecanismo, oferta) que os squads de execução usam para operar.",
  analogy: "Se o AIOS é um exército, o HackerVerso é a Inteligência Militar — ele faz o reconhecimento, monta o plano de batalha, e entrega pro exército (Marketing, Vendas, CS) executar.",
};

const ARCHITECTURE_FIT = {
  before: {
    title: "ANTES: Squads sem fundação",
    problems: [
      "Squad Marketing cria campanhas sem avatar profundo → targeting genérico",
      "Squad Vendas faz proposals sem mecanismo único → comparação por preço",
      "Squad Produto cria features sem entender dor real → baixo PMF",
      "Copy Squad escreve sem estrutura → texto bonito mas que não converte",
      "Cada squad reinventa a roda do posicionamento",
    ],
  },
  after: {
    title: "DEPOIS: HackerVerso como fundação",
    solutions: [
      "HackerVerso entrega avatar com trauma + desejo interno → Marketing faz targeting cirúrgico",
      "HackerVerso entrega mecanismo nomeado → Vendas vende valor incomparável",
      "HackerVerso entrega mapa de dores reais → Produto prioriza por dor validada",
      "HackerVerso entrega stack de valor + VSL + copy → Copy Squad executa, não inventa",
      "Uma única fonte de verdade estratégica para TODOS os squads",
    ],
  },
};

const PIPELINE_STEPS = [
  {
    phase: "FUNDAÇÃO",
    phaseColor: "#EF4444",
    phaseDesc: "Quem e Onde",
    steps: [
      {
        num: "00",
        name: "Estudo Avançado do Avatar",
        clone: "Yoshitani",
        cloneArea: "Pesquisa etnográfica e jornada",
        input: "Nicho/produto/serviço definido",
        output: "Avatar rico em psicologia, jornada completa, linguagem real",
        aiosConnection: "→ Alimenta TODOS os squads como base de persona",
        executorType: "Clone",
        isPreReq: true,
      },
      {
        num: "00b",
        name: "Resumo Psicológico (Trauma)",
        clone: "Fascinations",
        cloneArea: "Camadas profundas da mente",
        input: "Output do Estudo Avançado",
        output: "Feridas emocionais, medos raiz, gatilhos, sabotadores internos",
        aiosConnection: "→ Copy Squad usa para conexão emocional profunda",
        executorType: "Clone",
        isPreReq: true,
      },
      {
        num: "01",
        name: "Multidão Faminta",
        clone: "Kennedy",
        cloneArea: "Direct response, urgência",
        input: "Avatar + Desejo Externo + Desejo Interno",
        output: "3 Avatares rankeados por Urgência/Dinheiro",
        aiosConnection: "→ Squad Marketing (targeting) + Squad Vendas (ICP)",
        executorType: "Clone",
      },
      {
        num: "02",
        name: "Descobridor de Problemas",
        clone: "Halbert",
        cloneArea: "Copy emocional, dor real",
        input: "Avatar + Desejos",
        output: "15 Problemas com score emocional, dor lógica vs emocional",
        aiosConnection: "→ Squad Produto (priorização) + CS (onboarding por dor)",
        executorType: "Clone",
      },
      {
        num: "03",
        name: "O Lago (Sub-mercado)",
        clone: "Carlton",
        cloneArea: "Análise competitiva, posicionamento",
        input: "Avatar + Desejos + Problema",
        output: "Análise de onde já gastam dinheiro, nicho sem tubarões",
        aiosConnection: "→ Squad Marketing (posicionamento) + Vendas (pitch)",
        executorType: "Clone",
      },
    ],
  },
  {
    phase: "DIFERENCIAÇÃO",
    phaseColor: "#F59E0B",
    phaseDesc: "O Que e Como",
    steps: [
      {
        num: "04",
        name: "Falhas do Concorrente",
        clone: "Carlton",
        cloneArea: "Crítica brutal, argumentação",
        input: "Avatar + Desejos + Problema + Alternativas que usam",
        output: "Crítica aos métodos atuais, munição de copy",
        aiosConnection: "→ Copy Squad (argumentação) + SDR (battle cards)",
        executorType: "Clone",
      },
      {
        num: "05",
        name: "Mecanismo Único",
        clone: "Sugarman",
        cloneArea: "Curiosidade, naming, lógica",
        input: "Tudo anterior + Por que alternativas falham",
        output: "Nome proprietário do método (Sistema X™), lógica do mecanismo",
        aiosConnection: "→ TODOS os squads (identidade da marca/produto)",
        executorType: "Clone",
      },
      {
        num: "06",
        name: "Escada de Valor",
        clone: "Hormozi",
        cloneArea: "Offers, value stacking",
        input: "Tudo + Mecanismo + Por que funciona + Como funciona",
        output: "Produtos Entry, Core e High-End com pricing",
        aiosConnection: "→ Squad Vendas (pipeline) + Marketing (funil) + Produto",
        executorType: "Clone",
      },
    ],
  },
  {
    phase: "MONETIZAÇÃO",
    phaseColor: "#8B5CF6",
    phaseDesc: "A Oferta",
    steps: [
      {
        num: "07",
        name: "Oferta Multi-Milionária",
        clone: "Hormozi",
        cloneArea: "Stack de valor, bônus estratégicos",
        input: "TUDO anterior + Sub-problemas + Passos do mecanismo",
        output: "Bônus que matam objeções, garantias, urgência/escassez",
        aiosConnection: "→ Vendas (proposal) + Marketing (página de vendas)",
        executorType: "Clone",
      },
      {
        num: "08",
        name: "Oferta Lowticket",
        clone: "Kennedy",
        cloneArea: "Tripwire, easy yes",
        input: "Avatar + Desejos + Problema",
        output: "Produto de porta de entrada (R$7-47)",
        aiosConnection: "→ Marketing (funil de entrada) + Ads (tripwire campaign)",
        executorType: "Clone",
      },
    ],
  },
  {
    phase: "CONVERSÃO",
    phaseColor: "#10B981",
    phaseDesc: "Copy & Tech",
    steps: [
      {
        num: "09",
        name: "VSL Hacker",
        clone: "Carlton",
        cloneArea: "Script de vídeo, Jon Benson/Dan Kennedy",
        input: "Toda fundação estratégica",
        output: "Script completo de 19min (8 blocos)",
        aiosConnection: "→ Content Creator + Video Worker (rooter)",
        executorType: "Clone",
      },
      {
        num: "10",
        name: "Página de Vendas",
        clone: "Kennedy",
        cloneArea: "Headlines, blocos persuasivos",
        input: "Toda fundação + oferta",
        output: "Copy completa da LP com A/B variants",
        aiosConnection: "→ Design Squad (implementar) + Web App (deploy)",
        executorType: "Clone",
      },
      {
        num: "11",
        name: "Script de Upsell",
        clone: "Makepeace",
        cloneArea: "Lógica do próximo problema",
        input: "Escada de valor + oferta core",
        output: "Script para venda pós-compra (+30-50% lucro)",
        aiosConnection: "→ Email Strategist (sequence) + Checkout (automation)",
        executorType: "Clone",
      },
      {
        num: "12",
        name: "Order Bump",
        clone: "Fascinations",
        cloneArea: "Oferta de impulso",
        input: "Produto core + sub-problemas",
        output: "Oferta de checkout bump",
        aiosConnection: "→ Checkout page + n8n (automation trigger)",
        executorType: "Clone",
      },
      {
        num: "13",
        name: "Análise Psicológica",
        clone: "Fascinations",
        cloneArea: "Gatilhos profundos",
        input: "Avatar completo + trauma",
        output: "Camadas profundas para refinar toda a copy",
        aiosConnection: "→ Quality Gate final antes de publicar",
        executorType: "Clone",
      },
    ],
  },
];

const HACKERVERSO_CLONES = [
  {
    id: "kennedy",
    name: "Dan Kennedy",
    icon: "📜",
    color: "#EF4444",
    area: "Direct Response, Urgência, Ofertas de Entrada",
    usedInSteps: ["01", "08", "10"],
    coreHeuristics: [
      "Escreva como se estivesse falando com UMA pessoa, não com uma audiência",
      "Deadline e escassez são obrigatórios — sem urgência, sem ação",
      "O lead mais valioso é o que JÁ COMPROU algo (buyer > lead)",
      "Headlines fazem 80% do trabalho. Gaste 80% do tempo nelas",
      "Teste SEMPRE: 2 headlines, 2 ofertas, 2 preços. O mercado decide",
      "Never be boring. Polarize. Seja memorável ou morra ignorado",
      "Venda o resultado, não o processo. Ninguém quer a dieta, quer o corpo",
      "O P.S. é o segundo elemento mais lido depois da headline",
    ],
    differentialFromExisting: "Hormozi foca em ESTRUTURA de oferta. Kennedy foca em URGÊNCIA e linguagem de resposta direta. São complementares — Hormozi cria o stack, Kennedy escreve o pitch.",
  },
  {
    id: "halbert",
    name: "Gary Halbert",
    icon: "✉️",
    color: "#F59E0B",
    area: "Copy Emocional, Descoberta de Dor Real",
    usedInSteps: ["02"],
    coreHeuristics: [
      "A-pile vs B-pile: seu email/copy precisa parecer pessoal, não comercial",
      "O primeiro parágrafo decide se lêem o resto. Abra com CHOQUE ou CURIOSIDADE",
      "Pesquise 10x mais do que escreve. A copy vem da PESQUISA, não da criatividade",
      "Use a linguagem EXATA do cliente. Não traduza — espelhe",
      "Dor > Prazer como motivador. Medo de perder > desejo de ganhar",
      "Conte histórias. Pessoas baixam a guarda com narrativa e levantam com argumento",
      "Uma carta (email) de 8 páginas que funciona é melhor que uma de 1 página bonita",
      "Bullet points são mini-headlines. Cada um deve criar desejo independente",
    ],
    differentialFromExisting: "Voss trabalha com negociação 1:1. Halbert trabalha com copy 1:muitos. Halbert descobre a dor PARA a copy, Voss usa a dor NA conversa.",
  },
  {
    id: "carlton",
    name: "John Carlton",
    icon: "🎯",
    color: "#3B82F6",
    area: "Análise Competitiva, VSL, Posicionamento Contraintuitivo",
    usedInSteps: ["03", "04", "09"],
    coreHeuristics: [
      "SFC (Simple Fucking Clarity): se uma criança de 10 anos não entende, reescreva",
      "O One-Legged Golfer Test: sua headline funciona tão bem quanto a famosa 'Amazing golf secret' de Carlton?",
      "Salesman's Perspective: imagine que está vendendo porta a porta. O que diria nos primeiros 5 segundos?",
      "Pesquise o mercado PRIMEIRO. Descubra o que já tentaram e FALHARAM. Aí você entra",
      "Contraintuitivo vende. 'Coma mais gordura para emagrecer' > 'Feche a boca'",
      "O VSL tem 8 blocos: Hook → Identificação → Vilão → Mecanismo → Prova → Stack → Urgência → CTA",
      "Cada bloco do VSL deve poder funcionar sozinho como mini-argumento",
      "Testemunhos específicos > genéricos ('Perdi 12kg em 47 dias' > 'Ótimo produto')",
    ],
    differentialFromExisting: "Suby foca em tráfego pago e landing pages. Carlton foca no SCRIPT e no ARGUMENTO. Carlton escreve o VSL, Suby distribui e otimiza.",
  },
  {
    id: "sugarman",
    name: "Joe Sugarman",
    icon: "🔮",
    color: "#8B5CF6",
    area: "Curiosidade, Naming, Lógica Persuasiva",
    usedInSteps: ["05"],
    coreHeuristics: [
      "Slippery Slide: cada frase existe para fazer a pessoa ler a PRÓXIMA frase",
      "Seeds of Curiosity: plante pistas do que vem a seguir para manter a leitura",
      "Simplicidade: conceitos complexos em linguagem simples. Nunca o contrário",
      "O nome do produto/método IS the marketing. Invista tempo no naming",
      "Cada produto tem uma NATUREZA. Descubra antes de nomear. (Relógio = tempo? status? segurança?)",
      "Justifique o preço com lógica, não com desconto. 'R$2.497 = R$2,77/dia por 30 meses de acesso'",
      "Storytelling com fatos específicos cria credibilidade automática",
      "Triggers emocionais > argumentos lógicos. Lógica justifica. Emoção decide",
    ],
    differentialFromExisting: "Brad Frost nomeia COMPONENTES de design system. Sugarman nomeia MECANISMOS de venda. Contextos completamente diferentes.",
  },
  {
    id: "makepeace",
    name: "Clayton Makepeace",
    icon: "💎",
    color: "#EC4899",
    area: "Upsell, Lógica do Próximo Problema",
    usedInSteps: ["11"],
    coreHeuristics: [
      "Quando o cliente resolve Problema A, automaticamente descobre Problema B. Esteja lá com a solução",
      "O upsell IMEDIATO (pós-compra) converte 15-30% se for complementar ao que acabou de comprar",
      "Não venda 'mais do mesmo'. Venda 'o próximo passo lógico'",
      "Framework: 'Agora que você tem [X], o próximo obstáculo é [Y]. E [produto B] resolve exatamente isso.'",
      "O timing é tudo: o momento de maior confiança é IMEDIATAMENTE após a compra",
      "Upsell deve ser 30-60% do preço do produto original (sweet spot)",
      "Mostre que quem comprou X SEM comprar Y teve resultado incompleto (gap selling)",
    ],
    differentialFromExisting: "Brunson tem Value Ladder (jornada completa). Makepeace foca no MOMENTO EXATO do upsell — a psicologia de 'acabei de comprar'.",
  },
  {
    id: "fascinations",
    name: "Fascinations Engine",
    icon: "🧠",
    color: "#14B8A6",
    area: "Psicologia Profunda, Gatilhos Emocionais, Impulso",
    usedInSteps: ["00b", "12", "13"],
    coreHeuristics: [
      "Fascination = frase que cria curiosidade impossível de ignorar",
      "Estrutura: '[Benefício surpreendente] que [elimina objeção/medo]'",
      "Ex: 'O alimento de R$3 que desinflama mais que anti-inflamatório de R$80'",
      "Cada fascination deve funcionar como headline independente",
      "Order bumps usam impulso: baixo preço + alta relevância + zero fricção",
      "A análise psicológica revela 3 camadas: o que dizem → o que sentem → o que temem",
      "Traumas passados definem objeções presentes. Mapeie a ferida para antecipar a objeção",
      "Gatilhos de identidade são mais fortes que gatilhos de benefício ('Seja o tipo de pessoa que...')",
    ],
    differentialFromExisting: "Murphy (CS) analisa psicologia de RETENÇÃO. Fascinations analisa psicologia de CONVERSÃO. Momentos diferentes da jornada.",
  },
  {
    id: "yoshitani",
    name: "Yoshitani Engine",
    icon: "🔬",
    color: "#6366F1",
    area: "Pesquisa Etnográfica, Jornada Profunda do Avatar",
    usedInSteps: ["00"],
    coreHeuristics: [
      "Etnografia digital: entre nos grupos, fóruns e comunidades onde o avatar VIVE",
      "Anote a linguagem EXATA — gírias, expressões, memes, reclamações em palavras dele",
      "Mapeie a jornada ANTES de você: o que ele tentou? Em que ordem? Quanto gastou?",
      "Identifique os 'Momentos de Verdade': quando ele decidiu procurar solução (trigger event)",
      "O avatar não é estático. Ele tem FASES: Inconsciente → Consciente → Pesquisando → Comparando → Comprando",
      "Para cada fase, a mensagem é diferente. Não fale de oferta pra quem está na fase 'Inconsciente'",
      "Pesquise reviews negativos de concorrentes — ali está a dor não resolvida",
      "Compile 'Swipe File' de linguagem: 50 frases reais do avatar para usar em copy",
    ],
    differentialFromExisting: "Sean Ellis valida PMF com surveys quantitativos. Yoshitani faz pesquisa QUALITATIVA profunda. São complementares: Yoshitani descobre, Ellis valida.",
  },
];

const CROSS_SQUAD_MAP = [
  {
    from: "HackerVerso",
    to: "Squad Marketing",
    what: [
      "Avatar completo (trauma + desejo interno) → Tráfego Pago usa para targeting",
      "Mecanismo nomeado → Content Manager usa como diferencial em todo conteúdo",
      "Copy de LP + VSL + Email sequence → Copy Squad executa, não inventa do zero",
      "Fascinations → Social Media usa como hooks de posts/stories",
      "Lowticket definido → Media Buyer cria funnel de tripwire",
    ],
    feedbackReturn: "Marketing retorna: métricas de conversão por avatar, qual hook performou melhor, CAC por sub-avatar → HackerVerso refina",
  },
  {
    from: "HackerVerso",
    to: "Squad Vendas",
    what: [
      "Falhas do concorrente → SDR usa como battle cards em cold outreach",
      "Mecanismo Único → Closer usa na Proposal (incomparável = sem comparação de preço)",
      "Escada de Valor → Head Vendas define pipeline por degrau da escada",
      "Stack de Valor → Proposal template com valor empilhado",
      "Script de Upsell → Closer aplica pós-venda",
    ],
    feedbackReturn: "Vendas retorna: objeções reais da call, motivos de win/loss, qual argumento fecha mais → HackerVerso ajusta mecanismo e oferta",
  },
  {
    from: "HackerVerso",
    to: "Squad Produto",
    what: [
      "15 problemas rankeados por dor emocional → PM prioriza features por dor validada",
      "Escada de Valor → Define roadmap de produtos (entry → core → premium)",
      "Mapa de sub-problemas → Cada feature resolve um sub-problema específico",
      "Avatar com jornada → UX/Design cria fluxo baseado na jornada real",
    ],
    feedbackReturn: "Produto retorna: usage data, features mais usadas, NPS por persona → HackerVerso revalida avatar e dores",
  },
  {
    from: "HackerVerso",
    to: "Squad CS/Experiência",
    what: [
      "Desejo Externo vs Interno → CS sabe o que o cliente REALMENTE espera (não só o que disse)",
      "Success Milestones → Derivados da escada de valor (cada degrau = milestone de CS)",
      "Traumas identificados → CS evita triggers negativos no onboarding",
    ],
    feedbackReturn: "CS retorna: motivos reais de churn, feedback qualitativo, feature requests → HackerVerso ajusta posicionamento",
  },
  {
    from: "HackerVerso",
    to: "Squad OPS",
    what: [
      "Pipeline de 14 etapas → OPS sistematiza como workflow replicável no AIOS",
      "Quality Gates implícitos → OPS formaliza (output de cada etapa valida entrada da próxima)",
      "Clones mapeados → OPS configura cada clone como executor no Decision Tree",
    ],
    feedbackReturn: "OPS retorna: métricas de eficiência do pipeline, bottlenecks, taxa de retrabalho → HackerVerso otimiza sequência",
  },
];

const QUALITY_GATES_HV = [
  { after: "Etapa 02", gate: "Avatar validado?", criteria: "Desejo interno identificado + trauma mapeado + linguagem real coletada", failAction: "Volta pra Etapa 00 (pesquisa mais profunda)" },
  { after: "Etapa 03", gate: "Lago encontrado?", criteria: "Sub-mercado sem competição direta + avatar gasta dinheiro lá", failAction: "Volta pra Etapa 02 (redefine problema para achar outro ângulo)" },
  { after: "Etapa 05", gate: "Mecanismo é incomparável?", criteria: "Nome proprietário + lógica contraintuitiva + 3 passos claros", failAction: "Volta pra Etapa 04 (precisa de mais falhas de concorrente para diferenciar)" },
  { after: "Etapa 07", gate: "Oferta é irresistível?", criteria: "Stack 10x+ do preço + garantia condicional + bônus matam objeções + escassez real", failAction: "Volta pra Etapa 06 (escada de valor precisa de mais degraus/componentes)" },
  { after: "Etapa 10", gate: "Copy converte?", criteria: "Micro-teste com 10 pessoas do avatar: interesse > 8/10", failAction: "Volta pra Etapa 09 (reescreve VSL/LP com feedback real)" },
];

const IMPLEMENTATION_PLAN = [
  {
    phase: 1,
    title: "Registrar HackerVerso como Squad no AIOS",
    time: "1 semana",
    tasks: [
      "Criar squad-definition para HackerVerso no ClickUp com as 14 etapas como task types",
      "Registrar os 7 clones do HackerVerso (Kennedy, Halbert, Carlton, Sugarman, Hormozi, Makepeace, Fascinations, Yoshitani) no ali-hub como sub-agentes",
      "Definir o workflow de 14 etapas com I/O mapeados no Process Mapper do OPS",
      "Configurar Quality Gates nas 5 posições definidas",
    ],
  },
  {
    phase: 2,
    title: "Construir System Prompts dos 7 Clones HackerVerso",
    time: "2 semanas",
    tasks: [
      "Criar system prompt de cada clone com heurísticas, few-shot examples e quality criteria",
      "Testar cada clone isoladamente com 3 nichos diferentes",
      "Validar que output de cada etapa funciona como input da próxima (chain test)",
      "Documentar formato de I/O para cada etapa (schema JSON)",
    ],
  },
  {
    phase: 3,
    title: "Integrar com Event Bus (cross-squad feedback)",
    time: "1 semana",
    tasks: [
      "Configurar eventos: hackerverso.avatar_validated → squad.marketing.update_targeting",
      "Configurar eventos: hackerverso.mechanism_created → squad.vendas.update_pitch",
      "Configurar eventos: hackerverso.offer_ready → squad.marketing.create_campaign",
      "Configurar feedback reverso: squad.vendas.deal_lost → hackerverso.refine_mechanism",
    ],
  },
  {
    phase: 4,
    title: "Automatizar Pipeline End-to-End",
    time: "2 semanas",
    tasks: [
      "copy-generator.js como motor central com 14 steps encadeados",
      "Cada step chama o clone correto via llm-router/ali-hub",
      "Quality Gates automáticos com scoring (passam se score > threshold)",
      "Output final consolidado: documento com avatar + posicionamento + mecanismo + oferta + copy",
      "Dashboard de observabilidade: qual etapa demora mais, onde falha mais, qual clone produz melhor output",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#0a0a18", borderRadius: 12, padding: 18, borderLeft: "4px solid #EC4899" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#EC4899", marginBottom: 6 }}>O Insight Central</div>
        <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.8 }}>{INTEGRATION_OVERVIEW.whatItIs}</div>
      </div>

      <div style={{ background: "#0a0a18", borderRadius: 12, padding: 16, borderLeft: "4px solid #8B5CF6" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 4 }}>Onde encaixa na arquitetura</div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{INTEGRATION_OVERVIEW.whereItFits}</div>
      </div>

      <div style={{ background: "#F59E0B08", borderRadius: 12, padding: 16, border: "1px solid #F59E0B22" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", marginBottom: 4 }}>💡 Analogia</div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{INTEGRATION_OVERVIEW.analogy}</div>
      </div>

      {/* Before/After */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#EF444410", borderRadius: 12, padding: 16, border: "1px solid #EF444422" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 8 }}>❌ {ARCHITECTURE_FIT.before.title}</div>
          {ARCHITECTURE_FIT.before.problems.map((p, i) => (
            <div key={i} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid #EF444433" }}>{p}</div>
          ))}
        </div>
        <div style={{ background: "#10B98110", borderRadius: 12, padding: 16, border: "1px solid #10B98122" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>✅ {ARCHITECTURE_FIT.after.title}</div>
          {ARCHITECTURE_FIT.after.solutions.map((s, i) => (
            <div key={i} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid #10B98133" }}>{s}</div>
          ))}
        </div>
      </div>

      {/* 3 Layer Position */}
      <div>
        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Posição nas 3 Camadas do AIOS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { label: "THE HUMANO", desc: "CEO define nicho/produto → dispara HackerVerso", color: "#3B82F6" },
            { label: "SQUADS — HackerVerso", desc: "14 etapas com 7 clones → gera fundação estratégica", color: "#EC4899", highlight: true },
            { label: "SQUADS — Executores", desc: "Marketing, Vendas, CS, Produto, OPS → executam com base na fundação", color: "#F59E0B" },
            { label: "SERVIÇOS", desc: "n8n, Supabase, APIs → infraestrutura que suporta tudo", color: "#10B981" },
          ].map((l, i) => (
            <div key={i} style={{
              background: l.highlight ? `${l.color}15` : "#0d0d1f",
              border: `1px solid ${l.highlight ? l.color + "44" : "#1e1e3a"}`,
              borderRadius: 10, padding: "10px 14px",
              display: "flex", gap: 12, alignItems: "center",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: l.color, minWidth: 180 }}>{l.label}</div>
              <div style={{ fontSize: 11, color: l.highlight ? "#e2e8f0" : "#94a3b8" }}>{l.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineTab() {
  const [expandedStep, setExpandedStep] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {PIPELINE_STEPS.map((phase, pi) => (
        <div key={pi}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: phase.phaseColor, background: `${phase.phaseColor}15`, padding: "4px 12px", borderRadius: 6 }}>
              {phase.phase}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>{phase.phaseDesc}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {phase.steps.map((step, si) => {
              const key = `${pi}-${si}`;
              const isExp = expandedStep === key;
              return (
                <div key={key} onClick={() => setExpandedStep(isExp ? null : key)} style={{
                  background: "#0d0d1f", borderRadius: 10,
                  border: `1px solid ${isExp ? phase.phaseColor + "44" : "#1e1e3a"}`,
                  cursor: "pointer", overflow: "hidden",
                }}>
                  <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: phase.phaseColor, fontFamily: "'JetBrains Mono', monospace", minWidth: 24 }}>{step.num}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{step.name}</span>
                      {step.isPreReq && <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 3, background: "#F59E0B20", color: "#F59E0B" }}>PRÉ-REQ</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#8B5CF610", color: "#8B5CF6" }}>🧬 {step.clone}</span>
                      <span style={{ color: "#475569", fontSize: 10, transition: "transform 0.2s", transform: isExp ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                    </div>
                  </div>

                  {isExp && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                          { label: "📥 Input", value: step.input, color: "#3B82F6" },
                          { label: "📤 Output", value: step.output, color: "#10B981" },
                          { label: "🔗 Conexão AIOS", value: step.aiosConnection, color: "#EC4899" },
                          { label: "⚙️ Executor", value: step.executorType, color: "#F59E0B" },
                        ].map((f, fi) => (
                          <div key={fi} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: f.color, minWidth: 100, flexShrink: 0 }}>{f.label}</span>
                            <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quality Gate after phase */}
          {QUALITY_GATES_HV.filter(qg => {
            const stepNums = phase.steps.map(s => s.num);
            return stepNums.some(n => qg.after.includes(n));
          }).map((qg, qi) => (
            <div key={qi} style={{ margin: "6px 0 6px 20px", background: "#F59E0B08", borderRadius: 8, padding: "8px 12px", borderLeft: "3px solid #F59E0B" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B" }}>🚦 Quality Gate — {qg.after}: {qg.gate}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Critério: {qg.criteria}</div>
              <div style={{ fontSize: 10, color: "#EF4444", marginTop: 2 }}>❌ Se falha: {qg.failAction}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ClonesTab() {
  const [selected, setSelected] = useState(0);
  const clone = HACKERVERSO_CLONES[selected];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {HACKERVERSO_CLONES.map((c, i) => (
          <div key={i} onClick={() => setSelected(i)} style={{
            background: selected === i ? "#111128" : "#0d0d1f",
            border: `1px solid ${selected === i ? c.color + "66" : "#1e1e3a"}`,
            borderRadius: 8, padding: "8px 10px", cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{c.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: selected === i ? "#e2e8f0" : "#94a3b8" }}>{c.name}</span>
            </div>
            <div style={{ fontSize: 9, color: "#475569", marginTop: 2, marginLeft: 22 }}>Steps: {c.usedInSteps.join(", ")}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#0d0d1f", borderRadius: 12, padding: 18, borderTop: `3px solid ${clone.color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>{clone.icon}</span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#e2e8f0" }}>{clone.name}</h3>
        </div>
        <div style={{ fontSize: 12, color: clone.color, marginBottom: 12 }}>{clone.area}</div>
        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Usado nas etapas: {clone.usedInSteps.map(s => `Step ${s}`).join(", ")}</div>

        <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600, textTransform: "uppercase", marginTop: 12, marginBottom: 6 }}>Heurísticas Core ({clone.coreHeuristics.length})</div>
        {clone.coreHeuristics.map((h, i) => (
          <div key={i} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${clone.color}33`, marginBottom: 3 }}>{h}</div>
        ))}

        <div style={{ marginTop: 12, padding: "8px 12px", background: "#8B5CF610", borderRadius: 6, borderLeft: "3px solid #8B5CF6" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6", marginBottom: 2 }}>🔄 Diferença dos 10 Clones Existentes</div>
          <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>{clone.differentialFromExisting}</div>
        </div>
      </div>
    </div>
  );
}

function CrossSquadTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 4 }}>
        O HackerVerso não opera isolado — ele alimenta e é alimentado por TODOS os outros squads via Event Bus.
      </div>

      {CROSS_SQUAD_MAP.map((conn, i) => (
        <div key={i} style={{ background: "#0d0d1f", borderRadius: 12, padding: 16, borderLeft: "4px solid #EC4899" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", background: "#EC489915", padding: "3px 10px", borderRadius: 6 }}>{conn.from}</span>
            <span style={{ color: "#475569" }}>→</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#3B82F6", background: "#3B82F615", padding: "3px 10px", borderRadius: 6 }}>{conn.to}</span>
          </div>

          <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, marginBottom: 4 }}>📤 O que HackerVerso entrega:</div>
          {conn.what.map((w, j) => (
            <div key={j} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, paddingLeft: 8, marginBottom: 2 }}>{w}</div>
          ))}

          <div style={{ marginTop: 8, padding: "6px 10px", background: "#F59E0B08", borderRadius: 6, borderLeft: "2px solid #F59E0B" }}>
            <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600 }}>🔄 Feedback de volta:</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{conn.feedbackReturn}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImplementTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {IMPLEMENTATION_PLAN.map((phase, i) => {
        const colors = ["#EF4444", "#F59E0B", "#8B5CF6", "#10B981"];
        return (
          <div key={i} style={{ background: "#0d0d1f", borderRadius: 12, padding: 16, borderLeft: `4px solid ${colors[i]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: colors[i], background: `${colors[i]}15`, padding: "3px 10px", borderRadius: 6 }}>FASE {phase.phase}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{phase.title}</span>
              </div>
              <span style={{ fontSize: 10, color: "#64748b", background: "#1e1e3a", padding: "3px 8px", borderRadius: 4 }}>⏱️ {phase.time}</span>
            </div>
            {phase.tasks.map((t, j) => (
              <div key={j} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${colors[i]}33`, marginBottom: 3 }}>{t}</div>
            ))}
          </div>
        );
      })}

      <div style={{ background: "#10B98110", borderRadius: 12, padding: 16, border: "1px solid #10B98122" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>📊 Resultado Final</div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
          O CEO digita o nicho → AIOS dispara HackerVerso → 14 etapas rodam com 7 clones especializados → Quality Gates validam cada fase → Output consolidado alimenta Marketing, Vendas, CS e Produto automaticamente → Feedback dos squads retroalimenta HackerVerso → Loop de melhoria contínua.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

export default function HackerVersoIntegration() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Como Encaixa", icon: "🧩" },
    { id: "pipeline", label: "Pipeline 14 Steps", icon: "🔗" },
    { id: "clones", label: "7 Clones HV", icon: "🧬" },
    { id: "crosssquad", label: "Cross-Squad", icon: "🔄" },
    { id: "implement", label: "Implementação", icon: "🚀" },
  ];

  return (
    <div style={{ background: "#0a0a18", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #EF4444, #EC4899, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>⚡</div>
            <div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, margin: 0,
                background: "linear-gradient(135deg, #EF4444, #EC4899, #8B5CF6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>HackerVerso × AIOS — Mapa de Integração</h1>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>14 etapas · 7 clones · 5 quality gates · 5 conexões cross-squad</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "9px 16px", display: "flex", alignItems: "center", gap: 6,
              background: activeTab === t.id ? "#1a1a35" : "#0d0d1f",
              border: `1px solid ${activeTab === t.id ? "#EC4899" : "#1e1e3a"}`,
              borderRadius: 10, color: activeTab === t.id ? "#e2e8f0" : "#64748b",
              cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#111128", borderRadius: 14, border: "1px solid #1e1e3a", padding: 24 }}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "pipeline" && <PipelineTab />}
          {activeTab === "clones" && <ClonesTab />}
          {activeTab === "crosssquad" && <CrossSquadTab />}
          {activeTab === "implement" && <ImplementTab />}
        </div>
      </div>
    </div>
  );
}
