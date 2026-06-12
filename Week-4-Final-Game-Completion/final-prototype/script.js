// ── Safe storage wrapper ───────────────────────────
// localStorage can throw (private mode, sandboxed iframe, blocked cookies).
// If it does, we fall back to an in-memory store so the game + leaderboard
// keep working for the current session instead of the whole script crashing.
const safeStorage = (function () {
    const memory = {};
    let usable = false;
    try {
        const k = '__phishHuntTest__';
        window.localStorage.setItem(k, '1');
        window.localStorage.removeItem(k);
        usable = true;
    } catch (e) {
        usable = false;
    }
    return {
        get(key) {
            try {
                return usable ? window.localStorage.getItem(key) : (memory[key] ?? null);
            } catch (e) {
                return memory[key] ?? null;
            }
        },
        set(key, value) {
            try {
                if (usable) window.localStorage.setItem(key, value);
                else memory[key] = value;
            } catch (e) {
                memory[key] = value;
            }
        }
    };
})();

// Default leaderboard entries — shown until real scores are saved,
// so the board always "shows the data" instead of looking empty.
const DEFAULT_LEADERBOARD = [
    { name: 'PhishHunter', score: 40, date: '12 May 2026' },
    { name: 'SafeSurfer',  score: 35, date: '10 May 2026' },
    { name: 'ScamSpotter', score: 30, date: '08 May 2026' },
    { name: 'NetGuardian', score: 25, date: '05 May 2026' },
    { name: 'ClickCareful', score: 20, date: '02 May 2026' }
];

// ── Core game configuration ────────────────────────
// Exactly 8 questions per session (one per dynamic scenario).
const TOTAL_ROUNDS = 8;
const POINTS_PER_CORRECT = 5;
const MAX_SCORE = TOTAL_ROUNDS * POINTS_PER_CORRECT; // 40

// Game State Variables
let gameState = {
    phase: 'menu',
    currentRound: 0,
    score: 0,
    timeLeft: 10,
    selectedAnswer: null,
    isCorrect: null,
    highScore: parseInt(safeStorage.get('phishHuntHighScore') || '0'),
    isTimeout: false,
    streak: 0,
    maxStreak: 0,
    correctAnswers: 0,
    scenarios: [],
    selectedOption: 'safe',
    // accessibility + audio preferences (persisted)
    ttsEnabled: safeStorage.get('phishHuntVoice') === '1',
    soundEnabled: safeStorage.get('phishHuntSound') !== '0', // default ON
    urgent: false
};

let timerInterval = null;
let leaderboard = [];

// ── Level helpers (4 difficulty tiers × 2 rounds each = 8) ──────
// Every card now gets exactly 30 seconds; the tiers stay for flavour /
// progression labelling. The under-5s "urgency" trigger still fires.
function getLevel(roundIndex) {
    if (roundIndex < 2) return { name: 'Easy',   color: '#4ade80', time: 30, num: 1 };
    if (roundIndex < 4) return { name: 'Medium', color: '#fbbf24', time: 30, num: 2 };
    if (roundIndex < 6) return { name: 'Hard',   color: '#fb923c', time: 30, num: 3 };
    return                     { name: 'Expert', color: '#f87171', time: 30, num: 4 };
}

// ── Scenario type detection ────────────────────────
// Prefer the explicit `channel` on a variant; fall back to title parsing.
// emoji metadata moved to emoji.js

// ── Brand logos (inline SVG — recognisable, no network/image files) ──
// Stylised, brand-coloured marks for an educational anti-phishing context.
const BRAND_LOGOS = {
    // NHS: official blue box with white italic bold text
    nhs: '<svg viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg" aria-label="NHS"><rect width="80" height="32" rx="3" fill="#005EB8"/><text x="40" y="24" font-family="Arial Black,Arial,sans-serif" font-style="italic" font-weight="900" font-size="22" letter-spacing="2" fill="#ffffff" text-anchor="middle">NHS</text></svg>',
    // Temu: orange rounded pill with "temu" wordmark
    temu: '<svg viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" aria-label="Temu"><rect width="100" height="32" rx="6" fill="#F97316"/><text x="50" y="22" font-family="Arial,sans-serif" font-weight="900" font-size="19" fill="#fff" text-anchor="middle">temu</text></svg>',
    // HMRC: UK government crown + HMRC text (black on white, matches gov.uk branding)
    hmrc: '<svg viewBox="0 0 138 36" xmlns="http://www.w3.org/2000/svg" aria-label="HMRC"><g fill="#0b0c0c"><path d="M6 28 L6 22 L9 17 L13 22 L20 12 L27 22 L31 17 L34 22 L34 28 Z"/><rect x="6" y="28" width="28" height="4" rx="1"/><circle cx="9" cy="16" r="2.2"/><circle cx="20" cy="11" r="2.5"/><circle cx="31" cy="16" r="2.2"/></g><text x="93" y="27" font-family="Arial,sans-serif" font-weight="700" font-size="18" fill="#0b0c0c" text-anchor="middle">HMRC</text></svg>',
    // Royal Mail: red background, concentric yellow/red rings, "Royal Mail" wordmark
    royalmail: '<svg viewBox="0 0 128 32" xmlns="http://www.w3.org/2000/svg" aria-label="Royal Mail"><rect width="128" height="32" rx="4" fill="#D71920"/><circle cx="18" cy="16" r="12" fill="#FFCD00"/><circle cx="18" cy="16" r="8" fill="#D71920"/><circle cx="18" cy="16" r="4" fill="#FFCD00"/><text x="77" y="21" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">Royal Mail</text></svg>',
    // DVLA: DVLA green bar — matches gov.uk green
    dvla: '<svg viewBox="0 0 88 32" xmlns="http://www.w3.org/2000/svg" aria-label="DVLA"><rect width="88" height="32" rx="3" fill="#00703C"/><text x="44" y="22" font-family="Arial,sans-serif" font-weight="800" font-size="16" letter-spacing="2.5" fill="#fff" text-anchor="middle">DVLA</text></svg>',
    // GOV.UK: UK government crown + GOV.UK text (black on white)
    gov: '<svg viewBox="0 0 128 36" xmlns="http://www.w3.org/2000/svg" aria-label="GOV.UK"><g fill="#0b0c0c"><path d="M6 28 L6 22 L9 17 L13 22 L20 12 L27 22 L31 17 L34 22 L34 28 Z"/><rect x="6" y="28" width="28" height="4" rx="1"/><circle cx="9" cy="16" r="2.2"/><circle cx="20" cy="11" r="2.5"/><circle cx="31" cy="16" r="2.2"/></g><text x="86" y="27" font-family="Arial,sans-serif" font-weight="700" font-size="17" fill="#0b0c0c" text-anchor="middle">GOV.UK</text></svg>',
    // PayPal: white card, dark-blue "Pay" + light-blue "Pal" italic bold
    paypal: '<svg viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal"><rect width="100" height="32" rx="5" fill="#fff" stroke="#e5e7eb" stroke-width="1.5"/><text x="13" y="23" font-family="Arial,Helvetica,sans-serif" font-style="italic" font-weight="900" font-size="18" fill="#003087">Pay</text><text x="52" y="23" font-family="Arial,Helvetica,sans-serif" font-style="italic" font-weight="900" font-size="18" fill="#009CDE">Pal</text></svg>',
    // Visa: white card, deep-blue italic VISA wordmark
    visa: '<svg viewBox="0 0 84 32" xmlns="http://www.w3.org/2000/svg" aria-label="Visa"><rect width="84" height="32" rx="4" fill="#fff" stroke="#e5e7eb" stroke-width="1.5"/><text x="42" y="24" font-family="Arial Black,Arial,sans-serif" font-style="italic" font-weight="900" font-size="21" letter-spacing="2" fill="#1A1F71" text-anchor="middle">VISA</text></svg>',
    // Mastercard: two overlapping circles (red + amber) with orange overlap
    mastercard: '<svg viewBox="0 0 70 36" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard"><rect width="70" height="36" rx="5" fill="#fff" stroke="#e5e7eb" stroke-width="1.5"/><circle cx="27" cy="18" r="11" fill="#EB001B"/><circle cx="43" cy="18" r="11" fill="#F79E1B"/><path d="M35 8.8 A11 11 0 0 1 35 27.2 A11 11 0 0 1 35 8.8 Z" fill="#FF5F00"/></svg>',
    // Barclays: dark-navy, stylised eagle mark (three swept feather shapes) + wordmark
    barclays: '<svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="Barclays"><rect width="120" height="32" rx="4" fill="#00395D"/><g fill="#1BB0E2" transform="translate(6,3)"><path d="M13 1 Q10 8 11 14 Q12 20 13 26 Q14 20 15 14 Q16 8 13 1Z"/><path d="M5 5 Q9 9 13 13 Q9 11 6 14 Q3 16 5 20 Q1 16 2 10 Q3 6 5 5Z"/><path d="M21 5 Q17 9 13 13 Q17 11 20 14 Q23 16 21 20 Q25 16 24 10 Q23 6 21 5Z"/></g><text x="74" y="21" font-family="Arial,sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle">Barclays</text></svg>',
    // HSBC: white card, red hexagon mark (4-triangle split: top & bottom = red, left & right = white) + HSBC text
    hsbc: '<svg viewBox="0 0 104 32" xmlns="http://www.w3.org/2000/svg" aria-label="HSBC"><rect width="104" height="32" rx="4" fill="#fff" stroke="#e5e7eb" stroke-width="1.5"/><g transform="translate(5,6)"><rect width="20" height="20" fill="#DB0011"/><polygon points="0,0 20,0 10,10" fill="#fff"/><polygon points="0,20 20,20 10,10" fill="#fff"/></g><text x="64" y="22" font-family="Arial,sans-serif" font-weight="800" font-size="15" letter-spacing="1" fill="#000" text-anchor="middle">HSBC</text></svg>',
    // Spotify: green circle, three white curved sound-wave arcs
    spotify: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-label="Spotify"><circle cx="16" cy="16" r="15.5" fill="#1DB954"/><path d="M8 13c5.5-1.8 12-1.2 16 1.7" stroke="#fff" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M9 17.5c4.5-1.3 9.5-0.8 13 1.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M10.5 22c3.2-0.9 7-0.5 9.5 1.1" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
    // Amazon: dark background, white "amazon" wordmark, orange smile arrow with arrowhead
    amazon: '<svg viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon"><rect width="100" height="32" rx="4" fill="#232F3E"/><text x="50" y="18" font-family="Arial,sans-serif" font-weight="700" font-size="15" fill="#fff" text-anchor="middle">amazon</text><path d="M28 25 Q50 33 72 25" stroke="#FF9900" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M69 22 L73 25 L70 28.5" stroke="#FF9900" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    // Netflix: black card, red stylised N (two columns with diagonal cut)
    netflix: '<svg viewBox="0 0 46 34" xmlns="http://www.w3.org/2000/svg" aria-label="Netflix"><rect width="46" height="34" rx="4" fill="#000"/><path d="M9 4 L9 30 L16 30 L23 16 L23 30 L37 30 L37 4 L30 4 L23 18 L23 4 Z" fill="#E50914"/></svg>',
    // Apple: light card, black Apple logo silhouette
    apple: '<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-label="Apple"><rect width="34" height="34" rx="7" fill="#f1f5f9"/><path fill="#1c1c1e" d="M24.5 21c-.1 3.2-2.8 4.4-3 4.5-1.3.6-2.1.6-3 .2-1-.4-1.7-.4-2.6 0-1 .4-2.1.4-3.1-.3-2.6-2-4.3-6.6-2.2-9.6.9-1.4 2.2-2.3 3.5-2.3 1 0 1.8.4 2.5.4.7 0 2-.5 3.4-.5 1.5.1 2.7.8 3.5 2a3.9 3.9 0 0 0-2 3.6zm-4.5-8c.6-.8 1-1.8 1-2.8-1 .1-2.2.7-2.9 1.5-.7.7-1.2 1.8-1 2.8 1 0 2.1-.6 2.9-1.5z"/></svg>',
    // WhatsApp: green circle, white speech-bubble phone icon
    whatsapp: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-label="WhatsApp"><circle cx="16" cy="16" r="15.5" fill="#25D366"/><path fill="#fff" d="M16 7.5a8.4 8.4 0 00-7.2 12.7L7.5 25l4.9-1.3A8.4 8.4 0 1016 7.5zm0 1.7a6.7 6.7 0 11-3.5 12.4l-.4-.2-2.5.7.7-2.4-.2-.4A6.7 6.7 0 0116 9.2zm-2.7 3.1c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.6 2 .7 2.4.6 2.8.5.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.4l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.2.2-.4.1-.5-.2-1.3-.5-2-1.2-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4l.3-.4.2-.4v-.3l-.7-1.6c-.2-.4-.3-.4-.5-.4z"/></svg>',
    // Bank card: generic chip card with dual-circle contactless mark
    bank: '<svg viewBox="0 0 56 34" xmlns="http://www.w3.org/2000/svg" aria-label="Bank card"><rect x="1" y="2" width="54" height="30" rx="5" fill="#334155"/><rect x="1" y="9" width="54" height="8" fill="#1e293b"/><rect x="6" y="24" width="22" height="5" rx="2" fill="#94a3b8"/><circle cx="44" cy="24" r="4.5" fill="#374151"/><circle cx="50" cy="24" r="4.5" fill="#475569" opacity="0.8"/></svg>',
    // Claim: generic grey person silhouette (unknown sender)
    claim: '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-label="Unknown sender"><circle cx="18" cy="18" r="18" fill="#94a3b8"/><circle cx="18" cy="13" r="6" fill="#fff"/><path d="M6 31 C6 24 30 24 30 31Z" fill="#fff"/></svg>',
    // Epic Games: dark card, white stylised "E" mark
    epic: '<svg viewBox="0 0 96 32" xmlns="http://www.w3.org/2000/svg" aria-label="Epic Games"><rect width="96" height="32" rx="5" fill="#2a2a2a"/><rect x="8" y="6" width="16" height="20" rx="3" fill="#fff"/><rect x="12" y="9" width="9" height="2.4" fill="#2a2a2a"/><rect x="12" y="14.8" width="7" height="2.4" fill="#2a2a2a"/><rect x="12" y="20.6" width="9" height="2.4" fill="#2a2a2a"/><text x="58" y="21" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#fff" text-anchor="middle">EPIC</text></svg>',
    // Discord: blurple pill with white game-controller-style face mark
    discord: '<svg viewBox="0 0 110 32" xmlns="http://www.w3.org/2000/svg" aria-label="Discord"><rect width="110" height="32" rx="8" fill="#5865F2"/><g fill="#fff" transform="translate(8,8)"><path d="M14 2 C9 1 5 1 0 2 C-2 7 -2 12 0 16 C2 17 4 18 5 18 L6 16 C5 15.6 4 15 4 15 C4 15 8 17 14 15 C14 15 13 15.6 12 16 L13 18 C14 18 16 17 18 16 C20 12 20 7 18 2 C13 1 14 2 14 2 Z" /><circle cx="6" cy="9.5" r="1.8" fill="#5865F2"/><circle cx="12" cy="9.5" r="1.8" fill="#5865F2"/></g><text x="74" y="21" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">Discord</text></svg>',
    // Instagram: rounded square with the warm gradient + camera outline
    instagram: '<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram"><defs><radialGradient id="igG" cx="28%" cy="100%" r="120%"><stop offset="0%" stop-color="#FDC468"/><stop offset="32%" stop-color="#F56040"/><stop offset="62%" stop-color="#C13584"/><stop offset="100%" stop-color="#4F5BD5"/></radialGradient></defs><rect width="34" height="34" rx="9" fill="url(#igG)"/><rect x="8" y="8" width="18" height="18" rx="6" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="17" cy="17" r="4.6" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="22.6" cy="11.4" r="1.5" fill="#fff"/></svg>',
    // Steam: dark navy circle with white interlocked clutch/ball mark
    steam: '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-label="Steam"><circle cx="18" cy="18" r="18" fill="#1b2838"/><circle cx="22.5" cy="12.5" r="5.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="11.5" cy="22.5" r="4" fill="#fff"/><line x1="13.5" y1="20" x2="20" y2="14" stroke="#fff" stroke-width="1.8"/></svg>',
    // School: navy shield/crest with a white open-book mark
    school: '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-label="School"><path d="M18 2 L32 7 V18 C32 27 26 32 18 35 C10 32 4 27 4 18 V7 Z" fill="#1e3a8a"/><path d="M18 12 C15 10 11 10 9 11 V24 C11 23 15 23 18 25 C21 23 25 23 27 24 V11 C25 10 21 10 18 12 Z" fill="#fff"/><line x1="18" y1="12" x2="18" y2="25" stroke="#1e3a8a" stroke-width="1.4"/></svg>'
};

// audio assets and playback engine moved to audio.js

// Convenience wrappers used around the game loop
function playSafeSound()      { audioEngine.playSafe(); }
function playScamSound()      { audioEngine.playScam(); }
function playIncorrectSound() { audioEngine.playIncorrect(); }
function playTimeoutSound()   { audioEngine.playTimeout(); }

// Volume slider callback — adjusts master vol and keeps both sliders in sync
function setVolume(level) {
    audioEngine.setMasterVolume(level);
    document.querySelectorAll('.vol-slider').forEach(s => { s.value = Math.round(level * 100); });
}

// ════════════════════════════════════════════════════════════
//  VOICE ENGINE — Web Speech API (Text-to-Speech)
//  Narrates the round number, source header, message, and the
//  feedback lesson / red flags. Always cancels prior speech before a
//  new narration so lines never overlap.
// ════════════════════════════════════════════════════════════
const voiceEngine = (function () {
    const supported = 'speechSynthesis' in window;
    let voice = null;

    function pickVoice() {
        if (!supported) return;
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return;
        voice = voices.find(v => /en[-_]GB/i.test(v.lang)) ||
                voices.find(v => /^en/i.test(v.lang)) ||
                voices[0];
    }
    if (supported) {
        pickVoice();
        window.speechSynthesis.onvoiceschanged = pickVoice;
    }

    function cancel() {
        if (supported) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    }

    // Speak an array of lines as a single, queued narration.
    function narrate(lines) {
        if (!supported || !gameState.ttsEnabled) return;
        cancel();
        (Array.isArray(lines) ? lines : [lines])
            .filter(Boolean)
            .forEach((line, idx) => {
                const u = new SpeechSynthesisUtterance(String(line));
                if (voice) u.voice = voice;
                u.lang = (voice && voice.lang) || 'en-GB';
                u.rate = 0.96;
                u.pitch = 1.0;
                if (idx > 0) u.text = ' ' + u.text;
                window.speechSynthesis.speak(u);
            });
    }

    return { supported, narrate, cancel };
})();

// Mirror text into the polite screen-reader live region (baseline a11y,
// independent of the optional Voice Mode).
function announce(text) {
    const region = document.getElementById('srAnnouncer');
    if (region) region.textContent = text;
}

function updateLevelUI(roundIndex) {
    const level = getLevel(roundIndex);
    const nameEl = document.getElementById('levelName');
    const dotEl  = document.getElementById('levelDot');
    const badge  = document.getElementById('levelBadge');
    if (nameEl) nameEl.textContent = level.name;
    if (dotEl)  dotEl.style.background = level.color;
    if (badge) {
        badge.classList.remove('level-changed');
        void badge.offsetWidth;
        badge.classList.add('level-changed');
    }

    // Segment bar: 4 segments for rounds 0-1, 2-3, 4-5, 6-7
    const segs = [
        { id: 'lsbEasy',   min: 0, max: 1 },
        { id: 'lsbMed',    min: 2, max: 3 },
        { id: 'lsbHard',   min: 4, max: 5 },
        { id: 'lsbExpert', min: 6, max: 7 },
    ];
    segs.forEach(seg => {
        const el = document.getElementById(seg.id);
        if (!el) return;
        el.classList.remove('lsb-active', 'lsb-done');
        if (roundIndex >= seg.min && roundIndex <= seg.max) el.classList.add('lsb-active');
        else if (roundIndex > seg.max) el.classList.add('lsb-done');
    });
}

function showLevelUpToast(roundIndex) {
    const prev = getLevel(roundIndex - 1);
    const curr = getLevel(roundIndex);
    if (curr.num <= prev.num) return;
    const toast = document.getElementById('levelUpToast');
    const text  = document.getElementById('levelUpText');
    if (!toast || !text) return;
    text.textContent = `⬆️ Level ${curr.num}: ${curr.name} — ${curr.time}s per round`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Streak helpers ─────────────────────────────────
function updateStreakUI() {
    const countEl   = document.getElementById('streakCount');
    const displayEl = document.getElementById('streakDisplay');
    if (countEl) countEl.textContent = gameState.streak;
    if (displayEl) {
        if (gameState.streak >= 3) {
            displayEl.classList.add('on-fire');
        } else {
            displayEl.classList.remove('on-fire');
        }
    }
}

// ── Button selection (pre-highlight before confirm) ───
function setSelection(option, fromUser) {
    gameState.selectedOption = option;
    const safe = document.getElementById('btnSafe');
    const scam = document.getElementById('btnScam');
    if (safe) safe.classList.toggle('btn-selected', option === 'safe');
    if (scam) scam.classList.toggle('btn-selected', option === 'scam');
}

// Instructions modal
function openInstructions() {
    const modal = document.getElementById('instructionsModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeInstructionsBtn() {
    const modal = document.getElementById('instructionsModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function closeInstructions(event) {
    if (event.target === event.currentTarget) {
        closeInstructionsBtn();
    }
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    showPhase('menu');
    updateHighScoreDisplay();

    // Enter key for leaderboard name input
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveToLeaderboard();
        });
    }

    // Initialise audio + voice toggle controls
    initToggles();

    // Prime the menu soundtrack. Actual playback is deferred until the
    // first user gesture (browser autoplay policy) — we unlock once below.
    audioEngine.init();
    if (gameState.soundEnabled) audioEngine.playMenuMusic();
    const _unlockAudioOnce = function () {
        audioEngine.unlock();
        window.removeEventListener('pointerdown', _unlockAudioOnce);
        window.removeEventListener('keydown', _unlockAudioOnce);
        window.removeEventListener('touchstart', _unlockAudioOnce);
    };
    window.addEventListener('pointerdown', _unlockAudioOnce);
    window.addEventListener('keydown', _unlockAudioOnce);
    window.addEventListener('touchstart', _unlockAudioOnce);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (document.activeElement.tagName === 'INPUT') return;

        if (gameState.phase === 'playing') {
            if (e.key === 'ArrowLeft')       { e.preventDefault(); setSelection('safe', true); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); setSelection('scam', true); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAnswer(gameState.selectedOption); }
        } else if (e.key === 'Enter' || e.key === ' ') {
            // Don't hijack Enter/Space when a control button is focused.
            if (document.activeElement.tagName === 'BUTTON') return;
            // NOTE: the menu intentionally does NOT start on a bare key press —
            // the game launches only from the Start Fishing! button.
            if (gameState.phase === 'feedback') { e.preventDefault(); document.getElementById('continueBtn').click(); }
            else if (gameState.phase === 'gameOver') { e.preventDefault(); tryPlayAgain(); }
        }
    });

    // Treat a tap/click on any control (button, input, leaderboard panel,
    // settings) as "not a tap-to-advance" so it never triggers the game.
    function isInteractive(target) {
        return !!(target.closest && target.closest('button, input, a, .menu-leaderboard-panel, .play-controls, .settings-group'));
    }

    // Swipe gestures for mobile
    let _tx = 0, _ty = 0;
    document.addEventListener('touchstart', function(e) {
        _tx = e.touches[0].clientX;
        _ty = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (gameState.phase === 'playing') {
            if (isInteractive(e.target)) return;
            const dx = e.changedTouches[0].clientX - _tx;
            const dy = e.changedTouches[0].clientY - _ty;
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
            handleAnswer(dx < 0 ? 'safe' : 'scam');
        } else {
            const adx = Math.abs(e.changedTouches[0].clientX - _tx);
            const ady = Math.abs(e.changedTouches[0].clientY - _ty);
            if (adx < 15 && ady < 15) {
                if (isInteractive(e.target)) return;
                // Menu does NOT start on a background tap — Start Fishing! only.
                if (gameState.phase === 'feedback') document.getElementById('continueBtn').click();
                else if (gameState.phase === 'gameOver') tryPlayAgain();
            }
        }
    }, { passive: true });

    // The menu deliberately has NO click-to-start handler: the game launches
    // only from the Start Fishing! button, so clicking the background scenery
    // does nothing.

    document.getElementById('feedbackPhase').addEventListener('click', function(e) {
        if (gameState.phase !== 'feedback') return;
        if (isInteractive(e.target)) return;
        document.getElementById('continueBtn').click();
    });

    document.getElementById('gameOverPhase').addEventListener('click', function(e) {
        if (gameState.phase !== 'gameOver') return;
        if (isInteractive(e.target)) return;
        tryPlayAgain();
    });
});

// Phase Management
function showPhase(phaseName) {
    const phases = ['menu', 'playing', 'feedback', 'gameOver'];
    phases.forEach(phase => {
        const el = document.getElementById(phase + 'Phase');
        if (el) el.classList.remove('active');
    });

    const activePhase = document.getElementById(phaseName + 'Phase');
    if (activePhase) activePhase.classList.add('active');

    // Leaving the playing phase: make sure the urgency visual/audio is cleared
    if (phaseName !== 'playing') setUrgency(false);

    // Toggle ocean skin on card
    const card = document.getElementById('gameCard');
    if (card) {
        if (phaseName === 'menu') card.classList.add('on-menu');
        else card.classList.remove('on-menu');
    }

    gameState.phase = phaseName;
}

// Play Again guard — requires name saved if score > 0
function tryPlayAgain() {
    const nameInputBox = document.getElementById('nameInputBox');
    if (nameInputBox && nameInputBox.style.display !== 'none') {
        const input = document.getElementById('playerNameInput');
        if (input) {
            input.focus();
            input.classList.remove('input-shake');
            void input.offsetWidth;
            input.classList.add('input-shake');
        }
        return;
    }
    startGame();
}

// Abandon the current session and return to the title screen.
// Used by the in-game "← Back to Menu" button and the game-over "Home Screen".
function returnToMenu() {
    // Stop the round cold
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    setUrgency(false);
    voiceEngine.cancel();

    // Reset session progress (keeps high score + saved leaderboard)
    gameState.phase = 'menu';
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.correctAnswers = 0;
    gameState.selectedAnswer = null;
    gameState.selectedOption = 'safe';
    gameState.isCorrect = null;
    gameState.isTimeout = false;
    gameState.urgent = false;
    gameState.scenarios = [];

    // Swap the soundtrack back to the menu loop (plays only if Sound is ON)
    audioEngine.playMenuMusic();

    showPhase('menu');
    updateHighScoreDisplay();

    // Tidy up any open menu leaderboard panel state
    const panel = document.getElementById('menuLeaderboardPanel');
    if (panel) panel.style.display = 'none';
}

function backToMenu() { returnToMenu(); }
function goHome()     { returnToMenu(); }

// Fisher-Yates shuffle helper
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Build the per-session deck from the dynamic scenario pool.
// For EACH of the 8 scenarios, a 50/50 coin-flip picks its SAFE or SCAM
// variant — so the same theme can be either answer across sessions.
function buildDynamicDeck() {
    return shuffle(dynamicScenarios).map(scenario => {
        const showScam = Math.random() < 0.5;
        const variant  = showScam ? scenario.scamVariant : scenario.safeVariant;
        // Flatten the chosen variant into a round object the loop understands.
        return Object.assign({}, variant, {
            id: scenario.id,
            topic: scenario.topic,
            variant: showScam ? 'scam' : 'safe'
        });
    });
}

// Start Game Function
function startGame() {
    // Coin-flip each scenario → an 8-question deck.
    const deck = buildDynamicDeck();

    gameState = {
        ...gameState,
        phase: 'playing',
        currentRound: 0,
        score: 0,
        timeLeft: 30,
        selectedAnswer: null,
        isCorrect: null,
        isTimeout: false,
        streak: 0,
        maxStreak: 0,
        correctAnswers: 0,
        urgent: false,
        scenarios: deck
    };

    // This runs inside the Start Fishing! click, so audio is unlocked here.
    audioEngine.unlock();
    if (gameState.soundEnabled) audioEngine.playGameMusic();

    showPhase('playing');
    updateLevelUI(0);
    updateStreakUI();
    loadRound();
}

// Load Current Round
function loadRound() {
    const scenario = gameState.scenarios[gameState.currentRound];
    const level    = getLevel(gameState.currentRound);

    // Populate card content
    document.getElementById('roundDisplay').textContent = gameState.currentRound + 1;
    document.getElementById('currentScore').textContent = gameState.score;
    document.getElementById('scenarioTitle').textContent = scenario.title;
    document.getElementById('scenarioMessage').textContent = scenario.message;

    // Card type icon + label
    const meta = getScenarioMeta(scenario);
    const iconEl  = document.getElementById('cardTypeIcon');
    const labelEl = document.getElementById('cardTypeLabel');
    if (iconEl)  iconEl.textContent = meta.icon;
    if (labelEl) labelEl.textContent = meta.label;

    // Brand logo (replaces the emoji icon when available) + fake verified tick
    const logoEl     = document.getElementById('brandLogo');
    const verifiedEl = document.getElementById('brandVerified');
    const brandSvg   = scenario.brand && BRAND_LOGOS[scenario.brand];
    if (logoEl) {
        if (brandSvg) {
            logoEl.innerHTML = brandSvg;
            logoEl.style.display = 'inline-flex';
            if (iconEl) iconEl.style.display = 'none';
        } else {
            logoEl.innerHTML = '';
            logoEl.style.display = 'none';
            if (iconEl) iconEl.style.display = '';
        }
    }
    if (verifiedEl) verifiedEl.style.display = scenario.verified ? 'inline-flex' : 'none';

    // QR badge
    const qrBadge = document.getElementById('qrBadge');
    if (qrBadge) qrBadge.style.display = scenario.category === 'qr' ? 'inline-flex' : 'none';

    // Card enter animation
    const card = document.getElementById('scenarioCard');
    if (card) {
        card.classList.remove('card-enter', 'card-exit-left', 'card-exit-right', 'card-timeout');
        void card.offsetWidth; // reflow
        card.classList.add('card-enter');
    }

    // Level + streak UI
    updateLevelUI(gameState.currentRound);
    updateStreakUI();

    // Default selection to SAFE each new round (no sound for the auto-default)
    setSelection('safe');

    // Reset timer urgency
    setUrgency(false);

    // Screen-reader announcement (always) + optional Voice Mode narration
    const headerSpoken = meta.label + (scenario.title ? (', ' + scenario.title) : '');
    announce('Round ' + (gameState.currentRound + 1) + ' of ' + TOTAL_ROUNDS + '. ' + headerSpoken + '.');
    voiceEngine.narrate([
        'Round ' + (gameState.currentRound + 1) + ' of ' + TOTAL_ROUNDS + '.',
        headerSpoken + '.',
        scenario.message,
        'Is this safe, or a scam?'
    ]);

    // Timer — duration depends on level
    gameState.timeLeft = level.time;
    updateTimer();
    startTimer();
}

// ── Timer urgency (under 5 seconds) ─────────────────
// Drives both the audio tempo pickup and the timer-bar visual.
function setUrgency(on) {
    on = !!on;
    if (gameState.urgent === on) return;
    gameState.urgent = on;
    audioEngine.setUrgent(on);
    const bar  = document.querySelector('.timer-bar');
    const prog = document.getElementById('timerProgress');
    const clk  = document.querySelector('.timer-clock');
    if (bar)  bar.classList.toggle('urgent', on);
    if (prog) prog.classList.toggle('urgent', on);
    if (clk)  clk.classList.toggle('urgent', on);
}

// Timer Functions
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();

        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimer() {
    const level = getLevel(gameState.currentRound);
    document.getElementById('timeLeft').textContent = gameState.timeLeft + 's';
    const percentage = Math.max(0, (gameState.timeLeft / level.time) * 100);
    document.getElementById('timerProgress').style.width = percentage + '%';
    // Urgency kicks in when fewer than 5 seconds remain.
    setUrgency(gameState.timeLeft > 0 && gameState.timeLeft < 5);
}

function handleTimeout() {
    gameState.isTimeout = true;
    gameState.selectedAnswer = null;
    gameState.isCorrect = null;
    gameState.streak = 0;
    setUrgency(false);
    playTimeoutSound();
    voiceEngine.cancel();

    // Shake animation
    const card = document.getElementById('scenarioCard');
    if (card) {
        card.classList.add('card-timeout');
    }

    setTimeout(() => {
        showPhase('feedback');
        showFeedback();
    }, 360);
}

// Handle Answer
function handleAnswer(answer) {
    if (gameState.phase !== 'playing') return;

    // Lock immediately so keyboard can't double-fire
    gameState.phase = 'animating';
    clearInterval(timerInterval);
    setUrgency(false);
    voiceEngine.cancel();

    const scenario = gameState.scenarios[gameState.currentRound];
    const correct  = answer === scenario.type;

    gameState.selectedAnswer = answer;
    gameState.isCorrect      = correct;
    gameState.isTimeout      = false;

    if (correct) {
        gameState.score += POINTS_PER_CORRECT;
        gameState.correctAnswers++;
        gameState.streak++;
        if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;
    } else {
        gameState.streak = 0;
        // Buzzer fires just after the choice cue so the two don't muddy together
        setTimeout(playIncorrectSound, 140);
    }

    // Brief keyboard flash on button
    const btn = document.getElementById(answer === 'safe' ? 'btnSafe' : 'btnScam');
    if (btn) {
        btn.classList.add('kb-active');
        setTimeout(() => btn.classList.remove('kb-active'), 180);
    }

    // Animate card exit immediately (always, regardless of which SFX plays)
    const card = document.getElementById('scenarioCard');
    if (card) {
        card.classList.add(answer === 'safe' ? 'card-exit-left' : 'card-exit-right');
    }

    // Choice SFX + transition:
    //   SAFE  — play chime, show feedback after card-exit animation (260 ms).
    //   SCAM  — play sting, show scam explanation only after the SFX ends.
    if (answer === 'safe') {
        playSafeSound();
        setTimeout(() => { showPhase('feedback'); showFeedback(); }, 260);
    } else {
        audioEngine.playScamThen(() => { showPhase('feedback'); showFeedback(); });
    }
}

// Show Feedback
function showFeedback() {
    const scenario = gameState.scenarios[gameState.currentRound];
    const resultHeader = document.getElementById('resultHeader');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const animationContainer = document.getElementById('animationContainer');
    const explanationBox = document.getElementById('explanationBox');
    const feedbackScoreDisplay = document.getElementById('feedbackScoreDisplay');
    const continueBtn = document.getElementById('continueBtn');

    // Clear previous classes
    resultHeader.className = 'result-header';
    resultTitle.className = 'result-title';

    if (gameState.isTimeout) {
        // Timeout feedback
        resultHeader.classList.add('timeout');
        resultTitle.classList.add('timeout');
        resultEmoji.textContent = '⏰';
        resultTitle.textContent = 'Time\'s Up!';
        resultText.textContent = 'Try again and make your choice faster!';

        animationContainer.innerHTML = '';
        explanationBox.style.display = 'none';
        feedbackScoreDisplay.style.display = 'none';
        const lessonBoxTO = document.getElementById('lessonBox');
        if (lessonBoxTO) lessonBoxTO.style.display = 'none';

        continueBtn.textContent = 'Try Again! ⏱️';
        continueBtn.onclick = retryQuestion;
        continueBtn.className = 'btn btn-full';
        continueBtn.style.background = '#ea580c';

        announce('Time\'s up. Try again and make your choice faster.');
        voiceEngine.narrate(['Time\'s up!', 'Try again and make your choice faster.']);

    } else {
        // Normal feedback
        if (gameState.isCorrect) {
            resultHeader.classList.add('correct');
            resultTitle.classList.add('correct');
            resultEmoji.textContent = '🎉';
            resultTitle.textContent = 'Correct!';

            // Show catch animation for scam
            if (scenario.type === 'scam') {
                animationContainer.innerHTML = `
                    <div class="catch-animation">
                        <div style="font-size: 48px;">🎣</div>
                        <div style="font-size: 32px;">🐟</div>
                        <p style="color: #047857; font-size: 20px; margin-top: 8px;">You caught the phisher!</p>
                    </div>
                `;
            } else {
                animationContainer.innerHTML = '';
            }
        } else {
            resultHeader.classList.add('incorrect');
            resultTitle.classList.add('incorrect');
            resultEmoji.textContent = '😞';
            resultTitle.textContent = 'Not Quite!';

            // Show miss animation
            animationContainer.innerHTML = `
                <div class="miss-animation">
                    <div style="font-size: 48px;">🐟💨</div>
                    <p style="color: #dc2626; font-size: 20px; margin-top: 8px;">The fish got away!</p>
                </div>
            `;
        }

        resultText.textContent = `This message is a ${scenario.type.toUpperCase()}`;

        // Streak feedback banner
        const streakFeedback = document.getElementById('streakFeedback');
        if (streakFeedback) {
            if (gameState.isCorrect && gameState.streak >= 3) {
                streakFeedback.style.display = 'block';
                streakFeedback.textContent = `🔥 ${gameState.streak} in a row! Keep it up!`;
            } else if (!gameState.isCorrect && gameState.streak === 0 && gameState.correctAnswers > 0) {
                streakFeedback.style.display = 'block';
                streakFeedback.textContent = `💔 Streak broken! Stay focused.`;
            } else {
                streakFeedback.style.display = 'none';
            }
        }

        // Show explanation (Red Flags for scams, positive cues for safe messages)
        explanationBox.style.display = 'block';
        const explanationTitle = document.getElementById('explanationTitle');
        const explanationList = document.getElementById('explanationList');

        const redFlags = Array.isArray(scenario.redFlags) ? scenario.redFlags : [];

        if (scenario.type === 'scam') {
            explanationBox.className = 'explanation-box';
            explanationTitle.className = 'explanation-title scam';
            explanationTitle.textContent = '🚩 Red Flags:';

            explanationList.innerHTML = redFlags.map(flag => `
                <li><span style="color: #ef4444;">•</span> <span>${flag}</span></li>
            `).join('');
        } else {
            explanationBox.className = 'explanation-box safe';
            explanationTitle.className = 'explanation-title safe';
            explanationTitle.textContent = '✓ Why it\'s Safe:';

            explanationList.innerHTML = `
                <li><span style="color: #10b981;">•</span> <span>No urgent or threatening language</span></li>
                <li><span style="color: #10b981;">•</span> <span>Legitimate sender and domain</span></li>
                <li><span style="color: #10b981;">•</span> <span>No requests for sensitive information</span></li>
                <li><span style="color: #10b981;">•</span> <span>Clear, professional communication</span></li>
            `;
        }

        // Lesson Box — the key takeaway for this scenario (shown for both variants)
        const lessonBox = document.getElementById('lessonBox');
        const lessonText = document.getElementById('lessonText');
        if (lessonBox && lessonText) {
            if (scenario.lesson) {
                lessonBox.style.display = 'block';
                lessonBox.className = 'lesson-box ' + (scenario.type === 'scam' ? 'scam' : 'safe');
                lessonText.textContent = scenario.lesson;
            } else {
                lessonBox.style.display = 'none';
            }
        }

        // Show score
        feedbackScoreDisplay.style.display = 'block';
        document.getElementById('feedbackScore').textContent = gameState.score;

        // Setup continue button
        continueBtn.className = 'btn btn-primary btn-full';
        continueBtn.style.background = '';
        if (gameState.currentRound < gameState.scenarios.length - 1) {
            continueBtn.textContent = 'Next Round →';
        } else {
            continueBtn.textContent = 'See Results →';
        }
        continueBtn.onclick = nextRound;

        // Screen-reader announcement + optional Voice Mode narration of the result
        const verdict = gameState.isCorrect ? 'Correct.' : 'Not quite.';
        const truth = 'This message is a ' + scenario.type + '.';
        const lines = [verdict, truth];
        if (scenario.type === 'scam' && redFlags.length) {
            lines.push('Red flags: ' + redFlags.join('. ') + '.');
        }
        if (scenario.lesson) lines.push(scenario.lesson);
        announce(verdict + ' ' + truth);
        voiceEngine.narrate(lines);
    }
}

// Retry Question (after timeout)
function retryQuestion() {
    voiceEngine.cancel();
    gameState.isTimeout = false;
    gameState.selectedAnswer = null;
    gameState.isCorrect = null;
    gameState.streak = 0;

    showPhase('playing');
    loadRound();
}

// Next Round
function nextRound() {
    voiceEngine.cancel();
    if (gameState.currentRound < gameState.scenarios.length - 1) {
        const prevRound = gameState.currentRound;
        gameState.currentRound++;
        gameState.selectedAnswer = null;
        gameState.isCorrect = null;
        gameState.isTimeout = false;

        // Announce level-up if level changed
        showLevelUpToast(gameState.currentRound);

        showPhase('playing');
        loadRound();
    } else {
        endGame();
    }
}

// End Game
function endGame() {
    setUrgency(false);
    voiceEngine.cancel();
    // Background music intentionally keeps playing on the results screen
    // (persists while Sound is ON, per spec).

    const newHighScore = Math.max(gameState.score, gameState.highScore);
    gameState.highScore = newHighScore;
    safeStorage.set('phishHuntHighScore', newHighScore.toString());

    document.getElementById('finalScore').textContent = gameState.score;

    // Max streak + accuracy stats
    const maxStreakEl = document.getElementById('maxStreakValue');
    const accuracyEl  = document.getElementById('accuracyValue');
    if (maxStreakEl) maxStreakEl.textContent = gameState.maxStreak;
    if (accuracyEl) {
        const pct = Math.round((gameState.correctAnswers / gameState.scenarios.length) * 100);
        accuracyEl.textContent = pct + '%';
    }

    const newHighScoreBadge = document.getElementById('newHighScoreBadge');
    if (gameState.score === newHighScore && gameState.score > 0) {
        newHighScoreBadge.style.display = 'block';
    } else {
        newHighScoreBadge.style.display = 'none';
    }

    const nameInputBox = document.getElementById('nameInputBox');
    if (gameState.score > 0) {
        nameInputBox.style.display = 'block';
        document.getElementById('playerNameInput').value = '';
    } else {
        nameInputBox.style.display = 'none';
    }

    displayLeaderboard();
    showPhase('gameOver');
}

// Leaderboard Functions
function loadLeaderboard() {
    const saved = safeStorage.get('phishHuntLeaderboard');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                leaderboard = parsed;
                return;
            }
        } catch (err) {
            console.warn('Leaderboard data corrupted, resetting.', err);
        }
    }
    // No saved scores yet — seed with defaults so the board shows data.
    leaderboard = [...DEFAULT_LEADERBOARD];
}

function toggleMenuLeaderboard() {
    const panel = document.getElementById('menuLeaderboardPanel');
    if (!panel) return;

    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
        renderMenuLeaderboard(panel);
    }
}

function renderMenuLeaderboard(panel) {
    if (!panel) return;

    if (leaderboard.length === 0) {
        const fallbackMessage = gameState.highScore > 0
            ? `Your high score: ${gameState.highScore} — play again to save leaderboard entries!`
            : 'No saved scores yet. Play the game and save your score to see it here.';

        panel.innerHTML = `
            <div class="menu-leaderboard-header">
                <span>🏆 Leaderboard</span>
                <button class="menu-leaderboard-close" onclick="toggleMenuLeaderboard()">✕</button>
            </div>
            <div class="menu-leaderboard-empty">
                ${fallbackMessage}
            </div>
        `;
        return;
    }

    panel.innerHTML = `
        <div class="menu-leaderboard-header">
            <span>🏆 Leaderboard</span>
            <button class="menu-leaderboard-close" onclick="toggleMenuLeaderboard()">✕</button>
        </div>
        <div class="menu-leaderboard-entries">
            ${leaderboard.map((entry, index) => {
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                return `
                    <div class="menu-leaderboard-entry">
                        <div>
                            <div class="entry-name">${rankEmoji} ${entry.name}</div>
                            <div class="entry-date" style="font-size:12px;color:#cbd5e1;">${entry.date}</div>
                        </div>
                        <div class="entry-score">${entry.score}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function saveToLeaderboard() {
    const nameInput = document.getElementById('playerNameInput');
    const playerName = nameInput.value.trim();

    if (playerName === '') {
        alert('Please enter your name!');
        return;
    }

    const newEntry = {
        name: playerName,
        score: gameState.score,
        date: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    };

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    safeStorage.set('phishHuntLeaderboard', JSON.stringify(leaderboard));

    document.getElementById('nameInputBox').style.display = 'none';
    displayLeaderboard();

    const menuPanel = document.getElementById('menuLeaderboardPanel');
    if (menuPanel && menuPanel.style.display === 'block') {
        renderMenuLeaderboard(menuPanel);
    }
}

function displayLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    const list = document.getElementById('leaderboardList');

    if (leaderboard.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    list.innerHTML = leaderboard.map((entry, index) => {
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'other';
        const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

        return `
            <div class="leaderboard-entry ${rankClass}">
                <div class="entry-left">
                    <span class="entry-rank">${rankEmoji}</span>
                    <div class="entry-info">
                        <p class="entry-name">${entry.name}</p>
                        <p class="entry-date">${entry.date}</p>
                    </div>
                </div>
                <div class="entry-score">${entry.score}</div>
            </div>
        `;
    }).join('');
}

// ── Audio + Voice toggle controls ──────────────────
// Both the menu and the in-game header host a toggle pair; these helpers
// keep every copy in sync via shared classes (.js-sound-toggle / .js-voice-toggle).
function applyToggleVisual(kind, on) {
    const cfg = kind === 'sound'
        ? { on: '🔊', off: '🔇', labelOn: 'Sound On', labelOff: 'Sound Off', purpose: 'Sound effects and music' }
        : { on: '🗣️', off: '🔈', labelOn: 'Voice On', labelOff: 'Voice Off', purpose: 'Voice narration' };
    document.querySelectorAll('.js-' + kind + '-toggle').forEach(btn => {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.classList.toggle('is-on', on);
        const ic = btn.querySelector('.toggle-icon');
        const lb = btn.querySelector('.toggle-label');
        if (ic) ic.textContent = on ? cfg.on : cfg.off;
        if (lb) lb.textContent = on ? cfg.labelOn : cfg.labelOff;
        btn.setAttribute('aria-label',
            cfg.purpose + ' is ' + (on ? 'on' : 'off') + '. Activate to turn it ' + (on ? 'off' : 'on') + '.');
    });
}

function initToggles() {
    applyToggleVisual('sound', gameState.soundEnabled);
    if (!voiceEngine.supported) {
        document.querySelectorAll('.js-voice-toggle').forEach(btn => {
            btn.setAttribute('disabled', 'true');
            btn.title = 'Voice narration is not supported in this browser';
            btn.setAttribute('aria-label', 'Voice narration is not supported in this browser');
        });
        gameState.ttsEnabled = false;
    }
    applyToggleVisual('voice', gameState.ttsEnabled);
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    safeStorage.set('phishHuntSound', gameState.soundEnabled ? '1' : '0');
    audioEngine.unlock();   // toggling is itself a user gesture
    audioEngine.setEnabled(gameState.soundEnabled);
    if (gameState.soundEnabled) {
        // Resume whichever track matches where we are
        if (gameState.phase === 'menu') audioEngine.playMenuMusic();
        else audioEngine.playGameMusic();
    }
    applyToggleVisual('sound', gameState.soundEnabled);
}

function toggleVoice() {
    if (!voiceEngine.supported) return;
    gameState.ttsEnabled = !gameState.ttsEnabled;
    safeStorage.set('phishHuntVoice', gameState.ttsEnabled ? '1' : '0');
    applyToggleVisual('voice', gameState.ttsEnabled);
    if (gameState.ttsEnabled) voiceEngine.narrate('Voice mode on.');
    else voiceEngine.cancel();
}

function updateHighScoreDisplay() {
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const highScoreValue = document.getElementById('highScoreValue');

    if (gameState.highScore > 0) {
        highScoreDisplay.style.display = 'flex';
        highScoreValue.textContent = gameState.highScore;
    } else {
        highScoreDisplay.style.display = 'none';
    }
}