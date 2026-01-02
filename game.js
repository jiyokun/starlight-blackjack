// Starlight Blackjack - Game Logic
// MVC Architecture Demonstration for FYB Technologies

// Model
const gameState = {
    bankroll: 1000,
    currentBet: 0,
    wins: 0,
    losses: 0,
    gameActive: false,
    playerCards: [],
    dealerCards: [],
    playerScore: 0,
    dealerScore: 0
};

// View - Update Display
function updateView() {
    document.getElementById('bankroll').textContent = '$' + gameState.bankroll;
    document.getElementById('currentBet').textContent = '$' + gameState.currentBet;
    document.getElementById('wins').textContent = gameState.wins;
    document.getElementById('losses').textContent = gameState.losses;
    document.getElementById('playerScore').textContent = gameState.playerScore;
    document.getElementById('dealerScore').textContent = gameState.gameActive ? '?' : gameState.dealerScore;
    
    updateCardDisplay();
}

// Controller - Game Logic
function placeBet(amount) {
    if (!gameState.gameActive && gameState.bankroll >= amount) {
        gameState.currentBet += amount;
        gameState.bankroll -= amount;
        updateView();
        showMessage(`Bet placed: $${amount}. Click Deal to start!`);
    }
}

function dealCards() {
    if (gameState.currentBet === 0) {
        showMessage('Please place a bet first!');
        return;
    }
    
    gameState.gameActive = true;
    gameState.playerCards = [getRandomCard(), getRandomCard()];
    gameState.dealerCards = [getRandomCard(), getRandomCard()];
    gameState.playerScore = calculateScore(gameState.playerCards);
    gameState.dealerScore = calculateScore([gameState.dealerCards[1]]);
    
    updateView();
    showMessage(`Game started! Your score: ${gameState.playerScore}. Hit or Stand?`);
}

function playerHit() {
    if (!gameState.gameActive) return;
    
    gameState.playerCards.push(getRandomCard());
    gameState.playerScore = calculateScore(gameState.playerCards);
    
    if (gameState.playerScore > 21) {
        showMessage('Bust! You went over 21.');
        endGame('loss');
    } else {
        showMessage(`Score: ${gameState.playerScore}. Hit again or Stand?`);
    }
    
    updateView();
}

function playerStand() {
    if (!gameState.gameActive) return;
    
    // Dealer draws until at least 17
    gameState.dealerScore = calculateScore(gameState.dealerCards);
    while (gameState.dealerScore < 17) {
        gameState.dealerCards.push(getRandomCard());
        gameState.dealerScore = calculateScore(gameState.dealerCards);
    }
    
    // Determine winner
    let result;
    if (gameState.dealerScore > 21 || gameState.playerScore > gameState.dealerScore) {
        result = 'win';
    } else if (gameState.playerScore < gameState.dealerScore) {
        result = 'loss';
    } else {
        result = 'push';
    }
    
    endGame(result);
}

function endGame(result) {
    gameState.gameActive = false;
    
    switch(result) {
        case 'win':
            showMessage(`You win $${gameState.currentBet * 2}!`);
            gameState.bankroll += gameState.currentBet * 2;
            gameState.wins++;
            break;
        case 'loss':
            showMessage('Dealer wins!');
            gameState.losses++;
            break;
        case 'push':
            showMessage('Push! Your bet is returned.');
            gameState.bankroll += gameState.currentBet;
            break;
    }
    
    gameState.currentBet = 0;
    updateView();
}

function resetGame() {
    gameState.playerCards = [];
    gameState.dealerCards = [];
    gameState.playerScore = 0;
    gameState.dealerScore = 0;
    gameState.gameActive = false;
    gameState.currentBet = 0;
    
    showMessage('Welcome! Place your bet and click "Deal" to start.');
    updateView();
}

// Helper Functions
function getRandomCard() {
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♥', '♦', '♣'];
    const value = values[Math.floor(Math.random() * values.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return { 
        value, 
        suit, 
        isRed: suit === '♥' || suit === '♦',
        display: value + suit
    };
}

function calculateScore(cards) {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });
    
    // Adjust for aces
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    
    return score;
}

function updateCardDisplay() {
    // Player cards
    const playerCardsElement = document.getElementById('playerCards');
    playerCardsElement.innerHTML = gameState.playerCards.map(card => 
        `<div class="card ${card.isRed ? 'red' : ''}">${card.display}</div>`
    ).join('');
    
    // Dealer cards
    const dealerCardsElement = document.getElementById('dealerCards');
    if (gameState.gameActive) {
        // Hide first dealer card during game
        dealerCardsElement.innerHTML = `
            <div class="card back">?</div>
            ${gameState.dealerCards.slice(1).map(card => 
                `<div class="card ${card.isRed ? 'red' : ''}">${card.display}</div>`
            ).join('')}
        `;
    } else {
        // Show all cards after game
        dealerCardsElement.innerHTML = gameState.dealerCards.map(card => 
            `<div class="card ${card.isRed ? 'red' : ''}">${card.display}</div>`
        ).join('');
    }
}

function showMessage(text) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.style.animation = 'none';
    setTimeout(() => {
        messageElement.style.animation = 'dealCard 0.5s';
    }, 10);
}

// Initialize game
updateView();
showMessage('Starlight Blackjack Loaded! Ready to play.');

console.log('Game initialized with MVC architecture');
console.log('Features: iGaming mechanics, betting system, card logic');
console.log('Built for FYB Technologies Game Developer position');
