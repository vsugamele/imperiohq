import { useState } from "react";

// ═══════════════════════════════════════════
// DATA: STRATEGIC ANALYSIS
// ═══════════════════════════════════════════

const GAP_ANALYSIS = [
  {
    area: "Orquestração de Agentes",
    current: "Agentes com roles fixos (Pax, Aria, Dex, Quinn, Morgan)",
    ideal: "Agentes adaptáveis que aprendem com cada projeto",
    gap: "medium",
    effort: "high",
    impact: "high",
    action: "Implementar feedback loop entre Memory Layer e comportamento dos agentes",
  },
  {
    area: "Spec Pipeline",
    current: "Transforma requisitos vagos em specs via Aria",
    ideal: "Spec com validação automática de viabilidade técnica",
    gap: "small",
    effort: "medium",
    impact: "high",
    action: "Adicionar step de feasibility check antes de gerar tasks",
  },
  {
    area: "Self-Critique (Dex)",
    current: "Auto-avaliação após implementação",
    ideal: "Critique multi-dimensional (performance, segurança, manutenibilidade)",
    gap: "medium",
    effort: "medium",
    impact: "high",
    action: "Expandir checklist de self-critique com métricas objetivas",
  },
  {
    area: "Quality Gates (Quinn)",
    current: "Testes automatizados + code review",
    ideal: "Gates com benchmarks de performance e segurança",
    gap: "medium",
    effort: "medium",
    impact: "high",
    action: "Integrar SAST/DAST e benchmarks de performance nos gates",
  },
  {
    area: "Memory Layer",
    current: "Captura insights, padrões e decisões",
    ideal: "Memory que influencia ativamente decisões futuras dos agentes",
    gap: "large",
    effort: "high",
    impact: "critical",
    action: "Criar scoring system que rankeia padrões por sucesso/falha",
  },
  {
    area: "Recovery System",
    current: "Rollback básico + retry",
    ideal: "Recovery preditivo que antecipa falhas comuns",
    gap: "large",
    effort: "high",
    impact: "medium",
    action: "Alimentar recovery com dados da Memory Layer para predição",
  },
  {
    area: "Squads Marketplace",
    current: "3 níveis (Local, GitHub, API)",
    ideal: "Marketplace ativo com ratings e reviews",
    gap: "large",
    effort: "high",
    impact: "medium",
    action: "Construir infraestrutura de marketplace (auth, billing, reviews)",
  },
  {
    area: "Integração com Design",
    current: "Nenhuma integração nativa com Figma",
    ideal: "Figma MCP → Agentes geram código design-informed",
    gap: "critical",
    effort: "medium",
    impact: "high",
    action: "Configurar Figma MCP Server + criar squad de design-to-code",
  },
  {
    area: "Observabilidade",
    current: "Logs básicos e status por agente",
    ideal: "Dashboard real-time com métricas de cada agente",
    gap: "large",
    effort: "medium",
    impact: "high",
    action: "Criar dashboard de observabilidade com traces de cada pipeline",
  },
  {
    area: "Documentação Viva",
    current: "Docs estáticos em Markdown",
    ideal: "Docs que se auto-atualizam conforme projeto evolui",
    gap: "medium",
    effort: "low",
    impact: "medium",
    action: "Agente de docs que observa mudanças e atualiza automaticamente",
  },
];

const IMPROVEMENT_PRIORITIES = [
  {
    priority: 1,
    title: "Memory Layer Inteligente",
    why: "É o cérebro do sistema. Sem memória efetiva, cada projeto recomeça do zero",
    metric: "Redução de 40% em erros repetidos entre projetos",
    weeks: "3-4 semanas",
    color: "#EF4444",
  },
  {
    priority: 2,
    title: "Integração Figma MCP",
    why: "Fecha o gap design↔código. Agentes produzem código que respeita o design system",
    metric: "90% de fidelidade design-to-code vs 60% sem MCP",
    weeks: "1-2 semanas",
    color: "#F59E0B",
  },
  {
    priority: 3,
    title: "Quality Gates Expandidos",
    why: "Previne bugs antes que cheguem a produção. Economiza horas de debug",
    metric: "Cobertura de testes >80% + zero vulnerabilidades críticas",
    weeks: "2-3 semanas",
    color: "#8B5CF6",
  },
  {
    priority: 4,
    title: "Dashboard de Observabilidade",
    why: "Sem visibilidade, você não sabe onde o sistema falha ou perde tempo",
    metric: "Tempo médio de ciclo visível + bottlenecks identificados",
    weeks: "2 semanas",
    color: "#3B82F6",
  },
  {
    priority: 5,
    title: "Self-Critique Multi-dimensional",
    why: "Código que funciona ≠ código bom. Precisa avaliar performance, segurança, DX",
    metric: "Score de qualidade por dimensão em cada entrega",
    weeks: "1-2 semanas",
    color: "#10B981",
  },
];

const ROI_MATRIX = [
  { name: "Figma MCP", effort: 2, impact: 8, category: "quick-win" },
  { name: "Self-Critique+", effort: 3, impact: 7, category: "quick-win" },
  { name: "Quality Gates+", effort: 5, impact: 8, category: "strategic" },
  { name: "Observabilidade", effort: 4, impact: 7, category: "strategic" },
  { name: "Memory Layer+", effort: 8, impact: 9, category: "strategic" },
  { name: "Recovery Preditivo", effort: 7, impact: 5, category: "long-term" },
  { name: "Squads Marketplace", effort: 9, impact: 5, category: "long-term" },
  { name: "Docs Vivos", effort: 2, impact: 5, category: "quick-win" },
  { name: "Spec Feasibility", effort: 4, impact: 7, category: "strategic" },
  { name: "Agentes Adaptáveis", effort: 9, impact: 8, category: "long-term" },
];

const DECISION_QUESTIONS = [
  {
    question: "O AIOS vale a pena para meu cenário?",
    answer: "Sim, SE você trabalha com projetos full-stack recorrentes e quer padronizar qualidade. O ROI aparece a partir do 3º projeto, quando a Memory Layer começa a ter contexto suficiente.",
    verdict: "positive",
  },
  {
    question: "Devo usar AIOS vs montar meu próprio sistema de agentes?",
    answer: "AIOS já tem a orquestração pronta (Pax) e os pipelines estruturados. Montar do zero levaria 2-3 meses para chegar no mesmo nível. Use AIOS como base e customize via Squads.",
    verdict: "positive",
  },
  {
    question: "Funciona bem com Claude como provider de AI?",
    answer: "Sim, o Figma Make já usa Claude 3.7 Sonnet internamente, e o AIOS suporta Anthropic como provider nativo. A sinergia é natural.",
    verdict: "positive",
  },
  {
    question: "Quais são os riscos principais?",
    answer: "1) Memory Layer ainda é básica → risco de contexto perdido entre sessões. 2) Recovery System pode não pegar falhas silenciosas. 3) Sem observabilidade, você não sabe quando algo falha. Mitigue com as melhorias priorizadas.",
    verdict: "warning",
  },
  {
    question: "Como escalar para múltiplos projetos simultâneos?",
    answer: "Cada projeto tem seu .aios-core isolado. O ponto de atenção é compartilhar aprendizados entre projetos via Squads customizados que carregam padrões de um projeto para outro.",
    verdict: "neutral",
  },
];

// ═══════════════════════════════════════════
// DATA: FIGMA MAKE GUIDE
// ═══════════════════════════════════════════

const FIGMA_FRAMEWORK = {
  name: "TC-EBC Framework",
  desc: "Framework oficial recomendado pelo time do Figma para estruturar prompts",
  steps: [
    {
      letter: "T",
      name: "Task",
      desc: "O que você quer que o AI faça",
      example: "Crie um diagrama de arquitetura de sistema com 5 agentes AI conectados",
    },
    {
      letter: "C",
      name: "Context",
      desc: "Background e informações relevantes",
      example: "É um sistema de orquestração AI (AIOS) para desenvolvimento full-stack com agentes especializados",
    },
    {
      letter: "E",
      name: "Elements",
      desc: "Componentes visuais específicos",
      example: "Cards para cada agente com ícone, nome e role. Linhas conectoras com setas. Legenda de cores",
    },
    {
      letter: "B",
      name: "Behavior",
      desc: "Interações e estados",
      example: "Hover nos cards mostra tooltip com descrição. Clique expande detalhes. Animação de fluxo nas conexões",
    },
    {
      letter: "C",
      name: "Constraints",
      desc: "Restrições e limites",
      example: "Use dark theme (#0d0d1a background). Máximo 5 cores. Fonte mono para código. Responsivo mobile-first",
    },
  ],
};

const FIGMA_PROMPTS = [
  {
    category: "🗺️ Arquitetura do AIOS",
    prompts: [
      {
        title: "Mapa de Orquestração dos Agentes",
        prompt: `Imagine you're a senior system architect creating an interactive agent orchestration map.

TASK: Create a visual map showing 5 AI agents (Pax/Orchestrator, Aria/Architect, Dex/Developer, Quinn/QA, Morgan/PM) and their interactions.

CONTEXT: This is for Synkra AIOS, an AI-orchestrated full-stack development system. Pax sits at the top orchestrating all others. The flow goes: Morgan→Pax→Aria→Dex→Quinn with feedback loops.

ELEMENTS:
- Agent cards with icon, name, role, and primary command
- Directional connection lines between agents with labels
- Color coding: Pax=#F59E0B, Aria=#8B5CF6, Dex=#3B82F6, Quinn=#10B981, Morgan=#EC4899
- Central flow indicator showing the development cycle

BEHAVIOR: Clicking an agent highlights its connections. Hover shows description tooltip.

CONSTRAINTS: Dark theme background (#0a0a18). Use JetBrains Mono for code. Keep layout clean with generous spacing. No decorative elements.`,
        tip: "Cole este prompt inteiro no Figma Make. Depois refine com prompts menores.",
      },
      {
        title: "Pipeline ADE (Autonomous Development Engine)",
        prompt: `Create a horizontal pipeline visualization for an AI development engine with 5 stages.

TASK: Design a pipeline flow diagram showing: Spec Pipeline → Execution Engine → QA Loop → Recovery System → Memory Layer

CONTEXT: Each pipeline has 4 internal steps. This is the core engine of an AI development system.

ELEMENTS:
- 5 large pipeline blocks arranged horizontally
- Each block expandable to show 4 sub-steps
- Progress indicators between blocks
- Color per pipeline: Spec=#8B5CF6, Exec=#3B82F6, QA=#10B981, Recovery=#EF4444, Memory=#F59E0B
- Arrows showing normal flow and feedback loops (QA→Exec when tests fail)

CONSTRAINTS: Dark UI. Monospace font for technical labels. Maximum width 1200px. Mobile-friendly stacking.`,
        tip: "Use Point and Edit para ajustar espaçamentos após a geração inicial.",
      },
    ],
  },
  {
    category: "📊 Dashboards de Análise",
    prompts: [
      {
        title: "Dashboard de Observabilidade dos Agentes",
        prompt: `Act as a senior data visualization designer building a real-time monitoring dashboard.

TASK: Create a dashboard showing the health and performance of 5 AI agents in a development system.

ELEMENTS:
- Top bar: System status (green/yellow/red), active agents count, current sprint
- Agent cards row: Each agent shows status, current task, completion %, and last activity
- Center: Timeline/Gantt showing task progression across agents
- Bottom left: Quality metrics (test coverage, bug rate, code review score)
- Bottom right: Memory Layer stats (insights captured, patterns learned, decisions logged)

BEHAVIOR: Cards pulse when agent is active. Timeline auto-scrolls. Metrics update in real-time.

CONSTRAINTS: Dark theme (#0d0d1a). Data-dense but readable. Use charts (not tables) for metrics. No lorem ipsum - use realistic dev data.`,
        tip: "Após gerar, use 'Polish this design for better visual balance' para refinar.",
      },
      {
        title: "Matriz de ROI / Esforço vs Impacto",
        prompt: `Create an interactive effort vs impact matrix for prioritizing improvements.

TASK: Build a 2-axis scatter plot where X = Effort (1-10) and Y = Impact (1-10), with items plotted as labeled circles.

ELEMENTS:
- 4 quadrants labeled: Quick Wins (low effort, high impact), Strategic (high effort, high impact), Nice to Have (low effort, low impact), Avoid (high effort, low impact)
- 10 plotted items with names and color-coded by category
- Legend showing categories
- Tooltip on hover showing details

CONSTRAINTS: Dark theme. Quadrant backgrounds subtly tinted. Circle size proportional to impact. Clean sans-serif typography.`,
        tip: "Crie primeiro a estrutura, depois adicione os dados item por item.",
      },
    ],
  },
  {
    category: "🔄 Fluxos e Jornadas",
    prompts: [
      {
        title: "Fluxo Completo: Requisito → Deploy",
        prompt: `Design a vertical user journey map showing how a feature request flows through an AI development system.

TASK: Map the complete flow from "vague requirement" to "deployed feature" through 6 stages.

STAGES:
1. Input: User describes requirement in natural language
2. Spec: AI Architect analyzes and creates detailed specification
3. Plan: Orchestrator breaks into tasks and assigns to agents
4. Build: Developer agent implements with self-critique loop
5. QA: QA agent runs automated review + quality gates
6. Deploy: Approved code is merged and deployed

ELEMENTS:
- Vertical flow with numbered stages
- At each stage: agent icon, description, time estimate, artifacts produced
- Decision diamonds for QA pass/fail and self-critique pass/fail
- Feedback arrows for rejection loops
- Success/failure paths clearly differentiated

CONSTRAINTS: Dark theme. Max width 800px. Use icons not illustrations. Show time estimates per stage.`,
        tip: "Este é bom para começar e depois criar versões por tipo de projeto (greenfield vs brownfield).",
      },
      {
        title: "Ciclo de Feedback entre Agentes",
        prompt: `Create a circular flow diagram showing feedback loops between AI agents.

TASK: Visualize how 4 agents (Orchestrator, Architect, Developer, QA) exchange feedback in continuous improvement cycles.

ELEMENTS:
- 4 agent nodes arranged in a circle
- Primary flow arrows (clockwise): Orchestrator→Architect→Developer→QA→Orchestrator
- Feedback arrows (counter-clockwise, dashed): QA→Developer, QA→Architect, Developer→Architect
- Center: Memory Layer node that receives inputs from all and provides context to all
- Labels on each arrow describing what's exchanged

CONSTRAINTS: Dark theme. Animate the arrows to pulse. Memory Layer glows subtly. Color per agent consistent with brand.`,
        tip: "Use 'Make the arrows animate with a subtle pulse effect' como follow-up.",
      },
    ],
  },
  {
    category: "🎯 Para Seu Caso Específico",
    prompts: [
      {
        title: "Integração AIOS + Seus Workflows n8n",
        prompt: `Design an integration architecture diagram showing how an AI development system connects with automation workflows.

TASK: Show how AIOS agents connect with n8n automation, Supabase database, and social media platforms.

ELEMENTS:
- Left column: AIOS Agents (Orchestrator, Developer, QA)
- Center: Integration layer (n8n workflows, APIs, webhooks)
- Right column: External services (Supabase, WhatsApp/Evolution API, Telegram, Instagram)
- Data flow arrows showing what passes between each layer
- Labels for each integration point

CONTEXT: This is for a Brazilian entrepreneur building autonomous digital business systems using AI agents for content creation, social media management, and payment processing.

CONSTRAINTS: Dark theme. Portuguese labels. Include logos/icons for each service. Clean technical style.`,
        tip: "Personalize com seus serviços reais. Substitua os exemplos pelos que você usa.",
      },
    ],
  },
];

const FIGMA_TIPS = [
  {
    icon: "🎯",
    title: "Prompt inicial detalhado",
    desc: "Quanto mais contexto no primeiro prompt, menos iterações. Inclua cores, fontes, layout e comportamento de uma vez.",
  },
  {
    icon: "🔨",
    title: "Iterações pequenas",
    desc: "Após o v1, faça mudanças incrementais. 'Mude a cor do header' é melhor que 'refaça tudo com cores diferentes'.",
  },
  {
    icon: "📋",
    title: "Cole designs existentes",
    desc: "Copie frames do Figma Design e cole no prompt do Make. Ele preserva estrutura e metadados.",
  },
  {
    icon: "✏️",
    title: "Mix AI + Point and Edit",
    desc: "Use AI para gerar a base, depois Point and Edit para ajustes finos de pixel.",
  },
  {
    icon: "📚",
    title: "Crie sua Prompt Library",
    desc: "Salve prompts que funcionam bem. Reutilize e adapte para novos projetos.",
  },
  {
    icon: "🎨",
    title: "Especifique design tokens",
    desc: "Passe cores hex, fontes, espaçamentos e border-radius explicitamente para manter consistência.",
  },
  {
    icon: "🧩",
    title: "Pastas separadas no código",
    desc: "Peça para criar 'separate code folders for each element' para manter organização.",
  },
  {
    icon: "⚠️",
    title: "Cuidado com regressão",
    desc: "Após ~20 prompts, novas mudanças podem quebrar funcionalidades anteriores. Use seções específicas.",
  },
];

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════

const gapColors = {
  small: { bg: "#10B98120", text: "#10B981", label: "Pequeno" },
  medium: { bg: "#F59E0B20", text: "#F59E0B", label: "Médio" },
  large: { bg: "#EF444420", text: "#EF4444", label: "Grande" },
  critical: { bg: "#DC262620", text: "#DC2626", label: "Crítico" },
};

const effortColors = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
};

function GapAnalysisView() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 8px" }}>
        Análise de 10 áreas do AIOS comparando estado atual vs ideal, com ações concretas de melhoria.
      </p>
      {GAP_ANALYSIS.map((item, i) => {
        const gc = gapColors[item.gap];
        return (
          <div
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              background: "#0d0d1f",
              border: `1px solid ${expanded === i ? gc.text + "44" : "#1e1e3a"}`,
              borderRadius: 10,
              padding: "12px 16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{item.area}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: gc.bg, color: gc.text, fontWeight: 600 }}>
                  Gap: {gc.label}
                </span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#3B82F620", color: "#3B82F6", fontWeight: 600 }}>
                  Impacto: {item.impact}
                </span>
              </div>
            </div>
            {expanded === i && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#0a0a18", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 9, color: "#EF4444", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Atual</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{item.current}</div>
                  </div>
                  <div style={{ background: "#0a0a18", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 9, color: "#10B981", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Ideal</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{item.ideal}</div>
                  </div>
                </div>
                <div style={{ background: "#F59E0B10", borderRadius: 8, padding: 10, borderLeft: "3px solid #F59E0B" }}>
                  <div style={{ fontSize: 9, color: "#F59E0B", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>⚡ Ação Recomendada</div>
                  <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.5 }}>{item.action}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PriorityRoadmap() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
        As 5 melhorias mais importantes ordenadas por impacto no resultado final.
      </p>
      {IMPROVEMENT_PRIORITIES.map((item) => (
        <div
          key={item.priority}
          style={{
            background: "#0d0d1f",
            borderRadius: 12,
            padding: "16px 18px",
            borderLeft: `4px solid ${item.color}`,
            display: "flex",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${item.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: item.color,
              flexShrink: 0,
            }}
          >
            #{item.priority}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 8 }}>{item.why}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 6, background: "#10B98115", color: "#10B981", fontWeight: 600 }}>
                📊 {item.metric}
              </span>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 6, background: "#3B82F615", color: "#3B82F6", fontWeight: 600 }}>
                ⏱️ {item.weeks}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ROIMatrix() {
  const catColors = { "quick-win": "#10B981", strategic: "#3B82F6", "long-term": "#8B5CF6" };
  const catLabels = { "quick-win": "Quick Win", strategic: "Estratégico", "long-term": "Longo Prazo" };

  return (
    <div>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 16px" }}>
        Onde investir primeiro? Items no quadrante superior-esquerdo (alto impacto, baixo esforço) são seus quick wins.
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        {Object.entries(catColors).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{catLabels[cat]}</span>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div style={{ position: "relative", background: "#0a0a18", borderRadius: 12, padding: 20, height: 340 }}>
        {/* Grid lines */}
        <div style={{ position: "absolute", left: "50%", top: 20, bottom: 30, width: 1, background: "#1e1e3a" }} />
        <div style={{ position: "absolute", top: "50%", left: 20, right: 20, height: 1, background: "#1e1e3a" }} />

        {/* Labels */}
        <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "#10B981", fontWeight: 600, textTransform: "uppercase" }}>
          ↑ Alto Impacto
        </div>
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
          ↓ Baixo Impacto
        </div>
        <div style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 9, color: "#10B981", fontWeight: 600, textTransform: "uppercase" }}>
          ← Pouco Esforço
        </div>
        <div style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
          → Muito Esforço
        </div>

        {/* Quadrant labels */}
        <div style={{ position: "absolute", top: 28, left: 30, fontSize: 10, color: "#10B98166", fontWeight: 700 }}>⭐ QUICK WINS</div>
        <div style={{ position: "absolute", top: 28, right: 30, fontSize: 10, color: "#3B82F666", fontWeight: 700 }}>🎯 ESTRATÉGICO</div>
        <div style={{ position: "absolute", bottom: 34, left: 30, fontSize: 10, color: "#64748b44", fontWeight: 700 }}>💤 NICE TO HAVE</div>
        <div style={{ position: "absolute", bottom: 34, right: 30, fontSize: 10, color: "#EF444444", fontWeight: 700 }}>⛔ EVITAR</div>

        {/* Items */}
        {ROI_MATRIX.map((item, i) => {
          const x = 20 + (item.effort / 10) * 85;
          const y = 90 - (item.impact / 10) * 80;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: 10 + item.impact * 2,
                  height: 10 + item.impact * 2,
                  borderRadius: "50%",
                  background: catColors[item.category],
                  opacity: 0.7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 12px ${catColors[item.category]}33`,
                }}
              />
              <div style={{ fontSize: 9, color: "#e2e8f0", textAlign: "center", marginTop: 2, fontWeight: 600, whiteSpace: "nowrap" }}>
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DecisionHelper() {
  const verdictStyles = {
    positive: { bg: "#10B98115", border: "#10B981", icon: "✅" },
    warning: { bg: "#F59E0B15", border: "#F59E0B", icon: "⚠️" },
    neutral: { bg: "#3B82F615", border: "#3B82F6", icon: "ℹ️" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
        Respostas diretas para as perguntas mais importantes na sua tomada de decisão.
      </p>
      {DECISION_QUESTIONS.map((item, i) => {
        const vs = verdictStyles[item.verdict];
        return (
          <div
            key={i}
            style={{
              background: vs.bg,
              border: `1px solid ${vs.border}22`,
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{vs.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{item.question}</div>
                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FigmaGuide() {
  const [expandedPrompt, setExpandedPrompt] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Framework */}
      <div>
        <div style={{ fontSize: 10, color: "#EC4899", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
          Framework de Prompts — {FIGMA_FRAMEWORK.name}
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.5 }}>
          {FIGMA_FRAMEWORK.desc}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {FIGMA_FRAMEWORK.steps.map((step) => (
            <div key={step.letter} style={{ background: "#0d0d1f", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {step.letter}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                  {step.name} <span style={{ color: "#64748b", fontWeight: 400, fontSize: 11 }}>— {step.desc}</span>
                </div>
                <div style={{ fontSize: 11, color: "#8B5CF6", marginTop: 4, fontStyle: "italic" }}>Ex: "{step.example}"</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          8 Dicas Essenciais do Time do Figma
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {FIGMA_TIPS.map((tip, i) => (
            <div key={i} style={{ background: "#0d0d1f", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{tip.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{tip.title}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Prompts Library */}
      <div>
        <div style={{ fontSize: 10, color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          📋 Biblioteca de Prompts Prontos para o AIOS
        </div>
        {FIGMA_PROMPTS.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{cat.category}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cat.prompts.map((p, pi) => {
                const key = `${ci}-${pi}`;
                const isExp = expandedPrompt === key;
                return (
                  <div
                    key={key}
                    style={{
                      background: "#0d0d1f",
                      border: `1px solid ${isExp ? "#3B82F644" : "#1e1e3a"}`,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => setExpandedPrompt(isExp ? null : key)}
                      style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{p.title}</span>
                      <span style={{ color: "#475569", transition: "transform 0.2s", transform: isExp ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                    </div>
                    {isExp && (
                      <div style={{ padding: "0 16px 14px" }}>
                        <div
                          style={{
                            background: "#0a0a18",
                            borderRadius: 8,
                            padding: 14,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: "#cbd5e1",
                            lineHeight: 1.7,
                            whiteSpace: "pre-wrap",
                            maxHeight: 280,
                            overflow: "auto",
                          }}
                        >
                          {p.prompt}
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            padding: "8px 12px",
                            background: "#F59E0B10",
                            borderRadius: 6,
                            borderLeft: "3px solid #F59E0B",
                            fontSize: 11,
                            color: "#F59E0B",
                          }}
                        >
                          💡 {p.tip}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export default function StrategicAnalysis() {
  const [activeView, setActiveView] = useState("gaps");

  const views = [
    { id: "gaps", label: "Gap Analysis", icon: "🔍", color: "#EF4444" },
    { id: "priorities", label: "Prioridades", icon: "🎯", color: "#F59E0B" },
    { id: "roi", label: "ROI Matrix", icon: "📊", color: "#3B82F6" },
    { id: "decisions", label: "Decisões", icon: "⚖️", color: "#10B981" },
    { id: "figma", label: "Guia Figma Make", icon: "🎨", color: "#EC4899" },
  ];

  return (
    <div
      style={{
        background: "#0a0a18",
        minHeight: "100vh",
        color: "#e2e8f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #EF4444, #F59E0B, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 4px 24px rgba(239,68,68,0.25)",
              }}
            >
              🧭
            </div>
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: 0,
                  background: "linear-gradient(135deg, #EF4444, #F59E0B, #3B82F6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AIOS — Análise Estratégica & Guia Figma
              </h1>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                Tomada de decisão, gaps de melhoria, priorização e prompts para Figma Make
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                padding: "9px 16px",
                background: activeView === v.id ? "#1a1a35" : "#0d0d1f",
                border: `1px solid ${activeView === v.id ? v.color + "66" : "#1e1e3a"}`,
                borderRadius: 10,
                color: activeView === v.id ? "#e2e8f0" : "#64748b",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ marginRight: 5 }}>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            background: "#111128",
            borderRadius: 14,
            border: "1px solid #1e1e3a",
            padding: 24,
          }}
        >
          {activeView === "gaps" && <GapAnalysisView />}
          {activeView === "priorities" && <PriorityRoadmap />}
          {activeView === "roi" && <ROIMatrix />}
          {activeView === "decisions" && <DecisionHelper />}
          {activeView === "figma" && <FigmaGuide />}
        </div>
      </div>
    </div>
  );
}
