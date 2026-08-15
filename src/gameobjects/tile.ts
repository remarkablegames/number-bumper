import { AUDIO, GAME } from '../constants'
import { gridToWorld, playSound } from '../helpers'
import type { LevelData, TileData } from '../types'

export function addTile(
  x: number,
  y: number,
  level: LevelData,
  onClick: () => void,
  tileData: TileData | null = null,
) {
  const position = gridToWorld(x, y, level.width, level.height)

  const tile = add([
    rect(GAME.TILE_RENDER_SIZE, GAME.TILE_RENDER_SIZE, {
      radius: GAME.TILE_RADIUS,
    }),
    color(
      ...(tileData
        ? GAME.OPERATION_COLORS[tileData.operation]
        : GAME.BLANK_TILE_COLOR),
    ),
    pos(position),
    anchor('center'),
    area(),
    scale(),
    {
      tileData,
    },
  ])

  const labelText = tileData
    ? GAME.OPERATION_SYMBOLS[tileData.operation] + String(tileData.value)
    : ''

  const labelSize =
    tileData && tileData.value >= 100 ? GAME.TEXT_SIZE_SMALL : GAME.TEXT_SIZE

  const label = tileData
    ? tile.add([
        text(labelText, { size: labelSize, align: 'center' }),
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

  if (tileData) {
    tile.onHover(() => {
      if (!tile.paused) {
        playSound(AUDIO.SOUND_KEYS.hoverTile)
      }
    })
  }

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
        tile.color = rgb(...GAME.BLANK_TILE_COLOR)
        tile.scale = vec2(1)
        tile.paused = false
      })
    },
  })
}
