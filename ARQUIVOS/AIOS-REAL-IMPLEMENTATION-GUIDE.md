# AIOS — Guia Real de Implementação (Baseado no Repo)

> Atualizado após análise completa do repo `SynkraAI/aios-core`
> Substitui o AIOS-IMPLEMENTATION-GUIDE.md anterior que tinha suposições incorretas

---

## O QUE EU ERREI NO GUIA ANTERIOR

Minha análise dos Figma screenshots me levou a assumir coisas que o repo
CONTRADIZ. Correções:

### 1. AIOS NÃO é um web app com API
É um **framework CLI-first** que roda via Claude Code. A Constitution
(Artigo I) é explícita: "CLI é fonte da verdade. Dashboards apenas
observam, NUNCA controlam." O observability-panel.js é um painel CLI,
não uma rota React.

### 2. Squads já têm infraestrutura formal
O Synapse Engine tem 8 layers (L0-L7). O **L5 é especificamente para
Squads** — descobre squads no diretório `squads/`, lê `.synapse/manifest`
de cada um, e injeta as rules no contexto. Só que `squads/` está vazio
(apenas `.gitkeep`). A infra existe, nenhum squad de negócio foi criado ainda.

### 3. O copy-chief JÁ TEM 24 copywriters
O arquivo `.claude/agents/copy-chief.md` orquestra 24 copywriters
lendários usando sistema de Tiers:
- Tier 0: Diagnóstico (awareness + sophistication via @eugene-schwartz)
- Tier 1-3: Execução (sales-page, email-sequence, ads, headlines, etc.)
- Inclui: @dan-kennedy, @gary-halbert, @jon-benson, @todd-brown, @jeff-walker
- Inclui tasks PLF (Product Launch Formula) completas
Isso É o HackerVerso parcialmente implementado.

### 4. O clone-mind skill JÁ EXISTE
DNA Mental™ Pipeline de 9 camadas para clonagem cognitiva. Subagentes:
@victoria-viability-specialist, @research-specialist, @daniel-behavioral-analyst.
Esse é o PROCESSO de criar clones. Já funciona.

### 5. O Event Bus é diferente
Já existe `dashboard-emitter.js` que emite eventos para um monitor-server
(HTTP POST localhost:4001). Os event types são focados em CLI:
AgentActivated, CommandStart, StoryStatusChange, BobPhaseChange, etc.
NÃO são eventos de negócio (deal_won, lead_generated, etc.).

### 6. Quality Gates já existem (3 layers)
- Layer 1: Pre-commit (lint, test, typecheck)
- Layer 2: PR Automation (CodeRabbit + Quinn/@qa)
- Layer 3: Human Review (signoff com checklist)
Config completa em `quality-gate-config.yaml`.

### 7. O Executor Assignment já existe
`executor-assignment.js` faz match determinístico por keywords:
- code_general → @dev (gate: @architect)
- database → @data-engineer (gate: @dev)
- infrastructure → @devops
- etc.

---

## O QUE O REPO REALMENTE TEM

```
aios-core/
├── .aios-core/
│   ├── constitution.md          ← Princípios inegociáveis (CLI First, etc.)
│   ├── core/
│   │   ├── events/              ← Dashboard event system (emitter + types)
│   │   ├── execution/           ← SubagentDispatcher, parallel-executor
│   │   ├── orchestration/       ← MasterOrchestrator, executor-assignment, skill-dispatcher
│   │   ├── quality-gates/       ← 3-layer quality gate system
│   │   ├── registry/            ← Service registry (203 workers catalogados)
│   │   ├── synapse/             ← 8-layer context engine (L0-L7, L5=squads)
│   │   └── ui/                  ← Observability panel (CLI, não web)
│   ├── development/
│   │   ├── agents/              ← 12 agent definitions (dev, qa, architect, pm, etc.)
│   │   ├── scripts/squad/       ← Squad loader, generator, validator, publisher
│   │   └── tasks/               ← 115+ executable task workflows
│   └── data/                    ← Knowledge base, entity registry
├── .claude/
│   ├── agents/                  ← Business agents (copy-chief, squad, pedro-valerio, etc.)
│   ├── commands/
│   │   ├── AIOS/agents/         ← Core agent commands
│   │   ├── Copy/                ← (referenciado pelo copy-chief)
│   │   ├── mmos-squad/          ← Mind Mapping squad
│   │   └── synapse/             ← Synapse management commands
│   └── skills/
│       ├── clone-mind.md        ← DNA Mental™ 9-layer pipeline
│       ├── squad.md             ← Squad creation orchestrator
│       └── synapse/             ← Synapse skill
├── squads/                      ← VAZIO (.gitkeep) — nenhum squad instalado
└── .synapse/                    ← Active agent manifests + session state
```

### Agents de Negócio Existentes (em .claude/agents/)

| Agent | O que faz |
|-------|-----------|
| `copy-chief` | Orquestra 24 copywriters, Tier system, tasks PLF |
| `squad` | Cria squads, clone minds, subagentes (oalanicolas, pedro-valerio, sop-extractor) |
| `pedro-valerio` | Process Absolutist — valida workflows para zero wrong paths |
| `oalanicolas` | Mind cloning architect — Voice DNA + Thinking DNA |
| `sop-extractor` | Extrai SOPs de conteúdo/entrevistas |
| `traffic-masters-chief` | (existe referência, não analisei conteúdo) |
| `design-chief` | (existe referência, não analisei conteúdo) |
| `data-chief` | (existe referência, não analisei conteúdo) |
| `cyber-chief` | (existe referência, não analisei conteúdo) |
| `legal-chief` | (existe referência, não analisei conteúdo) |
| `story-chief` | (existe referência, não analisei conteúdo) |
| `tools-orchestrator` | (existe referência, não analisei conteúdo) |

---

## O QUE REALMENTE PRECISA SER FEITO

Agora que entendo a arquitetura real, os gaps se reduzem drasticamente:

### GAP 1: Criar o Squad HackerVerso (no diretório squads/)

**Status:** A infraestrutura existe (squad-generator, L5 layer, squad.md skill).
O que falta é EXECUTAR a criação.

**Como fazer:**
```bash
# O AIOS já tem o comando:
# Ativar o @squad-creator agent
# Executar *create-squad hackerverso
```

Isso gera a estrutura:
```
squads/hackerverso/
├── .synapse/manifest      ← Domain rules pro Synapse L5
├── config/                ← Configuração do squad
├── agents/                ← Os 7 clones HV (kennedy, halbert, etc.)
├── tasks/                 ← As 14 etapas como tasks executáveis
├── workflows/             ← Pipeline de 14 steps como workflow YAML
├── checklists/            ← Quality gates por fase
├── data/                  ← Knowledge base (frameworks, heurísticas)
└── scripts/               ← Utilitários (copy-generator.js aqui)
```

**Material que temos pronto pra alimentar:**
- Pipeline de 14 etapas com I/O mapeado ✅
- 7 clones com heurísticas core ✅
- 5 Quality Gates com critérios ✅
- Cross-squad event map ✅
- Formato de agents: seguir o padrão de `.claude/agents/copy-chief.md`

**O que falta criar:**
- Prompts completos dos 7 clones HV no formato do AIOS (YAML frontmatter + persona + commands)
- O workflow YAML das 14 etapas
- O `.synapse/manifest` do squad

### GAP 2: Integrar HackerVerso com copy-chief existente

**O que descobri:** O `copy-chief` já tem 24 copywriters com tasks PLF.
Isso se SOBREPÕE com o HackerVerso (que tem Kennedy, Halbert, Carlton, etc.).

**Decisão necessária (Vinicius):**

Opção A — **HackerVerso substitui copy-chief**
O HackerVerso absorve os 24 copywriters do copy-chief e adiciona os layers
estratégicos (avatar, lago, mecanismo). O copy-chief vira sub-squad do HV.

Opção B — **HackerVerso complementa copy-chief**
HackerVerso faz Fases 1-3 (fundação estratégica: avatar, problemas, lago,
falhas, mecanismo, escada). Depois ENTREGA o output pro copy-chief, que
executa Fases 4-5 (copy e conversão) com seus 24 copywriters.

Opção C — **Merge seletivo**
Os clones que já existem no copy-chief (Kennedy, Halbert, etc.) mantêm-se
lá. HackerVerso foca nos layers estratégicos que o copy-chief NÃO tem
(avatar profundo, lago, mecanismo único) e chama o copy-chief como executor.

> Minha recomendação: **Opção C.** O copy-chief já está funcional com
> 24 copywriters e tasks PLF. Não faz sentido duplicar. O HackerVerso
> entra como a camada de ESTRATÉGIA que alimenta o copy-chief com
> fundação (avatar + posicionamento + mecanismo + oferta). Copy-chief
> continua fazendo o que já faz: EXECUTAR copy.

### GAP 3: System Prompts dos Clones no Formato AIOS

**O que descobri:** O formato de agents no AIOS é específico:
- YAML frontmatter (name, description, model, tools, permissionMode, memory)
- Persona definition com activation-instructions
- Command routing (missions)
- Quality gates por output type

**O que já temos:** 10 system prompts completos (Hormozi, Voss, Ohno, Murphy,
Brunson, Suby, Cagan, Ross, Frost, Ellis) + 7 clones HV com heurísticas.

**O que falta:** Converter os prompts que criamos pro formato AIOS:
```yaml
---
name: hormozi-clone
description: |
  Clone cognitivo de Alex Hormozi. Grand Slam Offers, Value Stacking, 
  Pricing Psychology. Para Marketing Copy e Vendas Proposal.
model: opus
tools:
  - Read
  - Write
  - WebSearch
permissionMode: acceptEdits
memory: project
---

# @hormozi-clone - Value Architect

## Persona Loading
[system prompt que já escrevemos]

## Mission Router
| Mission | Action |
|---------|--------|
| `create-offer` | Grand Slam Offer com Value Stack |
| `price-strategy` | Pricing com anchor + odd numbers |
| `guarantee` | Conditional guarantee design |
| `bonus-stack` | Bônus que matam objeções |

## Quality Gate
[quality criteria que já definimos]
```

Preciso converter os 10+7 prompts pra esse formato. É trabalho de formatação,
não de criação — o conteúdo está pronto.

### GAP 4: Workflow YAML do HackerVerso Pipeline

**O que descobri:** O AIOS usa workflows em YAML (referenciados em
`squads/squad-creator/workflows/`). O master-orchestrator executa
epics sequencialmente.

**O que precisa:** Converter as 14 etapas do HackerVerso em workflow YAML:
```yaml
# squads/hackerverso/workflows/wf-foundation-pipeline.yaml
name: HackerVerso Foundation Pipeline
version: 1.0.0
description: 14-step strategic foundation pipeline
triggers:
  - command: "*run-pipeline"
  - command: "*create-foundation"

steps:
  - id: step-00
    name: Estudo Avançado do Avatar
    agent: "@yoshitani"
    task: "tasks/00-avatar-study.md"
    input:
      required: [niche, product_description]
    output:
      schema: "schemas/avatar-output.json"
    quality_gate:
      checklist: "checklists/avatar-validation.md"

  - id: step-00b
    name: Resumo Psicológico (Trauma)
    agent: "@fascinations"
    task: "tasks/00b-trauma-analysis.md"
    depends_on: [step-00]
    # ... etc
```

### GAP 5: Eventos de Negócio no Event System

**O que existe:** `dashboard-emitter.js` emite eventos CLI para monitor-server.
**O que falta:** Eventos de negócio cross-squad.

Mas com a descoberta de que AIOS é CLI-first, a abordagem muda.
Em vez de Redis Pub/Sub separado, os eventos de negócio podem ser
extensão do DashboardEventType existente:

```javascript
// Extensão em types.js
const BusinessEventType = {
  HACKERVERSO_FOUNDATION_READY: 'HackerVersoFoundationReady',
  HACKERVERSO_STEP_COMPLETE: 'HackerVersoStepComplete',
  COPY_CHIEF_MISSION_COMPLETE: 'CopyChiefMissionComplete',
  QUALITY_GATE_BUSINESS: 'QualityGateBusiness',
};
```

Isso mantém o padrão existente sem criar sistema paralelo.

**STANDBY:** O Event Bus cross-squad (Redis Pub/Sub) que desenhei faz
mais sentido quando houver squads rodando em paralelo com volume.
Agora, com squads/ vazio, não tem o que conectar. Deixa de standby.

---

## GAPS QUE VÃO PRA STANDBY

| Item | Por que standby |
|------|-----------------|
| Event Bus Redis Pub/Sub | Squads não existem ainda. Sem o que conectar. |
| Tabelas Supabase de observabilidade | AIOS é CLI-first. Observability é CLI panel, não dashboard web. |
| Squad Admin automation | Não vi evidência de squad Admin no repo. Se existe, é manual. |
| Dashboard React /dashboard | Constitution proíbe: "UI NUNCA é requisito para operação". |
| n8n collection workflows | n8n não aparece no repo. Pode ser infra separada. |

---

## PLANO REAL DE IMPLEMENTAÇÃO

### FASE 1: Criar Squad HackerVerso (1-2 semanas)

```
ENTRADA PARA CLAUDE CODE:

1. Ativar @squad-creator
2. Criar squad "hackerverso" usando squad-generator
3. Estruturar as 14 etapas como tasks .md dentro de squads/hackerverso/tasks/
4. Criar o .synapse/manifest com domain rules do HackerVerso
5. Criar workflow YAML com as 14 etapas encadeadas
6. Criar checklists para os 5 quality gates

MATERIAL DE REFERÊNCIA:
- hackerverso-aios-integration.jsx → Pipeline, clones, quality gates
- Documentos do HackerVerso (os 3 que o Vinicius compartilhou)
- Formato: seguir padrão de copy-chief e squad.md
```

### FASE 2: Converter Clones para Formato AIOS (1 semana)

```
ENTRADA PARA CLAUDE CODE:

1. Converter os 10 system prompts (Hormozi, Voss, etc.) para .md no formato AIOS
   - YAML frontmatter + persona + mission router + quality gate
   - Salvar em squads/hackerverso/agents/ (os que são HV-specific)
   - Ou em .claude/agents/ (os que são cross-squad como Hormozi)

2. Completar os 7 clones HV que faltam prompts completos
   - Kennedy, Halbert, Carlton, Sugarman, Makepeace, Fascinations, Yoshitani
   - Usar o clone-mind skill como pipeline de criação

MATERIAL DE REFERÊNCIA:
- aios-deep-solutions.jsx → 4 prompts completos (Hormozi, Voss, Ohno, Murphy)
- aios-clones-expanded.jsx → 6 prompts completos (Brunson, Suby, etc.)
- copy-chief.md como formato de referência
```

### FASE 3: Integrar HackerVerso ↔ copy-chief (1 semana)

```
ENTRADA PARA CLAUDE CODE:

1. Definir handoff: HackerVerso output → copy-chief input
2. Os clones duplicados (Kennedy, Halbert no HV e no copy-chief)
   devem apontar para a mesma definição
3. HackerVerso chama copy-chief via Task tool quando chega na fase de conversão
4. Testar pipeline end-to-end com 1 nicho real
```

---

## O QUE ENTREGAR PARA CLAUDE CODE (BRIEFING ATUALIZADO)

```markdown
# Briefing: Criar Squad HackerVerso no AIOS

## Contexto
O AIOS é um framework CLI-first (Constitution Artigo I).
Squads vivem em `squads/` e são descobertos pelo Synapse L5.
A infra de squads já existe (squad-generator, squad-loader, etc.).
O `squads/` está vazio — este será o primeiro squad de negócio.

## Referências no Repo
- `.claude/agents/copy-chief.md` → Formato de agent com 24 copywriters (similar)
- `.claude/skills/clone-mind.md` → Pipeline DNA Mental™ para criar clones
- `.claude/skills/squad.md` → Skill de criação de squads
- `.aios-core/development/scripts/squad/` → Squad generator/validator
- `.aios-core/core/synapse/layers/l5-squad.js` → Como squads são carregados

## O que criar
1. `squads/hackerverso/` com estrutura padrão
2. 14 tasks .md (uma por etapa do pipeline)
3. 7 agents .md (clones HV) + referência aos que já existem no copy-chief
4. 1 workflow YAML (pipeline de 14 etapas)
5. 5 checklists .md (quality gates)
6. .synapse/manifest (domain rules)
7. data/ com knowledge base (frameworks, heurísticas)

## Material Estratégico (anexar os .jsx como referência)
- Pipeline de 14 etapas com I/O de cada step
- Heurísticas de cada clone
- Quality gates com critérios e fail actions
- Cross-squad connections (HV → copy-chief, HV → marketing, etc.)
```

---

## DECISÃO PENDENTE DO VINICIUS

Uma única decisão: **Como integrar HackerVerso com copy-chief?**

O copy-chief já tem Kennedy, Halbert, Carlton, Bencivenga, Schwartz,
e mais 19 copywriters. O HackerVerso que mapeamos também usa Kennedy,
Halbert, Carlton.

Opção A: HackerVerso absorve copy-chief
Opção B: HackerVerso → copy-chief (estratégia → execução)
Opção C: Merge seletivo (HV faz estratégia, copy-chief faz copy)

Minha recomendação: C — cada um faz o que faz melhor.
