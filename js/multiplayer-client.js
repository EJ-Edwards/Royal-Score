// Multiplayer client-side logic
// Connect to the server - use environment-specific URL
const SOCKET_URL = window.location.hostname === 'localhost' 
   ? 'http://localhost:5500' 
   : 'https://royal-score.onrender.com'; // Change this to your actual Render URL

const socket = io(SOCKET_URL);

let currentRoomId = null;
let currentPlayerId = null;
let myCards = [];
let roomState = null;

// Card scoring reference
const cardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
const scoreRanks = [10, 20, 30, 40, 50, 60, 70, 80, 100, 125, 150, 200, 400];

// Socket event listeners
socket.on('connect', () => {
  console.log('Connected to server');
  updateConnectionStatus(true);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  updateConnectionStatus(false);
});

socket.on('roomCreated', ({ roomId, playerId }) => {
  currentRoomId = roomId;
  currentPlayerId = playerId;
  showGameLobby(roomId);
  showNotification(`Room created! Code: ${roomId}`, 'success');
});

socket.on('roomJoined', ({ roomId, playerId }) => {
  currentRoomId = roomId;
  currentPlayerId = playerId;
  showGameLobby(roomId);
  showNotification('Joined room successfully!', 'success');
});

socket.on('playerJoined', ({ playerName }) => {
  showNotification(`${playerName} joined the room`, 'info');
  playSound('playerJoin');
});

socket.on('playerLeft', ({ playerId }) => {
  showNotification('A player left the room', 'warning');
});

socket.on('roomUpdate', (state) => {
  roomState = state;
  updateLobbyDisplay(state);
  updateGameDisplay(state);
});

socket.on('gameStarted', (state) => {
  roomState = state;
  showGameScreen();
  showNotification('Game started! Good luck!', 'success');
  playSound('gameStart');
});

socket.on('cardsDrawn', ({ cards }) => {
  myCards = cards;
  renderMultiplayerCards(cards);

  const drawBtn = document.getElementById('mp-draw-btn');
  const scoreBtn = document.getElementById('mp-score-btn');
  const skipBtn = document.getElementById('mp-skip-btn');
  const mobileDrawBtn = document.getElementById('mp-mobile-draw');
  const mobileScoreBtn = document.getElementById('mp-mobile-score');
  const mobileSkipBtn = document.getElementById('mp-mobile-skip');

  if (drawBtn) drawBtn.disabled = true;
  if (scoreBtn) scoreBtn.disabled = false;
  if (skipBtn) skipBtn.disabled = false;
  if (mobileDrawBtn) mobileDrawBtn.disabled = true;
  if (mobileScoreBtn) mobileScoreBtn.disabled = false;
  if (mobileSkipBtn) mobileSkipBtn.disabled = false;
});

socket.on('turnComplete', ({ playerId, points, card, skipped }) => {
  const playerName = roomState.players.find(p => p.id === playerId)?.name || 'Player';
  if (skipped) {
    showNotification(`${playerName} skipped their hand`, 'warning');
    playSound('skip');
  } else {
    showNotification(`${playerName} scored ${points} points with ${card}!`, 'info');
    playSound('score');
  }
});

socket.on('gameOver', ({ winner, finalScores }) => {
  showGameOverScreen(winner, finalScores);
  playSound('gameOver');
});

socket.on('error', ({ message }) => {
  showNotification(message, 'error');
});

// Room management functions
function createRoom() {
  const playerName = document.getElementById('player-name').value.trim();
  const maxPlayers = parseInt(document.getElementById('max-players').value);
  
  if (!playerName) {
    showNotification('Please enter your name', 'error');
    return;
  }
  
  socket.emit('createRoom', { playerName, maxPlayers });
}

function joinRoom() {
  const playerName = document.getElementById('join-player-name').value.trim();
  const roomId = document.getElementById('room-code').value.trim().toUpperCase();
  
  if (!playerName || !roomId) {
    showNotification('Please enter your name and room code', 'error');
    return;
  }
  
  socket.emit('joinRoom', { roomId, playerName });
}

function setReady() {
  socket.emit('playerReady');
  document.getElementById('ready-btn').disabled = true;
  document.getElementById('ready-btn').textContent = '✓ Ready';
}

function leaveRoom() {
  socket.emit('leaveRoom');
  currentRoomId = null;
  currentPlayerId = null;
  myCards = [];
  roomState = null;
  showRoomSetup();
}

// Game action functions
function drawCards() {
  if (!isMyTurn()) {
    showNotification('Wait for your turn!', 'warning');
    return;
  }
  
  socket.emit('drawCards');
}

function scoreCards() {
  if (!isMyTurn()) {
    showNotification('Wait for your turn!', 'warning');
    return;
  }
  
  if (myCards.length === 0) {
    showNotification('Draw cards first!', 'warning');
    return;
  }
  
  // Find highest card
  let highestValue = myCards[0].value;
  for (let i = 1; i < myCards.length; i++) {
    if (cardRanks.indexOf(myCards[i].value) > cardRanks.indexOf(highestValue)) {
      highestValue = myCards[i].value;
    }
  }
  
  socket.emit('scoreCards', { highestCard: highestValue });
  
  // Clear local cards
  myCards = [];
  clearCanvas();

  const drawBtn = document.getElementById('mp-draw-btn');
  const scoreBtn = document.getElementById('mp-score-btn');
  const skipBtn = document.getElementById('mp-skip-btn');
  const mobileDrawBtn = document.getElementById('mp-mobile-draw');
  const mobileScoreBtn = document.getElementById('mp-mobile-score');
  const mobileSkipBtn = document.getElementById('mp-mobile-skip');

  if (drawBtn) drawBtn.disabled = false;
  if (scoreBtn) scoreBtn.disabled = true;
  if (skipBtn) skipBtn.disabled = true;
  if (mobileDrawBtn) mobileDrawBtn.disabled = false;
  if (mobileScoreBtn) mobileScoreBtn.disabled = true;
  if (mobileSkipBtn) mobileSkipBtn.disabled = true;
}

function skipHand() {
  if (!isMyTurn()) {
    showNotification('Wait for your turn!', 'warning');
    return;
  }

  if (myCards.length === 0) {
    showNotification('Draw cards before skipping!', 'warning');
    return;
  }

  socket.emit('skipHand');

  myCards = [];
  clearCanvas();

  const drawBtn = document.getElementById('mp-draw-btn');
  const scoreBtn = document.getElementById('mp-score-btn');
  const skipBtn = document.getElementById('mp-skip-btn');
  const mobileDrawBtn = document.getElementById('mp-mobile-draw');
  const mobileScoreBtn = document.getElementById('mp-mobile-score');
  const mobileSkipBtn = document.getElementById('mp-mobile-skip');

  if (drawBtn) drawBtn.disabled = true;
  if (scoreBtn) scoreBtn.disabled = true;
  if (skipBtn) skipBtn.disabled = true;
  if (mobileDrawBtn) mobileDrawBtn.disabled = true;
  if (mobileScoreBtn) mobileScoreBtn.disabled = true;
  if (mobileSkipBtn) mobileSkipBtn.disabled = true;
}

// UI update functions
function updateConnectionStatus(connected) {
  const statusEl = document.getElementById('connection-status');
  if (statusEl) {
    statusEl.textContent = connected ? '🟢 Connected' : '🔴 Disconnected';
    statusEl.className = connected ? 'connected' : 'disconnected';
  }
}

function showGameLobby(roomId) {
  document.getElementById('room-setup').style.display = 'none';
  document.getElementById('game-lobby').style.display = 'block';
  document.getElementById('game-area').style.display = 'none';
  document.getElementById('display-room-code').textContent = roomId;
}

function showGameScreen() {
  document.getElementById('room-setup').style.display = 'none';
  document.getElementById('game-lobby').style.display = 'none';
  document.getElementById('game-area').style.display = 'block';
}

function showRoomSetup() {
  document.getElementById('room-setup').style.display = 'block';
  document.getElementById('game-lobby').style.display = 'none';
  document.getElementById('game-area').style.display = 'none';
  document.getElementById('game-over-screen').style.display = 'none';
}

function updateLobbyDisplay(state) {
  const playersList = document.getElementById('players-list');
  if (!playersList) return;
  
  playersList.innerHTML = '';
  state.players.forEach(player => {
    const li = document.createElement('li');
    li.className = 'player-item';
    li.innerHTML = `
      <span class="player-name">${player.name}</span>
      <span class="player-status ${player.ready ? 'ready' : 'waiting'}">
        ${player.ready ? '✓ Ready' : '⏳ Waiting'}
      </span>
    `;
    playersList.appendChild(li);
  });
  
  // Update ready button state
  const readyBtn = document.getElementById('ready-btn');
  if (readyBtn) {
    const myPlayer = state.players.find(p => p.id === currentPlayerId);
    if (myPlayer && myPlayer.ready) {
      readyBtn.disabled = true;
      readyBtn.textContent = '✓ Ready';
    }
  }
}

function updateGameDisplay(state) {
  if (!state.gameStarted) return;
  
  // Update scoreboard
  const scoreboard = document.getElementById('mp-scoreboard');
  if (scoreboard) {
    scoreboard.innerHTML = '<h3>🏆 Scores</h3>';
    const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
    sortedPlayers.forEach((player, index) => {
      const div = document.createElement('div');
      div.className = 'score-item';
      div.innerHTML = `
        <span class="player-rank">#${index + 1}</span>
        <span class="player-name ${player.id === currentPlayerId ? 'you' : ''}">${player.name}${player.id === currentPlayerId ? ' (You)' : ''}</span>
        <span class="player-score">${player.score}</span>
      `;
      scoreboard.appendChild(div);
    });
  }
  
  // Update game info
  const turnInfo = document.getElementById('turn-info');
  if (turnInfo) {
    const currentPlayer = state.players.find(p => p.id === state.currentPlayer);
    const isMyTurn = state.currentPlayer === currentPlayerId;
    turnInfo.innerHTML = `
      <div class="info-item">
        <span class="label">Round:</span>
        <span class="value">${state.currentRound}/${state.maxRounds}</span>
      </div>
      <div class="info-item">
        <span class="label">Current Turn:</span>
        <span class="value ${isMyTurn ? 'your-turn' : ''}">${currentPlayer?.name || 'Waiting...'}${isMyTurn ? ' (You!)' : ''}</span>
      </div>
      <div class="info-item">
        <span class="label">Cards Left:</span>
        <span class="value">${state.remainingCards}</span>
      </div>
    `;
  }
  
  // Enable/disable buttons based on turn
  const drawBtn = document.getElementById('mp-draw-btn');
  const scoreBtn = document.getElementById('mp-score-btn');
  const skipBtn = document.getElementById('mp-skip-btn');
  const mobileDrawBtn = document.getElementById('mp-mobile-draw');
  const mobileScoreBtn = document.getElementById('mp-mobile-score');
  const mobileSkipBtn = document.getElementById('mp-mobile-skip');

  const isMyTurn = state.currentPlayer === currentPlayerId;
  const hasCards = myCards.length > 0;

  if (drawBtn) drawBtn.disabled = !isMyTurn || hasCards;
  if (scoreBtn) scoreBtn.disabled = !isMyTurn || !hasCards;
  if (skipBtn) skipBtn.disabled = !isMyTurn || !hasCards;
  if (mobileDrawBtn) mobileDrawBtn.disabled = !isMyTurn || hasCards;
  if (mobileScoreBtn) mobileScoreBtn.disabled = !isMyTurn || !hasCards;
  if (mobileSkipBtn) mobileSkipBtn.disabled = !isMyTurn || !hasCards;
}

function showGameOverScreen(winner, finalScores) {
  const screen = document.getElementById('game-over-screen');
  const content = document.getElementById('game-over-content');
  
  let html = '<h2>🎮 Game Over!</h2>';
  
  if (winner) {
    const isWinner = winner.id === currentPlayerId;
    html += `
      <div class="winner-announcement ${isWinner ? 'you-won' : ''}">
        ${isWinner ? '🎉 You Won!' : `👑 ${winner.name} Wins!`}
        <div class="winner-score">${winner.score} points</div>
      </div>
    `;
  }
  
  html += '<div class="final-scores"><h3>Final Scores</h3><ul>';
  finalScores.sort((a, b) => b.score - a.score).forEach((player, index) => {
    html += `<li>#${index + 1} ${player.name}: ${player.score} points</li>`;
  });
  html += '</ul></div>';
  
  html += `
    <div class="game-over-actions">
      <button onclick="leaveRoom()" class="btn btn-primary">Back to Lobby</button>
    </div>
  `;
  
  content.innerHTML = html;
  screen.style.display = 'flex';
}

// Helper functions
function isMyTurn() {
  return roomState && roomState.currentPlayer === currentPlayerId;
}

function renderMultiplayerCards(cards) {
  if (typeof renderCards === 'function') {
    renderCards(cards);
  }
}

function clearCanvas() {
  if (typeof clear === 'function') {
    clear();
  }
  // Reset card positions
  if (typeof window.cardPositions !== 'undefined') {
    window.cardPositions = [];
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function playSound(soundType) {
  // Placeholder for sound effects
  // You can add actual sound files later
  console.log(`Playing sound: ${soundType}`);
}

// Initialize event listeners (script is deferred, so DOM is ready)
// Set up event listeners
const createBtn = document.getElementById('create-room-btn');
if (createBtn) createBtn.addEventListener('click', createRoom);

const joinBtn = document.getElementById('join-room-btn');
if (joinBtn) joinBtn.addEventListener('click', joinRoom);

const readyBtn = document.getElementById('ready-btn');
if (readyBtn) readyBtn.addEventListener('click', setReady);

const leaveBtn = document.getElementById('leave-room-btn');
if (leaveBtn) leaveBtn.addEventListener('click', leaveRoom);

const drawBtn = document.getElementById('mp-draw-btn');
if (drawBtn) drawBtn.addEventListener('click', drawCards);

const scoreBtn = document.getElementById('mp-score-btn');
if (scoreBtn) scoreBtn.addEventListener('click', scoreCards);

const skipBtn = document.getElementById('mp-skip-btn');
if (skipBtn) skipBtn.addEventListener('click', skipHand);

// Mobile buttons
const mobileDrawBtn = document.getElementById('mp-mobile-draw');
if (mobileDrawBtn) mobileDrawBtn.addEventListener('click', drawCards);

const mobileScoreBtn = document.getElementById('mp-mobile-score');
if (mobileScoreBtn) mobileScoreBtn.addEventListener('click', scoreCards);

const mobileSkipBtn = document.getElementById('mp-mobile-skip');
if (mobileSkipBtn) mobileSkipBtn.addEventListener('click', skipHand);
