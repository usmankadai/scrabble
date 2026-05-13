/* This file helps to draw the board grid.
It also helps to insert the text content on the board.
 It draws the score board and where the letters are */

import * as drag from './dragAndDrop.mjs';
import * as audio from './audio.mjs';
import * as rules from './gamePlayAndScoring.mjs';
import * as mp from './multiplayer.mjs';


const bagOfLetters = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'D', 'D', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'F', 'F', 'G', 'G', 'G', 'H', 'H', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'J', 'K', 'L', 'L', 'L', 'L', 'M', 'M', 'N', 'N', 'N', 'N', 'N', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'P', 'P', 'Q', 'R', 'R', 'R', 'R', 'R', 'R', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'U', 'U', 'U', 'U', 'V', 'V', 'W', 'W', 'X', 'Y', 'Y', 'Z', ' ', ' '];
const letterValues = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };

// hint text Referenced from https://scrabble.hasbro.com/en-us/rules#gameplay.
const quickHint = ['Try making words with Q, Z, X or J for more points', 'Make effective use of double and triple word score', 'Make effective use of double and triple letter score', 'Always target to use all the 7 letters to achieve BINGO'];
const scoreArray = [
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
];

function checkDrop(e) {
  const data = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(data);
  draggable.classList.add('letterOnBoard');
  console.log('checkDrop', draggable);
}
function emptyTile(e) {
  const data = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(data);
  /*
  check is the draggable content empty,
  if true
  instructs the browser to display a dialog that'll let the user select any letter he wants
  */
  if (draggable.textContent === ' ') {
    const text = prompt('Lucky! choose any letter you want').toUpperCase();
    console.log(`i chose letter ${text}`);
    draggable.textContent = text;
  }
}

let totalScore = 0;
let multiplayerMode = false;

// Bonus square IDs (match the CSS selectors)
const tripleWordSquares  = new Set(['dropzone1','dropzone8','dropzone15','dropzone106','dropzone120','dropzone211','dropzone218','dropzone225']);
const doubleWordSquares  = new Set(['dropzone17','dropzone29','dropzone33','dropzone43','dropzone49','dropzone57','dropzone65','dropzone71','dropzone113','dropzone155','dropzone161','dropzone169','dropzone177','dropzone183','dropzone193','dropzone197','dropzone209']);
const tripleLetterSquares = new Set(['dropzone21','dropzone25','dropzone77','dropzone81','dropzone85','dropzone89','dropzone137','dropzone141','dropzone145','dropzone149','dropzone201','dropzone205']);
const doubleLetterSquares = new Set(['dropzone4','dropzone12','dropzone37','dropzone39','dropzone46','dropzone53','dropzone60','dropzone93','dropzone97','dropzone99','dropzone103','dropzone109','dropzone117','dropzone123','dropzone127','dropzone129','dropzone133','dropzone166','dropzone173','dropzone180','dropzone187','dropzone189','dropzone214','dropzone222']);

// Returns the letter at board position (x, y), or null if the cell is empty
function getLetterAt(x, y) {
  const dropzone = document.querySelector(`.dropzone[data-x="${x}"][data-y="${y}"]`);
  if (!dropzone) return null;
  const tile = dropzone.querySelector('.letters');
  return tile ? tile.textContent.trim() || null : null;
}

// Builds an array of cell data for the full word, including committed tiles either side
// Each cell: { char, dropzoneId, isNew }
function buildWordCells(positions, isHorizontal) {
  const newSet = new Set(positions.map(p => `${p.x},${p.y}`));
  const cells = [];

  if (isHorizontal) {
    const y = positions[0].y;
    let minX = Math.min(...positions.map(p => p.x));
    let maxX = Math.max(...positions.map(p => p.x));
    while (minX > 1 && getLetterAt(minX - 1, y)) minX--;
    while (maxX < 15 && getLetterAt(maxX + 1, y)) maxX++;
    for (let x = minX; x <= maxX; x++) {
      const char = getLetterAt(x, y);
      if (!char) return null;
      const dz = document.querySelector(`.dropzone[data-x="${x}"][data-y="${y}"]`);
      cells.push({ char, dropzoneId: dz.id, isNew: newSet.has(`${x},${y}`), x, y });
    }
  } else {
    const x = positions[0].x;
    let minY = Math.min(...positions.map(p => p.y));
    let maxY = Math.max(...positions.map(p => p.y));
    while (minY > 1 && getLetterAt(x, minY - 1)) minY--;
    while (maxY < 15 && getLetterAt(x, maxY + 1)) maxY++;
    for (let y = minY; y <= maxY; y++) {
      const char = getLetterAt(x, y);
      if (!char) return null;
      const dz = document.querySelector(`.dropzone[data-x="${x}"][data-y="${y}"]`);
      cells.push({ char, dropzoneId: dz.id, isNew: newSet.has(`${x},${y}`), x, y });
    }
  }

  return cells;
}

// Returns the numeric score for a set of cells (applies bonuses).
function calculateScore(cells) {
  let wordMultiplier = 1;
  let wordScore = 0;

  for (const cell of cells) {
    let letterScore = letterValues[cell.char] || 0;
    if (cell.isNew) {
      if      (tripleLetterSquares.has(cell.dropzoneId)) letterScore *= 3;
      else if (doubleLetterSquares.has(cell.dropzoneId)) letterScore *= 2;
      if      (tripleWordSquares.has(cell.dropzoneId))  wordMultiplier *= 3;
      else if (doubleWordSquares.has(cell.dropzoneId))  wordMultiplier *= 2;
    }
    wordScore += letterScore;
  }

  return wordScore * wordMultiplier;
}

// Scores the word applying letter and word bonuses only to newly placed tiles
function score(cells) {
  const wordScore = calculateScore(cells);
  totalScore += wordScore;

  for (const tile of document.querySelectorAll('.letterOnBoard')) {
    tile.classList.remove('letterOnBoard');
    tile.classList.add('committedLetter');
  }

  const word = cells.map(c => c.char).join('');
  const entry = document.createElement('div');
  entry.className = 'wordsPlayed';
  entry.textContent = `${word}: ${wordScore} pts`;
  document.querySelector('#word').appendChild(entry);
  document.querySelector('#totalScore').textContent = `${totalScore} pts`;
}

async function checkWord() {
  const result = document.querySelector('#result');
  const letterOnBoards = [...document.querySelectorAll('.letterOnBoard')];

  if (letterOnBoards.length === 0) {
    result.textContent = 'Place letters on the board first';
    return;
  }

  // First word must touch the star
  const star = document.querySelector('#dropzone113');
  if (star.firstElementChild === null) {
    result.textContent = 'The first tile must be on the star ★';
    return;
  }

  // Get board positions of new tiles
  const positions = letterOnBoards.map(tile => ({
    x: +tile.closest('.dropzone').dataset.x,
    y: +tile.closest('.dropzone').dataset.y,
  }));

  const allSameRow = positions.every(p => p.y === positions[0].y);
  const allSameCol = positions.every(p => p.x === positions[0].x);

  if (!allSameRow && !allSameCol) {
    result.textContent = 'Tiles must be in a straight line ↔ or ↕';
    return;
  }

  const cells = buildWordCells(positions, allSameRow);
  const word = cells ? cells.map(c => c.char).join('') : null;

  if (!word || word.length < 2) {
    result.textContent = 'Place at least 2 letters to make a word 🙁';
    return;
  }

  result.textContent = 'Checking…';

  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    const response = await fetch(url);

    if (response.ok) {
      result.textContent = `${word} is a valid word. Well done 👏`;
      if (multiplayerMode) {
        const wordScore = calculateScore(cells);
        const serverCells = cells.map(c => ({ x: c.x, y: c.y, letter: c.char, isNew: c.isNew }));
        // Optimistically commit tiles visually
        for (const tile of document.querySelectorAll('.letterOnBoard')) {
          tile.classList.remove('letterOnBoard');
          tile.classList.add('committedLetter');
        }
        mp.playWord(serverCells, word, wordScore);
        lockBoard();
      } else {
        score(cells);
      }
    } else {
      result.textContent = `${word} is not a valid word 🚫. Keep trying`;
    }
  } catch {
    result.textContent = 'Word validator is not available at this time 😖';
  }
}


function trackLetters() {
  const dropzones = document.querySelectorAll('.dropzone');
  for (const dropzone of dropzones) {
    if (dropzone.children.length >= 1) {
      const y = dropzone.dataset.y;
      const x = dropzone.dataset.x;
      const selectTiles = dropzone.querySelectorAll('#board>.dropzone>.letters');
      for (const selectTile of selectTiles) {
        const letter = selectTile.textContent;
        // console.log(letter);
        scoreArray[y - 1][x - 1] = `${letter}`;
      }
    } else {
      const y = dropzone.dataset.y;
      const x = dropzone.dataset.x;
      scoreArray[y - 1][x - 1] = '';
    }
  }
  console.log(scoreArray);
}

// function scoreA() {
//   // const wordLetter = [];
//   for (let y = 0; y < scoreArray.length; y++) {
//     for (let x = 0; x < scoreArray[y].length; x++) {
//       console.log(scoreArray[0][0]);
//       // if (scoreArray[y][x] !== '') {
//       //   const non = wordLetter.push(scoreArray[y][x]);
//       //   console.log(non);
//       // }
//     }
//   }
// }


// Math.random() Referenced from MDN. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// remove a random letter from the bag
function takeRandomLetterFromBag() {
  const random = Math.floor(Math.random() * bagOfLetters.length);
  return bagOfLetters.splice(random, 1);
}


// return a hint randomly from the array given above.
function hint() {
  const randomHint = Math.floor(Math.random() * quickHint.length);
  return quickHint[randomHint];
}


function hintText() {
  const Gamehint = document.querySelector('#hintText');
  Gamehint.textContent = hint();
}


let count = 0;
function drawBoard() {
  for (let y = 1; y <= 15; y += 1) {
    for (let x = 1; x <= 15; x += 1) {
      const div = document.createElement('div');
      div.classList.add('dropzone');
      count++;
      div.id = `dropzone${count}`;
      div.dataset.y = y;
      div.dataset.x = x;
      const board = document.getElementById('board');
      board.append(div);
    }
  }
}


function letter() {
  const lBox = document.querySelector('#letterboard');
  for (let i = 1; i <= 7; i += 1) {
    const box = document.createElement('div');
    box.className = 'letterbox';
    lBox.append(box);
    const box2 = document.createElement('div');
    box2.className = 'letters';
    letterTile++;
    box2.id = `letter${letterTile}`;
    box2.draggable = true;
    box2.textContent = takeRandomLetterFromBag();
    box.append(box2);
  }
}


// Get a handler on the special tiles, then insert the given text.
// setting the box 2× LS
function twoLSWordBox() {
  const twoLSs = document.querySelectorAll('#dropzone4, #dropzone12, #dropzone37, #dropzone39, #dropzone46, #dropzone53, #dropzone60, #dropzone93, #dropzone97, #dropzone99, #dropzone103, #dropzone109, #dropzone117, #dropzone123, #dropzone127, #dropzone129, #dropzone133, #dropzone166, #dropzone173, #dropzone180, #dropzone187, #dropzone189, #dropzone214, #dropzone222');
  for (const twoLS of twoLSs) {
    const node = document.createTextNode('2× LS');
    twoLS.appendChild(node);
  }
}
// setting the box 2× WS
function twoWordBox() {
  const twoWords = document.querySelectorAll('#dropzone17, #dropzone29, #dropzone33, #dropzone43,  #dropzone49, #dropzone57, #dropzone65, #dropzone71, #dropzone155, #dropzone161, #dropzone169, #dropzone177, #dropzone183, #dropzone193, #dropzone197, #dropzone209');
  for (const twoWord of twoWords) {
    const node = document.createTextNode('2× WS');
    twoWord.appendChild(node);
  }
}
// setting the box 3× LS
function threeLSWordBox() {
  const threeLSs = document.querySelectorAll('#dropzone21, #dropzone25, #dropzone77, #dropzone81, #dropzone85, #dropzone141, #dropzone145, #dropzone89, #dropzone137, #dropzone149, #dropzone201, #dropzone205');

  for (const threeLS of threeLSs) {
    const node = document.createTextNode('3× LS');
    threeLS.appendChild(node);
  }
}
// setting the box 3× WS
function threeWordBox() {
  const threeWords = document.querySelectorAll('#dropzone1, #dropzone8, #dropzone15, #dropzone106, #dropzone120, #dropzone211, #dropzone218, #dropzone225');
  for (const threeWord of threeWords) {
    const node = document.createTextNode('3× WS');
    threeWord.appendChild(node);
  }
}
// setting the box with star
function middleStar() {
  const stars = document.querySelectorAll('#dropzone113');
  for (const star of stars) {
    const node = document.createTextNode('★');
    star.appendChild(node);
  }
}

// this shows the board beside the scrabble board which contains words played, scores, letter scoring guide and tiles left.
function check() {
  const selector = document.querySelector('#table');

  const wordDiv = document.createElement('div');
  wordDiv.id = 'word';
  wordDiv.className = 'scroll';
  wordDiv.appendChild(document.createTextNode('Words played:'));
  selector.appendChild(wordDiv);

  const scoresDiv = document.createElement('div');
  scoresDiv.id = 'scores';
  scoresDiv.className = 'scroll';
  scoresDiv.appendChild(document.createTextNode('Total score: '));
  const totalSpan = document.createElement('span');
  totalSpan.id = 'totalScore';
  totalSpan.textContent = '0 pts';
  scoresDiv.appendChild(totalSpan);
  selector.appendChild(scoresDiv);

  const guideDiv = document.createElement('div');
  guideDiv.id = 'letterScore';
  guideDiv.appendChild(document.createTextNode('Letter scoring guide:'));
  for (const [letter, value] of Object.entries(letterValues)) {
    const badge = document.createElement('span');
    badge.className = 'letterGuideBadge';
    badge.textContent = `${letter || '?'}=${value}`;
    guideDiv.appendChild(badge);
  }
  selector.appendChild(guideDiv);

  const tilesDiv = document.createElement('div');
  tilesDiv.id = 'tilesLeft';
  tilesDiv.appendChild(document.createTextNode('Tiles left: 100'));
  selector.appendChild(tilesDiv);
}

let letterTile = 0;
let tileLeft = 0;

function refillNewLetter() {
  const letterboxes = document.querySelectorAll('.letterbox');
  /*
  get all the letterboxes
  letterTile < the length of bagOfLetters which is 100
  check if the letterbox that contain a letterTile is empty
  if empty, create a new letter when refill tile is clicked
  */
  for (const letterbox of letterboxes) {
    if (letterTile < 100) {
      if (letterbox.children.length === 0) {
        const node = document.createElement('div');
        node.className = 'letters';
        letterTile++;
        node.id = `letter${letterTile}`;
        node.draggable = true;
        const test = document.createTextNode(takeRandomLetterFromBag());
        node.appendChild(test);
        letterbox.append(node);
        /*
        get tilesLeft
        decrements by 1
        reports a new text that subtracts 1 from the bagOfLetters length which is 100
        */
        const tile = document.querySelector('#tilesLeft');
        tileLeft--;
        tile.textContent = 'Tiles left:' + `${tileLeft + 100}`;

        // this part checks if the bagOfLetters is empty then it reports game over
        if (tile.textContent === 'Tiles left:0') {
          alert('GAMEOVER');
        }
      }
    }
  }
  drag.initialiseDropZone();
  drag.initialiseDragging();
}

const SCREEN_KEY = 'scrabble:screen';

function setScreen(name) {
  try { localStorage.setItem(SCREEN_KEY, name); } catch (e) { /* ignore */ }
}

// ── Multiplayer helpers ───────────────────────────────────────────────────────

/** Replace the rack with a server-supplied array of letters. */
function setRack(rack) {
  const lBox = document.querySelector('#letterboard');
  for (const box of [...lBox.querySelectorAll('.letterbox')]) box.remove();
  for (const letter of rack) {
    const box = document.createElement('div');
    box.className = 'letterbox';
    lBox.append(box);
    const tile = document.createElement('div');
    tile.className = 'letters';
    letterTile++;
    tile.id = `letter${letterTile}`;
    tile.draggable = true;
    tile.textContent = letter;
    box.append(tile);
  }
  drag.initialiseDragging();
  drag.initialiseDropZone();
}

/** Sync the committed board from the authoritative server state. */
function applyServerBoard(board) {
  for (const tile of document.querySelectorAll('#board .committedLetter')) tile.remove();
  for (const [key, letter] of Object.entries(board)) {
    const [x, y] = key.split(',');
    const dz = document.querySelector(`#board .dropzone[data-x="${x}"][data-y="${y}"]`);
    if (!dz || dz.querySelector('.committedLetter')) continue;
    const tile = document.createElement('div');
    tile.className = 'letters committedLetter';
    tile.id = `board_${x}_${y}`;
    tile.draggable = false;
    tile.textContent = letter;
    dz.appendChild(tile);
  }
}

/** Disable interaction – it is not this client's turn. */
function lockBoard() {
  document.querySelector('#playWord').disabled = true;
  for (const tile of document.querySelectorAll('#letterboard .letters')) {
    tile.draggable = false;
  }
}

/** Re-enable interaction – it is this client's turn. */
function unlockBoard() {
  document.querySelector('#playWord').disabled = false;
  for (const tile of document.querySelectorAll('#letterboard .letters')) {
    tile.draggable = true;
  }
}

/** Show whose turn it is and lock/unlock accordingly. */
function updateTurnIndicator(currentPlayerName) {
  const indicator = document.querySelector('#turnIndicator');
  if (!indicator) return;
  if (currentPlayerName === mp.myPlayerName) {
    indicator.textContent = '🎯 Your turn!';
    indicator.className = 'myTurn';
    unlockBoard();
  } else {
    indicator.textContent = `⏳ ${currentPlayerName}'s turn`;
    indicator.className = 'opponentTurn';
    lockBoard();
  }
}

/** Render per-player scores in the sidebar. */
function updateMultiScores(players) {
  let panel = document.querySelector('#multiScores');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'multiScores';
    document.querySelector('#table').appendChild(panel);
  }
  panel.innerHTML = '<strong>Scores</strong>';
  for (const p of players) {
    const div = document.createElement('div');
    div.className = 'playerScore';
    div.textContent = `${p.name}: ${p.score} pts`;
    panel.appendChild(div);
  }
}

/** Append a move to the words-played history list. */
function recordMove(playerName, word, wordScore) {
  const entry = document.createElement('div');
  entry.className = 'wordsPlayed';
  entry.textContent = `${playerName}: ${word} (${wordScore} pts)`;
  document.querySelector('#word')?.appendChild(entry);
}

// ── Multiplayer socket callbacks ──────────────────────────────────────────────

function handleLobbyUpdate({ players }) {
  const list = document.querySelector('#lobbyPlayerList');
  list.innerHTML = '';
  for (let i = 0; i < players.length; i++) {
    const div = document.createElement('div');
    div.className = 'lobbyPlayer';
    div.textContent = players[i].name + (i === 0 ? ' 👑 host' : '');
    list.appendChild(div);
  }
  const statusEl = document.querySelector('#lobbyStatus');
  if (mp.isHost) {
    document.querySelector('#startGameBtn').style.display = 'block';
    document.querySelector('#hostNote').style.display = 'block';
    statusEl.textContent = players.length >= 2
      ? `${players.length} players ready – you can start!`
      : 'Waiting for at least one more player…';
  } else {
    statusEl.textContent = 'Waiting for the host to start…';
  }
}

let _pendingJoinName = null;

function onSocketReady() {
  // If the user already clicked Join while the socket was still connecting
  if (_pendingJoinName) {
    const name = _pendingJoinName;
    _pendingJoinName = null;
    const btn = document.querySelector('#joinBtn');
    btn.textContent = 'Joining…';
    _joinTimeout = setTimeout(() => {
      btn.textContent = 'Join Game';
      btn.disabled = false;
      alert('No response from server.');
    }, 5000);
    mp.joinGame(name);
  }
}

function handleJoinedGame() {
  clearTimeout(_joinTimeout);
  const btn = document.querySelector('#joinBtn');
  btn.textContent = 'Join Game';
  btn.disabled = false;

  document.querySelector('#nameOverlay').classList.remove('visible');
  document.querySelector('#lobbyOverlay').classList.add('visible');
  if (mp.isHost) {
    document.querySelector('#startGameBtn').style.display = 'block';
    document.querySelector('#hostNote').style.display = 'block';
  }
}

function handleMultiGameStarted({ players, currentPlayerName }) {
  document.querySelector('#lobbyOverlay').classList.remove('visible');
  multiplayerMode = true;
  // Hide single-player total score, show multiplayer scores panel
  document.querySelector('#scores').style.display = 'none';
  document.querySelector('#refillTile').style.display = 'none';
  updateMultiScores(players);
  updateTurnIndicator(currentPlayerName);
  document.querySelector('#turnIndicator').style.display = 'flex';
  showGame();
  setScreen('game');
}

function handleWordResult({ playerName, word, wordScore, players, board, currentPlayerName }) {
  applyServerBoard(board);
  updateMultiScores(players);
  recordMove(playerName, word, wordScore);
  document.querySelector('#result').textContent =
    `${playerName} played "${word}" for ${wordScore} pts`;
  updateTurnIndicator(currentPlayerName);
}

function handlePlayerDisconnected({ name, players, currentPlayerName }) {
  document.querySelector('#result').textContent = `${name} disconnected.`;
  updateMultiScores(players);
  if (currentPlayerName) updateTurnIndicator(currentPlayerName);
}

// ── Mode-selection flow ───────────────────────────────────────────────────────

function showGame() {
  document.querySelector('#menu').style.display = 'none';
  document.querySelector('#gameRule').classList.remove('displayOption');
  document.querySelector('#pauseOverlay').classList.remove('visible');
  document.querySelector('#board').classList.add('visible');
  document.querySelector('#table').classList.add('visible');
  document.querySelector('#letterboard').classList.add('visible');
  document.querySelector('#hintBoard').classList.add('visible');
  document.querySelector('#gameHeader').classList.add('visible');
  document.querySelector('#pauseToggle').classList.remove('paused');
}
function play() {
  document.querySelector('#modeOverlay').classList.add('visible');
}
function startSinglePlayer() {
  document.querySelector('#modeOverlay').classList.remove('visible');
  multiplayerMode = false;
  showGame();
  setScreen('game');
}
function openMultiplayerEntry() {
  document.querySelector('#modeOverlay').classList.remove('visible');
  document.querySelector('#nameOverlay').classList.add('visible');
  document.querySelector('#playerNameInput').focus();
}
let _joinTimeout = null;

function joinMultiplayer() {
  const name = document.querySelector('#playerNameInput').value.trim();
  if (!name) {
    document.querySelector('#playerNameInput').focus();
    return;
  }

  const btn = document.querySelector('#joinBtn');

  if (!mp.isConnected()) {
    btn.textContent = 'Connecting…';
    btn.disabled = true;
    // Retry once socket connects (onSocketReady re-enables the button)
    _pendingJoinName = name;
    return;
  }

  btn.textContent = 'Joining…';
  btn.disabled = true;

  _joinTimeout = setTimeout(() => {
    btn.textContent = 'Join Game';
    btn.disabled = false;
    alert('No response from server. Make sure the server is running with: node svr.js');
  }, 5000);

  mp.joinGame(name);
}
function instruction() {
  document.querySelector('#menu').style.display = 'none';
  document.querySelector('#gameRule').classList.add('displayOption');
  setScreen('rules');
}
function rulesBack() {
  document.querySelector('#gameRule').classList.remove('displayOption');
  document.querySelector('#menu').style.display = 'flex';
  setScreen('menu');
}
function home() {
  setScreen('menu');
  document.location.reload(true);
}
function togglePause() {
  const btn = document.querySelector('#pauseToggle');
  const overlay = document.querySelector('#pauseOverlay');
  const isPaused = btn.classList.contains('paused');
  if (isPaused) {
    btn.classList.remove('paused');
    overlay.classList.remove('visible');
    setScreen('game');
  } else {
    btn.classList.add('paused');
    overlay.classList.add('visible');
    setScreen('paused');
  }
}
function restoreScreen() {
  let screen = 'menu';
  try { screen = localStorage.getItem(SCREEN_KEY) || 'menu'; } catch (e) { /* ignore */ }
  if (screen === 'game') {
    showGame();
  } else if (screen === 'paused') {
    showGame();
    document.querySelector('#pauseToggle').classList.add('paused');
    document.querySelector('#pauseOverlay').classList.add('visible');
  } else if (screen === 'rules') {
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('#gameRule').classList.add('displayOption');
  }
}


function display() {
  document.querySelector('#play').addEventListener('click', play);
  document.querySelector('#pauseToggle').addEventListener('click', togglePause);
  document.querySelector('#rules').addEventListener('click', instruction);
  document.querySelector('#rulesBack').addEventListener('click', rulesBack);
  document.querySelector('#resumeBtn').addEventListener('click', togglePause);
  document.querySelector('#pauseHome').addEventListener('click', home);
  document.querySelector('#hint').addEventListener('click', hintText);
  document.querySelector('#playWord').addEventListener('click', trackLetters);
  document.querySelector('#playWord').addEventListener('click', checkWord);
  document.querySelector('#refillTile').addEventListener('click', refillNewLetter);
  window.addEventListener('drop', emptyTile);
  window.addEventListener('drop', checkDrop);

  // Mode-selection overlay buttons
  document.querySelector('#singlePlayerBtn').addEventListener('click', startSinglePlayer);
  document.querySelector('#multiPlayerBtn').addEventListener('click', openMultiplayerEntry);
  document.querySelector('#modeBack').addEventListener('click', () => {
    document.querySelector('#modeOverlay').classList.remove('visible');
  });

  // Name-entry overlay
  document.querySelector('#joinBtn').addEventListener('click', joinMultiplayer);
  document.querySelector('#playerNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinMultiplayer();
  });
  document.querySelector('#nameBack').addEventListener('click', () => {
    document.querySelector('#nameOverlay').classList.remove('visible');
    document.querySelector('#modeOverlay').classList.add('visible');
  });

  // Lobby overlay
  document.querySelector('#startGameBtn').addEventListener('click', () => mp.startGame());

  drawBoard();
  twoLSWordBox();
  twoWordBox();
  threeLSWordBox();
  threeWordBox();
  middleStar();
  letter();
  check();
  drag.initialiseDropZone();
  drag.initialiseDragging();
  audio.plays();
  rules.game();
  rules.rules();

  // Initialise multiplayer socket listeners
  mp.init({
    onError:              (msg) => alert(msg),
    onSocketReady:        onSocketReady,
    onLobbyUpdate:        handleLobbyUpdate,
    onJoinedGame:         handleJoinedGame,
    onGameStarted:        handleMultiGameStarted,
    onYourRack:           (rack) => setRack(rack),
    onWordResult:         handleWordResult,
    onPlayerDisconnected: handlePlayerDisconnected,
  });

  restoreScreen();
}


// when the page loads, run the function display()
window.addEventListener('load', display);


// const childElem = document.querySelectorAll('.letters');
// const cr = document.createElement('sub');
// const text = document.createTextNode(letterValues[takeRandomLetterFromBag]);
// cr.appendChild(text);
// childElem.append(cr);

// const bagOfLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '', ''];
// const letterValues = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8 };
