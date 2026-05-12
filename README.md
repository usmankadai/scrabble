# Scrabble

A browser-based Scrabble game built with vanilla JavaScript, deployed on Vercel.

## Live Demo

[scrabble.vercel.app](https://scrabble.usmankadai.dev)

## JavaScript Modules

- `scrabble.mjs` — draws the board, manages the tile rack, scoring, and game flow
- `dragAndDrop.mjs` — handles drag and drop for mouse and touch (mobile supported)
- `gamePlayAndScoring.mjs` — game rules screen content
- `audio.mjs` — background music and sound effects

## Features

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

## Installation & Local Development

```bash
npm install
npm start        # runs the Express server
npm run dev      # runs with nodemon (auto-restart)
```

## Deployment

Deployed as a static site on Vercel. The `client/` folder is the output directory.

```bash
npx vercel        # deploy to preview
npx vercel --prod # deploy to production
```

## Future Improvements

1. Multiplayer support
2. Show the meaning of validated words
3. Score subscript on each tile in the rack

![Game Menu](./client/images/gameMenu.png)

![Gameplay](./client/images/game.png)
