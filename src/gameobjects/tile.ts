import { GAME } from '../constants'
import { gridToWorld } from '../helpers'
import type { LevelData, TileData } from '../types'

const BLANK_TILE_COLOR: [number, number, number] = [0, 0, 0]

export function addTile(
  x: number,
  y: number,
  level: LevelData,
  onClick: () => void,
  tileData: TileData | null = null,
) {
  const position = gridToWorld(x, y, level.width, level.height)

  const tile = add([
    rect(GAME.TILE_SIZE, GAME.TILE_SIZE, { radius: GAME.TILE_RADIUS }),
    color(
      ...(tileData
        ? GAME.OPERATION_COLORS[tileData.operation]
        : BLANK_TILE_COLOR),
    ),
    pos(position),
    anchor('center'),
    area(),
    scale(),
    opacity(tileData ? 1 : 0),
    {
      tileData: tileData,
    },
  ])

  const labelText = tileData
    ? GAME.OPERATION_SYMBOLS[tileData.operation] + String(tileData.value)
    : ''

  const label = tileData
    ? tile.add([
        text(labelText, { size: GAME.TEXT_SIZE, align: 'center' }),
        color(GAME.TEXT_COLOR),
        pos(),
        anchor('center'),
        scale(),
      ])
    : null

  tile.onClick(() => {
    if (!tile.paused) {
      onClick()
    }
  })

  return Object.assign(tile, {
    consume: () => {
      if (!tile.tileData) return

      tile.paused = true
      tween(
        1,
        1.3,
        GAME.POP_DURATION,
        (value) => {
          tile.scale = vec2(value)
          if (label) {
            label.scale = vec2(value)
          }
        },
        easings.easeOutCubic,
      ).onEnd(() => {
        if (label) {
          destroy(label)
        }
        tile.tileData = null
        tile.opacity = 0
        tile.scale = vec2(1)
        tile.paused = false
      })
    },
  })
}
