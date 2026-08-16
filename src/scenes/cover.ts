import { GAME, SCENE } from '../constants'

const LOGO_HEIGHT = 512 * 0.5
const HALF_LOGO = LOGO_HEIGHT / 2

scene(SCENE.COVER, () => {
  const isMobile = width() < 450

  setBackground(...GAME.BACKGROUND_COLOR)

  const title = make([
    text('Number Bumper', {
      size: 56,
      align: 'center',
      width: width(),
    }),
    pos(),
    anchor('center'),
    color(GAME.UI_TEXT_COLOR),
  ])

  const subtitle = make([
    text(`Bump the number.${isMobile ? '\n' : ' '}Hit the goal.`, {
      size: 30,
      align: 'center',
    }),
    pos(),
    anchor('center'),
    color(GAME.UI_HINT_COLOR),
  ])

  add(title)
  add([sprite('logo'), pos(center()), anchor('center'), scale(0.5)])
  add(subtitle)

  title.pos = center().sub(0, HALF_LOGO + title.height / 2.5)
  subtitle.pos = center().add(0, HALF_LOGO + subtitle.height / 2)
})
