import { AUDIO, SCENE } from '../constants'

scene(SCENE.PRELOAD, () => {
  loadFont('nunito', 'fonts/Nunito.ttf')
  for (const [key, path] of Object.entries(AUDIO.SOUNDS)) {
    loadSound(key, path)
  }
  loadMusic(AUDIO.MUSIC_KEY, AUDIO.MUSIC)
  go(SCENE.TITLE)
})
