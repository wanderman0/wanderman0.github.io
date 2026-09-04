// ============================================================
// wanderman0 — page behavior
// ============================================================

// YouTube Data API v3 key — see console.cloud.google.com
// (Library > YouTube Data API v3 > Credentials > Create API key,
// then restrict it to your domain and to this API only)
const YT_CONFIG = {
    apiKey: 'AIzaSyBtc4Zjj7scvXGVchpFNmiGuH96myeNVJo',
    handle: '@wanderman_0'
};

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initCopyEmail();
    initYouTubeSubs();
});

/* ---------- typewriter effect on the tagline ---------- */

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

/* ---------- copy email address ---------- */

function initCopyEmail() {
    const btn = document.querySelector('[data-copy-email]');
    const toast = document.querySelector('[data-copy-toast]');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-copy-email');
        try {
            await navigator.clipboard.writeText(email);
            showToast(toast, 'Copied to clipboard');
        } catch (err) {
            showToast(toast, 'Could not copy — please select the text manually');
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

/* ---------- live YouTube subscriber count ---------- */

async function initYouTubeSubs() {
    const el = document.getElementById('yt-subs');
    if (!el) return;

    if (!YT_CONFIG.apiKey || YT_CONFIG.apiKey === 'VOTRE_CLE_API_ICI') {
        // No key configured yet: leave the manual text as is.
        return;
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(YT_CONFIG.handle)}&key=${YT_CONFIG.apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Invalid API response');

        const data = await res.json();
        const stats = data.items && data.items[0] && data.items[0].statistics;

        if (!stats) throw new Error('Channel not found');

        if (stats.hiddenSubscriberCount) {
            el.textContent = 'count hidden';
        } else {
            const count = parseInt(stats.subscriberCount, 10);
            el.textContent = new Intl.NumberFormat('en-US').format(count) + ' subscribers';
        }
        el.classList.remove('placeholder');
    } catch (err) {
        // On failure (quota, invalid key, offline...) keep a clean fallback.
        el.textContent = 'unavailable';
    }
}
