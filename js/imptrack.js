/**
 * Imperator Tracker Script (Client-Side)
 * Repassa UTMs e parâmetros nativos (sck, src) para todos os botões de checkout (Hotmart, Ticto, etc.).
 * Pode ser colado no Header global das Landing Pages.
 * 
 * Uso:
 * <script src="https://SEU-DOMINIO.com/js/imptrack.js" async defer></script>
 */

(function () {
    'use strict';

    // Parâmetros principais que queremos rastrear e repassar
    var ALLOWED_PARAMS = ['sck', 'src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'click_id'];
    var STORAGE_KEY = '__imp_trk';

    function getUrlParams() {
        var search = window.location.search;
        if (!search) return {};
        var params = new URLSearchParams(search);
        var result = {};
        ALLOWED_PARAMS.forEach(function (key) {
            if (params.has(key)) {
                result[key] = params.get(key);
            }
        });
        return result;
    }

    function loadStoredParams() {
        try {
            var data = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    function saveParams(newParams) {
        if (Object.keys(newParams).length === 0) return loadStoredParams();

        var currentParams = loadStoredParams();
        var hasChanges = false;

        for (var k in newParams) {
            if (currentParams[k] !== newParams[k]) {
                currentParams[k] = newParams[k];
                hasChanges = true;
            }
        }

        if (hasChanges) {
            try {
                var val = JSON.stringify(currentParams);
                localStorage.setItem(STORAGE_KEY, val);
                sessionStorage.setItem(STORAGE_KEY, val); // fallback cruzado
            } catch (e) { }
        }
        return currentParams;
    }

    function decorateLinks() {
        var trackedParams = loadStoredParams();
        if (Object.keys(trackedParams).length === 0) return;

        var links = document.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            try {
                // Ignora links que não sejam HTTP(s), âncoras internas ou scripts js
                var href = a.getAttribute('href');
                if (!href || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) {
                    continue;
                }

                var url = new URL(a.href);
                var changed = false;

                // Se for link do checkout ou mesmo domínio, coloca as UTMs e src/sck neles
                // Domínios típicos de checkout que convertem (Hotmart, Ticto, Kiwify, PerfectPay, etc)
                // Se precisar ser agressivo, repassa pra TUDO (o que o Utmify costuma fazer).

                for (var k in trackedParams) {
                    if (!url.searchParams.has(k)) {
                        url.searchParams.set(k, trackedParams[k]);
                        changed = true;
                    }
                }

                if (changed) {
                    // Atualiza o DOM e o href direto
                    // Em alguns builders/themes o click listener sobrepõe o href. Alterar o atributo realimenta ele.
                    a.setAttribute('href', url.toString());
                    a.href = url.toString();
                }
            } catch (e) { }
        }
    }

    // 1. Extrai da barra de navegação
    var urlParams = getUrlParams();

    // 2. Mescla e salva com os que já existem no LocalStorage (pra persistir se o usuário trocar de página no seu site)
    saveParams(urlParams);

    // 3. Verifica se a página já carregou pra primeira rodada (ou decora imediatamente se for síncrono)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', decorateLinks);
    } else {
        decorateLinks();
    }

    // 4. MutationObserver (muito importante para Elementor, WordPress e React)
    // Alguns botões de checkout são inseridos dinamicamente depois do DOMReady. Isso "caça" eles.
    try {
        var observer = new MutationObserver(function (mutations) {
            var shouldDecorate = false;
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length > 0) {
                    shouldDecorate = true;
                    break;
                }
            }
            if (shouldDecorate) decorateLinks();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    } catch (err) { }

})();
