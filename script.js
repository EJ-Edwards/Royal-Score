let deckID;
let remainingCards;
let score = 0;
let cards = [];
let gameOver = false;
let gamesPlayed = 0;
let totalScore = 0;
let achievements = [];

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'firstGame', name: 'First Steps', description: 'Play your first game', icon: '🎯' },
  { id: 'score500', name: 'Rising Star', description: 'Score 500 points in a single game', icon: '⭐' },
  { id: 'score1000', name: 'High Roller', description: 'Score 1000 points in a single game', icon: '🎰' },
  { id: 'games10', name: 'Persistent Player', description: 'Play 10 games', icon: '🔥' },
  { id: 'aceMaster', name: 'Ace Master', description: 'Score an Ace 5 times', icon: '🃁' },
  { id: 'royalty', name: 'Royal Blood', description: 'Score 3 Kings in a row', icon: '👑' }
];

const cardRanks = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "JACK", "QUEEN", "KING", "ACE"
];

const scoreRanks = [
  10, 20, 30, 40, 50, 60, 70, 80, 100,
  125, 150, 200, 400
];

async function drawCards() {
  if (gameOver) return;

  if (remainingCards === 0) {
    gameOver = true;
    showGameSummary();
    checkAndUpdateHighScore();
    return;
  }

  const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=5`;
  const response = await fetch(url);
  const data = await response.json();

  cards = data.cards;
  remainingCards = data.remaining;

  document.getElementById("remainingCards").textContent = remainingCards;

  // Clear previous card positions to trigger new animation
  if (typeof window.cardPositions !== 'undefined') {
    window.cardPositions = [];
    window.animatingCards = false;
  }
  
  if (typeof renderCards === "function") {
    renderCards(cards);
  }
}

function showGameSummary() {
  const summary = document.getElementById("game-summary");
  const finalScore = document.getElementById("final-score");
  const finalHighscore = document.getElementById("final-highscore");
  
  finalScore.textContent = "Final Score: " + score;
  const highscore = JSON.parse(localStorage.getItem("highestScore"));
  finalHighscore.textContent = "High Score: " + (highscore && highscore.highscore ? highscore.highscore : 0);
  
  // Add game statistics to summary
  const stats = JSON.parse(localStorage.getItem("gameStats")) || {};
  const achievementCount = JSON.parse(localStorage.getItem("achievements"))?.length || 0;
  
  // Create or update stats display in game summary
  let statsDiv = summary.querySelector('.game-stats');
  if (!statsDiv) {
    statsDiv = document.createElement('div');
    statsDiv.className = 'game-stats';
    statsDiv.style.cssText = `
      margin: 16px 0;
      padding: 16px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      font-size: 0.9em;
    `;
    
    const summaryContent = summary.querySelector('div');
    summaryContent.insertBefore(statsDiv, summaryContent.querySelector('#play-again-btn'));
  }
  
  // Ensure safe values for game summary
  const gamesPlayed = (stats.gamesPlayed !== undefined && stats.gamesPlayed !== null) ? stats.gamesPlayed : 0;
  const averageScore = (stats.averageScore !== undefined && stats.averageScore !== null) ? stats.averageScore : 0;
  const aceCount = (stats.aceCount !== undefined && stats.aceCount !== null) ? stats.aceCount : 0;
  
  statsDiv.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: left;">
      <div>Games Played: <strong>${gamesPlayed}</strong></div>
      <div>Average Score: <strong>${averageScore}</strong></div>
      <div>Aces Scored: <strong>${aceCount}</strong></div>
      <div>Achievements: <strong>${achievementCount}/${ACHIEVEMENTS.length}</strong></div>
    </div>
  `;
  
  summary.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function() {
  const playAgainBtn = document.getElementById("play-again-btn");
  if (playAgainBtn) {
    playAgainBtn.onclick = function() {
      location.reload();
    };
  }
});

async function createDeck(callback) {
  const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2";
  const response = await fetch(url);
  const data = await response.json();

  deckID = data.deck_id;
  callback(); 
}

function initializeStats() {
  // Ensure stats object exists with all required properties
  let stats = JSON.parse(localStorage.getItem("gameStats"));
  if (!stats) {
    stats = {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      aceCount: 0,
      kingStreak: 0,
      maxKingStreak: 0,
      lastCards: []
    };
    localStorage.setItem("gameStats", JSON.stringify(stats));
  } else {
    // Ensure all properties exist
    stats.gamesPlayed = stats.gamesPlayed || 0;
    stats.totalScore = stats.totalScore || 0;
    stats.averageScore = stats.averageScore || 0;
    stats.aceCount = stats.aceCount || 0;
    stats.kingStreak = stats.kingStreak || 0;
    stats.maxKingStreak = stats.maxKingStreak || 0;
    stats.lastCards = stats.lastCards || [];
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }
}

createDeck(async () => {
  initializeStats();
  updateHighScoreDisplay();
  // Don't auto-draw cards on start, let user click Draw button
});

function scoreCards() {
  if (gameOver) {
    alert("Game over. Refresh to start a new game.");
    return;
  }

  if (cards.length === 0) {
    alert("No cards to score.");
    return;
  }

  let highestValue = cards[0].value;
  for (let i = 1; i < cards.length; i++) {
    if (cardRanks.indexOf(cards[i].value) > cardRanks.indexOf(highestValue)) {
      highestValue = cards[i].value;
    }
  }

  score += scoreRanks[cardRanks.indexOf(highestValue)];
  document.getElementById("score").textContent = score;
  document.getElementById("last-card").textContent = highestValue;

  // Update card-specific statistics
  updateCardStats(highestValue);

  drawCards();
}

function checkAndUpdateHighScore() {
  let stored = JSON.parse(localStorage.getItem("highestScore"));
  let isNewHigh = !stored || score > stored.highscore;
  
  if (isNewHigh) {
    localStorage.setItem("highestScore", JSON.stringify({ highscore: score }));
    showNotification("🎉 New Highest Score Achieved!", "success");
  }
  
  // Update statistics
  updateGameStats();
  
  // Check achievements
  checkAchievements();
  
  updateHighScoreDisplay();
}

function updateGameStats() {
  let stats = JSON.parse(localStorage.getItem("gameStats")) || {};
  
  // Ensure all properties exist with default values
  stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
  stats.totalScore = (stats.totalScore || 0) + score;
  stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
  stats.aceCount = stats.aceCount || 0;
  stats.kingStreak = stats.kingStreak || 0;
  stats.maxKingStreak = stats.maxKingStreak || 0;
  stats.lastCards = stats.lastCards || [];
  
  console.log("Updating game stats:", stats); // Debug log
  localStorage.setItem("gameStats", JSON.stringify(stats));
}

function checkAchievements() {
  let unlockedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];
  let stats = JSON.parse(localStorage.getItem("gameStats")) || {};
  let newAchievements = [];
  
  // Check each achievement
  ACHIEVEMENTS.forEach(achievement => {
    if (!unlockedAchievements.includes(achievement.id)) {
      let unlocked = false;
      
      switch(achievement.id) {
        case 'firstGame':
          unlocked = stats.gamesPlayed >= 1;
          break;
        case 'score500':
          unlocked = score >= 500;
          break;
        case 'score1000':
          unlocked = score >= 1000;
          break;
        case 'games10':
          unlocked = stats.gamesPlayed >= 10;
          break;
        case 'aceMaster':
          unlocked = stats.aceCount >= 5;
          break;
        case 'royalty':
          unlocked = stats.maxKingStreak >= 3;
          break;
      }
      
      if (unlocked) {
        unlockedAchievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    }
  });
  
  localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
  
  // Show achievement notifications
  newAchievements.forEach(achievement => {
    setTimeout(() => {
      showNotification(`${achievement.icon} Achievement Unlocked: ${achievement.name}`, "achievement");
    }, 500);
  });
}

function showNotification(message, type = "info") {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'achievement' ? '#FF9800' : '#2196F3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    font-weight: 500;
  `;
  
  // Add animation keyframes if not already added
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

function updateHighScoreDisplay() {
  const highscore = JSON.parse(localStorage.getItem("highestScore"));
  if (highscore && typeof highscore.highscore === "number") {
    document.getElementById("high-score").textContent = highscore.highscore;
  } else {
    document.getElementById("high-score").textContent = "0";
  }
}

document.getElementById("draw-button").onclick = async () => {
  await drawCards();
};

document.getElementById("score-button").onclick = () => {
  scoreCards();
};

document.getElementById("stats-button").onclick = () => {
  showStatsModal();
};

function updateCardStats(cardValue) {
  let stats = JSON.parse(localStorage.getItem("gameStats")) || {};
  
  // Ensure all properties exist with default values
  stats.aceCount = stats.aceCount || 0;
  stats.kingStreak = stats.kingStreak || 0;
  stats.maxKingStreak = stats.maxKingStreak || 0;
  stats.lastCards = stats.lastCards || [];
  stats.gamesPlayed = stats.gamesPlayed || 0;
  stats.totalScore = stats.totalScore || 0;
  stats.averageScore = stats.averageScore || 0;
  
  // Track Ace scoring
  if (cardValue === "ACE") {
    stats.aceCount++;
  }
  
  // Track King streaks
  if (cardValue === "KING") {
    stats.kingStreak++;
    stats.maxKingStreak = Math.max(stats.maxKingStreak, stats.kingStreak);
  } else {
    stats.kingStreak = 0;
  }
  
  // Keep track of last few cards for patterns
  stats.lastCards.push(cardValue);
  if (stats.lastCards.length > 10) {
    stats.lastCards.shift();
  }
  
  console.log("Updating card stats:", stats); // Debug log
  localStorage.setItem("gameStats", JSON.stringify(stats));
}

document.getElementById("reset-highscore").onclick = () => {
  if (confirm("Are you sure you want to reset your high score and statistics?")) {
    localStorage.removeItem("highestScore");
    localStorage.removeItem("gameStats");
    localStorage.removeItem("achievements");
    
    // Reinitialize with default values
    initializeStats();
    updateHighScoreDisplay();
    showNotification("Statistics reset successfully!", "info");
  }
};

// Debug function - you can call this in browser console to check localStorage
function debugStats() {
  console.log("Current localStorage:");
  console.log("gameStats:", localStorage.getItem("gameStats"));
  console.log("highestScore:", localStorage.getItem("highestScore"));
  console.log("achievements:", localStorage.getItem("achievements"));
}

function showStatsModal() {
  const modal = document.getElementById("stats-modal");
  const statsContent = document.getElementById("stats-content");
  const achievementsGrid = document.getElementById("achievements-grid");
  
  // Get statistics with proper fallbacks
  const stats = JSON.parse(localStorage.getItem("gameStats")) || {
    gamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    aceCount: 0,
    maxKingStreak: 0
  };
  
  const highscore = JSON.parse(localStorage.getItem("highestScore")) || { highscore: 0 };
  const unlockedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];
  
  // Ensure values are numbers, not null/undefined
  const gamesPlayed = stats.gamesPlayed || 0;
  const totalScore = stats.totalScore || 0;
  const averageScore = stats.averageScore || 0;
  const aceCount = stats.aceCount || 0;
  const maxKingStreak = stats.maxKingStreak || 0;
  const highScore = highscore.highscore || 0;
  
  // Populate stats with safe values
  statsContent.innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${gamesPlayed}</span>
      <span class="stat-label">Games Played</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${highScore}</span>
      <span class="stat-label">High Score</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${averageScore}</span>
      <span class="stat-label">Average Score</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${totalScore}</span>
      <span class="stat-label">Total Score</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${aceCount}</span>
      <span class="stat-label">Aces Scored</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${maxKingStreak}</span>
      <span class="stat-label">Best King Streak</span>
    </div>
  `;
  
  // Populate achievements
  achievementsGrid.innerHTML = ACHIEVEMENTS.map(achievement => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    return `
      <div class="achievement ${isUnlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
        <div class="achievement-info">
          <h4>${achievement.name}</h4>
          <p>${achievement.description}</p>
        </div>
      </div>
    `;
  }).join('');
  
  modal.style.display = "flex";
}

// Modal close functionality
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById("stats-modal");
  const closeBtn = document.querySelector(".close-modal");
  
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
  
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  
  // Mobile stats button
  const mobileStatsBtn = document.getElementById("mobile-stats-btn");
  if (mobileStatsBtn) {
    mobileStatsBtn.onclick = () => {
      showStatsModal();
      // Close mobile menu
      document.getElementById("mobile-menu").classList.remove("open");
    };
  }
});
