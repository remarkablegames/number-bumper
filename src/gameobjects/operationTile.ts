import { GAME } from '../constants'
import type { LevelData, TileData } from '../types'
import { gridToWorld } from '../utils'

export type OperationTile = ReturnType<typeof addOperationTile>

export function addOperationTile(
  tile: TileData,
  level: LevelData,
  onClick: () => void,
) {
  const position = gridToWorld(tile.x, tile.y, level.width, level.height)

  const operationTile = add([
    rect(GAME.TILE_SIZE, GAME.TILE_SIZE, { radius: GAME.TILE_RADIUS }),
    color(...GAME.OPERATION_COLORS[tile.operation]),
    pos(position),
    anchor('center'),
    area(),
    scale(),
    {
      tile,
    },
  ])

  const labelText = GAME.OPERATION_SYMBOLS[tile.operation] + String(tile.value)
  const label = operationTile.add([
    text(labelText, { size: GAME.TEXT_SIZE, align: 'center' }),
    color(GAME.TEXT_COLOR),
    pos(),
    anchor('center'),
    scale(),
  ])

  operationTile.onClick(() => {
    if (!operationTile.paused) {
      onClick()
    }
  })

  return Object.assign(operationTile, {
    consume: () => {
      operationTile.paused = true
      tween(
        1,
        1.3,
        GAME.POP_DURATION,
        (value) => {
          operationTile.scale = vec2(value)
          label.scale = vec2(value)
        },
        easings.easeOutCubic,
      ).onEnd(() => {
        destroy(operationTile)
      })
    },
  })
}
