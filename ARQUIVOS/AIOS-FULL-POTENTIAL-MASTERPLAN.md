# AIOS Full Potential — Master Plan

## Diagnóstico

O AIOS-core possui **10 chiefs** (orquestradores) em `.claude/agents/` que são **shells funcionais sem conteúdo**. Cada chief é uma máquina de roteamento sofisticada que sabe COMO orquestrar sub-agentes, mas aponta para arquivos que **não existem no repositório** (estavam no submódulo privado `aios-pro`).

### O que FUNCIONA hoje

| Componente | Status | Localização |
|---|---|---|
| 12 agents de desenvolvimento | ✅ Completos | `.aios-core/development/agents/` |
| Constitution (6 artigos) | ✅ Completo | `.aios-core/data/constitution.md` |
| Synapse Engine (8 layers) | ✅ Completo | `.aios-core/core/synapse/` |
| Squad infrastructure | ✅ Completo (sem uso) | `.aios-core/development/scripts/squad/` |
| Master Orchestrator | ✅ Completo | `.aios-core/core/orchestration/` |
| Event System | ✅ Completo | `.aios-core/core/events/` |
| Quality Gates (dev) | ✅ Completo | `.aios-core/core/quality-gates/` |
| Service Registry (203 workers) | ✅ Completo | `.aios-core/data/registry/` |
| Clone Mind skill | ✅ Completo | `.claude/skills/clone-mind.md` |
| Squad skill | ✅ Completo | `.claude/skills/squad.md` |
| 10 chiefs (orquestradores) | ⚠️ Shells funcionais | `.claude/agents/` |

### O que está VAZIO

Cada chief referencia 4 tipos de arquivo que não existem:

1. **Persona files** (`.claude/commands/{Domain}/agents/*.md`) — a personalidade completa de cada sub-agente
2. **Task files** (`squads/{domain}/tasks/*.md`) — instruções passo-a-passo de cada missão
3. **Template files** (`squads/{domain}/templates/*.md`) — templates reutilizáveis
4. **Knowledge bases** (`squads/{domain}/data/*.md|yaml`) — base de conhecimento por domínio

---

## Inventário Completo de Gaps

### 1. COPY-CHIEF (24 copywriters, 3 tiers + tools)

**Persona principal faltando:**
- `.claude/commands/Copy/agents/copy-chief.md`

**24 Sub-agents (personas):**

| Tier | Agent | Especialidade |
|---|---|---|
| T0 Diagnóstico | @eugene-schwartz | 5 Levels of Awareness, Market Sophistication |
| T0 Auditoria | @claude-hopkins | Scientific Advertising, Audit 85/100 |
| T0 Conversa | @robert-collier | Mental conversation mapping |
| T1 Master | @gary-halbert | Storytelling visceral, A-pile letters |
| T1 Master | @gary-bencivenga | Bullets, fascinations, headlines |
| T1 Master | @david-ogilvy | Premium branding, elegância |
| T2 Execução | @dan-kennedy | NO B.S., urgência, direct response |
| T2 Execução | @todd-brown | Unique Mechanism, mercado saturado |
| T2 Execução | @jeff-walker | PLF (Product Launch Formula) |
| T3 Especialista | @jon-benson | VSL (inventor do formato) |
| T3 Especialista | @ry-schwartz | Enrollment copy, cohort courses |
| ? | 13 copywriters adicionais | Mencionados no chief (total 24) |

**Tasks faltando (~22):**
- `create-sales-page.md`
- `create-email-sequence.md`
- `create-ad-copy.md`
- `create-headlines.md`
- `create-lead-magnet.md`
- `create-webinar-script.md`
- `vsl-script.md`
- `create-upsell-page.md`
- `create-landing-page.md`
- `audit-copy-hopkins.md`
- `tasks/sugarman-30-triggers-check.md`
- `tasks/plf/create-preprelaunch.md`
- `tasks/plf/create-plc-sequence.md`
- `tasks/plf/create-sales-page-plf.md`
- `tasks/plf/create-launch-emails.md`
- `tasks/plf/create-seed-launch.md`
- `tasks/plf/create-jv-launch.md`
- `tasks/plf/create-live-launch.md`
- `tasks/plf/create-evergreen-launch.md`
- `tasks/plf/create-launch-stack.md`
- `tasks/plf/create-open-cart-sequence.md`
- `tasks/plf/map-mental-triggers.md`
- `tasks/plf/diagnose-failed-launch.md`

**Templates faltando (~15):**
- `plc1-script-tmpl.md`, `plc2-script-tmpl.md`, `plc3-script-tmpl.md`
- `sales-page-blueprint-tmpl.md`
- `email-subject-lines-tmpl.md`
- `seed-launch-checklist.md`
- `jv-swipe-tmpl.md`, `jv-launch-partner.md`
- `live-launch-readiness.md`
- `evergreen-setup.md`
- `launch-stack-tmpl.md`
- `open-cart-day1-tmpl.md`, `open-cart-final-tmpl.md`
- `hopkins-audit-checklist.md`
- `copy-quality-checklist.md`

**Data/KB faltando (~3):**
- `squads/copy/data/copywriting-kb.md`
- `sugarman-30-triggers.md`
- `mental-triggers-kb.yaml`

---

### 2. TRAFFIC-MASTERS-CHIEF (7 especialistas, 3 tiers)

**Persona principal faltando:**
- `.claude/commands/traffic-masters/agents/traffic-masters-chief.md`

**7 Sub-agents (personas):**

| Tier | Agent | Especialidade | Frameworks |
|---|---|---|---|
| T0 Strategy | @molly-pittman | Traffic Engine (9 steps), Customer Journey | Traffic Engine |
| T0 Strategy | @depesh-mandalia | BPM Method, Brand Performance | BPM |
| T1 Meta | @nicholas-kusmich | Meta Ads Lead Gen | 4-Step Framework |
| T1 Google | @kasim-aslam | Google Ads, Golden Ratio | Golden Ratio, 4 Campaign Types |
| T1 YouTube | @tom-breeze | YouTube Ads | ADUCATE, 3-Act Structure |
| T2 Scaling | @ralph-burns | Creative Lab, Scaling | Creative Lab (7 steps), DPI² |
| T2 Brasil | @pedro-sobral | Metodologia ABC, Operação BR | ABC, Operação Diária |

**Tasks faltando (~15):**
- `account-audit.md`, `traffic-engine-setup.md`, `traffic-strategy.md`, `bpm-setup.md`
- `meta-campaign.md`, `meta-ecommerce.md`, `meta-leadgen.md`, `leadgen-strategy.md`
- `google-campaign.md`, `google-search.md`, `google-shopping.md`
- `youtube-campaign.md`, `youtube-script.md`
- `scaling-strategy.md`, `creative-optimization.md`
- `brasil-strategy.md`, `metodologia-abc.md`, `operacao-diaria.md`

---

### 3. DESIGN-CHIEF (8 especialistas + Brad Frost, 3 tiers)

**Persona principal faltando:**
- `.claude/commands/Design/agents/design-chief.md`

**8 Sub-agents (personas):**

| Tier | Agent | Especialidade | Frameworks |
|---|---|---|---|
| T0 Brand | @marty-neumeier | Brand Strategy, Positioning | Zag, Brand Gap |
| T0 Ops | @dave-malouf | DesignOps, Scaling | DesignOps Framework |
| T1 Business | @chris-do | Pricing, Client Negotiation | Value-based Pricing |
| T1 YouTube | @paddy-galloway | Thumbnails, CTR | CTR Optimization |
| T1 Photo | @joe-mcnally | Photography, Lighting | Flash, Portrait |
| T2 Systems | @brad-frost | Design Systems, Tokens | Atomic Design |
| T2 Logo | @aaron-draplin | Logo Design | Brand Marks |
| T2 Editing | @peter-mckinnon | Photo/Video Editing | Lightroom, Presets |

**Tasks faltando (~12):**
- `brand-strategy.md`, `designops-setup.md`
- `pricing-strategy.md`, `client-negotiation.md`
- `thumbnail-optimization.md`, `youtube-strategy.md`
- `photography-setup.md`, `lighting-setup.md`, `portrait-lighting.md`
- `design-system-create.md`, `design-tokens.md`, `component-audit.md`
- `logo-creation.md`, `photo-editing.md`, `preset-creation.md`, `color-grading.md`

---

### 4. STORY-CHIEF (12 storytellers, 3 tiers)

**Persona principal faltando:**
- `.claude/commands/Storytelling/agents/story-chief.md`

**12 Sub-agents (personas):**

| Tier | Agent | Especialidade | Frameworks |
|---|---|---|---|
| T0 Diagnóstico | @joseph-campbell | Hero's Journey | Monomyth |
| T0 Diagnóstico | @shawn-coyne | Story Grid, Genre | Story Grid |
| T1 Master | @donald-miller | StoryBrand | SB7 Framework |
| T1 Master | @nancy-duarte | Presentations, Sparkline | Sparkline |
| T1 Master | @dan-harmon | Story Circle, Episodic | 8-beat Circle |
| T1 Master | @blake-snyder | Save the Cat, Scripts | 15-beat Beat Sheet |
| T2 Specialist | @oren-klaff | Pitches | STRONG Method |
| T2 Specialist | @kindra-hall | Business Stories | 4 Stories Framework |
| T2 Specialist | @matthew-dicks | Personal Stories | 5-Second Moment |
| T2 Specialist | @marshall-ganz | Public Narrative | Story of Self, Us, Now |
| T2 Specialist | @park-howell | Quick Communication | ABT Framework |
| T2 Specialist | @keith-johnstone | Improvisation | Improv Principles |

**Tasks faltando (~14):**
- `apply-heros-journey.md`, `apply-story-circle.md`, `apply-save-the-cat.md`
- `apply-abt.md`, `diagnose-story-grid.md`
- `craft-ted-talk.md`, `create-brandscript.md`
- `craft-personal-story.md`, `craft-public-narrative.md`
- `create-pitch.md`, `create-business-story.md`, `improvise-story.md`

---

### 5. DATA-CHIEF (6 especialistas, 3 tiers)

**Persona principal faltando:**
- `.claude/commands/Data/agents/data-chief.md`

**6 Sub-agents (personas):**

| Tier | Agent | Especialidade | Frameworks |
|---|---|---|---|
| T0 Fundamentação | @peter-fader | CLV, RFM, Customer Centricity | Customer-Based Corporate Valuation |
| T0 Fundamentação | @sean-ellis | AARRR, North Star, PMF | Growth Hacking, ICE |
| T1 Operação | @nick-mehta | Health Score, Churn, CS | DEAR Framework |
| T1 Operação | @david-spinks | Community Metrics | SPACES Model |
| T1 Operação | @wes-kao | Learning Outcomes | CBC Design |
| T2 Comunicação | @avinash-kaushik | Attribution, Dashboards | DMMM, So What Test |

**Tasks faltando (~12):**
- `calculate-clv.md`, `segment-rfm.md`
- `run-pmf-test.md`, `define-north-star.md`, `run-growth-experiment.md`
- `design-health-score.md`, `predict-churn.md`
- `measure-community.md`, `design-learning-outcomes.md`
- `build-attribution.md`, `create-dashboard.md`

---

### 6. CYBER-CHIEF (6 especialistas)

**Persona principal faltando:**
- `.claude/commands/Cybersecurity/agents/cyber-chief.md`

**6 Sub-agents (personas):**

| Area | Agent | Especialidade |
|---|---|---|
| Red Team | @georgia-weidman | Pentesting (web, infra, mobile) |
| Red Team | @peter-kim | APT Simulation, Attack Surface |
| AppSec | @jim-manico | OWASP, Secure Coding, API Security |
| Blue Team | @chris-sanders | Threat Hunting, Incident Response, SOC |
| Governance | @omar-santos | Security Program, Compliance, Risk |
| Team | @marcus-carey | Team Building, Hiring, Career |

**Tasks faltando (~15):**
- `pentest-webapp.md`, `pentest-infrastructure.md`, `pentest-mobile.md`
- `red-team-campaign.md`, `attack-surface-mapping.md`, `social-engineering-assessment.md`
- `appsec-code-audit.md`, `secure-coding-review.md`, `owasp-top10-audit.md`, `api-security-audit.md`
- `threat-hunting.md`, `incident-response.md`, `soc-operations.md`
- `security-program-design.md`, `compliance-framework.md`, `risk-assessment.md`

---

### 7. LEGAL-CHIEF (8 especialistas, BR-focused)

**Persona principal faltando:**
- `.claude/commands/Legal/agents/legal-chief.md`

**8 Sub-agents (personas):**

| Tier | Agent | Especialidade |
|---|---|---|
| T1 Global | @ken-adams | Contract Drafting, Risk-based Review |
| T1 Global | @brad-feld | Venture Deals, Term Sheets, SAFE |
| T2 BR | @pierpaolo-bottini | Criminal Empresarial, Compliance |
| T2 BR | @tributarista | Planejamento Fiscal, Holding, Regimes |
| T2 BR | @trabalhista | CLT vs PJ, Pejotização, Vesting |
| T2 BR | @societarista | Acordo de Sócios, Cap Table, Governança |
| T2 BR | @lgpd-specialist | LGPD, Privacidade, DPO |

**Tasks faltando (~10):**
- `revisar-contrato.md`, `criar-contrato.md`
- `analisar-investimento.md`
- `compliance-criminal.md`
- `planejamento-tributario.md`
- `avaliar-contratacao.md`
- `acordo-socios.md`
- `adequacao-lgpd.md`

**Checklists faltando (~6):**
- `contract-risk-matrix.md`
- `due-diligence.md`
- `criminal-compliance-check.md`
- `tax-regime-decision.md`
- `pejotizacao-risk.md`
- `lgpd-compliance.md`

---

### 8. TOOLS-ORCHESTRATOR (6 especialistas)

**Persona principal faltando:**
- `.claude/commands/Tools/agents/tools-orchestrator.md`

**6 Sub-agents (personas):**
- @tools-reviewer
- @tools-creator
- @tools-extractor
- @tools-validator
- @tools-database-manager
- @mental-model-analyzer

**Tasks faltando (~6):**
- `tools-review.md`, `tools-create.md`, `tools-extract.md`
- `tools-validate.md`, `tools-quality.md`, `tools-db-manage.md`
- `mental-model-analysis.md`

**Data faltando (~7 domain YAMLs):**
- `domain-knowledge/sales.yaml`
- `domain-knowledge/product.yaml`
- `domain-knowledge/strategy.yaml`
- `domain-knowledge/cs.yaml`
- `domain-knowledge/negotiation.yaml`
- `domain-knowledge/operations.yaml`
- `domain-knowledge/communication.yaml`

---

### 9. DB-SAGE (1 agent, muitas tasks)

**Persona principal faltando:**
- `.claude/commands/db-sage/agents/db-sage.md`

**Tasks faltando (~20):**
- `kiss.md`, `kiss-schema-check.md`, `create-doc.md`, `domain-modeling.md`
- `db-env-check.md`, `db-bootstrap.md`, `db-apply-migration.md`, `db-dry-run.md`
- `db-seed.md`, `db-snapshot.md`, `db-rollback.md`, `db-smoke-test.md`
- `db-rls-audit.md`, `db-policy-apply.md`, `db-impersonate.md`
- `db-explain.md`, `db-analyze-hotpaths.md`, `query-optimization.md`
- `schema-audit.md`, `security-audit.md`
- `db-load-csv.md`, `db-run-sql.md`, `db-load-schema.md`
- `db-squad-integration.md`, `supabase-setup.md`
- `create-deep-research-prompt.md`, `execute-checklist.md`

**Templates faltando (~8):**
- `schema-design-tmpl.yaml`, `rls-policies-tmpl.yaml`, `migration-plan-tmpl.yaml`
- `index-strategy-tmpl.yaml`
- `tmpl-migration-script.sql`, `tmpl-rollback-script.sql`
- `tmpl-seed-data.sql`, `tmpl-staging-copy-merge.sql`
- `tmpl-smoke-test.sql`
- `tmpl-rls-kiss-policy.sql`, `tmpl-rls-granular-policies.sql`

**Checklists faltando (~5):**
- `db-kiss-validation-checklist.md`
- `database-design-checklist.md`
- `dba-predeploy-checklist.md`
- `dba-rollback-checklist.md`
- `db-migration-audit-checklist.md`

**Data faltando (~3):**
- `database-best-practices.md`
- `supabase-patterns.md`
- `postgres-tuning-guide.md`
- `rls-security-patterns.md`

**Workflows faltando (~6 YAMLs):**
- `setup-database-workflow.yaml`
- `modify-schema-workflow.yaml`
- `backup-restore-workflow.yaml`
- `performance-tuning-workflow.yaml`
- `query-database-workflow.yaml`
- `analyze-data-workflow.yaml`

---

### 10. DESIGN-SYSTEM / Brad Frost (36 missions)

**Persona principal faltando:**
- `.claude/commands/Design/agents/brad-frost.md`

**Tasks faltando (~20):**
- `audit-codebase.md`, `consolidate-patterns.md`, `extract-tokens.md`
- `generate-migration-strategy.md`, `calculate-roi.md`, `generate-shock-report.md`
- `setup-design-system.md`, `build-component.md`, `compose-molecule.md`
- `extend-pattern.md`, `generate-documentation.md`
- `tailwind-upgrade.md`, `audit-tailwind-config.md`
- `export-design-tokens-dtcg.md`, `bootstrap-shadcn-library.md`
- `ds-scan-artifact.md`, `design-compare.md`
- `validate-design-fidelity.md`, `ds-health-metrics.md`
- `bundle-audit.md`, `token-usage-analytics.md`, `dead-code-detection.md`
- `audit-reading-experience.md`
- `a11y-audit.md`, `contrast-matrix.md`, `focus-order-audit.md`, `aria-audit.md`
- `atomic-refactor-plan.md`, `atomic-refactor-execute.md`

---

## Plano de Execução Faseado

### Priorização: Impacto no Negócio × Complexidade

| Prioridade | Chief | Razão | Sub-agents | Est. Arquivos |
|---|---|---|---|---|
| 🔴 P0 | **copy-chief** | Motor de receita. Gera copy que vende. Integra com HackerVerso | 11+ core | ~45 |
| 🔴 P0 | **HackerVerso** (squad) | Fundação estratégica de TUDO | 7 | ~35 ✅ PRONTO |
| 🟠 P1 | **traffic-masters** | Sem tráfego, copy não alcança ninguém | 7 | ~25 |
| 🟠 P1 | **data-chief** | Métricas orientam decisões dos outros squads | 6 | ~20 |
| 🟡 P2 | **story-chief** | Storytelling amplifica copy e branding | 12 | ~30 |
| 🟡 P2 | **legal-chief** | Compliance protege o negócio (BR-focused) | 8 | ~25 |
| 🟢 P3 | **design-chief** | Branding e visual | 8 | ~25 |
| 🟢 P3 | **cyber-chief** | Segurança da operação | 6 | ~25 |
| 🔵 P4 | **db-sage** | Suporte técnico de database | 1 | ~45 |
| 🔵 P4 | **design-system** | Suporte técnico de frontend | 1 | ~35 |
| 🔵 P4 | **tools-orchestrator** | Meta-ferramenta de frameworks | 6 | ~20 |

---

### FASE 0 — Fundação (✅ COMPLETO)
**Entregue:** Squad HackerVerso completo + 10 standalone agents

- `squads/hackerverso/` — 7 agents, 14 tasks, 1 workflow, 5 checklists, KB, manifest
- `.claude/agents/` — 10 standalone agents cross-squad
- Total: 41 arquivos prontos

---

### FASE 1 — Copy-Chief: O Motor de Receita
**Estimativa:** ~45 arquivos | Prioridade: 🔴 CRÍTICA

O copy-chief é o mais URGENTE porque:
1. É o destino do handoff do HackerVerso (Phase 4 → copy-chief)
2. Já tem routing para 24 copywriters — precisa do CONTEÚDO deles
3. Gera diretamente a copy que converte em receita
4. Tem overlap com HackerVerso (Kennedy, Halbert, Carlton) que precisa ser resolvido

**Entregáveis:**

#### 1a. Persona do Copy-Chief
Criar `.claude/commands/Copy/agents/copy-chief.md` com personalidade completa do orquestrador.

#### 1b. 11 Sub-agents Core (personas completas)
Cada um precisa: system prompt, heurísticas, few-shot examples, quality criteria.

Os **5 fundamentais** (sem eles o chief não funciona):
- @eugene-schwartz — 5 Levels of Awareness + Market Sophistication
- @claude-hopkins — Scientific Advertising Audit (Hopkins Score 85/100)
- @gary-halbert — Storytelling visceral, A-pile letters
- @gary-bencivenga — Bullets, fascinations, headlines
- @dan-kennedy — NO B.S., urgência, direct response

Os **6 de execução:**
- @david-ogilvy — Premium branding
- @todd-brown — Unique Mechanism
- @jeff-walker — PLF completo
- @jon-benson — VSL (inventor do formato)
- @ry-schwartz — Enrollment copy
- @robert-collier — Mental conversation

**Nota sobre os 13 copywriters restantes:** O chief menciona 24, mas o routing table mapeia 11. Os 13 restantes provavelmente são aliases ou sub-especializações que podem ser derivados dos 11 core. Resolver após os 11 estarem funcionando.

#### 1c. 22 Task Files
Cada task precisa: input schema, instruções step-by-step, output schema, quality gate.

#### 1d. Knowledge Bases
- `copywriting-kb.md` — Knowledge base geral de copywriting
- `sugarman-30-triggers.md` — Os 30 triggers psicológicos do Sugarman (ferramenta de validação)
- `mental-triggers-kb.yaml` — Triggers mentais do Jeff Walker (PLF)

#### 1e. Templates PLF (15 templates)
Templates de Jeff Walker para cada fase do Product Launch Formula.

#### 1f. Integração copy-chief ↔ HackerVerso
Resolver overlap: Kennedy, Halbert, Carlton existem nos dois.
**Decisão (Opção C confirmada):** HackerVerso faz ESTRATÉGIA → copy-chief faz EXECUÇÃO.
Os clones do HV focam em avatar/posicionamento/mecanismo. Os do copy-chief focam em copy final.

---

### FASE 2 — Traffic + Data: Aquisição e Métricas
**Estimativa:** ~45 arquivos | Prioridade: 🟠 ALTA

#### 2a. Traffic-Masters (7 agents + tasks)
- Persona principal + 7 sub-agents com frameworks específicos
- ~15 task files (1 por missão mapeada no chief)
- Foco BR: @pedro-sobral com Metodologia ABC

#### 2b. Data-Chief (6 agents + tasks)
- Persona principal + 6 sub-agents
- ~12 task files
- 5 workflows compostos (customer-360, churn-system, etc.)
- Integração: data-chief fornece métricas que traffic-masters usa para otimizar

---

### FASE 3 — Story + Legal: Narrativa e Proteção
**Estimativa:** ~55 arquivos | Prioridade: 🟡 MÉDIA

#### 3a. Story-Chief (12 storytellers + tasks)
- O chief com MAIS sub-agents (12 storytellers lendários)
- ~14 task files (1 por framework)
- Integra com copy-chief (storytelling → copy) e design-chief (presentations)

#### 3b. Legal-Chief (8 especialistas BR + checklists)
- 2 experts globais (contratos + investimento) + 5 experts BR
- ~10 task files + 6 checklists de validação
- Essencial para operações BR (CLT, tributário, LGPD)

---

### FASE 4 — Design + Cyber: Visual e Segurança
**Estimativa:** ~50 arquivos | Prioridade: 🟢 NORMAL

#### 4a. Design-Chief (8 especialistas + Brad Frost)
- Inclui Brad Frost (design-system agent) que tem 36 missions próprias
- Foco em branding (@marty-neumeier) e sistemas (@brad-frost)
- Multi-specialist workflows: Full Rebrand, YouTube Optimization, etc.

#### 4b. Cyber-Chief (6 especialistas)
- Red team + Blue team + AppSec + Governance
- Prioridade sobe se tiver VPS/infra exposta

---

### FASE 5 — Infra: DB + Tools + Design System
**Estimativa:** ~100 arquivos | Prioridade: 🔵 SUPORTE

#### 5a. DB-Sage (~45 arquivos)
- O agent com MAIS tasks (~20) + templates SQL + checklists DBA
- Supabase-specific: RLS, migrations, KISS validation
- 6 workflow YAMLs

#### 5b. Design-System / Brad Frost (~35 arquivos)
- 36 missions de Atomic Design
- Brownfield + Greenfield + Accessibility + Metrics

#### 5c. Tools-Orchestrator (~20 arquivos)
- Meta-ferramenta: review/create/extract frameworks
- 7 domain knowledge YAMLs

---

## Estratégia de Execução

### Como construir cada sub-agent

Cada sub-agent segue o mesmo padrão (baseado no formato real do repo):

```markdown
---
name: agent-name
description: |
  Descrição completa do agent
model: opus
tools: [Read, Write, WebSearch, ...]
permissionMode: acceptEdits
memory: project
---

# @agent-name - Role Title

## Identity
**Role:** ...
**Philosophy:** "Frase icônica do expert real"
**Icon:** emoji

## Core Heuristics
1-10 regras que definem como esse expert PENSA

## Mission Router
| Mission | Action |
|---------|--------|
| keyword | O que faz |

## Output Schema
```yaml
# Estrutura do output esperado
```

## Quality Criteria
- [ ] Checklist de qualidade

## Anti-Patterns / Red Flags
- O que NUNCA fazer
```

### Como construir cada task

```markdown
# Task: Nome da Task

## Metadata
- **Step:** ID
- **Agent:** @agent-name
- **depends_on:** [step-XX]

## Input
```yaml
required:
  - campo: "descrição"
```

## Instructions
### 1. Passo 1
### 2. Passo 2
...

## Output Schema
```yaml
# Estrutura esperada
```

## Quality Gate
- [ ] Checklist

## Next Step
→ próximo step
```

### Uso do Clone Mind Skill

O repo já tem `.claude/skills/clone-mind.md` com o pipeline **DNA Mental™** de 9 layers para criação de clones cognitivos. Usar esse skill para criar cada sub-agent garante:
- Consistência com o padrão AIOS
- Profundidade cognitiva (não é system prompt raso)
- Heurísticas derivadas do expert real

**Comando sugerido para Claude Code:**
```
@clone-mind create clone from {expert_name} for {domain} with focus on {frameworks}
```

---

## Resumo Executivo

| Fase | Conteúdo | Arquivos | Prioridade |
|---|---|---|---|
| **Fase 0** | HackerVerso + 10 standalone | 41 | ✅ PRONTO |
| **Fase 1** | Copy-Chief completo | ~45 | 🔴 Próximo |
| **Fase 2** | Traffic + Data | ~45 | 🟠 Depois |
| **Fase 3** | Story + Legal | ~55 | 🟡 Depois |
| **Fase 4** | Design + Cyber | ~50 | 🟢 Depois |
| **Fase 5** | DB + Tools + Design System | ~100 | 🔵 Depois |
| **TOTAL** | Todos os chiefs funcionais | **~336** | — |

### Dependências entre Fases

```
Fase 0 (HackerVerso) ──→ Fase 1 (Copy-Chief) ──→ Fase 2 (Traffic + Data)
                                    ↓                        ↓
                              Fase 3 (Story + Legal)    Fase 4 (Design + Cyber)
                                    ↓                        ↓
                              Fase 5 (DB + Tools + Design System)
```

A Fase 1 é BLOQUEANTE: sem copy-chief funcional, o HackerVerso não tem destino pro seu output da Phase 4 (VSL, página de vendas, upsell, order bump).

### Próximo Passo Imediato

**Construir Fase 1 (Copy-Chief)** — começando pelos 5 sub-agents fundamentais que o tier system EXIGE antes de qualquer execução:
1. @eugene-schwartz (T0 — sem diagnóstico, nada funciona)
2. @claude-hopkins (T0 — sem auditoria, copy não é aprovada)
3. @gary-halbert (T1 — storytelling visceral)
4. @gary-bencivenga (T1 — bullets e headlines)
5. @dan-kennedy (T2 — direct response)

Depois: tasks, templates PLF, knowledge bases, e os 6 agents restantes.
