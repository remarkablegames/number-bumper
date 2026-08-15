import { AUDIO, GAME, SCENE } from '../constants'
import { playSound } from '../helpers'

scene(SCENE.TITLE, () => {
  setBackground(...GAME.BACKGROUND_COLOR)

  const screenWidth = width()
  const screenHeight = height()

  add([
    text('Number Bumper', { size: 56, align: 'center' }),
    pos(screenWidth / 2, screenHeight / 2 - 80),
    anchor('center'),
    color(...GAME.UI_TEXT_COLOR),
    fixed(),
  ])

  add([
    text('Reach the target by chaining operation tiles', {
      size: 22,
      align: 'center',
    }),
    pos(screenWidth / 2, screenHeight / 2 - 20),
    anchor('center'),
    color(...GAME.UI_HINT_COLOR),
    fixed(),
  ])

  const startLabel = make([
    text('Play', { size: 26, align: 'center' }),
    color(WHITE),
    pos(),
    anchor('center'),
  ])

  const buttonPadding = 48
  const startButton = add([
    rect(startLabel.width + buttonPadding * 2, startLabel.height + 24, {
      radius: 12,
    }),
    color(...GAME.NEXT_BUTTON_COLOR),
    pos(screenWidth / 2, screenHeight / 2 + 60),
    anchor('center'),
    area(),
    fixed(),
  ])

  startButton.add(startLabel)

  startButton.onHover(() => {
    playSound(AUDIO.SOUND_KEYS.hoverButton)
  })

  startButton.onClick(() => {
    playSound(AUDIO.SOUND_KEYS.click)
    go(SCENE.GAME)
  })

  onKeyPress(() => {
    go(SCENE.GAME)
  })
})
