/**
 * multiplayer.mjs
 * Thin wrapper around Socket.IO for all multiplayer communication.
 * Imported by scrabble.mjs which provides the callback implementations.
 */

let _socket = null;
let _cb = {};

export let isMultiplayer = false;
export let myPlayerName  = '';
export let isMyTurn      = false;
export let isHost        = false;

/**
 * Call once on page load. Connects the socket and wires up server events.
 * @param {Object} callbacks - handlers called by server events:
 *   onError, onLobbyUpdate, onJoinedGame, onGameStarted,
 *   onYourRack, onWordResult, onPlayerDisconnected
 */
export function init(callbacks) {
  _cb = callbacks;

  // `io` is a global injected by /socket.io/socket.io.js
  _socket = io();

  _socket.on('connect', () => {
    console.log('[MP] Socket connected:', _socket.id);
    _cb.onSocketReady?.();
  });

  _socket.on('connect_error', (err) => {
    console.error('[MP] Connection error:', err.message);
    _cb.onError?.('Could not connect to server. Is the server running?');
  });

  _socket.on('disconnect', (reason) => {
    console.warn('[MP] Disconnected:', reason);
  });

  _socket.on('joinError',  (msg)  => _cb.onError?.(msg));

  _socket.on('lobbyUpdate', (data) => _cb.onLobbyUpdate?.(data));

  _socket.on('joinedGame', (data) => {
    isHost = data.isHost;
    _cb.onJoinedGame?.(data);
  });

  _socket.on('gameStarted', (data) => {
    isMyTurn = (data.currentPlayerName === myPlayerName);
    _cb.onGameStarted?.(data);
  });

  _socket.on('yourRack', (rack) => _cb.onYourRack?.(rack));

  _socket.on('wordResult', (data) => {
    isMyTurn = (data.currentPlayerName === myPlayerName);
    _cb.onWordResult?.(data);
  });

  _socket.on('notYourTurn', () => _cb.onError?.('It is not your turn!'));

  _socket.on('playerDisconnected', (data) => {
    isMyTurn = (data.currentPlayerName === myPlayerName);
    _cb.onPlayerDisconnected?.(data);
  });
}

/** Returns true if the socket is connected to the server. */
export function isConnected() {
  return _socket?.connected ?? false;
}

/** Join (or create) a multiplayer game with the given player name. */
export function joinGame(name) {
  if (!_socket) {
    throw new Error('Socket not initialised — call init() first');
  }
  isMultiplayer = true;
  myPlayerName  = name;
  _socket.emit('joinMultiplayer', { name });
}

/** Host-only: start the game once enough players have joined. */
export function startGame() {
  _socket.emit('startGame');
}

/**
 * Notify the server that the current player played a valid word.
 * @param {Array}  cells     - [{ x, y, letter, isNew }]
 * @param {string} word      - the word string
 * @param {number} wordScore - score calculated client-side
 */
export function playWord(cells, word, wordScore) {
  _socket.emit('wordPlayed', { cells, word, wordScore });
}
