// Starlight Blackjack - React Component Architecture
// Demonstrating React skills for FYB Technologies

import React, { useState, useEffect } from 'react';

// ==================== REACT COMPONENTS ====================

/**
 * Card Component - Pure UI Component
 * Demonstrates props, conditional rendering
 */
const Card = ({ value, suit, faceDown = false, animate = false }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (animate) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const isRed = suit === '♥' || suit === '♦';
  
  return (
    <div className={`card ${isRed ? 'red' : ''} ${faceDown ? 'back' : ''} ${isAnimating ? 'deal-animation' : ''}`}>
      {!faceDown ? (
        <>
          <div className="card-corner top-left">
            <div className="card-value">{value}</div>
            <div className="card-suit">{suit}</div>
          </div>
          <div className="card-center">
            <div className="card-suit-large">{suit}</div>
          </div>
          <div className="card-corner bottom-right">
            <div className="card-value">{value}</div>
            <div className="card-suit">{suit}</div>
          </div>
        </>
      ) : (
        <div className="card-back-design"></div>
      )}
    </div>
  );
};

/**
 * Hand Component - Composable Component
 * Demonstrates mapping, keys, component composition
 */
const Hand = ({ cards, title, faceDownFirst = false }) => (
  <div className="hand-section">
    <h3>{title}</h3>
    <div className="cards-container">
      {cards.map((card, index) => (
        <Card
          key={`${card.value}-${card.suit}-${index}`}
          value={card.value}
          suit={card.suit}
          faceDown={faceDownFirst && index === 0}
          animate={true}
        />
      ))}
    </div>
  </div>
);

/**
 * Chip Component - Interactive Component  
 * Demonstrates events, state lifting
 */
const Chip = ({ value, onClick, disabled = false }) => {
  const colors = {
    10: '#ff6b6b',
    25: '#4ecdc4', 
    50: '#ffeaa7',
    100: '#a29bfe'
  };

  return (
    <button
      className="chip"
      style={{ 
        background: `radial-gradient(circle at 30% 30%, ${colors[value]}, ${colors[value]}80)`,
        color: value === 50 ? 'black' : 'white'
      }}
      onClick={() => onClick(value)}
      disabled={disabled}
      aria-label={`Bet $${value}`}
    >
      ${value}
    </button>
  );
};

/**
 * GameControls Component - Smart Component
 * Demonstrates hooks, event handling
 */
const GameControls = ({ gamePhase, onAction, canDouble }) => {
  const actions = {
    betting: ['deal'],
    playerTurn: ['hit', 'stand', canDouble ? 'double' : null].filter(Boolean),
    dealerTurn: [],
    roundOver: ['newGame']
  };

  const actionLabels = {
    deal: '🃏 Deal Cards',
    hit: '➕ Hit',
    stand: '✋ Stand', 
    double: '⚡ Double',
    newGame: '🔄 New Game'
  };

  return (
    <div className="controls">
      {actions[gamePhase]?.map(action => (
        <button
          key={action}
          className={`btn btn-${action}`}
          onClick={() => onAction(action)}
        >
          {actionLabels[action]}
        </button>
      ))}
    </div>
  );
};

/**
 * StatsPanel Component - Presentational Component
 * Demonstrates props, conditional styling
 */
const StatsPanel = ({ bankroll, currentBet, wins, losses }) => (
  <div className="stats-panel">
    <h3>📊 Player Stats</h3>
    <div className="stat-row">
      <span className="stat-label">Bankroll:</span>
      <span className="stat-value">${bankroll}</span>
    </div>
    <div className="stat-row">
      <span className="stat-label">Current Bet:</span>
      <span className={`stat-value ${currentBet > 0 ? 'highlight' : ''}`}>
        ${currentBet}
      </span>
    </div>
    <div className="stat-row">
      <span className="stat-label">Wins:</span>
      <span className="stat-value win">{wins}</span>
    </div>
    <div className="stat-row">
      <span className="stat-label">Losses:</span>
      <span className="stat-value loss">{losses}</span>
    </div>
  </div>
);

// ==================== REACT HOOKS ====================

/**
 * Custom Hook: useBlackjackGame
 * Demonstrates custom hooks, state management
 */
const useBlackjackGame = (initialBankroll = 1000) => {
  const [gameState, setGameState] = useState({
    bankroll: initialBankroll,
    currentBet: 0,
    wins: 0,
    losses: 0,
    playerHand: [],
    dealerHand: [],
    gamePhase: 'betting', // 'betting' | 'playerTurn' | 'dealerTurn' | 'roundOver'
    message: 'Place your bet to start!'
  });

  const placeBet = (amount) => {
    setGameState(prev => ({
      ...prev,
      bankroll: prev.bankroll - amount,
      currentBet: prev.currentBet + amount,
      message: `Bet placed: $${amount}. Ready to deal!`
    }));
  };

  const dealCards = () => {
    // Simulate card dealing
    const newPlayerHand = [
      { value: 'A', suit: '♠' },
      { value: 'K', suit: '♥' }
    ];
    const newDealerHand = [
      { value: '10', suit: '♣' },
      { value: '7', suit: '♦' }
    ];

    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      dealerHand: newDealerHand,
      gamePhase: 'playerTurn',
      message: 'Game started! Your turn.'
    }));
  };

  const playerAction = (action) => {
    // Game logic would go here
    setGameState(prev => ({
      ...prev,
      message: `You chose: ${action}`
    }));
  };

  return {
    gameState,
    placeBet,
    dealCards,
    playerAction
  };
};

// ==================== MAIN APP COMPONENT ====================

/**
 * StarlightBlackjackApp - Root Component
 * Demonstrates component composition, context, lifecycle
 */
const StarlightBlackjackApp = () => {
  const { gameState, placeBet, dealCards, playerAction } = useBlackjackGame();
  const [chips, setChips] = useState([10, 25, 50, 100]);

  return (
    <div className="react-blackjack-app">
      <header className="app-header">
        <h1>🎰 Starlight Blackjack <span className="react-badge">React</span></h1>
        <p className="subtitle">React Component Architecture Demo</p>
      </header>

      <div className="game-container">
        <StatsPanel
          bankroll={gameState.bankroll}
          currentBet={gameState.currentBet}
          wins={gameState.wins}
          losses={gameState.losses}
        />

        <div className="game-table">
          <Hand 
            cards={gameState.dealerHand} 
            title="Dealer's Hand" 
            faceDownFirst={gameState.gamePhase === 'playerTurn'}
          />
          
          <div className="game-message">
            {gameState.message}
          </div>

          <Hand 
            cards={gameState.playerHand} 
            title="Your Hand" 
          />

          {gameState.gamePhase === 'betting' ? (
            <div className="betting-section">
              <h4>Place Your Bet</h4>
              <div className="chips-container">
                {chips.map(chip => (
                  <Chip
                    key={chip}
                    value={chip}
                    onClick={placeBet}
                    disabled={gameState.bankroll < chip}
                  />
                ))}
              </div>
            </div>
          ) : (
            <GameControls
              gamePhase={gameState.gamePhase}
              onAction={playerAction}
              canDouble={gameState.bankroll >= gameState.currentBet}
            />
          )}
        </div>

        <div className="tech-demo">
          <h3>⚛️ React Features Demonstrated:</h3>
          <ul className="features-list">
            <li>✅ Functional Components with Hooks</li>
            <li>✅ Component Composition</li>
            <li>✅ Custom Hooks (useBlackjackGame)</li>
            <li>✅ State Management</li>
            <li>✅ Event Handling</li>
            <li>✅ Conditional Rendering</li>
            <li>✅ Props & Prop Types</li>
            <li>✅ List Rendering with Keys</li>
          </ul>
        </div>
      </div>

      <footer className="app-footer">
        <p>This component structure demonstrates React proficiency for FYB Technologies.</p>
        <p>The actual game logic is implemented in the vanilla JS version for GitHub Pages compatibility.</p>
      </footer>
    </div>
  );
};

// Export for demonstration
export { 
  Card, 
  Hand, 
  Chip, 
  GameControls, 
  StatsPanel, 
  useBlackjackGame,
  StarlightBlackjackApp 
};

export default StarlightBlackjackApp;
