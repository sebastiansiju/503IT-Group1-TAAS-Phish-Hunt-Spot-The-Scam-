// Quiz scenarios data — pool of 23 (3 are QR code challenges)
// Each game shuffles all 23 and picks 20
const quizScenarios = [
    {
        id: 1,
        type: 'scam',
        title: 'Email from "PayPal Security"',
        message: 'URGENT: Your account will be suspended in 24 hours! Click here immediately to verify your identity: paypa1-secure.com/verify',
        redFlags: [
            'Creates false urgency with "24 hours" deadline',
            'Suspicious URL: "paypa1" (number 1 instead of letter l)',
            'Legitimate companies don\'t threaten account suspension via email',
            'Demands immediate action without proper context'
        ]
    },
    {
        id: 2,
        type: 'safe',
        title: 'Email from Your School',
        message: 'Hi Students, This is a reminder that the library will be closed for maintenance this Saturday. Please plan accordingly. For questions, visit the school office.',
        redFlags: []
    },
    {
        id: 3,
        type: 'scam',
        title: 'SMS from Unknown Number',
        message: 'Congratulations! You\'ve won a £500 Amazon gift card! Claim now: bit.ly/claim-prize. Reply with your email and password to verify.',
        redFlags: [
            'Unsolicited prize notification from unknown sender',
            'Shortened URL (bit.ly) hides actual destination',
            'Requests password - legitimate companies NEVER ask for passwords',
            'Too good to be true - you didn\'t enter any contest'
        ]
    },
    {
        id: 4,
        type: 'safe',
        title: 'Email from Netflix',
        message: 'Your monthly subscription of £9.99 has been processed. You can view your account details at netflix.com. Thank you for being a member!',
        redFlags: []
    },
    {
        id: 5,
        type: 'scam',
        title: 'Email from "Your Bank"',
        message: 'Dear Valued Customer, We detected suspicious activity. Download the attached security form to protect your account. Form: security_update.exe',
        redFlags: [
            'Generic greeting "Valued Customer" instead of your name',
            'Asks you to download an executable file (.exe)',
            'Creates fear with "suspicious activity"',
            'Banks don\'t send security forms as attachments'
        ]
    },
    {
        id: 6,
        type: 'scam',
        title: 'Social Media Message',
        message: 'OMG is this you in this video?? 😱 hxxp://totally-not-virus.xyz/video.php Click quick before it gets deleted!',
        redFlags: [
            'Creates curiosity and urgency to click',
            'Suspicious domain name',
            'Intentionally misspelled URL (hxxp)',
            'Friends\' accounts can be hacked to send scam messages'
        ]
    },
    {
        id: 7,
        type: 'safe',
        title: 'Email from Online Store',
        message: 'Your order #12345 has been shipped! Track your package at amazon.co.uk using your account. Estimated delivery: May 16, 2026.',
        redFlags: []
    },
    {
        id: 8,
        type: 'scam',
        title: 'Email from "Apple Support"',
        message: 'Your iCloud storage is full! Pay £0.99 NOW to avoid losing all your photos. Click: apple-storage-upgrade.net/pay',
        redFlags: [
            'Creates urgency and fear of losing data',
            'Fake domain: apple-storage-upgrade.net (not apple.com)',
            'Legitimate Apple emails come from @apple.com',
            'Pressures immediate payment'
        ]
    },
    {
        id: 9,
        type: 'safe',
        title: 'Text from Delivery Service',
        message: 'Your Royal Mail parcel will arrive today between 2-4pm. Track at royalmail.com with tracking number RM123456789GB.',
        redFlags: []
    },
    {
        id: 10,
        type: 'scam',
        title: 'Email from "HMRC Tax Office"',
        message: 'You are entitled to a tax refund of £387.50. Claim within 48 hours by providing your bank details at hmrc-refunds.co.uk',
        redFlags: [
            'Creates urgency with 48-hour deadline',
            'Wrong domain: hmrc-refunds.co.uk (real is gov.uk)',
            'Requests bank details via email',
            'HMRC never asks for bank details via email'
        ]
    },
    {
        id: 11,
        type: 'scam',
        title: 'WhatsApp Message from "Friend"',
        message: 'Hey! I\'m stuck abroad and lost my wallet. Can you send me £200 urgently? I\'ll pay you back tomorrow! Use this link: sendmoney-quick.com',
        redFlags: [
            'Urgent request for money',
            'Suspicious external payment link',
            'Common "friend in trouble" scam',
            'Real friends would call or video chat to verify'
        ]
    },
    {
        id: 12,
        type: 'safe',
        title: 'Email from Your University',
        message: 'Dear Sarah, Your exam results are now available on the student portal at university.ac.uk. Log in with your student ID to view them.',
        redFlags: []
    },
    {
        id: 13,
        type: 'scam',
        title: 'Email from "Microsoft Security"',
        message: 'WARNING: Your computer has been infected with 5 viruses! Call our support team immediately at 0800-FAKE-NUM or your files will be deleted in 1 hour.',
        redFlags: [
            'Creates panic with virus warning',
            'Demands phone call to "support"',
            'False urgency (1 hour deadline)',
            'Microsoft doesn\'t send unsolicited security warnings'
        ]
    },
    {
        id: 14,
        type: 'safe',
        title: 'Email from Spotify',
        message: 'Hi there! We\'ve added new features to Spotify Premium. Check them out at spotify.com. Enjoying your music? Reply to this email with feedback!',
        redFlags: []
    },
    {
        id: 15,
        type: 'scam',
        title: 'Instagram DM from Stranger',
        message: 'Hey! I work for a clothing brand and we want to sponsor you! Just send us your address, phone number, and bank details to receive free products!',
        redFlags: [
            'Unsolicited sponsorship offer',
            'Requests excessive personal information',
            'Legitimate brands contact through official channels',
            'Too good to be true offer'
        ]
    },
    {
        id: 16,
        type: 'scam',
        title: 'Email with Job Offer',
        message: 'Congratulations! You\'ve been selected for a £3,000/month work-from-home position. No experience needed! Send £50 registration fee to get started.',
        redFlags: [
            'Unsolicited job offer you didn\'t apply for',
            'Requests payment upfront (registration fee)',
            'Unrealistic salary for no experience',
            'Legitimate jobs never require upfront payment'
        ]
    },
    {
        id: 17,
        type: 'safe',
        title: 'Email from Doctor\'s Office',
        message: 'This is a reminder that you have an appointment with Dr. Smith on May 20th at 3:00 PM. Reply to confirm or call 020-1234-5678 to reschedule.',
        redFlags: []
    },
    {
        id: 18,
        type: 'scam',
        title: 'Email from "Lottery Commission"',
        message: 'YOU\'VE WON £1,000,000 in the UK National Lottery! To claim your prize, send a processing fee of £500 and your passport details to lottery-claim@yahoo.com',
        redFlags: [
            'You can\'t win a lottery you didn\'t enter',
            'Requests processing fee (real lotteries deduct fees)',
            'Asks for passport details',
            'Using free email (yahoo.com) instead of official domain'
        ]
    },
    {
        id: 19,
        type: 'safe',
        title: 'Email from Local Council',
        message: 'Notice: Bin collection will be delayed by one day next week due to the bank holiday. Your collection day will be Thursday instead of Wednesday.',
        redFlags: []
    },
    {
        id: 20,
        type: 'scam',
        title: 'Facebook Message',
        message: 'Your account will be DELETED in 24 hours for violating community standards! Verify your identity now: facebook-verify-account.com/urgent',
        redFlags: [
            'Creates panic about account deletion',
            'Fake domain (not facebook.com)',
            'False urgency',
            'Facebook communicates through official in-app notifications'
        ]
    },
    // ── QR Code challenges ──────────────────────────
    {
        id: 21,
        type: 'scam',
        category: 'qr',
        title: '📱 QR Code on Restaurant Table',
        message: 'You scan a QR code sticker on a café table. It takes you to: restaurant-pay-secure.net — "Scan to pay your bill. Enter your card number and CVV below."',
        redFlags: [
            'Unofficial domain — not the café\'s real website',
            'QR stickers on tables can be placed by anyone',
            'Legitimate restaurants use card machines or official apps',
            'Never enter card details on an unexpected QR code page'
        ]
    },
    {
        id: 22,
        type: 'scam',
        category: 'qr',
        title: '📱 QR Code on a Street Poster',
        message: 'A poster on a lamp post reads: "Scan to claim your FREE £100 Amazon voucher! Today only!" The QR takes you to: free-voucher-claim.xyz/amazon',
        redFlags: [
            'Too good to be true — unsolicited prize from a street poster',
            'Suspicious unbranded domain (not amazon.com)',
            'Street QR codes can be placed by anyone at no cost',
            'Amazon does not give out vouchers via random posters'
        ]
    },
    {
        id: 23,
        type: 'safe',
        category: 'qr',
        title: '📱 QR Code at a Museum',
        message: 'At the Natural History Museum, a display panel has a QR code: "Scan to explore more about this T-Rex fossil." It opens nhm.ac.uk/discover/dino-directory.',
        redFlags: []
    }
];

// Game State Variables
let gameState = {
    phase: 'menu',
    currentRound: 0,
    score: 0,
    timeLeft: 10,
    selectedAnswer: null,
    isCorrect: null,
    highScore: parseInt(localStorage.getItem('phishHuntHighScore') || '0'),
    isTimeout: false,
    streak: 0,
    maxStreak: 0,
    correctAnswers: 0,
    scenarios: [],
    selectedOption: 'safe'
};

let timerInterval = null;
let leaderboard = [];

// ── Level helpers (4 levels × 5 rounds each) ──────
function getLevel(roundIndex) {
    if (roundIndex < 5)  return { name: 'Easy',   color: '#4ade80', time: 12, num: 1 };
    if (roundIndex < 10) return { name: 'Medium', color: '#fbbf24', time: 10, num: 2 };
    if (roundIndex < 15) return { name: 'Hard',   color: '#fb923c', time: 8,  num: 3 };
    return                      { name: 'Expert', color: '#f87171', time: 6,  num: 4 };
}

// ── Scenario type detection ────────────────────────
function getScenarioMeta(scenario) {
    if (scenario.category === 'qr') return { icon: '📱', label: 'QR Code' };
    const t = scenario.title.toLowerCase();
    if (t.includes('email'))                                    return { icon: '📧', label: 'Email' };
    if (t.includes('sms') || t.includes('text from'))          return { icon: '💬', label: 'SMS' };
    if (t.includes('whatsapp'))                                 return { icon: '💬', label: 'WhatsApp' };
    if (t.includes('instagram') || t.includes('facebook') ||
        t.includes('social') || t.includes('dm'))               return { icon: '📱', label: 'Social Media' };
    return { icon: '📩', label: 'Message' };
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

    // Segment bar: 4 segments for rounds 0-4, 5-9, 10-14, 15-19
    const segs = [
        { id: 'lsbEasy',   min: 0,  max: 4  },
        { id: 'lsbMed',    min: 5,  max: 9  },
        { id: 'lsbHard',   min: 10, max: 14 },
        { id: 'lsbExpert', min: 15, max: 19 },
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
function setSelection(option) {
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

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (document.activeElement.tagName === 'INPUT') return;

        if (gameState.phase === 'playing') {
            if (e.key === 'ArrowLeft')       { e.preventDefault(); setSelection('safe'); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); setSelection('scam'); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAnswer(gameState.selectedOption); }
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (gameState.phase === 'menu') startGame();
            else if (gameState.phase === 'feedback') document.getElementById('continueBtn').click();
            else if (gameState.phase === 'gameOver') tryPlayAgain();
        }
    });

    // Swipe gestures for mobile
    let _tx = 0, _ty = 0;
    document.addEventListener('touchstart', function(e) {
        _tx = e.touches[0].clientX;
        _ty = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (gameState.phase === 'playing') {
            const dx = e.changedTouches[0].clientX - _tx;
            const dy = e.changedTouches[0].clientY - _ty;
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
            handleAnswer(dx < 0 ? 'safe' : 'scam');
        } else {
            const adx = Math.abs(e.changedTouches[0].clientX - _tx);
            const ady = Math.abs(e.changedTouches[0].clientY - _ty);
            if (adx < 15 && ady < 15) {
                if (gameState.phase === 'menu') {
                    const startBtn = document.querySelector('.btn-start-fishing');
                    if (!startBtn.contains(e.target)) startGame();
                } else if (gameState.phase === 'feedback') {
                    const btn = document.getElementById('continueBtn');
                    if (!btn.contains(e.target)) btn.click();
                } else if (gameState.phase === 'gameOver') {
                    const playBtn = document.querySelector('#gameOverPhase .btn-primary');
                    if (!playBtn.contains(e.target)) tryPlayAgain();
                }
            }
        }
    }, { passive: true });

    // Mouse click to start / continue
    document.getElementById('menuPhase').addEventListener('click', function(e) {
        if (gameState.phase !== 'menu') return;
        const startBtn = document.querySelector('.btn-start-fishing');
        if (!startBtn.contains(e.target)) startGame();
    });

    document.getElementById('feedbackPhase').addEventListener('click', function(e) {
        if (gameState.phase !== 'feedback') return;
        const btn = document.getElementById('continueBtn');
        if (!btn.contains(e.target)) btn.click();
    });

    document.getElementById('gameOverPhase').addEventListener('click', function(e) {
        if (gameState.phase !== 'gameOver') return;
        const playBtn = document.querySelector('#gameOverPhase .btn-primary');
        if (!playBtn.contains(e.target)) tryPlayAgain();
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

// Fisher-Yates shuffle helper
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Start Game Function
function startGame() {
    // Separate QR and non-QR pools
    const nonQR   = shuffle(quizScenarios.filter(s => s.category !== 'qr'));
    const safeQRs = quizScenarios.filter(s => s.category === 'qr' && s.type === 'safe');
    const scamQRs = quizScenarios.filter(s => s.category === 'qr' && s.type === 'scam');

    // Pick one safe QR for Hard, one scam QR for Expert
    const safeQR = safeQRs[Math.floor(Math.random() * safeQRs.length)];
    const scamQR = scamQRs[Math.floor(Math.random() * scamQRs.length)];

    // Build 20-card deck: Easy(5) + Medium(5) + Hard(4+safeQR) + Expert(4+scamQR)
    const easy   = nonQR.slice(0, 5);
    const medium = nonQR.slice(5, 10);
    const hard   = shuffle([...nonQR.slice(10, 14), safeQR]);
    const expert = shuffle([...nonQR.slice(14, 18), scamQR]);

    gameState = {
        ...gameState,
        phase: 'playing',
        currentRound: 0,
        score: 0,
        timeLeft: 10,
        selectedAnswer: null,
        isCorrect: null,
        isTimeout: false,
        streak: 0,
        maxStreak: 0,
        correctAnswers: 0,
        scenarios: [...easy, ...medium, ...hard, ...expert]
    };

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

    // Default selection to SAFE each new round
    setSelection('safe');

    // Timer — duration depends on level
    gameState.timeLeft = level.time;
    updateTimer();
    startTimer();
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
    const percentage = (gameState.timeLeft / level.time) * 100;
    document.getElementById('timerProgress').style.width = percentage + '%';
}

function handleTimeout() {
    gameState.isTimeout = true;
    gameState.selectedAnswer = null;
    gameState.isCorrect = null;
    gameState.streak = 0;

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

    const scenario = gameState.scenarios[gameState.currentRound];
    const correct  = answer === scenario.type;

    gameState.selectedAnswer = answer;
    gameState.isCorrect      = correct;
    gameState.isTimeout      = false;

    if (correct) {
        gameState.score += 5;
        gameState.correctAnswers++;
        gameState.streak++;
        if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;
    } else {
        gameState.streak = 0;
    }

    // Brief keyboard flash on button
    const btn = document.getElementById(answer === 'safe' ? 'btnSafe' : 'btnScam');
    if (btn) {
        btn.classList.add('kb-active');
        setTimeout(() => btn.classList.remove('kb-active'), 180);
    }

    // Animate card exit, then show feedback
    const card = document.getElementById('scenarioCard');
    if (card) {
        card.classList.add(answer === 'safe' ? 'card-exit-left' : 'card-exit-right');
    }

    setTimeout(() => {
        showPhase('feedback');
        showFeedback();
    }, 260);
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

        continueBtn.textContent = 'Try Again! ⏱️';
        continueBtn.onclick = retryQuestion;
        continueBtn.className = 'btn btn-full';
        continueBtn.style.background = '#ea580c';

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

        // Show explanation
        explanationBox.style.display = 'block';
        const explanationTitle = document.getElementById('explanationTitle');
        const explanationList = document.getElementById('explanationList');

        if (scenario.type === 'scam') {
            explanationBox.className = 'explanation-box';
            explanationTitle.className = 'explanation-title scam';
            explanationTitle.textContent = '🚩 Red Flags:';

            explanationList.innerHTML = scenario.redFlags.map(flag => `
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

        // Show score
        feedbackScoreDisplay.style.display = 'block';
        document.getElementById('feedbackScore').textContent = gameState.score;

        // Setup continue button
        continueBtn.className = 'btn btn-primary btn-full';
        continueBtn.style.background = '';
        if (gameState.currentRound < quizScenarios.length - 1) {
            continueBtn.textContent = 'Next Round →';
        } else {
            continueBtn.textContent = 'See Results →';
        }
        continueBtn.onclick = nextRound;
    }
}

// Retry Question (after timeout)
function retryQuestion() {
    gameState.isTimeout = false;
    gameState.selectedAnswer = null;
    gameState.isCorrect = null;
    gameState.streak = 0;

    showPhase('playing');
    loadRound();
}

// Next Round
function nextRound() {
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
    const newHighScore = Math.max(gameState.score, gameState.highScore);
    gameState.highScore = newHighScore;
    localStorage.setItem('phishHuntHighScore', newHighScore.toString());

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
    const saved = localStorage.getItem('phishHuntLeaderboard');
    if (saved) {
        leaderboard = JSON.parse(saved);
    }
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

    localStorage.setItem('phishHuntLeaderboard', JSON.stringify(leaderboard));

    document.getElementById('nameInputBox').style.display = 'none';
    displayLeaderboard();
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