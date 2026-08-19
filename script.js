// ============================================================
// wanderman0 — comportements de la page
// ============================================================

// Clé API YouTube Data v3 — voir console.cloud.google.com
// (Bibliothèque > YouTube Data API v3 > Identifiants > Créer une clé API,
// puis restreignez-la à votre domaine et à cette API uniquement)
const YT_CONFIG = {
    apiKey: 'AIzaSyADYX3RkLuM9_8k7j3a082DdzSodXADc_M',
    handle: '@wanderman_0'
};

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initCopyEmail();
    initYouTubeSubs();
});

/* ---------- effet machine à écrire sur la tagline ---------- */

function initTypewriter() {
    const el = document.querySelector('[data-typewriter]');
    if (!el) return;

    const fullText = el.getAttribute('data-typewriter');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        el.textContent = fullText;
        return;
    }

    el.textContent = '';
    let i = 0;

    function tick() {
        if (i <= fullText.length) {
            el.textContent = fullText.slice(0, i);
            i++;
            setTimeout(tick, 28 + Math.random() * 35);
        }
    }

    setTimeout(tick, 400);
}

/* ---------- copier l'adresse email ---------- */

function initCopyEmail() {
    const btn = document.querySelector('[data-copy-email]');
    const toast = document.querySelector('[data-copy-toast]');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-copy-email');
        try {
            await navigator.clipboard.writeText(email);
            showToast(toast, 'Adresse copiée dans le presse-papiers');
        } catch (err) {
            showToast(toast, 'Copie impossible — sélectionnez le texte manuellement');
        }
    });
}

function showToast(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- compteur d'abonnés YouTube (en direct) ---------- */

async function initYouTubeSubs() {
    const el = document.getElementById('yt-subs');
    if (!el) return;

    if (!YT_CONFIG.apiKey || YT_CONFIG.apiKey === 'VOTRE_CLE_API_ICI') {
        // Pas de clé configurée : on laisse le texte manuel tel quel.
        return;
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(YT_CONFIG.handle)}&key=${YT_CONFIG.apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Réponse API invalide');

        const data = await res.json();
        const stats = data.items && data.items[0] && data.items[0].statistics;

        if (!stats) throw new Error('Chaîne introuvable');

        if (stats.hiddenSubscriberCount) {
            el.textContent = 'compteur masqué';
        } else {
            const count = parseInt(stats.subscriberCount, 10);
            el.textContent = new Intl.NumberFormat('fr-FR').format(count) + ' abonnés';
        }
        el.classList.remove('placeholder');
    } catch (err) {
        // En cas d'échec (quota, clé invalide, hors ligne...) on garde un texte propre.
        el.textContent = 'indisponible';
    }
}
