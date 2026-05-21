// Quiz scenarios data - 3 questions (5 points each)
const quizScenarios = [
    {
        id: 1,
        type: 'scam',
        title: 'QR Code on Parking Sign',
        message: 'PAY FOR PARKING HERE 📱 Scan the QR code to pay £2.50. Failure to pay within 10 minutes will result in a £80 fine. — Powered by QuickPark-UK.net',
        redFlags: [
            'QR code stickers are easily placed over real ones by scammers ("quishing")',
            'Creates urgency with a fine threat to rush you into scanning',
            'Suspicious domain (QuickPark-UK.net) not the official council site',
            'Always pay parking via the official app or signposted council website instead'
        ],
        lesson: '💡 Lesson: "Quishing" is when scammers stick fake QR codes over real ones. Always type the parking website address yourself or use the official council app.'
    },
    {
        id: 2,
        type: 'safe',
        title: 'Email Notification from GitHub',
        message: 'Hi @alex, a new sign-in to your GitHub account was made from Chrome on Windows in London, UK. If this was you, no action is needed. If not, secure your account at github.com/settings/security.',
        safeReasons: [
            'Uses your real username (@alex), not a generic "Dear User"',
            'Tells you exactly what happened with no pressure to act',
            'Links go to the real github.com domain',
            'Gives you a choice — only act IF it wasn\'t you'
        ],
        lesson: '💡 Lesson: Real security alerts inform you calmly and link to the genuine website. They never demand passwords or threaten you.'
    },
    {
        id: 3,
        type: 'scam',
        title: 'In-Game Chat Message',
        message: 'Hey bro! 🎮 I can give you 10,000 FREE V-Bucks / Robux! Just log into this site with your account: free-vbucks-generator.xyz — quick before the offer ends!',
        redFlags: [
            'No legitimate "generator" exists — they are all account theft scams',
            'Asks you to enter your real game account login on an outside site',
            'Targets younger players with "too good to be true" rewards',
            'Suspicious .xyz domain pretending to be official'
        ],
        lesson: '💡 Lesson: If someone asks for your game login in exchange for free currency, they want to steal your account. Only buy V-Bucks/Robux through the official app.'
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
    isTimeout: false,
    highScore: parseInt(localStorage.getItem('phishHuntChallenge2HighScore') || '0')
};

let timerInterval = null;

// Initialize Game on Load
window.addEventListener('DOMContentLoaded', () => {
    updateHighScoreDisplay();
});

// Phase Management
function showPhase(phaseName) {
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    document.getElementById(phaseName + 'Phase').classList.add('active');
    gameState.phase = phaseName;
}

// Start Game
function startGame() {
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.timeLeft = 10;
    gameState.selectedAnswer = null;
    gameState.isCorrect = null;
    gameState.isTimeout = false;

    showPhase('playing');
    loadRound();
}

// Load Round
function loadRound() {
    const scenario = quizScenarios[gameState.currentRound];

    document.getElementById('roundDisplay').textContent = `Round ${gameState.currentRound + 1}/${quizScenarios.length}`;
    document.getElementById('currentScore').textContent = gameState.score;
    document.getElementById('scenarioTitle').textContent = scenario.title;
    document.getElementById('scenarioMessage').textContent = scenario.message;

    // Reset timer display
    gameState.timeLeft = 10;
    document.getElementById('timeLeft').textContent = '10s';
    document.getElementById('timerProgress').style.width = '100%';

    // Start timer
    startTimer();
}

// Timer Function
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timeLeft').textContent = gameState.timeLeft + 's';
        document.getElementById('timerProgress').style.width = (gameState.timeLeft * 10) + '%';

        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// Handle Timeout
function handleTimeout() {
    gameState.isTimeout = true;
    showFeedback();
}

// Handle Answer
function handleAnswer(answer) {
    if (timerInterval) clearInterval(timerInterval);

    const scenario = quizScenarios[gameState.currentRound];
    gameState.selectedAnswer = answer;
    gameState.isCorrect = answer === scenario.type;

    if (gameState.isCorrect) {
        gameState.score += 5;
    }

    showFeedback();
}

// Build the explanation list HTML for a scenario
function buildExplanationHTML(scenario) {
    const explanationTitle = document.getElementById('explanationTitle');
    const explanationList = document.getElementById('explanationList');
    const explanationBox = document.getElementById('explanationBox');

    if (scenario.type === 'scam') {
        explanationBox.className = 'explanation-box';
        explanationTitle.className = 'explanation-title scam';
        explanationTitle.textContent = '🚩 Red Flags in this message:';

        explanationList.innerHTML = scenario.redFlags.map(flag => `
            <li><span style="color: #ef4444;">•</span> <span>${flag}</span></li>
        `).join('');
    } else {
        explanationBox.className = 'explanation-box safe';
        explanationTitle.className = 'explanation-title safe';
        explanationTitle.textContent = '✓ Why this message is safe:';

        explanationList.innerHTML = scenario.safeReasons.map(reason => `
            <li><span style="color: #10b981;">•</span> <span>${reason}</span></li>
        `).join('');
    }
}

// Build the lesson box (shown after every answer)
function buildLessonHTML(scenario) {
    const lessonBox = document.getElementById('lessonBox');
    const lessonText = document.getElementById('lessonText');
    lessonBox.style.display = 'block';
    lessonText.textContent = scenario.lesson;
}

// Show Feedback
function showFeedback() {
    showPhase('feedback');

    const scenario = quizScenarios[gameState.currentRound];
    const resultHeader = document.getElementById('resultHeader');
    const resultTitle = document.getElementById('resultTitle');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultText = document.getElementById('resultText');
    const animationContainer = document.getElementById('animationContainer');
    const explanationBox = document.getElementById('explanationBox');
    const feedbackScoreDisplay = document.getElementById('feedbackScoreDisplay');
    const continueBtn = document.getElementById('continueBtn');

    // Clear previous classes
    resultHeader.className = 'result-header';
    resultTitle.className = 'result-title';

    if (gameState.isTimeout) {
        resultHeader.classList.add('timeout');
        resultTitle.classList.add('timeout');
        resultEmoji.textContent = '⏰';
        resultTitle.textContent = "Time's Up!";
        resultText.textContent = `The correct answer was ${scenario.type.toUpperCase()}`;
        animationContainer.innerHTML = '';
    } else if (gameState.isCorrect) {
        resultHeader.classList.add('correct');
        resultTitle.classList.add('correct');
        resultEmoji.textContent = '🎉';
        resultTitle.textContent = 'Correct!';
        resultText.textContent = `This message is a ${scenario.type.toUpperCase()}`;

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
        resultText.textContent = `This message is actually a ${scenario.type.toUpperCase()}`;

        animationContainer.innerHTML = `
            <div class="miss-animation">
                <div style="font-size: 48px;">🐟💨</div>
                <p style="color: #dc2626; font-size: 20px; margin-top: 8px;">The fish got away!</p>
            </div>
        `;
    }

    // Show explanation (red flags or safe reasons) — same for every result type
    explanationBox.style.display = 'block';
    buildExplanationHTML(scenario);

    // Show the cyber-safety lesson — shown after every answer
    buildLessonHTML(scenario);

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

// Next Round
function nextRound() {
    if (gameState.currentRound < quizScenarios.length - 1) {
        gameState.currentRound++;
        gameState.timeLeft = 10;
        gameState.selectedAnswer = null;
        gameState.isCorrect = null;
        gameState.isTimeout = false;

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
    localStorage.setItem('phishHuntChallenge2HighScore', newHighScore.toString());

    document.getElementById('finalScore').textContent = gameState.score;

    const newHighScoreBadge = document.getElementById('newHighScoreBadge');
    if (gameState.score === newHighScore && gameState.score > 0) {
        newHighScoreBadge.style.display = 'block';
    } else {
        newHighScoreBadge.style.display = 'none';
    }

    showPhase('gameOver');
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
