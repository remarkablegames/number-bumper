import { GAME, SCENE } from '../constants'
import { addButton } from '../gameobjects'
import { addFloatingSymbols } from '../helpers'

const LOGO_HEIGHT = 512 * 0.5
const HALF_LOGO = LOGO_HEIGHT / 2

scene(SCENE.TITLE, () => {
  const isMobile = width() < 450

  setBackground(...GAME.BACKGROUND_COLOR)

  addFloatingSymbols(0.25)

  const title = make([
    text('Number Bumper', {
      size: 56,
      align: 'center',
      width: width(),
    }),
    pos(),
    anchor('center'),
    color(GAME.UI_TEXT_COLOR),
    opacity(0),
  ])

  const subtitle = make([
    text(`Bump the number.${isMobile ? '\n' : ' '}Hit the goal.`, {
      size: 30,
      align: 'center',
    }),
    pos(),
    anchor('center'),
    color(GAME.UI_HINT_COLOR),
    opacity(0),
  ])

  title.pos = center().sub(0, HALF_LOGO + title.height / 2.5)
  subtitle.pos = center().add(0, HALF_LOGO + subtitle.height / 2)

  add(title)
  add(subtitle)

  const logo = add([
    sprite('logo'),
    pos(center()),
    anchor('center'),
    scale(0),
    opacity(0),
  ])

  tween(
    logo.scale,
    vec2(0.5),
    0.6,
    (value) => (logo.scale = value),
    easings.easeOutBack,
  )
  tween(
    logo.opacity,
    1,
    0.4,
    (value) => (logo.opacity = value),
    easings.easeOutQuad,
  )

  tween(
    title.opacity,
    1,
    0.5,
    (value) => (title.opacity = value),
    easings.easeOutQuad,
  ).onEnd(() => {
    tween(
      subtitle.opacity,
      1,
      0.5,
      (value) => (subtitle.opacity = value),
      easings.easeOutQuad,
    )
  })

  const baseY = center().y
  logo.onUpdate(() => {
    logo.pos = vec2(center().x, baseY + Math.sin(time() * 1.5) * 8)
  })

  addButton(
    'Play',
    {
      pos: center().add(0, HALF_LOGO + subtitle.height + 60),
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
