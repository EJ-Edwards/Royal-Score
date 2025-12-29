# 🃏 Royal Score - Multiplayer Card Game

A modern, real-time multiplayer card game built with Node.js, Express, Socket.io, and p5.js. Draw cards, score points based on your highest card, and compete with friends in real-time or challenge yourself in solo mode!

## 🎮 Live Demo
**Solo Mode**: [Play the Game](https://ej-edwards.github.io/Royal-Score/)  
**Multiplayer** (requires backend): Host your own server or try the demo _(Update with your deployment URL)_

## ✨ Features

### 🎯 Core Gameplay
- **Solo Mode**: Classic single-player experience with high score tracking
- **Multiplayer Mode**: Real-time competitive gameplay for 2-6 players
- **Room System**: Create private rooms and invite friends with room codes
- **Turn-Based**: Strategic turn-based card drawing and scoring
- **Live Scoring**: Real-time score updates and player rankings

### 🎨 User Experience
- **Responsive Design**: Seamlessly adapts to desktop, tablet, and mobile devices
- **Smooth Animations**: Card animations powered by p5.js canvas rendering
- **Interactive UI**: Modern interface with visual feedback and notifications
- **Real-Time Updates**: Instant synchronization across all connected players
- **Achievement System**: Track stats and unlock achievements

### 🛠️ Technical Features
- **WebSocket Communication**: Real-time bidirectional event-based communication
- **Room Management**: Intelligent room creation, joining, and cleanup
- **State Synchronization**: Robust game state management across clients
- **Local Storage**: Persistent high scores and statistics
- **RESTful API**: Server status and monitoring endpoints

## 🚀 Technologies Used

### Frontend
- **HTML5/CSS3**: Semantic markup and modern styling
- **JavaScript (ES6+)**: Async/await, arrow functions, modules
- **p5.js**: Canvas-based card rendering and animations
- **Socket.io Client**: Real-time client-side WebSocket communication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, minimalist web framework
- **Socket.io**: Real-time bidirectional event-based communication
- **Deck of Cards API**: External API for card data and images

### Tools & Deployment
- **npm**: Package management
- **Git**: Version control
- **Heroku/Railway/Render**: Cloud deployment options

## 🎲 How to Play

### Solo Mode
1. Click **Start Solo Game** from the homepage
2. Click **Draw** to draw 5 cards from a shuffled double deck
3. Review your hand displayed on the game table
4. Click **Score** to score based on your highest card value
5. Repeat until the deck is empty
6. Try to beat your high score!

### Multiplayer Mode
1. Click **Multiplayer** from the homepage
2. **Create a Room**:
   - Enter your name
   - Select max players (2-6)
   - Share the room code with friends
3. **Or Join a Room**:
   - Enter your name
   - Input the 6-character room code
4. Wait for all players to ready up
5. Take turns drawing and scoring cards
6. Play for 10 rounds - highest score wins!

### Scoring System
| Card | Points |
|------|--------|
| 2-9  | 10-80 (incremental) |
| 10   | 100 |
| Jack | 125 |
| Queen | 150 |
| King | 200 |
| Ace | 400 |

## 🏗️ Project Structure

```
Royal-Score/
├── server.js                 # Node.js/Express server with Socket.io
├── package.json              # Dependencies and scripts
├── multiplayer-client.js     # Client-side multiplayer logic
├── multiplayer.html          # Multiplayer game interface
├── multiplayer-style.css     # Multiplayer-specific styles
├── index.html                # Landing page
├── frontend/
│   ├── game.html            # Solo game interface
│   └── documentation.html    # Game rules
├── script.js                 # Solo game logic
├── sketch.js                 # p5.js canvas rendering
├── style.css                 # Main stylesheet
├── hamburger.js              # Mobile navigation
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/EJ-Edwards/Royal-Score.git
   cd Royal-Score
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5500`

### Production
```bash
npm start
```

For detailed deployment instructions to Heroku, Railway, Render, or GitHub Pages, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🎯 Key Features Showcase

### Real-Time Multiplayer Architecture
```javascript
// Server-side room management
class GameRoom {
  constructor(roomId, maxPlayers) {
    this.players = [];
    this.gameState = {};
    // Intelligent turn management and state sync
  }
}

// Client-side socket events
socket.on('gameStarted', (state) => {
  initializeGame(state);
});
```

### Responsive Design
- Mobile-first CSS with hamburger navigation
- Adaptive card sizing for different screen sizes
- Touch-friendly interface for mobile gaming
- Desktop keyboard shortcuts and controls

### State Management
- Centralized game state on server
- Optimistic UI updates on client
- Automatic reconnection handling
- Room cleanup and player disconnect management

## 📊 Technical Highlights

### WebSocket Implementation
- **Bi-directional Communication**: Real-time updates between server and clients
- **Event-Driven Architecture**: Clean separation of concerns
- **Room-Based Broadcasting**: Efficient message routing to relevant players

### Code Quality
- **Modular Design**: Separated concerns (server, client, UI, rendering)
- **Error Handling**: Comprehensive error catching and user feedback
- **Comments**: Well-documented code for maintainability
- **Best Practices**: ES6+ features, async/await, proper scoping

### Performance Optimization
- **Efficient Rendering**: Only redraw canvas when necessary
- **Image Caching**: Card images cached after first load
- **Minimal DOM Manipulation**: Batch updates for better performance
- **Lazy Loading**: Assets loaded on demand

## 🔮 Future Enhancements

- [x] Real-time multiplayer gameplay
- [x] Private room system
- [x] Responsive mobile design
- [ ] Global leaderboard with database
- [ ] Multiple game modes (Time Attack, Challenge)
- [ ] Enhanced animations and sound effects
- [ ] Chat system for multiplayer rooms
- [ ] Spectator mode
- [ ] AI opponents for solo practice
- [ ] Tournament bracket system
- [ ] Custom card deck themes
- [ ] Progressive Web App (PWA) support

## 🐛 Known Issues

- Solo mode high scores are stored locally (not synced across devices)
- Multiplayer requires stable internet connection
- Room codes are randomly generated (no custom codes yet)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**EJ Edwards**
- Portfolio: [ej-edwards.github.io](https://ej-edwards.github.io/Portfolio-Website/)
- GitHub: [@EJ-Edwards](https://github.com/EJ-Edwards)
- LinkedIn: [Connect with me](https://linkedin.com/in/ej-edwards) _(Update with your LinkedIn)_

## 🙏 Acknowledgments

- [Deck of Cards API](https://deckofcardsapi.com/) - Free card API
- [Socket.io](https://socket.io/) - Real-time engine
- [p5.js](https://p5js.org/) - Creative coding library
- [Express](https://expressjs.com/) - Web framework

---

⭐ **Star this repo if you found it interesting!** ⭐

💼 **Perfect for portfolios** - Showcases full-stack development, real-time communication, responsive design, and modern JavaScript practices.

🎮 **Play, Learn, Build!**