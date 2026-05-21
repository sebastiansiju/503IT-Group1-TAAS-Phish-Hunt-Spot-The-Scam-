// Quiz scenarios data - 3 questions (5 points each)
// Language tuned for ages 14-16: clear, direct, no jargon without explaining it
const quizScenarios = [
    {
        id: 1,
        type: 'scam',
        title: 'QR Code on a Parking Sign',
        message: 'PAY FOR PARKING HERE 📱 Scan the QR code to pay £2.50. If you don\'t pay in 10 minutes you will get a £80 fine. — QuickPark-UK.net',
        redFlags: [
            'Scammers stick fake QR codes over real ones — this is called "quishing"',
            'It tries to scare you with a fine so you scan without thinking',
            'The website (QuickPark-UK.net) is not the real council site',
            'Safer choice: type the parking website yourself or use the official app'
        ],
        lesson: '💡 Lesson: Fake QR code stickers can be placed over real ones. Always type the parking website yourself or use the official app — don\'t just scan and trust it.'
    },
    {
        id: 2,
        type: 'safe',
        title: 'Email from GitHub',
        message: 'Hi @alex, someone signed into your GitHub account using Chrome on Windows in London, UK. If this was you, you don\'t need to do anything. If it wasn\'t you, secure your account at github.com/settings/security.',
        safeReasons: [
            'It uses your real username (@alex), not a generic "Dear User"',
            'It tells you what happened calmly — no scary threats',
            'The link goes to the real github.com address',
            'It only asks you to act IF something looks wrong to you'
        ],
        lesson: '💡 Lesson: Real security alerts tell you what happened calmly and link to the real website. They never demand passwords or rush you.'
    },
    {
        id: 3,
        type: 'scam',
        title: 'Message in a Game Chat',
        message: 'Hey bro! 🎮 I can give you 10,000 FREE V-Bucks / Robux! Just log into this site with your game account: free-vbucks-generator.xyz — be quick before the offer ends!',
        redFlags: [
            'Free V-Bucks or Robux "generators" are not real — they steal accounts',
            'It asks for your real game login on a website that isn\'t the official one',
            'It uses urgency ("be quick!") to stop you thinking properly',
            'The .xyz address is pretending to be official but isn\'t'
        ],
        lesson: '💡 Lesson: If someone offers free in-game money in exchange for your login, they want to steal your account. Only buy V-Bucks or Robux through the official app.'
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
    streak: 0,
    bestStreak: 0,
    roundResults: [],
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
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.roundResults = [];

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

    // Render progress dots
    renderProgressDots();

    // Show streak if 2+ in a row
    const streakDisplay = document.getElementById('streakDisplay');
    if (gameState.streak >= 2) {
        streakDisplay.style.display = 'inline-block';
        document.getElementById('streakText').textContent = `🔥 Streak: ${gameState.streak} in a row!`;
    } else {
        streakDisplay.style.display = 'none';
    }

    // Reset timer display
    gameState.timeLeft = 10;
    document.getElementById('timeLeft').textContent = '10s';
    document.getElementById('timerProgress').style.width = '100%';

    // Start timer
    startTimer();
}

// Render the progress dots showing rounds played
function renderProgressDots() {
    const container = document.getElementById('progressDots');
    container.innerHTML = '';
    for (let i = 0; i < quizScenarios.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i < gameState.roundResults.length) {
            dot.classList.add(gameState.roundResults[i] ? 'completed-correct' : 'completed-wrong');
        } else if (i === gameState.currentRound) {
            dot.classList.add('current');
        }
        container.appendChild(dot);
    }
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
    handleTimeoutResult();
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
        gameState.streak++;
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
    } else {
        gameState.streak = 0;
    }

    gameState.roundResults.push(gameState.isCorrect);
    showFeedback();
}

// Handle Timeout — also resets streak
function handleTimeoutResult() {
    gameState.streak = 0;
    gameState.roundResults.push(false);
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
    const pointsPopup = document.getElementById('pointsPopup');
    const progressMessage = document.getElementById('progressMessage');

    // Clear previous classes
    resultHeader.className = 'result-header';
    resultTitle.className = 'result-title';

    // Hide reward elements by default — only show on correct
    pointsPopup.style.display = 'none';
    progressMessage.style.display = 'none';

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

        // Show the +5 points popup
        pointsPopup.style.display = 'block';

        // Show encouraging progress message based on streak / progress
        progressMessage.style.display = 'block';
        progressMessage.textContent = getProgressMessage();

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

// Get an encouraging progress message based on streak / round
function getProgressMessage() {
    if (gameState.streak >= 3) {
        return '🔥 Triple streak! You\'re a phishing expert!';
    } else if (gameState.streak === 2) {
        return '⚡ Two in a row — keep it up!';
    } else if (gameState.currentRound === quizScenarios.length - 1) {
        return '🎯 Nice finish! Let\'s see your final score.';
    } else if (gameState.currentRound === 0) {
        return '🚀 Great start! Keep going!';
    } else {
        return '👍 Well spotted!';
    }
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

    // Award stars based on score (3 questions × 5 points = 15 max)
    awardStars();

    // Award badge based on performance
    awardBadge();

    showPhase('gameOver');
}

// Award 1-3 stars based on percentage correct
function awardStars() {
    const maxScore = quizScenarios.length * 5;
    const percent = (gameState.score / maxScore) * 100;

    // Reset all stars
    for (let i = 1; i <= 3; i++) {
        document.getElementById('star' + i).classList.remove('earned');
    }

    let starsEarned = 0;
    if (percent === 100) starsEarned = 3;
    else if (percent >= 66) starsEarned = 2;
    else if (percent >= 33) starsEarned = 1;

    // Add 'earned' class with a slight delay so animation runs
    setTimeout(() => {
        for (let i = 1; i <= starsEarned; i++) {
            document.getElementById('star' + i).classList.add('earned');
        }
    }, 100);
}

// Award a badge based on score
function awardBadge() {
    const maxScore = quizScenarios.length * 5;
    const percent = (gameState.score / maxScore) * 100;

    const badgeIcon = document.getElementById('badgeIcon');
    const badgeName = document.getElementById('badgeName');
    const badgeDescription = document.getElementById('badgeDescription');

    let badge;
    if (percent === 100) {
        badge = {
            icon: '🏆',
            name: 'Master Phish Hunter',
            description: 'Perfect score! No scam can fool you.'
        };
    } else if (percent >= 66) {
        badge = {
            icon: '🥇',
            name: 'Cyber Sleuth',
            description: 'Great work! You spot most scams.'
        };
    } else if (percent >= 33) {
        badge = {
            icon: '🎖️',
            name: 'Phish Spotter',
            description: 'Good start! Keep learning the red flags.'
        };
    } else {
        badge = {
            icon: '🐟',
            name: 'Rookie Hunter',
            description: 'Don\'t give up! Try again and study the red flags.'
        };
    }

    badgeIcon.textContent = badge.icon;
    badgeName.textContent = badge.name;
    badgeDescription.textContent = badge.description;
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
