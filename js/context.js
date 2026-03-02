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
