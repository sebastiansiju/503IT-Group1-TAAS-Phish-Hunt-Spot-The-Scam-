// audio.js
// Central audio asset declarations and playback engine for Phish Hunt.

const AUDIO_ASSETS = {
    bgMusic:      'audio/bg-music.mp3',
    menuMusic:    'audio/menu-music.mp3',
    gameMusic:    'audio/game-music.mp3',
    sfxSafe:      'audio/sfx-safe.mp3',
    sfxScam:      'audio/sfx-scam.mp3',
    sfxIncorrect: 'audio/sfx-incorrect.mp3',
    sfxTimeout:   'audio/sfx-timeout.mp3'
};

const synthFallback = (function () {
    let ctx = null, master = null, musicTimer = null, musicNodes = null;

    function ensure() {
        if (ctx) return ctx;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
            master = ctx.createGain();
            master.gain.value = 1.0;
            master.connect(ctx.destination);
        } catch (e) { ctx = null; }
        return ctx;
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    }

    function stopMusic() {
        if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
        if (musicNodes && ctx) {
            try {
                const t = ctx.currentTime;
                musicNodes.g.gain.cancelScheduledValues(t);
                musicNodes.g.gain.setValueAtTime(musicNodes.g.gain.value, t);
                musicNodes.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
                musicNodes.oscs.forEach(o => { try { o.stop(t + 0.35); } catch (e) {} });
            } catch (e) {}
        }
        musicNodes = null;
    }

    function startMusic(which) {
        if (!ensure()) return;
        resume();
        stopMusic();
        const t = ctx.currentTime;
        const freq = which === 'game' ? 220 : 261.6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.5, t + 0.4);
        g.connect(master);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(g);
        osc.start();
        const notes = which === 'game' ? [220, 277, 330, 440] : [262, 330, 392, 523];
        let i = 0;
        musicTimer = setInterval(() => {
            if (!ctx) return;
            const tt = ctx.currentTime;
            const ng = ctx.createGain();
            ng.gain.setValueAtTime(0.35, tt);
            ng.gain.exponentialRampToValueAtTime(0.0001, tt + 0.5);
            ng.connect(master);
            const no = ctx.createOscillator();
            no.type = 'sine';
            no.frequency.value = notes[i % notes.length]; i++;
            no.connect(ng);
            no.start(); no.stop(tt + 0.55);
        }, 650);
        musicNodes = { g, oscs: [osc] };
    }

    function blip(role) {
        if (!ensure()) return;
        resume();
        const t = ctx.currentTime;
        const g = ctx.createGain(); g.connect(master);
        const o = ctx.createOscillator(); o.connect(g);
        let type = 'sine', f = 440, dur = 0.18, peak = 0.55;
        if (role === 'safe')      { type = 'sine';     f = 660; dur = 0.18; }
        else if (role === 'scam') { type = 'sawtooth'; f = 320; dur = 0.20; }
        else if (role === 'incorrect') { type = 'square'; f = 160; dur = 0.40; peak = 0.60; }
        else if (role === 'timeout')   { type = 'sine';   f = 130; dur = 0.55; peak = 0.70; }
        o.type = type; o.frequency.setValueAtTime(f, t);
        if (role === 'safe')      o.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.12);
        if (role === 'timeout')   o.frequency.exponentialRampToValueAtTime(55, t + 0.45);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.03);
    }

    return { ensure: ensure, resume: resume, startMusic: startMusic, stopMusic: stopMusic, blip: blip };
})();

const audioEngine = (function () {
    const VOL = { menu: 0.80, game: 0.60, safe: 0.95, scam: 0.95, incorrect: 1.00, timeout: 1.00 };
    let mv = 1.0, on = true, unlocked = false, curMusic = null;
    const mus = {}, sfx = {};
    let bgEl = null;

    function v(role) { return Math.min(1, VOL[role] * mv); }

    function mk(src, loop) {
        const a = new Audio(src);
        a.loop = !!loop;
        a.preload = 'auto';
        a.setAttribute('playsinline', '');
        return a;
    }

    function build() {
        if (mus.menu) return;
        bgEl = mk(AUDIO_ASSETS.bgMusic, true);
        bgEl.volume = Math.min(1, 0.45 * mv);
        mus.menu = mk(AUDIO_ASSETS.menuMusic, true);
        mus.game = mk(AUDIO_ASSETS.gameMusic, true);
        sfx.safe      = mk(AUDIO_ASSETS.sfxSafe, false);
        sfx.scam      = mk(AUDIO_ASSETS.sfxScam, false);
        sfx.incorrect = mk(AUDIO_ASSETS.sfxIncorrect, false);
        sfx.timeout   = mk(AUDIO_ASSETS.sfxTimeout, false);
    }

    function startBg() {
        if (!bgEl || !on) return;
        bgEl.volume = Math.min(1, 0.45 * mv);
        bgEl.play().catch(() => {});
    }

    function tryPlayMusic(role) {
        const a = mus[role];
        a.volume = v(role);
        a.play().catch(() => {
            if (curMusic === role && on) {
                synthFallback.ensure();
                synthFallback.resume();
                synthFallback.startMusic(role);
            }
        });
    }

    function switchMusic(role) {
        build();
        curMusic = role;
        const other = role === 'menu' ? 'game' : 'menu';
        try { mus[other].pause(); mus[other].currentTime = 0; } catch (e) {}
        synthFallback.stopMusic();
        if (!on || !unlocked) return;
        tryPlayMusic(role);
    }

    function playSfxEl(role) {
        if (!on) return;
        build();
        const a = sfx[role];
        a.volume = v(role);
        a.currentTime = 0;
        a.play().catch(() => {
            synthFallback.ensure();
            synthFallback.resume();
            synthFallback.blip(role);
        });
    }

    return {
        init() { build(); },
        unlock() {
            if (unlocked) return;
            unlocked = true;
            build();
            synthFallback.ensure();
            synthFallback.resume();
            startBg();
            if (on && curMusic) tryPlayMusic(curMusic);
        },
        playMenuMusic() { switchMusic('menu'); },
        playGameMusic() { switchMusic('game'); },
        pauseAllMusic() {
            try { mus.menu && mus.menu.pause(); } catch (e) {}
            try { mus.game && mus.game.pause(); } catch (e) {}
            synthFallback.stopMusic();
        },
        stopMusic() {
            curMusic = null;
            try { mus.menu && mus.menu.pause(); mus.menu.currentTime = 0; } catch (e) {}
            try { mus.game && mus.game.pause(); mus.game.currentTime = 0; } catch (e) {}
            synthFallback.stopMusic();
        },
        setEnabled(val) {
            on = !!val;
            if (!on) {
                this.pauseAllMusic();
                if (bgEl) bgEl.pause();
            } else {
                if (bgEl && unlocked) startBg();
                if (curMusic) switchMusic(curMusic);
            }
        },
        setMasterVolume(val) {
            mv = Math.max(0, Math.min(1, val));
            build();
            if (bgEl) bgEl.volume = Math.min(1, 0.45 * mv);
            Object.keys(VOL).forEach(r => {
                const a = mus[r] || sfx[r];
                if (a) a.volume = v(r);
            });
        },
        setUrgent() {},
        playSafe()      { playSfxEl('safe'); },
        playScam()      { playSfxEl('scam'); },
        playIncorrect() { playSfxEl('incorrect'); },
        playTimeout()   { playSfxEl('timeout'); },
        playScamThen(cb) {
            if (!on) { if (cb) setTimeout(cb, 0); return; }
            build();
            const a = sfx.scam;
            a.volume = v('scam');
            a.currentTime = 0;
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                clearTimeout(t);
                a.removeEventListener('ended', finish);
                if (cb) cb();
            };
            const t = setTimeout(finish, 4000);
            a.addEventListener('ended', finish, { once: true });
            a.play().catch(() => { synthFallback.blip('scam'); finish(); });
        }
    };
})();
