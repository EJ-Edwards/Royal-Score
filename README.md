# 🃏 Royal Score - Card Game

A modern, responsive card game built with vanilla JavaScript and p5.js. Draw cards, score points based on your highest card, and compete for the high score!

## 🎮 Live Demo
[Play the Game](https://ej-edwards.github.io/Royal-Score/) _(Update with your GitHub Pages URL)_

## 🎯 Features

- **Responsive Design**: Optimized for both desktop and mobile devices
- **Interactive Gameplay**: Draw cards and score strategically 
- **High Score System**: Local storage tracking with achievement notifications
- **Modern UI/UX**: Clean design with smooth animations
- **Statistics Tracking**: Game history and performance analytics
- **Achievement System**: Unlock badges and track progress
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: p5.js for canvas rendering
- **API**: Deck of Cards API for card management
- **Storage**: localStorage for data persistence
- **Responsive Design**: CSS Grid & Flexbox

## 🎲 How to Play

1. Click **Draw** to draw 5 cards from a shuffled double deck
2. Review your hand displayed on the game table
3. Click **Score** to score based on your highest card value
4. Repeat until the deck is empty
5. Try to beat your high score!

### Scoring System
- **2-9**: 10-80 points (10 × card value - 10)
- **10**: 100 points
- **Jack**: 125 points  
- **Queen**: 150 points
- **King**: 200 points
- **Ace**: 400 points

## 🏗️ Project Structure

```
Royal-Score/
├── index.html          # Landing page
├── game.html           # Main game interface
├── documentation.html  # Game rules and credits
├── script.js          # Core game logic
├── sketch.js          # p5.js canvas rendering
├── style.css          # Responsive styling
├── hamburger.js       # Mobile navigation
└── README.md          # Project documentation
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/EJ-Edwards/Royal-Score.git
   cd Royal-Score
   ```

2. **Open locally**
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node.js (if installed)
   npx serve .
   
   # Or simply open index.html in your browser
   ```

3. **Access the game**
   Navigate to `http://localhost:8000` or open `index.html` directly

## 🎨 Key Features Showcase

### Responsive Design
- Mobile-first approach with hamburger navigation
- Adaptive card sizing and layout
- Touch-friendly interface

### Data Management
- localStorage integration for persistent high scores
- Game state management
- Statistics tracking and display

### API Integration
- Real-time card fetching from external API
- Asynchronous JavaScript operations
- Error handling and fallbacks

### Modern JavaScript
- ES6+ features (async/await, arrow functions)
- Modular code organization
- Event-driven architecture

## 🔮 Future Enhancements

- [ ] Multiplayer support
- [ ] Different game modes (Time Attack, Challenge)
- [ ] Card animation improvements
- [ ] PWA capabilities
- [ ] Backend integration for global leaderboards
- [ ] Sound effects and music

## 👨‍💻 Developer

**EJ Edwards**
- Portfolio: [ej-edwards.github.io](https://ej-edwards.github.io/Portfolio-Website/)
- GitHub: [@EJ-Edwards](https://github.com/EJ-Edwards)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **Star this repo if you found it interesting!**