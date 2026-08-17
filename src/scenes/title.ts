import { GAME, SCENE } from '../constants'
import { addButton } from '../gameobjects'
import { addFloatingSymbols, isMobile } from '../helpers'
import type { GameMode } from '../types'

const LOGO_HEIGHT = 512 * 0.5
const HALF_LOGO = LOGO_HEIGHT / 2
const CONTAINER_OFFSET_Y = -60

scene(SCENE.TITLE, () => {
  const mobile = isMobile()

  setBackground(...GAME.BACKGROUND_COLOR)

  addFloatingSymbols(0.25)

  const container = add([pos(center().add(0, CONTAINER_OFFSET_Y)), fixed()])

  const title = container.add([
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
  title.pos = vec2(0, -(HALF_LOGO + title.height / 2.5))

  const subtitle = container.add([
    text(`Bump the number.${mobile ? '\n' : ' '}Hit the goal.`, {
      size: 30,
      align: 'center',
    }),
    pos(),
    anchor('center'),
    color(GAME.UI_HINT_COLOR),
    scale(0),
  ])
  subtitle.pos = vec2(0, HALF_LOGO + subtitle.height / 2)

  const logo = container.add([
    sprite('logo'),
    pos(),
    anchor('center'),
    scale(0),
  ])

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

  logo.onUpdate(() => {
    logo.pos = vec2(0, Math.sin(time() * 1.5) * 8)
  })

  const buttonStartY = HALF_LOGO + subtitle.height / 2 + 60
  const buttonGap = 60
  const modes: {
    label: string
    mode: GameMode
    color: [number, number, number]
  }[] = [
    { label: 'Classic', mode: 'classic', color: GAME.DEFAULT_BUTTON_COLOR },
    { label: 'Timed', mode: 'timed', color: [220, 60, 60] },
    { label: 'Moves', mode: 'limitedMoves', color: [60, 160, 80] },
  ]

  for (let index = 0; index < modes.length; index++) {
    const { label, mode, color } = modes[index]
    addButton(
      label,
      {
        pos: container.pos.add(0, buttonStartY + index * buttonGap),
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
