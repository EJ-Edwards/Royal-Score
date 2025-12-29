# 🚀 Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Install Node.js
If you don't have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/)
- Choose the LTS (Long Term Support) version
- Verify installation: `node --version`

### Step 2: Install Dependencies
```bash
cd Royal-Score
npm install
```

This installs:
- express (web server)
- socket.io (real-time communication)
- nodemon (development tool)

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
🎮 Royal Score Server running on port 5500
📡 WebSocket server ready for multiplayer connections
```

### Step 4: Open the Game
Open your browser and navigate to:
```
http://localhost:5500
```

## 🎮 Testing Multiplayer

### Option 1: Two Browser Tabs (Same Computer)
1. Open `http://localhost:5500/multiplayer.html` in tab 1
2. Create a room (enter your name, click "Create Room")
3. Copy the 6-character room code
4. Open `http://localhost:5500/multiplayer.html` in tab 2
5. Join the room using the code
6. Both players click "Ready Up"
7. Game starts automatically!

### Option 2: Two Devices (Same Network)
1. Find your computer's local IP:
   - **Windows**: Open Command Prompt, type `ipconfig`
   - **Mac**: Open Terminal, type `ifconfig | grep inet`
   - Look for something like `192.168.1.xxx`

2. On your computer:
   - Start server: `npm start`
   - Open: `http://localhost:5500/multiplayer.html`
   - Create a room

3. On your phone/tablet (same WiFi):
   - Open: `http://YOUR_IP:5500/multiplayer.html`
   - Join the room with the code

## 🐛 Troubleshooting

### "Port 5500 is already in use"
```bash
# Stop the process using port 5500
# Then try npm start again
```

### "Cannot GET /"
Make sure you're accessing:
- `http://localhost:5500/index.html` (not just `http://localhost:5500/`)

### Cards not loading
- Check internet connection (uses external API)
- Try refreshing the page

### Socket connection failed
- Make sure server is running
- Check browser console for errors (F12)
- Try disabling browser extensions

## 📁 File Structure Quick Reference

```
Royal-Score/
├── server.js              ← Backend server (Node.js)
├── multiplayer.html       ← Multiplayer game page
├── multiplayer-client.js  ← Multiplayer client logic
├── index.html             ← Landing page
├── frontend/
│   └── game.html         ← Solo game page
├── script.js              ← Solo game logic
└── sketch.js              ← Card rendering (p5.js)
```

## 🎯 What to Test

- [ ] Landing page loads
- [ ] Solo game works (draw & score)
- [ ] Create multiplayer room
- [ ] Join room with code
- [ ] Both players can ready up
- [ ] Game starts automatically
- [ ] Turn-based gameplay works
- [ ] Scores update in real-time
- [ ] Game ends after 10 rounds
- [ ] Mobile responsive design

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto-restart (development)
npm run dev

# Check for updates
npm outdated

# Update dependencies
npm update
```

## 🎨 Customization Ideas

Want to make it your own?

1. **Change Colors**: Edit `style.css` and `multiplayer-style.css`
2. **Modify Scoring**: Edit scoring arrays in `script.js` and `server.js`
3. **Add Sounds**: Use Web Audio API or Howler.js
4. **Change Card Design**: Modify canvas rendering in `sketch.js`
5. **Add Game Modes**: Extend room settings in `server.js`

## 🚀 Next Steps

1. ✅ Test locally
2. ✅ Review code and understand architecture
3. ✅ Make small customizations
4. ✅ Deploy to cloud (see DEPLOYMENT.md)
5. ✅ Add to your portfolio
6. ✅ Share with friends!

## 💡 Pro Tips

- **Dev Tools**: Use Chrome DevTools (F12) to debug
- **Network Tab**: Monitor Socket.io connections
- **Console**: Check for errors or logs
- **Mobile Testing**: Use Chrome's device emulation
- **Performance**: Use Lighthouse for optimization tips

---

**Need Help?** Check the full README.md or DEPLOYMENT.md for more details!

**Ready to Deploy?** See DEPLOYMENT.md for Heroku, Railway, and Render instructions.

**Happy Gaming! 🎮🃏**
