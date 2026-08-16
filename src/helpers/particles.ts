import { GAME } from '../constants'
import type { Operation } from '../types'

const SYMBOL_COUNT = 12

export function addFloatingSymbols(maxOpacity = 0.25) {
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
      particle.opacity =
        maxOpacity / 2 + Math.sin(time() * fadeSpeed + i) * (maxOpacity / 2)
      if (particle.pos.x < -50) particle.pos.x = width() + 50
      if (particle.pos.x > width() + 50) particle.pos.x = -50
      if (particle.pos.y < -50) particle.pos.y = height() + 50
      if (particle.pos.y > height() + 50) particle.pos.y = -50
    })
  }
}
