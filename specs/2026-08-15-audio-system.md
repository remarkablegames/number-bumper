# Audio System: Sounds & Music

Add sound effects and looping background music to the game, with a title screen to satisfy browser autoplay policy and a mute toggle (M key) persisted to localStorage.

## Summary

Load all audio assets in the preload scene, show a title screen requiring user interaction (to satisfy browser autoplay policy), play operation-specific sounds on tile consume, move sound on player move, win sound on level complete, hover sounds on tiles and buttons, and loop `piano.mp3` as background music — with an M-key mute toggle (plus a clickable mute icon in the top-right) saved via `getData`/`setData` using the key prefix `org.remarkablegames.number-bumper`.

## Asset Mapping

| Game Event              | Sound File                |
| ----------------------- | ------------------------- |
| Player move             | `sounds/move.mp3`         |
| Tile consumed: `+`      | `sounds/add.mp3`          |
| Tile consumed: `-`      | `sounds/subtract.mp3`     |
| Tile consumed: `*`      | `sounds/multiply.mp3`     |
| Tile consumed: `/`      | `sounds/divide.mp3`       |
| Level complete          | `sounds/win.mp3`          |
| Hover over tile         | `sounds/hover-tile.mp3`   |
| Hover over button       | `sounds/hover-button.mp3` |
| Button click            | `sounds/click.mp3`        |
| Background music (loop) | `music/piano.mp3`         |

## Implementation Steps

### 1. Add audio constants (`src/constants/audio.ts` — new file)

Create a dedicated constants file for audio. Add `SOUND_KEYS` and `MUSIC_KEY` constants for the Kaplay asset registry keys, plus `SOUNDS` and `MUSIC` records mapping those keys to file paths:

```ts
export const SOUND_KEYS = {
  move: 'move',
  add: 'add',
  subtract: 'subtract',
  multiply: 'multiply',
  divide: 'divide',
  win: 'win',
  hoverTile: 'hover-tile',
  hoverButton: 'hover-button',
  click: 'click',
} as const

export const SOUNDS: Record<string, string> = {
  [SOUND_KEYS.move]: 'sounds/move.mp3',
  [SOUND_KEYS.add]: 'sounds/add.mp3',
  [SOUND_KEYS.subtract]: 'sounds/subtract.mp3',
  [SOUND_KEYS.multiply]: 'sounds/multiply.mp3',
  [SOUND_KEYS.divide]: 'sounds/divide.mp3',
  [SOUND_KEYS.win]: 'sounds/win.mp3',
  [SOUND_KEYS.hoverTile]: 'sounds/hover-tile.mp3',
  [SOUND_KEYS.hoverButton]: 'sounds/hover-button.mp3',
  [SOUND_KEYS.click]: 'sounds/click.mp3',
}

export const MUSIC_KEY = 'piano'
export const MUSIC = 'music/piano.mp3'
export const MUSIC_VOLUME = 0.3
export const SOUND_VOLUME = 0.5

export const STORAGE_PREFIX = 'org.remarkablegames.number-bumper'
export const MUTED_KEY = `${STORAGE_PREFIX}.muted`
```

### 2. Create audio helper (`src/helpers/audio.ts`)

A module managing mute state and playback:

- Uses localStorage key `org.remarkablegames.number-bumper.muted` (via `MUTED_KEY` constant)
- `isMuted()` — returns current mute state (initialized from `getData(MUTED_KEY)`)
- `toggleMute()` — flips mute, saves via `setData(MUTED_KEY, value)`, pauses/resumes music, updates mute icon
- `playSound(name)` — plays a sound effect if not muted
- `playMusic()` — starts looping background music if not muted
- `stopMusic()` — stops music
- `playOperationSound(operation)` — maps `+`/`-`/`*`/`/` to the correct sound

Export from `src/helpers/index.ts`.

### 3. Preload audio in preload scene (`src/scenes/preload.ts`)

Use `loadSound`/`loadMusic` with the key and path constants (no hardcoded strings), then `go(SCENE.TITLE)`:

```ts
scene(SCENE.PRELOAD, () => {
  for (const [key, path] of Object.entries(SOUNDS)) {
    loadSound(key, path)
  }
  loadMusic(MUSIC_KEY, MUSIC)
  go(SCENE.TITLE)
})
```

### 4. Title screen (`src/scenes/title.ts` — new file)

A title screen that requires user interaction before entering the game, satisfying the browser autoplay policy so `playMusic()` won't throw `NotAllowedError`:

- Shows game title, subtitle, and a "Click to Start" button
- Button has `onHover` → `hover-button` and `onClick` → `click` sounds
- Any keypress also starts the game
- On click/keypress, goes to `SCENE.GAME`

### 5. Play sounds in game scene (`src/scenes/game.ts`)

- **Music**: Call `playMusic()` in `setupScene()` when the game scene starts.
- **Move sound**: Play `move` sound in `tryMoveTo()` when the player moves.
- **Operation sound**: Play the operation-specific sound in `tryMoveTo()` callback when `tile.consume()` is called.
- **Win sound**: Play `win` sound in `handleWin()`.
- **Button sounds**: Add `onHover` → `hover-button` and `onClick` → `click` sounds on the "Next Level" button in `handleWin()`.
- **Mute toggle**: Add `M` key handler in `handleInput()` that calls `toggleMute()`.
- **Mute icon**: Add a clickable emoji icon in the top-right corner of the screen (using `fixed()` positioning). Shows 🔊 when unmuted, 🔇 when muted. `onHover` plays `hover-button` sound, `onClick` plays `click` sound and calls `toggleMute()`. The icon is updated in `toggleMute()` so it stays in sync.

### 6. Hover sound in tile gameobject (`src/gameobjects/tile.ts`)

Add `onHover(() => playSound(SOUND_KEYS.hoverTile))` to each tile (only for tiles with `tileData`, to avoid noise on blank tiles).

## Files Modified

- `src/constants/audio.ts` — **new file**, `SOUND_KEYS`, `SOUNDS`, `MUSIC_KEY`, `MUSIC`, volume constants, `STORAGE_PREFIX`, `MUTED_KEY`
- `src/constants/scene.ts` — add `TITLE` scene constant
- `src/constants/index.ts` — export audio constants
- `src/helpers/audio.ts` — **new file**, audio playback + mute management
- `src/helpers/index.ts` — export audio helper
- `src/scenes/preload.ts` — load all audio assets, go to `TITLE` instead of `GAME`
- `src/scenes/title.ts` — **new file**, title screen with "Play" button (width sized relative to text)
- `src/scenes/start.ts` — import `./title` to register scene
- `src/scenes/game.ts` — play sounds on events, music on scene start, button hover/click sounds on Next Level button, mute key handler, mute icon (top-left, clickable with hover/click sounds), separate R: Restart and M: Mute hint labels
- `src/gameobjects/tile.ts` — hover sound on tiles

## Verification

- `npm run lint:tsc` — type check passes
- `npm run build` — build succeeds
- Manual playtest: title screen appears first, click/keypress starts game, music loops, sounds play on move/consume/win, M key toggles mute, clicking the top-left icon toggles mute, and preference persists across reload
