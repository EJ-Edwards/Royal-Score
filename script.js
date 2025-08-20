let deckID;
let remainingCards;
let score = 0;
let cards = [];
let gameOver = false;

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

  document.getElementById("remainingCards").innerHTML =
    "Cards remaining: " + remainingCards;

  if (typeof renderCards === "function") renderCards(cards);
}

function showGameSummary() {
  const summary = document.getElementById("game-summary");
  const finalScore = document.getElementById("final-score");
  const finalHighscore = document.getElementById("final-highscore");
  finalScore.textContent = "Final Score: " + score;
  const highscore = JSON.parse(localStorage.getItem("highestScore"));
  finalHighscore.textContent = "High Score: " + (highscore && highscore.highscore ? highscore.highscore : 0);
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

createDeck(async () => {
  await drawCards();
  updateHighScoreDisplay();
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
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("last-card").innerHTML = "Last card: " + highestValue;

  drawCards();
}

function checkAndUpdateHighScore() {
  let stored = JSON.parse(localStorage.getItem("highestScore"));
  if (!stored || score > stored.highscore) {
    localStorage.setItem("highestScore", JSON.stringify({ highscore: score }));
    alert("🎉 New Highest Score Achieved!");
  }
  updateHighScoreDisplay();
}

function updateHighScoreDisplay() {
  const highscore = JSON.parse(localStorage.getItem("highestScore"));
  if (highscore && typeof highscore.highscore === "number") {
    document.getElementById("high-score").innerHTML = "High Score: " + highscore.highscore;
  } else {
    document.getElementById("high-score").innerHTML = "High Score: 0";
  }
}

document.getElementById("draw-button").onclick = async () => {
  await drawCards();
};

document.getElementById("score-button").onclick = () => {
  scoreCards();
};

document.getElementById("reset-highscore").onclick = () => {
  localStorage.removeItem("highestScore");
  updateHighScoreDisplay();
};
