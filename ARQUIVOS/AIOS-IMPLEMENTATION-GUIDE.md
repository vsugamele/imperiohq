# AIOS Squad — Guia de Implementação para Claude Code

## Status Atual: O que JÁ temos documentado

Ao longo desta análise estratégica, foram criados 8 dashboards React interativos cobrindo:

### Artefatos Prontos (referência estratégica)
| Arquivo | Conteúdo |
|---------|----------|
| `aios-architecture.jsx` | Arquitetura geral do AIOS (3 camadas, 5 agentes core) |
| `aios-agents-deep-dive.jsx` | Deep dive nos 5 agentes: Pax, Aria, Dex, Quinn, Morgan |
| `aios-strategic-analysis.jsx` | Gap analysis, roadmap, ROI matrix, Figma Make prompts |
| `aios-squad-complete-analysis.jsx` | Análise dos 6 squads, 5 workflows, arquitetura de 3 camadas |
| `aios-solutions.jsx` | 7 feedback loops, 16 métricas de observabilidade, automação Admin, 10 clones (overview) |
| `aios-deep-solutions.jsx` | Arquitetura híbrida de feedback (Event Bus + Supabase + n8n) + 4 clones críticos com system prompts completos |
| `aios-clones-expanded.jsx` | 6 clones adicionais com system prompts completos |
| `hackerverso-aios-integration.jsx` | Pipeline de 14 etapas do HackerVerso, 7 clones HV, cross-squad map, quality gates |

---

## GAP ANALYSIS — O que FALTA implementar

### GAP 1: Event Bus (CRÍTICO — Fundação de tudo)

**Status:** Conceito definido, zero código.

**O que é:** Sistema de eventos tipados que permite squads se comunicarem sem acoplamento direto. É a espinha dorsal de feedback loops, observabilidade e cross-squad orchestration.

**O que precisa ser construído:**

1. **Event Schema Registry** — Definição de todos os tipos de evento com schema JSON validável
   - Cada evento precisa de: `type`, `source_squad`, `target_squad`, `payload`, `timestamp`, `correlation_id`
   - Exemplos já mapeados:
     - `squad.vendas.deal_won` → payload: `{deal_id, client_profile, value, closer_notes}`
     - `squad.vendas.deal_lost` → payload: `{deal_id, reason, objections, lead_source}`
     - `squad.cs.churn_detected` → payload: `{client_id, reason, health_score, tenure}`
     - `squad.produto.launched` → payload: `{product_id, name, target_audience, assets}`
     - `squad.marketing.lead_generated` → payload: `{lead_id, source, channel, score}`
     - `hackerverso.foundation_ready` → payload: `{avatar, mechanism, offer, copy_assets}`

2. **Event Bus Implementation** — Usando Redis Pub/Sub (Redis já existe na stack)
   - Publisher: qualquer squad pode emitir eventos
   - Subscriber: squads registram interest em tipos de evento
   - Dead letter queue: eventos não processados ficam em fila para retry
   - Idempotência: mesmo evento processado 2x não causa efeito duplicado

3. **Event Persistence** — Todos os eventos salvos no Supabase para analytics
   - Tabela `events` com indexação por tipo, squad, timestamp
   - Retenção: 90 dias em hot storage, depois archive

**Onde não temos clareza (perguntar ao Vinicius):**
- O `synkra` (Agent Orchestrator) já tem algum sistema de mensageria? Se sim, o Event Bus pode ser extensão dele
- O `Redis` atual é usado para quê exatamente? Filas do n8n? Cache? Precisa saber pra não conflitar
- Existe algum padrão de comunicação entre squads hoje, mesmo que manual?

---

### GAP 2: Observabilidade (CRÍTICO — Sem isso, decisões são no escuro)

**Status:** 16 métricas definidas com sources e thresholds, stack definido, 5 tabelas SQL especificadas. Zero implementação.

**O que precisa ser construído:**

1. **5 Tabelas no Supabase:**

```sql
-- Squad performance agregado
CREATE TABLE squad_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id TEXT NOT NULL,
  date DATE NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  avg_cycle_time_hours FLOAT,
  rework_rate FLOAT,
  executor_distribution JSONB, -- {"agent": 40, "worker": 30, "clone": 20, "human": 10}
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(squad_id, date)
);

-- Quality Gate results
CREATE TABLE gate_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gate_id TEXT NOT NULL,
  workflow TEXT NOT NULL,
  squad_id TEXT NOT NULL,
  result TEXT CHECK (result IN ('pass', 'fail')),
  reason TEXT,
  score FLOAT,
  duration_minutes FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback events between squads
CREATE TABLE feedback_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_squad TEXT NOT NULL,
  to_squad TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  response_time_hours FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cost tracking per squad
CREATE TABLE cost_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id TEXT NOT NULL,
  date DATE NOT NULL,
  llm_tokens_used INTEGER DEFAULT 0,
  llm_cost_brl FLOAT DEFAULT 0,
  n8n_executions INTEGER DEFAULT 0,
  total_cost_brl FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(squad_id, date)
);

-- Clone performance tracking
CREATE TABLE clone_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clone_id TEXT NOT NULL,
  squad_id TEXT NOT NULL,
  tasks_executed INTEGER DEFAULT 0,
  avg_quality_score FLOAT,
  avg_execution_time_seconds FLOAT,
  feedback_score FLOAT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

2. **Dashboard route** no web app React (Vercel) — Nova rota `/dashboard` com 4 seções: Squad Performance, Quality Gates, Feedback Loops, Infra/Custos

3. **Collection workflows** no n8n — Cron jobs que puxam dados de ClickUp API, CRM, e apps e consolidam no Supabase

4. **Alertas** — n8n workflows que verificam thresholds e enviam para Slack

**Onde não temos clareza:**
- O web app atual (`web` no Vercel) usa qual stack React? Next.js? Vite? CRA? Isso muda como criar a rota `/dashboard`
- Quais dados o ClickUp já está tracking por squad? (tasks, status, assignees?)
- O Slack é usado para comunicação entre squads? Quais canais existem?
- O `llm-router` já loga tokens usados por request? Se sim, collection é fácil. Se não, precisa instrumentar.

---

### GAP 3: Squad Admin Automation (ALTO — Quick win com ROI imediato)

**Status:** Workflow de 6 steps definido com detalhamento completo. Tabela de SLAs pronta. Zero implementação.

**O que precisa ser construído:**

1. **Formulário de intake** — ClickUp Form ou Notion Form com campos:
   - Tipo (Financeiro/RH/Jurídico/Facilities/Compliance)
   - Urgência (P1/P2/P3)
   - Squad solicitante
   - Descrição
   - Valor (se financeiro)
   - Anexos

2. **Workflow n8n de 6 nodes:**
   - Node 1: Webhook recebe submissão do formulário
   - Node 2: Claude API classifica tipo + urgência (validação/override do input manual)
   - Node 3: Cria task no ClickUp na lista correta com SLA deadline
   - Node 4: Cron job verifica SLA — se atrasado, escala no Slack
   - Node 5: Se precisa aprovação → Slack interactive message para CEO
   - Node 6: Quando concluído → notifica canal Slack do squad solicitante

3. **SLA Tracking table:**

```sql
CREATE TABLE admin_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requesting_squad TEXT NOT NULL,
  category TEXT CHECK (category IN ('financeiro', 'rh', 'juridico', 'facilities', 'compliance')),
  priority TEXT CHECK (priority IN ('P1', 'P2', 'P3')),
  description TEXT,
  value_brl FLOAT,
  status TEXT DEFAULT 'triaged' CHECK (status IN ('triaged', 'in_progress', 'awaiting_approval', 'completed', 'escalated')),
  sla_deadline TIMESTAMPTZ,
  assigned_to TEXT,
  completed_at TIMESTAMPTZ,
  sla_met BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Onde não temos clareza:**
- Hoje como pedidos Admin chegam? WhatsApp? Slack? Email? ClickUp? Precisa saber pra definir o intake
- Quem são os responsáveis por cada categoria? (Nome/email pra assignar no ClickUp)
- O CEO aprova via qual canal hoje? Slack? WhatsApp? Precisa saber pra definir o approval flow

---

### GAP 4: HackerVerso como Squad (ALTO — Motor estratégico)

**Status:** Pipeline de 14 etapas mapeado com I/O, 7 clones com heurísticas core, 5 quality gates, cross-squad connections. System prompts dos clones HV NÃO foram escritos em profundidade (só heurísticas).

**O que precisa ser construído:**

1. **System prompts completos para 7 clones HV:**
   - Kennedy (steps 01, 08, 10) — urgência, direct response, headlines
   - Halbert (step 02) — copy emocional, descoberta de dor
   - Carlton (steps 03, 04, 09) — posicionamento, VSL, análise competitiva
   - Sugarman (step 05) — naming, curiosidade, lógica persuasiva
   - Hormozi (steps 06, 07) — JÁ TEMOS system prompt completo
   - Makepeace (step 11) — upsell, lógica do próximo problema
   - Fascinations (steps 00b, 12, 13) — psicologia profunda, gatilhos
   - Yoshitani (step 00) — pesquisa etnográfica, jornada

   Para cada um: system prompt + few-shot example + quality criteria + red flags
   (No mesmo formato que fizemos para Hormozi, Voss, Ohno e Murphy)

2. **copy-generator.js** — Orquestrador que encadeia as 14 etapas:
   - Recebe input inicial (nicho + produto/serviço)
   - Roda cada step chamando o clone correto via ali-hub/llm-router
   - Valida output de cada step contra schema esperado
   - Aplica Quality Gates nas 5 posições definidas
   - Se Quality Gate falha, re-roda a etapa (max 2 retries) ou escala pra humano
   - Output final: documento consolidado JSON/Markdown

3. **Arsenal de ferramentas extras** (10+ tools de conversão):
   - Ultrapassador de Entregáveis
   - Esqueleto + Script do Webinar de Ascensão
   - Emails do Webinar (7 dias)
   - Página de Vendas Lowticket
   - Quiz de Lowticket
   - Emails de Recuperação
   - Desvantagens do Copy (auditor)
   - "Onde Falta Você Provar?"
   - ANAMS, Escavador de Desejos, Benefícios Impulsivos
   Cada ferramenta precisa de: prompt template + input schema + output schema

4. **Mesa de Mentes** — Quality Gate multi-agente:
   - Roda 3+ clones em paralelo avaliando o output final
   - Cada clone dá score 1-10 + feedback
   - Se média < 7, identifica o ponto mais fraco e re-roda aquela etapa
   - Prompts da Mesa de Mentes precisam de: critérios de avaliação por fase

**Onde não temos clareza:**
- O `copy-generator.js` já existe como arquivo no repo? Se sim, qual é a estrutura atual?
- O `ali-hub` (sub-agentes) funciona como? API REST? CLI? MCP? Como registrar novos clones?
- O `llm-router` suporta diferentes modelos por clone? (ex: Opus para clones criativos, Sonnet para analíticos)
- As "Ferramentas BETA" (ANAMS, etc.) já têm prompts escritos em algum lugar? Ou são só conceito?

---

### GAP 5: Clones Library Completa (MÉDIO — Infra de conhecimento)

**Status:** 10 clones do AIOS com system prompts COMPLETOS (Hormozi, Voss, Ohno, Murphy, Brunson, Suby, Cagan, Aaron Ross, Brad Frost, Sean Ellis). 7 clones do HackerVerso com heurísticas mas SEM system prompts completos (exceto Hormozi que é compartilhado).

**O que precisa ser construído:**

1. **System prompts completos para 6 clones HV restantes** (Kennedy, Halbert, Carlton, Sugarman, Makepeace, Fascinations, Yoshitani) — no mesmo formato dos 10 que já fizemos

2. **Clone Registry** — Tabela/config que registra todos os clones disponíveis:

```json
{
  "clone_id": "hormozi",
  "name": "Alex Hormozi",
  "version": "1.0",
  "category": "marketing_growth",
  "system_prompt_path": "/clones/hormozi/system.md",
  "few_shot_path": "/clones/hormozi/examples.json",
  "quality_criteria_path": "/clones/hormozi/quality.json",
  "model_preference": "claude-opus-4-5-20250514",
  "temperature": 0.7,
  "max_tokens": 4000,
  "squads_authorized": ["marketing", "vendas", "hackerverso"],
  "steps_authorized": ["06", "07"]
}
```

3. **Clone versioning** — Quando um clone é refinado, manter versão anterior acessível

4. **Clone quality dashboard** — Integrar com tabela `clone_performance` da observabilidade

**Onde não temos clareza:**
- Onde ficam os system prompts hoje? No código do synkra? No ali-hub? Em arquivos markdown?
- Existe algum sistema de versionamento de prompts já?
- Como um squad "chama" um clone hoje? Via API? Via CLI? Precisa saber pra definir a interface

---

### GAP 6: Cross-Squad Feedback Loops (MÉDIO — Depende do Event Bus)

**Status:** 7 loops mapeados com trigger, dados, destino, automação e impacto. Arquitetura híbrida definida (Event Bus + Supabase + n8n). Zero implementação.

**O que precisa ser construído:**
- Depende 100% do GAP 1 (Event Bus). Após Event Bus funcional, implementar os 7 loops é configuração, não desenvolvimento.
- Cada loop = 1 event type registrado + 1 subscriber configurado + 1 ação no destino

---

## O QUE ENTREGAR PARA CLAUDE CODE

### Briefing Essencial (cole isso no início da conversa)

```
Você vai implementar funcionalidades no AIOS (Synkra AI Operating System).

CONTEXTO DO PROJETO:
- AIOS é um framework onde tasks validadas são executadas pelo executor ideal
  (Agent IA, Worker Script, Clone Cognitivo, ou Humano)
- Princípios: CLI First, Story-Driven, Quality Gates
- Stack: FastAPI (Railway), React SPA (Vercel), Supabase (PostgreSQL+Auth+Storage),
  n8n (automações), Redis (queue+cache), ClickUp (tasks)
- Repo: github.com/SynkraAI/aios-core (confirmar URL)

ARQUITETURA DE 3 CAMADAS:
1. THE HUMANO: Claude Code CLI + equipe humana
2. SQUADS (Executores): 17+ squads especializados
3. SERVIÇOS: n8n, Redis, ClickUp, Supabase, APIs, MCP Servers

SQUADS EXISTENTES: Marketing, Vendas, OPS, Experiência (CS), Produto, Admin
SQUADS NOVOS A CRIAR: HackerVerso (motor estratégico de 14 etapas)

APPS:
- api (FastAPI, Railway)
- clawdbot (AI Gateway, Hetzner VPS)
- rooter (Video Processing, Railway)
- synkra (Agent Orchestrator)
- web (React SPA, Vercel)
- ali-hub (Sub-Agentes AIOS)
- llm-router (Multi-LLM Proxy)
```

### Ordem de Implementação Recomendada

```
FASE 1 (Semana 1-2): FUNDAÇÃO
├─ 1.1 Event Bus com Redis Pub/Sub
├─ 1.2 Tabelas Supabase (5 tabelas de observabilidade + admin_requests)
└─ 1.3 Clone Registry (config JSON/YAML de todos os clones)

FASE 2 (Semana 2-3): OBSERVABILIDADE
├─ 2.1 Dashboard route no web app (/dashboard)
├─ 2.2 Collection workflows n8n (ClickUp → Supabase)
└─ 2.3 Alertas Slack (threshold-based)

FASE 3 (Semana 3-4): SQUAD ADMIN
├─ 3.1 Formulário de intake (ClickUp Form)
├─ 3.2 Workflow n8n de 6 nodes (classificação → routing → SLA → aprovação → notificação)
└─ 3.3 SLA tracking + reporting

FASE 4 (Semana 4-6): HACKERVERSO
├─ 4.1 System prompts dos 7 clones HV
├─ 4.2 copy-generator.js (orquestrador de 14 etapas)
├─ 4.3 Quality Gates automáticos
├─ 4.4 Mesa de Mentes (QA multi-agente)
└─ 4.5 Arsenal de ferramentas extras

FASE 5 (Semana 6-8): INTEGRAÇÃO
├─ 5.1 Cross-squad feedback loops (7 loops via Event Bus)
├─ 5.2 HackerVerso → squads de execução (auto-trigger)
└─ 5.3 Feedback reverso (squads → HackerVerso refinement)
```

### Materiais de Referência para Cada Fase

| Fase | Artefato(s) de Referência | O que Claude Code deve ler |
|------|--------------------------|---------------------------|
| 1 | `aios-deep-solutions.jsx` | Aba "Arquitetura Híbrida" — Event Bus design, event types |
| 2 | `aios-solutions.jsx` | Aba "Observabilidade" — 16 métricas, stack, tabelas |
| 3 | `aios-solutions.jsx` | Aba "Squad Admin" — 6 steps, SLA table, antes/depois |
| 4 | `hackerverso-aios-integration.jsx` | Todas as abas — pipeline, clones, quality gates, cross-squad |
| 5 | `aios-deep-solutions.jsx` + `aios-solutions.jsx` | Feedback loops + Event Bus |
| Clones | `aios-deep-solutions.jsx` + `aios-clones-expanded.jsx` | 10 system prompts completos como template |

---

## PERGUNTAS QUE VINICIUS PRECISA RESPONDER ANTES DE IMPLEMENTAR

### Sobre a Infra Atual

1. **Repo:** Qual a URL exata do repo? Monorepo ou multirepo? Estrutura de pastas?
2. **synkra:** Como o Agent Orchestrator funciona? Tem API? Como registrar novos agentes/clones?
3. **ali-hub:** Como os sub-agentes são registrados e chamados? API REST? Config file?
4. **llm-router:** Suporta múltiplos modelos? Como é a config? Loga tokens/custo?
5. **Redis:** Usado pra quê hoje? Tem capacidade pra Pub/Sub adicional?
6. **web app:** Stack frontend? Next.js? Vite? Roteamento atual?
7. **copy-generator.js:** Esse arquivo já existe? Se sim, qual estado atual?

### Sobre Processos Atuais

8. **Comunicação entre squads:** Como acontece hoje? Slack? ClickUp? Manual?
9. **Pedidos Admin:** Por onde chegam hoje? Quem são os responsáveis por categoria?
10. **Aprovações CEO:** Qual canal? Qual fluxo?
11. **ClickUp:** Estrutura de spaces/folders/lists por squad?
12. **Prompts:** Onde ficam os system prompts dos agentes existentes?

### Sobre o HackerVerso

13. **copy-generator.js:** Existe como conceito ou já tem código? Se tem código, compartilhar.
14. **Ferramentas BETA:** Têm prompts escritos ou só conceito?
15. **Mesa de Mentes:** Já tem implementação ou só conceito do board?
16. **Clones HV:** Os prompts dos copywriters clássicos (Kennedy, Halbert, etc.) já existem em algum lugar?

---

## RESUMO EXECUTIVO

| Componente | Status | Blocker |
|-----------|--------|---------|
| Event Bus | Design pronto, zero código | Precisa saber como synkra/Redis funcionam hoje |
| Observabilidade | Métricas + tabelas SQL prontas | Precisa saber stack do web app + ClickUp structure |
| Squad Admin | Workflow completo com SLAs | Precisa saber intake atual + responsáveis |
| HackerVerso Squad | Pipeline + clones + quality gates mapeados | Precisa de system prompts completos dos 7 clones HV |
| 10 Clones AIOS | System prompts 100% prontos | Precisa saber onde armazenar (ali-hub? synkra?) |
| 7 Clones HV | Heurísticas prontas, prompts incompletos | Precisa escrever system prompts no formato dos 10 AIOS |
| Feedback Loops | 7 loops definidos | Depende do Event Bus |
| Cross-Squad Integration | Mapa completo HV↔todos squads | Depende do Event Bus + HV implementado |
