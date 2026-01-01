const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, you might want to restrict this to your domain
    methods: ["GET", "POST"]
  }
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Serve root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Game rooms storage
const rooms = new Map();
const playerRooms = new Map(); // Track which room each player is in

// Room class to manage game state
class GameRoom {
  constructor(roomId, maxPlayers = 4) {
    this.roomId = roomId;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.deckId = null;
    this.remainingCards = 0;
    this.currentTurn = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.currentRound = 1;
    this.maxRounds = 10;
  }

  addPlayer(playerId, playerName) {
    if (this.players.length >= this.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }
    
    if (this.players.find(p => p.id === playerId)) {
      return { success: false, error: 'Player already in room' };
    }

    this.players.push({
      id: playerId,
      name: playerName,
      score: 0,
      currentCards: [],
      ready: false,
      isActive: true
    });

    return { success: true };
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
      
      // If current turn player left, move to next
      if (this.currentTurn >= this.players.length && this.players.length > 0) {
        this.currentTurn = 0;
      }
      
      return true;
    }
    return false;
  }

  setPlayerReady(playerId, ready = true) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.ready = ready;
      return true;
    }
    return false;
  }

  allPlayersReady() {
    return this.players.length >= 2 && this.players.every(p => p.ready);
  }

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
    
    // Check if round is complete (all players have had a turn)
    if (this.currentTurn === 0) {
      this.currentRound++;
      if (this.currentRound > this.maxRounds) {
        this.gameOver = true;
      }
    }
  }

  updatePlayerCards(playerId, cards) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.currentCards = cards;
      return true;
    }
    return false;
  }

  updatePlayerScore(playerId, points) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.score += points;
      return true;
    }
    return false;
  }

  getWinner() {
    if (this.players.length === 0) return null;
    return this.players.reduce((max, player) => 
      player.score > max.score ? player : max
    );
  }

  getRoomState() {
    return {
      roomId: this.roomId,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score,
        ready: p.ready,
        isActive: p.isActive,
        cardCount: p.currentCards.length
      })),
      currentTurn: this.currentTurn,
      currentPlayer: this.getCurrentPlayer()?.id,
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
      remainingCards: this.remainingCards,
      currentRound: this.currentRound,
      maxRounds: this.maxRounds
    };
  }

  resetGame() {
    this.players.forEach(p => {
      p.score = 0;
      p.currentCards = [];
      p.ready = false;
    });
    this.deckId = null;
    this.remainingCards = 0;
    this.currentTurn = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.currentRound = 1;
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Create or join room
  socket.on('createRoom', ({ playerName, maxPlayers = 4 }) => {
    const roomId = generateRoomCode();
    const room = new GameRoom(roomId, maxPlayers);
    
    const result = room.addPlayer(socket.id, playerName);
    if (result.success) {
      rooms.set(roomId, room);
      playerRooms.set(socket.id, roomId);
      socket.join(roomId);
      
      socket.emit('roomCreated', { roomId, playerId: socket.id });
      io.to(roomId).emit('roomUpdate', room.getRoomState());
      console.log(`Room ${roomId} created by ${playerName}`);
    }
  });

  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const result = room.addPlayer(socket.id, playerName);
    if (result.success) {
      playerRooms.set(socket.id, roomId);
      socket.join(roomId);
      
      socket.emit('roomJoined', { roomId, playerId: socket.id });
      io.to(roomId).emit('roomUpdate', room.getRoomState());
      io.to(roomId).emit('playerJoined', { playerName });
      console.log(`${playerName} joined room ${roomId}`);
    } else {
      socket.emit('error', { message: result.error });
    }
  });

  socket.on('playerReady', () => {
    const roomId = playerRooms.get(socket.id);
    const room = rooms.get(roomId);
    
    if (room) {
      room.setPlayerReady(socket.id);
      io.to(roomId).emit('roomUpdate', room.getRoomState());
      
      // Start game if all players ready
      if (room.allPlayersReady() && !room.gameStarted) {
        startGame(roomId);
      }
    }
  });

  socket.on('drawCards', async () => {
    const roomId = playerRooms.get(socket.id);
    const room = rooms.get(roomId);
    
    if (!room || !room.gameStarted) return;
    
    const currentPlayer = room.getCurrentPlayer();
    if (currentPlayer.id !== socket.id) {
      socket.emit('error', { message: 'Not your turn!' });
      return;
    }

    try {
      // Draw 5 cards from deck
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${room.deckId}/draw/?count=5`);
      const data = await response.json();
      
      room.updatePlayerCards(socket.id, data.cards);
      room.remainingCards = data.remaining;
      
      // Send cards only to the player who drew them
      socket.emit('cardsDrawn', { cards: data.cards });
      
      // Notify all players about the update
      io.to(roomId).emit('roomUpdate', room.getRoomState());
    } catch (error) {
      console.error('Error drawing cards:', error);
      socket.emit('error', { message: 'Failed to draw cards' });
    }
  });

  socket.on('scoreCards', ({ highestCard }) => {
    const roomId = playerRooms.get(socket.id);
    const room = rooms.get(roomId);
    
    if (!room || !room.gameStarted) return;
    
    const currentPlayer = room.getCurrentPlayer();
    if (currentPlayer.id !== socket.id) {
      socket.emit('error', { message: 'Not your turn!' });
      return;
    }

    // Calculate score based on highest card
    const cardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
    const scoreRanks = [10, 20, 30, 40, 50, 60, 70, 80, 100, 125, 150, 200, 400];
    
    const points = scoreRanks[cardRanks.indexOf(highestCard)];
    room.updatePlayerScore(socket.id, points);
    
    // Clear player's cards
    room.updatePlayerCards(socket.id, []);
    
    // Move to next turn
    room.nextTurn();
    
    // Check if game is over
    if (room.gameOver || room.remainingCards < 5) {
      endGame(roomId);
    } else {
      io.to(roomId).emit('roomUpdate', room.getRoomState());
      io.to(roomId).emit('turnComplete', { 
        playerId: socket.id, 
        points, 
        card: highestCard,
        skipped: false
      });
    }
  });

  socket.on('skipHand', () => {
    const roomId = playerRooms.get(socket.id);
    const room = rooms.get(roomId);
    
    if (!room || !room.gameStarted) return;
    
    const currentPlayer = room.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      socket.emit('error', { message: 'Not your turn!' });
      return;
    }

    if (!currentPlayer.currentCards || currentPlayer.currentCards.length === 0) {
      socket.emit('error', { message: 'Draw cards before skipping.' });
      return;
    }

    room.updatePlayerCards(socket.id, []);
    room.nextTurn();

    if (room.gameOver || room.remainingCards < 5) {
      endGame(roomId);
    } else {
      io.to(roomId).emit('roomUpdate', room.getRoomState());
      io.to(roomId).emit('turnComplete', {
        playerId: socket.id,
        points: 0,
        card: null,
        skipped: true
      });
    }
  });

  socket.on('leaveRoom', () => {
    handlePlayerDisconnect(socket);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    handlePlayerDisconnect(socket);
  });
});

// Helper functions
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function startGame(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  try {
    // Create new shuffled deck
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2');
    const data = await response.json();
    
    room.deckId = data.deck_id;
    room.remainingCards = data.remaining;
    room.gameStarted = true;
    room.currentTurn = 0;
    
    io.to(roomId).emit('gameStarted', room.getRoomState());
    console.log(`Game started in room ${roomId}`);
  } catch (error) {
    console.error('Error starting game:', error);
    io.to(roomId).emit('error', { message: 'Failed to start game' });
  }
}

function endGame(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.gameOver = true;
  const winner = room.getWinner();
  
  io.to(roomId).emit('gameOver', {
    winner: winner ? { id: winner.id, name: winner.name, score: winner.score } : null,
    finalScores: room.players.map(p => ({ 
      name: p.name, 
      score: p.score 
    }))
  });
  
  console.log(`Game ended in room ${roomId}. Winner: ${winner?.name}`);
}

function handlePlayerDisconnect(socket) {
  const roomId = playerRooms.get(socket.id);
  if (roomId) {
    const room = rooms.get(roomId);
    if (room) {
      room.removePlayer(socket.id);
      
      // If room is empty, delete it
      if (room.players.length === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted (empty)`);
      } else {
        // Notify remaining players
        io.to(roomId).emit('roomUpdate', room.getRoomState());
        io.to(roomId).emit('playerLeft', { playerId: socket.id });
        
        // If game was in progress and only one player left, end game
        if (room.gameStarted && room.players.length === 1) {
          endGame(roomId);
        }
      }
    }
    playerRooms.delete(socket.id);
  }
}

// API endpoint to check server status
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    activeRooms: rooms.size,
    activePlayers: playerRooms.size
  });
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`🎮 Royal Score Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for multiplayer connections`);
});