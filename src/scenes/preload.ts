import { AUDIO, SCENE } from '../constants'

scene(SCENE.PRELOAD, () => {
  loadSprite('logo', 'logo.svg')

  for (const [key, path] of Object.entries(AUDIO.SOUNDS)) {
    loadSound(key, path)
  }
  loadMusic(AUDIO.MUSIC_KEY, AUDIO.MUSIC)

  const params = new URLSearchParams(location.search)
  const level = parseInt(params.get('level') ?? '0')
  const mode = params.get('mode') ?? undefined

  loadFont('nunito', 'fonts/Nunito.ttf').onLoad(() => {
    if (level > 0) {
      go(SCENE.GAME, { level, mode })
    } else {
      go(SCENE.TITLE)
    }
  })
})
