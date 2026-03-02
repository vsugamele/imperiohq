export const PROJECTS_SEED = [
      {
        id: 'laise', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'Laíse — Aviator', produto: 'Afiliada Aviator', preco: 'Comissão', status: 'Ativo',
        vende: false, objetivo: 'Escalar conteúdo orgânico + ads para geração de cadastros Aviator',
        orcamento_trafego: 'A definir',
        links: { site: '', ads: '', analytics: '', criativos: '' },
        contexto: 'Perfil feminino afiliado ao Aviator. Foco em conteúdo orgânico no Instagram e TikTok + Meta Ads.',
        avatar: {
          externo: 'Quero ganhar dinheiro jogando ou indicando jogos online sem precisar trabalhar o dia todo',
          interno: 'Quero sentir que descobri um jeito que poucas pessoas sabem, que me coloca à frente e me dá controle sobre minha vida financeira',
          dores_superficiais: ['Não sabe como começar', 'Medo de gastar e não ter retorno', 'Não entende as estratégias do jogo'],
          dores_profundas: ['Sente que trabalho convencional nunca vai mudar sua situação', 'Tem vergonha de não conseguir sustentar a família', 'Medo de cair em golpe e perder o pouco que tem'],
          medos: ['Perder dinheiro', 'Ser julgado por jogar', 'Não ter consistência'],
          objecoes: ['Isso é golpe?', 'Precisa de muito dinheiro pra começar?', 'Dá pra confiar?'],
          inimigo: 'Sistema financeiro tradicional que não dá oportunidade para quem não tem diploma ou capital inicial',
          resultado_sonhado: 'Renda de R$5-10k/mês trabalhando 2-3h por dia, liberdade financeira e geográfica',
          trigger_event: 'Viu alguém comum (amigo, influencer parecido) falar que está ganhando dinheiro com isso',
          fase_consciencia: 'Consciente do Problema, Consciente da Solução',
          sub_avatares: [
            { nome: 'A Desesperada', desc: 'Mulher 25-38, endividada, precisa de renda extra urgente, disposta a tentar qualquer coisa', urgencia: 9, dinheiro: 6 },
            { nome: 'A Curiosa', desc: 'Mulher 20-30, viu conteúdo no TikTok, quer entender se é verdade antes de tentar', urgencia: 5, dinheiro: 7 },
            { nome: 'A Já Tentou', desc: 'Mulher 28-45, já tentou outros métodos online que falharam, está cética mas ainda busca', urgencia: 7, dinheiro: 5 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Ela acorda todo dia com a mesma conta bancária no vermelho. Vê histórias de pessoas "simples" ganhando dinheiro online e sente mistura de esperança e desconfiança.' },
            { arc: 'Trigger', text: 'Uma amiga no grupo do zap mostra o print do saque. Ela pensa: "se ela conseguiu, eu também consigo."' },
            { arc: 'Busca', text: 'Pesquisa no YouTube, vê perfis no TikTok, compara. Está avaliando quem parece mais confiável, mais parecida com ela.' },
            { arc: 'Decisão', text: 'Escolhe quem vê ela mesma como cliente — alguém que também começou do zero e mostra o processo real.' }
          ]
        },
        pipeline: { avatar: 40, funil: 10, copy: 0, prompts: 0, design: 0, trafego: 20 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'jonathan', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'Jonathan', produto: 'iGaming / Jonathan', preco: '', status: 'Ativo', vende: false,
        objetivo: 'Escala em iGaming', orcamento_trafego: 'A definir',
        links: { site: '', ads: '', analytics: '', criativos: '' }, contexto: '',
        avatar: { externo: '', interno: '', dores_superficiais: [], dores_profundas: [], medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '', fase_consciencia: '', sub_avatares: [], storyboard: [] },
        pipeline: { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } }, assets: []
      },
      {
        id: 'pedro', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'Pedro', produto: 'iGaming / Pedro', preco: '', status: 'Ativo', vende: false,
        objetivo: 'Escala em iGaming', orcamento_trafego: 'A definir',
        links: { site: '', ads: '', analytics: '', criativos: '' }, contexto: '',
        avatar: { externo: '', interno: '', dores_superficiais: [], dores_profundas: [], medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '', fase_consciencia: '', sub_avatares: [], storyboard: [] },
        pipeline: { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } }, assets: []
      },
      {
        id: 'theo', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'Theo', produto: 'iGaming / Theo', preco: '', status: 'Ativo', vende: false,
        objetivo: 'Escala em iGaming', orcamento_trafego: 'A definir',
        links: { site: '', ads: '', analytics: '', criativos: '' }, contexto: '',
        avatar: { externo: '', interno: '', dores_superficiais: [], dores_profundas: [], medos: [], objecoes: [], inimigo: '', resultado_sonhado: '', trigger_event: '', fase_consciencia: '', sub_avatares: [], storyboard: [] },
        pipeline: { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } }, assets: []
      },
      {
        id: 'vinicius_v', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'Vinicius Vieira — Aviator', produto: 'Afiliada Aviator', preco: 'Comissão', status: 'Ativo',
        vende: false, objetivo: 'Meta Ads + TikTok/Instagram para captação de afiliados Aviator',
        orcamento_trafego: 'A definir',
        links: { site: '', ads: '', analytics: '' },
        contexto: 'Perfil masculino afiliado. Foco em tráfego pago Meta + orgânico TikTok.',
        avatar: {
          externo: 'Quero aprender a ganhar dinheiro online com apostas/afiliados',
          interno: 'Quero provar para minha família e amigos que consigo me sustentar por conta própria sem depender de emprego fixo',
          dores_superficiais: ['Não sabe qual estratégia de conteúdo funciona', 'Não tem orçamento para ads'],
          dores_profundas: ['Sente pressão social para ter emprego "sério"', 'Tem medo de decepcionar quem acredita nele'],
          medos: ['Investir tempo e não ver resultado', 'Banimento de conta'],
          objecoes: ['Já tem muito conteúdo sobre isso', 'Como ser diferente?'],
          inimigo: 'Emprego CLT que prende e não dá perspectiva de crescimento real',
          resultado_sonhado: 'R$8-15k/mês, próprio negócio digital, ser referência no nicho',
          trigger_event: 'Demissão ou promoção negada no trabalho fixo',
          fase_consciencia: 'Consciente da Solução, pesquisando',
          sub_avatares: [
            { nome: 'O Ambicioso', desc: 'Homem 22-32, quer escalar rápido, foco em resultado financeiro', urgencia: 8, dinheiro: 7 },
            { nome: 'O Inseguro', desc: 'Homem 25-35, quer mas tem medo de parecer golpe para família', urgencia: 6, dinheiro: 6 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Trabalha de carteira assinada ou está desempregado. Vê vídeos de gurus ganhando dinheiro online e pensa "quero isso".' },
            { arc: 'Trigger', text: 'Colega ou conhecido mostra ganhos reais. Decide que vai tentar.' },
            { arc: 'Busca', text: 'Pesquisa quem ensina de forma mais autêntica, sem papo de coach.' },
            { arc: 'Decisão', text: 'Segue quem parece igual a ele — mesmo background, sem ostentação exagerada.' }
          ]
        },
        pipeline: { avatar: 25, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 15 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'julin', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'Julin Aviator', produto: 'Canal Aviator', preco: 'Comissão', status: 'Ativo',
        vende: false, objetivo: 'Escalar canal de sinalização Aviator',
        orcamento_trafego: 'Baixo',
        links: { site: '', tg: '', yt: '' },
        contexto: 'Canal de sinais Aviator em fase de escala.',
        avatar: {
          externo: 'Quero sinais confiáveis para ganhar no Aviator',
          interno: 'Quero uma renda extra que funcione de verdade, sem complicação',
          dores_superficiais: ['Perde dinheiro sem estratégia', 'Não sabe quando entrar/sair'],
          dores_profundas: ['Frustração com promessas falsas', 'Vergonha de ter caído em grupos que não funcionam'],
          medos: ['Mais um grupo golpe', 'Vício'],
          objecoes: ['Funciona mesmo?', 'Qual a taxa de acerto?'],
          inimigo: 'Grupos falsos que prometem 100% de acerto',
          resultado_sonhado: 'Ganho consistente de R$500-2k/mês como renda extra',
          trigger_event: 'Perdeu dinheiro em outro grupo e quer uma alternativa séria',
          fase_consciencia: 'Consciente da Solução, comparando',
          sub_avatares: [
            { nome: 'O Iniciante', desc: 'Nunca apostou, quer começar com segurança', urgencia: 6, dinheiro: 7 },
            { nome: 'O Veterano Decepcionado', desc: 'Já perdeu em outros grupos, busca algo diferente', urgencia: 8, dinheiro: 5 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Vê amigos no grupo ganhando, quer entrar mas tem medo de golpe.' },
            { arc: 'Trigger', text: 'Vê resultado real de alguém que conhece.' },
            { arc: 'Busca', text: 'Pesquisa grupos, lê comentários, testa gratuitamente.' },
            { arc: 'Decisão', text: 'Entra no grupo com prova social e gratuidade inicial.' }
          ]
        },
        pipeline: { avatar: 20, funil: 5, copy: 0, prompts: 0, design: 0, trafego: 10 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'gb', icon: '🎰', categoria: 'iGaming', vertical_color: 'var(--red-bright)',
        nome: 'GB Aviator', produto: 'Nova Marca Aviator', preco: 'A definir', status: 'Rascunho',
        vende: false, objetivo: 'Definir posicionamento e modelo de negócio',
        orcamento_trafego: 'Não definido',
        links: {},
        contexto: 'Nova marca. Precisa de pesquisa de mercado e definição de nicho dentro do iGaming.',
        avatar: {
          externo: 'A definir',
          interno: 'A definir',
          dores_superficiais: [],
          dores_profundas: [],
          medos: [],
          objecoes: [],
          inimigo: 'A definir',
          resultado_sonhado: 'A definir',
          trigger_event: 'A definir',
          fase_consciencia: 'A definir',
          sub_avatares: [],
          storyboard: []
        },
        pipeline: { avatar: 0, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'jp_freitas', icon: '🚀', categoria: 'Lançamentos', vertical_color: 'var(--blue-bright)',
        nome: 'JP Freitas', produto: 'Curso Fitness / Emagrecimento', preco: 'R$ 997', status: 'Ativo',
        vende: true, objetivo: 'Otimizar conversão e escalar campanhas Meta Ads',
        orcamento_trafego: 'R$3-8k/mês',
        links: { site: '', ads: '', checkout: '', analytics: '' },
        contexto: 'Curso de emagrecimento/fitness. Já vendendo. Pipeline 60% completo. Foco em otimização de headline, order bump e escalada.',
        mecanismo: 'Método de recomposição corporal sem dieta restritiva em 90 dias',
        avatar: {
          externo: 'Quero emagrecer e ter um corpo definido',
          interno: 'Quero me olhar no espelho e me sentir orgulhoso, quero que as pessoas me vejam diferente e que meu parceiro/a me deseje mais',
          dores_superficiais: ['Não consegue manter a dieta', 'Fica meses na academia sem resultado', 'Não sabe o que comer'],
          dores_profundas: ['Sente vergonha em situações sociais com o corpo (praia, festa)', 'Sente que não tem disciplina — se culpa por isso', 'Medo de envelhecer sem cuidar da saúde'],
          medos: ['Mais uma dieta que não vai funcionar', 'Efeito sanfona', 'Gastar dinheiro em mais um método'],
          objecoes: ['Não tenho tempo', 'Já tentei de tudo', 'R$997 é caro'],
          inimigo: 'Indústria das dietas que vende restrição insustentável e causa efeito sanfona',
          resultado_sonhado: 'Perder 10-20kg, ter energia, autoconfiança, ser notado pela mudança',
          trigger_event: 'Foto em evento, médico falando de risco de saúde, ou ver o próprio reflexo num momento de vulnerabilidade',
          fase_consciencia: 'Consciente da Solução, comparando antes de comprar',
          sub_avatares: [
            { nome: 'O Pai de Família', desc: 'Homem 30-45, ganhou peso após casamento/filhos, quer exemplo para filhos e vitalidade', urgencia: 7, dinheiro: 8 },
            { nome: 'A Mãe Pós-Parto', desc: 'Mulher 25-38, corpo mudou após gravidez, quer reconquistar autoestima', urgencia: 8, dinheiro: 7 },
            { nome: 'O Jovem Frustrado', desc: 'Homem/Mulher 20-30, treina mas não vê resultado, quer método com ciência', urgencia: 6, dinheiro: 6 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Acorda sem energia. Evita espelho. Recusa convites para praia ou piscina. Já tentou várias dietas — todas fracassaram depois de 2 semanas.' },
            { arc: 'Trigger', text: 'Foto num evento, ou comentário de alguém, ou médico que alerta. Momento de "chega".' },
            { arc: 'Busca', text: 'Pesquisa no Google, YouTube, Instagram. Encontra vários métodos. Está comparando e avaliando quem parece mais confiável e científico.' },
            { arc: 'Objeção', text: 'Já gastou dinheiro antes que não funcionou. Está com o dedo na compra mas o pensamento "e se falhar de novo?" paralisa.' },
            { arc: 'Decisão', text: 'Lê depoimentos de pessoas parecidas com ele. Vê a garantia. O mecanismo diferenciado faz sentido. Compra.' }
          ]
        },
        pipeline: { avatar: 80, funil: 70, copy: 60, prompts: 40, design: 50, trafego: 55 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: [
          { tipo: 'copy', icon: '📝', nome: 'Página de Vendas v1', agente: 'Page Writer', data: '20/02/2026', status: 'Em revisão' },
          { tipo: 'copy', icon: '📧', nome: 'Sequência Email 5 dias', agente: 'Email Copywriter', data: '18/02/2026', status: 'Aprovado' },
          { tipo: 'creative', icon: '🎨', nome: 'Criativo Estático v1-v3', agente: 'Ad Designer', data: '15/02/2026', status: 'Rodando' }
        ]
      },
      {
        id: 'tatuagem', icon: '🚀', categoria: 'Lançamentos', vertical_color: 'var(--blue-bright)',
        nome: 'Tatuagem — Jonathan', produto: 'Curso de Tatuagem', preco: 'R$ 1.497', status: 'Ativo',
        vende: true, objetivo: 'Reescrever página de vendas e criar upsell',
        orcamento_trafego: 'R$2-5k/mês',
        links: { site: '', ads: '', checkout: '' },
        contexto: 'Curso de tatuagem. Já vendendo. Pipeline 53% completo. Foco em reescrita da página de vendas e VSL v2.',
        mecanismo: 'Método de tatuagem realista para iniciantes em 60 dias',
        avatar: {
          externo: 'Quero aprender a tatuar e trabalhar com o que amo',
          interno: 'Quero ter um trabalho onde seja reconhecido pela arte que crio, não trabalhar para ninguém e ser livre para expressar minha identidade',
          dores_superficiais: ['Não sabe por onde começar', 'Tem medo de estragar a pele de alguém', 'Não sabe comprar equipamentos certos'],
          dores_profundas: ['Pressão familiar para ter emprego "estável"', 'Sente que nunca vai ser bom o suficiente', 'Medo de tentar e desistir (mais uma vez)'],
          medos: ['Estragar cliente e manchar reputação', 'Investir em equipamento caro e desistir', 'Família não aprovar a escolha'],
          objecoes: ['Precisa de faculdade?', 'Quanto tempo pra ganhar dinheiro?', 'Já tem muita gente no mercado?'],
          inimigo: 'Mercado de trabalho tradicional que não valoriza criatividade e arte',
          resultado_sonhado: 'Trabalho próprio como tatuador reconhecido, agenda cheia, liberdade criativa e financeira',
          trigger_event: 'Demissão, cansaço do trabalho atual, ou tatuagem que fez em si mesmo despertou vontade',
          fase_consciencia: 'Consciente da Solução, decidindo fornecedor',
          sub_avatares: [
            { nome: 'O Artista Reprimido', desc: 'Homem/Mulher 20-32, sempre amou arte mas nunca teve estrutura, quer transformar paixão em profissão', urgencia: 8, dinheiro: 6 },
            { nome: 'O Insatisfeito com Emprego', desc: 'Homem/Mulher 25-35, emprego estável mas infeliz, quer transição de carreira', urgencia: 7, dinheiro: 7 },
            { nome: 'O Já Tatuador Informal', desc: 'Já tatuou amigos, quer aprender técnica e profissionalizar', urgencia: 9, dinheiro: 8 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Trabalha no emprego que não gosta. Nas horas livres desenha, faz arte. Sonha com liberdade mas sente que não é "pra ele".' },
            { arc: 'Trigger', text: 'Demissão, ou conversa que muda perspectiva, ou ver tatuador ganhando bem online.' },
            { arc: 'Busca', text: 'Pesquisa cursos, YouTube grátis vs pago. Avalia quem tem resultado real, quem parece ensinador de verdade.' },
            { arc: 'Objeção', text: 'Família questiona. Ele mesmo duvida. "E se não tiver talento?" Mas o desejo de liberdade é maior.' },
            { arc: 'Decisão', text: 'Garantia + depoimentos de alunos reais que faturam + cronograma claro vencem a objeção.' }
          ]
        },
        pipeline: { avatar: 75, funil: 60, copy: 55, prompts: 35, design: 45, trafego: 50 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: [
          { tipo: 'copy', icon: '📝', nome: 'Página de Vendas v1', agente: 'Page Writer', data: '22/02/2026', status: 'Em revisão' },
          { tipo: 'creative', icon: '🎬', nome: 'VSL v1', agente: 'VSL Scripter', data: '19/02/2026', status: 'Aprovado' }
        ]
      },
      {
        id: 'roncar', icon: '📦', categoria: 'Infoprodutos', vertical_color: 'var(--purple-bright)',
        nome: 'Pare de Roncar', produto: 'Produto Digital Saúde', preco: 'R$ 197', status: 'Ativo',
        vende: false, objetivo: 'Pesquisa de mercado + definição do mecanismo único',
        orcamento_trafego: 'A definir',
        links: {},
        contexto: 'Produto digital de saúde sobre ronco/apneia. Fase inicial de pesquisa.',
        avatar: {
          externo: 'Quero parar de roncar',
          interno: 'Quero dormir bem, não envergonhar meu parceiro/a e acordar com energia para viver de verdade',
          dores_superficiais: ['Ronca alto e sabe que incomoda', 'Acorda cansado', 'Parceiro reclamando'],
          dores_profundas: ['Vergonha em viagens ou situações com outras pessoas', 'Medo de ter apneia grave não diagnosticada', 'Relacionamento sendo afetado'],
          medos: ['Cirurgia', 'Aparelho CPAP caro e desconfortável', 'Problema de saúde sério'],
          objecoes: ['Será que algo não cirúrgico funciona?', 'Já tentei travesseiro ortopédico'],
          inimigo: 'Soluções invasivas e caras que os médicos recomendam sem antes tentar alternativas naturais',
          resultado_sonhado: 'Dormir em silêncio, acordar descansado, parceiro/a feliz, sem medo de viajar',
          trigger_event: 'Parceiro ameaça dormir em quarto separado, ou médico faz alerta sobre apneia',
          fase_consciencia: 'Consciente do Problema, buscando soluções alternativas',
          sub_avatares: [
            { nome: 'O Casal em Crise', desc: 'Homem 35-55, parceira reclamando há meses, urgência alta', urgencia: 9, dinheiro: 7 },
            { nome: 'O Autodiagnóstico', desc: 'Homem/Mulher 30-50, percebeu sozinho, busca solução antes de ir ao médico', urgencia: 6, dinheiro: 8 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Dorme mal sem saber. Acorda cansado. Parceiro/a reclama toda semana.' },
            { arc: 'Trigger', text: 'Situação de embaraço (viagem, hotel) ou ultimato do parceiro/a.' },
            { arc: 'Busca', text: 'Pesquisa soluções naturais antes de ir ao médico.' },
            { arc: 'Decisão', text: 'Produto com abordagem natural, resultado em poucos dias, preço acessível.' }
          ]
        },
        pipeline: { avatar: 30, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'healiks', icon: '🌿', categoria: 'Nutraceuticos', vertical_color: 'var(--green-bright)',
        nome: 'Healiks', produto: 'Suplementos Naturais', preco: 'A definir', status: 'Ativo',
        vende: false, objetivo: 'Definir produto, posicionamento e mecanismo',
        orcamento_trafego: 'A definir',
        links: {},
        contexto: 'Marca de suplementos naturais. Precisa definir produto core e posicionamento.',
        avatar: {
          externo: 'Quero melhorar minha saúde naturalmente',
          interno: 'A definir — depende do produto escolhido',
          dores_superficiais: [],
          dores_profundas: [],
          medos: [],
          objecoes: [],
          inimigo: 'A definir',
          resultado_sonhado: 'A definir',
          trigger_event: 'A definir',
          fase_consciencia: 'A definir',
          sub_avatares: [],
          storyboard: []
        },
        pipeline: { avatar: 5, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'petselect', icon: '🛍️', categoria: 'Ecommerce', vertical_color: 'var(--orange-bright)',
        nome: 'PetSelect', produto: 'Produtos Premium Pet', preco: 'Variado', status: 'Ativo',
        vende: false, objetivo: 'Otimizar conversão e criar estratégia de conteúdo',
        orcamento_trafego: 'A definir',
        links: { site: '', ads: '' },
        contexto: 'E-commerce de produtos premium para pets. Fase de otimização.',
        avatar: {
          externo: 'Quero o melhor para meu pet',
          interno: 'Meu pet é minha família — quero sentir que sou um bom dono, que proporciono uma vida digna para ele',
          dores_superficiais: ['Não sabe qual produto é realmente bom', 'Preço de produtos premium assusta'],
          dores_profundas: ['Culpa de deixar pet em casa enquanto trabalha', 'Medo de pet ficar doente por causa de produto ruim'],
          medos: ['Pet rejeitar produto', 'Gastar e não valer a pena'],
          objecoes: ['É muito caro', 'Meu pet come tudo igual'],
          inimigo: 'Pet shops de bairro que vendem qualquer coisa sem orientação',
          resultado_sonhado: 'Pet saudável, feliz, com energia — e sentir que é o melhor dono possível',
          trigger_event: 'Pet ficou doente, ou veterinário recomendou mudança de alimentação',
          fase_consciencia: 'Consciente da Solução, comparando lojas',
          sub_avatares: [
            { nome: 'A Mãe de Pet', desc: 'Mulher 25-40, trata pet como filho, disposição alta para gastar', urgencia: 7, dinheiro: 9 },
            { nome: 'O Dono Consciente', desc: 'Homem/Mulher 30-45, preocupado com saúde, busca custo-benefício', urgencia: 6, dinheiro: 7 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Compra ração padrão no mercado. Pet parece ok mas não está vibrante.' },
            { arc: 'Trigger', text: 'Visita ao vet, ou amigo que mostra transformação do próprio pet.' },
            { arc: 'Busca', text: 'Pesquisa reviews, compara lojas online.' },
            { arc: 'Decisão', text: 'Loja que educa sobre o produto, tem reviews reais e entrega confiável.' }
          ]
        },
        pipeline: { avatar: 35, funil: 20, copy: 10, prompts: 0, design: 15, trafego: 20 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'forex', icon: '📈', categoria: 'Forex', vertical_color: 'var(--gold)',
        nome: 'Forex Education', produto: 'Educação Financeira', preco: 'A definir', status: 'Rascunho',
        vende: false, objetivo: 'Definir modelo de negócio: curso, sinais ou gestão',
        orcamento_trafego: 'Não definido',
        links: {},
        contexto: 'Projeto de educação financeira/Forex. Modelo de negócio ainda não definido.',
        avatar: {
          externo: 'Quero aprender a investir em Forex e ganhar dinheiro',
          interno: 'Quero independência financeira e a sensação de que entendo de algo que poucos entendem — dominar o mercado financeiro global',
          dores_superficiais: ['Não entende como Forex funciona', 'Tentou antes e perdeu'],
          dores_profundas: ['Sente que riqueza é para quem já nasceu com dinheiro', 'Frustração com rendimentos da poupança e renda fixa'],
          medos: ['Perder tudo o que tem', 'Ser enganado por mais um "guru"'],
          objecoes: ['É muito arriscado', 'Precisa de muito capital', 'Não tenho conhecimento'],
          inimigo: 'Sistema financeiro tradicional que mantém o trabalhador em ciclo de endividamento',
          resultado_sonhado: 'Renda passiva crescente, independência financeira em 2-3 anos',
          trigger_event: 'Dívida, ou ver rendimento irrisório do investimento atual, ou conhecer alguém que ganhou com Forex',
          fase_consciencia: 'Consciente do Problema, início de consciência de solução',
          sub_avatares: [
            { nome: 'O Trabalhador Frustrado', desc: 'Homem 28-42, CLT, quer renda extra que supere inflação', urgencia: 7, dinheiro: 6 },
            { nome: 'O Já Perdeu', desc: 'Já tentou trade/Forex antes, perdeu, quer uma abordagem diferente', urgencia: 8, dinheiro: 5 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Salário vai direto para contas. Vê dinheiro na poupança render centavos. Sente que nunca vai sair desse ciclo.' },
            { arc: 'Trigger', text: 'Conta bancária no vermelho ou ver alguém "comum" ganhando com trade.' },
            { arc: 'Busca', text: 'YouTube, cursos gratuitos, grupos Telegram. Assustado com complexidade.' },
            { arc: 'Decisão', text: 'Método que parece simples e realista, sem promessa de enriquecimento rápido.' }
          ]
        },
        pipeline: { avatar: 20, funil: 0, copy: 0, prompts: 0, design: 0, trafego: 0 },
        branding: { arquetipo: '', manifesto: '', mecanismo_key: '', inimigo_comum: '', linguagem: { usa: [], evita: [] }, cores: '', personalidade: '' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: []
      },
      {
        id: 'vanessa_equilibreon', icon: '🌿', categoria: 'Clínica', vertical_color: '#8b5cf6',
        nome: 'Vanessa — EquilibreON', produto: 'Clínica de Saúde Integrativa, Nutrição Funcional e Estética', preco: 'Consulta + Protocolos', status: 'Ativo',
        vende: true, objetivo: 'Atrair mulheres 30-55 anos cansadas de efeito sanfona para protocolos integrativos de emagrecimento e saúde sustentável via Instagram, Meta Ads e SEO local',
        orcamento_trafego: 'A definir',
        links: { site: '', instagram: '', whatsapp: '', agendamento: '' },
        contexto: 'A EquilibreON é uma clínica premium de saúde integrativa que atua na causa raiz dos problemas de saúde, unindo epigenética, nutrição funcional, biofísica e tecnologias estéticas (BodyShape, Fotobiomodulação, Biomat). Diferencial: olhar individualizado e humanizado — sem terrorismo nutricional, sem promessas milagrosas. Método considera corpo + mente + metabolismo + ambiente + comportamento + energia vital.',
        mecanismo: 'Método Integrative Reset — combinação de teste epigenético + modulação metabólica + nutrição comportamental + tecnologias estéticas para emagrecimento sustentável sem efeito rebote',
        avatar: {
          externo: 'Quero emagrecer, reduzir inchaço e ter mais energia no meu dia a dia',
          interno: 'Quero me sentir bem no meu próprio corpo, parar de me culpar e finalmente entender por que não adianta — me sentir cuidada e compreendida de verdade',
          dores_superficiais: ['Emagrece e volta a engordar (efeito sanfona)', 'Está sempre inchada e retém líquido', 'Cansaço constante mesmo dormindo', 'Não consegue manter dieta por mais de 2 semanas', 'Metabolismo lento que não responde'],
          dores_profundas: ['Sente que faz tudo certo e não tem resultado — se culpa por isso', 'Não se reconhece mais no próprio corpo', 'Vergonha em situações sociais (praia, festas, fotos)', 'Relação difícil e sofrida com comida', 'Sente que ninguém olha para ela de forma individual'],
          medos: ['Mais uma abordagem que não vai funcionar e gastar dinheiro', 'Efeito rebote e voltar a engordar', 'Ter que fazer dieta restritiva de novo', 'Descobrir que tem algum problema de saúde grave'],
          objecoes: ['É caro demais para uma clínica', 'Será que funciona para mim que já tentei de tudo?', 'Quanto tempo vou precisar ir?', 'Vai ter dieta restritiva?'],
          inimigo: 'Indústria da dieta tradicional que vende restrição insustentável, trata sintomas isolados e ignora a individualidade — e os médicos que medicalizam em vez de investigar a causa',
          resultado_sonhado: 'Corpo menos inflamado, emagrecimento com manutenção real, mais energia, relação leve com a comida, entender o próprio metabolismo e se sentir bem sem culpa',
          trigger_event: 'Foto num evento que não gostou, médico que alertou sobre exames, roupa que não fechou mais, ou parceiro que fez comentário sobre mudança no corpo',
          fase_consciencia: 'Consciente da Solução, buscando clínica/profissional de confiança',
          sub_avatares: [
            { nome: 'A Sanfona Crônica', desc: 'Mulher 35-50, já fez 5+ dietas, emagrece e engorda, busca algo que mantenha o resultado sem sofrimento', urgencia: 9, dinheiro: 7 },
            { nome: 'A Menopáusica', desc: 'Mulher 45-58, metabolismo mudou com a menopausa, hormônios desregulados, precisa de modulação específica', urgencia: 8, dinheiro: 8 },
            { nome: 'A Que Usa Caneta', desc: 'Mulher 30-50, já usa GLP-1 (semaglutida/ozempic), mas sabe que precisa de suporte completo para manter o resultado', urgencia: 9, dinheiro: 8 },
            { nome: 'A Exausta Inflamada', desc: 'Mulher 30-45, cansaço crônico, inchaço, não dorme bem, busca entender o que está errado no corpo', urgencia: 7, dinheiro: 7 }
          ],
          storyboard: [
            { arc: 'Antes', text: 'Acorda cansada. Olha para o espelho e não se reconhece. A roupa favorita não fecha. Evita festas, fotos, praia. Já tentou lowcarb, jejum, shakes — funcionou por 3 semanas, depois voltou tudo.' },
            { arc: 'Trigger', text: 'Uma foto de festa que até seus filhos tinham vergonha de marcar. Ou o médico que disse "está pré-diabética". Ou simplesmente um comentário inocente de alguém.' },
            { arc: 'Busca', text: 'Pesquisa no Instagram, pede indicação no grupo de mães, compara clínicas. Está avaliando quem parece entender de verdade, não que vai só dar dieta genérica.' },
            { arc: 'Objeção', text: 'É caro. Já gastou com outras coisas. A voz interna diz: "E se não funcionar de novo?" Mas sente que essa abordagem parece diferente — integrativa, individualizada.' },
            { arc: 'Decisão', text: 'Viu um depoimento de alguém parecida com ela. Entendeu que não é falta de força de vontade — é biologia. Agendou a avaliação.' }
          ]
        },
        pipeline: { avatar: 90, funil: 40, copy: 30, prompts: 20, design: 35, trafego: 20 },
        branding: {
          arquetipo: 'O Cuidador',
          manifesto: 'A EquilibreON acredita que o corpo não é seu inimigo. Você não é preguiçosa e não falta força de vontade. Há uma causa real por trás do que você sente — e nós investigamos. Com ciência, empatia e individualidade, ajudamos você a reconquistar sua saúde e se sentir bem no próprio corpo de forma sustentável.',
          mecanismo_key: 'Teste epigenético + modulação metabólica completa + nutrição comportamental + tecnologias estéticas integradas',
          inimigo_comum: 'Dietas restritivas, tratamentos genéricos e profissionais que tratam sintomas sem investigar a causa',
          linguagem: {
            usa: ['acolhedora', 'empática', 'educativa', 'finalmente faz sentido', 'não é falta de força de vontade', 'causa raiz', 'individualizado', 'sustentável', 'sem efeito rebote', 'seu corpo não é defeituoso'],
            evita: ['dieta da moda', 'emagreça rápido', 'resultados milagrosos', 'você precisa se esforçar mais', 'terrorismo nutricional', 'restrição severa']
          },
          cores: '#8b5cf6 (violeta) + #d4af37 (dourado) + #10b981 (verde esmeralda)',
          personalidade: 'Premium mas acolhedora · Autoridade científica sem arrogância · Clara e educativa · Empática e sem julgamento'
        },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: [
          { tipo: 'doc', icon: '📋', nome: 'Diretrizes Estratégicas para IA de Conteúdo', agente: 'Vanessa', data: '25/02/2026', status: 'Aprovado' },
          { tipo: 'doc', icon: '📋', nome: 'Diretrizes Oficiais para IA de Conteúdo', agente: 'Vanessa', data: '25/02/2026', status: 'Aprovado' },
          { tipo: 'brand', icon: '🎨', nome: 'Paleta de Cores EquilibreON', agente: 'Branding', data: '25/02/2026', status: 'Aprovado' }
        ]
      },
      {
        id: 'automacao_black', icon: '🤖', categoria: 'Automação', vertical_color: '#0ea5e9',
        nome: 'Automação Black — OpenClaw', produto: 'Sistema de Execução Autônoma de Marketing', preco: 'Interno', status: 'Em Construção',
        vende: false, objetivo: 'Construir o sistema completo de automação da OpenClaw: captação → conteúdo → distribuição → venda — rodando com mínima intervenção humana, com visibilidade total para o time',
        orcamento_trafego: 'Interno',
        links: { openclaw_webhook: '', vercel_deploy: '', supabase: '', n8n: '' },
        contexto: 'Projeto meta: o sistema que orquestra todos os outros projetos. Integra agentes IA, ferramentas de automação (Apify, Make, n8n), plataformas de publicação (Meta, TikTok, YouTube) e análise (GA4, Supabase). Objetivo: OpenClaw executa tarefas autônomas enquanto o time monitora em tempo real via dashboards.',
        mecanismo: 'Loop de automação: Briefing → Agente IA → Execução autônoma (OpenClaw) → Publicação → Análise → Otimização → Loop',
        avatar: {
          externo: 'Sistema interno — sem avatar de cliente',
          interno: 'Operar no máximo de autonomia com máxima visibilidade para o time',
          dores_superficiais: ['Tarefas repetitivas que consomem tempo humano', 'Falta de visibilidade do que os agentes estão executando', 'Silos entre ferramentas'],
          dores_profundas: ['Tempo dos sócios sendo consumido em operação em vez de estratégia', 'Escala limitada pela capacidade humana'],
          medos: ['Automação quebrando sem ninguém perceber', 'Perda de qualidade com execução automática'],
          objecoes: ['Como garantir qualidade sem revisão humana?', 'E se o agente errar?'],
          inimigo: 'Operação manual que não escala',
          resultado_sonhado: 'Sistema rodando 24/7, time só intervém em decisões estratégicas, visibilidade total em dashboard',
          trigger_event: 'Volume de projetos superando capacidade de operação manual',
          fase_consciencia: 'Implementando',
          sub_avatares: [],
          storyboard: []
        },
        pipeline: { avatar: 100, funil: 60, copy: 50, prompts: 70, design: 40, trafego: 30 },
        branding: { arquetipo: 'O Mago', manifesto: 'Automatizar com inteligência. Escalar com controle.', mecanismo_key: 'Loop de execução autônoma com visibilidade em tempo real', inimigo_comum: 'Operação manual que não escala', linguagem: { usa: ['autônomo', 'orquestrado', 'pipeline', 'execução', 'visibilidade', 'loop'], evita: ['manual', 'braçal', 'sem controle'] }, cores: '#0ea5e9 (azul) + #8b5cf6 (roxo)', personalidade: 'Técnico, eficiente, orientado a sistemas' },
        kpis: { thumbstop: null, ctr: null, cpm: null, cpc: null, roas: null, ltv: null, cac: null, cvr: null, meta: { roas_target: null, cpa_target: null } },
        assets: [
          { tipo: 'sistema', icon: '⚡', nome: 'Webhook OpenClaw — Task Queue', agente: 'Sistema', data: '25/02/2026', status: 'Em revisão' },
          { tipo: 'sistema', icon: '📊', nome: 'Dashboard de Monitoramento', agente: 'Sistema', data: '25/02/2026', status: 'Em revisão' }
        ]
      }
    ];
