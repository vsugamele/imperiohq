import './css/styles.css';
import './modules/supabase.js';
import { PROJECTS_SEED } from './data/projects-seed.js';
import { SKILLS_LIST } from './data/skills-list.js';
import { MENTES_DATA } from './data/mentes-data.js';
import { EQUIPE_SEED } from './data/equipe-seed.js';

// ─────────────────────────────────────────────────────────────────────────────
// App logic (extracted from imperio-hq-v5.html)
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════


// ── Projects persisted in localStorage (seed = default)
function projectsLoad() {
  const saved = localStorage.getItem('imperio_projects_custom');
  if (saved) {
    const custom = JSON.parse(saved);
    const map = new Map();
    [...PROJECTS_SEED, ...custom].forEach(p => map.set(p.id, p));
    return Array.from(map.values());
  }
  return [...PROJECTS_SEED];
}
function projectsSaveCustom(customArr) {
  localStorage.setItem('imperio_projects_custom', JSON.stringify(customArr));
  PROJECTS = projectsLoad();
  window.projects = PROJECTS;
}
function projectsGetCustom() {
  return JSON.parse(localStorage.getItem('imperio_projects_custom') || '[]');
}
function projectUid() { return 'proj_' + Math.random().toString(36).slice(2, 9); }

let PROJECTS = projectsLoad();

const DEPARTMENTS = [
  {
    id: 'avatar', icon: '🧠', nome: 'Inteligência de Avatar',
    desc: 'Pesquisa profunda, mapeamento psicológico e sub-avatares',
    agents: [
      {
        id: 'market_researcher', icon: '🔍', nome: 'Pesquisador de Mercado', clone: 'Halbert',
        role: 'Pesquisador de Mercado & Dores Reais',
        desc: 'Busca dados reais do avatar em fóruns, grupos, reviews de produtos concorrentes, comentários do YouTube. Extrai linguagem exata, frases de dor e desejos não filtrados.',
        inputs: ['Nome do nicho/produto', 'Avatar inicial (rascunho)', 'Concorrentes principais'],
        outputs: ['Swipe File: 50 frases reais do avatar', 'Reviews negativos dos concorrentes', 'Grupos e comunidades mapeados', 'Linguagem autêntica por dor/desejo'],
        prompt: `Você é um pesquisador de mercado especialista em psicologia do consumidor.

Seu trabalho é encontrar a linguagem EXATA que o avatar usa para descrever suas dores e desejos. Não interprete — cite.

PROJETO: {projeto}
NICHO: {nicho}
AVATAR INICIAL: {avatar_rascunho}

Pesquise e retorne em JSON:

{
  "frases_dor": ["frase real 1", "frase real 2", ... (mínimo 20)],
  "frases_desejo": ["frase real 1", ... (mínimo 15)],
  "objecoes_reais": ["objeção 1", ... (mínimo 10)],
  "reviews_negativos_concorrentes": [{"produto": "", "critica": "", "dor_real": ""}],
  "comunidades": [{"plataforma": "", "nome": "", "tamanho": "", "insights": ""}],
  "trigger_events": ["evento 1", "evento 2"],
  "inimigo_percebido": "descrição do inimigo que o avatar culpa pelo problema"
}`
      },
      {
        id: 'avatar_architect', icon: '🏗️', nome: 'Avatar Arquiteto', clone: 'Kennedy',
        role: 'Arquiteto de Avatar Completo',
        desc: 'Monta o dossiê de avatar completo com todas as camadas psicológicas: desejo externo/interno, dores em 3 camadas, medos, objeções, inimigo, resultado sonhado e trigger event.',
        inputs: ['Swipe File do Pesquisador', 'Dados do nicho', 'Produto/oferta'],
        outputs: ['Dossiê Avatar Completo', 'Desejo Externo vs Interno', 'Hierarquia de Dores', 'Mapa Psicológico'],
        prompt: `Você é Kennedy, especialista em mapear a psicologia profunda do consumidor para marketing de resposta direta.

DADOS DE PESQUISA: {swipe_file}
PRODUTO: {produto}
NICHO: {nicho}

Crie o dossiê completo do avatar:

{
  "desejo_externo": "O que diz que quer (superficial, declarado)",
  "desejo_interno": "O que REALMENTE quer (emocional profundo, nunca verbalizado)",
  "dores_superficiais": ["dor consciente 1", "dor consciente 2", "dor consciente 3"],
  "dores_profundas": ["dor emocional 1 — com contexto", "dor emocional 2 — com contexto"],
  "medos_especificos": ["medo 1 com contexto", "medo 2 com contexto"],
  "objecoes_reais": [{"objecao": "", "raiz_real": "", "como_neutralizar": ""}],
  "inimigo": "Quem/o que o avatar culpa pelo problema",
  "resultado_sonhado": "Resultado específico e emocional que ele imagina ao resolver o problema",
  "trigger_event": "O evento específico que o faz buscar solução AGORA",
  "fase_consciencia": "inconsciente_do_problema | consciente_do_problema | consciente_da_solucao | comparando | decidindo",
  "sabotador_interno": "A voz interna que o impede de agir",
  "historia_que_conta": "A narrativa que ele conta para si mesmo sobre por que ainda não resolveu"
}`
      },
      {
        id: 'sub_avatar_mapper', icon: '🗂️', nome: 'Sub-Avatar Mapper', clone: 'Carlton',
        role: 'Segmentador de Sub-Avatares',
        desc: 'Segmenta o mercado em 3-5 sub-avatares distintos, cada um com urgência, disposição de compra e abordagem de comunicação diferente.',
        inputs: ['Dossiê Avatar Completo', 'Dados de pesquisa'],
        outputs: ['3-5 Sub-avatares com perfil completo', 'Ranking por urgência × dinheiro', 'Abordagem de comunicação por sub-avatar'],
        prompt: `Você é Carlton, especialista em segmentação de mercado e targeting preciso.

AVATAR BASE: {avatar_completo}
PRODUTO: {produto}

Identifique 3-5 sub-avatares distintos dentro deste mercado:

[
  {
    "nome": "Apelido descritivo (ex: 'A Mãe Pós-Parto')",
    "descricao": "Quem é esse sub-grupo especificamente",
    "tamanho_mercado": "pequeno|médio|grande",
    "urgencia": 1-10,
    "disposicao_compra": 1-10,
    "dor_primaria": "A dor mais específica deste sub-avatar",
    "desejo_primario": "O desejo mais específico",
    "como_falar_com_ele": "Ângulo de copy e comunicação ideal",
    "onde_encontrar": "Onde está online/offline",
    "gatilho_especifico": "O que especificamente o faz converter"
  }
]

Rankeie do mais para o menos lucrativo (urgência × disposição de compra).`
      },
      {
        id: 'storyboard_creator', icon: '📖', nome: 'Storyboard Creator', clone: 'Halbert',
        role: 'Criador de Arcos Narrativos',
        desc: 'Cria os storyboards narrativos do avatar — a história que ele conta para si mesmo antes de comprar. Base para VSL, copy e criativos.',
        inputs: ['Avatar Completo', 'Sub-avatares', 'Trigger events'],
        outputs: ['Storyboard por sub-avatar (5 arcos)', 'História de transformação', 'Momentos de virada narrativos'],
        prompt: `Você é Halbert, o maior copywriter de todos os tempos. Você entende que pessoas não compram produtos — compram histórias de transformação.

AVATAR: {avatar_completo}
SUB-AVATAR SELECIONADO: {sub_avatar}

Crie o storyboard narrativo completo em 5 arcos:

{
  "arco_antes": "A vida cotidiana do avatar ANTES — cenas específicas, emoções, pensamentos internos",
  "arco_trigger": "O momento exato que o fez buscar solução — específico, emocional, cinematográfico",
  "arco_busca": "Como ele pesquisa — o que vê, o que sente, quem está comparando, quais medos surgem",
  "arco_objecao": "O momento de quase-desistência — o sabotador interno falando",
  "arco_decisao": "O que quebra a resistência — o detalhe que muda tudo"
}`
      }
    ]
  },
  {
    id: 'funil', icon: '🔀', nome: 'Estratégia de Funil',
    desc: 'Jornada do lead, arquitetura da oferta e sequências de ativação',
    agents: [
      {
        id: 'lead_journey', icon: '🗺️', nome: 'Jornada do Lead', clone: 'Sugarman',
        role: 'Arquiteto da Jornada de Compra',
        desc: 'Mapeia cada etapa da jornada desde o primeiro contato até a compra e retenção, definindo a mensagem certa para cada fase de consciência.',
        inputs: ['Avatar completo', 'Produto e preço', 'Canais de tráfego'],
        outputs: ['Mapa de jornada completo (5 fases)', 'Mensagem por fase de consciência', 'Touchpoints e sequência ideal'],
        prompt: `Você é especialista em funis de conversão e jornada do cliente.

AVATAR: {avatar}
PRODUTO: {produto} | PREÇO: {preco}
CANAL PRINCIPAL: {canal}

Mapeie a jornada completa:

{
  "fases": [
    {
      "nome": "Inconsciente do Problema",
      "objetivo": "",
      "mensagem_chave": "",
      "formato_conteudo": [],
      "cta": "",
      "metricas": []
    },
    // ... repetir para: Consciente do Problema, Consciente da Solução, Comparando, Decidindo
  ],
  "touchpoints_minimos": "Número mínimo de contatos antes da compra",
  "maior_gargalo": "Onde a maioria desiste e por quê",
  "sequencia_ideal": "Descreva o caminho mais rápido da consciência à compra"
}`
      },
      {
        id: 'offer_architect', icon: '💎', nome: 'Arquiteto de Oferta', clone: 'Sugarman',
        role: 'Estruturador de Ofertas Irresistíveis',
        desc: 'Cria a estrutura completa da oferta: produto core, bônus estratégicos, order bump, upsell e stack de valor.',
        inputs: ['Produto principal', 'Avatar e dores', 'Preço alvo'],
        outputs: ['Oferta core estruturada', 'Stack de valor (produto + bônus)', 'Order bump', 'Upsell/Downsell', 'Tabela de valor percebido'],
        prompt: `Você é arquiteto de ofertas de alta conversão.

PRODUTO: {produto}
PREÇO: {preco}
AVATAR: {avatar}
DORES PRINCIPAIS: {dores}
RESULTADO SONHADO: {resultado_sonhado}

Monte a oferta completa:

{
  "produto_core": {"nome": "", "descricao": "", "valor_percebido": ""},
  "bonus": [{"nome": "", "descricao": "", "valor_percebido": "", "por_que_estrategico": ""}],
  "order_bump": {"nome": "", "descricao": "", "preco": "", "taxa_conversao_esperada": ""},
  "upsell": {"nome": "", "descricao": "", "preco": "", "quando_oferecer": ""},
  "downsell": {"nome": "", "preco": "", "quando_oferecer": ""},
  "total_valor_percebido": "",
  "justificativa_preco": "Por que o preço pedido é irrisório vs valor"
}`
      }
    ]
  },
  {
    id: 'copy', icon: '✍️', nome: 'Copy & Conversão',
    desc: 'Páginas de venda, VSL, email sequences e headlines',
    agents: [
      {
        id: 'page_writer', icon: '📄', nome: 'Page Writer', clone: 'Halbert/Bencivenga',
        role: 'Escritor de Páginas de Alta Conversão',
        desc: 'Escreve páginas de vendas completas seguindo estrutura de resposta direta: headline → problema → agitação → solução → mecanismo → prova → oferta → garantia → CTA.',
        inputs: ['Avatar completo + storyboard', 'Oferta estruturada', 'Mecanismo único'],
        outputs: ['Página de vendas completa', 'Headline principal + variações (5)', 'Subheadlines', 'Bullets de prova'],
        prompt: `Você é Bencivenga e Halbert fundidos. O melhor copywriter do mundo.

AVATAR: {avatar}
STORYBOARD: {storyboard}
OFERTA: {oferta}
MECANISMO ÚNICO: {mecanismo}
PRODUTO: {produto} | PREÇO: {preco}

Escreva a página de vendas completa:

1. HEADLINE (e 4 variações)
2. SUBHEADLINE (abre o loop)
3. LEAD (agitação da dor — primeiros 3 parágrafos são decisivos)
4. HISTÓRIA DO HERÓI (ou prova de conceito)
5. IDENTIFICAÇÃO DO INIMIGO
6. APRESENTAÇÃO DO MECANISMO
7. PROVA SOCIAL (estrutura de depoimentos)
8. OFERTA + STACK
9. GARANTIA
10. URGÊNCIA/ESCASSEZ (se aplicável)
11. CTA FINAL`
      },
      {
        id: 'vsl_scripter', icon: '🎬', nome: 'VSL Scripter', clone: 'Kern',
        role: 'Roteirista de Vídeos de Venda',
        desc: 'Cria roteiros de VSL com estrutura de engajamento emocional, revelação do mecanismo e conversão natural.',
        inputs: ['Avatar + storyboard', 'Oferta', 'Mecanismo único', 'Duração alvo'],
        outputs: ['Roteiro VSL completo', 'Hook (primeiros 15 segundos)', 'Estrutura de revelação', 'Script para gravação'],
        prompt: `Você é Frank Kern criando um VSL que converte frio para venda.

AVATAR: {avatar}
OFERTA: {oferta}
MECANISMO: {mecanismo}
DURAÇÃO: {duracao} minutos

Estrutura do roteiro:
[0:00-0:15] HOOK — Por que continuar assistindo
[0:15-2:00] IDENTIFICAÇÃO — Fazer o avatar dizer "você está falando de mim"
[2:00-5:00] AGITAÇÃO — Aprofundar a dor sem solução ainda
[5:00-8:00] VIRADA — "Descobri algo que mudou tudo"
[8:00-12:00] REVELAÇÃO DO MECANISMO
[12:00-15:00] PROVA — Resultados + depoimentos
[15:00-17:00] OFERTA + STACK
[17:00-18:00] GARANTIA + CTA`
      },
      {
        id: 'email_writer', icon: '📧', nome: 'Email Copywriter', clone: 'Kennedy',
        role: 'Escritor de Sequências de Email',
        desc: 'Escreve sequências de email para nutrição, recuperação e upsell. Cada email com história, educação ou prova social.',
        inputs: ['Avatar + fase de consciência', 'Oferta', 'Jornada do lead'],
        outputs: ['Sequência de 5-7 emails por fase', 'Subject lines (3 variações cada)', 'CTAs específicos por email'],
        prompt: `Você é Kennedy escrevendo emails que as pessoas realmente leem.

AVATAR: {avatar}
PRODUTO: {produto}
FASE DA SEQUÊNCIA: {fase} (nurturing | pré-lançamento | carrinho aberto | recuperação)

Escreva sequência de 5 emails:

Email 1 — HISTÓRIA DE IDENTIFICAÇÃO
Email 2 — EDUCAÇÃO + REVELAÇÃO DO PROBLEMA REAL  
Email 3 — PROVA SOCIAL (história de transformação de cliente)
Email 4 — O INIMIGO (por que as soluções antigas falham)
Email 5 — OFERTA + URGÊNCIA

Para cada email: Subject × 3 variações + Corpo completo + PS estratégico`
      }
    ]
  },
  {
    id: 'prompts', icon: '⚡', nome: 'Prompts & IA Execution',
    desc: 'Biblioteca de prompts, orquestração de modelos e automação',
    agents: [
      {
        id: 'prompt_copy_gen', icon: '📝', nome: 'Gerador de Prompts Copy', clone: 'Prompt Architect',
        role: 'Arquiteto de Prompts de Copy',
        desc: 'Cria prompts altamente especializados para gerar copy, variações e testes A/B usando IA para o projeto específico.',
        inputs: ['Avatar', 'Produto', 'Tipo de copy necessária'],
        outputs: ['Prompts de copy por formato', 'System prompts por agente copy', 'Biblioteca de variações'],
        prompt: `Você é especialista em engenharia de prompts para copy de marketing.

PROJETO: {projeto}
AVATAR: {avatar_resumo}
PRODUTO: {produto}

Crie a biblioteca de prompts para este projeto:

1. PROMPT PARA HEADLINES (30 variações por angulo)
2. PROMPT PARA BULLETS DE PROVA
3. PROMPT PARA DEPOIMENTOS SINTÉTICOS (estrutura)
4. PROMPT PARA VARIAÇÕES DE CTA
5. PROMPT PARA SUBJECT LINES DE EMAIL
6. PROMPT PARA HOOKS DE CRIATIVO (texto de anúncio)

Para cada prompt: inclua exemplos de output esperado.`
      },
      {
        id: 'prompt_creative_gen', icon: '🖼️', nome: 'Gerador de Prompts Criativos', clone: 'Visual Architect',
        role: 'Arquiteto de Prompts Visuais',
        desc: 'Cria prompts para geração de imagens e vídeos em Midjourney, DALL-E, Runway, Leonardo. Cada prompt otimizado para CTR.',
        inputs: ['Avatar', 'Produto', 'Estética da marca', 'Formato do criativo'],
        outputs: ['Prompts Midjourney prontos', 'Prompts Runway/vídeo', 'Diretrizes visuais da marca', 'Biblioteca de estilos'],
        prompt: `Você é diretor criativo especializado em criativos de performance.

PROJETO: {projeto}
AVATAR: {avatar}
PRODUTO: {produto}
ESTÉTICA: {estetica}

Crie prompts otimizados para:

1. IMAGENS ESTÁTICAS (Midjourney/Flux)
   - Criativo de problema/dor
   - Criativo de transformação/resultado
   - Criativo de prova social/depoimento

2. VÍDEOS CURTOS (Runway/Pika)
   - Hook visual 0-3 segundos
   - Demonstração do mecanismo
   - Resultado before/after

Cada prompt deve incluir: estilo visual + composição + mood + lighting + aspect ratio`
      }
    ]
  },
  {
    id: 'design', icon: '🎨', nome: 'Design & Criativos',
    desc: 'Sites, landing pages, anúncios visuais e animações',
    agents: [
      {
        id: 'creative_strategist', icon: '💡', nome: 'Creative Strategist', clone: 'Ogilvy',
        role: 'Estrategista de Criativos de Performance',
        desc: 'Desenvolve conceitos e ângulos para criativos de anúncio. Pensa nos hooks visuais, nos formatos mais adequados e nas abordagens que geram mais atenção e cliques.',
        inputs: ['Avatar + dores', 'Produto', 'Concorrentes (criativos)'],
        outputs: ['10 ângulos de criativo', 'Formatos por ângulo', 'Referências visuais', 'Briefing para designer'],
        prompt: `Você é David Ogilvy combinado com um performance marketer moderno.

AVATAR: {avatar}
PRODUTO: {produto}
DORES PRINCIPAIS: {dores}

Desenvolva 10 ângulos de criativo diferentes:

Para cada ângulo:
{
  "angulo": "Nome e conceito do ângulo",
  "hook_visual": "O que o olho vê primeiro",
  "hook_texto": "Os primeiros 6 caracteres de texto",
  "formato": "imagem_estatica | carrossel | ugc | video_curto | story",
  "emocao_alvo": "medo | ambicao | curiosidade | raiva | esperanca",
  "plataforma_ideal": "Meta | TikTok | YouTube",
  "por_que_funciona": "A psicologia por trás"
}`
      },
      {
        id: 'web_designer', icon: '🌐', nome: 'Web Designer', clone: 'Webflow Master',
        role: 'Designer de Sites e Landing Pages',
        desc: 'Especifica e projeta landing pages, sites de vendas e páginas de checkout com foco em conversão e experiência visual premium.',
        inputs: ['Copy da página', 'Identidade visual da marca', 'Referências de design'],
        outputs: ['Wireframe detalhado', 'Especificações de design', 'Componentes e seções', 'Mobile-first layout'],
        prompt: `Você é designer especializado em landing pages de alta conversão.

PÁGINA: {tipo_pagina}
COPY: {copy_resumo}
MARCA: {marca}

Especifique o design:

1. ESTRUTURA DE SEÇÕES (ordem, objetivo de cada seção)
2. PALETA DE CORES (hex codes) + TIPOGRAFIA
3. HERO SECTION (layout detalhado)
4. SEÇÕES DE PROVA SOCIAL (formato dos depoimentos)
5. CTA BUTTONS (copy + cor + posicionamento)
6. MOBILE ADAPTATIONS
7. ANIMAÇÕES SUGERIDAS`
      },
      {
        id: 'olho_falcao', icon: '🦅', nome: 'Olho de Falcão', clone: 'Ogilvy + Data Sherlock',
        role: 'Avaliador Crítico de Criativos',
        desc: 'Analisa criativos ativos e gera diagnóstico de performance baseado em copy, psicologia visual e dados. Identifica o que está roubando a atenção, o que está matando o CTR e o que deve ser testado.',
        inputs: ['Descrição ou URL do criativo', 'Métricas atuais (CTR, CPM, Thumbstop)', 'Avatar do projeto', 'Plataforma (Meta/TikTok/Google)'],
        outputs: ['Score do criativo (0-10)', 'Diagnóstico de hook visual', 'Diagnóstico de copy', '3 variações de melhoria', 'Próximo teste A/B sugerido'],
        prompt: `Você é o Olho de Falcão — um avaliador implacável de criativos com a mente de Ogilvy e os dados de um growth hacker.

PROJETO: {projeto}
CRIATIVO: {descricao_criativo}
MÉTRICAS: CTR: {ctr}% | CPM: R\${cpm} | Thumbstop: {thumbstop}%
AVATAR: {avatar_resumo}
PLATAFORMA: {plataforma}

Faça a autópsia completa:

{
  "score_geral": 0-10,
  "hook_visual": {
    "nota": 0-10,
    "o_que_funciona": "",
    "o_que_mata_atencao": "",
    "melhoria": ""
  },
  "hook_texto": {
    "nota": 0-10,
    "analise": "",
    "variacao_a": "",
    "variacao_b": ""
  },
  "alinhamento_avatar": {
    "nota": 0-10,
    "analise": ""
  },
  "diagnostico_metricas": {
    "thumbstop": "baixo|ok|bom — o que indica",
    "ctr": "baixo|ok|bom — o que indica",
    "proximo_gargalo": ""
  },
  "3_variacoes_prioridade": [
    {"mudanca": "", "por_que": "", "impacto_esperado": ""}
  ],
  "proximo_teste_ab": "O teste mais importante agora"
}`
      }
    ]
  },
  {
    id: 'trafego', icon: '🚦', nome: 'Tráfego & Distribuição',
    desc: 'Campanhas, mídia e escalonamento',
    agents: [
      {
        id: 'campaign_architect', icon: '📊', nome: 'Campaign Architect', clone: 'Media Commander',
        role: 'Arquiteto de Campanhas de Tráfego',
        desc: 'Estrutura campanhas completas no Meta, Google ou TikTok: objetivos, públicos, segmentações, estrutura de conjuntos e orçamento inicial.',
        inputs: ['Sub-avatares', 'Criativos disponíveis', 'Orçamento', 'Plataforma'],
        outputs: ['Estrutura de campanha completa', 'Públicos e segmentações', 'Estratégia de bidding', 'Budget allocation'],
        prompt: `Você é especialista em mídia paga de performance.

PROJETO: {projeto}
PLATAFORMA: {plataforma}
ORÇAMENTO: {orcamento}
SUB-AVATARES: {sub_avatares}
CRIATIVOS: {criativos}

Monte a estrutura de campanha:

{
  "objetivo_campanha": "",
  "estrutura": {
    "campanhas": [
      {
        "nome": "",
        "objetivo": "",
        "orcamento": "",
        "conjuntos": [
          {
            "nome": "",
            "publico": "",
            "segmentacao": "",
            "criativos": [],
            "bid_strategy": ""
          }
        ]
      }
    ]
  },
  "fase_inicial": "Como testar sem desperdiçar",
  "criterios_escala": "Quando e como escalar",
  "alertas_pausa": "Quando pausar criativos/conjuntos"
}`
      },
      {
        id: 'data_analyst', icon: '📈', nome: 'Analista de Dados', clone: 'Data Sherlock',
        role: 'Analista de Performance e Otimização',
        desc: 'Analisa métricas das campanhas, identifica padrões de performance e sugere otimizações baseadas em dados.',
        inputs: ['Métricas das campanhas', 'Resultados de testes', 'Benchmarks do nicho'],
        outputs: ['Análise de performance', 'Diagnóstico de gargalos', 'Próximas ações priorizadas'],
        prompt: `Você é analista de performance especializado em funis de marketing digital.

DADOS: {metricas}
PRODUTO: {produto} | PREÇO: {preco}
PERÍODO: {periodo}

Analise e retorne:

{
  "performance_resumo": "Estado atual em 3 linhas",
  "principais_gargalos": [{"etapa": "", "metrica": "", "impacto": "", "acao": ""}],
  "o_que_esta_funcionando": [],
  "proximas_3_acoes": [{"acao": "", "impacto_esperado": "", "prioridade": "alta|media|baixa"}],
  "projecao_30_dias": "Com as ações aplicadas"
}`
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let currentProject = null;
let currentTab = 'briefing';
let currentAgent = null;

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
function init() {
  renderSidebar();
  renderOverviewProjects();
  updateMetrics();
}

function updateMetrics() {
  const el = document.getElementById('metric-total-projetos');
  if (el) el.textContent = PROJECTS.length;
}

function renderSidebar() {
  window.projects = PROJECTS; // sync global so OpenClaw Flow & other views can read
  const cats = {};
  const catIcons = { iGaming: '🎰', Lançamentos: '🚀', Infoprodutos: '📦', Nutraceuticos: '🌿', Ecommerce: '🛍️', Forex: '📈' };
  PROJECTS.forEach(p => {
    if (!cats[p.categoria]) cats[p.categoria] = [];
    cats[p.categoria].push(p);
  });
  const container = document.getElementById('sidebar-projects');
  let html = '';
  Object.entries(cats).forEach(([cat, projects]) => {
    html += `<div class="cat-header">${catIcons[cat] || '📁'} ${cat}</div>`;
    projects.forEach(p => {
      const badge = p.vende ? '<span class="badge sell">SELL</span>' : `<span class="badge">${p.status}</span>`;
      html += `<div class="nav-item" onclick="openProject('${p.id}')" id="nav-${p.id}">
        <span class="icon">${p.icon}</span>
        <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nome}</span>
        ${badge}
      </div>`;
    });
  });
  container.innerHTML = html;
}

function renderOverviewProjects() {
  const container = document.getElementById('overview-projects');
  let html = '';
  PROJECTS.forEach(p => {
    const pct = Math.round(Object.values(p.pipeline).reduce((a, b) => a + b, 0) / Object.values(p.pipeline).length);
    const statusClass = p.vende ? 'tag-sell' : (p.status === 'Rascunho' ? 'tag-draft' : 'tag-active');
    html += `<div class="project-row" onclick="openProject('${p.id}')">
      <span class="pr-icon">${p.icon}</span>
      <div class="pr-name">${p.nome}</div>
      <div style="width:80px; margin-right:10px">
        <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div style="font-size:10px; color:var(--text3); width:30px">${pct}%</div>
      <span class="pr-status tag ${statusClass}">${p.vende ? '● SELL' : p.status}</span>
    </div>`;
  });
  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════
function hideAllPanels() {
  // Esconde TODOS os painéis .panel no documento (dentro e fora do #main)
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = '';  // Limpa qualquer inline display
  });
  // Esconde painéis que ficam fora do #main (cron, skills, financas)
  ['view-cron', 'view-skills', 'view-financas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); el.style.display = ''; }
  });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

function showOverview() {
  hideAllPanels();
  document.getElementById('view-overview').classList.add('active');
  document.getElementById('nav-overview').classList.add('active');
}

function showSection(s) {
  hideAllPanels();
  const el = document.getElementById('view-' + s);
  if (el) el.classList.add('active');
}

function openProject(id) {
  currentProject = PROJECTS.find(p => p.id === id);
  if (!currentProject) return;

  hideAllPanels();
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  document.getElementById('view-project').classList.add('active');

  renderProjectHero();
  showTab('briefing');
}

function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll('#proj-tabs .tab').forEach(t => t.classList.remove('active'));
  const tabs = document.querySelectorAll('#proj-tabs .tab');
  const tabMap = ['briefing', 'expert', 'avatar', 'branding', 'kpis', 'pipeline', 'assets', 'midia', 'docs'];
  const idx = tabMap.indexOf(tab);
  if (tabs[idx]) tabs[idx].classList.add('active');

  document.querySelectorAll('#content .panel').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('tab-' + tab);
  if (el) el.classList.add('active');

  if (tab === 'briefing') renderBriefing();
  if (tab === 'expert') renderExpert();
  if (tab === 'avatar') renderAvatar();
  if (tab === 'branding') renderBranding();
  if (tab === 'kpis') renderKPIs();
  if (tab === 'pipeline') renderPipeline();
  if (tab === 'assets') renderAssets();
  if (tab === 'midia') renderMidia();
  if (tab === 'docs') renderDocs();
}

// ═══════════════════════════════════════════════════════
//  RENDER PROJECT HERO
// ═══════════════════════════════════════════════════════
function renderProjectHero() {
  const p = currentProject;
  const pct = Math.round(Object.values(p.pipeline).reduce((a, b) => a + b, 0) / Object.values(p.pipeline).length);
  const container = document.getElementById('proj-hero-container');
  // Find subprojects
  const subprojects = PROJECTS.filter(sp => sp.parent_id === p.id);
  // Find parent if this is a subproject
  const parent = p.parent_id ? PROJECTS.find(x => x.id === p.parent_id) : null;
  const parentBreadcrumb = parent ? `<div style="font-size:10px;color:var(--text3);margin-bottom:2px;cursor:pointer" onclick="openProject('${parent.id}')">
        ← ${parent.icon} ${parent.nome}
      </div>` : '';
  const subprojectsHtml = subprojects.length > 0 ? `
      <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
        ${subprojects.map(sp => `<span onclick="openProject('${sp.id}')" style="cursor:pointer;font-size:10px;background:var(--surface2);border:1px solid var(--border);padding:3px 10px;border-radius:12px;color:var(--text2);transition:.15s" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">${sp.icon} ${sp.nome}</span>`).join('')}
        <span onclick="openCreateProject('${p.id}')" style="cursor:pointer;font-size:10px;background:transparent;border:1px dashed var(--border2);padding:3px 10px;border-radius:12px;color:var(--text3)">+ Sub</span>
      </div>` : '';
  container.innerHTML = `
    <div class="proj-hero" style="border-radius:0; border-left:none; border-right:none; border-top:none; margin-bottom:0">
      <div class="proj-icon">${p.icon}</div>
      <div class="proj-meta">
        ${parentBreadcrumb}
        <div style="display:flex;align-items:center;gap:8px">
          <div class="proj-name">${p.nome}</div>
          <button onclick="renameProject('${p.id}')" style="background:none;border:1px solid var(--border2);color:var(--text3);padding:2px 8px;border-radius:5px;cursor:pointer;font-size:10px" title="Renomear">✏️</button>
        </div>
        <div class="proj-sub">${p.produto} · ${p.preco}</div>
        <div class="proj-tags">
          <span class="tag tag-cat">${p.categoria}</span>
          ${p.parent_id ? '<span class="tag" style="background:rgba(155,127,232,.12);color:#9b7fe8;border-color:rgba(155,127,232,.3)">SUB</span>' : ''}
          ${p.vende ? '<span class="tag tag-sell">● VENDENDO</span>' : `<span class="tag tag-active">${p.status}</span>`}
        </div>
        ${subprojectsHtml}
      </div>
      <div class="proj-actions">
        <div style="text-align:right">
          <div style="font-size:22px; font-weight:700; color:var(--gold)">${pct}%</div>
          <div style="font-size:10px; color:var(--text3)">Pipeline</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-gold" onclick="showTab('pipeline')">Ver Pipeline</button>
          ${!p.parent_id ? `<button class="btn btn-sm btn-outline" onclick="openCreateProject('${p.id}')">+ Sub</button>` : ''}
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════
//  BRIEFING TAB — N PRODUCTS × N FUNNELS
// ═══════════════════════════════════════════════════════
function renderBriefing() {
  const p = currentProject;

  // Auto-migrate legacy single-product projects
  if (!p.produtos) {
    p.produtos = [{
      id: 'prod-' + Date.now(),
      nome: p.produto || 'Produto Principal',
      preco: p.preco || '',
      tipo: 'Digital',
      status: p.status || 'Ativo',
      objetivo: p.objetivo || '',
      contexto: p.contexto || '',
      mecanismo: p.mecanismo || '',
      funis: []
    }];
  }

  const el = document.getElementById('tab-briefing');

  // Migrar p.links (objeto) para p.linksArr (array) se necessário
  if (!p.linksArr) {
    p.linksArr = Object.entries(p.links || {}).map(([tipo, url]) => ({ tipo, url }));
    if (p.linksArr.length === 0) p.linksArr = [{ tipo: '', url: '' }];
  }
  const linksHtml = `
    <div id="project-links-list">
      ${p.linksArr.map((lk, li) => `
      <div class="link-row" style="display:flex;gap:6px;margin-bottom:6px;align-items:center">
        <input class="brief-input link-type" value="${lk.tipo || ''}" placeholder="Tipo (ex: site)" style="flex:0 0 120px" onblur="saveProjectLink(${li},'tipo',this.value)">
        <input class="brief-input link-url" value="${lk.url || ''}" placeholder="https://" style="flex:1" onblur="saveProjectLink(${li},'url',this.value)">
        <button onclick="removeProjectLink(${li})" style="background:none;border:1px solid #e05c5c33;color:#e05c5c;border-radius:5px;padding:2px 8px;font-size:12px;cursor:pointer;flex-shrink:0">✕</button>
      </div>`).join('')}
    </div>
    <button onclick="addProjectLink()" class="btn btn-sm btn-outline" style="margin-top:4px;width:100%">+ Adicionar Link</button>`;

  const produtosHtml = p.produtos.map((prod, pi) => {
    const tipoOpts = ['Digital', 'Físico', 'Serviço', 'Mentoria', 'Software', 'Evento'].map(t =>
      `<option ${prod.tipo === t ? 'selected' : ''}>${t}</option>`).join('');
    const statusOpts = ['Ativo', 'Em Construção', 'Rascunho', 'Pausado', 'Descontinuado'].map(s =>
      `<option ${prod.status === s ? 'selected' : ''}>${s}</option>`).join('');
    const funisHtml = (prod.funis || []).map((f, fi) => `
          <div class="funil-row" style="display:flex;gap:8px;align-items:center;padding:8px;background:var(--surface2);border-radius:6px;margin-bottom:6px">
            <span style="font-size:14px">🔻</span>
            <input class="brief-input" style="flex:2" value="${f.nome}" placeholder="Nome do Funil" onblur="saveFunil(${pi},${fi},'nome',this.value)">
            <select class="brief-input" style="flex:1" onchange="saveFunil(${pi},${fi},'tipo',this.value)">
              ${['Perpétuo', 'Lançamento', 'VSL', 'Webinar', 'Email', 'Outro'].map(t => `<option ${f.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
            <input class="brief-input" style="flex:2" value="${f.url || ''}" placeholder="URL do funil" onblur="saveFunil(${pi},${fi},'url',this.value)">
            <select class="brief-input" style="flex:1" onchange="saveFunil(${pi},${fi},'status',this.value)">
              ${['Ativo', 'Em Construção', 'Rascunho', 'Pausado'].map(s => `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <button onclick="removeFunil(${pi},${fi})" style="background:none;border:1px solid #e05c5c22;color:#e05c5c;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:12px">✕</button>
          </div>`).join('');

    return `<div class="card" style="margin-bottom:12px;border-left:3px solid var(--gold)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:18px">📦</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:var(--text)">${prod.nome || 'Produto ' + (pi + 1)}</div>
                <div style="font-size:11px;color:var(--gold)">${prod.preco ? prod.preco : 'Preço não definido'} · ${prod.tipo}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="toggleProdCard(${pi})" class="btn btn-sm btn-outline" id="prod-toggle-${pi}">▾ Detalhes</button>
              <button onclick="removeProduto(${pi})" class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c">✕</button>
            </div>
          </div>
          <div id="prod-card-${pi}">
            <div class="grid2" style="margin-bottom:10px">
              <div class="brief-field"><div class="brief-label">Nome do Produto</div><input class="brief-input" value="${prod.nome || ''}" onblur="saveProduto(${pi},'nome',this.value)"></div>
              <div class="brief-field"><div class="brief-label">Tipo</div><select class="brief-input" onchange="saveProduto(${pi},'tipo',this.value)">${tipoOpts}</select></div>
              <div class="brief-field"><div class="brief-label">Preço</div><input class="brief-input" value="${prod.preco || ''}" placeholder="R$997" onblur="saveProduto(${pi},'preco',this.value)"></div>
              <div class="brief-field"><div class="brief-label">Status</div><select class="brief-input" onchange="saveProduto(${pi},'status',this.value)">${statusOpts}</select></div>
            </div>
            <div class="brief-field"><div class="brief-label">Objetivo Principal</div><textarea class="brief-input" rows="2" onblur="saveProduto(${pi},'objetivo',this.value)">${prod.objetivo || ''}</textarea></div>
            <div class="brief-field"><div class="brief-label">Contexto Atual / Situação</div><textarea class="brief-input" rows="2" onblur="saveProduto(${pi},'contexto',this.value)">${prod.contexto || ''}</textarea></div>
            <div class="brief-field"><div class="brief-label">Mecanismo Único</div><input class="brief-input" value="${prod.mecanismo || ''}" placeholder="O que torna este produto único..." onblur="saveProduto(${pi},'mecanismo',this.value)"></div>
            <!-- FUNIS -->
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <div style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;text-transform:uppercase">🔻 Funis do Produto (${(prod.funis || []).length})</div>
                <button onclick="addFunil(${pi})" class="btn btn-sm btn-outline">+ Funil</button>
              </div>
              ${funisHtml || '<div style="font-size:11px;color:var(--text3);padding:8px 0">Nenhum funil. Clique em "+ Funil" para adicionar.</div>'}
            </div>
          </div>
        </div>`;
  }).join('');

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">📁 Briefing: ${p.nome}</div>
      <div style="display:flex;gap:8px">
        <button onclick="showTab('expert')" class="btn btn-sm btn-outline">🎤 Ir para Expert</button>
        <button onclick="showTab('avatar')" class="btn btn-sm btn-outline">→ Ir para Avatar</button>
      </div>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-title">📁 Dados do Projeto</div>
          <div class="brief-field"><div class="brief-label">Nome do Projeto</div><input class="brief-input" value="${p.nome}" onblur="currentProject.nome=this.value;renderProjectHero();saveProject()"></div>
          <div class="brief-field"><div class="brief-label">Categoria</div><input class="brief-input" value="${p.categoria || ''}" onblur="currentProject.categoria=this.value;saveProject()"></div>
          <div class="brief-field"><div class="brief-label">Orçamento Tráfego</div><input class="brief-input" value="${p.orcamento_trafego || ''}" onblur="currentProject.orcamento_trafego=this.value;saveProject()"></div>
          <div class="brief-field"><div class="brief-label">Status Geral</div>
            <select class="brief-input" onchange="currentProject.status=this.value;saveProject()">
              <option ${p.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
              <option ${p.status === 'Rascunho' ? 'selected' : ''}>Rascunho</option>
              <option ${p.status === 'Pausado' ? 'selected' : ''}>Pausado</option>
              <option ${p.status === 'Em Construção' ? 'selected' : ''}>Em Construção</option>
            </select>
          </div>
        </div>
        <div class="card">
          <div class="card-title">🔗 Links do Projeto</div>
          ${linksHtml}
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-title">⚙️ Pipeline Rápido</div>
          ${Object.entries(p.pipeline).map(([dept, pct]) => {
    const deptNames = { avatar: 'Avatar', funil: 'Funil', copy: 'Copy', prompts: 'Prompts', design: 'Design', trafego: 'Tráfego' };
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:11px;color:var(--text2);width:60px">${deptNames[dept] || dept}</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
              <span style="font-size:10px;color:var(--text3);width:28px;text-align:right">${pct}%</span>
            </div>`;
  }).join('')}
        </div>
      </div>
    </div>

    <!-- ANÁLISE DE CONCORRENTES -->
    ${renderConcorrentesSection(p)}

    <!-- PRODUTOS -->
    <div style="margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:13px;font-weight:700;color:var(--text)">📦 Produtos do Projeto <span style="color:var(--text3);font-size:11px;font-weight:400">(${p.produtos.length} produto${p.produtos.length !== 1 ? 's' : ''})</span></div>
      <button onclick="addProduto()" class="btn btn-gold">+ Novo Produto</button>
    </div>
    ${produtosHtml}`;
}

function saveProduto(pi, key, val) {
  if (!currentProject.produtos[pi]) return;
  currentProject.produtos[pi][key] = val;
  // update hero if name/price changed
  if (key === 'nome' || key === 'preco') renderProjectHero();
  saveProject();
}

function addProduto() {
  if (!currentProject.produtos) currentProject.produtos = [];
  currentProject.produtos.push({ id: 'prod-' + Date.now(), nome: 'Novo Produto', preco: '', tipo: 'Digital', status: 'Rascunho', objetivo: '', contexto: '', mecanismo: '', funis: [] });
  renderBriefing();
}

function removeProduto(pi) {
  if (!confirm('Remover este produto e seus funis?')) return;
  currentProject.produtos.splice(pi, 1);
  renderBriefing();
}

function toggleProdCard(pi) {
  const el = document.getElementById('prod-card-' + pi);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? '' : 'none';
  const btn = document.getElementById('prod-toggle-' + pi);
  if (btn) btn.textContent = el.style.display === 'none' ? '▸ Detalhes' : '▾ Detalhes';
}

function addFunil(pi) {
  if (!currentProject.produtos[pi].funis) currentProject.produtos[pi].funis = [];
  currentProject.produtos[pi].funis.push({ nome: 'Novo Funil', tipo: 'Perpétuo', url: '', status: 'Rascunho' });
  renderBriefing();
}

function saveFunil(pi, fi, key, val) {
  if (currentProject.produtos[pi] && currentProject.produtos[pi].funis[fi])
    currentProject.produtos[pi].funis[fi][key] = val;
  saveProject();
}

function removeFunil(pi, fi) {
  currentProject.produtos[pi].funis.splice(fi, 1);
  renderBriefing();
  saveProject();
}

// ─── PERSISTÊNCIA SUPABASE ───────────────────────────────────
// Debounced: agrupa mudanças em burst de 800ms antes de salvar
let _saveProjectTimer = null;
function saveProject() {
  if (!currentProject || !currentProject._custom) return;
  clearTimeout(_saveProjectTimer);
  _saveProjectTimer = setTimeout(() => {
    if (window.SB && typeof window.SB.upsertProject === 'function') {
      window.SB.upsertProject(currentProject)
        .then(() => console.log('[SB] ✅ Projeto salvo:', currentProject.nome))
        .catch(e => console.warn('[SB] ❌ Erro ao salvar projeto:', e));
    }
    // Também salva no localStorage como fallback
    if (typeof projectsSaveCustom === 'function') {
      const custom = typeof projectsGetCustom === 'function' ? projectsGetCustom() : [];
      const idx = custom.findIndex(p => p.id === currentProject.id);
      if (idx >= 0) custom[idx] = currentProject;
      else custom.push(currentProject);
      projectsSaveCustom(custom);
    }
  }, 800);
}

// Links do projeto
function saveProjectLink(idx, field, val) {
  if (!currentProject.linksArr) return;
  if (!currentProject.linksArr[idx]) return;
  currentProject.linksArr[idx][field] = val;
  // Sincroniza linksArr de volta para o objeto links
  currentProject.links = {};
  currentProject.linksArr.forEach(lk => { if (lk.tipo) currentProject.links[lk.tipo] = lk.url || ''; });
  saveProject();
}

function addProjectLink() {
  if (!currentProject.linksArr) currentProject.linksArr = [];
  currentProject.linksArr.push({ tipo: '', url: '' });
  renderBriefing();
  saveProject();
}

function removeProjectLink(idx) {
  if (!currentProject.linksArr) return;
  currentProject.linksArr.splice(idx, 1);
  currentProject.links = {};
  currentProject.linksArr.forEach(lk => { if (lk.tipo) currentProject.links[lk.tipo] = lk.url || ''; });
  renderBriefing();
  saveProject();
}

// ═══════════════════════════════════════════════════════
//  AVATAR TAB
// ═══════════════════════════════════════════════════════
function renderAvatar() {
  const av = currentProject.avatar;
  const el = document.getElementById('tab-avatar');

  const makeField = (label, value, key, multiline = false) => {
    if (multiline) {
      return `<div class="brief-field">
        <div class="brief-label">${label}</div>
        <textarea class="brief-input" rows="2" onblur="if(!currentProject.avatar)currentProject.avatar={};currentProject.avatar['${key}']=this.value;saveProject()">${value || ''}</textarea>
      </div>`;
    }
    return `<div class="field-row">
      <div class="field-label">${label}</div>
      <div class="field-val editable" contenteditable="true" data-placeholder="Não definido" onblur="if(!currentProject.avatar)currentProject.avatar={};currentProject.avatar['${key}']=this.innerText;saveProject()">${value || ''}</div>
    </div>`;
  };

  const makeTagList = (label, items) => `
    <div style="margin-bottom:10px">
      <div class="brief-label">${label}</div>
      <div class="tag-list" style="margin-top:4px">
        ${(items || []).map(i => `<span class="tag-item">${i}</span>`).join('')}
        <span class="tag-item" style="cursor:pointer; color:var(--text3); border-style:dashed">+ add</span>
      </div>
    </div>`;

  const subAvatarsHtml = (av.sub_avatares || []).length > 0
    ? `<div class="grid3" style="margin-top:8px">
        ${av.sub_avatares.map((sa, i) => `
          <div class="sub-avatar-card">
            <div class="sub-avatar-name">${sa.nome}</div>
            <div class="sub-avatar-desc">${sa.desc}</div>
            <div class="score-bar">
              <span class="score-label">Urgência</span>
              <div class="score-dots">${Array.from({ length: 10 }, (_, j) => `<div class="score-dot${j < sa.urgencia ? ' fill' : ''}"></div>`).join('')}</div>
              <span style="font-size:10px;color:var(--gold);margin-left:4px">${sa.urgencia}/10</span>
            </div>
            <div class="score-bar">
              <span class="score-label">Dinheiro</span>
              <div class="score-dots">${Array.from({ length: 10 }, (_, j) => `<div class="score-dot${j < sa.dinheiro ? ' fill' : ''}"></div>`).join('')}</div>
              <span style="font-size:10px;color:var(--gold);margin-left:4px">${sa.dinheiro}/10</span>
            </div>
          </div>`).join('')}
        <div class="sub-avatar-card" style="display:flex;align-items:center;justify-content:center;border-style:dashed;cursor:pointer;color:var(--text3)">
          + Novo Sub-Avatar
        </div>
      </div>`
    : `<div class="empty-state" style="padding:20px">
        <div class="es-icon">👤</div>
        <div class="es-text">Nenhum sub-avatar mapeado</div>
        <div class="es-sub">Execute o Sub-Avatar Mapper</div>
        <button class="btn btn-sm btn-purple" style="margin-top:8px" onclick="openAgent('avatar','sub_avatar_mapper')">▶ Executar Agente</button>
      </div>`;

  const storyboardHtml = (av.storyboard || []).length > 0
    ? av.storyboard.map(s => `<div class="story-card"><div class="story-arc">${s.arc}</div><div class="story-text">${s.text}</div></div>`).join('')
    : `<div class="empty-state" style="padding:20px">
        <div class="es-icon">📖</div>
        <div class="es-text">Storyboard não criado</div>
        <button class="btn btn-sm btn-purple" style="margin-top:8px" onclick="openAgent('avatar','storyboard_creator')">▶ Criar Storyboard</button>
      </div>`;

  el.innerHTML = `
    <!-- HEADER COM AÇÕES -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <div style="font-size:14px; font-weight:600; color:var(--text)">🧠 Avatar: ${currentProject.nome}</div>
      <div style="display:flex; gap:6px">
        <button class="btn btn-sm btn-outline" onclick="openAgent('avatar','market_researcher')">🔍 Pesquisador</button>
        <button class="btn btn-sm btn-purple" onclick="openAgent('avatar','avatar_architect')">🏗️ Avatar Arquiteto</button>
      </div>
    </div>

    <!-- DESEJOS E PSICOLOGIA -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">💫 Desejos & Motivação</div>
      <div class="grid2">
        <div>
          <div class="brief-label" style="margin-bottom:6px">Desejo Externo <span style="color:var(--text3)">(o que diz que quer)</span></div>
          <textarea class="brief-input" rows="2" onblur="currentProject.avatar.externo=this.value;saveProject()">${av.externo || ''}</textarea>
        </div>
        <div>
          <div class="brief-label" style="margin-bottom:6px">Desejo Interno <span style="color:var(--gold)">★ CORE</span> <span style="color:var(--text3)">(o que realmente quer)</span></div>
          <textarea class="brief-input" rows="2" style="border-color:rgba(201,168,76,.3)" onblur="currentProject.avatar.interno=this.value;saveProject()">${av.interno || ''}</textarea>
        </div>
      </div>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <!-- DORES -->
      <div class="card">
        <div class="card-title">💔 Dores & Medos</div>
        ${makeTagList('Dores Superficiais (conscientes)', av.dores_superficiais)}
        ${makeTagList('Dores Profundas (emocionais)', av.dores_profundas)}
        ${makeTagList('Medos Específicos', av.medos)}
        ${makeTagList('Objeções Reais', av.objecoes)}
      </div>

      <!-- POSICIONAMENTO -->
      <div class="card">
        <div class="card-title">⚔️ Posicionamento Psicológico</div>
        ${makeField('Inimigo', av.inimigo, 'inimigo')}
        ${makeField('Resultado Sonhado', av.resultado_sonhado, 'resultado_sonhado')}
        ${makeField('Trigger Event', av.trigger_event, 'trigger_event')}
        ${makeField('Fase de Consciência', av.fase_consciencia, 'fase_consciencia')}
      </div>
    </div>

    <!-- SUB-AVATARES -->
    <div class="card" style="margin-bottom:12px">
      <div class="section-header">
        <div class="card-title" style="margin-bottom:0">👥 Sub-Avatares</div>
        <button class="btn btn-sm btn-outline" onclick="openAgent('avatar','sub_avatar_mapper')">🗂️ Sub-Avatar Mapper</button>
      </div>
      ${subAvatarsHtml}
    </div>

    <!-- STORYBOARD -->
    <div class="card">
      <div class="section-header">
        <div class="card-title" style="margin-bottom:0">📖 Storyboard Narrativo</div>
        <button class="btn btn-sm btn-outline" onclick="openAgent('avatar','storyboard_creator')">📖 Criar Storyboard</button>
      </div>
      <div style="margin-top:8px">${storyboardHtml}</div>
    </div>`;
}

// ═══════════════════════════════════════════════════════
//  PIPELINE TAB
// ═══════════════════════════════════════════════════════
function renderPipeline() {
  const p = currentProject;
  const el = document.getElementById('tab-pipeline');
  let html = '<div style="margin-bottom:16px; display:flex; align-items:center; justify-content:space-between"><div style="font-size:14px; font-weight:600; color:var(--text)">🏢 Pipeline de Execução</div></div>';

  DEPARTMENTS.forEach(dept => {
    const pct = p.pipeline[dept.id] || 0;
    const agentsHtml = dept.agents.map(ag => {
      const doneThreshold = pct > 60;
      const chipClass = doneThreshold ? 'done' : '';
      return `<div class="agent-chip ${chipClass}" onclick="openAgent('${dept.id}','${ag.id}')">
        <span>${ag.icon}</span>
        <div class="dot"></div>
        <span>${ag.nome}</span>
      </div>`;
    }).join('');

    html += `<div class="dept-card">
      <div class="dept-header">
        <div class="dept-icon">${dept.icon}</div>
        <div class="dept-info">
          <div class="dept-name">${dept.nome}</div>
          <div class="dept-desc">${dept.desc}</div>
        </div>
        <div class="dept-status">
          <div class="dept-pct">${pct}%</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <button class="btn btn-sm btn-gold" onclick="openDept('${dept.id}')">Abrir</button>
        </div>
      </div>
      <div class="dept-agents">${agentsHtml}</div>
    </div>`;
  });

  el.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  ASSETS TAB
// ═══════════════════════════════════════════════════════
function renderAssets() {
  const p = currentProject;
  const el = document.getElementById('tab-assets');
  if (!p.assets) p.assets = [];

  let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:14px;font-weight:700;color:var(--text)">📦 Assets: ${p.nome}</div>
        <button class="btn btn-gold" onclick="openNewAssetModal()">+ Novo Asset</button>
      </div>`;

  if (!p.assets.length) {
    html += `<div class="empty-state">
          <div class="es-icon">📦</div>
          <div class="es-text">Nenhum asset cadastrado</div>
          <div class="es-sub">Adicione assets manualmente ou execute os agentes no Pipeline</div>
          <button class="btn btn-outline" style="margin-top:12px" onclick="showTab('pipeline')">→ Ir para Pipeline</button>
        </div>`;
  } else {
    html += '<div style="display:flex;flex-direction:column;gap:8px">';
    p.assets.forEach((a, i) => {
      const statusColor = a.status === 'Aprovado' ? 'var(--green-bright)' : a.status === 'Rodando' ? 'var(--gold)' : 'var(--text3)';
      const relDoc = (DOCS || []).find(d => d.project === p.nome && (d.title || '').trim().toLowerCase() === (a.nome || '').trim().toLowerCase());
      html += `<div class="asset-card">
            <div class="asset-icon">${a.icon || '📄'}</div>
            <div class="asset-info">
              <div class="asset-name">${a.nome}</div>
              <div class="asset-meta">${a.tipo || 'Asset'} · ${a.data || 'Hoje'}</div>
              ${a.url ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">${a.url}</div>` : ''}
            </div>
            <div class="asset-actions">
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;color:${statusColor};border:1px solid ${statusColor}">${a.status}</span>
              ${a.url ? `<a href="${a.url}" target="_blank" class="btn btn-sm btn-outline" style="margin-left:4px;text-decoration:none">Abrir</a>` : ''}
              ${!a.url && relDoc ? `<button class="btn btn-sm btn-outline" style="margin-left:4px" onclick="openDocModal(null,'${relDoc.id}')">Abrir Doc</button>` : ''}
              <button class="btn btn-sm btn-outline" style="margin-left:4px" onclick="openNewAssetModal(${i})">✏️</button>
              <button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c;margin-left:4px" onclick="removeAsset(${i})">✕</button>
            </div>
          </div>`;
    });
    html += '</div>';
  }
  el.innerHTML = html;
}

function removeAsset(i) {
  if (!confirm('Remover este asset?')) return;
  currentProject.assets.splice(i, 1);
  renderAssets();
  saveProject();
}

let _editAssetIdx = -1;
function openNewAssetModal(idx) {
  _editAssetIdx = (idx !== undefined && idx !== null) ? idx : -1;
  const m = document.getElementById('new-asset-modal');
  const title = document.getElementById('na-modal-title');
  if (_editAssetIdx >= 0 && currentProject.assets && currentProject.assets[_editAssetIdx]) {
    const a = currentProject.assets[_editAssetIdx];
    document.getElementById('na-nome').value = a.nome || '';
    document.getElementById('na-url').value = a.url || '';
    const tipoSel = document.getElementById('na-tipo');
    const tipoVal = ['Copy', 'Criativo', 'Página', 'Email', 'Vídeo', 'Script', 'Outro'].includes(a.tipo) ? a.tipo : 'Outro';
    tipoSel.value = tipoVal;
    const statusSel = document.getElementById('na-status');
    const statusVal = ['Rascunho', 'Em Revisão', 'Aprovado', 'Rodando'].includes(a.status) ? a.status : 'Rascunho';
    statusSel.value = statusVal;
    if (title) title.textContent = '✏️ Editar Asset';
  } else {
    document.getElementById('na-nome').value = '';
    document.getElementById('na-url').value = '';
    document.getElementById('na-tipo').value = 'Copy';
    document.getElementById('na-status').value = 'Rascunho';
    if (title) title.textContent = '📦 Novo Asset';
  }
  m.style.opacity = '1'; m.style.pointerEvents = 'all';
}
function closeNewAssetModal() {
  const m = document.getElementById('new-asset-modal');
  m.style.opacity = '0'; m.style.pointerEvents = 'none';
}
function saveNewAsset() {
  const nome = document.getElementById('na-nome').value.trim();
  if (!nome) { alert('Nome obrigatório'); return; }
  if (!currentProject.assets) currentProject.assets = [];
  const icons = { 'Copy': '✍️', 'Criativo': '🎨', 'Página': '📄', 'Email': '📧', 'Vídeo': '🎬', 'Script': '📝', 'Outro': '📦' };
  const tipo = document.getElementById('na-tipo').value;
  const assetData = {
    icon: icons[tipo] || '📦',
    nome, tipo,
    url: document.getElementById('na-url').value.trim(),
    status: document.getElementById('na-status').value,
    data: new Date().toLocaleDateString('pt-BR'),
    agente: 'Manual'
  };
  if (_editAssetIdx >= 0 && currentProject.assets[_editAssetIdx]) {
    Object.assign(currentProject.assets[_editAssetIdx], assetData);
  } else {
    currentProject.assets.push(assetData);
  }
  closeNewAssetModal();
  document.getElementById('na-nome').value = '';
  document.getElementById('na-url').value = '';
  renderAssets();
  saveProject();
}

// ═══════════════════════════════════════════════════════
//  AGENT MODAL
// ═══════════════════════════════════════════════════════
function openAgent(deptId, agentId) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  if (!dept) return;
  const agent = dept.agents.find(a => a.id === agentId);
  if (!agent) return;
  currentAgent = agent;

  document.getElementById('modal-agent-icon').textContent = agent.icon;
  document.getElementById('modal-agent-name').textContent = agent.nome;
  document.getElementById('modal-agent-role').textContent = agent.role + (agent.clone ? ` · Clone: ${agent.clone}` : '');
  document.getElementById('modal-agent-desc').textContent = agent.desc;

  document.getElementById('modal-inputs').innerHTML = (agent.inputs || []).map(i => `<div class="io-item">${i}</div>`).join('');
  document.getElementById('modal-outputs').innerHTML = (agent.outputs || []).map(o => `<div class="io-item">${o}</div>`).join('');
  document.getElementById('modal-prompt').textContent = buildPrompt(agent);

  // Reset response
  document.getElementById('response-container').style.display = 'none';
  document.getElementById('response-area').textContent = '';
  document.getElementById('response-area').className = 'response-area';

  // Set exec mode UI
  setExecMode(currentExecMode);

  document.getElementById('agent-modal').classList.add('open');
}

function buildPrompt(agent) {
  const p = currentProject;
  if (!agent.prompt) return 'Prompt não definido.';
  let prompt = agent.prompt;
  if (p) {
    prompt = prompt
      .replace(/\{projeto\}/g, p.nome)
      .replace(/\{produto\}/g, p.produto)
      .replace(/\{preco\}/g, p.preco)
      .replace(/\{nicho\}/g, p.categoria)
      .replace(/\{avatar_resumo\}/g, `Externo: ${p.avatar.externo}. Interno: ${p.avatar.interno}`)
      .replace(/\{resultado_sonhado\}/g, p.avatar.resultado_sonhado || '')
      .replace(/\{inimigo\}/g, p.avatar.inimigo || '')
      .replace(/\{dores\}/g, (p.avatar.dores_superficiais || []).concat(p.avatar.dores_profundas || []).join(', '));
  }
  return prompt;
}

function openDept(deptId) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  if (!dept) return;
  openAgent(deptId, dept.agents[0].id);
}

function closeModal() {
  document.getElementById('agent-modal').classList.remove('open');
}

function copyPrompt() {
  const text = document.getElementById('modal-prompt').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy-prompt');
    btn.textContent = '✓ Copiado!';
    setTimeout(() => btn.textContent = '📋 Copiar Prompt', 1500);
  });
}

function copyResponse() {
  const text = document.getElementById('response-area').textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Resposta copiada!');
  });
}

// ═══════════════════════════════════════════════════════
//  EXECUTION MODES
// ═══════════════════════════════════════════════════════
let currentExecMode = 'openrouter';

function setExecMode(mode) {
  currentExecMode = mode;
  document.querySelectorAll('.exec-mode').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('mode-' + mode);
  if (el) el.classList.add('active');

  const config = document.getElementById('mode-config');
  const key = localStorage.getItem('openrouter_key');
  const clawUrl = localStorage.getItem('openclaw_url');

  if (mode === 'openrouter') {
    config.innerHTML = `<div style="font-size:11px; color:${key ? 'var(--green-bright)' : 'var(--gold)'}; margin-top:6px; padding:6px 10px; background:var(--surface2); border-radius:6px; display:flex; align-items:center; justify-content:space-between">
      <span>${key ? '✓ API Key configurada' : '⚠ Sem API Key — configure em ⚙ API'}</span>
      ${!key ? '<button onclick="openSettings()" style="font-size:10px; padding:2px 8px; background:var(--gold-dim); border:1px solid var(--gold); color:var(--gold); border-radius:4px; cursor:pointer">Configurar</button>' : ''}
    </div>`;
    document.getElementById('btn-run').textContent = '⚡ Executar via OpenRouter';
  } else if (mode === 'claudecode') {
    config.innerHTML = `<div style="font-size:11px; color:var(--blue-bright); margin-top:6px; padding:6px 10px; background:var(--surface2); border-radius:6px">
      💻 Copia o prompt e executa no terminal: <code style="color:var(--gold)">claude "$(cat prompt.txt)"</code>
    </div>`;
    document.getElementById('btn-run').textContent = '💻 Copiar para Claude Code';
  } else if (mode === 'openclaw') {
    config.innerHTML = `<div style="font-size:11px; color:${clawUrl ? 'var(--purple-bright)' : 'var(--gold)'}; margin-top:6px; padding:6px 10px; background:var(--surface2); border-radius:6px; display:flex; align-items:center; justify-content:space-between">
      <span>${clawUrl ? '✓ Webhook configurado' : '⚠ Configure o webhook URL em ⚙ API'}</span>
      ${!clawUrl ? '<button onclick="openSettings()" style="font-size:10px; padding:2px 8px; background:var(--gold-dim); border:1px solid var(--gold); color:var(--gold); border-radius:4px; cursor:pointer">Configurar</button>' : ''}
    </div>`;
    document.getElementById('btn-run').textContent = '🕷️ Enviar ao OpenClaw';
  }
}

async function runAgent() {
  if (!currentAgent) return;

  if (currentExecMode === 'claudecode') {
    copyPrompt();
    const btn = document.getElementById('btn-run');
    btn.textContent = '✓ Prompt copiado! Cole no Claude Code';
    setTimeout(() => btn.textContent = '💻 Copiar para Claude Code', 2000);
    return;
  }

  if (currentExecMode === 'openclaw') {
    const clawUrl = localStorage.getItem('openclaw_url');
    if (!clawUrl) { openSettings(); return; }
    const prompt = buildPrompt(currentAgent);
    try {
      const btn = document.getElementById('btn-run');
      btn.textContent = '⏳ Enviando...';
      btn.disabled = true;
      await fetch(clawUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: currentAgent.nome, project: currentProject?.nome, prompt, task: currentAgent.role })
      });
      btn.textContent = '✓ Enviado ao OpenClaw!';
      setTimeout(() => { btn.textContent = '🕷️ Enviar ao OpenClaw'; btn.disabled = false; }, 2000);
    } catch (e) {
      alert('Erro ao enviar ao OpenClaw: ' + e.message);
      document.getElementById('btn-run').textContent = '🕷️ Enviar ao OpenClaw';
      document.getElementById('btn-run').disabled = false;
    }
    return;
  }

  // OpenRouter execution
  const apiKey = localStorage.getItem('openrouter_key');
  if (!apiKey) { openSettings(); return; }

  const model = localStorage.getItem('openrouter_model') || 'anthropic/claude-sonnet-4-5';
  const prompt = buildPrompt(currentAgent);

  const btn = document.getElementById('btn-run');
  btn.textContent = '⏳ Executando...';
  btn.disabled = true;

  const responseContainer = document.getElementById('response-container');
  const responseArea = document.getElementById('response-area');
  responseContainer.style.display = 'block';
  responseArea.className = 'response-area loading';
  responseArea.innerHTML = '<span class="loading-dot">●</span> Processando com ' + model + '...';

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://imperio-hq.local',
        'X-Title': 'Império HQ'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Erro ' + res.status);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || 'Sem resposta';

    responseArea.className = 'response-area success';
    responseArea.textContent = text;

    btn.textContent = '✓ Executado';
    setTimeout(() => { btn.textContent = '⚡ Executar via OpenRouter'; btn.disabled = false; }, 2000);

  } catch (e) {
    responseArea.className = 'response-area error';
    responseArea.textContent = '❌ Erro: ' + e.message;
    btn.textContent = '⚡ Tentar Novamente';
    btn.disabled = false;
  }
}

// ═══════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════
function openSettings() {
  document.getElementById('input-or-key').value = localStorage.getItem('openrouter_key') || '';
  document.getElementById('input-or-model').value = localStorage.getItem('openrouter_model') || 'anthropic/claude-sonnet-4-5';
  document.getElementById('input-claw-url').value = localStorage.getItem('openclaw_url') || '';
  document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
}

function saveSettings() {
  const key = document.getElementById('input-or-key').value.trim();
  const model = document.getElementById('input-or-model').value;
  const claw = document.getElementById('input-claw-url').value.trim();
  if (key) localStorage.setItem('openrouter_key', key);
  localStorage.setItem('openrouter_model', model);
  if (claw) localStorage.setItem('openclaw_url', claw);

  // Update header pill
  const pill = document.getElementById('api-status-pill');
  if (key) {
    pill.style.background = 'rgba(82,183,136,.15)';
    pill.style.color = 'var(--green-bright)';
    pill.style.borderColor = 'rgba(82,183,136,.3)';
    pill.textContent = '⚙ API ✓';
  }
  closeSettings();
  if (currentAgent) setExecMode(currentExecMode);
}

// ═══════════════════════════════════════════════════════
//  BRANDING TAB
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  { id: 'heroi', name: 'O Herói', desc: 'Supera obstáculos, conquista' },
  { id: 'mentor', name: 'O Mentor', desc: 'Guia, ensina, ilumina' },
  { id: 'fora_lei', name: 'Fora da Lei', desc: 'Disruptivo, anti-sistema' },
  { id: 'explorador', name: 'Explorador', desc: 'Liberdade, descoberta' },
  { id: 'criador', name: 'O Criador', desc: 'Inovação, expressão' },
  { id: 'cuidador', name: 'O Cuidador', desc: 'Proteção, suporte, cura' },
  { id: 'rei', name: 'O Rei', desc: 'Autoridade, ordem, poder' },
  { id: 'mago', name: 'O Mago', desc: 'Transformação, resultados' },
  { id: 'jester', name: 'O Bobo', desc: 'Entretenimento, diversão' }
];

function renderBranding() {
  const p = currentProject;
  const b = p.branding || {};
  const el = document.getElementById('tab-branding');
  if (!b.cores || !Array.isArray(b.cores)) b.cores = [
    { nome: 'Primária', hex: '#c9a84c' },
    { nome: 'Secundária', hex: '#1a1a2e' },
    { nome: 'Acento', hex: '#52b788' },
    { nome: 'Texto', hex: '#e8e8e8' },
    { nome: 'Fundo', hex: '#0d0d1a' }
  ];
  if (!p.branding) p.branding = b;
  p.branding.cores = b.cores;

  const coresHtml = b.cores.map((c, ci) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <div style="position:relative">
            <div id="swatch-${ci}" style="width:52px;height:52px;border-radius:10px;background:${c.hex};border:3px solid rgba(255,255,255,.15);cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.4)" onclick="document.getElementById('cpick-${ci}').click()"></div>
            <input type="color" id="cpick-${ci}" value="${c.hex}" style="position:absolute;opacity:0;width:1px;height:1px" oninput="updateCor(${ci},this.value)">
          </div>
          <input class="brief-input" style="width:70px;font-size:9px;text-align:center;padding:3px;font-family:monospace" value="${c.hex}" onblur="updateCor(${ci},this.value)" id="chex-${ci}">
          <input class="brief-input" style="width:70px;font-size:9px;text-align:center;padding:3px" value="${c.nome}" onblur="updateCorNome(${ci},this.value)" placeholder="Nome">
        </div>`).join('');

  const archetypeHtml = ARCHETYPES.map(a => `
        <div class="archetype-btn ${b.arquetipo === a.name ? 'selected' : ''}" onclick="selectArchetype('${a.name}')">
          <div class="archetype-name">${a.name}</div>
          <div class="archetype-desc">${a.desc}</div>
        </div>`).join('');

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:600;color:var(--text)">🏷️ Branding: ${p.nome}</div>
      <button class="btn btn-sm btn-gold" onclick="openAgent('design','web_designer')">🎨 Pedir Design</button>
    </div>

    <!-- PALETA DE CORES -->
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="card-title" style="margin-bottom:0">🎨 Paleta de Cores</div>
        <div id="cores-preview" style="display:flex;border-radius:8px;overflow:hidden;height:24px;width:180px;border:1px solid var(--border)">
          ${b.cores.map(c => `<div style="flex:1;background:${c.hex}" title="${c.nome}"></div>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">${coresHtml}</div>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">🎭 Arquétipo da Marca</div>
        <div class="archetype-grid">${archetypeHtml}</div>
      </div>
      <div class="card">
        <div class="card-title">⚔️ Posicionamento</div>
        <div class="brief-field"><div class="brief-label">Inimigo Comum</div>
          <textarea class="brief-input" rows="2" onblur="saveBranding('inimigo_comum',this.value)">${b.inimigo_comum || ''}</textarea>
        </div>
        <div class="brief-field"><div class="brief-label">Mecanismo-Chave (o que torna único)</div>
          <textarea class="brief-input" rows="2" onblur="saveBranding('mecanismo_key',this.value)">${b.mecanismo_key || ''}</textarea>
        </div>
        <div class="brief-field"><div class="brief-label">Personalidade da Marca</div>
          <input class="brief-input" value="${b.personalidade || ''}" onblur="saveBranding('personalidade',this.value)">
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">📜 Manifesto da Marca</div>
      <textarea class="brief-input" rows="5" placeholder="O que a marca acredita? Qual é sua missão e promessa central?" onblur="saveBranding('manifesto',this.value)">${b.manifesto || ''}</textarea>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">✅ Linguagem: Usa</div>
        <textarea class="brief-input" rows="4" placeholder="Palavras, expressões, tom que a marca usa..." onblur="saveBrandingArr('usa',this.value)">${(b.linguagem?.usa || []).join('\n')}</textarea>
      </div>
      <div class="card">
        <div class="card-title">❌ Linguagem: Evita</div>
        <textarea class="brief-input" rows="4" placeholder="Termos, clichês e tons que a marca evita..." onblur="saveBrandingArr('evita',this.value)">${(b.linguagem?.evita || []).join('\n')}</textarea>
      </div>
    </div>

    <!-- TIPOGRAFIA -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🔤 Tipografia</div>
      <div class="grid2">
        <div class="brief-field">
          <div class="brief-label">Fonte Principal (Títulos)</div>
          <input class="brief-input" value="${b.tipografia?.principal || ''}" placeholder="Ex: Playfair Display, Montserrat..." onblur="saveBrandingTip('principal',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">Fonte Secundária (Corpo)</div>
          <input class="brief-input" value="${b.tipografia?.secundaria || ''}" placeholder="Ex: Inter, Open Sans, Lato..." onblur="saveBrandingTip('secundaria',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">Peso / Estilo (Títulos)</div>
          <input class="brief-input" value="${b.tipografia?.peso_titulo || ''}" placeholder="Ex: Bold 700, Black 900..." onblur="saveBrandingTip('peso_titulo',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">Tamanho Base / Escala</div>
          <input class="brief-input" value="${b.tipografia?.escala || ''}" placeholder="Ex: 16px base, H1: 48px, H2: 32px..." onblur="saveBrandingTip('escala',this.value)">
        </div>
      </div>
    </div>

    <!-- LOGO -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🖼️ Logo & Identidade Visual</div>
      <div class="grid2">
        <div>
          <div class="brief-field">
            <div class="brief-label">URL do Logo (ou cole base64)</div>
            <div style="display:flex;gap:8px;align-items:center">
              <input class="brief-input" value="${b.logo_url && !b.logo_url.startsWith('data:') ? b.logo_url : ''}" placeholder="https://..." onblur="saveBranding('logo_url',this.value);renderBranding()" style="flex:1">
              <label style="cursor:pointer;background:var(--surface2);border:1px solid var(--border2);border-radius:6px;padding:5px 10px;font-size:11px;color:var(--text2);white-space:nowrap;flex-shrink:0">📂 Upload<input type="file" accept="image/*" style="display:none" onchange="uploadBrandingLogo(this)"></label>
            </div>
          </div>
          <div class="brief-field">
            <div class="brief-label">Fundo do Logo</div>
            <input class="brief-input" value="${b.logo_fundo || ''}" placeholder="Ex: Fundo escuro, Branco, Transparente..." onblur="saveBranding('logo_fundo',this.value)">
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;background:var(--surface2);border:1px solid var(--border);border-radius:8px;min-height:100px;padding:12px">
          ${b.logo_url ? `<img src="${b.logo_url}" style="max-width:100%;max-height:100px;object-fit:contain">` : `<div style="font-size:11px;color:var(--text3);text-align:center">Logo aparecerá aqui<br>após upload</div>`}
        </div>
      </div>
      <div class="brief-field" style="margin-top:8px">
        <div class="brief-label">Variações do Logo (descreva)</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Versão principal (colorida), Versão monocromática, Versão ícone apenas..." onblur="saveBranding('logo_variacoes',this.value)">${b.logo_variacoes || ''}</textarea>
      </div>
    </div>

    <!-- DIRETRIZES -->
    <div class="card">
      <div class="card-title">📋 Diretrizes da Marca</div>
      <div class="brief-field">
        <div class="brief-label">Espaçamento / Uso do Logo</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Área de proteção mínima, não distorcer, não rotacionar..." onblur="saveBranding('diretrizes_logo',this.value)">${b.diretrizes_logo || ''}</textarea>
      </div>
      <div class="brief-field">
        <div class="brief-label">Aplicações Aprovadas</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Fundo escuro com logo dourado, fundo branco com logo escuro..." onblur="saveBranding('aplicacoes_ok',this.value)">${b.aplicacoes_ok || ''}</textarea>
      </div>
      <div class="brief-field">
        <div class="brief-label">Aplicações Proibidas</div>
        <textarea class="brief-input" rows="2" placeholder="Ex: Nunca usar rosa, nunca usar fundo cinza, não misturar com outras marcas..." onblur="saveBranding('aplicacoes_nao',this.value)">${b.aplicacoes_nao || ''}</textarea>
      </div>
    </div>`;
}

function updateCor(ci, hex) {
  if (!currentProject.branding) currentProject.branding = {};
  if (!currentProject.branding.cores) return;
  currentProject.branding.cores[ci].hex = hex;
  const swatch = document.getElementById('swatch-' + ci);
  if (swatch) swatch.style.background = hex;
  const hexInput = document.getElementById('chex-' + ci);
  if (hexInput) hexInput.value = hex;
  // Update preview bar
  const preview = document.getElementById('cores-preview');
  if (preview) preview.innerHTML = currentProject.branding.cores.map(c => `<div style="flex:1;background:${c.hex}" title="${c.nome}"></div>`).join('');
  // Update color picker
  const cpick = document.getElementById('cpick-' + ci);
  if (cpick) cpick.value = hex;
}

function updateCorNome(ci, nome) {
  if (!currentProject.branding || !currentProject.branding.cores) return;
  currentProject.branding.cores[ci].nome = nome;
}

function selectArchetype(name) {
  if (!currentProject.branding) currentProject.branding = {};
  currentProject.branding.arquetipo = name;
  renderBranding();
  saveProject();
}

function saveBranding(key, value) {
  if (!currentProject.branding) currentProject.branding = {};
  currentProject.branding[key] = value;
  saveProject();
}

function saveBrandingArr(subkey, value) {
  if (!currentProject.branding) currentProject.branding = {};
  if (!currentProject.branding.linguagem) currentProject.branding.linguagem = { usa: [], evita: [] };
  currentProject.branding.linguagem[subkey] = value.split('\n').filter(l => l.trim());
  saveProject();
}

function saveBrandingTip(key, value) {
  if (!currentProject.branding) currentProject.branding = {};
  if (!currentProject.branding.tipografia) currentProject.branding.tipografia = {};
  currentProject.branding.tipografia[key] = value;
  saveProject();
}

function uploadBrandingLogo(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    saveBranding('logo_url', e.target.result);
    renderBranding();
  };
  reader.readAsDataURL(file);
}

function addConcorrente() {
  if (!currentProject.concorrentes) currentProject.concorrentes = [];
  currentProject.concorrentes.push({
    nome: '', url: '', diferencial: '', fraqueza: '', canais: '',
    nicho: '', subnicho: '', publico_alvo: '', mecanismo: '',
    headline: '', hook: '', cta: '',
    oferta_principal: '', preco: '', garantia: '', bonus: '',
    dossie: null
  });
  saveProject();
  showTab('briefing');
}

function removeConcorrente(idx) {
  if (!currentProject.concorrentes) return;
  currentProject.concorrentes.splice(idx, 1);
  saveProject();
  showTab('briefing');
}

function saveConcorrente(idx, key, val) {
  if (!currentProject.concorrentes) currentProject.concorrentes = [];
  if (!currentProject.concorrentes[idx]) currentProject.concorrentes[idx] = {};
  currentProject.concorrentes[idx][key] = val;
  saveProject();
}

function savePosicionamento(key, val) {
  if (!currentProject.posicionamento) currentProject.posicionamento = {};
  currentProject.posicionamento[key] = val;
  saveProject();
}

function saveProjectData() {
  if (!currentProject) return;
  var custom = projectsGetCustom();
  var ci = custom.findIndex(function (p) { return p.id === currentProject.id; });
  if (ci !== -1) {
    custom[ci] = JSON.parse(JSON.stringify(currentProject));
    projectsSaveCustom(custom);
  }
  var btn = document.getElementById('btn-save-project');
  if (btn) {
    var orig = btn.innerHTML;
    btn.innerHTML = '✓ Salvo!';
    btn.style.background = 'var(--green-bright)';
    btn.style.color = '#0a0a0f';
    setTimeout(function () { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; }, 1800);
  }
}

// ── Competitor Section Render ──────────────────────────────────────────────
function renderConcorrentesSection(p) {
  var tabs = ['Visão Geral', 'Mercado', 'Copywriting', 'Oferta', 'Dossiê'];
  var tabBtns = tabs.map(function (t, i) {
    return '<button id="conc-tab-' + i + '" onclick="showConcTab(' + i + ')" style="background:' + (i === 0 ? 'var(--gold)' : 'transparent') + ';color:' + (i === 0 ? '#1a1a1a' : 'var(--text3)') + ';border:none;border-bottom:' + (i === 0 ? '2px solid var(--gold)' : '2px solid transparent') + ';padding:7px 13px;font-size:11px;font-weight:' + (i === 0 ? '700' : '500') + ';cursor:pointer;transition:.15s;border-radius:6px 6px 0 0">' + t + '</button>';
  }).join('');
  return '<div class="card" style="margin-bottom:12px">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
    + '<div class="card-title" style="margin-bottom:0">🥊 Análise de Concorrentes</div>'
    + '<div style="display:flex;gap:8px;align-items:center">'
    + '<button onclick="addConcorrente()" class="btn btn-sm btn-outline">+ Concorrente</button>'
    + '<button id="btn-save-project" onclick="saveProjectData()" class="btn btn-sm btn-gold">💾 Salvar</button>'
    + '</div>'
    + '</div>'
    + '<div style="display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:14px">' + tabBtns + '</div>'
    + '<div id="conc-panel-0">' + buildConcOverviewHtml(p) + '</div>'
    + '<div id="conc-panel-1" style="display:none">' + buildConcMercadoHtml(p) + '</div>'
    + '<div id="conc-panel-2" style="display:none">' + buildConcCopyHtml(p) + '</div>'
    + '<div id="conc-panel-3" style="display:none">' + buildConcOfertaHtml(p) + '</div>'
    + '<div id="conc-panel-4" style="display:none">' + buildConcDossieHtml(p) + '</div>'
    + '</div>';
}

function showConcTab(idx) {
  for (var i = 0; i < 5; i++) {
    var panel = document.getElementById('conc-panel-' + i);
    var tab = document.getElementById('conc-tab-' + i);
    if (panel) panel.style.display = (i === idx) ? '' : 'none';
    if (tab) {
      tab.style.background = (i === idx) ? 'var(--gold)' : 'transparent';
      tab.style.color = (i === idx) ? '#1a1a1a' : 'var(--text3)';
      tab.style.fontWeight = (i === idx) ? '700' : '500';
      tab.style.borderBottom = (i === idx) ? '2px solid var(--gold)' : '2px solid transparent';
    }
  }
}

// Tab 1: Comparison Table
function buildConcOverviewHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado. Clique em "+ Concorrente" para adicionar.</div>';
  var rowDefs = [
    ['Nome', 'nome'], ['URL / Site', 'url'], ['Ponto Forte', 'diferencial'], ['Fraqueza', 'fraqueza'],
    ['Canais Principais', 'canais'], ['Nicho / Subnicho', 'nicho'], ['Público-alvo', 'publico_alvo'], ['Mecanismo Único', 'mecanismo']
  ];
  var proj = p.posicionamento || {};
  var projFields = { nome: p.nome || '', nicho: proj.nicho || '', subnicho: proj.subnicho || '', publico_alvo: proj.publico_alvo || '', mecanismo: proj.mecanismo || '' };
  var h = '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:480px">';
  h += '<thead><tr>';
  h += '<th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text3);font-weight:600;border:1px solid var(--border);white-space:nowrap;min-width:110px">Campo</th>';
  h += '<th style="text-align:left;padding:6px 8px;background:rgba(201,168,76,0.12);color:var(--gold);font-weight:700;border:1px solid var(--border);min-width:130px">⭐ Seu Projeto</th>';
  concs.forEach(function (c, ci) {
    h += '<th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text);font-weight:600;border:1px solid var(--border);min-width:130px">' + (c.nome || ('Conc. ' + (ci + 1))) + '</th>';
  });
  h += '</tr></thead><tbody>';
  rowDefs.forEach(function (rd) {
    var label = rd[0], key = rd[1];
    h += '<tr><td style="padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);white-space:nowrap;font-weight:500">' + label + '</td>';
    var projVal = (projFields[key] !== undefined) ? projFields[key] : '';
    var isProj = ['nicho', 'subnicho', 'publico_alvo', 'mecanismo'].includes(key);
    h += '<td contenteditable="true" style="padding:6px 8px;background:rgba(201,168,76,0.04);color:var(--text);border:1px solid var(--border)" onblur="savePosicionamento(\'' + key + '\',this.textContent)">' + projVal + '</td>';
    concs.forEach(function (c, ci) {
      h += '<td contenteditable="true" style="padding:6px 8px;color:var(--text);border:1px solid var(--border)" onblur="saveConcorrente(' + ci + ',\'' + key + '\',this.textContent)">' + (c[key] || '') + '</td>';
    });
    h += '</tr>';
  });
  // Actions row
  h += '<tr><td style="padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);font-weight:500">Ações</td>';
  h += '<td style="padding:6px 8px;border:1px solid var(--border)"></td>';
  concs.forEach(function (c, ci) {
    h += '<td style="padding:6px 8px;border:1px solid var(--border)">'
      + '<button onclick="removeConcorrente(' + ci + ')" style="background:none;border:1px solid #e05c5c33;color:#e05c5c;border-radius:5px;padding:2px 7px;font-size:10px;cursor:pointer">✕ Remover</button>'
      + '<button onclick="openImportFunnelModal(' + ci + ')" style="background:none;border:1px solid var(--border2);color:var(--text3);border-radius:5px;padding:2px 7px;font-size:10px;cursor:pointer;margin-left:4px">📥 Import</button>'
      + '</td>';
  });
  h += '</tr></tbody></table></div>';
  return h;
}

// Tab 2: Radar de Proximidade + Keywords
function buildConcMercadoHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var colors = ['#52b788', '#e05c5c', '#3b82f6', '#a78bfa', '#fb923c', '#f472b6'];
  var cx = 155, cy = 140, maxR = 105;
  var angDeg = [270, 30, 150, 210, 90, 330];
  var maxScore = 15;
  concs.forEach(function (c) {
    var s = (c.dossie && c.dossie.score_escala != null) ? c.dossie.score_escala : 5;
    if (s > maxScore) maxScore = s;
  });
  var rings = '';
  for (var ri = 1; ri <= 3; ri++) {
    var rr = (maxR / 3) * ri;
    rings += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr.toFixed(0) + '" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,3"/>';
  }
  var bubbles = '';
  var legend = '';
  concs.slice(0, 6).forEach(function (c, ci) {
    var score = (c.dossie && c.dossie.score_escala != null) ? c.dossie.score_escala : 5;
    var ang = (angDeg[ci] || (ci * 60)) * Math.PI / 180;
    var dist = maxR * 0.62;
    var bx = cx + dist * Math.cos(ang);
    var by = cy + dist * Math.sin(ang);
    var br = 18 + (score / maxScore) * 16;
    var col = colors[ci % colors.length];
    var lbl = (c.nome || ('Conc.' + (ci + 1))).substring(0, 9);
    bubbles += '<circle cx="' + bx.toFixed(0) + '" cy="' + by.toFixed(0) + '" r="' + br.toFixed(0) + '" fill="' + col + '" fill-opacity="0.2" stroke="' + col + '" stroke-width="1.5"/>';
    bubbles += '<text x="' + bx.toFixed(0) + '" y="' + (parseFloat(by.toFixed(0)) + 4) + '" text-anchor="middle" font-size="9" fill="' + col + '" font-weight="600">' + lbl + '</text>';
    legend += '<rect x="8" y="' + (206 + ci * 15) + '" width="9" height="9" fill="' + col + '" fill-opacity="0.7" rx="2"/>';
    legend += '<text x="21" y="' + (215 + ci * 15) + '" font-size="9" fill="var(--text3)">' + (c.nome || ('Conc.' + (ci + 1))).substring(0, 16) + '</text>';
  });
  var svgH = 206 + Math.min(concs.length, 6) * 15 + 8;
  var svgBlock = '<svg width="320" height="' + svgH + '" style="display:block">'
    + rings
    + '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="rgba(201,168,76,0.25)" stroke="var(--gold)" stroke-width="2"/>'
    + '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-size="8" fill="var(--gold)" font-weight="700">VOCÊ</text>'
    + bubbles + legend + '</svg>';
  // Bars
  var barsHtml = '<div style="flex:1;min-width:180px">'
    + '<div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Score de Escala</div>';
  concs.forEach(function (c, ci) {
    var score = (c.dossie && c.dossie.score_escala != null) ? c.dossie.score_escala : null;
    var pct = score != null ? Math.min(100, Math.round(score / 15 * 100)) : 0;
    var col = colors[ci % colors.length];
    barsHtml += '<div style="margin-bottom:10px">'
      + '<div style="display:flex;justify-content:space-between;margin-bottom:3px">'
      + '<span style="font-size:11px;color:var(--text)">' + (c.nome || ('Conc.' + (ci + 1))) + '</span>'
      + '<span style="font-size:10px;color:var(--text3)">' + (score != null ? score + '/15' : 'N/A') + '</span>'
      + '</div>'
      + '<div style="height:6px;background:var(--surface2);border-radius:3px">'
      + '<div style="height:100%;width:' + pct + '%;background:' + col + ';border-radius:3px;transition:.3s"></div>'
      + '</div></div>';
  });
  // Keywords
  var kwMap = {};
  concs.forEach(function (c) {
    var kws = (c.dossie && c.dossie.palavras_chave) ? c.dossie.palavras_chave : [];
    kws.forEach(function (kw) { kwMap[kw] = (kwMap[kw] || 0) + 1; });
    if (c.canais) {
      c.canais.split(/[,;]/).forEach(function (k) {
        var t = k.trim();
        if (t && t.length < 30) kwMap[t] = (kwMap[t] || 0) + 1;
      });
    }
  });
  var sortedKws = Object.entries(kwMap).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 18);
  if (sortedKws.length) {
    barsHtml += '<div style="margin-top:14px"><div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Canais & Palavras-chave Comuns</div>';
    barsHtml += '<div style="display:flex;flex-wrap:wrap;gap:5px">';
    sortedKws.forEach(function (entry) {
      var kw = entry[0], cnt = entry[1];
      var op = Math.min(1, 0.35 + cnt / concs.length * 0.65);
      barsHtml += '<span style="background:rgba(201,168,76,' + op.toFixed(2) + ');color:' + (cnt > 1 ? '#1a1a1a' : 'var(--text)') + ';border-radius:20px;padding:3px 9px;font-size:10px;font-weight:' + (cnt > 1 ? '700' : '400') + '">' + kw + (cnt > 1 ? ' ×' + cnt : '') + '</span>';
    });
    barsHtml += '</div></div>';
  }
  barsHtml += '</div>';
  return '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">'
    + '<div style="flex:0 0 auto"><div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Radar de Proximidade Competitiva</div>' + svgBlock + '</div>'
    + barsHtml + '</div>';
}

// Tab 3: Copywriting
function buildConcCopyHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var fields = [['headline', '📰 Headline Principal'], ['hook', '🎣 Hook / Ângulo'], ['cta', '👆 CTA Principal']];
  var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px">';
  concs.forEach(function (c, ci) {
    h += '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">'
      + '<div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)">' + (c.nome || ('Conc. ' + (ci + 1))) + '</div>';
    fields.forEach(function (f) {
      h += '<div style="margin-bottom:9px">'
        + '<div style="font-size:9px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">' + f[1] + '</div>'
        + '<div contenteditable="true" style="font-size:11px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:5px;padding:5px 7px;min-height:28px;line-height:1.4" onblur="saveConcorrente(' + ci + ',\'' + f[0] + '\',this.textContent)">' + (c[f[0]] || '') + '</div>'
        + '</div>';
    });
    h += '</div>';
  });
  h += '</div>';
  return h;
}

// Tab 4: Oferta
function buildConcOfertaHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var fields = [['oferta_principal', '🎯 Oferta Principal'], ['preco', '💰 Preço'], ['garantia', '🛡️ Garantia'], ['bonus', '🎁 Bônus']];
  var h = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:380px">';
  h += '<thead><tr><th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);min-width:110px">Campo</th>';
  concs.forEach(function (c, ci) {
    h += '<th style="text-align:left;padding:6px 8px;background:var(--surface2);color:var(--text);border:1px solid var(--border);min-width:140px">' + (c.nome || ('Conc.' + (ci + 1))) + '</th>';
  });
  h += '</tr></thead><tbody>';
  fields.forEach(function (f) {
    h += '<tr><td style="padding:6px 8px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);font-weight:500;white-space:nowrap">' + f[1] + '</td>';
    concs.forEach(function (c, ci) {
      h += '<td contenteditable="true" style="padding:6px 8px;color:var(--text);border:1px solid var(--border)" onblur="saveConcorrente(' + ci + ',\'' + f[0] + '\',this.textContent)">' + (c[f[0]] || '') + '</td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table></div>';
  return h;
}

// Tab 5: Dossiê (Funnel Hacking data)
function buildConcDossieHtml(p) {
  var concs = p.concorrentes || [];
  if (!concs.length) return '<div style="font-size:11px;color:var(--text3);padding:16px 0 8px">Nenhum concorrente cadastrado.</div>';
  var typeColors = { LP: '#52b788', VSL: '#fb923c', PV: '#3b82f6', CK: '#a78bfa', UP: '#e05c5c', DS: '#f472b6', TY: '#22d3ee', MB: '#94a3b8' };
  var h = '<div style="display:flex;flex-direction:column;gap:12px">';
  concs.forEach(function (c, ci) {
    var d = c.dossie || {};
    var hasData = !!(d.insights || d.trafego_estimado || (d.stack && d.stack.length) || d.ads_ativos != null || (d.paginas_funil && d.paginas_funil.length));
    h += '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px">';
    h += '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:8px">';
    h += '<div style="font-size:12px;font-weight:700;color:var(--text)">' + (c.nome || ('Concorrente ' + (ci + 1))) + (c.url ? ' <a href="' + c.url + '" target="_blank" style="color:var(--gold);font-size:10px;font-weight:400">' + c.url + '</a>' : '') + '</div>';
    h += '<button onclick="openImportFunnelModal(' + ci + ')" class="btn btn-sm btn-outline" style="font-size:10px;flex-shrink:0">📥 Importar Pesquisa</button>';
    h += '</div>';
    if (!hasData) {
      h += '<div style="font-size:11px;color:var(--text3);text-align:center;padding:18px 0;line-height:1.8">'
        + 'Nenhum dado de pesquisa importado ainda.<br>'
        + '<span style="font-size:10px">Use o <strong style="color:var(--text)">Funnel Hacking Agent</strong> para pesquisar este concorrente e depois clique em "📥 Importar Pesquisa".</span>'
        + '</div>';
    } else {
      if (d.score_escala != null) {
        h += '<div style="display:inline-block;background:rgba(201,168,76,0.15);border:1px solid var(--gold);border-radius:6px;padding:3px 10px;font-size:11px;color:var(--gold);font-weight:700;margin-bottom:10px">🏆 Score de Escala: ' + d.score_escala + '/15</div>';
      }
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:7px;margin-bottom:10px">';
      if (d.trafego_estimado) h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:8px"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Tráfego Est.</div><div style="font-size:12px;color:var(--text);font-weight:600">' + d.trafego_estimado + '</div></div>';
      if (d.ads_ativos != null) h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:8px"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Ads Ativos</div><div style="font-size:12px;color:var(--text);font-weight:600">' + d.ads_ativos + '</div></div>';
      if (d.importado_em) h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:8px"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Importado em</div><div style="font-size:11px;color:var(--text3)">' + new Date(d.importado_em).toLocaleDateString('pt-BR') + '</div></div>';
      h += '</div>';
      if (d.stack && d.stack.length) {
        h += '<div style="margin-bottom:9px"><div style="font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">Stack Tecnológico</div><div style="display:flex;flex-wrap:wrap;gap:5px">';
        d.stack.forEach(function (s) { h += '<span style="background:rgba(59,130,246,0.12);color:#3b82f6;border:1px solid rgba(59,130,246,0.25);border-radius:20px;padding:2px 8px;font-size:10px">' + s + '</span>'; });
        h += '</div></div>';
      }
      if (d.paginas_funil && d.paginas_funil.length) {
        h += '<div style="margin-bottom:9px"><div style="font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">Páginas do Funil Detectadas</div><div style="display:flex;flex-wrap:wrap;gap:5px">';
        d.paginas_funil.forEach(function (t) {
          var col = typeColors[t] || '#94a3b8';
          h += '<span style="border:1px solid ' + col + '44;color:' + col + ';border-radius:4px;padding:2px 7px;font-size:10px;font-weight:600;background:' + col + '11">' + t + '</span>';
        });
        h += '</div></div>';
      }
      if (d.insights) {
        h += '<div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.2);border-radius:7px;padding:10px">'
          + '<div style="font-size:9px;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">💡 Insights</div>'
          + '<div style="font-size:11px;color:var(--text);line-height:1.6;white-space:pre-wrap">' + d.insights.substring(0, 600) + '</div>'
          + '</div>';
      }
    }
    h += '</div>';
  });
  h += '</div>';
  return h;
}

// ── Import Funnel Modal Functions ──────────────────────────────────────────
function openImportFunnelModal(concIdx) {
  window._importFunnelConcIdx = concIdx;
  var m = document.getElementById('import-funnel-modal');
  if (!m) return;
  var name = (currentProject.concorrentes && currentProject.concorrentes[concIdx])
    ? (currentProject.concorrentes[concIdx].nome || ('Concorrente ' + (concIdx + 1))) : '';
  var titleEl = document.getElementById('ifm-title');
  if (titleEl) titleEl.textContent = '📥 Importar Pesquisa — ' + name;
  var contentEl = document.getElementById('ifm-content');
  if (contentEl) contentEl.value = '';
  m.style.opacity = '1';
  m.style.pointerEvents = 'all';
}

function closeImportFunnelModal() {
  var m = document.getElementById('import-funnel-modal');
  if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; }
}

function importFunnelData() {
  var contentEl = document.getElementById('ifm-content');
  var content = contentEl ? contentEl.value.trim() : '';
  var ci = window._importFunnelConcIdx;
  if (!content) { alert('Cole o conteúdo do dossiê antes de importar.'); return; }
  if (ci === undefined || ci === null || ci < 0) return;
  if (!currentProject.concorrentes || !currentProject.concorrentes[ci]) return;
  var parsed = parseFunnelHackingMarkdown(content);
  if (!currentProject.concorrentes[ci].dossie) currentProject.concorrentes[ci].dossie = {};
  Object.assign(currentProject.concorrentes[ci].dossie, parsed, { importado_em: Date.now(), raw: content.substring(0, 2000) });
  saveProject();
  closeImportFunnelModal();
  showTab('briefing');
  setTimeout(function () { showConcTab(4); }, 120);
}

function parseFunnelHackingMarkdown(content) {
  var result = {};
  // Score de Escala
  var sm = content.match(/(?:TOTAL|Score\s*Total)[^:\n]*[:\s]+(\d+)/i);
  if (!sm) sm = content.match(/score[^:\n]*[:\s]+(\d+)\s*\/\s*15/i);
  if (sm) result.score_escala = parseInt(sm[1]);
  // Tráfego estimado
  var tm = content.match(/(?:Tr[aá]fego|Traffic|Visitors)[^\n]*?([0-9][0-9.,\s]*[KkMm]?[^\n]{0,20}(?:\/m[eê]s|\/month)?)/i);
  if (tm) result.trafego_estimado = tm[1].trim().split(/\s+/).slice(0, 4).join(' ');
  // Ads ativos
  var am = content.match(/ads?\s*ativos?[:\s]+(\d+)/i);
  if (!am) am = content.match(/(\d+)\s+ads?\s*(?:ativos?|running)/i);
  if (am) result.ads_ativos = parseInt(am[1]);
  // Stack tecnológico
  var stackM = content.match(/Stack[^\n]*\n([\s\S]{0,600}?)(?:\n#|\n\n##|$)/i);
  if (stackM) {
    result.stack = stackM[1].split('\n')
      .map(function (l) { return l.replace(/^[-*•\s\d.]+/, '').trim(); })
      .filter(function (l) { return l.length > 1 && l.length < 60 && !/^#+/.test(l); })
      .slice(0, 12);
  }
  // Páginas do funil
  var pts = content.match(/\b(LP|VSL|PV|CK|OB|UP|DS|TY|MB|WB|CS|BK)\b/g);
  if (pts) result.paginas_funil = pts.filter(function (v, i, a) { return a.indexOf(v) === i; });
  // Palavras-chave / canais
  var kwM = content.match(/(?:Palavras[- ]chave|Keywords|Canais?)[^\n]*\n([\s\S]{0,400}?)(?:\n#|$)/i);
  if (kwM) {
    result.palavras_chave = kwM[1].split(/[\n,;|]+/)
      .map(function (k) { return k.replace(/^[-*•\s]+/, '').trim(); })
      .filter(function (k) { return k.length > 1 && k.length < 40 && !/^#+/.test(k); })
      .slice(0, 20);
  }
  // Insights / Oportunidades
  var insM = content.match(/(?:INSIGHTS?|Oportunidades?|Gaps?)[^\n]*\n([\s\S]{0,800}?)(?:\n##|$)/i);
  if (insM) result.insights = insM[1].trim().substring(0, 600);
  return result;
}

function addProjectLink() {
  if (!currentProject.linksArr) currentProject.linksArr = [];
  currentProject.linksArr.push({ tipo: '', url: '' });
  const li = currentProject.linksArr.length - 1;
  const list = document.getElementById('project-links-list');
  if (!list) {
    saveProject();
    return;
  }
  const row = document.createElement('div');
  row.className = 'link-row';
  row.style.cssText = 'display:flex;gap:6px;margin-bottom:6px;align-items:center';
  row.innerHTML = `<input class="brief-input link-type" value="" placeholder="Tipo (ex: site)" style="flex:0 0 120px" onblur="saveProjectLink(${li},'tipo',this.value)"><input class="brief-input link-url" value="" placeholder="https://" style="flex:1" onblur="saveProjectLink(${li},'url',this.value)"><button onclick="removeProjectLink(${li})" style="background:none;border:1px solid #e05c5c33;color:#e05c5c;border-radius:5px;padding:2px 8px;font-size:12px;cursor:pointer;flex-shrink:0">✕</button>`;
  list.appendChild(row);
  saveProject();
}

function saveProjectLink(idx, key, val) {
  if (!currentProject.linksArr) return;
  if (!currentProject.linksArr[idx]) currentProject.linksArr[idx] = { tipo: '', url: '' };
  currentProject.linksArr[idx][key] = val;
  saveProject();
}

function removeProjectLink(idx) {
  if (!currentProject.linksArr) return;
  currentProject.linksArr.splice(idx, 1);
  saveProject();
  const tab = document.getElementById('tab-briefing');
  if (tab) { showTab('briefing'); }
}

// ═══════════════════════════════════════════════════════
//  KPIS TAB
// ═══════════════════════════════════════════════════════
function renderKPIs() {
  const p = currentProject;
  const k = p.kpis || {};
  const m = k.meta || {};
  const el = document.getElementById('tab-kpis');

  function kpiCard(label, key, unit = '', suffix = '', benchmarkGood, benchmarkWarn) {
    const val = k[key];
    let statusClass = 'kpi-neutral', statusText = 'Sem dados';
    if (val !== null && val !== undefined) {
      if (benchmarkGood && val >= benchmarkGood) { statusClass = 'kpi-good'; statusText = '● Ótimo'; }
      else if (benchmarkWarn && val >= benchmarkWarn) { statusClass = 'kpi-warn'; statusText = '● Atenção'; }
      else if (benchmarkWarn) { statusClass = 'kpi-bad'; statusText = '● Crítico'; }
      else { statusClass = 'kpi-neutral'; statusText = ''; }
    }
    const display = val !== null && val !== undefined ? unit + val + suffix : '—';
    return `<div class="kpi-card">
      <input class="kpi-input" value="${val !== null && val !== undefined ? val : ''}" placeholder="—" type="number" step="0.01" onblur="saveKPI('${key}',this.value)" title="${label}">
      <div class="kpi-label">${label}</div>
      <div class="kpi-status ${statusClass}">${statusText}</div>
    </div>`;
  }

  el.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <div style="font-size:14px; font-weight:600; color:var(--text)">📊 KPIs: ${p.nome}</div>
      <button class="btn btn-sm btn-gold" onclick="openAgent('trafego','data_analyst')">📈 Analista de Dados</button>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🎯 Métricas Atuais — clique para editar</div>
      <div class="kpi-grid">
        ${kpiCard('Thumbstop %', 'thumbstop', '', '%', 25, 15)}
        ${kpiCard('CTR %', 'ctr', '', '%', 2, 1)}
        ${kpiCard('CPM R$', 'cpm', 'R$', '', null, null)}
        ${kpiCard('CPC R$', 'cpc', 'R$', '', null, null)}
        ${kpiCard('ROAS', 'roas', '', 'x', 3, 1.5)}
        ${kpiCard('CAC R$', 'cac', 'R$', '', null, null)}
        ${kpiCard('LTV R$', 'ltv', 'R$', '', null, null)}
        ${kpiCard('CVR %', 'cvr', '', '%', 3, 1)}
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🏆 Metas do Projeto</div>
      <div class="grid2">
        <div class="brief-field">
          <div class="brief-label">ROAS Target</div>
          <input class="brief-input" type="number" step="0.1" value="${m.roas_target || ''}" placeholder="Ex: 3.0" onblur="saveKPIMeta('roas_target',this.value)">
        </div>
        <div class="brief-field">
          <div class="brief-label">CPA Target (R$)</div>
          <input class="brief-input" type="number" step="1" value="${m.cpa_target || ''}" placeholder="Ex: 80" onblur="saveKPIMeta('cpa_target',this.value)">
        </div>
      </div>
    </div>

    ${k.roas && m.roas_target ? `
    <div class="card" style="border-color:${k.roas >= m.roas_target ? 'rgba(82,183,136,.3)' : 'rgba(230,57,70,.3)'}">
      <div class="card-title">📡 Diagnóstico Rápido</div>
      <div style="font-size:12px; color:var(--text2); line-height:1.8">
        ${k.roas >= m.roas_target
        ? `✅ ROAS <strong style="color:var(--green-bright)">${k.roas}x</strong> acima da meta de ${m.roas_target}x — campanha lucrativa.`
        : `⚠️ ROAS <strong style="color:var(--red-bright)">${k.roas}x</strong> abaixo da meta de ${m.roas_target}x — revisar criativos ou segmentação.`}
        ${k.thumbstop && k.thumbstop < 15 ? '<br>🚨 Thumbstop Rate baixo (' + k.thumbstop + '%) — o hook visual não está prendendo. Testar novos criativos com urgência.' : ''}
        ${k.ctr && k.ctr < 1 ? '<br>🚨 CTR baixo (' + k.ctr + '%) — copy do anúncio ou targeting fraco. Revisar segmentação e headline.' : ''}
      </div>
    </div>` : ''}`;
}

function saveKPI(key, value) {
  if (!currentProject.kpis) currentProject.kpis = {};
  currentProject.kpis[key] = value ? parseFloat(value) : null;
  renderKPIs();
}

function saveKPIMeta(key, value) {
  if (!currentProject.kpis) currentProject.kpis = {};
  if (!currentProject.kpis.meta) currentProject.kpis.meta = {};
  currentProject.kpis.meta[key] = value ? parseFloat(value) : null;
}

// Close modals on backdrop click
document.getElementById('agent-modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
document.getElementById('settings-modal').addEventListener('click', function (e) {
  if (e.target === this) closeSettings();
});

// Init API status indicator
(function initAPIStatus() {
  const key = localStorage.getItem('openrouter_key');
  if (key) {
    const pill = document.getElementById('api-status-pill');
    pill.style.background = 'rgba(82,183,136,.15)';
    pill.style.color = 'var(--green-bright)';
    pill.style.borderColor = 'rgba(82,183,136,.3)';
    pill.textContent = '⚙ API ✓';
  }
})();

// ═══════════════════════════════════════════════════════
//  LAUNCH
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
//  KANBAN
// ═══════════════════════════════════════════════════════

const KN_COLS = [
  { id: 'backlog', label: '📥 Backlog', cls: '' },
  { id: 'doing', label: '⚡ Fazendo', cls: 'kn-col-doing' },
  { id: 'stuck', label: '⚠ Travado', cls: 'kn-col-stuck' },
  { id: 'review', label: '🔍 Revisão', cls: 'kn-col-review' },
  { id: 'done', label: '✅ Feito', cls: 'kn-col-done' }
];
const KN_BOARDS = ['agentes', 'humanas', 'criativos', 'campanhas'];
let knBoard = 'agentes';
let knEditId = null;
let knPrio = 'media';

function knUid() { return Math.random().toString(36).slice(2, 10); }
function knLoad() {
  // Evita semear cards locais fake; Supabase é a fonte principal.
  let d = JSON.parse(localStorage.getItem('imperio_kanban') || 'null');
  if (!d) d = [];
  return d;
}
let knCards = knLoad();
function knSave(c) { c = c || knCards; localStorage.setItem('imperio_kanban', JSON.stringify(c)); }

function knSeed() {
  const t = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
  return [
    { id: knUid(), board: 'agentes', title: 'Gerar copies VSL Segredos da Captação', status: 'doing', project: 'Segredos da Captação', owner: 'Agente', priority: 'alta', deadline: t(1), notes: '', blocked_by: '' },
    { id: knUid(), board: 'agentes', title: 'Análise de concorrentes Deep Networking', status: 'stuck', project: 'Deep Networking', owner: 'Agente', priority: 'alta', deadline: t(-1), notes: '', blocked_by: 'Falta URL dos perfis para scraping' },
    { id: knUid(), board: 'agentes', title: 'Mapear avatar Kit Tráfego', status: 'review', project: 'Kit Tráfego', owner: 'Agente', priority: 'media', deadline: t(7), notes: '', blocked_by: '' },
    { id: knUid(), board: 'agentes', title: 'Roteiro email onboarding Expert IA', status: 'backlog', project: 'Expert IA', owner: 'Agente', priority: 'baixa', deadline: '', notes: '', blocked_by: '' },
    { id: knUid(), board: 'humanas', title: 'Aprovar copies VSL — prazo amanhã', status: 'doing', project: 'Segredos da Captação', owner: 'Você', priority: 'alta', deadline: t(1), notes: 'Revisar 5 variações', blocked_by: '' },
    { id: knUid(), board: 'humanas', title: 'Gravar VSL principal', status: 'stuck', project: 'Segredos da Captação', owner: 'Você', priority: 'alta', deadline: t(-1), notes: '', blocked_by: 'Studio sem disponibilidade até quinta' },
    { id: knUid(), board: 'humanas', title: 'Configurar pixel Meta nas páginas', status: 'backlog', project: 'Kit Tráfego', owner: 'Você', priority: 'alta', deadline: t(5), notes: '', blocked_by: '' },
    { id: knUid(), board: 'humanas', title: 'Revisão módulo 3 Expert IA', status: 'review', project: 'Expert IA', owner: 'Você', priority: 'media', deadline: t(7), notes: '', blocked_by: '' },
    { id: knUid(), board: 'criativos', title: 'Criativo hook "Estou travado" carrossel', status: 'doing', project: 'Segredos da Captação', owner: 'Agente', priority: 'alta', deadline: t(1), notes: '', blocked_by: '' },
    { id: knUid(), board: 'criativos', title: 'Thumb YouTube Deep Networking', status: 'stuck', project: 'Deep Networking', owner: 'Você', priority: 'media', deadline: '', notes: '', blocked_by: 'Aguardando foto profissional' },
    { id: knUid(), board: 'criativos', title: '3 headlines Kit Tráfego', status: 'backlog', project: 'Kit Tráfego', owner: 'Agente', priority: 'media', deadline: '', notes: '', blocked_by: '' },
    { id: knUid(), board: 'criativos', title: 'Vídeo UGC simulado Manual Fechamento', status: 'review', project: 'Manual Fechamento', owner: 'Você', priority: 'alta', deadline: t(1), notes: '', blocked_by: '' },
    { id: knUid(), board: 'campanhas', title: 'Campanha fundo funil Segredos', status: 'doing', project: 'Segredos da Captação', owner: 'Você', priority: 'alta', deadline: t(7), notes: '3 públicos + 2 criativos', blocked_by: '' },
    { id: knUid(), board: 'campanhas', title: 'Retargeting 3 dias Kit Tráfego', status: 'stuck', project: 'Kit Tráfego', owner: 'Você', priority: 'alta', deadline: t(-1), notes: '', blocked_by: 'Pixel sem dados suficientes (<500 eventos)' },
    { id: knUid(), board: 'campanhas', title: 'Campanha awareness Expert IA', status: 'backlog', project: 'Expert IA', owner: 'Você', priority: 'media', deadline: '', notes: '', blocked_by: '' },
    { id: knUid(), board: 'campanhas', title: 'A/B criativos Deep Networking', status: 'review', project: 'Deep Networking', owner: 'Você', priority: 'media', deadline: t(7), notes: '', blocked_by: '' },
  ];
}

function showKanban() {
  document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('view-kanban').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-kanban').classList.add('active');
  // Populate project select if needed
  const sel = document.getElementById('kn-filter-proj');
  if (sel && sel.options.length <= 1) {
    PROJECTS.forEach(p => { sel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
  }
  const fsel = document.getElementById('kn-f-project');
  if (fsel && fsel.options.length <= 1) {
    PROJECTS.forEach(p => { fsel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`; });
  }
  // Populate assignee filter with EQUIPE members (always refresh)
  const afilter = document.getElementById('kn-filter-assignee');
  if (afilter) {
    afilter.innerHTML = '<option value="">👥 Todos os membros</option>' +
      EQUIPE.map(m => `<option value="${m.id}">${m.emoji || '👤'} ${m.nome}</option>`).join('');
  }
  renderKanban();
}

function setKnBoard(b) { knBoard = b; renderKanban(); }

function knFilteredCards(boardFilter) {
  const pf = (document.getElementById('kn-filter-proj') || {}).value || '';
  const of = (document.getElementById('kn-filter-owner') || {}).value || '';
  const af = (document.getElementById('kn-filter-assignee') || {}).value || '';
  return knCards.filter(c => {
    if (boardFilter && boardFilter !== 'all' && c.board !== boardFilter) return false;
    if (pf && c.project !== pf) return false;
    if (of === 'Você' && c.owner !== 'Você') return false;
    if (of === 'Agente' && c.owner !== 'Agente') return false;
    if (af && c.assignee !== af) return false;
    return true;
  });
}

function renderKanban() {
  const board = document.getElementById('kn-board');
  if (!board) return;
  const isAll = knBoard === 'all';

  KN_BOARDS.forEach(b => {
    const tab = document.getElementById('kntab-' + b);
    if (tab) tab.className = 'kn-btab' + (b === knBoard ? ' active' : '');
    const cnt = document.getElementById('knc-' + b);
    if (cnt) cnt.textContent = knCards.filter(c => c.board === b && c.status !== 'done').length;
  });
  const allTab = document.getElementById('kntab-all');
  if (allTab) allTab.className = 'kn-btab' + (knBoard === 'all' ? ' active' : '');

  board.innerHTML = KN_COLS.map(col => {
    const list = knFilteredCards(isAll ? null : knBoard).filter(c => c.status === col.id);
    const cardsHtml = list.length
      ? list.map(c => knRenderCard(c)).join('')
      : `<div class="kn-empty">Nenhuma tarefa</div>`;
    return `<div class="kn-col ${col.cls}">
      <div class="kn-col-hdr">
        <div class="kn-col-hdr-title">${col.label}</div>
        <div class="kn-col-cnt">${list.length}</div>
        <button class="kn-col-add" onclick="openKanbanModal('${col.id}')">+</button>
      </div>
      <div class="kn-cards">${cardsHtml}</div>
    </div>`;
  }).join('');

  // Stats
  const all = knFilteredCards(null);
  const stuck = all.filter(c => c.status === 'stuck').length;
  const doing = all.filter(c => c.status === 'doing').length;
  const done = all.filter(c => c.status === 'done').length;
  const stEl = document.getElementById('kn-stat-stuck');
  const doEl = document.getElementById('kn-stat-doing');
  const dnEl = document.getElementById('kn-stat-done');
  if (stEl) stEl.textContent = `⚠ ${stuck} Travado${stuck !== 1 ? 's' : ''}`;
  if (doEl) doEl.textContent = `⚡ ${doing} Fazendo`;
  if (dnEl) dnEl.textContent = `✅ ${done} Feito${done !== 1 ? 's' : ''}`;

  // Sidebar badge
  const badge = document.getElementById('kanban-stuck-badge');
  if (badge) { badge.textContent = stuck; badge.style.display = stuck > 0 ? 'inline-flex' : 'none'; }
}

function knRenderCard(c) {
  const today = new Date().toISOString().slice(0, 10);
  let dlHtml = '';
  if (c.deadline) {
    if (c.deadline < today) dlHtml = `<span style="font-size:10px;color:#e05c5c;font-weight:600">🔴 ${c.deadline.slice(5).replace('-', '/')}</span>`;
    else if (c.deadline === today) dlHtml = `<span style="font-size:10px;color:#e8844a;font-weight:600">🟡 Hoje</span>`;
    else dlHtml = `<span style="font-size:10px;color:var(--text3)">📅 ${c.deadline.slice(5).replace('-', '/')}</span>`;
  }
  const blockedHtml = c.status === 'stuck' && c.blocked_by
    ? `<div style="margin-top:6px;padding:5px 7px;border-radius:5px;background:rgba(224,92,92,.1);border:1px solid rgba(224,92,92,.2);font-size:10px;color:#e05c5c">⚠ ${c.blocked_by}</div>` : '';
  const bNames = { agentes: 'Agente', humanas: 'Humana', criativos: 'Criativo', campanhas: 'Campanha' };
  const bColors = { agentes: 'rgba(155,127,232,.12);color:#9b7fe8', humanas: 'rgba(91,141,238,.12);color:#5b8dee', criativos: 'rgba(232,132,74,.12);color:#e8844a', campanhas: 'rgba(82,183,136,.12);color:#52b788' };
  // Look up member from EQUIPE for assignee display
  const assigneeMember = c.assignee ? EQUIPE.find(m => m.id === c.assignee || m.nome === c.assignee) : null;
  const assigneeHtml = assigneeMember
    ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--text2);background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:2px 7px">${assigneeMember.foto ? `<img src="${assigneeMember.foto}" style="width:14px;height:14px;border-radius:50%;object-fit:cover">` : assigneeMember.emoji || '👤'} ${assigneeMember.nome.split(' ')[0]}</span>` : '';
  return `<div class="kn-card kp-${c.priority}" onclick="openKanbanModal(null,'${c.id}')">
    ${c.project ? `<div style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(212,168,67,.12);color:var(--gold);text-transform:uppercase;letter-spacing:.3px;margin-bottom:5px;display:inline-block">${c.project.slice(0, 14)}</div>` : ''}
    <div style="font-size:12px;font-weight:600;line-height:1.4;color:var(--text)">${c.title}</div>
    ${blockedHtml}
    <div style="display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap">
      ${c.owner ? `<span style="font-size:10px;color:var(--text3)">👤 ${c.owner}</span>` : ''}
      ${assigneeHtml}
      ${dlHtml}
    </div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">
      <span style="font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;background:${bColors[c.board]}">${bNames[c.board]}</span>
      ${c.priority === 'alta' ? `<span style="font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;background:rgba(224,92,92,.12);color:#e05c5c">ALTA</span>` : ''}
    </div>
  </div>`;
}

function openKanbanModal(defaultStatus, cardId) {
  knEditId = cardId || null;
  knPrio = 'media';
  const modal = document.getElementById('kn-modal');
  const delBtn = document.getElementById('kn-del-btn');
  const moveBtns = document.getElementById('kn-move-btns');

  // Populate assignee dropdown with team members
  const asel = document.getElementById('kn-f-assignee');
  if (asel) {
    asel.innerHTML = '<option value="">— Sem atribuição —</option>' +
      EQUIPE.map(m => `<option value="${m.id}">${m.emoji || '👤'} ${m.nome} (${m.cargo || 'Membro'})</option>`).join('');
  }

  if (cardId) {
    const c = knCards.find(x => x.id === cardId);
    document.getElementById('kn-modal-title').textContent = 'Editar Tarefa';
    document.getElementById('kn-f-title').value = c.title;
    document.getElementById('kn-f-board').value = c.board;
    document.getElementById('kn-f-status').value = c.status;
    document.getElementById('kn-f-project').value = c.project || '';
    document.getElementById('kn-f-owner').value = c.owner || '';
    if (asel) asel.value = c.assignee || '';
    document.getElementById('kn-f-deadline').value = c.deadline || '';
    document.getElementById('kn-f-blocked').value = c.blocked_by || '';
    document.getElementById('kn-f-notes').value = c.notes || '';
    knPrio = c.priority || 'media';
    delBtn.style.display = 'block';
    moveBtns.style.display = 'flex';
    knToggleBlocked(c.status);
  } else {
    document.getElementById('kn-modal-title').textContent = 'Nova Tarefa';
    document.getElementById('kn-f-title').value = '';
    document.getElementById('kn-f-board').value = knBoard !== 'all' ? knBoard : 'agentes';
    document.getElementById('kn-f-status').value = defaultStatus || 'backlog';
    document.getElementById('kn-f-project').value = '';
    document.getElementById('kn-f-owner').value = '';
    if (asel) asel.value = window._prefilledAssignee || '';
    window._prefilledAssignee = null;
    document.getElementById('kn-f-deadline').value = '';
    document.getElementById('kn-f-blocked').value = '';
    document.getElementById('kn-f-notes').value = '';
    knPrio = 'media';
    delBtn.style.display = 'none';
    moveBtns.style.display = 'none';
    knToggleBlocked(defaultStatus || 'backlog');
  }
  knRenderPrio();
  modal.style.opacity = '1'; modal.style.pointerEvents = 'all';
  modal.onclick = (e) => { if (e.target === modal) closeKanbanModal(); };
}

function closeKanbanModal() {
  const modal = document.getElementById('kn-modal');
  modal.style.opacity = '0'; modal.style.pointerEvents = 'none';
  knEditId = null;
}

function knToggleBlocked(status) {
  const grp = document.getElementById('kn-blocked-grp');
  if (grp) grp.style.display = status === 'stuck' ? 'flex' : 'none';
}

function setKnPrio(p) { knPrio = p; knRenderPrio(); }

function knRenderPrio() {
  const opts = document.querySelectorAll('.kn-prio');
  const prios = ['alta', 'media', 'baixa'];
  const styles = {
    alta: 'background:rgba(224,92,92,.12);border:1px solid rgba(224,92,92,.4);color:#e05c5c',
    media: 'background:rgba(212,168,67,.12);border:1px solid rgba(212,168,67,.4);color:var(--gold)',
    baixa: 'background:rgba(82,183,136,.12);border:1px solid rgba(82,183,136,.4);color:#52b788'
  };
  opts.forEach((el, i) => {
    const p = prios[i];
    el.style.cssText = `flex:1;text-align:center;padding:6px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;transition:.15s;` +
      (p === knPrio ? styles[p] : 'background:transparent;border:1px solid var(--border2);color:var(--text3)');
  });
}

function saveKanbanCard() {
  const title = document.getElementById('kn-f-title').value.trim();
  if (!title) { document.getElementById('kn-f-title').focus(); return; }
  const card = {
    id: knEditId || knUid(),
    title,
    board: document.getElementById('kn-f-board').value,
    status: document.getElementById('kn-f-status').value,
    project: document.getElementById('kn-f-project').value,
    owner: document.getElementById('kn-f-owner').value,
    assignee: document.getElementById('kn-f-assignee')?.value || '',
    priority: knPrio,
    deadline: document.getElementById('kn-f-deadline').value,
    blocked_by: document.getElementById('kn-f-blocked').value,
    notes: document.getElementById('kn-f-notes').value,
  };
  if (knEditId) {
    const idx = knCards.findIndex(c => c.id === knEditId);
    if (idx !== -1) knCards[idx] = card;
  } else {
    knCards.push(card);
  }
  knSave();
  closeKanbanModal();
  renderKanban();
}

function knDeleteCard() {
  if (!knEditId) return;
  if (!confirm('Excluir esta tarefa?')) return;
  knCards = knCards.filter(c => c.id !== knEditId);
  knSave();
  closeKanbanModal();
  renderKanban();
}

function knMoveCard(dir) {
  if (!knEditId) return;
  const c = knCards.find(x => x.id === knEditId);
  if (!c) return;
  const colIds = KN_COLS.map(x => x.id);
  const idx = colIds.indexOf(c.status);
  if (dir === 'prev' && idx > 0) c.status = colIds[idx - 1];
  if (dir === 'next' && idx < colIds.length - 1) c.status = colIds[idx + 1];
  document.getElementById('kn-f-status').value = c.status;
  knToggleBlocked(c.status);
  knSave();
  renderKanban();
}

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
      fase_consciencia: '', sub_avatares: [], storyboard: []
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
  reader.onload = function (e) {
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

// ═══════════════════════════════════════════════════════
//  CONTEXT BUILDER
// ═══════════════════════════════════════════════════════
function showContextBuilder() {
  document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('view-context').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-context').classList.add('active');
  // Populate project select
  const sel = document.getElementById('ctx-project-sel');
  sel.innerHTML = '<option value="">Selecionar projeto...</option>';
  PROJECTS.forEach(p => { sel.innerHTML += `<option value="${p.id}">${p.icon} ${p.nome}</option>`; });
  // Pre-select currentProject
  if (currentProject) sel.value = currentProject.id;
}

function buildContext() {
  const selId = document.getElementById('ctx-project-sel').value;
  const proj = PROJECTS.find(p => p.id === selId);
  if (!proj) { document.getElementById('ctx-output').value = '⚠️ Selecione um projeto primeiro.'; return; }

  const role = document.getElementById('ctx-agent-role').value;
  const inc = {
    briefing: document.getElementById('ctx-inc-briefing').checked,
    avatar: document.getElementById('ctx-inc-avatar').checked,
    branding: document.getElementById('ctx-inc-branding').checked,
    kpis: document.getElementById('ctx-inc-kpis').checked,
    kanban: document.getElementById('ctx-inc-kanban').checked,
    docs: document.getElementById('ctx-inc-docs').checked,
    kb: document.getElementById('ctx-inc-kb').checked,
    os: document.getElementById('ctx-inc-os').checked,
  };

  const roleDescriptions = {
    generalista: 'Você é um agente operacional generalista do Império Digital. Sua função é executar tarefas com base no contexto fornecido.',
    copy: 'Você é um Copywriter especialista do Império Digital. Sua função é criar copy de alta conversão: VSLs, emails, anúncios e conteúdo persuasivo usando as técnicas dos melhores copywriters do mundo.',
    avatar: 'Você é um Especialista em Inteligência de Avatar do Império Digital. Sua função é fazer pesquisa profunda, mapear psicologia do cliente e identificar gatilhos emocionais que geram conversão.',
    trafego: 'Você é um Media Buyer especialista do Império Digital. Sua função é planejar, estruturar e otimizar campanhas de tráfego pago (Meta, Google, TikTok).',
    criativo: 'Você é um Diretor Criativo do Império Digital. Sua função é criar conceitos visuais, briefings de design, roteiros de vídeo e direção de criativos de alta performance.',
    estrategia: 'Você é um Estrategista de Negócios do Império Digital. Sua função é analisar situações, definir estratégias de produto, posicionamento e lançamento.',
  };

  const lines = [];
  const h = (t) => `\n${'═'.repeat(60)}\n## ${t}\n${'═'.repeat(60)}`;

  // Role
  lines.push(`[CONTEXTO DO SISTEMA — IMPÉRIO DIGITAL]\n`);
  lines.push(`PAPEL DO AGENTE: ${roleDescriptions[role]}`);
  lines.push(`\nREGRAS:\n- Responda sempre em Português do Brasil\n- Use o tom de voz e branding do projeto para qualquer output\n- Consulte o avatar antes de criar qualquer copy ou criativo\n- Documente outputs importantes para uso futuro`);

  // Briefing
  if (inc.briefing) {
    lines.push(h('BRIEFING DO PROJETO'));
    lines.push(`Nome: ${proj.icon} ${proj.nome}`);
    lines.push(`Produto: ${proj.produto || 'Não definido'}`);
    lines.push(`Preço: ${proj.preco || 'Não definido'}`);
    lines.push(`Categoria: ${proj.categoria}`);
    lines.push(`Status: ${proj.status}`);
    lines.push(`Objetivo: ${proj.objetivo || 'Não definido'}`);
    lines.push(`Contexto: ${proj.contexto || 'Não definido'}`);
    if (proj.links) {
      const ls = Object.entries(proj.links).filter(([k, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      if (ls) lines.push(`Links:\n${ls}`);
    }
    const pp = proj.pipeline;
    if (pp) {
      lines.push(`Pipeline: Avatar ${pp.avatar || 0}% | Funil ${pp.funil || 0}% | Copy ${pp.copy || 0}% | Design ${pp.design || 0}% | Tráfego ${pp.trafego || 0}%`);
    }
  }

  // Avatar
  if (inc.avatar && proj.avatar) {
    const av = proj.avatar;
    lines.push(h('AVATAR DO PROJETO'));
    if (av.externo) lines.push(`Desejo Externo: ${av.externo}`);
    if (av.interno) lines.push(`Desejo Interno (real): ${av.interno}`);
    if (av.dores_superficiais?.length) lines.push(`Dores Superficiais:\n${av.dores_superficiais.map(d => `- ${d}`).join('\n')}`);
    if (av.dores_profundas?.length) lines.push(`Dores Profundas:\n${av.dores_profundas.map(d => `- ${d}`).join('\n')}`);
    if (av.medos?.length) lines.push(`Medos:\n${av.medos.map(d => `- ${d}`).join('\n')}`);
    if (av.objecoes?.length) lines.push(`Objeções:\n${av.objecoes.map(d => `- ${d}`).join('\n')}`);
    if (av.inimigo) lines.push(`Inimigo Externo: ${av.inimigo}`);
    if (av.resultado_sonhado) lines.push(`Resultado Sonhado: ${av.resultado_sonhado}`);
    if (av.trigger_event) lines.push(`Trigger Event: ${av.trigger_event}`);
    if (av.fase_consciencia) lines.push(`Fase de Consciência: ${av.fase_consciencia}`);
    if (av.sub_avatares?.length) {
      lines.push(`Sub-Avatares:`);
      av.sub_avatares.forEach(s => lines.push(`- ${s.nome}: ${s.desc}`));
    }
    if (av.storyboard?.length) {
      lines.push(`Storyboard:`);
      av.storyboard.forEach(s => lines.push(`[${s.arc}] ${s.text}`));
    }
  }

  // Branding
  if (inc.branding && proj.branding) {
    const br = proj.branding;
    lines.push(h('BRANDING & TOM DE VOZ'));
    if (br.arquetipo) lines.push(`Arquétipo: ${br.arquetipo}`);
    if (br.manifesto) lines.push(`Manifesto: ${br.manifesto}`);
    if (br.mecanismo_key) lines.push(`Mecanismo Único: ${br.mecanismo_key}`);
    if (br.inimigo_comum) lines.push(`Inimigo Comum: ${br.inimigo_comum}`);
    if (br.personalidade) lines.push(`Personalidade: ${br.personalidade}`);
    if (br.linguagem?.usa?.length) lines.push(`Usa: ${br.linguagem.usa.join(', ')}`);
    if (br.linguagem?.evita?.length) lines.push(`Evita: ${br.linguagem.evita.join(', ')}`);
    if (br.cores) lines.push(`Cores: ${br.cores}`);
  }

  // KPIs
  if (inc.kpis && proj.kpis) {
    const k = proj.kpis;
    const vals = Object.entries(k).filter(([key, v]) => v !== null && key !== 'meta').map(([key, v]) => `${key.toUpperCase()}: ${v}`).join(' | ');
    if (vals) {
      lines.push(h('KPIs ATUAIS'));
      lines.push(vals);
    }
  }

  // Kanban
  if (inc.kanban) {
    const projCards = knCards.filter(c => c.project === proj.nome);
    if (projCards.length) {
      lines.push(h('TAREFAS KANBAN (PROJETO ATUAL)'));
      const byStatus = {};
      projCards.forEach(c => { (byStatus[c.status] = byStatus[c.status] || []).push(c); });
      Object.entries(byStatus).forEach(([status, cards]) => {
        lines.push(`\n${status.toUpperCase()}:`);
        cards.forEach(c => {
          let line = `- [${c.priority || 'normal'}] ${c.title}`;
          if (c.owner) line += ` (${c.owner})`;
          if (c.deadline) line += ` — prazo: ${c.deadline}`;
          if (c.blocked_by) line += ` ⚠️ BLOQUEADO: ${c.blocked_by}`;
          lines.push(line);
        });
      });
    }
  }

  // Docs
  if (inc.docs) {
    const projDocs = DOCS.filter(d => d.project === proj.nome);
    if (projDocs.length) {
      lines.push(h('DOCUMENTAÇÃO DO PROJETO'));
      projDocs.forEach(d => {
        lines.push(`\n### [${d.cat}] ${d.title}`);
        if (d.tags?.length) lines.push(`Tags: ${d.tags.join(', ')}`);
        lines.push(d.body || '');
      });
    }
  }

  // KB
  if (inc.kb) {
    const kbSections = ['empresa', 'os_guia', 'frameworks_copy'];
    if (role === 'avatar') kbSections.push('avatares');
    if (role === 'copy') kbSections.push('frameworks_lancamento');
    if (role === 'trafego') kbSections.push('frameworks_trafego');
    if (role === 'estrategia') kbSections.push('frameworks_lancamento');
    kbSections.push('sops_globais');

    lines.push(h('KNOWLEDGE BASE (SELECIONADO)'));
    kbSections.forEach(sid => {
      const s = KB_SECTIONS.find(x => x.id === sid);
      if (!s) return;
      const content = KB_DATA[sid] !== undefined ? KB_DATA[sid] : (KB_DEFAULT_CONTENT[sid] || '');
      if (content) lines.push(`\n${content}`);
    });
  }

  // Full OS
  if (inc.os) {
    const osContent = KB_DATA['os_guia'] !== undefined ? KB_DATA['os_guia'] : (KB_DEFAULT_CONTENT['os_guia'] || '');
    if (!inc.kb || !['os_guia'].includes('os_guia')) {
      lines.push(h('IMPÉRIO OS — GUIA COMPLETO'));
      lines.push(osContent);
    }
  }

  lines.push(`\n${'═'.repeat(60)}\n[FIM DO CONTEXTO — Aguardando instrução]`);

  const output = lines.join('\n');
  document.getElementById('ctx-output').value = output;

  // Stats
  const words = output.split(/\s+/).filter(Boolean).length;
  const chars = output.length;
  const estTokens = Math.round(chars / 4);
  const stats = document.getElementById('ctx-stats');
  stats.style.display = 'block';
  stats.innerHTML = `📊 <strong>${words} palavras</strong> · ${chars.toLocaleString()} caracteres · ~${estTokens.toLocaleString()} tokens estimados<br>✅ Pronto para colar em qualquer agente de IA`;
}

function copyContext() {
  const ta = document.getElementById('ctx-output');
  if (!ta.value || ta.value.includes('Selecione um projeto')) {
    buildContext();
  }
  if (!ta.value) return;
  navigator.clipboard.writeText(ta.value).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = '✅ Copiado!';
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(() => {
    ta.select(); document.execCommand('copy');
  });
}

// ═══════════════════════════════════════════════════════
//  NAVIGATION — atualizar showOverview e showSection
// ═══════════════════════════════════════════════════════
function activatePanel(viewId, navId) {
  document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
  const view = document.getElementById(viewId);
  if (view) view.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navId) {
    const nav = document.getElementById(navId);
    if (nav) nav.classList.add('active');
  }
}

// ═══════════════════════════════════════════════════════
//  TOOLS SECTION
// ═══════════════════════════════════════════════════════
function showTools() {
  document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('view-tools').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-tools').classList.add('active');
  const toolKeys = {
    'apify': 'tool_apify_key', 'vercel': 'tool_vercel_token', 'gemini': 'tool_gemini_key',
    'openrouter_tool': 'openrouter_key', 'replicate': 'tool_replicate_key',
    'meta_api': 'tool_meta_token', 'ga4': 'tool_ga4_id',
    'openclaw_monitor': 'openclaw_url', 'supabase_sync': 'tool_supabase_url'
  };
  Object.entries(toolKeys).forEach(([tool, lsKey]) => {
    const el = document.getElementById('tool-status-' + tool);
    if (!el) return;
    const val = localStorage.getItem(lsKey);
    if (val) { el.textContent = '✓ Conectado'; el.style.color = 'var(--green-bright)'; }
    else { el.textContent = 'Configurar'; el.style.color = 'var(--gold)'; }
  });
}

// ── Tools Tabs ──
function showToolsTab(tab) {
  ['ferramentas', 'links'].forEach(t => {
    const panel = document.getElementById('tools-tab-' + t);
    if (panel) panel.style.display = t === tab ? '' : 'none';
    const tabEl = document.getElementById('ttab-' + t);
    if (tabEl) tabEl.classList.toggle('active', t === tab);
  });
  if (tab === 'links') renderLinks();
}

// ═══════════════════════════════════════════════════════
//  LINKS RÁPIDOS
// ═══════════════════════════════════════════════════════
let _qlEditId = null;
let _qlCatFilter = '';

function getLinks() { return JSON.parse(localStorage.getItem('imperio_quick_links') || '[]'); }
function saveLinks(arr) { localStorage.setItem('imperio_quick_links', JSON.stringify(arr)); }

function openAddLink(editId) {
  _qlEditId = editId || null;
  const modal = document.getElementById('ql-modal');
  const cats = [...new Set(getLinks().map(l => l.cat).filter(Boolean))];
  const dl = document.getElementById('ql-cat-datalist');
  if (dl) dl.innerHTML = cats.map(c => `<option value="${c}">`).join('');
  if (editId) {
    const link = getLinks().find(l => l.id === editId);
    if (!link) return;
    document.getElementById('ql-modal-title').textContent = '✏️ Editar Link';
    document.getElementById('ql-emoji').value = link.emoji || '🔗';
    document.getElementById('ql-nome').value = link.nome || '';
    document.getElementById('ql-url').value = link.url || '';
    document.getElementById('ql-cat').value = link.cat || '';
    document.getElementById('ql-cor').value = link.cor || '#d4af37';
    document.getElementById('ql-desc').value = link.desc || '';
  } else {
    document.getElementById('ql-modal-title').textContent = '🔗 Novo Link';
    ['ql-nome', 'ql-url', 'ql-cat', 'ql-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('ql-emoji').value = '🔗';
    document.getElementById('ql-cor').value = '#d4af37';
  }
  modal.style.opacity = '1'; modal.style.pointerEvents = 'auto';
}

function closeAddLink() {
  const modal = document.getElementById('ql-modal');
  modal.style.opacity = '0'; modal.style.pointerEvents = 'none';
  _qlEditId = null;
}

function saveLink() {
  const nome = document.getElementById('ql-nome').value.trim();
  const url = document.getElementById('ql-url').value.trim();
  if (!nome) { alert('Nome é obrigatório'); return; }
  if (!url) { alert('URL é obrigatória'); return; }
  const links = getLinks();
  const entry = {
    id: _qlEditId || ('ql_' + Date.now()),
    emoji: document.getElementById('ql-emoji').value.trim() || '🔗',
    nome, url,
    cat: document.getElementById('ql-cat').value.trim(),
    cor: document.getElementById('ql-cor').value,
    desc: document.getElementById('ql-desc').value.trim()
  };
  const idx = links.findIndex(l => l.id === entry.id);
  if (idx !== -1) links[idx] = entry; else links.push(entry);
  saveLinks(links);
  closeAddLink();
  renderLinks();
}

function deleteLink(id) {
  if (!confirm('Remover este link?')) return;
  saveLinks(getLinks().filter(l => l.id !== id));
  renderLinks();
}

function qlSetCat(cat) { _qlCatFilter = cat; renderLinks(); }

function renderLinks() {
  const links = getLinks();
  const grid = document.getElementById('ql-grid');
  const empty = document.getElementById('ql-empty');
  const catBar = document.getElementById('ql-cat-bar');
  if (!grid) return;
  const cats = [...new Set(links.map(l => l.cat).filter(Boolean))];
  catBar.innerHTML = ['', ...cats].map(c => {
    const active = _qlCatFilter === c;
    const label = c || 'Todos';
    return `<span onclick="qlSetCat('${c}')" style="cursor:pointer;font-size:11px;padding:4px 14px;border-radius:12px;border:1px solid ${active ? 'var(--gold)' : 'var(--border)'};color:${active ? 'var(--gold)' : 'var(--text3)'};background:${active ? 'rgba(212,175,55,.1)' : 'var(--surface2)'};transition:.15s">${label}</span>`;
  }).join('');
  const filtered = _qlCatFilter ? links.filter(l => l.cat === _qlCatFilter) : links;
  if (!filtered.length) {
    grid.innerHTML = ''; grid.style.display = 'none';
    empty.style.display = 'block'; return;
  }
  empty.style.display = 'none'; grid.style.display = 'grid';
  grid.innerHTML = filtered.map(l => {
    const cor = l.cor || '#d4af37';
    const catPill = l.cat ? `<span style="font-size:9px;color:var(--text3);border:1px solid var(--border);padding:1px 7px;border-radius:8px;background:var(--surface2)">${l.cat}</span>` : '';
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:.2s" onmouseover="this.style.borderColor='${cor}';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--border)';this.style.transform='none'">
          <div style="height:4px;background:${cor}"></div>
          <div style="padding:14px;flex:1;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:22px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--surface2);border-radius:8px;border:1px solid var(--border);flex-shrink:0">${l.emoji || '🔗'}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:3px">${l.nome}</div>
                ${catPill}
              </div>
            </div>
            ${l.desc ? `<div style="font-size:10px;color:var(--text3);line-height:1.45">${l.desc}</div>` : ''}
            <div style="font-size:9px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.55">${l.url}</div>
          </div>
          <div style="padding:10px 14px;border-top:1px solid var(--border);display:flex;gap:6px">
            <a href="${l.url}" target="_blank" rel="noopener" style="flex:1;text-align:center;background:${cor};color:#0a0a0f;border:none;padding:7px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px">↗ Abrir</a>
            <button onclick="openAddLink('${l.id}')" style="background:var(--surface2);border:1px solid var(--border);color:var(--text2);padding:6px 10px;border-radius:7px;font-size:11px;cursor:pointer" title="Editar">✏️</button>
            <button onclick="deleteLink('${l.id}')" style="background:var(--surface2);border:1px solid var(--border);color:#e05c5c;padding:6px 10px;border-radius:7px;font-size:11px;cursor:pointer" title="Remover">✕</button>
          </div>
        </div>`;
  }).join('');
}

let currentTool = null;
function openTool(toolId) {
  currentTool = toolId;
  const panel = document.getElementById('tool-panel');
  const titleEl = document.getElementById('tool-panel-title');
  const body = document.getElementById('tool-panel-body');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const toolDefs = {
    apify: { name: '🕷️ Apify — Pesquisa de Mercado', lsKey: 'tool_apify_key', label: 'API Token (Apify)', hint: 'Encontre em https://console.apify.com/account/integrations', placeholder: 'apify_api_...', useCases: ['Scraping de perfis de concorrentes', 'Coleta de reviews e avaliações', 'Monitoramento de preços de concorrentes', 'Pesquisa de palavras-chave e tendências'] },
    vercel: { name: '▲ Vercel — Deploy Automático', lsKey: 'tool_vercel_token', label: 'Token de Acesso (Vercel)', hint: 'Encontre em vercel.com/account/tokens', placeholder: 'vercel_...', useCases: ['Deploy automático de páginas de captura', 'CI/CD para funis de vendas', 'Subida de landing pages sem precisar de dev', 'Preview de páginas antes do go-live'] },
    gemini: { name: '✨ Gemini — IA do Google', lsKey: 'tool_gemini_key', label: 'API Key (Google AI Studio)', hint: 'Encontre em aistudio.google.com/apikey', placeholder: 'AIza...', useCases: ['Análise de documentos e PDFs de mercado', 'Geração de conteúdo de longa duração', 'Pesquisa e síntese de dados de concorrência', 'Moderação e análise de comentários'] },
    openrouter_tool: { name: '⚡ OpenRouter — Multi-LLM', lsKey: 'openrouter_key', label: 'API Key (OpenRouter)', hint: 'Encontre em openrouter.ai/keys', placeholder: 'sk-or-...', useCases: ['Acesso a Claude, GPT-4, Gemini com uma única chave', 'Fallback automático entre modelos', 'Comparação de outputs entre modelos', 'Controle de custos por modelo'] },
    replicate: { name: '🎨 Replicate — Geração Visual', lsKey: 'tool_replicate_key', label: 'API Token (Replicate)', hint: 'Encontre em replicate.com/account/api-tokens', placeholder: 'r8_...', useCases: ['Geração de imagens para criativos (Flux, SDXL)', 'Geração de thumbnails de YouTube', 'Criação de assets visuais para anúncios', 'Vídeos curtos para UGC simulados'] },
    meta_api: { name: '📣 Meta API — Marketing', lsKey: 'tool_meta_token', label: 'Access Token (Meta for Developers)', hint: 'Crie em developers.facebook.com/tools/explorer', placeholder: 'EAAGm...', useCases: ['Buscar métricas de campanhas em tempo real', 'Criar e pausar anúncios automaticamente', 'Sincronizar públicos (custom audiences)', 'Relatórios automáticos de performance'] },
    ga4: { name: '📊 Google Analytics 4', lsKey: 'tool_ga4_id', label: 'Measurement ID (GA4)', hint: 'Encontre em analytics.google.com → Admin → Data Streams', placeholder: 'G-XXXXXXXXXX', useCases: ['Monitorar conversões em páginas de captura', 'Acompanhar funil completo de vendas', 'Relatórios de comportamento de usuários', 'Eventos customizados por produto'] },
    openclaw_monitor: { name: '🕷️ Monitor OpenClaw', lsKey: 'openclaw_url', label: 'Webhook URL do OpenClaw', hint: 'Configure o webhook no seu painel OpenClaw', placeholder: 'https://...', useCases: ['Ver status de cada task em execução', 'Monitorar fila de agentes em tempo real', 'Receber notificações de tasks concluídas', 'Debugar execuções com falha'] },
    supabase_sync: { name: '🗄️ Sincronizar Supabase', lsKey: 'tool_supabase_url', label: 'URL do Projeto Supabase', hint: 'Encontre em supabase.com → seu projeto → Settings → API', placeholder: 'https://xxxx.supabase.co', useCases: ['Persistir dados do HQ na nuvem', 'Colaboração em tempo real com o time', 'Backup automático de todos os projetos', 'Acesso de múltiplos dispositivos'] },
  };

  if (toolId === 'roas_calc') {
    titleEl.textContent = '🧮 Calculadora ROAS';
    body.innerHTML = `
          <div class="grid2">
            <div>
              <div class="brief-field"><div class="brief-label">Preço (R$)</div><input id="rc-preco" class="brief-input" type="number" value="497" oninput="calcROAS()"></div>
              <div class="brief-field"><div class="brief-label">Margem (%)</div><input id="rc-margem" class="brief-input" type="number" value="80" oninput="calcROAS()"></div>
              <div class="brief-field"><div class="brief-label">Taxa Plataforma (%)</div><input id="rc-taxa" class="brief-input" type="number" value="10" oninput="calcROAS()"></div>
              <div class="brief-field"><div class="brief-label">Meta Lucro (%)</div><input id="rc-meta" class="brief-input" type="number" value="30" oninput="calcROAS()"></div>
            </div>
            <div id="rc-results" style="display:flex;flex-direction:column;gap:10px"><div class="brief-label">Resultados</div></div>
          </div>`;
    calcROAS(); return;
  }
  if (toolId === 'export_import') {
    titleEl.textContent = '💾 Exportar / Importar Sistema';
    body.innerHTML = `
          <div class="grid2">
            <div class="card">
              <div class="card-title">📤 Exportar Backup</div>
              <p style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.6">Gera um arquivo JSON com todos os dados (Kanban, Docs, KB, Configurações).</p>
              <button onclick="exportBackup()" class="btn btn-gold" style="width:100%">⬇️ Baixar Backup</button>
            </div>
            <div class="card">
              <div class="card-title">📥 Importar Backup</div>
              <p style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.6">Restaure dados. Irá sobrescrever dados atuais.</p>
              <input type="file" id="import-file" accept=".json" onchange="importBackup(event)" style="display:none">
              <button onclick="document.getElementById('import-file').click()" class="btn btn-outline" style="width:100%">⬆️ Carregar JSON</button>
            </div>
          </div>`;
    return;
  }
  const def = toolDefs[toolId];
  if (!def) { panel.style.display = 'none'; return; }
  titleEl.textContent = def.name;
  const currentVal = localStorage.getItem(def.lsKey) || '';
  const isConnected = !!currentVal;
  body.innerHTML = `
        <div class="grid2">
          <div>
            <div class="brief-field">
              <div class="brief-label">${def.label}</div>
              <div style="display:flex;gap:8px">
                <input id="tool-input-${toolId}" class="brief-input" type="password" value="${currentVal}" placeholder="${def.placeholder}">
                <button onclick="saveTool('${toolId}','${def.lsKey}')" class="btn btn-gold">Salvar</button>
                ${isConnected ? `<button onclick="removeTool('${toolId}','${def.lsKey}')" class="btn btn-outline" style="color:#e05c5c;border-color:#e05c5c">Remover</button>` : ''}
              </div>
              <div style="font-size:10px;color:var(--text3);margin-top:4px">${def.hint}</div>
            </div>
            <div style="margin-top:10px;padding:10px;background:${isConnected ? 'rgba(82,183,136,.08)' : 'rgba(212,168,67,.08)'};border:1px solid ${isConnected ? 'rgba(82,183,136,.2)' : 'rgba(212,168,67,.2)'};border-radius:8px;font-size:12px;color:${isConnected ? 'var(--green-bright)' : 'var(--gold)'}">
              ${isConnected ? '✅ Integração ativa' : '⚠️ Configure para ativar'}
            </div>
          </div>
          <div class="card">
            <div class="card-title">💡 Casos de Uso</div>
            ${def.useCases.map(u => `<div style="font-size:12px;color:var(--text2);padding:5px 0;border-bottom:1px solid var(--border);display:flex;gap:8px"><span style="color:var(--gold)">→</span>${u}</div>`).join('')}
          </div>
        </div>`;
}
function saveTool(toolId, lsKey) {
  const val = document.getElementById('tool-input-' + toolId).value.trim();
  if (!val) { alert('Insira o valor antes de salvar'); return; }
  localStorage.setItem(lsKey, val);
  const el = document.getElementById('tool-status-' + toolId);
  if (el) { el.textContent = '✓ Conectado'; el.style.color = 'var(--green-bright)'; }
  openTool(toolId);
}
function removeTool(toolId, lsKey) {
  if (!confirm('Remover integração?')) return;
  localStorage.removeItem(lsKey);
  const el = document.getElementById('tool-status-' + toolId);
  if (el) { el.textContent = 'Configurar'; el.style.color = 'var(--gold)'; }
  openTool(toolId);
}
function closeTool() { document.getElementById('tool-panel').style.display = 'none'; currentTool = null; }
function calcROAS() {
  const preco = parseFloat(document.getElementById('rc-preco')?.value) || 0;
  const margem = parseFloat(document.getElementById('rc-margem')?.value) || 80;
  const taxa = parseFloat(document.getElementById('rc-taxa')?.value) || 10;
  const meta = parseFloat(document.getElementById('rc-meta')?.value) || 30;
  const receitaLiq = preco * (1 - taxa / 100);
  const custoReal = preco * (1 - margem / 100);
  const contrib = receitaLiq - custoReal;
  const cacMax = contrib * (1 - meta / 100);
  const roasBE = preco / (preco - custoReal - preco * (taxa / 100));
  const roasMeta = preco / cacMax;
  const kpi = (label, value, color = 'var(--text)') => `<div class="card" style="text-align:center"><div style="font-size:22px;font-weight:700;color:${color}">${value}</div><div style="font-size:10px;color:var(--text3);margin-top:4px">${label}</div></div>`;
  document.getElementById('rc-results').innerHTML = `<div class="brief-label">Resultados</div>
        ${kpi('CAC Máx Breakeven', 'R$' + contrib.toFixed(0), 'var(--red-bright)')}
        ${kpi('CAC Máx c/ Meta', 'R$' + cacMax.toFixed(0), 'var(--gold)')}
        ${kpi('ROAS Breakeven', roasBE.toFixed(2) + 'x', 'var(--blue-bright)')}
        ${kpi('ROAS Target', roasMeta.toFixed(2) + 'x', 'var(--green-bright)')}`;
}
function exportBackup() {
  const data = { version: '5.0', exportedAt: new Date().toISOString(), kanban: JSON.parse(localStorage.getItem('imperio_kanban') || '[]'), docs: JSON.parse(localStorage.getItem('imperio_docs') || '[]'), kb: JSON.parse(localStorage.getItem('imperio_kb') || '{}') };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `imperio-hq-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
}
function importBackup(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => { try { const data = JSON.parse(e.target.result); if (data.kanban) { localStorage.setItem('imperio_kanban', JSON.stringify(data.kanban)); knCards = knLoad(); } if (data.docs) { localStorage.setItem('imperio_docs', JSON.stringify(data.docs)); DOCS = docsLoad(); } if (data.kb) { localStorage.setItem('imperio_kb', JSON.stringify(data.kb)); KB_DATA = kbLoad(); } alert('✅ Backup importado!'); } catch (err) { alert('❌ Erro: ' + err.message); } };
  reader.readAsText(file);
}

// ═══════════════════════════════════════════════════════
//  SIDEBAR COLAPSÁVEL
// ═══════════════════════════════════════════════════════
let sidebarCollapsed = JSON.parse(localStorage.getItem('imperio_sidebar_collapsed') || '{}');

// Override renderSidebar to support collapsible cats + subprojects
const _baseCatIcons = { iGaming: '🎰', Lançamentos: '🚀', Infoprodutos: '📦', Nutracêuticos: '🌿', Ecommerce: '🛒', Forex: '📈', Clínica: '🌿', Automação: '🤖' };
let sidebarParentCollapsed = JSON.parse(localStorage.getItem('imperio_sidebar_parent_collapsed') || '{}');
function toggleSidebarParent(parentId) {
  sidebarParentCollapsed[parentId] = !sidebarParentCollapsed[parentId];
  localStorage.setItem('imperio_sidebar_parent_collapsed', JSON.stringify(sidebarParentCollapsed));
  renderSidebar();
}
window.projects = PROJECTS;
const cats = {};
// Separate root projects and subprojects
const rootProjects = PROJECTS.filter(p => !p.parent_id);
const subProjectsMap = {};
PROJECTS.filter(p => p.parent_id).forEach(p => {
  if (!subProjectsMap[p.parent_id]) subProjectsMap[p.parent_id] = [];
  subProjectsMap[p.parent_id].push(p);
});
rootProjects.forEach(p => {
  if (!cats[p.categoria]) cats[p.categoria] = [];
  cats[p.categoria].push(p);
});
const container = document.getElementById('sidebar-projects');
let html = '';
Object.entries(cats).forEach(([cat, projects]) => {
  const icon = _baseCatIcons[cat] || '📁';
  const collapsed = sidebarCollapsed[cat] ? 'collapsed' : '';
  html += `<div class="cat-header" onclick="toggleSidebarCat('${cat}')" style="padding:8px 14px 4px;font-size:10px;font-weight:700;color:var(--text3);letter-spacing:1px;display:flex;align-items:center;gap:6px">
          ${icon} ${cat}
          <span class="cat-toggle ${collapsed}" style="margin-left:auto">▾</span>
        </div>
        <div class="cat-projects ${collapsed}">`;
  projects.forEach(p => {
    const badge = p.vende ? '<span class="badge sell">SELL</span>' : `<span class="badge">${p.status}</span>`;
    const children = subProjectsMap[p.id] || [];
    const hasChildren = children.length > 0;
    const parentCollapsed = sidebarParentCollapsed[p.id];
    if (hasChildren) {
      html += `<div class="nav-item nav-parent" id="nav-${p.id}">
              <span class="icon" onclick="event.stopPropagation();toggleSidebarParent('${p.id}')" style="cursor:pointer;font-size:10px;color:var(--text3);width:14px;text-align:center">${parentCollapsed ? '▸' : '▾'}</span>
              <span class="icon" onclick="openProject('${p.id}')">${p.icon}</span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer" onclick="openProject('${p.id}')">${p.nome}</span>
              <span style="font-size:9px;color:var(--text3);margin-right:4px">${children.length}</span>
              ${badge}
            </div>`;
      if (!parentCollapsed) {
        children.forEach(sp => {
          const sBadge = sp.vende ? '<span class="badge sell">SELL</span>' : `<span class="badge">${sp.status}</span>`;
          html += `<div class="nav-item nav-subproject" onclick="openProject('${sp.id}')" id="nav-${sp.id}">
                  <span style="width:14px"></span>
                  <span class="icon" style="font-size:12px">${sp.icon}</span>
                  <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">${sp.nome}</span>
                  ${sBadge}
                </div>`;
        });
      }
    } else {
      html += `<div class="nav-item" onclick="openProject('${p.id}')" id="nav-${p.id}">
              <span class="icon">${p.icon}</span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nome}</span>
              ${badge}
            </div>`;
    }
  });
  html += `</div>`;
});
container.innerHTML = html;
    }

function toggleSidebarCat(cat) {
  sidebarCollapsed[cat] = !sidebarCollapsed[cat];
  localStorage.setItem('imperio_sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  renderSidebar();
}

// ═══════════════════════════════════════════════════════
//  CONTROLE DA EMPRESA
// ═══════════════════════════════════════════════════════
let empresaEmails = JSON.parse(localStorage.getItem('empresa_emails') || '[]');
let empresaIGs = JSON.parse(localStorage.getItem('empresa_igs') || '[]');
let empresaTTs = JSON.parse(localStorage.getItem('empresa_tts') || '[]');
let empresaEditIdx = null;
let empresaEditType = null;

function showEmpresa() {
  document.querySelectorAll('#main > div.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('view-empresa').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-empresa').classList.add('active');
  showEmpresaTab('emails');
}

function showEmpresaTab(tab) {
  document.querySelectorAll('.empresa-tab').forEach(t => t.style.display = 'none');
  document.getElementById('empresa-' + tab).style.display = 'block';
  document.querySelectorAll('#view-empresa .tab').forEach(t => t.classList.remove('active'));
  document.getElementById('etab-' + tab).classList.add('active');
  if (tab === 'emails') renderEmailTable();
  if (tab === 'instagram') renderIGTable();
  if (tab === 'tiktok') renderTTTable();
}

function statusBadge(status) {
  const map = { 'Ativo': 'badge-ativo', 'Inativo': 'badge-inativo', 'Aquecendo': 'badge-aquecendo', 'Bloqueado': 'badge-bloqueado' };
  return `<span class="${map[status] || 'badge-inativo'}">${status}</span>`;
}

function renderEmailTable() {
  const tbody = document.getElementById('email-table-body');
  const empty = document.getElementById('email-empty');
  if (!empresaEmails.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = empresaEmails.map((e, i) => `<tr class="empresa-table-row">
        <td>${e.gmail}</td>
        <td><div class="pass-cell"><span id="epass-${i}">${'•'.repeat(8)}</span><button class="pass-reveal" onclick="togglePass('epass-${i}','${e.senha || ''}')">👁</button></div></td>
        <td><label class="toggle"><input type="checkbox" ${e.em_uso ? 'checked' : ''} onchange="toggleEmailUso(${i},this.checked)"><span class="toggle-slider"></span></label></td>
        <td>${e.telefone || '—'}</td>
        <td>${statusBadge(e.aquecido || 'Inativo')}</td>
        <td>${e.data_compra || '—'}</td>
        <td>${e.perfil_ig || '—'}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-sm btn-outline" onclick="editEmpresa('email',${i})">✏</button><button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteEmpresa('email',${i})">✕</button></div></td>
      </tr>`).join('');
}

function renderIGTable() {
  const tbody = document.getElementById('ig-table-body');
  const empty = document.getElementById('ig-empty');
  if (!empresaIGs.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = empresaIGs.map((a, i) => `<tr class="empresa-table-row">
        <td>@${a.usuario}</td>
        <td><div class="pass-cell"><span id="igpass-${i}">${'•'.repeat(8)}</span><button class="pass-reveal" onclick="togglePass('igpass-${i}','${a.senha || ''}')">👁</button></div></td>
        <td>${a.email_vinculado || '—'}</td>
        <td>${a.projeto || '—'}</td>
        <td>${statusBadge(a.status || 'Inativo')}</td>
        <td>${a.seguidores || '—'}</td>
        <td>${a.nicho || '—'}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-sm btn-outline" onclick="editEmpresa('instagram',${i})">✏</button><button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteEmpresa('instagram',${i})">✕</button></div></td>
      </tr>`).join('');
}

function renderTTTable() {
  const tbody = document.getElementById('tt-table-body');
  const empty = document.getElementById('tt-empty');
  if (!empresaTTs.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = empresaTTs.map((a, i) => `<tr class="empresa-table-row">
        <td>@${a.usuario}</td>
        <td><div class="pass-cell"><span id="ttpass-${i}">${'•'.repeat(8)}</span><button class="pass-reveal" onclick="togglePass('ttpass-${i}','${a.senha || ''}')">👁</button></div></td>
        <td>${a.email_vinculado || '—'}</td>
        <td>${a.projeto || '—'}</td>
        <td>${statusBadge(a.status || 'Inativo')}</td>
        <td>${a.seguidores || '—'}</td>
        <td>${a.nicho || '—'}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-sm btn-outline" onclick="editEmpresa('tiktok',${i})">✏</button><button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteEmpresa('tiktok',${i})">✕</button></div></td>
      </tr>`).join('');
}

function togglePass(spanId, realPass) {
  const el = document.getElementById(spanId);
  if (!el) return;
  el.textContent = el.textContent.includes('•') ? realPass : '•'.repeat(8);
}

function toggleEmailUso(idx, val) {
  empresaEmails[idx].em_uso = val;
  localStorage.setItem('empresa_emails', JSON.stringify(empresaEmails));
}

function openEmpresaModal(type) {
  empresaEditType = type; empresaEditIdx = null;
  buildEmpresaModal(type, null);
  openModal_emp();
}

function editEmpresa(type, idx) {
  empresaEditType = type; empresaEditIdx = idx;
  const data = type === 'email' ? empresaEmails[idx] : type === 'instagram' ? empresaIGs[idx] : empresaTTs[idx];
  buildEmpresaModal(type, data);
  openModal_emp();
}

function deleteEmpresa(type, idx) {
  if (!confirm('Excluir esta conta?')) return;
  if (type === 'email') { empresaEmails.splice(idx, 1); localStorage.setItem('empresa_emails', JSON.stringify(empresaEmails)); renderEmailTable(); }
  if (type === 'instagram') { empresaIGs.splice(idx, 1); localStorage.setItem('empresa_igs', JSON.stringify(empresaIGs)); renderIGTable(); }
  if (type === 'tiktok') { empresaTTs.splice(idx, 1); localStorage.setItem('empresa_tts', JSON.stringify(empresaTTs)); renderTTTable(); }
}

function buildEmpresaModal(type, data) {
  const isEdit = !!data;
  const m = document.getElementById('empresa-modal');
  const title = type === 'email' ? '📧 Email' : type === 'instagram' ? '📸 Instagram' : '🎵 TikTok';
  const projOpts = PROJECTS.map(p => `<option value="${p.nome}" ${data?.projeto === p.nome ? 'selected' : ''}>${p.nome}</option>`).join('');
  let fields = '';
  if (type === 'email') {
    fields = `
          <div class="brief-field"><div class="brief-label">Gmail *</div><input id="emp-gmail" class="brief-input" value="${data?.gmail || ''}" placeholder="nome@gmail.com"></div>
          <div class="brief-field"><div class="brief-label">Senha</div><input id="emp-senha" class="brief-input" type="password" value="${data?.senha || ''}" placeholder="Senha da conta"></div>
          <div class="brief-field"><div class="brief-label">Telefone</div><input id="emp-tel" class="brief-input" value="${data?.telefone || ''}" placeholder="+55 11 9xxxx-xxxx"></div>
          <div class="brief-field"><div class="brief-label">Status de Aquecimento</div><select id="emp-aquecido" class="brief-input"><option ${data?.aquecido === 'Inativo' || !data?.aquecido ? 'selected' : ''}>Inativo</option><option ${data?.aquecido === 'Aquecendo' ? 'selected' : ''}>Aquecendo</option><option ${data?.aquecido === 'Ativo' ? 'selected' : ''}>Ativo</option></select></div>
          <div class="brief-field"><div class="brief-label">Data de Compra</div><input id="emp-data" class="brief-input" type="date" value="${data?.data_compra || ''}"></div>
          <div class="brief-field"><div class="brief-label">Perfil Instagram Vinculado</div><input id="emp-perfil-ig" class="brief-input" value="${data?.perfil_ig || ''}" placeholder="@nomedo perfil"></div>`;
  } else {
    fields = `
          <div class="brief-field"><div class="brief-label">Usuário @ *</div><input id="emp-usuario" class="brief-input" value="${data?.usuario || ''}" placeholder="nomeusuario (sem @)"></div>
          <div class="brief-field"><div class="brief-label">Senha</div><input id="emp-senha" class="brief-input" type="password" value="${data?.senha || ''}" placeholder="Senha da conta"></div>
          <div class="brief-field"><div class="brief-label">Email Vinculado</div><select id="emp-email-vin" class="brief-input"><option value="">Selecionar...</option>${empresaEmails.map(e => `<option value="${e.gmail}" ${data?.email_vinculado === e.gmail ? 'selected' : ''}>${e.gmail}</option>`).join('')}</select></div>
          <div class="brief-field"><div class="brief-label">Projeto Vinculado</div><select id="emp-projeto" class="brief-input"><option value="">Nenhum</option>${projOpts}</select></div>
          <div class="brief-field"><div class="brief-label">Status</div><select id="emp-status" class="brief-input"><option ${data?.status === 'Inativo' || !data?.status ? 'selected' : ''}>Inativo</option><option ${data?.status === 'Aquecendo' ? 'selected' : ''}>Aquecendo</option><option ${data?.status === 'Ativo' ? 'selected' : ''}>Ativo</option><option ${data?.status === 'Bloqueado' ? 'selected' : ''}>Bloqueado</option></select></div>
          <div class="brief-field"><div class="brief-label">Seguidores</div><input id="emp-seguidores" class="brief-input" type="number" value="${data?.seguidores || ''}" placeholder="0"></div>
          <div class="brief-field"><div class="brief-label">Nicho</div><input id="emp-nicho" class="brief-input" value="${data?.nicho || ''}" placeholder="Ex: Imobiliário, Saúde..."></div>`;
  }
  m.querySelector('#empresa-modal-title').textContent = (isEdit ? 'Editar ' : 'Adicionar ') + title;
  m.querySelector('#empresa-modal-fields').innerHTML = fields;
}

function openModal_emp() {
  const m = document.getElementById('empresa-modal');
  m.style.opacity = '1'; m.style.pointerEvents = 'all';
}
function closeEmpresaModal() {
  const m = document.getElementById('empresa-modal');
  m.style.opacity = '0'; m.style.pointerEvents = 'none';
}

function saveEmpresaModal() {
  const type = empresaEditType;
  let obj = {};
  if (type === 'email') {
    obj = { gmail: document.getElementById('emp-gmail').value.trim(), senha: document.getElementById('emp-senha').value, telefone: document.getElementById('emp-tel').value.trim(), aquecido: document.getElementById('emp-aquecido').value, data_compra: document.getElementById('emp-data').value, perfil_ig: document.getElementById('emp-perfil-ig').value.trim(), em_uso: empresaEditIdx !== null ? empresaEmails[empresaEditIdx].em_uso : false };
    if (!obj.gmail) { alert('Gmail é obrigatório'); return; }
    if (empresaEditIdx !== null) empresaEmails[empresaEditIdx] = obj; else empresaEmails.push(obj);
    localStorage.setItem('empresa_emails', JSON.stringify(empresaEmails));
    closeEmpresaModal(); renderEmailTable();
  } else {
    obj = { usuario: document.getElementById('emp-usuario').value.trim().replace('@', ''), senha: document.getElementById('emp-senha').value, email_vinculado: document.getElementById('emp-email-vin').value, projeto: document.getElementById('emp-projeto').value, status: document.getElementById('emp-status').value, seguidores: document.getElementById('emp-seguidores').value, nicho: document.getElementById('emp-nicho').value.trim() };
    if (!obj.usuario) { alert('Usuário é obrigatório'); return; }
    if (type === 'instagram') { if (empresaEditIdx !== null) empresaIGs[empresaEditIdx] = obj; else empresaIGs.push(obj); localStorage.setItem('empresa_igs', JSON.stringify(empresaIGs)); closeEmpresaModal(); renderIGTable(); }
    else { if (empresaEditIdx !== null) empresaTTs[empresaEditIdx] = obj; else empresaTTs.push(obj); localStorage.setItem('empresa_tts', JSON.stringify(empresaTTs)); closeEmpresaModal(); renderTTTable(); }
  }
}

// ═══════════════════════════════════════════════════════
//  BIBLIOTECA DE REFERÊNCIAS
// ═══════════════════════════════════════════════════════
let referencias = JSON.parse(localStorage.getItem('imperio_referencias') || '[]');
let refEditIdx = null;
const tipoEmojis = { 'Criativo': '🎬', 'Página de Captura': '📋', 'VSL': '🎥', 'Funil': '🔻', 'Copy': '✍️', 'Landing Page': '🌐', 'Email': '📧' };

function showReferencias() {
  hideAllPanels();
  document.getElementById('view-referencias').classList.add('active');
  document.getElementById('nav-referencias').classList.add('active');
  renderReferencias();
}

function renderReferencias() {
  const search = (document.getElementById('ref-search')?.value || '').toLowerCase();
  const tipo = document.getElementById('ref-filter-tipo')?.value || '';
  let items = referencias.filter(r => {
    const matchSearch = !search || r.url?.toLowerCase().includes(search) || r.notas?.toLowerCase().includes(search) || r.nicho?.toLowerCase().includes(search) || r.tags?.toLowerCase().includes(search);
    const matchTipo = !tipo || r.tipo === tipo;
    return matchSearch && matchTipo;
  });
  const grid = document.getElementById('ref-grid');
  const empty = document.getElementById('ref-empty');
  if (!items.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  const realIdx = (item) => referencias.indexOf(item);
  grid.innerHTML = items.map(r => {
    const idx = realIdx(r);
    const tags = (r.tags || '').split(',').filter(t => t.trim()).map(t => `<span class="tool-tag">${t.trim()}</span>`).join('');
    const thumbUrl = r.url ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(r.url)}&sz=64` : '';
    const emoji = tipoEmojis[r.tipo] || '🔗';
    return `<div class="ref-card">
          <div class="ref-card-thumb">
            ${thumbUrl ? `<img src="${thumbUrl}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" style="width:48px;height:48px;border-radius:8px;object-fit:contain">` : ''}
            <div class="ref-card-thumb-placeholder" ${thumbUrl ? 'style="display:none"' : ''}>${emoji}</div>
            <div class="ref-card-type">${r.tipo || 'Link'}</div>
          </div>
          <div class="ref-card-body">
            <div class="ref-card-url" title="${r.url || ''}">${r.url || 'Sem URL'}</div>
            ${r.nicho ? `<div style="font-size:10px;color:var(--gold);margin-bottom:6px">📍 ${r.nicho}</div>` : ''}
            <div class="ref-card-tags">${tags}</div>
            ${r.notas ? `<div class="ref-card-notes">${r.notas}</div>` : ''}
            <div class="ref-card-actions">
              ${r.url ? `<a href="${r.url}" target="_blank" class="btn btn-sm btn-outline" style="text-decoration:none">🔗 Abrir</a>` : ''}
              <button class="btn btn-sm btn-outline" onclick="editRef(${idx})">✏ Editar</button>
              <button class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c" onclick="deleteRef(${idx})">✕</button>
            </div>
          </div>
        </div>`;
  }).join('');
}

function openRefModal(idx = null) {
  refEditIdx = idx;
  const r = idx !== null ? referencias[idx] : {};
  const isEdit = idx !== null;
  const projOpts = PROJECTS.map(p => `<option value="${p.nome}" ${r.projeto === p.nome ? 'selected' : ''}>${p.nome}</option>`).join('');
  const m = document.getElementById('ref-modal');
  m.querySelector('#ref-modal-title').textContent = isEdit ? '✏ Editar Referência' : '➕ Adicionar Referência';
  m.querySelector('#ref-modal-fields').innerHTML = `
        <div class="brief-field"><div class="brief-label">URL *</div><input id="rf-url" class="brief-input" value="${r.url || ''}" placeholder="https://..."></div>
        <div class="brief-field"><div class="brief-label">Tipo</div><select id="rf-tipo" class="brief-input"><option value="">Selecionar...</option>${Object.keys(tipoEmojis).map(t => `<option value="${t}" ${r.tipo === t ? 'selected' : ''}>${tipoEmojis[t]} ${t}</option>`).join('')}</select></div>
        <div class="brief-field"><div class="brief-label">Nicho</div><input id="rf-nicho" class="brief-input" value="${r.nicho || ''}" placeholder="Ex: Saúde, Imobiliário..."></div>
        <div class="brief-field"><div class="brief-label">Tags (separadas por vírgula)</div><input id="rf-tags" class="brief-input" value="${r.tags || ''}" placeholder="emagrecimento, highticket, video curto..."></div>
        <div class="brief-field"><div class="brief-label">Notas / Por que é uma boa referência?</div><textarea id="rf-notas" class="brief-input" rows="3" placeholder="O que tem de bom nessa referência...">${r.notas || ''}</textarea></div>
        <div class="brief-field"><div class="brief-label">Projeto Vinculado</div><select id="rf-projeto" class="brief-input"><option value="">Nenhum específico (geral)</option>${projOpts}</select></div>`;
  m.style.opacity = '1'; m.style.pointerEvents = 'all';
}

function closeRefModal() {
  const m = document.getElementById('ref-modal');
  m.style.opacity = '0'; m.style.pointerEvents = 'none';
}

function saveRef() {
  const url = document.getElementById('rf-url').value.trim();
  if (!url) { alert('URL é obrigatória'); return; }
  const obj = { url, tipo: document.getElementById('rf-tipo').value, nicho: document.getElementById('rf-nicho').value.trim(), tags: document.getElementById('rf-tags').value, notas: document.getElementById('rf-notas').value.trim(), projeto: document.getElementById('rf-projeto').value, data: new Date().toLocaleDateString('pt-BR') };
  if (refEditIdx !== null) referencias[refEditIdx] = obj; else referencias.push(obj);
  localStorage.setItem('imperio_referencias', JSON.stringify(referencias));
  closeRefModal(); renderReferencias();
}

function editRef(idx) { openRefModal(idx); }
function deleteRef(idx) { if (!confirm('Excluir referência?')) return; referencias.splice(idx, 1); localStorage.setItem('imperio_referencias', JSON.stringify(referencias)); renderReferencias(); }

function exportRefContexto() {
  if (!referencias.length) { alert('Nenhuma referência cadastrada para exportar'); return; }
  let ctx = `# 🖼️ BIBLIOTECA DE REFERÊNCIAS — IMPÉRIO HQ\n\nUse estas referências como inspiração para criar conteúdos, criativos e páginas alinhados às melhores práticas do mercado.\n\n`;
  const byTipo = {};
  referencias.forEach(r => { if (!byTipo[r.tipo || 'Geral']) byTipo[r.tipo || 'Geral'] = []; byTipo[r.tipo || 'Geral'].push(r); });
  Object.entries(byTipo).forEach(([tipo, items]) => {
    ctx += `## ${tipoEmojis[tipo] || '🔗'} ${tipo}\n`;
    items.forEach(r => {
      ctx += `- **URL:** ${r.url}\n`;
      if (r.nicho) ctx += `  **Nicho:** ${r.nicho}\n`;
      if (r.tags) ctx += `  **Tags:** ${r.tags}\n`;
      if (r.notas) ctx += `  **Notas:** ${r.notas}\n`;
      ctx += '\n';
    });
  });
  ctx += `\nTotal de referências: ${referencias.length}`;
  const out = document.createElement('textarea');
  out.value = ctx; document.body.appendChild(out); out.select(); document.execCommand('copy'); document.body.removeChild(out);
  alert(`✅ Contexto copiado! ${referencias.length} referências exportadas. Cole no agente de IA.`);
}

// ═══════════════════════════════════════════════════════
//  EXPERT TAB
// ═══════════════════════════════════════════════════════
function renderExpert() {
  const p = currentProject;
  if (!p.expert) p.expert = { nome: '', foto: '', bio: '', area: '', anos_exp: '', alunos: '', certificacoes: '', tom_voz: '', palavras_usa: '', palavras_evita: '', metodo: '', pilares: '', transformacao: '', conteudos: '' };
  const ex = p.expert;
  const el = document.getElementById('tab-expert');

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">🎤 Expert / Especialista: ${p.nome}</div>
      <button onclick="exportExpertContexto()" style="background:rgba(91,141,238,.12);color:#5b8dee;border:1px solid rgba(91,141,238,.3);padding:7px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📋 Exportar para IA</button>
    </div>

    <div class="grid2" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">👤 Dados Pessoais</div>
        <div style="display:flex;gap:12px;margin-bottom:12px">
          <div style="flex-shrink:0">
            ${ex.foto ? `<img src="${ex.foto}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid var(--gold)">` : `<div style="width:72px;height:72px;border-radius:50%;background:var(--surface2);border:3px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:28px">👤</div>`}
          </div>
          <div style="flex:1">
            <div class="brief-field"><div class="brief-label">Nome Completo</div><input class="brief-input" value="${ex.nome || ''}" placeholder="Nome do Expert" onblur="saveExpert('nome',this.value)"></div>
            <div class="brief-field"><div class="brief-label">Foto do Expert</div><div style="display:flex;gap:8px;align-items:center"><input class="brief-input" value="${ex.foto && !ex.foto.startsWith('data:') ? ex.foto : ''}" placeholder="https://..." onblur="saveExpert('foto',this.value);renderExpert()" style="flex:1"><label style="cursor:pointer;background:var(--surface2);border:1px solid var(--border2);border-radius:6px;padding:5px 10px;font-size:11px;color:var(--text2);white-space:nowrap;flex-shrink:0">📂 Upload<input type="file" accept="image/*" style="display:none" onchange="uploadFotoExpert(this)"></label></div></div>
          </div>
        </div>
        <div class="brief-field"><div class="brief-label">Área de Atuação</div><input class="brief-input" value="${ex.area || ''}" placeholder="Ex: Saúde Integrativa, Imobiliário..." onblur="saveExpert('area',this.value)"></div>
        <div class="brief-field"><div class="brief-label">Bio Curta (para copy)</div><textarea class="brief-input" rows="3" placeholder="Quem ele é e por que é autoridade neste assunto..." onblur="saveExpert('bio',this.value)">${ex.bio || ''}</textarea></div>
        <div class="grid2">
          <div class="brief-field"><div class="brief-label">Anos de Experiência</div><input class="brief-input" value="${ex.anos_exp || ''}" placeholder="Ex: 12 anos" onblur="saveExpert('anos_exp',this.value)"></div>
          <div class="brief-field"><div class="brief-label">Alunos / Clientes</div><input class="brief-input" value="${ex.alunos || ''}" placeholder="Ex: +3.000 alunos" onblur="saveExpert('alunos',this.value)"></div>
        </div>
        <div class="brief-field"><div class="brief-label">Certificações / Formações</div><textarea class="brief-input" rows="2" placeholder="Formações, certificações, prova social acadêmica..." onblur="saveExpert('certificacoes',this.value)">${ex.certificacoes || ''}</textarea></div>
      </div>

      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-title">🗣️ Como Ele Fala</div>
          <div class="brief-field"><div class="brief-label">Tom de Voz</div><input class="brief-input" value="${ex.tom_voz || ''}" placeholder="Ex: Autoritário mas acessível, direto, empático..." onblur="saveExpert('tom_voz',this.value)"></div>
          <div class="brief-field"><div class="brief-label">Palavras / Expressões que Usa Muito</div><textarea class="brief-input" rows="3" placeholder="Expressões características, gírias, jargões..." onblur="saveExpert('palavras_usa',this.value)">${ex.palavras_usa || ''}</textarea></div>
          <div class="brief-field"><div class="brief-label">Palavras / Expressões que Evita</div><textarea class="brief-input" rows="2" placeholder="O que ele nunca diria, termos que rejeita..." onblur="saveExpert('palavras_evita',this.value)">${ex.palavras_evita || ''}</textarea></div>
        </div>
        <div class="card">
          <div class="card-title">🧠 O que Ele Ensina</div>
          <div class="brief-field"><div class="brief-label">Método / Framework Principal</div><input class="brief-input" value="${ex.metodo || ''}" placeholder="Ex: Método XYZ, Framework dos 3 Pilares..." onblur="saveExpert('metodo',this.value)"></div>
          <div class="brief-field"><div class="brief-label">Pilares do Ensino</div><textarea class="brief-input" rows="3" placeholder="Os 3-5 pilares centrais do que ele ensina..." onblur="saveExpert('pilares',this.value)">${ex.pilares || ''}</textarea></div>
          <div class="brief-field"><div class="brief-label">Transformação Prometida</div><textarea class="brief-input" rows="2" placeholder="O resultado concreto que o aluno alcança..." onblur="saveExpert('transformacao',this.value)">${ex.transformacao || ''}</textarea></div>
          <div class="brief-field"><div class="brief-label">Temas / Conteúdos Principais</div><textarea class="brief-input" rows="2" placeholder="Assuntos sobre os quais ele cria conteúdo..." onblur="saveExpert('conteudos',this.value)">${ex.conteudos || ''}</textarea></div>
        </div>
      </div>
    </div>`;
}

function saveExpert(key, val) {
  if (!currentProject.expert) currentProject.expert = {};
  currentProject.expert[key] = val;
  saveProject();
}

function uploadFotoExpert(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    saveExpert('foto', e.target.result);
    renderExpert();
  };
  reader.readAsDataURL(file);
}

function exportExpertContexto() {
  const ex = currentProject.expert || {};
  const p = currentProject;
  let ctx = `# 🎤 EXPERT PROFILE — ${p.nome}\n\n`;
  ctx += `## Dados Pessoais\n- **Nome:** ${ex.nome || '—'}\n- **Área:** ${ex.area || '—'}\n- **Experiência:** ${ex.anos_exp || '—'}\n- **Alunos:** ${ex.alunos || '—'}\n- **Certificações:** ${ex.certificacoes || '—'}\n\n`;
  ctx += `## Bio\n${ex.bio || '—'}\n\n`;
  ctx += `## Como Fala\n- **Tom:** ${ex.tom_voz || '—'}\n- **Usa muito:** ${ex.palavras_usa || '—'}\n- **Evita:** ${ex.palavras_evita || '—'}\n\n`;
  ctx += `## O que Ensina\n- **Método:** ${ex.metodo || '—'}\n- **Pilares:** ${ex.pilares || '—'}\n- **Transformação:** ${ex.transformacao || '—'}\n- **Conteúdos:** ${ex.conteudos || '—'}\n`;
  const out = document.createElement('textarea');
  out.value = ctx; document.body.appendChild(out); out.select(); document.execCommand('copy'); document.body.removeChild(out);
  alert('✅ Perfil do Expert copiado para o clipboard! Cole no agente de IA.');
}

// ═══════════════════════════════════════════════════════
//  MÍDIA TAB
// ═══════════════════════════════════════════════════════
function renderMidia() {
  const p = currentProject;
  if (!p.midia) p.midia = { expert: [], produtos: [], complementar: [] };
  const m = p.midia;
  const el = document.getElementById('tab-midia');

  function midiaSection(title, icon, key, addLabel) {
    const items = m[key] || [];
    const cardsHtml = items.map((item, i) => `
          <div style="position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:var(--surface2)">
            <img src="${item.url}" alt="${item.legenda || ''}" style="width:100%;height:120px;object-fit:cover" onerror="this.style.display='none'">
            ${!item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) ? `<div style="height:80px;display:flex;align-items:center;justify-content:center;font-size:28px">${icon}</div>` : ''}
            <div style="padding:8px">
              <div style="font-size:11px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.legenda || item.url}</div>
              <div style="display:flex;gap:6px;margin-top:6px">
                <a href="${item.url}" target="_blank" class="btn btn-sm btn-outline" style="font-size:10px;text-decoration:none">Abrir</a>
              </div>
            </div>
            <button onclick="removeMidia('${key}',${i})" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.7);border:none;color:#e05c5c;border-radius:4px;cursor:pointer;font-size:11px;padding:2px 7px">✕</button>
          </div>`).join('');

    return `<div class="card" style="margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div class="card-title" style="margin-bottom:0">${icon} ${title}</div>
            <button onclick="openMidiaModal('${key}','${addLabel}')" class="btn btn-sm btn-outline">+ ${addLabel}</button>
          </div>
          ${items.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px">${cardsHtml}</div>` : `<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">Nenhuma imagem adicionada<br><span style="font-size:11px;opacity:.6">Clique em + ${addLabel} para adicionar</span></div>`}
        </div>`;
  }

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">🖼️ Galeria de Mídia: ${p.nome}</div>
      <div style="font-size:11px;color:var(--text3)">${(m.expert.length + m.produtos.length + m.complementar.length)} arquivo(s)</div>
    </div>
    ${midiaSection('Fotos do Expert', '👤', 'expert', 'Foto Expert')}
    ${midiaSection('Fotos dos Produtos', '📦', 'produtos', 'Foto Produto')}
    ${midiaSection('Imagens Complementares', '🌟', 'complementar', 'Imagem')}`;
}

function openMidiaModal(key, label) {
  const m = document.getElementById('midia-modal');
  m.querySelector('#midia-modal-title').textContent = '+ ' + label;
  m.dataset.key = key;
  m.style.opacity = '1'; m.style.pointerEvents = 'all';
  document.getElementById('midia-url').value = '';
  document.getElementById('midia-legenda').value = '';
}
function closeMidiaModal() {
  const m = document.getElementById('midia-modal');
  m.style.opacity = '0'; m.style.pointerEvents = 'none';
}
function saveMidia() {
  const url = document.getElementById('midia-url').value.trim();
  if (!url) { alert('URL obrigatória'); return; }
  const key = document.getElementById('midia-modal').dataset.key;
  const legenda = document.getElementById('midia-legenda').value.trim();
  if (!currentProject.midia) currentProject.midia = { expert: [], produtos: [], complementar: [] };
  if (!currentProject.midia[key]) currentProject.midia[key] = [];
  currentProject.midia[key].push({ url, legenda });
  closeMidiaModal();
  renderMidia();
}
function removeMidia(key, i) {
  currentProject.midia[key].splice(i, 1);
  renderMidia();
}

// ═══════════════════════════════════════════════════════
//  EQUIPE
// ═══════════════════════════════════════════════════════

function mergeEquipeSeed(existing) {
  const out = Array.isArray(existing) ? [...existing] : [];
  const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const byName = new Set(out.map(m => norm(m.nome)));
  EQUIPE_SEED.forEach(seed => {
    if (!byName.has(norm(seed.nome))) out.push(seed);
  });
  return out;
}

let EQUIPE = mergeEquipeSeed(JSON.parse(localStorage.getItem('imperio_equipe') || '[]'));
let editingMembroIdx = -1;

function saveEquipe() { localStorage.setItem('imperio_equipe', JSON.stringify(EQUIPE)); }
saveEquipe();

function showEquipe() {
  showSection('equipe');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-equipe');
  if (nav) nav.classList.add('active');
  renderEquipe();
}

function renderEquipe() {
  const search = (document.getElementById('equipe-search')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('equipe-filter-status')?.value || '';
  let members = EQUIPE.filter(m =>
    (!search || m.nome.toLowerCase().includes(search) || (m.cargo || '').toLowerCase().includes(search)) &&
    (!statusFilter || m.status === statusFilter)
  );

  const grid = document.getElementById('equipe-grid');
  const empty = document.getElementById('equipe-empty');
  if (!members.length) {
    grid.style.display = 'none'; empty.style.display = 'block'; return;
  }
  grid.style.display = 'grid'; empty.style.display = 'none';

  const statusColors = { Ativo: '#52b788', 'Férias': 'var(--gold)', Off: '#e05c5c' };

  grid.innerHTML = members.map((m, i) => {
    const realIdx = EQUIPE.indexOf(m);
    // Count kanban tasks assigned to this member
    const kanbanData = JSON.parse(localStorage.getItem('imperio_kanban') || '[]');
    const taskCount = kanbanData.filter(c => c.assignee === (m.id || m.nome)).length;
    const color = statusColors[m.status] || 'var(--text3)';
    const avatarHtml = m.foto
      ? `<img src="${m.foto}" alt="${m.nome}">`
      : m.emoji || '👤';
    return `
        <div class="membro-card">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
            <div class="membro-avatar">${typeof avatarHtml === 'string' && avatarHtml.startsWith('<img') ? avatarHtml : `<span>${avatarHtml}</span>`}</div>
            <div style="flex:1;min-width:0">
              <div class="membro-name">${m.nome}</div>
              <div class="membro-role">${m.cargo || '—'}</div>
              <div style="margin-top:4px;font-size:10px">
                <span class="membro-status-dot" style="background:${color}"></span>
                <span style="color:${color}">${m.status}</span>
              </div>
            </div>
          </div>
          ${m.especialidade ? `<div style="font-size:10px;color:var(--text3);margin-bottom:10px;line-height:1.4">🎯 ${m.especialidade}</div>` : ''}
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            ${m.email ? `<a href="mailto:${m.email}" style="font-size:10px;color:var(--text3);text-decoration:none;border:1px solid var(--border);border-radius:4px;padding:2px 7px" title="${m.email}">✉️ Email</a>` : ''}
            ${m.whatsapp ? `<a href="https://wa.me/${m.whatsapp.replace(/\D/g, '')}" target="_blank" style="font-size:10px;color:var(--text3);text-decoration:none;border:1px solid var(--border);border-radius:4px;padding:2px 7px">💬 WhatsApp</a>` : ''}
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="viewMemberBacklog('${m.id || m.nome}', '${m.nome}')" class="btn btn-sm btn-outline" style="flex:1;font-size:10px">
              📋 Backlog ${taskCount ? `<span style="background:var(--gold);color:#000;border-radius:8px;padding:0 5px;font-size:9px;margin-left:3px">${taskCount}</span>` : ''}
            </button>
            <button onclick="openMembroModal(${realIdx})" class="btn btn-sm btn-outline" style="font-size:10px">✏️</button>
            <button onclick="removeMembro(${realIdx})" class="btn btn-sm btn-outline" style="color:#e05c5c;border-color:#e05c5c;font-size:10px">✕</button>
          </div>
        </div>`;
  }).join('');
}

function openMembroModal(idx = -1) {
  editingMembroIdx = idx;
  const m = idx >= 0 ? EQUIPE[idx] : null;
  document.getElementById('membro-modal-title').textContent = m ? '✏️ Editar Membro' : '👥 Novo Membro';
  document.getElementById('mb-emoji').value = m?.emoji || '👤';
  document.getElementById('mb-nome').value = m?.nome || '';
  document.getElementById('mb-cargo').value = m?.cargo || '';
  document.getElementById('mb-foto').value = m?.foto || '';
  document.getElementById('mb-email').value = m?.email || '';
  document.getElementById('mb-whats').value = m?.whatsapp || '';
  document.getElementById('mb-especialidade').value = m?.especialidade || '';
  document.getElementById('mb-status').value = m?.status || 'Ativo';
  const ml = document.getElementById('membro-modal');
  ml.style.opacity = '1'; ml.style.pointerEvents = 'all';
}
function closeMembroModal() {
  const ml = document.getElementById('membro-modal');
  ml.style.opacity = '0'; ml.style.pointerEvents = 'none';
}
function saveMembroModal() {
  const nome = document.getElementById('mb-nome').value.trim();
  if (!nome) { alert('Nome obrigatório'); return; }
  const data = {
    id: editingMembroIdx >= 0 ? EQUIPE[editingMembroIdx].id : 'mb_' + Date.now(),
    emoji: document.getElementById('mb-emoji').value.trim() || '👤',
    nome, cargo: document.getElementById('mb-cargo').value.trim(),
    foto: document.getElementById('mb-foto').value.trim(),
    email: document.getElementById('mb-email').value.trim(),
    whatsapp: document.getElementById('mb-whats').value.trim(),
    especialidade: document.getElementById('mb-especialidade').value.trim(),
    status: document.getElementById('mb-status').value
  };
  if (editingMembroIdx >= 0) EQUIPE[editingMembroIdx] = data;
  else EQUIPE.push(data);
  saveEquipe();
  closeMembroModal();
  renderEquipe();
}
function removeMembro(idx) {
  if (!confirm(`Remover ${EQUIPE[idx].nome}?`)) return;
  EQUIPE.splice(idx, 1);
  saveEquipe();
  renderEquipe();
}

function viewMemberBacklog(memberId, nome) {
  const kanbanData = JSON.parse(localStorage.getItem('imperio_kanban') || '[]');
  const tasks = kanbanData.filter(c => c.assignee === memberId);
  const panel = document.getElementById('equipe-backlog-panel');
  document.getElementById('backlog-panel-title').textContent = `📋 Backlog de ${nome}`;
  const container = document.getElementById('backlog-cards');

  if (!tasks.length) {
    container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text3);font-size:12px">Nenhuma task atribuída a ${nome}<br>
          <button onclick="openKanbanTaskForMember('${memberId}')" class="btn btn-outline" style="margin-top:10px;font-size:11px">+ Criar Task</button></div>`;
  } else {
    const statColors = { 'A Fazer': 'var(--text3)', 'Em Andamento': 'var(--gold)', 'Revisão': '#5b8dee', 'Concluído': 'var(--green-bright)', 'Bloqueado': '#e05c5c' };
    container.innerHTML = tasks.map(t => `
          <div class="backlog-task-card">
            <span style="font-size:16px">${t.icon || '📌'}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;color:var(--text)">${t.title}</div>
              <div style="font-size:10px;color:var(--text3)">${t.projeto || 'Geral'} · ${t.dept || ''}</div>
            </div>
            <span style="font-size:10px;color:${statColors[t.status] || 'var(--text3)'};border:1px solid ${statColors[t.status] || 'var(--border)'};padding:2px 7px;border-radius:8px;white-space:nowrap">${t.status}</span>
          </div>`).join('') +
      `<button onclick="openKanbanTaskForMember('${memberId}')" class="btn btn-outline" style="width:100%;font-size:11px;margin-top:6px">+ Criar Nova Task</button>`;
  }
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function closeBacklogPanel() {
  document.getElementById('equipe-backlog-panel').style.display = 'none';
}
function openKanbanTaskForMember(memberId) {
  // Switch to Kanban and pre-fill assignee
  showKanban();
  // store for kanban modal to read
  window._prefilledAssignee = memberId;
}

// ═══════════════════════════════════════════════════════
//  OPENCLAW FLOW
// ═══════════════════════════════════════════════════════
let ocCurrentStep = 1;
let ocData = { projectId: null, selectedRefs: [], outputTipo: 'Ad Estático', outputQtd: 3, outputFormato: '1080x1080', outputPlataforma: 'Meta Ads', instrucoes: '' };

function showOpenClaw() {
  showSection('openclaw');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-openclaw');
  if (nav) nav.classList.add('active');
  ocCurrentStep = 1;
  ocData = { projectId: null, selectedRefs: [], outputTipo: 'Ad Estático', outputQtd: 3, outputFormato: '1080x1080', outputPlataforma: 'Meta Ads', instrucoes: '' };
  renderOCStep();
}

// ═══════════════════════════════════════════════════════
//  CRON JOBS
// ═══════════════════════════════════════════════════════
const CRON_JOBS = [
  { id: 'igaming_schedule', name: 'iGaming — Agendamento D+1', schedule: '07:05 BRT diário', scripts: ['scripts/schedule-next-day.js teo', 'schedule-next-day.js jonathan', 'schedule-next-day.js laise', 'schedule-next-day.js pedro'], desc: '24 posts/dia para 4 perfis iGaming', project: 'laise', icon: '🎰' },
  { id: 'petselect_schedule', name: 'PetSelectUK — Agendamento D+1', schedule: '07:15 BRT diário', scripts: ['scripts/petselect-schedule-next-day.js'], desc: '3 posts/dia — carousel, image, reels (London)', project: 'petselect', icon: '🛍️' },
  { id: 'jp_schedule', name: 'JP Vídeo — Agendamento', schedule: '07:20 BRT diário', scripts: ['scripts/jp-schedule-next-day.js'], desc: '1 vídeo/dia JP Freitas', project: 'jp_freitas', icon: '🚀' },
  { id: 'backup_drive', name: 'Backup → Drive', schedule: '07:30 BRT diário', scripts: ['scripts/backup-ops-to-drive.js'], desc: 'Backup IGAMING_OPS para Google Drive', project: 'automacao_black', icon: '☁️' },
  { id: 'poll_upload', name: 'Poll Upload-Post + Supabase', schedule: '09:00 e 21:00 BRT', scripts: ['scripts/poll-upload-status.js 50', 'scripts/import-posting-log-to-supabase.js --limit 5000'], desc: 'Checa status de posts e sincroniza CSV → Supabase', project: 'automacao_black', icon: '📊' },
  { id: 'autopilot', name: 'Ops Autopilot', schedule: 'A cada 6h', scripts: ['ops-dashboard/scripts/autopilot.ps1'], desc: 'Avalia doing/blocked, puxa backlog, atualiza Kanban', project: 'automacao_black', icon: '🤖' },
  { id: 'heartbeat', name: 'Heartbeat (OpenClaw)', schedule: 'A cada 1h', scripts: ['heartbeat interno'], desc: 'Check de agenda, email, alertas e memória', project: 'automacao_black', icon: '💓' },
];

function showCron() {
  showSection('cron');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-cron');
  if (nav) nav.classList.add('active');
  renderCron();
}

function renderCron() {
  const el = document.getElementById('cron-body');
  if (!el) return;
  const now = new Date();
  const statusColor = { ok: '#52b788', warn: 'var(--gold)', fail: '#e05c5c', unknown: 'var(--text3)' };

  let html = `<div style="display:flex;flex-direction:column;gap:10px">`;
  CRON_JOBS.forEach(job => {
    const st = 'ok';
    const col = statusColor[st];
    html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;gap:14px;align-items:flex-start">
          <div style="font-size:24px;flex-shrink:0">${job.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div style="font-size:13px;font-weight:700;color:var(--text)">${job.name}</div>
              <span style="font-size:10px;padding:2px 8px;border-radius:8px;color:${col};border:1px solid ${col}">● ${st.toUpperCase()}</span>
            </div>
            <div style="font-size:11px;color:var(--text3);margin-bottom:6px">${job.desc}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <span style="font-size:10px;color:var(--text3)">⏰ ${job.schedule}</span>
              ${job.scripts.map(s => `<span style="font-size:10px;background:var(--surface2);color:var(--text3);padding:2px 8px;border-radius:4px;font-family:monospace">${s}</span>`).join('')}
            </div>
          </div>
        </div>`;
  });
  html += `</div>`;
  el.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  SKILLS
// ═══════════════════════════════════════════════════════

function showSkills() {
  showSection('skills');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-skills');
  if (nav) nav.classList.add('active');
  renderSkills();
}

// Dados de custos mensais (localStorage)
function getCustos() {
  const s = localStorage.getItem('imperio_custos');
  return s ? JSON.parse(s) : [
    { nome: 'MiniMax', valor: 20, dolar: true },
    { nome: 'OpenAI (GPT)', valor: 20, dolar: true },
    { nome: 'Claude', valor: 20, dolar: true },
    { nome: 'Supabase', valor: 50, dolar: true },
    { nome: 'n8n', valor: 40, dolar: true }
  ];
}
function saveCustos(c) { localStorage.setItem('imperio_custos', JSON.stringify(c)); }

function getFinancasConfig() {
  const s = localStorage.getItem('imperio_financas_config');
  return s ? JSON.parse(s) : { cotacao_usd: 5.00 };
}
function saveFinancasConfig(cfg) { localStorage.setItem('imperio_financas_config', JSON.stringify(cfg)); }

// Cache for Supabase API costs
let _supabaseApiCustos = null;
let _supabaseApiCustosLoaded = false;

async function loadApiCustosFromSupabase() {
  if (_supabaseApiCustosLoaded) return _supabaseApiCustos;
  try {
    const { data, error } = await window.SB?._sb?.from('imperio_custos').select('*');
    if (error) { console.warn('[Financas] Erro Supabase:', error); return []; }
    // Transform Supabase data to frontend format
    _supabaseApiCustos = (data || []).map(r => ({
      nome: r.nome || 'API',
      valor: parseFloat(r.valor) || 0,
      moeda: r.dolar ? 'USD' : 'BRL',
      from_supabase: true,
      supabase_id: r.id
    }));
    _supabaseApiCustosLoaded = true;
    console.log('[Financas] Carregado do Supabase:', _supabaseApiCustos.length, 'itens');
    return _supabaseApiCustos;
  } catch (e) {
    console.warn('[Financas] Erro:', e.message);
    return [];
  }
}

function getApiCustos() {
  const s = localStorage.getItem('imperio_api_custos');
  const local = s ? JSON.parse(s) : [
    { nome: 'Claude API', valor: 0, moeda: 'USD' },
    { nome: 'OpenAI API', valor: 0, moeda: 'USD' },
    { nome: 'Google Gemini', valor: 0, moeda: 'USD' },
    { nome: 'Google Ads', valor: 0, moeda: 'USD', is_ads: true }
  ];
  // Merge with Supabase data (Supabase data is added dynamically)
  if (_supabaseApiCustos && _supabaseApiCustos.length > 0) {
    // Add Supabase items that don't exist locally
    _supabaseApiCustos.forEach(sc => {
      if (!local.find(l => l.nome === sc.nome)) {
        local.push(sc);
      }
    });
  }
  return local;
}

// Auto-load from Supabase on init
loadApiCustosFromSupabase();
function saveApiCustos(arr) { localStorage.setItem('imperio_api_custos', JSON.stringify(arr)); }

function showFinancas() {
  showSection('financas');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-financas');
  if (nav) nav.classList.add('active');
  window._finTab = window._finTab || 'geral';
  // Reload from Supabase each time
  _supabaseApiCustosLoaded = false;
  loadApiCustosFromSupabase().then(() => renderFinancas());
}

function refreshApiCustosFromSupabase() {
  _supabaseApiCustosLoaded = false;
  loadApiCustosFromSupabase().then(() => {
    renderFinancas();
    alert('Dados atualizados do Supabase!');
  });
}

function renderFinancas() {
  const el = document.getElementById('financas-body');
  if (!el) return;
  const tab = window._finTab || 'geral';
  const cfg = getFinancasConfig();
  const cotacao = cfg.cotacao_usd || 5.00;
  const custos = getCustos();
  const apiCustos = getApiCustos();
  const totalFerrUSD = custos.reduce((s, c) => s + (c.valor || 0), 0);
  const totalApisUSD = apiCustos.reduce((s, c) => s + (c.valor || 0), 0);
  const totalUSD = totalFerrUSD + totalApisUSD;
  const tabLabels = { geral: '📊 Visão Geral', ferramentas: '🔧 Ferramentas', apis: '⚡ APIs & Ads' };

  let html = `<div style="display:flex;gap:4px;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px">`;
  ['geral', 'ferramentas', 'apis'].forEach(t => {
    const active = tab === t;
    html += `<button onclick="window._finTab='${t}';renderFinancas()" style="padding:6px 14px;border-radius:6px;border:1px solid ${active ? 'var(--gold)' : 'var(--border)'};background:${active ? 'rgba(212,175,55,.12)' : 'transparent'};color:${active ? 'var(--gold)' : 'var(--text3)'};font-size:12px;font-weight:${active ? '700' : '400'};cursor:pointer">${tabLabels[t]}</button>`;
  });
  html += `</div>`;

  if (tab === 'geral') {
    html += `
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="font-size:12px;color:var(--text3);flex-shrink:0">💱 Cotação USD/BRL</div>
            <input id="fin-cotacao" type="number" value="${cotacao}" step="0.05" min="1" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:13px;font-weight:700;width:80px" onchange="saveFinancasConfig(Object.assign(getFinancasConfig(),{cotacao_usd:parseFloat(this.value)||5}));renderFinancas()">
            <div style="font-size:11px;color:var(--text3)">R$ por $1 USD</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:12px">
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px">
              <div style="font-size:11px;color:var(--text3);margin-bottom:4px">🔧 Ferramentas Fixas</div>
              <div style="font-size:20px;font-weight:700;color:var(--gold)">$${totalFerrUSD.toFixed(0)}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${(totalFerrUSD * cotacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</div>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px">
              <div style="font-size:11px;color:var(--text3);margin-bottom:4px">⚡ APIs & Ads</div>
              <div style="font-size:20px;font-weight:700;color:var(--accent)">$${totalApisUSD.toFixed(0)}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${(totalApisUSD * cotacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</div>
            </div>
          </div>
          <div style="background:var(--surface2);border:2px solid var(--gold);border-radius:12px;padding:16px;text-align:center;margin-bottom:16px">
            <div style="font-size:11px;color:var(--text3);margin-bottom:6px;letter-spacing:.05em">TOTAL MENSAL</div>
            <div style="font-size:32px;font-weight:700;color:var(--gold)">R$ ${(totalUSD * cotacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
            <div style="font-size:12px;color:var(--text3);margin-top:4px">$${totalUSD.toFixed(0)} USD · R$ ${(totalUSD * cotacao * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano</div>
          </div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;font-weight:600">Top gastos</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">`;
    [...custos, ...apiCustos].sort((a, b) => (b.valor || 0) - (a.valor || 0)).slice(0, 6).forEach(c => {
      html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:12px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px">${c.nome}</div>
            <div style="font-size:12px;font-weight:700;color:var(--gold);flex-shrink:0">$${c.valor || 0}</div>
          </div>`;
    });
    html += `</div>`;

  } else if (tab === 'ferramentas') {
    html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:12px;color:var(--text3)">Assinaturas e ferramentas fixas mensais</div>
          <button onclick="addCusto()" style="background:var(--gold);border:none;color:var(--bg);padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">+ Adicionar</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">`;
    if (custos.length === 0) html += `<div style="text-align:center;color:var(--text3);font-size:12px;padding:30px">Nenhuma ferramenta cadastrada</div>`;
    custos.forEach((c, idx) => {
      html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13px;color:var(--text)">${c.nome}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${((c.valor || 0) * cotacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:14px;font-weight:700;color:var(--gold)">$${c.valor}</div>
              <button onclick="editCusto(${idx})" style="background:var(--surface3);border:1px solid var(--border);color:var(--text2);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">✏️</button>
              <button onclick="deleteCusto(${idx})" style="background:transparent;border:1px solid var(--red-bright);color:var(--red-bright);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">🗑</button>
            </div>
          </div>`;
    });
    html += `</div>`;

  } else {
    const ocUrl = localStorage.getItem('openclaw_url');
    const adsEntry = apiCustos.find(c => c.is_ads) || { valor: 0 };
    const adsIdx = apiCustos.findIndex(c => c.is_ads);
    html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:12px;color:var(--text3)">Gastos variáveis com APIs e campanhas</div>
          <div style="display:flex;gap:6px">
            <button onclick="refreshApiCustosFromSupabase()" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer" title="Atualizar do Supabase">↻</button>
            <button onclick="addApiCusto()" style="background:var(--gold);border:none;color:var(--bg);padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">+ API</button>
          </div>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">📢 Google Ads</div>
              <div style="font-size:11px;color:var(--text3)">Gasto do mês atual</div>
            </div>
            <button onclick="syncGoogleAds()" ${ocUrl ? '' : 'disabled'} style="background:${ocUrl ? 'var(--accent)' : 'var(--surface3)'};border:1px solid ${ocUrl ? 'var(--accent)' : 'var(--border)'};color:${ocUrl ? '#fff' : 'var(--text3)'};padding:6px 12px;border-radius:6px;font-size:11px;cursor:${ocUrl ? 'pointer' : 'not-allowed'}">🔄 ${ocUrl ? 'Sincronizar via OpenClaw' : 'OpenClaw (em breve)'}</button>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;color:var(--text3);font-weight:700">$</span>
            <input type="number" value="${adsEntry.valor || 0}" min="0" step="10" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:6px 10px;font-size:16px;font-weight:700;width:120px" onchange="updateApiCusto(${adsIdx}, parseFloat(this.value)||0)">
            <span style="font-size:12px;color:var(--text3)">≈ R$ ${((adsEntry.valor || 0) * cotacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
          </div>
          ${!ocUrl ? `<div style="font-size:11px;color:var(--text3);margin-top:10px">⚙️ Configure a URL do OpenClaw nas Configurações para habilitar sincronização automática</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">`;
    apiCustos.forEach((c, idx) => {
      if (c.is_ads) return;
      html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13px;color:var(--text)">${c.nome}</div>
              <div style="font-size:11px;color:var(--text3)">R$ ${((c.valor || 0) * cotacao).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <input type="number" value="${c.valor || 0}" min="0" step="1" style="background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:13px;font-weight:700;width:80px" onchange="updateApiCusto(${idx}, parseFloat(this.value)||0)">
              <span style="font-size:11px;color:var(--text3)">USD</span>
              <button onclick="deleteApiCusto(${idx})" style="background:transparent;border:1px solid var(--red-bright);color:var(--red-bright);padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">🗑</button>
            </div>
          </div>`;
    });
    html += `</div>`;
  }

  el.innerHTML = html;
}

function addCusto() {
  const n = prompt('Nome da ferramenta:');
  if (!n) return;
  const v = parseFloat(prompt('Valor mensal (USD):', '0') || '0');
  if (isNaN(v)) return;
  const custos = getCustos();
  custos.push({ nome: n, valor: v, dolar: true });
  saveCustos(custos);
  renderFinancas();
}

function editCusto(idx) {
  const custos = getCustos();
  const c = custos[idx];
  const n = prompt('Nome:', c.nome);
  if (n === null) return;
  const v = parseFloat(prompt('Valor USD:', c.valor));
  if (isNaN(v)) return;
  custos[idx] = { nome: n, valor: v, dolar: true };
  saveCustos(custos);
  renderFinancas();
}

function deleteCusto(idx) {
  if (!confirm('Excluir?')) return;
  const custos = getCustos();
  custos.splice(idx, 1);
  saveCustos(custos);
  renderFinancas();
}

function addApiCusto() {
  const n = prompt('Nome da API:');
  if (!n) return;
  const v = parseFloat(prompt('Gasto estimado este mês (USD):', '0') || '0');
  const arr = getApiCustos();
  arr.push({ nome: n, valor: isNaN(v) ? 0 : v, moeda: 'USD' });
  saveApiCustos(arr);
  renderFinancas();
}

function updateApiCusto(idx, val) {
  const arr = getApiCustos();
  if (arr[idx] !== undefined) { arr[idx].valor = val; saveApiCustos(arr); }
}

function deleteApiCusto(idx) {
  const arr = getApiCustos();
  if (!arr[idx] || arr[idx].is_ads) return;
  arr.splice(idx, 1);
  saveApiCustos(arr);
  renderFinancas();
}

function syncGoogleAds() {
  const ocUrl = localStorage.getItem('openclaw_url');
  if (!ocUrl) { alert('Configure a URL do OpenClaw nas Configurações primeiro.'); return; }
  alert('Endpoint Google Ads via OpenClaw ainda não implementado.\nDigite o valor manualmente por enquanto.');
}

function renderSkills() {
  const el = document.getElementById('skills-body');
  if (!el) return;
  const tagColor = 'rgba(212,175,55,.12)';
  let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">`;
  SKILLS_LIST.forEach(skill => {
    const col = skill.status === 'ativo' ? '#52b788' : '#e05c5c';
    html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">${skill.icon}</span>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700;color:var(--text)">${skill.name}</div>
              <span style="font-size:10px;color:${col}">● ${skill.status}</span>
            </div>
          </div>
          <div style="font-size:11px;color:var(--text3);line-height:1.5">${skill.desc}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            ${skill.tags.map(t => `<span style="font-size:10px;background:${tagColor};color:var(--gold);padding:2px 7px;border-radius:8px">${t}</span>`).join('')}
          </div>
        </div>`;
  });
  html += `</div>`;
  el.innerHTML = html;
}

function showWhatsApp() {
  showSection('whatsapp');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-whatsapp');
  if (nav) nav.classList.add('active');
  // Show active badge
  const badge = document.getElementById('wa-active-badge');
  if (badge) { badge.style.display = 'inline-flex'; badge.textContent = '3'; }
}

function goOCStep(n) {
  ocCurrentStep = n;
  renderOCStep();
}

function ocNav(delta) {
  const next = ocCurrentStep + delta;
  if (next < 1 || next > 4) return;
  ocCurrentStep = next;
  renderOCStep();
}

function renderOCStep() {
  // Update step bar
  [1, 2, 3, 4].forEach(i => {
    const el = document.getElementById('ocstep-' + i);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (i === ocCurrentStep) el.classList.add('active');
    else if (i < ocCurrentStep) el.classList.add('done');
  });
  // Update badge
  const badge = document.getElementById('oc-step-badge');
  if (badge) badge.textContent = `Passo ${ocCurrentStep} de 4`;
  // Show/hide nav
  const prev = document.getElementById('oc-prev-btn');
  const next = document.getElementById('oc-next-btn');
  if (prev) prev.style.display = ocCurrentStep > 1 ? '' : 'none';
  if (next) {
    next.style.display = ocCurrentStep < 4 ? '' : 'none';
    next.textContent = ocCurrentStep === 3 ? 'Gerar Prompt →' : 'Próximo →';
  }

  const el = document.getElementById('oc-content');

  if (ocCurrentStep === 1) {
    // Step 1 — Select Project
    const projectOptions = (window.projects || PROJECTS || []).map(p => `<option value="${p.id}" ${ocData.projectId === p.id ? 'selected' : ''}>${p.icon} ${p.nome}</option>`).join('');
    el.innerHTML = `
          <div class="card" style="margin-bottom:12px">
            <div class="card-title">📁 Selecionar Projeto</div>
            <div class="brief-field"><div class="brief-label">Projeto</div>
              <select id="oc-project-sel" class="brief-input" onchange="ocSelectProject(this.value)">
                <option value="">— Selecione —</option>${projectOptions}
              </select>
            </div>
          </div>
          <div id="oc-proj-preview"></div>`;
    if (ocData.projectId) ocSelectProject(ocData.projectId, false);

  } else if (ocCurrentStep === 2) {
    // Step 2 — Select References
    const refs = JSON.parse(localStorage.getItem('imperio_referencias') || '[]');
    const refHtml = refs.length ? refs.map((r, i) => {
      const sel = ocData.selectedRefs.includes(i);
      return `<div class="oc-ref-item ${sel ? 'selected' : ''}" onclick="ocToggleRef(${i}, this)">
            <input type="checkbox" ${sel ? 'checked' : ''} style="margin-top:2px;accent-color:var(--gold)">
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:700;color:var(--text)">${r.tipo} ${r.nicho ? '· ' + r.nicho : ''}</div>
              <div style="font-size:10px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.url}</div>
              ${r.notas ? `<div style="font-size:10px;color:var(--text2);margin-top:3px">${r.notas}</div>` : ''}
            </div>
            ${r.preview_url ? `<img src="${r.preview_url}" style="width:60px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0" onerror="this.style.display='none'">` : ''}
          </div>`;
    }).join('') : `<div class="empty-state" style="padding:32px"><div class="es-icon">🖼️</div><div class="es-text">Nenhuma referência cadastrada</div><div class="es-sub">Adicione na Biblioteca de Referências primeiro</div><button class="btn btn-outline" style="margin-top:10px" onclick="showReferencias()">→ Ir para Referências</button></div>`;

    el.innerHTML = `
          <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <div class="card-title" style="margin-bottom:0">🖼️ Selecionar Referências</div>
              <span style="font-size:11px;color:var(--gold)">${ocData.selectedRefs.length} selecionada(s)</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">${refHtml}</div>
          </div>`;

  } else if (ocCurrentStep === 3) {
    // Step 3 — Output Spec
    el.innerHTML = `
          <div class="card">
            <div class="card-title">⚙️ Definir Output</div>
            <div class="grid2">
              <div class="brief-field"><div class="brief-label">Tipo de Criativo</div>
                <select id="oc-tipo" class="brief-input" onchange="ocData.outputTipo=this.value">
                  ${['Ad Estático', 'Carrossel', 'Story', 'VSL Thumb', 'Landing Page Thumb', 'Email Header', 'Capa para Ebook'].map(t => `<option ${ocData.outputTipo === t ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
              </div>
              <div class="brief-field"><div class="brief-label">Quantidade</div>
                <input id="oc-qtd" class="brief-input" type="number" min="1" max="20" value="${ocData.outputQtd}" onchange="ocData.outputQtd=+this.value">
              </div>
            </div>
            <div class="grid2">
              <div class="brief-field"><div class="brief-label">Formato (dimensões)</div>
                <select id="oc-formato" class="brief-input" onchange="ocData.outputFormato=this.value">
                  ${['1080x1080 (Feed Quadrado)', '1080x1920 (Story/Reels)', '1200x628 (Link Ad)', '1080x1350 (Retrato)', 'Custom'].map(f => `<option ${ocData.outputFormato === f ? 'selected' : ''}>${f}</option>`).join('')}
                </select>
              </div>
              <div class="brief-field"><div class="brief-label">Plataforma Destino</div>
                <select id="oc-plataforma" class="brief-input" onchange="ocData.outputPlataforma=this.value">
                  ${['Meta Ads', 'TikTok Ads', 'Google Ads', 'Instagram Orgânico', 'Email', 'WhatsApp'].map(p => `<option ${ocData.outputPlataforma === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="brief-field"><div class="brief-label">Instruções Adicionais</div>
              <textarea id="oc-instrucoes" class="brief-input" rows="4" placeholder="Ex: Foco na dor de... / Use o tom de voz do expert / Destaque o gatilho de escassez..." onblur="ocData.instrucoes=this.value">${ocData.instrucoes}</textarea>
            </div>
          </div>`;

  } else if (ocCurrentStep === 4) {
    // Step 4 — Prompt + Save
    const prompt = generateOCPrompt();
    el.innerHTML = `
          <div class="card" style="margin-bottom:12px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <div class="card-title" style="margin-bottom:0">📋 Prompt Gerado para OpenClaw</div>
              <button onclick="copyOCPrompt()" style="background:rgba(91,141,238,.12);color:#5b8dee;border:1px solid rgba(91,141,238,.3);padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📋 Copiar</button>
            </div>
            <pre id="oc-prompt-text" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;font-size:11px;line-height:1.6;white-space:pre-wrap;color:var(--text2);font-family:monospace;overflow-x:auto">${prompt}</pre>
          </div>
          <div class="card">
            <div class="card-title">💾 Salvar Resultado como Asset</div>
            <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Após gerar na OpenClaw, cole as URLs dos criativos abaixo para salvar diretamente no projeto.</div>
            <div class="brief-field"><div class="brief-label">Projeto destino</div>
              <select id="oc-save-proj" class="brief-input">
                ${(window.projects || PROJECTS || []).map(p => `<option value="${p.id}" ${ocData.projectId === p.id ? 'selected' : ''}>${p.icon} ${p.nome}</option>`).join('')}
              </select>
            </div>
            <div class="brief-field"><div class="brief-label">URLs dos Criativos (1 por linha)</div>
              <textarea id="oc-result-urls" class="brief-input" rows="4" placeholder="https://...&#10;https://..."></textarea>
            </div>
            <div class="brief-field"><div class="brief-label">Nome base dos assets</div>
              <input id="oc-asset-nome" class="brief-input" placeholder="Ex: Ad iGaming Aviator Dez24" value="${ocData.outputTipo} ${ocData.outputPlataforma}"></div>
            <div style="display:flex;justify-content:flex-end;margin-top:6px">
              <button onclick="saveOCAssets()" class="btn btn-gold">💾 Salvar Todos como Assets</button>
            </div>
          </div>`;
  }
}

function ocSelectProject(id, update = true) {
  if (update) ocData.projectId = id;
  const p = (window.projects || PROJECTS || []).find(x => x.id === id);
  const el = document.getElementById('oc-proj-preview');
  if (!el) return;
  if (!p) { el.innerHTML = ''; return; }
  const b = p.branding || {};
  const ex = p.expert || {};
  el.innerHTML = `
        <div class="card">
          <div class="card-title">📊 Contexto Carregado</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
            <div style="background:var(--surface2);border-radius:8px;padding:10px">
              <div style="font-size:10px;color:var(--text3);margin-bottom:4px">PROJETO</div>
              <div style="font-size:12px;font-weight:700">${p.icon} ${p.nome}</div>
              <div style="font-size:10px;color:var(--text3)">${p.categoria}</div>
            </div>
            <div style="background:var(--surface2);border-radius:8px;padding:10px">
              <div style="font-size:10px;color:var(--text3);margin-bottom:4px">EXPERT</div>
              <div style="font-size:12px;font-weight:700">${ex.nome || 'Não definido'}</div>
              <div style="font-size:10px;color:var(--text3)">${ex.area || ''}</div>
            </div>
            <div style="background:var(--surface2);border-radius:8px;padding:10px">
              <div style="font-size:10px;color:var(--text3);margin-bottom:6px">PALETA</div>
              <div style="display:flex;border-radius:4px;overflow:hidden;height:20px">
                ${(b.cores || []).map(c => `<div style="flex:1;background:${c.hex}" title="${c.nome}"></div>`).join('') || '<div style="flex:1;background:var(--gold)"></div>'}
              </div>
            </div>
          </div>
        </div>`;
}

function ocToggleRef(i, el) {
  const idx = ocData.selectedRefs.indexOf(i);
  if (idx >= 0) { ocData.selectedRefs.splice(idx, 1); el.classList.remove('selected'); el.querySelector('input').checked = false; }
  else { ocData.selectedRefs.push(i); el.classList.add('selected'); el.querySelector('input').checked = true; }
  document.querySelector('#oc-content .card span[style*="gold"]').textContent = ocData.selectedRefs.length + ' selecionada(s)';
}

function generateOCPrompt() {
  const p = (window.projects || PROJECTS || []).find(x => x.id === ocData.projectId);
  const refs = JSON.parse(localStorage.getItem('imperio_referencias') || '[]');
  const selectedRefs = ocData.selectedRefs.map(i => refs[i]).filter(Boolean);
  const ex = p?.expert || {};
  const b = p?.branding || {};
  const produto = (p?.produtos?.[0]?.nome || p?.produto || 'Não definido');

  let prompt = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ OPENCLAW CREATIVE BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJETO
• Nome: ${p?.nome || 'Não selecionado'}
• Nicho: ${p?.categoria || '—'}
• Produto: ${produto}
• Preço: ${p?.preco || '—'}

🎤 EXPERT
• Nome: ${ex.nome || '—'}
• Área: ${ex.area || '—'}
• Tom de Voz: ${ex.tom_voz || '—'}
• Bio: ${ex.bio || '—'}

🎨 BRANDING
