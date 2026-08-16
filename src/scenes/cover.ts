import { GAME, SCENE } from '../constants'
import type { Operation } from '../types'

const LOGO_HEIGHT = 512 * 0.5
const HALF_LOGO = LOGO_HEIGHT / 2
const SYMBOL_COUNT = 12

scene(SCENE.COVER, () => {
  const isMobile = width() < 450

  setBackground(...GAME.BACKGROUND_COLOR)

  const operations = Object.keys(GAME.OPERATION_SYMBOLS) as Operation[]

  for (let i = 0; i < SYMBOL_COUNT; i++) {
    const op = operations[i % operations.length]
    const symbol = GAME.OPERATION_SYMBOLS[op]
    const x = rand(0, width())
    const y = rand(0, height())
    const drift = vec2(rand(-20, 20), rand(-15, 15))
    const fadeSpeed = rand(0.3, 0.8)

    const particle = add([
      text(symbol, { size: rand(28, 56) }),
      pos(x, y),
      anchor('center'),
      color(GAME.OPERATION_COLORS[op]),
      opacity(0),
      fixed(),
    ])

    particle.onUpdate(() => {
      particle.pos = particle.pos.add(drift.scale(dt()))
      particle.opacity = 0.15 + Math.sin(time() * fadeSpeed + i) * 0.1
      if (particle.pos.x < -50) particle.pos.x = width() + 50
      if (particle.pos.x > width() + 50) particle.pos.x = -50
      if (particle.pos.y < -50) particle.pos.y = height() + 50
      if (particle.pos.y > height() + 50) particle.pos.y = -50
    })
  }

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
})
