# 🎮 Royal Score - Setup & Deployment Guide

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git (for version control)

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `socket.io` - Real-time bidirectional communication
- `nodemon` (dev) - Auto-restart server on changes

### 2. Start the Development Server

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The server will start on `http://localhost:5500`

### 3. Access the Game

Open your browser and navigate to:
- **Landing Page**: `http://localhost:5500/index.html`
- **Solo Game**: `http://localhost:5500/frontend/game.html`
- **Multiplayer**: `http://localhost:5500/multiplayer.html`

## 🌐 Deployment Options

### Option 1: Heroku (Recommended for Full-Stack)

1. **Create a Heroku account** at [heroku.com](https://heroku.com)

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create a new Heroku app**
   ```bash
   heroku create royal-score-game
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

**Important**: Heroku sets the PORT environment variable automatically. The server is configured to use `process.env.PORT`.

### Option 2: Railway.app

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Royal Score repository
5. Railway will automatically detect Node.js and deploy
6. Your app will be live at `yourapp.railway.app`

### Option 3: Render.com

1. Visit [render.com](https://render.com)
2. Sign up and click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Create Web Service"

### Option 4: GitHub Pages (Solo Mode Only)

**Note**: GitHub Pages only supports static sites, so multiplayer won't work without a separate backend.

1. **Update file paths** - Move all files from `frontend/` to root
2. **Push to GitHub**
3. Go to repository Settings → Pages
4. Select branch `main` and folder `/ (root)`
5. Save and wait for deployment

Your solo game will be available at `https://yourusername.github.io/Royal-Score/`

## 🔧 Environment Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=5500
NODE_ENV=production
```

### CORS Configuration (if needed)

If deploying frontend and backend separately, update `server.js`:

```javascript
const io = socketIo(server, {
  cors: {
    origin: "https://your-frontend-domain.com",
    methods: ["GET", "POST"]
  }
});
```

## 📱 Testing Multiplayer Locally

To test multiplayer on the same network:

1. Find your local IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` or `ip addr`

2. Start the server: `npm start`

3. On other devices, navigate to: `http://YOUR_IP:5500`

4. Create a room on one device and join from another using the room code

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5500 (Windows)
netstat -ano | findstr :5500
taskkill /PID <PID> /F

# Kill process on port 5500 (Mac/Linux)
lsof -ti:5500 | xargs kill -9
```

### Socket.io Connection Issues

1. Check that the server is running
2. Verify the Socket.io client version matches server version
3. Check browser console for connection errors
4. Ensure firewall isn't blocking WebSocket connections

### Cards Not Loading

The app uses the Deck of Cards API. If cards don't load:
1. Check internet connection
2. Verify API is accessible: https://deckofcardsapi.com
3. Check browser console for CORS errors

## 📊 Performance Optimization

### Production Optimizations

1. **Enable compression** in server.js:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers**:
   ```javascript
   app.use(express.static(__dirname, {
     maxAge: '1d',
     etag: true
   }));
   ```

3. **Use CDN** for p5.js and Socket.io libraries in production

## 🔒 Security Considerations

1. **Rate Limiting**: Add express-rate-limit to prevent spam
2. **Input Validation**: Sanitize player names and room codes
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Never commit .env files

## 📈 Monitoring

### Add Server Logging

```javascript
// In server.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Monitor Active Connections

Access `/api/status` endpoint to see:
- Active rooms
- Connected players
- Server status

## 🎯 Next Steps

After deployment:

1. ✅ Test solo game thoroughly
2. ✅ Test multiplayer with 2-4 players
3. ✅ Check mobile responsiveness
4. ✅ Monitor server logs
5. ✅ Share with friends and gather feedback

## 📞 Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/EJ-Edwards/Royal-Score/issues)
- Review Socket.io documentation: https://socket.io/docs/
- Express.js docs: https://expressjs.com/

---

**Happy Gaming! 🎮🃏**
