import type { Anchor, Vec2 } from 'kaplay'

import { AUDIO, GAME } from '../constants'
import { playSound } from '../helpers'

export function addButton(
  labelText: string,
  options: {
    pos: Vec2
    anchor?: Anchor
    textSize?: number
    padding?: number
    radius?: number
  },
  onClick: () => void,
) {
  const {
    pos: position,
    anchor: buttonAnchor = 'center',
    textSize = 24,
    padding = 48,
    radius = 12,
  } = options

  const label = make([
    text(labelText, { size: textSize, align: 'center' }),
    color(WHITE),
    pos(),
    anchor('center'),
  ])

  const button = add([
    rect(label.width + padding * 2, label.height + 24, { radius }),
    color(...GAME.NEXT_BUTTON_COLOR),
    pos(position),
    anchor(buttonAnchor),
    area(),
    scale(),
    fixed(),
  ])

  button.add(label)

  button.onHover(() => {
    setCursor('pointer')
    playSound(AUDIO.SOUND_KEYS.hoverButton)
    tween(
      button.scale,
      vec2(GAME.HOVER_SCALE),
      GAME.HOVER_DURATION,
      (value) => {
        button.scale = value
      },
      easings.easeOutQuad,
    )
  })

  button.onHoverEnd(() => {
    setCursor('default')
    tween(
      button.scale,
      vec2(1),
      GAME.HOVER_DURATION,
      (value) => {
        button.scale = value
      },
      easings.easeOutQuad,
    )
  })

  button.onClick(() => {
    playSound(AUDIO.SOUND_KEYS.click)
    onClick()
  })

  return button
}
