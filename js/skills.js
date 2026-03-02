    // ═══════════════════════════════════════════════════════
    //  SKILLS
    // ═══════════════════════════════════════════════════════
    const SKILLS_LIST = [
      { id: 'coding-agent', name: 'Coding Agent', icon: '💻', desc: 'Delega tarefas de código para Codex, Claude Code ou Pi. Builds, refactors, PRs.', tags: ['código', 'automação', 'deploy'], status: 'ativo' },
      { id: 'gemini', name: 'Gemini', icon: '✨', desc: 'Q&A, resumo e geração one-shot via Gemini CLI.', tags: ['ia', 'geração', 'texto'], status: 'ativo' },
      { id: 'gh-issues', name: 'GitHub Issues', icon: '🐙', desc: 'Fetch issues, spawna agentes para fixes, abre PRs e monitora reviews.', tags: ['github', 'código', 'pr'], status: 'ativo' },
      { id: 'github', name: 'GitHub CLI', icon: '📦', desc: 'Operações GitHub: issues, PRs, CI, logs via gh CLI.', tags: ['github', 'ci'], status: 'ativo' },
      { id: 'google-sheets', name: 'Google Sheets', icon: '📊', desc: 'Lê e escreve planilhas Google Sheets via OAuth.', tags: ['sheets', 'dados'], status: 'ativo' },
      { id: 'image-vision', name: 'Image Vision', icon: '👁️', desc: 'Analisa e descreve imagens com Gemini 2.0 Flash Vision.', tags: ['imagem', 'ia', 'análise'], status: 'ativo' },
      { id: 'nano-banana-pro', name: 'Nano Banana Pro', icon: '🎨', desc: 'Gera/edita imagens via Gemini 3 Pro Image.', tags: ['imagem', 'geração'], status: 'ativo' },
      { id: 'openai-image-gen', name: 'OpenAI Image Gen', icon: '🖼️', desc: 'Geração em lote de imagens via OpenAI Images API.', tags: ['imagem', 'openai'], status: 'ativo' },
      { id: 'openai-whisper-api', name: 'Whisper API', icon: '🎙️', desc: 'Transcrição de áudio via OpenAI Whisper API.', tags: ['áudio', 'transcrição'], status: 'ativo' },
      { id: 'remotion', name: 'Remotion', icon: '🎬', desc: 'Boas práticas para criação de vídeos com React/Remotion.', tags: ['vídeo', 'react'], status: 'ativo' },
      { id: 'telegram-bot', name: 'Telegram Bot', icon: '📱', desc: 'Envia mensagens, alertas e interage via Telegram.', tags: ['telegram', 'mensagens'], status: 'ativo' },
      { id: 'video-frames', name: 'Video Frames', icon: '🎞️', desc: 'Extrai frames e clipes de vídeos com ffmpeg.', tags: ['vídeo', 'ffmpeg'], status: 'ativo' },
      { id: 'weather', name: 'Weather', icon: '🌤️', desc: 'Clima atual e previsão via wttr.in / Open-Meteo.', tags: ['clima'], status: 'ativo' },
      { id: 'youtube', name: 'YouTube', icon: '▶️', desc: 'Resumo, transcrição e análise de vídeos YouTube.', tags: ['youtube', 'vídeo'], status: 'ativo' },
      { id: 'skill-creator', name: 'Skill Creator', icon: '🛠️', desc: 'Cria e atualiza AgentSkills com scripts e assets.', tags: ['skills', 'dev'], status: 'ativo' },
      { id: 'healthcheck', name: 'Healthcheck', icon: '🔒', desc: 'Auditoria de segurança e hardening do host OpenClaw.', tags: ['segurança', 'ops'], status: 'ativo' },
    ];

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

    function getApiCustos() {
      const s = localStorage.getItem('imperio_api_custos');
      return s ? JSON.parse(s) : [
        { nome: 'Claude API', valor: 0, moeda: 'USD' },
        { nome: 'OpenAI API', valor: 0, moeda: 'USD' },
        { nome: 'Google Gemini', valor: 0, moeda: 'USD' },
        { nome: 'Google Ads', valor: 0, moeda: 'USD', is_ads: true }
      ];
    }
    function saveApiCustos(arr) { localStorage.setItem('imperio_api_custos', JSON.stringify(arr)); }
