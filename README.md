# Scrabble

A browser-based Scrabble game built with vanilla JavaScript, with real-time multiplayer via Socket.IO.

## Live Demo

[scrabble.vercel.app](https://scrabble.usmankadai.dev)

## JavaScript Modules

- `scrabble.mjs` — draws the board, manages the tile rack, scoring, game flow, and multiplayer UI
- `dragAndDrop.mjs` — handles drag and drop for mouse and touch (mobile supported)
- `gamePlayAndScoring.mjs` — game rules screen content
- `audio.mjs` — background music and sound effects
- `multiplayer.mjs` — Socket.IO wrapper; all real-time communication with the server

## Features

- **Single player** or **multiplayer** — choose at the start of every game
- Drag and drop tiles from the rack to the board (mouse and touch/mobile)
- Word validation via the [Free Dictionary API](https://dictionaryapi.dev/) — invalid words are rejected and not scored
- Correct Scrabble scoring: 2× LS, 3× LS, 2× WS, 3× WS bonus squares applied to newly placed tiles
- Running total score with per-word breakdown (e.g. `TAB: 5 pts`)
- Letter scoring guide displayed in the info panel
- Game can be paused and resumed
- Tile rack refill after each turn
- Hints for better play suggestions
- Background music with mute/unmute toggle
- Committed tiles are locked — you cannot place a new tile on top of a played one

### Multiplayer

- Up to any number of players on the same network
- Players enter their name and join a shared lobby
- The first player to join is the **host** and starts the game (minimum 2 players)
- Turns are enforced server-side — only the active player can drag tiles and submit a word
- The board, scores, and tile bag are all managed by the server and kept in sync across all browsers in real time
- Each player has their own private rack; new tiles are dealt automatically after each turn

## Installation & Local Development

```bash
npm install
npm start        # runs the Express + Socket.IO server
npm run dev      # runs with nodemon (auto-restart)
```

All players open the same URL printed in the terminal (e.g. `http://localhost:54321`).

## Deployment

> **Note:** Multiplayer requires the Node.js server. The Vercel deployment serves the single-player version only (static export).

```bash
npx vercel        # deploy to preview
npx vercel --prod # deploy to production
```

## Future Improvements

1. Show the meaning of validated words
2. Score subscript on each tile in the rack
3. End-game screen with final scores

![Game Menu](./client/images/gameMenu.png)

![Gameplay](./client/images/game.png)
