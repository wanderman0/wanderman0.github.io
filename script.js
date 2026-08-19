// ============================================================
// wanderman0 — comportements de la page
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initCopyEmail();
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
