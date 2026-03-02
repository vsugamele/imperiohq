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
