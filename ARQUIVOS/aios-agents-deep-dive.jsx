import { useState, useEffect, useRef } from "react";

const AGENTS_DEEP = [
  {
    id: "pax",
    name: "Pax",
    role: "Orchestrator Master",
    command: "@aios-master",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    icon: "🎯",
    tagline: "O maestro que rege toda a orquestra",
    responsibilities: [
      "Recebe requisitos do usuário e analisa complexidade",
      "Delega tasks para agentes especializados",
      "Monitora progresso em tempo real de cada agente",
      "Resolve conflitos entre decisões de agentes",
      "Gerencia prioridades e reordena backlog",
      "Coordena handoffs entre agentes (Aria→Dex→Quinn)",
    ],
    commands: [
      { cmd: "*help", desc: "Lista todos os comandos disponíveis" },
      { cmd: "*task <n>", desc: "Executa uma task específica" },
      { cmd: "*status", desc: "Status geral do projeto" },
      { cmd: "*prioritize", desc: "Reordena backlog por prioridade" },
      { cmd: "*delegate", desc: "Delega task para agente específico" },
    ],
    interactsWith: ["aria", "dex", "quinn"],
    inputs: ["Requisitos do usuário", "Feedback de agentes", "Status do projeto"],
    outputs: ["Tasks delegadas", "Decisões de prioridade", "Relatórios de progresso"],
    decisionMatrix: [
      { condition: "Requisito novo", action: "Envia para Spec Pipeline via Aria" },
      { condition: "Bug reportado", action: "Envia direto para Dex + Quinn" },
      { condition: "Conflito de decisão", action: "Analisa trade-offs e decide" },
      { condition: "Quality gate falhou", action: "Reenvia para Dex com feedback" },
    ],
  },
  {
    id: "aria",
    name: "Aria",
    role: "Architect",
    command: "@architect",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    icon: "🏗️",
    tagline: "A mente estratégica por trás de cada decisão técnica",
    responsibilities: [
      "Define arquitetura de software e padrões de design",
      "Transforma requisitos vagos em specs executáveis (Spec Pipeline)",
      "Escolhe tecnologias, frameworks e bibliotecas",
      "Documenta ADRs (Architecture Decision Records)",
      "Mapeia dependências e riscos técnicos",
      "Revisa arquitetura quando Quinn encontra problemas",
    ],
    commands: [
      { cmd: "*spec <req>", desc: "Gera spec detalhada a partir de requisito" },
      { cmd: "*adr", desc: "Cria Architecture Decision Record" },
      { cmd: "*diagram", desc: "Gera diagrama de arquitetura" },
      { cmd: "*review-arch", desc: "Revisa decisões arquiteturais" },
      { cmd: "*risks", desc: "Analisa riscos técnicos" },
    ],
    interactsWith: ["pax", "dex"],
    inputs: ["Requisitos do Pax", "Feedback de QA", "Contexto do codebase"],
    outputs: ["Specs executáveis", "ADRs", "Diagramas", "Tasks técnicas"],
    decisionMatrix: [
      { condition: "Projeto greenfield", action: "Define stack completa + boilerplate" },
      { condition: "Projeto brownfield", action: "Analisa codebase existente + adapta" },
      { condition: "Requisito complexo", action: "Quebra em epics + subtasks" },
      { condition: "Tech debt detectado", action: "Propõe refactoring gradual" },
    ],
  },
  {
    id: "dex",
    name: "Dex",
    role: "Developer",
    command: "@dev",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
    icon: "⚡",
    tagline: "O construtor que transforma specs em código real",
    responsibilities: [
      "Implementa código seguindo specs da Aria",
      "Executa tasks com self-critique obrigatório",
      "Escreve testes unitários e de integração",
      "Faz code review automatizado (auto-review)",
      "Gerencia worktrees do Git para trabalho paralelo",
      "Resolve bugs com contexto da Memory Layer",
    ],
    commands: [
      { cmd: "*code <task>", desc: "Implementa uma task específica" },
      { cmd: "*test", desc: "Executa testes do módulo atual" },
      { cmd: "*fix <bug>", desc: "Corrige bug com análise de causa raiz" },
      { cmd: "*refactor", desc: "Refatora código mantendo testes verdes" },
      { cmd: "*commit", desc: "Commit com mensagem convencional" },
    ],
    interactsWith: ["aria", "quinn", "pax"],
    inputs: ["Specs da Aria", "Tasks do Pax", "Bug reports do Quinn"],
    outputs: ["Código implementado", "Testes escritos", "PRs abertos"],
    decisionMatrix: [
      { condition: "Task simples", action: "Implementa direto + self-critique" },
      { condition: "Task complexa", action: "Quebra em subtasks + implementa em etapas" },
      { condition: "Self-critique falha", action: "Refaz implementação automaticamente" },
      { condition: "Teste falha", action: "Debug + fix + re-run" },
    ],
  },
  {
    id: "quinn",
    name: "Quinn",
    role: "QA Engineer",
    command: "@qa",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    icon: "🔍",
    tagline: "O guardião da qualidade que nenhum bug escapa",
    responsibilities: [
      "Executa QA Loop completo em cada entrega",
      "Code review automatizado com checklist rigoroso",
      "Roda testes automatizados e analisa cobertura",
      "Valida quality gates antes de aprovação",
      "Reporta bugs com reprodução detalhada para Dex",
      "Gera relatórios de qualidade para Pax",
    ],
    commands: [
      { cmd: "*review <pr>", desc: "Review completo de PR" },
      { cmd: "*test-all", desc: "Executa suite completa de testes" },
      { cmd: "*coverage", desc: "Analisa cobertura de testes" },
      { cmd: "*gate", desc: "Verifica quality gate" },
      { cmd: "*report", desc: "Gera relatório de qualidade" },
    ],
    interactsWith: ["dex", "pax", "aria"],
    inputs: ["PRs do Dex", "Specs da Aria (para validar)", "Critérios do Pax"],
    outputs: ["Aprovações/Rejeições", "Bug reports", "Relatórios de qualidade"],
    decisionMatrix: [
      { condition: "Quality gate passa", action: "Aprova + notifica Pax" },
      { condition: "Quality gate falha", action: "Rejeita + envia feedback para Dex" },
      { condition: "Bug crítico", action: "Bloqueia deploy + escalona para Pax" },
      { condition: "Baixa cobertura", action: "Solicita testes adicionais ao Dex" },
    ],
  },
  {
    id: "morgan",
    name: "Morgan",
    role: "Product Manager",
    command: "@pm",
    color: "#EC4899",
    gradient: "linear-gradient(135deg, #EC4899, #DB2777)",
    icon: "📋",
    tagline: "A voz do produto que conecta negócio e tecnologia",
    responsibilities: [
      "Define e prioriza features no roadmap",
      "Escreve user stories e critérios de aceitação",
      "Coordena sprints e planejamento de releases",
      "Coleta e sintetiza feedback de stakeholders",
      "Mantém backlog organizado e atualizado",
      "Sincroniza roadmap público com sprint interno",
    ],
    commands: [
      { cmd: "*story <feat>", desc: "Cria user story completa" },
      { cmd: "*backlog", desc: "Lista backlog priorizado" },
      { cmd: "*sprint", desc: "Mostra sprint atual" },
      { cmd: "*roadmap", desc: "Exibe roadmap do produto" },
      { cmd: "*release", desc: "Prepara release notes" },
    ],
    interactsWith: ["pax", "aria"],
    inputs: ["Feedback de stakeholders", "Dados de uso", "Bugs e requests"],
    outputs: ["User stories", "Prioridades", "Release notes", "Roadmap"],
    decisionMatrix: [
      { condition: "Nova feature request", action: "Avalia impacto + prioriza" },
      { condition: "Sprint planning", action: "Seleciona itens por valor/esforço" },
      { condition: "Release ready", action: "Gera notes + coordena deploy" },
      { condition: "Conflito de prioridade", action: "Analisa ROI + decide com Pax" },
    ],
  },
];

const ADE_PIPELINE = [
  {
    id: "spec",
    name: "Spec Pipeline",
    icon: "📐",
    color: "#8B5CF6",
    agent: "Aria",
    steps: [
      { name: "Input", desc: "Requisito vago do usuário", icon: "💭" },
      { name: "Análise", desc: "Decomposição e entendimento", icon: "🔬" },
      { name: "Spec", desc: "Documento técnico detalhado", icon: "📄" },
      { name: "Tasks", desc: "Subtasks executáveis geradas", icon: "✅" },
    ],
  },
  {
    id: "exec",
    name: "Execution Engine",
    icon: "⚙️",
    color: "#3B82F6",
    agent: "Dex",
    steps: [
      { name: "Recebe task", desc: "Task chega com contexto completo", icon: "📥" },
      { name: "Implementa", desc: "Código escrito + testes", icon: "💻" },
      { name: "Self-critique", desc: "Auto-avaliação obrigatória", icon: "🤔" },
      { name: "Submete", desc: "PR aberto para QA", icon: "📤" },
    ],
  },
  {
    id: "qa",
    name: "QA Loop",
    icon: "✅",
    color: "#10B981",
    agent: "Quinn",
    steps: [
      { name: "Review", desc: "Code review automatizado", icon: "👁️" },
      { name: "Testes", desc: "Suite completa executada", icon: "🧪" },
      { name: "Gate", desc: "Quality gate verificado", icon: "🚦" },
      { name: "Decisão", desc: "Aprova ou rejeita", icon: "⚖️" },
    ],
  },
  {
    id: "recovery",
    name: "Recovery System",
    icon: "🔄",
    color: "#EF4444",
    agent: "Pax",
    steps: [
      { name: "Detecta falha", desc: "Erro identificado automaticamente", icon: "🚨" },
      { name: "Diagnóstico", desc: "Causa raiz analisada", icon: "🔍" },
      { name: "Rollback", desc: "Estado anterior restaurado", icon: "⏪" },
      { name: "Retry", desc: "Reexecução com correção", icon: "🔁" },
    ],
  },
  {
    id: "memory",
    name: "Memory Layer",
    icon: "🧠",
    color: "#F59E0B",
    agent: "Todos",
    steps: [
      { name: "Captura", desc: "Insights de cada sessão", icon: "📸" },
      { name: "Extração", desc: "Padrões identificados", icon: "🧬" },
      { name: "Armazena", desc: "Decisões documentadas", icon: "💾" },
      { name: "Serve", desc: "Contexto para próximas tasks", icon: "🔮" },
    ],
  },
];

const INTERACTION_FLOWS = [
  { from: "pax", to: "aria", label: "Delega requisitos", type: "command" },
  { from: "aria", to: "dex", label: "Envia specs + tasks", type: "handoff" },
  { from: "dex", to: "quinn", label: "Submete PR para review", type: "handoff" },
  { from: "quinn", to: "dex", label: "Feedback / Bug report", type: "feedback" },
  { from: "quinn", to: "pax", label: "Relatório de qualidade", type: "report" },
  { from: "quinn", to: "aria", label: "Problema arquitetural", type: "escalation" },
  { from: "pax", to: "dex", label: "Tasks diretas (hotfix)", type: "command" },
  { from: "morgan", to: "pax", label: "Prioridades e stories", type: "input" },
  { from: "pax", to: "morgan", label: "Status e progresso", type: "report" },
];

function AgentCard({ agent, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(agent.id)}
      style={{
        background: isSelected ? "#111128" : "#0d0d1f",
        border: `1.5px solid ${isSelected ? agent.color : "#1e1e3a"}`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        boxShadow: isSelected ? `0 0 24px ${agent.color}22, 0 8px 24px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: agent.gradient,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${agent.color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {agent.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{agent.name}</span>
            <span style={{ fontSize: 11, color: agent.color, fontWeight: 500 }}>{agent.role}</span>
          </div>
          <code
            style={{
              fontSize: 10,
              color: agent.color,
              background: `${agent.color}12`,
              padding: "1px 6px",
              borderRadius: 4,
              opacity: 0.8,
            }}
          >
            {agent.command}
          </code>
        </div>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isSelected ? agent.color : "#334155",
            transition: "all 0.3s ease",
            boxShadow: isSelected ? `0 0 8px ${agent.color}` : "none",
          }}
        />
      </div>
    </div>
  );
}

function AgentDetail({ agent }) {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Visão Geral" },
    { id: "commands", label: "Comandos" },
    { id: "flows", label: "I/O & Fluxos" },
    { id: "decisions", label: "Matriz de Decisão" },
  ];

  return (
    <div
      style={{
        background: "#111128",
        borderRadius: 14,
        border: `1px solid ${agent.color}33`,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: agent.gradient,
          padding: "20px 24px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            {agent.icon}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>{agent.name}</h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
              {agent.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #1e1e3a",
          background: "#0d0d1f",
        }}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              flex: 1,
              padding: "10px 8px",
              background: "transparent",
              border: "none",
              borderBottom: activeSection === s.id ? `2px solid ${agent.color}` : "2px solid transparent",
              color: activeSection === s.id ? agent.color : "#64748b",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px" }}>
        {activeSection === "overview" && (
          <div>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Responsabilidades
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {agent.responsibilities.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: `${agent.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: agent.color,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontSize: 10, color: "#64748b", width: "100%", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Interage com
              </div>
              {agent.interactsWith.map((id) => {
                const other = AGENTS_DEEP.find((a) => a.id === id);
                return (
                  <span
                    key={id}
                    style={{
                      fontSize: 11,
                      color: other.color,
                      background: `${other.color}15`,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontWeight: 600,
                    }}
                  >
                    {other.icon} {other.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === "commands" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {agent.commands.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: "#0a0a1a",
                  borderRadius: 8,
                }}
              >
                <code
                  style={{
                    fontSize: 12,
                    color: agent.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    minWidth: 130,
                    flexShrink: 0,
                  }}
                >
                  {c.cmd}
                </code>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{c.desc}</span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "flows" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                📥 Inputs (recebe de)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {agent.inputs.map((inp, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#94a3b8", paddingLeft: 12, borderLeft: "2px solid #10B98133" }}>
                    {inp}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                📤 Outputs (entrega)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {agent.outputs.map((out, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#94a3b8", paddingLeft: 12, borderLeft: "2px solid #3B82F633" }}>
                    {out}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                🔗 Interações diretas
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {INTERACTION_FLOWS.filter((f) => f.from === agent.id || f.to === agent.id).map((f, i) => {
                  const isFrom = f.from === agent.id;
                  const otherId = isFrom ? f.to : f.from;
                  const other = AGENTS_DEEP.find((a) => a.id === otherId);
                  return (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 0",
                      }}
                    >
                      <span style={{ color: isFrom ? "#3B82F6" : "#10B981", fontSize: 10 }}>
                        {isFrom ? "→" : "←"}
                      </span>
                      <span style={{ color: other?.color, fontWeight: 600, fontSize: 11 }}>
                        {other?.name}
                      </span>
                      <span style={{ color: "#475569" }}>—</span>
                      <span>{f.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === "decisions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Quando → O que faz
            </div>
            {agent.decisionMatrix.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 12px",
                  background: "#0a0a1a",
                  borderRadius: 8,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#F59E0B",
                    fontWeight: 600,
                    minWidth: 150,
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
                >
                  🔸 {d.condition}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{d.action}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineView() {
  const [expandedPipeline, setExpandedPipeline] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        ADE — Autonomous Development Engine — 5 Pipelines
      </div>
      {ADE_PIPELINE.map((pipe) => (
        <div key={pipe.id}>
          <div
            onClick={() => setExpandedPipeline(expandedPipeline === pipe.id ? null : pipe.id)}
            style={{
              background: expandedPipeline === pipe.id ? "#111128" : "#0d0d1f",
              border: `1px solid ${expandedPipeline === pipe.id ? pipe.color + "44" : "#1e1e3a"}`,
              borderRadius: expandedPipeline === pipe.id ? "12px 12px 0 0" : 12,
              padding: "14px 18px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{pipe.icon}</span>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{pipe.name}</span>
                  <span style={{ fontSize: 11, color: pipe.color, marginLeft: 8, fontWeight: 500 }}>
                    Agente: {pipe.agent}
                  </span>
                </div>
              </div>
              <span style={{ color: "#475569", fontSize: 18, transition: "transform 0.2s", transform: expandedPipeline === pipe.id ? "rotate(180deg)" : "rotate(0)" }}>
                ▾
              </span>
            </div>
          </div>
          {expandedPipeline === pipe.id && (
            <div
              style={{
                background: "#0a0a1a",
                border: `1px solid ${pipe.color}44`,
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                }}
              >
                {pipe.steps.map((step, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div
                      style={{
                        background: "#111128",
                        border: `1px solid ${pipe.color}22`,
                        borderRadius: 10,
                        padding: "14px 12px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{step.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: pipe.color, marginBottom: 4 }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{step.desc}</div>
                    </div>
                    {i < pipe.steps.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          right: -12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: pipe.color,
                          fontSize: 14,
                          zIndex: 2,
                          opacity: 0.6,
                        }}
                      >
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InteractionMap() {
  const typeColors = {
    command: "#F59E0B",
    handoff: "#3B82F6",
    feedback: "#EF4444",
    report: "#10B981",
    escalation: "#EC4899",
    input: "#8B5CF6",
  };

  const typeLabels = {
    command: "Comando",
    handoff: "Handoff",
    feedback: "Feedback",
    report: "Relatório",
    escalation: "Escalação",
    input: "Input",
  };

  return (
    <div>
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
        Mapa de Interações entre Agentes
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{typeLabels[type]}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {INTERACTION_FLOWS.map((flow, i) => {
          const from = AGENTS_DEEP.find((a) => a.id === flow.from);
          const to = AGENTS_DEEP.find((a) => a.id === flow.to);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "#0a0a1a",
                borderRadius: 8,
                borderLeft: `3px solid ${typeColors[flow.type]}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
                <span style={{ fontSize: 14 }}>{from.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: from.color }}>{from.name}</span>
              </div>
              <span style={{ color: typeColors[flow.type], fontSize: 14 }}>→</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
                <span style={{ fontSize: 14 }}>{to.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: to.color }}>{to.name}</span>
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8", flex: 1 }}>{flow.label}</span>
              <span
                style={{
                  fontSize: 9,
                  color: typeColors[flow.type],
                  background: `${typeColors[flow.type]}15`,
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {typeLabels[flow.type]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AIOSAgentsDeepDive() {
  const [selectedAgent, setSelectedAgent] = useState("pax");
  const [view, setView] = useState("agents");

  const views = [
    { id: "agents", label: "Agentes em Detalhe", icon: "🤖" },
    { id: "pipeline", label: "ADE Pipelines", icon: "⚙️" },
    { id: "interactions", label: "Mapa de Interações", icon: "🔗" },
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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
              }}
            >
              🤖
            </div>
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  margin: 0,
                  background: "linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                AIOS Agents — Deep Dive
              </h1>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                Arquitetura completa dos agentes, pipelines e interações do Synkra AIOS v4.0
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: "10px 20px",
                background: view === v.id ? "#1a1a35" : "#0d0d1f",
                border: `1px solid ${view === v.id ? "#3B82F6" : "#1e1e3a"}`,
                borderRadius: 10,
                color: view === v.id ? "#e2e8f0" : "#64748b",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ marginRight: 6 }}>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>

        {/* AGENTS VIEW */}
        {view === "agents" && (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
            {/* Agent List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AGENTS_DEEP.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent === agent.id}
                  onClick={setSelectedAgent}
                />
              ))}
            </div>

            {/* Agent Detail */}
            <div>
              {selectedAgent && <AgentDetail agent={AGENTS_DEEP.find((a) => a.id === selectedAgent)} />}
            </div>
          </div>
        )}

        {/* PIPELINE VIEW */}
        {view === "pipeline" && <PipelineView />}

        {/* INTERACTIONS VIEW */}
        {view === "interactions" && <InteractionMap />}
      </div>
    </div>
  );
}
