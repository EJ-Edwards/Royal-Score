# Royal-Score

Royal-Score is a fast, browser-based card experience where players draw five-card hands, bank the highest card for points, and race to the top of the scoreboard. It supports both single-player score-chasing and synchronous multiplayer rooms, all without installs or accounts.

## Tech Stack
- **Frontend:** Multi-page HTML + CSS experience with Poppins typography, responsive layouts, and p5.js animations. Vanilla JavaScript drives UI logic, stats tracking, and mobile controls.
- **Backend:** Node.js + Express 4 serve static assets and expose a status API. Socket.IO 4 manages multiplayer rooms, turn order, and score broadcasts over WebSocket.
- **External services:** Deck of Cards API provides shuffled decks (two-deck shoe per session). Hosted on Render, which runs `server.js` and handles HTTPS + WebSocket upgrades.
- **Availability:** Proprietary build; the production site is https://royal-score.onrender.com/.

## How to Play
### Solo Mode
1. Open `game.html` (or choose “Solo Game” on the home page).
2. Click **Draw Cards** to pull five cards from the shared shoe.
3. The highest card in your hand scores fixed points (2→10 pts … Ace→400 pts).
4. Repeat draws until the deck runs out; your final score and achievements are shown in the summary modal.

### Multiplayer Mode
1. Open `multiplayer.html` and either create a room (2–6 players) or join with a six-character code.
2. Ready up; once everyone is ready the server shuffles a fresh deck and starts Round 1.
3. On your turn, press **Draw Cards**, review the five-card hand locally, then hit **Score Hand** to bank the highest card.
4. Turns rotate automatically. After 10 rounds the server announces the winner and displays the final leaderboard.

### Tips
- Aces yield the biggest spike (400 pts), so timing the draw can swing the match.
- Leaving a multiplayer room mid-game notifies others; if only one player remains the server ends the session automatically.
- Stats and achievements in solo mode live in localStorage, so clearing browser data resets your progress.


