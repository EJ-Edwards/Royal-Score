# 📁 Project Structure

```
Royal-Score/
│
├── backend/                    # Backend server files
│   ├── server.js              # Express + Socket.io server
│   ├── package.json           # Backend dependencies
│   └── node_modules/          # Backend dependencies (after npm install)
│
├── public/                     # Frontend files (served statically)
│   ├── index.html             # Landing page
│   ├── multiplayer.html       # Multiplayer game interface
│   │
│   ├── css/                   # Stylesheets
│   │   ├── style.css          # Main styles
│   │   └── multiplayer-style.css  # Multiplayer-specific styles
│   │
│   ├── js/                    # JavaScript files
│   │   ├── script.js          # Solo game logic
│   │   ├── sketch.js          # p5.js canvas rendering
│   │   ├── hamburger.js       # Mobile navigation
│   │   └── multiplayer-client.js  # Multiplayer client logic
│   │
│   └── pages/                 # Additional HTML pages
│       ├── game.html          # Solo game interface
│       └── documentation.html # Game rules and credits
│
├── docs/                       # Documentation
│   ├── README.md              # Project overview
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── QUICKSTART.md          # Quick setup guide
│   └── PORTFOLIO_NOTES.md     # Portfolio tips
│
├── .gitignore                 # Git ignore rules
└── package.json               # Root package.json (optional)
```

## 🎯 Clean Separation

### Backend (`/backend`)
- **server.js**: Express server with Socket.io for real-time multiplayer
- **package.json**: Backend-specific dependencies
- Handles:
  - Room management
  - Game state synchronization
  - WebSocket connections
  - API endpoints

### Frontend (`/public`)
- **HTML**: All page templates
- **CSS**: Organized stylesheets
- **JS**: Client-side game logic and rendering
- **Static assets**: Served by Express
- Handles:
  - User interface
  - Game rendering (p5.js)
  - Client-side logic
  - Socket.io client connections

## 🚀 Running the Application

### Development
```bash
# From project root
cd backend
npm install
npm run dev
```

Server serves frontend from `../public` directory

### Production
```bash
cd backend
npm install
npm start
```

## 📦 Key Features

✅ **Clear separation** of frontend and backend  
✅ **Organized file structure** for easy navigation  
✅ **Scalable architecture** for future growth  
✅ **Easy deployment** to any platform  
✅ **Portfolio-ready** professional structure  

## 🔗 Access Points

When server is running on `http://localhost:5500`:

- **Landing Page**: `http://localhost:5500/`
- **Solo Game**: `http://localhost:5500/pages/game.html`
- **Multiplayer**: `http://localhost:5500/multiplayer.html`
- **Rules**: `http://localhost:5500/pages/documentation.html`
- **API Status**: `http://localhost:5500/api/status`

## 📝 Notes

- Frontend files are statically served by Express
- All paths are relative to the `public/` folder
- Backend runs on configurable PORT (default: 5500)
- Socket.io automatically handles WebSocket connections
