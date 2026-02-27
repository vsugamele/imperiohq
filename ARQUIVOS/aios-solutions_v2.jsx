import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// 1. FEEDBACK LOOPS INTER-SQUAD
// ═══════════════════════════════════════════════════════════════

const FEEDBACK_LOOPS = [
  {
    id: "mkt-vendas",
    from: "Marketing",
    to: "Vendas",
    fromColor: "#EC4899",
    toColor: "#F59E0B",
    problem: "Marketing gera leads sem saber quais convertem. Vendas recebe leads ruins sem poder filtrar na origem.",
    loops: [
      {
        name: "Lead Quality Feedback",
        trigger: "Quality Gate 1 (Lead bom?) no Sales Pipeline",
        data: "Score do lead, motivo de descarte, canal de origem, tipo de conteúdo que atraiu",
        destination: "Research Analyst (Marketing) → ajusta targeting",
        automation: "n8n: Quando SDR marca lead como 'descartado' no CRM → webhook → Supabase (tabela lead_feedback) → dashboard Marketing",
        impact: "Marketing otimiza campanhas baseado em dados reais de conversão, não em vanity metrics",
      },
      {
        name: "Win/Loss Feedback",
        trigger: "Close Deal (ganhou) ou Quality Gate 3 (perdeu) no Sales Pipeline",
        data: "Motivo de win/loss, objeções encontradas, perfil do cliente, ticket médio",
        destination: "Content Manager + Tráfego Pago (Marketing) → ajusta messaging e audiência",
        automation: "n8n: Analyst registra win/loss → extrai padrões semanais → envia briefing para Copy Squad",
        impact: "Copywriting reflete objeções reais. Tráfego foca em perfis que realmente compram",
      },
    ],
  },
  {
    id: "vendas-cs",
    from: "Vendas",
    to: "Experiência (CS)",
    fromColor: "#F59E0B",
    toColor: "#10B981",
    problem: "CS recebe cliente sem contexto. Não sabe o que foi prometido na venda, quais expectativas foram criadas.",
    loops: [
      {
        name: "Handoff Contextualizado",
        trigger: "Venda Fechada → CS Assume",
        data: "Resumo da negociação, promessas feitas, objeções vencidas, perfil do decisor, timeline acordada",
        destination: "CS Onboarding → usa contexto para personalizar Welcome + Setup",
        automation: "n8n: Closer fecha deal → auto-gera documento de handoff via AI (resume notas do CRM) → cria task no ClickUp para CS com contexto completo",
        impact: "CS não repete perguntas. Cliente sente continuidade. First Value acelera",
      },
      {
        name: "Churn Signal → Vendas",
        trigger: "Quality Gate 2 (Cliente Saudável?) = NÃO + Churn Prevention falha",
        data: "Motivo do churn, quanto tempo ficou, qual plano, NPS, tickets abertos",
        destination: "Analyst de Vendas → analisa correlação entre tipo de venda e churn",
        automation: "n8n: CS documenta churn → dados vão para Supabase → Analyst acessa dashboard de correlação venda↔churn",
        impact: "Vendas para de fechar clientes que vão churnar. Qualifica melhor.",
      },
    ],
  },
  {
    id: "cs-produto",
    from: "Experiência (CS)",
    to: "Produto",
    fromColor: "#10B981",
    toColor: "#8B5CF6",
    problem: "CS ouve reclamações e pedidos mas não tem canal estruturado para alimentar Produto. Feature requests se perdem.",
    loops: [
      {
        name: "Feature Request Pipeline",
        trigger: "CS identifica pedido recorrente (3+ clientes pedem a mesma coisa)",
        data: "Descrição do pedido, quantidade de clientes, impacto estimado, urgência",
        destination: "Product Manager → entra no Discovery como input validado",
        automation: "n8n: CS registra request em formulário padronizado → Supabase agrega por frequência → quando count ≥ 3, auto-cria task no ClickUp para PM",
        impact: "Produto prioriza baseado em demanda real, não em opinião",
      },
      {
        name: "Bug/Quality Feedback",
        trigger: "Ticket de suporte classificado como 'bug' ou 'problema de qualidade'",
        data: "Descrição, severidade, frequência, impacto no cliente, steps to reproduce",
        destination: "QA Produto → entra no Quality Check como item de verificação",
        automation: "n8n: Ticket marcado como bug → webhook → cria issue no ClickUp com template → notifica QA Produto",
        impact: "Bugs descobertos por CS alimentam QA automaticamente. Zero perda de informação",
      },
    ],
  },
  {
    id: "produto-mkt",
    from: "Produto",
    to: "Marketing",
    fromColor: "#8B5CF6",
    toColor: "#EC4899",
    problem: "Produto lança feature mas Marketing descobre tarde. Não há material pronto para comunicar.",
    loops: [
      {
        name: "Launch Notification",
        trigger: "Quality Gate 3 (Aprovado?) = SIM no Product Creation",
        data: "Nome da feature, benefícios, público-alvo, screenshots, demo link",
        destination: "Content Manager + Social Media (Marketing) → cria campanha de lançamento",
        automation: "n8n: PM marca produto como 'pronto para lançar' → auto-gera briefing via AI → cria tasks no ClickUp para Copy, Social Media, Email",
        impact: "Marketing já tem material quando produto lança. Zero delay.",
      },
    ],
  },
  {
    id: "admin-all",
    from: "Admin",
    to: "Todos os Squads",
    fromColor: "#64748b",
    toColor: "#3B82F6",
    problem: "Squads pedem coisas ao Admin (pagamentos, contratos, acessos) e não têm visibilidade do status.",
    loops: [
      {
        name: "Request Status Broadcasting",
        trigger: "Cada mudança de status no pedido Admin",
        data: "Status atual, previsão de conclusão, se precisa de ação do solicitante",
        destination: "Squad que fez o pedido → Slack/ClickUp notification",
        automation: "n8n: Mudança de status no ClickUp (Admin) → webhook → notifica canal Slack do squad solicitante",
        impact: "Squads param de perguntar 'e aí, saiu?' — visibilidade total",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// 2. OBSERVABILIDADE
// ═══════════════════════════════════════════════════════════════

const OBSERVABILITY_METRICS = [
  {
    category: "Squad Performance",
    icon: "👥",
    metrics: [
      { name: "Tasks completadas / semana", source: "ClickUp API", type: "counter", alert: "< 5 tasks/semana = alerta" },
      { name: "Tempo médio de ciclo (task criada → done)", source: "ClickUp API", type: "gauge", alert: "> 48h = investigar" },
      { name: "Taxa de retrabalho", source: "ClickUp (tasks reabiertas)", type: "percentage", alert: "> 20% = problema de qualidade" },
      { name: "Distribuição por executor (Agent/Worker/Clone/Humano)", source: "Supabase logs", type: "pie", alert: "> 60% humano = automação necessária" },
    ],
  },
  {
    category: "Quality Gates",
    icon: "🚦",
    metrics: [
      { name: "Taxa de aprovação por gate", source: "Supabase (gate_results)", type: "percentage", alert: "< 70% = spec ruim ou executor errado" },
      { name: "Tempo médio no gate", source: "Supabase timestamps", type: "gauge", alert: "> 4h = bottleneck" },
      { name: "Top 3 motivos de rejeição", source: "Supabase (rejection_reasons)", type: "ranking", alert: "Motivo repetido 5x = problema sistêmico" },
      { name: "Gates por workflow", source: "Config AIOS", type: "counter", alert: "Workflow sem gate = risco" },
    ],
  },
  {
    category: "Feedback Loops",
    icon: "🔄",
    metrics: [
      { name: "Feedbacks enviados entre squads / semana", source: "Supabase (feedback_events)", type: "counter", alert: "0 feedbacks = silos operando" },
      { name: "Tempo de resposta ao feedback", source: "Supabase timestamps", type: "gauge", alert: "> 24h = feedback ignorado" },
      { name: "Correlação lead source → conversão", source: "CRM + Supabase join", type: "funnel", alert: "Canal com 0% conversão = parar investimento" },
      { name: "Churn rate por tipo de venda", source: "Supabase (churn + deals)", type: "heatmap", alert: "Tipo com > 30% churn = mudar qualificação" },
    ],
  },
  {
    category: "Infraestrutura",
    icon: "⚙️",
    metrics: [
      { name: "Uptime dos apps (API, clawdbot, web)", source: "Railway/Vercel health", type: "percentage", alert: "< 99.5% = investigar" },
      { name: "n8n workflows executados / dia", source: "n8n API", type: "counter", alert: "0 execuções = automação quebrada" },
      { name: "Custo LLM por squad", source: "llm-router logs", type: "currency", alert: "> R$500/squad/mês = otimizar prompts" },
      { name: "Supabase rows / storage", source: "Supabase API", type: "gauge", alert: "> 80% do plano = upgrade" },
    ],
  },
];

const OBSERVABILITY_STACK = {
  storage: "Supabase (PostgreSQL) — todas as métricas ficam em tabelas dedicadas",
  collection: "n8n workflows — coletam dados de ClickUp, CRM, apps e consolidam no Supabase",
  visualization: "React SPA (web app existente no Vercel) — nova rota /dashboard",
  alerts: "n8n → Slack notifications quando thresholds são ultrapassados",
  tables: [
    { name: "squad_metrics", fields: "squad_id, date, tasks_completed, avg_cycle_time, rework_rate, executor_distribution" },
    { name: "gate_results", fields: "gate_id, workflow, result (pass/fail), reason, timestamp, squad_id" },
    { name: "feedback_events", fields: "from_squad, to_squad, type, data_json, response_time, status" },
    { name: "cost_tracking", fields: "squad_id, date, llm_tokens, llm_cost, n8n_executions, total_cost" },
    { name: "clone_performance", fields: "clone_id, tasks_executed, quality_score, avg_time, feedback_score" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// 3. SQUAD ADMIN AUTOMATION
// ═══════════════════════════════════════════════════════════════

const ADMIN_AUTOMATION = {
  currentFlow: [
    "Pedido chega (qualquer squad)",
    "Head Admin faz Triage manual",
    "Classifica: Financeiro / RH / Jurídico / Facilities / Compliance",
    "Executa task manualmente",
    "Quality Gate: precisa aprovação? → CEO aprova manual",
    "Notifica squad que pediu (manual)",
  ],
  automatedFlow: [
    {
      step: "Intake padronizado",
      how: "Formulário no ClickUp/Notion com campos obrigatórios: tipo, urgência, squad solicitante, descrição, valor (se financeiro)",
      tool: "ClickUp Form → webhook n8n",
      saves: "Elimina mensagens avulsas no Slack, WhatsApp, email",
    },
    {
      step: "Classificação automática por IA",
      how: "n8n recebe formulário → Claude classifica: categoria (Financeiro/RH/etc), urgência (P1-P4), precisa aprovação?",
      tool: "n8n → Claude API → Supabase",
      saves: "Head Admin não precisa ler e classificar cada pedido",
    },
    {
      step: "Roteamento automático",
      how: "Baseado na classificação, cria task no ClickUp na lista correta com assignee correto e SLA",
      tool: "n8n → ClickUp API",
      saves: "Pedido chega na pessoa certa em segundos, não em horas",
    },
    {
      step: "SLA tracking",
      how: "Cada categoria tem SLA: Financeiro P1=4h, P2=24h, P3=72h. n8n monitora e escala se atrasado",
      tool: "n8n cron job → verifica deadlines → Slack alert",
      saves: "Ninguém esquece pedido. Escalação automática",
    },
    {
      step: "Aprovação digital",
      how: "Se precisa aprovação CEO: n8n envia resumo no Slack com botões ✅/❌. CEO aprova sem abrir ClickUp",
      tool: "n8n → Slack interactive message → webhook de resposta",
      saves: "Aprovação em 1 clique vs login no sistema + navegar + aprovar",
    },
    {
      step: "Notificação + Fechamento",
      how: "Quando task é concluída, notifica automaticamente o squad solicitante com resumo do que foi feito",
      tool: "n8n → Slack notification no canal do squad",
      saves: "Zero follow-up manual. Squad sabe que foi resolvido",
    },
  ],
  slaTable: [
    { category: "Financeiro", p1: "4h", p2: "24h", p3: "72h", examples: "Pagamento urgente, NF bloqueada" },
    { category: "RH/People", p1: "24h", p2: "48h", p3: "1 semana", examples: "Contratação, demissão, férias" },
    { category: "Jurídico", p1: "24h", p2: "72h", p3: "2 semanas", examples: "Contrato, NDA, compliance" },
    { category: "Facilities", p1: "4h", p2: "24h", p3: "1 semana", examples: "Acesso, ferramentas, licenças" },
    { category: "Compliance", p1: "48h", p2: "1 semana", p3: "2 semanas", examples: "Auditoria, LGPD, políticas" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// 4. CLONES LIBRARY
// ═══════════════════════════════════════════════════════════════

const CLONES = [
  {
    category: "🎯 Marketing & Growth",
    clones: [
      {
        name: "Clone Alex Hormozi",
        area: "Ofertas & Copywriting",
        heuristics: [
          "Grand Slam Offer: tornar a oferta tão boa que a pessoa se sente estúpida de dizer não",
          "Value Equation: Dream Outcome × Perceived Likelihood / Time Delay × Effort & Sacrifice",
          "Naming: Problema → Resultado → Timeframe → Container (ex: '6-Week Fat Loss Challenge')",
          "Pricing: Anchor alto → desconstruir valor → fazer preço parecer ridículo",
          "Bonuses > Discounts: nunca dar desconto, sempre adicionar bônus",
          "Guarantees: condicional (se fizer X, garantimos Y) > incondicional",
          "Scarcity real: cohort-based, vagas limitadas por capacidade de entrega",
        ],
        sources: ["$100M Offers", "$100M Leads", "Gym Launch Secrets", "Acquisition.com YouTube"],
        useCases: ["Criar página de vendas", "Estruturar oferta de produto", "Definir pricing", "Escrever copy de anúncio"],
        squadTarget: "Marketing (Copy), Vendas (Proposal)",
        priority: "critical",
      },
      {
        name: "Clone Russell Brunson",
        area: "Funnels & Launch",
        heuristics: [
          "Value Ladder: free → frontend → middle → backend → continuity",
          "Hook-Story-Offer: cada peça de comunicação segue esse framework",
          "Attractive Character: herói relutante com jornada do herói",
          "Soap Opera Sequence: email sequence que prende como novela (5 emails)",
          "Webinar Perfect: Origin story → 3 segredos (crenças a quebrar) → stack → close",
          "Tripwire: oferta de baixo valor para converter lead em buyer",
          "OTO (One-Time Offer): upsell imediato pós-compra",
        ],
        sources: ["DotCom Secrets", "Expert Secrets", "Traffic Secrets", "Marketing Secrets Podcast"],
        useCases: ["Desenhar funil de vendas", "Criar sequência de emails", "Estruturar webinar", "Definir value ladder"],
        squadTarget: "Marketing (Email Strategist, Content), Vendas (Pipeline)",
        priority: "high",
      },
      {
        name: "Clone Sabri Suby",
        area: "Tráfego Pago & Copy de Anúncios",
        heuristics: [
          "Halo Strategy: criar conteúdo de valor ANTES de pedir algo",
          "Godfather Offer: oferta que o prospect não pode recusar (risk reversal extremo)",
          "AIDA on steroids: Attention (pattern interrupt) → Interest (problema específico) → Desire (resultado) → Action (urgência real)",
          "High-Converting Landing Page: headline → sub-headline → video → bullets → social proof → CTA × 3",
          "Retargeting Ladder: awareness → engagement → conversion → loyalty (budget distribuído 20/30/40/10)",
          "Dream 100: identificar 100 influenciadores/canais onde seu público já está",
        ],
        sources: ["Sell Like Crazy", "King Kong YouTube", "Agency playbooks"],
        useCases: ["Criar anúncios de alta conversão", "Otimizar landing pages", "Estruturar retargeting", "Definir budget allocation"],
        squadTarget: "Marketing (Tráfego Pago, Content Manager)",
        priority: "high",
      },
    ],
  },
  {
    category: "🏗️ Produto & Design",
    clones: [
      {
        name: "Clone Brad Frost",
        area: "Design Systems & Atomic Design",
        heuristics: [
          "Atomic Design: Atoms → Molecules → Organisms → Templates → Pages",
          "Interface Inventory: listar TODOS os componentes antes de sistematizar",
          "Pattern Lab: construir living style guide que evolui com o produto",
          "Design Tokens: cores, tipografia, espaçamento como variáveis, não valores hardcoded",
          "Component API: cada componente tem props claros, estados, e documentação de uso",
          "Consistency > Creativity: sistema > peça individual",
        ],
        sources: ["Atomic Design (livro)", "bradfrost.com", "Pattern Lab docs"],
        useCases: ["Criar design system", "Organizar componentes", "Documentar padrões", "Auditar consistência visual"],
        squadTarget: "OPS (Architect), Produto (QA)",
        priority: "medium",
      },
      {
        name: "Clone Marty Cagan",
        area: "Product Discovery & Strategy",
        heuristics: [
          "Empowered Teams: dar o problema, não a solução",
          "Opportunity Solution Tree: outcome → opportunities → solutions → experiments",
          "4 Risks: value (clientes querem?), usability (conseguem usar?), feasibility (conseguimos construir?), viability (funciona pro negócio?)",
          "Prototype Testing: testar ANTES de construir, sempre",
          "Continuous Discovery: discovery não é fase, é hábito semanal",
          "Product Trio: PM + Designer + Tech Lead decidem juntos",
        ],
        sources: ["Inspired", "Empowered", "SVPG blog", "Marty Cagan talks"],
        useCases: ["Priorizar roadmap", "Validar feature antes de construir", "Estruturar discovery", "Avaliar riscos de produto"],
        squadTarget: "Produto (Product Manager)",
        priority: "high",
      },
    ],
  },
  {
    category: "💰 Vendas & Negociação",
    clones: [
      {
        name: "Clone Chris Voss",
        area: "Negociação & Discovery Call",
        heuristics: [
          "Tactical Empathy: rotular emoções do outro ('Parece que você está frustrado com...')",
          "Mirroring: repetir últimas 1-3 palavras como pergunta",
          "Calibrated Questions: 'Como?' e 'O quê?' em vez de 'Por quê?' (não ameaça)",
          "Accusation Audit: antecipar objeções ('Você provavelmente está pensando que...')",
          "No-Oriented Questions: fazer perguntas que a resposta é 'não' ('Seria ridículo pensar que...?')",
          "Black Swan: informação que muda tudo. Sempre procurar os 3 Black Swans",
          "Late Night FM DJ Voice: tom calmo e profundo em momentos de tensão",
        ],
        sources: ["Never Split the Difference", "MasterClass Chris Voss", "Black Swan Group"],
        useCases: ["Discovery Calls", "Negociação de preço", "Lidar com objeções", "Fechar deals complexos"],
        squadTarget: "Vendas (Closer, SDR)",
        priority: "critical",
      },
      {
        name: "Clone Aaron Ross",
        area: "Outbound Sales & SDR Process",
        heuristics: [
          "Specialization: SDR ≠ Closer ≠ Account Manager. NUNCA misturar",
          "Cold Calling 2.0: email primeiro → referral interno → call agendada (nunca cold call direto)",
          "Ideal Customer Profile: definir ICP com dados, não intuição. Empresa + Persona + Trigger Events",
          "Cadence: 8-12 touches em 14 dias (mix email, LinkedIn, phone)",
          "Seeds, Nets, Spears: marketing=seeds (longo prazo), content=nets (inbound), outbound=spears (targeted)",
          "Metrics: response rate > open rate. Meetings booked > emails sent",
        ],
        sources: ["Predictable Revenue", "From Impossible to Inevitable", "Predictable Revenue podcast"],
        useCases: ["Estruturar processo de SDR", "Criar cadências de outreach", "Definir ICP", "Medir performance de outbound"],
        squadTarget: "Vendas (SDR, Head de Vendas)",
        priority: "high",
      },
    ],
  },
  {
    category: "⚙️ Operações & Processos",
    clones: [
      {
        name: "Clone Taiichi Ohno / Toyota",
        area: "Lean Operations & Continuous Improvement",
        heuristics: [
          "5 Whys: perguntar 'por quê?' 5 vezes para achar causa raiz",
          "Kanban: visualizar trabalho, limitar WIP, gerenciar flow",
          "Kaizen: melhoria contínua em pequenos incrementos diários",
          "Muda (desperdício): 7 tipos — transporte, inventário, movimento, espera, superprodução, superprocessamento, defeitos",
          "Genba: ir ao 'chão de fábrica' (ver o processo real, não o documentado)",
          "Poka-Yoke: design à prova de erros (tornar impossível fazer errado)",
          "Jidoka: parar na primeira anomalia, não empurrar defeito adiante",
        ],
        sources: ["Toyota Production System", "The Machine That Changed the World", "Lean Thinking"],
        useCases: ["Otimizar processos", "Reduzir desperdício", "Encontrar causa raiz", "Implementar Kanban"],
        squadTarget: "OPS (Process Mapper, Architect)",
        priority: "critical",
      },
      {
        name: "Clone Sam Altman (Startup Ops)",
        area: "Scaling & Operational Efficiency",
        heuristics: [
          "Do things that don't scale → then scale: manual primeiro, automatiza quando dói",
          "Focus: fazer 1 coisa extraordinariamente bem antes de diversificar",
          "Hiring: A+ players only. Um B player contamina toda equipe",
          "Metrics: North Star Metric + 3 input metrics. Tudo que não move essas 4, é distração",
          "Speed: decisões rápidas e reversíveis > decisões lentas e perfeitas",
          "Default Alive: se parar de crescer, a empresa sobrevive com o revenue atual?",
        ],
        sources: ["Startup Playbook", "How to Start a Startup (Stanford)", "Y Combinator blog"],
        useCases: ["Decidir o que automatizar vs manter manual", "Priorizar investimento", "Definir métricas do negócio", "Avaliar trade-offs"],
        squadTarget: "OPS (Head), Admin (CEO decisions)",
        priority: "medium",
      },
    ],
  },
  {
    category: "📊 Analytics & Data",
    clones: [
      {
        name: "Clone Sean Ellis",
        area: "Growth Hacking & Experimentation",
        heuristics: [
          "PMF Survey: 'quão decepcionado ficaria se não pudesse mais usar?' — >40% 'muito decepcionado' = PMF",
          "ICE Score: Impact × Confidence × Ease (priorizar experimentos)",
          "North Star Metric: 1 métrica que captura o valor core do produto para o cliente",
          "Growth Loop: ação do usuário → gera input → atrai novo usuário (viral, content, paid)",
          "Activation: identificar o 'aha moment' e acelerar todos os usuários até lá",
          "Retention > Acquisition: reter 5% a mais > adquirir 20% a mais",
        ],
        sources: ["Hacking Growth", "GrowthHackers.com", "Sean Ellis blog"],
        useCases: ["Definir North Star Metric", "Priorizar experimentos de growth", "Medir Product-Market Fit", "Otimizar ativação"],
        squadTarget: "Marketing (Analyze Metrics), Produto (PM)",
        priority: "high",
      },
    ],
  },
  {
    category: "🤝 Customer Success",
    clones: [
      {
        name: "Clone Lincoln Murphy",
        area: "Customer Success & Retention",
        heuristics: [
          "Desired Outcome = Required Outcome + Appropriate Experience",
          "Success Milestones: definir 3-5 marcos que = cliente extraindo valor real",
          "Health Score: combinar usage data + engagement + NPS + support tickets + payment history",
          "Segmentation: high-touch (enterprise) vs tech-touch (self-serve) vs low-touch (SMB)",
          "Expansion Revenue: upsell/cross-sell timing baseado em usage triggers, não em calendário",
          "Churn autopsy: SEMPRE documentar motivo real (não o que o cliente diz, mas a causa raiz)",
          "Time-to-First-Value: #1 métrica de onboarding. Quanto menor, melhor",
        ],
        sources: ["Customer Success (livro)", "sixteenventures.com", "Lincoln Murphy talks"],
        useCases: ["Estruturar onboarding", "Criar health score", "Prevenir churn", "Identificar oportunidades de upsell"],
        squadTarget: "Experiência (CS Retenção, Head CS)",
        priority: "critical",
      },
    ],
  },
];

const CLONE_TEMPLATE = {
  sections: [
    { name: "Identidade", fields: ["Nome do Clone", "Área de expertise", "Persona (tom de voz, estilo)"] },
    { name: "Heurísticas", fields: ["Lista de regras/frameworks", "Prioridade de cada regra", "Quando NÃO aplicar"] },
    { name: "Fontes", fields: ["Livros", "Vídeos/Podcasts", "Frameworks documentados", "Exemplos reais"] },
    { name: "Prompt Engineering", fields: ["System prompt base", "Few-shot examples", "Output format esperado"] },
    { name: "Quality Criteria", fields: ["Como avaliar se o output está bom", "Checklist de validação", "Red flags"] },
    { name: "Versionamento", fields: ["v1: heurísticas básicas", "v2: +exemplos reais", "v3: +feedback de uso"] },
  ],
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FeedbackLoopsView() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#0a0a18", borderRadius: 10, padding: 14, borderLeft: "4px solid #3B82F6" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>O problema central</div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
          Cada squad opera como ilha. Marketing não sabe quais leads convertem. Vendas não sabe por que clientes churnam. CS não consegue influenciar Produto. A solução é criar event-driven feedback loops automatizados via n8n + Supabase.
        </div>
      </div>

      {FEEDBACK_LOOPS.map((loop, li) => (
        <div key={li} style={{ background: "#0d0d1f", borderRadius: 12, border: `1px solid ${expanded === li ? "#3B82F644" : "#1e1e3a"}`, overflow: "hidden" }}>
          <div
            onClick={() => setExpanded(expanded === li ? null : li)}
            style={{ padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: loop.fromColor, background: `${loop.fromColor}15`, padding: "3px 10px", borderRadius: 6 }}>{loop.from}</span>
              <span style={{ color: "#475569" }}>↔</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: loop.toColor, background: `${loop.toColor}15`, padding: "3px 10px", borderRadius: 6 }}>{loop.to}</span>
            </div>
            <span style={{ color: "#475569", transition: "transform 0.2s", transform: expanded === li ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
          </div>

          {expanded === li && (
            <div style={{ padding: "0 18px 18px" }}>
              <div style={{ fontSize: 11, color: "#EF4444", marginBottom: 12, padding: "6px 10px", background: "#EF444410", borderRadius: 6 }}>
                🔴 {loop.problem}
              </div>
              {loop.loops.map((l, i) => (
                <div key={i} style={{ background: "#0a0a18", borderRadius: 10, padding: 14, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{l.name}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { label: "🎯 Trigger", value: l.trigger, color: "#F59E0B" },
                      { label: "📦 Dados", value: l.data, color: "#3B82F6" },
                      { label: "📍 Destino", value: l.destination, color: "#10B981" },
                      { label: "⚙️ Automação", value: l.automation, color: "#8B5CF6" },
                      { label: "📈 Impacto", value: l.impact, color: "#EC4899" },
                    ].map((field, fi) => (
                      <div key={fi} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: field.color, minWidth: 90, flexShrink: 0 }}>{field.label}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ObservabilityView() {
  const [showStack, setShowStack] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setShowStack(false)} style={{ padding: "8px 16px", background: !showStack ? "#1a1a35" : "#0d0d1f", border: `1px solid ${!showStack ? "#3B82F6" : "#1e1e3a"}`, borderRadius: 8, color: !showStack ? "#e2e8f0" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          📊 Métricas (16)
        </button>
        <button onClick={() => setShowStack(true)} style={{ padding: "8px 16px", background: showStack ? "#1a1a35" : "#0d0d1f", border: `1px solid ${showStack ? "#3B82F6" : "#1e1e3a"}`, borderRadius: 8, color: showStack ? "#e2e8f0" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          🏗️ Stack Técnico
        </button>
      </div>

      {!showStack ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {OBSERVABILITY_METRICS.map((cat, ci) => (
            <div key={ci}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{cat.icon} {cat.category}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {cat.metrics.map((m, mi) => (
                  <div key={mi} style={{ background: "#0d0d1f", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>
                      Fonte: <span style={{ color: "#3B82F6" }}>{m.source}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#EF4444", background: "#EF444410", padding: "2px 6px", borderRadius: 4, display: "inline-block" }}>
                      🚨 {m.alert}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "💾 Storage", value: OBSERVABILITY_STACK.storage, color: "#10B981" },
            { label: "📡 Collection", value: OBSERVABILITY_STACK.collection, color: "#3B82F6" },
            { label: "📊 Visualization", value: OBSERVABILITY_STACK.visualization, color: "#8B5CF6" },
            { label: "🔔 Alerts", value: OBSERVABILITY_STACK.alerts, color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0d0d1f", borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.value}</div>
            </div>
          ))}

          <div>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Tabelas Supabase Necessárias</div>
            {OBSERVABILITY_STACK.tables.map((t, i) => (
              <div key={i} style={{ background: "#0a0a18", borderRadius: 6, padding: "8px 12px", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>{t.name}</span>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{t.fields}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAutomationView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Before/After */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#EF444410", borderRadius: 12, padding: 16, border: "1px solid #EF444422" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 8 }}>❌ Hoje (Manual)</div>
          {ADMIN_AUTOMATION.currentFlow.map((step, i) => (
            <div key={i} style={{ fontSize: 11, color: "#94a3b8", padding: "4px 0", borderBottom: i < ADMIN_AUTOMATION.currentFlow.length - 1 ? "1px solid #1e1e3a" : "none" }}>
              {i + 1}. {step}
            </div>
          ))}
        </div>
        <div style={{ background: "#10B98110", borderRadius: 12, padding: 16, border: "1px solid #10B98122" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>✅ Automatizado</div>
          {ADMIN_AUTOMATION.automatedFlow.map((step, i) => (
            <div key={i} style={{ fontSize: 11, color: "#94a3b8", padding: "4px 0", borderBottom: i < ADMIN_AUTOMATION.automatedFlow.length - 1 ? "1px solid #1e1e3a" : "none" }}>
              {i + 1}. {step.step}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Steps */}
      <div>
        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Detalhamento da automação (6 steps n8n)</div>
        {ADMIN_AUTOMATION.automatedFlow.map((step, i) => (
          <div key={i} style={{ background: "#0d0d1f", borderRadius: 10, padding: 14, marginBottom: 6, borderLeft: "3px solid #10B981" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#10B981", background: "#10B98115", padding: "2px 8px", borderRadius: 5 }}>Step {i + 1}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{step.step}</span>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginBottom: 4 }}>{step.how}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "#3B82F6", background: "#3B82F610", padding: "2px 8px", borderRadius: 4 }}>🔧 {step.tool}</span>
              <span style={{ fontSize: 10, color: "#F59E0B", background: "#F59E0B10", padding: "2px 8px", borderRadius: 4 }}>💡 {step.saves}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SLA Table */}
      <div>
        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Tabela de SLAs por Categoria</div>
        <div style={{ background: "#0a0a18", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.6fr 0.6fr 0.6fr 1.5fr", padding: "8px 12px", background: "#111128" }}>
            {["Categoria", "P1 🔴", "P2 🟡", "P3 🟢", "Exemplos"].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {ADMIN_AUTOMATION.slaTable.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 0.6fr 0.6fr 0.6fr 1.5fr", padding: "8px 12px", borderTop: "1px solid #1e1e3a" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{row.category}</span>
              <span style={{ fontSize: 11, color: "#EF4444" }}>{row.p1}</span>
              <span style={{ fontSize: 11, color: "#F59E0B" }}>{row.p2}</span>
              <span style={{ fontSize: 11, color: "#10B981" }}>{row.p3}</span>
              <span style={{ fontSize: 10, color: "#64748b" }}>{row.examples}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClonesView() {
  const [expandedClone, setExpandedClone] = useState(null);
  const [showTemplate, setShowTemplate] = useState(false);

  const priorityStyles = {
    critical: { color: "#EF4444", label: "CRÍTICO", bg: "#EF444415" },
    high: { color: "#F59E0B", label: "ALTO", bg: "#F59E0B15" },
    medium: { color: "#3B82F6", label: "MÉDIO", bg: "#3B82F615" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setShowTemplate(false)} style={{ padding: "8px 16px", background: !showTemplate ? "#1a1a35" : "#0d0d1f", border: `1px solid ${!showTemplate ? "#8B5CF6" : "#1e1e3a"}`, borderRadius: 8, color: !showTemplate ? "#e2e8f0" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          🧬 Biblioteca de Clones (10)
        </button>
        <button onClick={() => setShowTemplate(true)} style={{ padding: "8px 16px", background: showTemplate ? "#1a1a35" : "#0d0d1f", border: `1px solid ${showTemplate ? "#8B5CF6" : "#1e1e3a"}`, borderRadius: 8, color: showTemplate ? "#e2e8f0" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          📋 Template de Clone
        </button>
      </div>

      {showTemplate ? (
        <div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 14 }}>
            Todo clone deve seguir esta estrutura para ser replicável, versionável e auditável.
          </div>
          {CLONE_TEMPLATE.sections.map((sec, i) => (
            <div key={i} style={{ background: "#0d0d1f", borderRadius: 10, padding: 14, marginBottom: 6, borderLeft: "3px solid #8B5CF6" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6", marginBottom: 6 }}>{i + 1}. {sec.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sec.fields.map((f, j) => (
                  <span key={j} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "#111128", color: "#94a3b8", border: "1px solid #1e1e3a" }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        CLONES.map((cat, ci) => (
          <div key={ci}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>{cat.category}</div>
            {cat.clones.map((clone, cli) => {
              const key = `${ci}-${cli}`;
              const isExp = expandedClone === key;
              const ps = priorityStyles[clone.priority];
              return (
                <div key={key} style={{ background: "#0d0d1f", borderRadius: 10, border: `1px solid ${isExp ? ps.color + "44" : "#1e1e3a"}`, marginBottom: 6, overflow: "hidden" }}>
                  <div
                    onClick={() => setExpandedClone(isExp ? null : key)}
                    style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{clone.name}</span>
                      <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>{clone.area}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: ps.bg, color: ps.color, fontWeight: 700 }}>{ps.label}</span>
                      <span style={{ color: "#475569", transition: "transform 0.2s", transform: isExp ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                    </div>
                  </div>
                  {isExp && (
                    <div style={{ padding: "0 16px 16px" }}>
                      <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Heurísticas ({clone.heuristics.length})</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                        {clone.heuristics.map((h, i) => (
                          <div key={i} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, paddingLeft: 10, borderLeft: "2px solid #F59E0B33" }}>{h}</div>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>📚 Fontes</div>
                          {clone.sources.map((s, i) => (
                            <div key={i} style={{ fontSize: 11, color: "#94a3b8", paddingLeft: 8 }}>{s}</div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>🎯 Casos de Uso</div>
                          {clone.useCases.map((u, i) => (
                            <div key={i} style={{ fontSize: 11, color: "#94a3b8", paddingLeft: 8 }}>{u}</div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 10, fontSize: 10, color: "#8B5CF6", background: "#8B5CF610", padding: "6px 10px", borderRadius: 6 }}>
                        🎯 Squad alvo: {clone.squadTarget}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

export default function AIOSSolutions() {
  const [activeTab, setActiveTab] = useState("feedback");

  const tabs = [
    { id: "feedback", label: "Feedback Loops", icon: "🔄", badge: "7 loops" },
    { id: "observability", label: "Observabilidade", icon: "📊", badge: "16 métricas" },
    { id: "admin", label: "Squad Admin", icon: "⚙️", badge: "6 automações" },
    { id: "clones", label: "Clones Library", icon: "🧬", badge: "10 clones" },
  ];

  return (
    <div style={{ background: "#0a0a18", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #EF4444, #F59E0B, #8B5CF6, #10B981)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              boxShadow: "0 4px 24px rgba(139,92,246,0.3)",
            }}>🔧</div>
            <div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, margin: 0,
                background: "linear-gradient(135deg, #EF4444, #F59E0B, #8B5CF6, #10B981)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>AIOS Squad — Soluções Práticas</h1>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Feedback Loops · Observabilidade · Admin Automation · Clones Library</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "9px 16px", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === t.id ? "#1a1a35" : "#0d0d1f",
                border: `1px solid ${activeTab === t.id ? "#8B5CF6" : "#1e1e3a"}`,
                borderRadius: 10, color: activeTab === t.id ? "#e2e8f0" : "#64748b",
                cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              }}
            >
              <span>{t.icon}</span> {t.label}
              <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: activeTab === t.id ? "#8B5CF620" : "#1e1e3a", color: activeTab === t.id ? "#8B5CF6" : "#475569" }}>{t.badge}</span>
            </button>
          ))}
        </div>

        <div style={{ background: "#111128", borderRadius: 14, border: "1px solid #1e1e3a", padding: 24 }}>
          {activeTab === "feedback" && <FeedbackLoopsView />}
          {activeTab === "observability" && <ObservabilityView />}
          {activeTab === "admin" && <AdminAutomationView />}
          {activeTab === "clones" && <ClonesView />}
        </div>
      </div>
    </div>
  );
}
