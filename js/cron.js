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
