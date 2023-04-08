# UP969376

## scrabble

## Contents of the javaScript

* scrabble.mjs -- this is where the main function of the game is. It draws the board.

* audio.mjs -- this deals with the audio of the game.

* gamePlayAndScoring.mjs -- this deals with the game play and scoring.

* wordsDictionary.mjs -- this deals with the words dictionary to check if the word played is valid or not.

* drapAndDrop.mjs -- this deals with the drag and drop of tiles from the rack to the board.

* svr.js -- this is the server side of the game that will be used to display the game in port 8080

## Installation & Use

1. To start the game you need to start a simple server on port 8080 with: npm start
2. Best view 100% zoom level on chrome.

## Requirements achieved

1. Achieved drag and drop to any square on the board.
2. For better user experience i added music which can be muted and unmuted.
3. The game can be paused and resumed.
4. Included hint for better suggestion.
5. By the bottom right of the screen you can see how many tiles remaining for you after each refill of the rack.
6. A player can refill his or her rack after each play.

## Future improvements

1. Improving multiplayer game using web sockets.
2. Including each score to each letterTile.
3. Improving the audio API.
4. Improving scoring of the game in such a way that if a player plays on special squares the game should be able to calculate double or tripple letter or word scores.
5. Improve the dictionary to show the meaning of the word played.
