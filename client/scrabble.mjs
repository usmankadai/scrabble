/* This file helps to draw the board grid.
It also helps to insert the text content on the board.
 It draws the score board and where the letters are */

import * as drag from './dragAndDrop.mjs';
import * as audio from './audio.mjs';
import * as rules from './gamePlayAndScoring.mjs';


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

const nArray = [];
let wordString = '';
const alreadyPlayed = [];
function score() {
  const letterOnBoards = document.querySelectorAll('.letterOnBoard');
  const wordsPlayed = document.querySelector('#word');
  let sumTheTileValue = 0;
  let addTheLettersTogether = [];
  for (const letterOnBoard of letterOnBoards) {
    sumTheTileValue += letterValues[letterOnBoard.textContent];
    addTheLettersTogether += letterOnBoard.textContent;
  }
  /* get all the tiles on the board
  sum up the values of the tiles
  report the sum */


  // const wordLetter = [];
  for (let y = 0; y < scoreArray.length; y++) {
    for (let x = 0; x < scoreArray[y].length; x++) {
      console.log(scoreArray[y][x]);
      // if (scoreArray[y][x] !== '') {
      //   const non = wordLetter.push(scoreArray[y][x]);
      //   console.log(non);
      // }
    }
  }

  if (alreadyPlayed.includes(wordString)) {
    console.log('alreadyPlayed');
  } else {
    nArray.push(addTheLettersTogether);
    alreadyPlayed.push(wordString);
    wordString = nArray.toString();
    console.log(wordString);
  }
  const scoring = document.querySelector('#scores');
  const div = document.createElement('div');
  div.className = 'scoring';
  div.textContent = `${sumTheTileValue}`;
  const div2 = document.createElement('div');
  div2.className = 'wordsPlayed';
  div2.textContent = wordString;
  wordsPlayed.appendChild(div2);
  scoring.appendChild(div);

  // const childElem = document.querySelectorAll('.letters');
  // const cr = document.createElement('sub');
  // const text = document.createTextNode(letterValues[takeRandomLetterFromBag]);
  // cr.appendChild(text);
  // childElem.append(cr);
  // letterValues[letterOnBoard.textContent]
}


function firstStar() {
  const star = document.querySelector('#dropzone113');
  if (star.firstElementChild === null) {
    console.log('The first tile must be on the star');
    alert('The first tile must be on the star');
  } else {
    console.log('first word is on star');
    score();
  }
}


function pageLoaded() {
  const wordInput = document.querySelector('#playWord');
  wordInput.addEventListener('click', checkWord);
}
async function checkWord() {
  // const wordInput = document.querySelector('#input');
  const result = document.querySelector('#result');
  // const letter = document.querySelectorAll('.letterOnBoard');

  if (wordString === 0) {
    result.textContent = 'After Spelling each word check validity before playing';
    return;
  }

  const url = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/' + wordString;
  const response = await fetch(url);

  switch (response.status) {
    case 200:
      result.textContent = wordString + ' is a valid word. Well done👏';
      break;
    case 400:
      result.textContent = wordString + ' is too short. Try again🙁';
      break;
    case 404:
      result.textContent = wordString + ' is invalid 🚫. Keep trying ';
      break;
    default:
      result.textContent = 'Word validator is not available at this time😖';
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
  const node = document.createElement('div');
  node.id = 'word';
  node.className = 'scroll';
  selector.appendChild(node);
  const rule = document.querySelector('#word');
  const node2 = document.createTextNode('Words played:');
  rule.appendChild(node2);

  const div = document.createElement('div');
  div.id = 'scores';
  div.className = 'scroll';
  selector.appendChild(div);
  const select = document.querySelector('#scores');
  const text = document.createTextNode('Scores:');
  select.appendChild(text);

  const div1 = document.createElement('div');
  div1.id = 'letterScore';
  selector.appendChild(div1);
  const selectL = document.querySelector('#letterScore');
  const guide = document.createTextNode('Letter scoring guide:');
  selectL.appendChild(guide);

  const div2 = document.createElement('div');
  div2.id = 'tilesLeft';
  selector.appendChild(div2);
  const tileL = document.querySelector('#tilesLeft');
  const tileLeft = document.createTextNode('Tiles left:100');
  tileL.appendChild(tileLeft);
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

function play() {
  document.querySelector('#menu').style.display = 'none';
  document.querySelector('#board').classList.add('visible');
  document.querySelector('#letterboard').classList.add('visible');
  document.querySelector('#hintBoard').classList.add('visible');
}
function instruction() {
  document.querySelector('#menu').style.display = 'none';
  document.querySelector('#gameRule').classList.add('displayOption');
}
function home() {
  document.location.reload(true);
}
function pause() {
  document.querySelector('#pause, #letterboard').style.display = 'none';
  document.querySelector('#letterboard').classList.remove('visible');
  document.querySelector('#board').classList.remove('visible');
  document.querySelector('#hintBoard').classList.remove('visible');
}


function display() {
  document.querySelector('#play').addEventListener('click', play);
  document.querySelector('.home').addEventListener('click', home);
  document.querySelector('#homeButton').addEventListener('click', home);
  document.querySelector('#pause').addEventListener('click', pause);
  document.querySelector('#rules').addEventListener('click', instruction);
  document.querySelector('#resumeGame').addEventListener('click', play);
  document.querySelector('#hint').addEventListener('click', hintText);
  document.querySelector('#playWord').addEventListener('click', trackLetters);
  // document.querySelector('#playWord').addEventListener('click', score);
  document.querySelector('#refillTile').addEventListener('click', refillNewLetter);
  window.addEventListener('drop', emptyTile);
  window.addEventListener('drop', checkDrop);
  drawBoard();
  twoLSWordBox();
  twoWordBox();
  threeLSWordBox();
  threeWordBox();
  middleStar();
  letter();
  check();
  pageLoaded();
  drag.initialiseDropZone();
  drag.initialiseDragging();
  audio.plays();
  rules.game();
  rules.rules();
  document.querySelector('#playWord').addEventListener('click', firstStar);
  // document.querySelector('#play').addEventListener('click', firstStar);
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
