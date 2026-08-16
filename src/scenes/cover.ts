import { GAME, SCENE } from '../constants'

scene(SCENE.COVER, () => {
  setBackground(...GAME.BACKGROUND_COLOR)

  add([
    sprite('logo'),
    pos(center().sub(0, 60)),
    anchor('center'),
    scale(0.5),
    fixed(),
  ])

  add([
    text('Number Bumper', { size: 56, align: 'center' }),
    pos(center().add(0, 100)),
    anchor('center'),
    color(...GAME.UI_TEXT_COLOR),
    fixed(),
  ])
})
