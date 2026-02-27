import { useState, useEffect, useCallback } from "react";

const AGENTS = [
  {
    id: "pax",
    name: "Pax",
    role: "Orchestrator",
    command: "@aios-master",
    color: "#F59E0B",
    icon: "🎯",
    desc: "Coordena todos os agentes, define prioridades e gerencia o fluxo de trabalho",
    x: 50,
    y: 8,
  },
  {
    id: "aria",
    name: "Aria",
    role: "Architect",
    command: "@architect",
    color: "#8B5CF6",
    icon: "🏗️",
    desc: "Define arquitetura, padrões de design e decisões técnicas estratégicas",
    x: 15,
    y: 35,
  },
  {
    id: "dex",
    name: "Dex",
    role: "Developer",
    command: "@dev",
    color: "#3B82F6",
    icon: "⚡",
    desc: "Implementa código, executa tasks e constrói funcionalidades",
    x: 50,
    y: 35,
  },
  {
    id: "quinn",
    name: "Quinn",
    role: "QA Engineer",
    command: "@qa",
    color: "#10B981",
    icon: "🔍",
    desc: "Testa qualidade, valida entregas e garante padrões",
    x: 85,
    y: 35,
  },
];

const WORKFLOWS = [
  {
    id: "spec",
    name: "Spec Pipeline",
    desc: "Transforma ideias vagas em especificações executáveis",
    steps: ["Requisito vago", "Análise", "Spec detalhada", "Tasks geradas"],
    color: "#8B5CF6",
  },
  {
    id: "exec",
    name: "Execution Engine",
    desc: "Executa subtasks com self-critique obrigatório",
    steps: ["Task recebida", "Implementação", "Self-critique", "Validação"],
    color: "#3B82F6",
  },
  {
    id: "qa",
    name: "QA Loop",
    desc: "Ciclo de qualidade contínuo com feedback automatizado",
    steps: ["Code review", "Testes auto", "Quality gate", "Aprovação"],
    color: "#10B981",
  },
  {
    id: "memory",
    name: "Memory Layer",
    desc: "Captura insights, padrões e decisões para contexto futuro",
    steps: ["Captura insight", "Extrai padrão", "Documenta decisão", "Atualiza mapa"],
    color: "#F59E0B",
  },
];

const SQUAD_LEVELS = [
  { level: 1, name: "LOCAL", path: "./squads/", desc: "Squads privados do seu projeto", color: "#6366F1" },
  { level: 2, name: "AIOS-SQUADS", path: "github.com/SynkraAI", desc: "Squads públicos e gratuitos", color: "#8B5CF6" },
  { level: 3, name: "SYNKRA API", path: "api.synkra.dev", desc: "Marketplace de squads premium", color: "#A855F7" },
];

const PHASES = [
  { id: "init", label: "1. Init", desc: "npx aios-core init" },
  { id: "spec", label: "2. Spec", desc: "Definir requisitos" },
  { id: "plan", label: "3. Plan", desc: "Planejar execução" },
  { id: "build", label: "4. Build", desc: "Desenvolver código" },
  { id: "qa", label: "5. QA", desc: "Testar e validar" },
  { id: "deploy", label: "6. Deploy", desc: "Entregar produto" },
];

function AgentNode({ agent, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(agent.id)}
      style={{
        position: "absolute",
        left: `${agent.x}%`,
        top: `${agent.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: isActive ? agent.color : "#1a1a2e",
          border: `2px solid ${agent.color}`,
          borderRadius: 16,
          padding: "16px 20px",
          minWidth: 140,
          textAlign: "center",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isActive ? "scale(1.08)" : "scale(1)",
          boxShadow: isActive
            ? `0 0 30px ${agent.color}44, 0 8px 32px rgba(0,0,0,0.4)`
            : "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 4 }}>{agent.icon}</div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: agent.color,
            opacity: 0.8,
            marginBottom: 4,
          }}
        >
          {agent.command}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: isActive ? "#fff" : "#e2e8f0",
            letterSpacing: "0.02em",
          }}
        >
          {agent.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: isActive ? "rgba(255,255,255,0.8)" : "#94a3b8",
            marginTop: 2,
            fontWeight: 500,
          }}
        >
          {agent.role}
        </div>
      </div>
    </div>
  );
}

function ConnectionLines({ activeAgent }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 6" refX="9" refY="3" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M0,0 L10,3 L0,6 Z" fill="#F59E0B" opacity="0.6" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Pax -> Aria */}
      <line x1="500" y1="75" x2="150" y2="195" stroke="#F59E0B" strokeWidth="1.5" opacity={activeAgent === "pax" || activeAgent === "aria" ? 0.8 : 0.2} strokeDasharray="6,4" markerEnd="url(#arrow)" filter={activeAgent === "pax" ? "url(#glow)" : ""} />
      {/* Pax -> Dex */}
      <line x1="500" y1="75" x2="500" y2="195" stroke="#F59E0B" strokeWidth="1.5" opacity={activeAgent === "pax" || activeAgent === "dex" ? 0.8 : 0.2} strokeDasharray="6,4" markerEnd="url(#arrow)" filter={activeAgent === "pax" ? "url(#glow)" : ""} />
      {/* Pax -> Quinn */}
      <line x1="500" y1="75" x2="850" y2="195" stroke="#F59E0B" strokeWidth="1.5" opacity={activeAgent === "pax" || activeAgent === "quinn" ? 0.8 : 0.2} strokeDasharray="6,4" markerEnd="url(#arrow)" filter={activeAgent === "pax" ? "url(#glow)" : ""} />
      {/* Aria -> Dex */}
      <line x1="220" y1="210" x2="430" y2="210" stroke="#8B5CF6" strokeWidth="1.2" opacity={activeAgent === "aria" || activeAgent === "dex" ? 0.6 : 0.15} strokeDasharray="4,4" />
      {/* Dex -> Quinn */}
      <line x1="570" y1="210" x2="780" y2="210" stroke="#3B82F6" strokeWidth="1.2" opacity={activeAgent === "dex" || activeAgent === "quinn" ? 0.6 : 0.15} strokeDasharray="4,4" />
      {/* Quinn -> Aria feedback */}
      <path d="M 850 240 Q 500 340 150 240" fill="none" stroke="#10B981" strokeWidth="1" opacity={activeAgent === "quinn" || activeAgent === "aria" ? 0.5 : 0.1} strokeDasharray="3,5" />
    </svg>
  );
}

function WorkflowCard({ wf, isExpanded, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#0f0f23",
        border: `1px solid ${wf.color}33`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        borderLeft: `3px solid ${wf.color}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{wf.name}</div>
        <div
          style={{
            fontSize: 10,
            color: wf.color,
            background: `${wf.color}15`,
            padding: "2px 8px",
            borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {wf.steps.length} steps
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{wf.desc}</div>
      {isExpanded && (
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {wf.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  background: wf.color,
                  color: "#fff",
                  fontSize: 9,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{step}</span>
              {i < wf.steps.length - 1 && <span style={{ color: "#334155", fontSize: 10 }}>→</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhaseTimeline({ activePhase, onPhaseClick }) {
  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "5%",
          right: "5%",
          height: 2,
          background: "linear-gradient(90deg, #8B5CF6, #3B82F6, #10B981, #F59E0B)",
          opacity: 0.3,
          transform: "translateY(-50%)",
        }}
      />
      {PHASES.map((phase, i) => (
        <div
          key={phase.id}
          onClick={() => onPhaseClick(phase.id)}
          style={{
            flex: 1,
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: activePhase === phase.id ? "#3B82F6" : "#1a1a2e",
              border: `2px solid ${activePhase === phase.id ? "#3B82F6" : "#334155"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 6px",
              fontSize: 12,
              fontWeight: 700,
              color: activePhase === phase.id ? "#fff" : "#64748b",
              transition: "all 0.3s ease",
              boxShadow: activePhase === phase.id ? "0 0 16px #3B82F644" : "none",
            }}
          >
            {i + 1}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: activePhase === phase.id ? "#e2e8f0" : "#64748b",
            }}
          >
            {phase.label.split(". ")[1]}
          </div>
          <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{phase.desc}</div>
        </div>
      ))}
    </div>
  );
}

function FileTree() {
  const tree = [
    { indent: 0, text: ".aios-core/", color: "#F59E0B" },
    { indent: 1, text: "development/", color: "#8B5CF6" },
    { indent: 2, text: "agents/", color: "#94a3b8", note: "Definições V3" },
    { indent: 2, text: "tasks/", color: "#94a3b8", note: "Tasks executáveis" },
    { indent: 2, text: "workflows/", color: "#94a3b8", note: "YAML configs" },
    { indent: 1, text: "infrastructure/", color: "#3B82F6" },
    { indent: 2, text: "scripts/", color: "#94a3b8", note: "Automações" },
    { indent: 2, text: "schemas/", color: "#94a3b8", note: "JSON schemas" },
    { indent: 1, text: "product/", color: "#10B981" },
    { indent: 2, text: "templates/", color: "#94a3b8", note: "Templates MD" },
    { indent: 2, text: "checklists/", color: "#94a3b8", note: "QA checklists" },
  ];

  return (
    <div
      style={{
        background: "#0a0a1a",
        borderRadius: 10,
        padding: "14px 16px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        lineHeight: 1.8,
      }}
    >
      {tree.map((item, i) => (
        <div key={i} style={{ paddingLeft: item.indent * 16, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: item.color }}>{item.indent < 2 ? "📁" : "📄"} {item.text}</span>
          {item.note && <span style={{ color: "#475569", fontSize: 9 }}>// {item.note}</span>}
        </div>
      ))}
    </div>
  );
}

export default function AIOSArchitecture() {
  const [activeAgent, setActiveAgent] = useState(null);
  const [expandedWf, setExpandedWf] = useState(null);
  const [activePhase, setActivePhase] = useState("init");
  const [activeTab, setActiveTab] = useState("agents");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "agents", label: "Agentes & Orquestração", icon: "🤖" },
    { id: "workflows", label: "Workflows & Pipelines", icon: "⚙️" },
    { id: "squads", label: "Squads & Extensões", icon: "👥" },
    { id: "structure", label: "Estrutura do Projeto", icon: "📂" },
  ];

  return (
    <div
      style={{
        background: "#0d0d1a",
        minHeight: "100vh",
        color: "#e2e8f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: "auto",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "28px 32px 0", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 4px 20px #8B5CF633",
            }}
          >
            ⚡
          </div>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Synkra AIOS
            </h1>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
              AI-Orchestrated System for Full Stack Development — v4.0
            </p>
          </div>
        </div>

        {/* Phase Timeline */}
        <div
          style={{
            marginTop: 24,
            background: "#111128",
            borderRadius: 14,
            padding: "18px 20px",
            border: "1px solid #1e1e3a",
          }}
        >
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            Ciclo de Desenvolvimento
          </div>
          <PhaseTimeline activePhase={activePhase} onPhaseClick={setActivePhase} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 20 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: activeTab === tab.id ? "#1a1a35" : "transparent",
                border: activeTab === tab.id ? "1px solid #2a2a4a" : "1px solid transparent",
                borderBottom: activeTab === tab.id ? "1px solid #1a1a35" : "1px solid #2a2a4a",
                borderRadius: "10px 10px 0 0",
                color: activeTab === tab.id ? "#e2e8f0" : "#64748b",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ marginRight: 6 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 32px 40px",
        }}
      >
        <div
          style={{
            background: "#1a1a35",
            border: "1px solid #2a2a4a",
            borderTop: "none",
            borderRadius: "0 0 14px 14px",
            padding: 24,
            minHeight: 380,
          }}
        >
          {/* AGENTS TAB */}
          {activeTab === "agents" && (
            <div>
              <div
                style={{
                  position: "relative",
                  height: 320,
                  background: "#111128",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <ConnectionLines activeAgent={activeAgent} />
                {AGENTS.map((agent) => (
                  <AgentNode
                    key={agent.id}
                    agent={agent}
                    isActive={activeAgent === agent.id}
                    onClick={setActiveAgent}
                  />
                ))}

                {/* Central label */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "62%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontWeight: 600,
                    }}
                  >
                    {activeAgent ? "Detalhes do Agente" : "Clique em um agente"}
                  </div>
                </div>
              </div>

              {/* Agent Detail */}
              {activeAgent && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: "#0f0f23",
                    borderRadius: 10,
                    borderLeft: `3px solid ${AGENTS.find((a) => a.id === activeAgent).color}`,
                  }}
                >
                  {(() => {
                    const agent = AGENTS.find((a) => a.id === activeAgent);
                    return (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{agent.icon}</span>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>
                              {agent.name}{" "}
                              <span style={{ color: agent.color, fontSize: 12, fontWeight: 500 }}>
                                — {agent.role}
                              </span>
                            </div>
                            <code
                              style={{
                                fontSize: 11,
                                color: agent.color,
                                background: `${agent.color}15`,
                                padding: "2px 8px",
                                borderRadius: 4,
                              }}
                            >
                              {agent.command}
                            </code>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 10, lineHeight: 1.6 }}>
                          {agent.desc}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* WORKFLOWS TAB */}
          {activeTab === "workflows" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                ADE — Autonomous Development Engine
              </div>
              {WORKFLOWS.map((wf) => (
                <WorkflowCard
                  key={wf.id}
                  wf={wf}
                  isExpanded={expandedWf === wf.id}
                  onClick={() => setExpandedWf(expandedWf === wf.id ? null : wf.id)}
                />
              ))}
              <div
                style={{
                  marginTop: 8,
                  padding: 14,
                  background: "#0a0a1a",
                  borderRadius: 10,
                  border: "1px solid #1e1e3a",
                }}
              >
                <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600, marginBottom: 6 }}>
                  💡 COMO FUNCIONA
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                  Você descreve o que quer → <strong style={{ color: "#8B5CF6" }}>Spec Pipeline</strong> transforma em spec detalhada →{" "}
                  <strong style={{ color: "#3B82F6" }}>Execution Engine</strong> implementa com self-critique →{" "}
                  <strong style={{ color: "#10B981" }}>QA Loop</strong> valida qualidade →{" "}
                  <strong style={{ color: "#F59E0B" }}>Memory Layer</strong> captura aprendizados para próximas iterações.
                </div>
              </div>
            </div>
          )}

          {/* SQUADS TAB */}
          {activeTab === "squads" && (
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Níveis de Squads — Times Modulares de Agentes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SQUAD_LEVELS.map((sq) => (
                  <div
                    key={sq.level}
                    style={{
                      background: "#0f0f23",
                      borderRadius: 12,
                      padding: 16,
                      borderLeft: `3px solid ${sq.color}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${sq.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        color: sq.color,
                        flexShrink: 0,
                      }}
                    >
                      L{sq.level}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{sq.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sq.desc}</div>
                      <code style={{ fontSize: 10, color: sq.color, opacity: 0.7 }}>{sq.path}</code>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  background: "#0a0a1a",
                  borderRadius: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#94a3b8",
                  lineHeight: 1.8,
                }}
              >
                <span style={{ color: "#64748b" }}># Comandos de Squad</span>
                <br />
                <span style={{ color: "#10B981" }}>$</span> aios squads list
                <br />
                <span style={{ color: "#10B981" }}>$</span> aios squads download etl-squad
                <br />
                <span style={{ color: "#10B981" }}>$</span> @squad-creator *create-squad meu-squad
              </div>
            </div>
          )}

          {/* STRUCTURE TAB */}
          {activeTab === "structure" && (
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Estrutura de Diretórios do Projeto
              </div>
              <FileTree />
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  background: "#0a0a1a",
                  borderRadius: 10,
                  border: "1px solid #1e1e3a",
                }}
              >
                <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600, marginBottom: 6 }}>
                  ⚙️ CONFIGURAÇÃO PRINCIPAL
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#94a3b8",
                    lineHeight: 1.8,
                  }}
                >
                  <span style={{ color: "#64748b" }}># aios.config.yaml</span>
                  <br />
                  <span style={{ color: "#8B5CF6" }}>version:</span> 4.0.0
                  <br />
                  <span style={{ color: "#8B5CF6" }}>ai:</span>
                  <br />
                  {"  "}
                  <span style={{ color: "#3B82F6" }}>provider:</span> anthropic
                  <br />
                  {"  "}
                  <span style={{ color: "#3B82F6" }}>model:</span> claude-3-opus
                  <br />
                  <span style={{ color: "#8B5CF6" }}>features:</span>
                  <br />
                  {"  "}- agents, tasks, workflows
                  <br />
                  {"  "}- squads, quality-gates
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
