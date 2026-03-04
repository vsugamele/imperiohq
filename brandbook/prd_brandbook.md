Sim, naveguei 100% pelo site! Aqui está a PRD completa:

---

# PRD — Plataforma de Brandbook Interativo
**Product Requirements Document v1.0**

---

## 1. Visão Geral do Produto

**Nome do produto:** Brandbook Builder Platform
**Objetivo:** Criar uma plataforma web que permita empresas publicar, hospedar e navegar em brandbooks interativos de alto nível — com sistema de design vivo, identidade estratégica, componentes documentados e showcase visual — equivalente ao que foi construído no `brand.aioxsquad.ai`.

**Stack observada no site de referência:** Next.js (App Router), Framer Motion, Tailwind CSS, design tokens via CSS custom properties, fontes via CDN (TASAOrbiter, Geist, RobotoMono), hospedado com Vercel (inferido pelo `dpl=` nos chunks).

---

## 2. Arquitetura de Navegação

O produto é estruturado em 5 grandes módulos, acessados via nav global:

| Módulo | Seções | Descrição |
|---|---|---|
| **Guidelines** | 1 página | Master document — visão geral do brandbook |
| **Movimento** | 13 seções | Brandbook estratégico completo |
| **Brandbook** | Foundations, Logo, Icons, Moodboard | Design system visual |
| **Design System** | 17 sub-páginas | Componentes, padrões, efeitos, templates |
| **Showcase** | Editorial, Mockups, Apparel, Avatars, Agents, Sneakers, Calc Squad | Aplicações da marca |

---

## 3. Módulos Detalhados

### 3.1 Guidelines (Brand Overview)

Página de entrada do brandbook. Deve conter:

- Hero com logo e tagline posicionada
- Ticker strip animado com palavras-chave da marca
- Seções horizontais de preview: Typography, Color Palette, Core Identity
- Typescale interativa com alternância de pesos (Thin / Reg / Bold / Black)
- Paleta de cores com nome semântico, hex, RGB e CMYK por chip
- Label de versão e edition no topo (ex: `V2.0 // DARK COCKPIT EDITION`)

### 3.2 Movimento — Brandbook Estratégico (13 seções)

Página de scroll longo com sidebar de navegação ancorada. Seções obrigatórias:

**Fundamentos**
- **01 Manifesto** — Texto em bloco com formatação terminal/monospace, quote destacado
- **02 Propósito & Valores** — Lista de valores com nome + descrição; seção "O Inimigo" com ícone X para itens negativos
- **03 Arquétipo & Personalidade** — Breakdown percentual de arquétipos, analogia de persona, duas vozes da marca (Fundador vs Produto)

**Estratégia**
- **04 Posicionamento** — Tabela "É / Não É", hierarquia de comunicação em 3 níveis (Why / How / What)
- **05 BrandScript** — 6 frames do framework SB7 em grid
- **06 Truelines & Taglines** — Tabela com tipo de trueline e contexto de uso

**Identidade Verbal**
- **07 Naming Semântico** — Breakdown letra a letra do nome + scorecard de avaliação com notas e porcentagem geral + arquitetura de produto em tabela
- **08 Vocabulário & Tom de Voz** — Dicionário proprietário (power words vs palavras banidas), slider de 5 dimensões do tom

**Jornada & Prova**
- **09 Jornada do Herói** — 6 etapas em cards com número, nome, descrição e citação real de usuário
- **10 Depoimentos & Proof Points** — Cards com métrica principal (ex: R$500K/ano), tipo e atribuição

**Identidade Visual**
- **11 Identidade Visual** — Símbolos da marca com significado, paleta completa com tokens nomeados, tipografia aplicada

**Compromisso**
- **12 Contrato da Marca** — Promessas da marca + o que se exige do usuário, manifesto em primeira pessoa
- **13 Os Fundadores** — Cards de liderança com foto, cargo, descrição e dinâmica complementar

### 3.3 Design Foundations

4 seções em página única:

- **Typography** — 3 famílias (Display/TASAOrbiter, Sans/Geist, Mono/RobotoMono) com specimen, charset, token CSS e uso recomendado; type scale de 7 tamanhos (Display → Micro) com rem values
- **Color System** — Core palette com tokens `--bb-*`, neutral scale, accent colors, contrast pairs demonstrados visualmente
- **Spacing** — 5 tokens de espaçamento (xs a xl) com valor em rem e px
- **Motion & Easing** — 4 curvas de easing com cubic-bezier, 3 durações; cada item com nome do token, valor e descrição de uso

### 3.4 Logo System

5 seções:

- **Primary Logo** — Versão dark background e light background side-by-side
- **Variants** — Horizontal, Compact, Favicon/Small
- **Clear Space** — Diagrama com proporção mínima definida (ex: 1x altura do "X")
- **Usage Rules** — Grid 2x2 com casos CORRECT/INCORRECT com ícones
- **Color Contexts** — Logo em 4 fundos diferentes (black, surface, cream, lime)

### 3.5 Icon System

3 seções:

- **Icon Grid** — 4 tamanhos (16px, 24px, 32px, 48px) com contexto de uso; grid de ícones base com labels (Check, Close, Plus, Minus, Chevrons, Arrow, Search, Sun, Grid, Moon)
- **Usage Rules** — 6 regras numeradas (stroke 2px, round caps, viewBox canônico, stroke-only, currentColor, touch target mínimo)
- **Color Variants** — 6 variantes de cor com token CSS (Cream, Lime, Dim, Error, Blue, Flare)

### 3.6 Moodboard

4 categorias com referências visuais:

- **Web UI & Product** — Cards com imagem, título, tags e "Influência →" (lista do que foi derivado)
- **HUD & Dashboard** — Referências de cockpit, gaming UI, data panels
- **Graphic & Pattern** — Texturas, grids geométricos, ícones HUD
- **Layout & Typography** — Templates, composições tipográficas, efeitos cyberpunk

Rodapé de Design Principles com 6 princípios em grid (Dark-First, Neon Lime Accent, Monospace Voice, Grid Precision, HUD Language, Data-Dense)

### 3.7 Component Catalog

Grid de preview de todos os componentes com contagem (ex: Buttons (4), Cards (3)). Páginas individuais por categoria:

- **Buttons** — 4 variantes (Primary, Secondary, Ghost, Delete), 3 tamanhos, 3 estados (Default, Loading, Disabled), combinações de uso
- **Inputs** — 3 tipos
- **Badges** — 5 variantes
- **Switches, Checkboxes, Sliders** — 1 cada
- **Spinners** — 3 variantes
- **Progress** — 3 variantes
- **Cards** — 3 variantes
- **Tables** — Data grid
- **Charts** — Bar + Donut
- **Feedback** — Alert + Toast + Modal

### 3.8 Effects Library

5 seções de efeitos visuais prontos para uso:

- **Ticker Strip** — Scroll horizontal infinito com itens e separadores, via CSS `@keyframes`
- **Badge Variants** — Lime, Blue, Error, Surface, Solid
- **Glow & Pulse** — Neon Glow, Spin, Pulse animados
- **Hover Effects** — Cards com estado hover demonstrado ao vivo

### 3.9 Pattern Library

6 categorias de padrões CSS prontos:

- **Grid Patterns** — Dot Grid (3 densidades), Crosshair Grid (2 variantes), Wireframe Perspective, Symbol Grid, Plus Grid
- **HUD Frames** — Frame Bracket (normal + full), Frame Tech (3 tamanhos), Frame Notch (TR, BL, Both) — todos via `clip-path`
- **Hazard / Warning** — Hazard Stripes (3 opacidades), Warning Bar
- **Circuit Traces** — Horizontal trace, Circuit Board tile
- **Textures** — Scanlines (2 intensidades), Noise Texture, Data Rain, Industrial Surface
- **Dividers** — Tech, Arrow, Dashed, Double — todos com efeito gradient lime

### 3.10 Marketing Sections

19 seções de página completas, cada uma com tag `REBUILD` ou `ENHANCE`:

HeroSection, LogoTicker, StatsSection, ProblemSection, ServicesSection, HowItWorks, FeaturedCaseStudy, BigQuote, Testimonials, PricingTable, FAQSection, BookCallSection, ContactForm, ROICalculator, NewsletterSignup, DeviceMockupFrame, JobListingCard, GrainOverlay, Footer

### 3.11 Motion Showcase

8 animações do logo via Framer Motion, cada uma clicável para replay:

- Orchestration Pulse (3.5s — hero/splash)
- Speed Lines (2s — emphasis)
- Particle Orbit (loop — agents)
- Logo Dissolve (3s — exit/fade)
- Morphing Square (3.5s — shape shift loop)
- Glitch Reveal (2s — terminal/hacker)
- Stagger Letters (1.5s — navbar/footer)
- Brand Reveal (3s — landing page hero)

---

## 4. Design System & Tokens

### CSS Custom Properties (design tokens)

```css
/* Typography */
--font-bb-display: TASAOrbiterDisplay, 800
--font-bb-sans: Geist, 400-700
--font-bb-mono: Roboto Mono, 400-500

/* Color */
--bb-lime: #D1FF00
--bb-dark: #050505
--bb-surface: #0F0F11
--bb-cream: rgb(244,244,232)
--bb-dim: rgba(245,244,231,0.4)
--bb-border: rgba(156,156,156,0.15)
--bb-blue: #0099FF
--bb-flare: #ED4609
--bb-error: #EF4444

/* Spacing */
--spacing-xs: 0.5rem / 8px
--spacing-sm: 1rem / 16px
--spacing-md: 2rem / 32px
--spacing-lg: 3rem / 48px
--spacing-xl: 4rem / 64px

/* Motion */
--bb-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--bb-ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1)
--bb-ease-decel: cubic-bezier(0, 0, 0.2, 1)
--bb-ease-accel: cubic-bezier(0.4, 0, 1, 1)
--bb-dur-fast: 0.2s
--bb-dur-medium: 0.4s
--bb-dur-slow: 0.7s
```

---

## 5. UI/UX Requirements

**Estética global (Dark Cockpit Edition):**
- Background base: `#050505` — nunca branco puro
- Superfícies elevadas: `#0F0F11`
- Tipografia: sempre hierarquia Display → Sans → Mono
- Accent: verde lima `#D1FF00` como único acento primário
- Grid de 1px com gap como sistema de layout
- Section dividers no estilo HUD: label esquerdo + número à direita + linha

**Componentes de layout obrigatórios:**
- Nav global com dropdowns para Brandbook e Design System
- Sub-header de página com: `[NOME DO SQUAD] // [TÍTULO DA SEÇÃO] // [VERSÃO]`
- Seção numbered com label semântico (ex: `01 // TYPOGRAPHY // FONT FAMILIES & SCALE // 2026`)
- Ticker strip animado reutilizável
- 404 page customizada (com lime giant "404" e botão de retorno)

**Interatividade:**
- Type scale com tabs para alternar pesos (Thin/Reg/Bold/Black)
- Animações com `click to replay`
- Hover states em todos os cards (border lime, scale sutil)
- Sidebar âncora na página do Movimento (scroll com navegação ativa)
- Padrões CSS demonstrados ao vivo (não como screenshot)

---

## 6. Conteúdo Estrutural

Cada página deve ter:
1. Hero title (Display + Lime accent na segunda palavra)
2. Subtitle em monospace uppercase
3. Barra de metadata (categoria, nº de seções, ano)
4. Conteúdo estruturado em seções numeradas
5. Cada seção com section divider HUD-style

---

## 7. Critérios de Aceitação

- [ ] Todas as páginas carregam sem erro 404 (exceto Brand Strategy, que está WIP)
- [ ] Tokens CSS aplicados globalmente e herdados por componentes
- [ ] Ticker strip roda infinitamente sem salto visual
- [ ] Animações do Motion Showcase rodam e reiniciam ao clicar
- [ ] Paleta de cores exibe hex, RGB e CMYK corretamente
- [ ] Typefaces carregam via CDN sem FOUT (Flash of Unstyled Text)
- [ ] Patterns são renderizados via CSS puro (sem imagens externas)
- [ ] Sidebar do Movimento acompanha scroll com seção ativa destacada
- [ ] Cada sub-página do Design System tem URL própria e navegável
- [ ] Site é responsivo e funcional em mobile (com nav colapsável via ☰)

---

## 8. Fora do Escopo (v1.0)

- Editor visual para customizar o brandbook
- Autenticação/controle de acesso por usuário
- Export para PDF
- Brand Strategy page (conteúdo ainda não publicado)
- CMS para edição de conteúdo sem deploy

---

Essa PRD cobre 100% do que foi mapeado no site. O site é um **Next.js App Router** com roteamento em `/brandbook/[slug]` e usa CSS custom properties como design tokens — arquitetura limpa e replicável. Quer que eu detalhe algum módulo específico mais a fundo ou crie um documento de especificação técnica (TDD) para o stack?