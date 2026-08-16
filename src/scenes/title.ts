import { GAME, SCENE } from '../constants'
import { addButton } from '../gameobjects'

scene(SCENE.TITLE, () => {
  setBackground(...GAME.BACKGROUND_COLOR)

  const screenWidth = width()
  const screenHeight = height()

  add([
    text('Number Bumper', { size: 56, align: 'center' }),
    pos(screenWidth / 2, screenHeight / 2 - 100),
    anchor('center'),
    color(GAME.UI_TEXT_COLOR),
    fixed(),
  ])

  add([
    text('Bump the number. Hit the goal.', {
      size: 24,
      align: 'center',
    }),
    pos(screenWidth / 2, screenHeight / 2 - 50),
    anchor('center'),
    color(GAME.UI_HINT_COLOR),
    fixed(),
  ])

  add([
    sprite('logo'),
    pos(screenWidth / 2, screenHeight / 2 + 60),
    anchor('center'),
    scale(0.35),
  ])

  addButton(
    'Play',
    {
      pos: vec2(screenWidth / 2, screenHeight / 2 + 190),
      textSize: 26,
    },
    () => {
      go(SCENE.GAME)
    },
  )

  onKeyPress(() => {
    go(SCENE.GAME)
  })
})
