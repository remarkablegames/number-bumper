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
    color?: [number, number, number]
  },
  onClick: () => void,
) {
  const {
    pos: position,
    anchor: buttonAnchor = 'center',
    textSize = 24,
    padding = 48,
    radius = 12,
    color: buttonColor = GAME.DEFAULT_BUTTON_COLOR,
  } = options

  const label = make([
    text(labelText, { size: textSize, align: 'center' }),
    color(WHITE),
    pos(),
    anchor('center'),
  ])

  const buttonWidth = label.width + padding * 2
  const buttonHeight = textSize + 24

  const anchorOffsets: Record<Anchor, Vec2> = {
    center: vec2(0, 0),
    top: vec2(0, buttonHeight / 2),
    bot: vec2(0, -buttonHeight / 2),
    left: vec2(buttonWidth / 2, 0),
    right: vec2(-buttonWidth / 2, 0),
    topleft: vec2(buttonWidth / 2, buttonHeight / 2),
    topright: vec2(-buttonWidth / 2, buttonHeight / 2),
    botleft: vec2(buttonWidth / 2, -buttonHeight / 2),
    botright: vec2(-buttonWidth / 2, -buttonHeight / 2),
  }

  label.pos = anchorOffsets[buttonAnchor]

  const button = add([
    rect(buttonWidth, buttonHeight, { radius }),
    color(buttonColor),
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
