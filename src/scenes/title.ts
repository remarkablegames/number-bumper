import { GAME, SCENE } from '../constants'
import { addButton } from '../gameobjects'
import { addFloatingSymbols, isMobile } from '../helpers'
import type { GameMode } from '../types'

const LOGO_HEIGHT = 512 * 0.5
const HALF_LOGO = LOGO_HEIGHT / 2

scene(SCENE.TITLE, () => {
  const mobile = isMobile()

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
    scale(0),
  ])

  const subtitle = make([
    text(`Bump the number.${mobile ? '\n' : ' '}Hit the goal.`, {
      size: 30,
      align: 'center',
    }),
    pos(),
    anchor('center'),
    color(GAME.UI_HINT_COLOR),
    scale(0),
  ])

  title.pos = center().sub(0, HALF_LOGO + title.height / 2.5)
  subtitle.pos = center().add(0, HALF_LOGO + subtitle.height / 2)

  add(title)
  add(subtitle)

  const logo = add([sprite('logo'), pos(center()), anchor('center'), scale(0)])

  tween(
    logo.scale,
    vec2(0.5),
    0.6,
    (value) => (logo.scale = value),
    easings.easeOutBack,
  )

  tween(
    title.scale,
    vec2(1),
    0.5,
    (value) => (title.scale = value),
    easings.easeOutBack,
  ).onEnd(() => {
    tween(
      subtitle.scale,
      vec2(1),
      0.5,
      (value) => (subtitle.scale = value),
      easings.easeOutBack,
    )
  })

  const baseY = center().y
  logo.onUpdate(() => {
    logo.pos = vec2(center().x, baseY + Math.sin(time() * 1.5) * 8)
  })

  const buttonStartY = HALF_LOGO + subtitle.height + 60
  const buttonGap = 60
  const modes: {
    label: string
    mode: GameMode
    color: [number, number, number]
  }[] = [
    { label: 'Classic', mode: 'classic', color: GAME.DEFAULT_BUTTON_COLOR },
    { label: 'Timed', mode: 'timed', color: [220, 60, 60] },
    { label: 'Limited Moves', mode: 'limitedMoves', color: [60, 160, 80] },
  ]

  for (let index = 0; index < modes.length; index++) {
    const { label, mode, color } = modes[index]
    addButton(
      label,
      {
        pos: center().add(0, buttonStartY + index * buttonGap),
        textSize: 26,
        padding: 16,
        color,
      },
      () => {
        go(SCENE.GAME, { mode })
      },
    )
  }

  onKeyPress(['enter', 'space'], () => {
    go(SCENE.GAME, { mode: 'classic' })
  })
})
