<p align="center">
  <img src="public/favicon.png" width="200" alt="Number Bumper">
</p>

# Number Bumper

[![release](https://img.shields.io/github/v/release/remarkablegames/number-bumper)](https://github.com/remarkablegames/number-bumper/releases)
[![build](https://github.com/remarkablegames/number-bumper/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/number-bumper/actions/workflows/build.yml)

🔢 **Number Bumper** is a 2D math puzzle where you reach a target number by chaining operation tiles.

With quick levels, instant feedback, and growing difficulty, it’s great practice for mental math and number sense.

Play in the browser:

- [remarkablegames](https://remarkablegames.org/number-bumper/)

## Features

- **Math operations** — addition, subtraction, multiplication, and division
- **Procedurally generated levels** — every playthrough is unique with levels of increasing difficulty
- **Controls** — click/press adjacent tiles or use WASD/arrow keys to move
- **Restart** — press `R` to restart the current level

## Credits

- [FREE Background Music for Visual Novels vol.1](https://d-wheat-music.itch.io/free-background-music-for-dating-sim-vol1) by [D-wheat music](https://d-wheat-music.itch.io/)
- [Universal UI/Menu Soundpack](https://cyrex-studios.itch.io/universal-ui-soundpack) by [Nathan Gibson](https://nathangibson.myportfolio.com)

## Prerequisites

[nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
brew install nvm
```

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/number-bumper.git
cd number-bumper
```

Install the dependencies:

```sh
npm install
```

Update the files:

- [ ] `public/app-icon.png`
- [ ] `public/favicon.png`
- [ ] `public/manifest.webmanifest`

## Environment Variables

Update the environment variables:

```sh
cp .env .env.local
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and compresses the contents into a ZIP archive in the `dist` folder.

Your game can be uploaded to your server, [itch.io](https://itch.io/), etc.

## License

[MIT](LICENSE)
