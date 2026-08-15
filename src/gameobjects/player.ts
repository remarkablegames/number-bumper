import { GAME } from '../constants'
import { gridToWorld } from '../helpers'
import type { LevelData } from '../types'

export function addPlayer(level: LevelData) {
  const startPosition = gridToWorld(
    level.startX,
    level.startY,
    level.width,
    level.height,
  )

  const player = add([
    rect(GAME.TILE_RENDER_SIZE, GAME.TILE_RENDER_SIZE, {
      radius: GAME.TILE_RADIUS,
    }),
    color(...GAME.PLAYER_COLOR),
    pos(startPosition),
    anchor('center'),
    outline(4, WHITE),
    scale(),
    area(),
    {
      gridX: level.startX,
      gridY: level.startY,
      isMoving: false,
      hasMoved: false,
      value: level.startValue,
    },
  ])

  const valueText = player.add([
    text(String(level.startValue), { size: GAME.TEXT_SIZE, align: 'center' }),
    color(GAME.TEXT_COLOR),
    pos(),
    anchor('center'),
    scale(),
  ])

  function popValueText() {
    valueText.scale = vec2(GAME.POP_SCALE, GAME.POP_SCALE)
    tween(
      GAME.POP_SCALE,
      1,
      GAME.POP_DURATION,
      (value) => {
        valueText.scale = vec2(value)
      },
      easings.easeOutBack,
    )
  }

  player.onUpdate(() => {
    valueText.text = String(player.value)
    valueText.textSize =
      player.value >= 100 ? GAME.TEXT_SIZE_SMALL : GAME.TEXT_SIZE

    if (!player.hasMoved) {
      const pulse = 1 + Math.sin(time() * 4) * 0.04
      player.scale = vec2(pulse)
    }
  })

  player.onClick(() => {
    if (!player.hasMoved) {
      player.hasMoved = true
      player.scale = vec2(1)
    }
  })

  return Object.assign(player, {
    setValue: (value: number) => {
      player.value = value
      popValueText()
    },
    goToTile: (gridX: number, gridY: number, onArrive: () => void) => {
      if (!player.hasMoved) {
        player.hasMoved = true
        player.scale = vec2(1)
      }

      player.isMoving = true
      player.gridX = gridX
      player.gridY = gridY

      const targetPosition = gridToWorld(
        gridX,
        gridY,
        level.width,
        level.height,
      )

      tween(
        player.pos,
        targetPosition,
        GAME.MOVE_DURATION,
        (value) => {
          player.pos = value
        },
        easings.easeOutCubic,
      ).onEnd(() => {
        player.isMoving = false
        onArrive()
      })
    },
  })
}
