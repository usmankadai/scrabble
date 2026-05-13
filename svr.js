const express = require('express');
const http = require('http');
const socket = require('socket.io');
const open = require('open');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static('client'));

// ── Tile bag (standard Scrabble distribution) ────────────────────────────────
const FULL_BAG = [
  'A','A','A','A','A','A','A','A','A',
  'B','B','C','C','D','D','D','D',
  'E','E','E','E','E','E','E','E','E','E','E','E',
  'F','F','G','G','G','H','H',
  'I','I','I','I','I','I','I','I','I',
  'J','K','L','L','L','L','M','M',
  'N','N','N','N','N','N',
  'O','O','O','O','O','O','O','O',
  'P','P','Q','R','R','R','R','R','R',
  'S','S','S','S','T','T','T','T','T','T',
  'U','U','U','U','V','V','W','W','X','Y','Y','Z',' ',' ',
];

// ── Game state ───────────────────────────────────────────────────────────────
let game = null;

function newGame() {
  return {
    players: [],      // [{ id, name, score, rack }]
    currentIndex: 0,
    board: {},        // "x,y" → letter  (committed tiles only)
    bag: [...FULL_BAG],
    started: false,
  };
}

function drawTiles(bag, n) {
  const drawn = [];
  for (let i = 0; i < n && bag.length > 0; i++) {
    const idx = Math.floor(Math.random() * bag.length);
    drawn.push(...bag.splice(idx, 1));
  }
  return drawn;
}

function publicPlayers(players) {
  return players.map(p => ({ name: p.name, score: p.score }));
}

// ── Socket events ────────────────────────────────────────────────────────────
io.on('connection', (sock) => {
  console.log('Connected:', sock.id);

  // Player wants to join / create a multiplayer game
  sock.on('joinMultiplayer', ({ name }) => {
    if (!game) game = newGame();
    if (game.started) {
      sock.emit('joinError', 'A game is already in progress. Try again later.');
      return;
    }
    if (game.players.find(p => p.id === sock.id)) {
      sock.emit('joinError', 'You are already in this game.');
      return;
    }
    const rack = drawTiles(game.bag, 7);
    const isHost = game.players.length === 0;
    game.players.push({ id: sock.id, name, score: 0, rack });

    sock.emit('joinedGame', { isHost });
    io.emit('lobbyUpdate', {
      players: publicPlayers(game.players),
      bagCount: game.bag.length,
    });
    console.log(`${name} joined (total: ${game.players.length}, host: ${isHost})`);
  });

  // Host starts the game
  sock.on('startGame', () => {
    if (!game || game.started) return;
    if (game.players.length < 2) {
      sock.emit('joinError', 'Need at least 2 players to start.');
      return;
    }
    if (game.players[0].id !== sock.id) {
      sock.emit('joinError', 'Only the host can start the game.');
      return;
    }
    game.started = true;
    io.emit('gameStarted', {
      players: publicPlayers(game.players),
      currentPlayerName: game.players[0].name,
      bagCount: game.bag.length,
    });
    // Send each player their private rack
    for (const p of game.players) {
      io.to(p.id).emit('yourRack', p.rack);
    }
    console.log('Game started:', game.players.map(p => p.name).join(', '));
  });

  // A player submits a valid word
  sock.on('wordPlayed', ({ cells, word, wordScore }) => {
    if (!game || !game.started) return;
    const player = game.players[game.currentIndex];
    if (player.id !== sock.id) {
      sock.emit('notYourTurn');
      return;
    }

    // Commit new tiles to server board
    for (const cell of cells) {
      if (cell.isNew) {
        game.board[`${cell.x},${cell.y}`] = cell.letter;
      }
    }

    // Update player score
    player.score += wordScore;

    // Remove played letters from rack and refill
    const played = cells.filter(c => c.isNew).map(c => c.letter);
    for (const letter of played) {
      const idx = player.rack.indexOf(letter);
      if (idx !== -1) player.rack.splice(idx, 1);
    }
    const newTiles = drawTiles(game.bag, played.length);
    player.rack.push(...newTiles);

    // Advance turn
    game.currentIndex = (game.currentIndex + 1) % game.players.length;
    const next = game.players[game.currentIndex];

    // Broadcast updated state to everyone
    io.emit('wordResult', {
      playerName: player.name,
      word,
      wordScore,
      players: publicPlayers(game.players),
      board: game.board,
      currentPlayerName: next.name,
      bagCount: game.bag.length,
    });

    // Send the new rack only to the player who just played
    sock.emit('yourRack', player.rack);
    console.log(`${player.name} played "${word}" for ${wordScore} pts. Next: ${next.name}`);
  });

  // Cleanup on disconnect
  sock.on('disconnect', () => {
    if (!game) return;
    const idx = game.players.findIndex(p => p.id === sock.id);
    if (idx === -1) return;
    const name = game.players[idx].name;
    game.players.splice(idx, 1);
    console.log(`${name} disconnected (${game.players.length} left)`);

    if (game.players.length === 0) {
      game = null;
      console.log('Game reset.');
    } else {
      if (game.currentIndex >= game.players.length) game.currentIndex = 0;
      io.emit('playerDisconnected', {
        name,
        players: publicPlayers(game.players),
        currentPlayerName: game.players[game.currentIndex]?.name,
      });
    }
  });
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = 0;

server.listen(PORT, '0.0.0.0', async () => {
  const assignedPort = server.address().port;
  const url = `http://localhost:${assignedPort}`;

  console.log('------------------------------------');
  console.log(`Server successfully started!`);
  console.log(`Access your app at: ${url}`);
  console.log('------------------------------------');

  try {
    await open(url);
  } catch (err) {
    console.log('Could not open browser automatically:', err.message);
  }
});