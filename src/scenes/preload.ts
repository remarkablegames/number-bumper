import { AUDIO, SCENE } from '../constants'

scene(SCENE.PRELOAD, () => {
  loadFont('nunito', 'fonts/Nunito.ttf')
  loadSprite('logo', 'logo.svg')

  for (const [key, path] of Object.entries(AUDIO.SOUNDS)) {
    loadSound(key, path)
  }
  loadMusic(AUDIO.MUSIC_KEY, AUDIO.MUSIC)

  const params = new URLSearchParams(location.search)
  const level = Number(params.get('level'))
  const mode = params.get('mode')
  if (level > 0) {
    go(SCENE.GAME, { level, mode: mode ?? undefined })
  } else {
    go(SCENE.TITLE)
  }
})
