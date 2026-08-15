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
export const MUSIC_VOLUME = 0.6
export const SOUND_VOLUME = 0.7

export const STORAGE_PREFIX = 'org.remarkablegames.number-bumper'
export const MUTED_KEY = `${STORAGE_PREFIX}.muted`
