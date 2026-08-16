import { AUDIO, GAME } from '../constants'
import { getTextSizeForLength, gridToWorld, playSound } from '../helpers'
import type { LevelData, TileData } from '../types'

export function addTile(
  x: number,
  y: number,
  level: LevelData,
  onClick: () => void,
  canClick: () => boolean,
  tileData: TileData | null = null,
) {
  const position = gridToWorld(x, y, level.width, level.height)

  const isBlocker = tileData?.blocker === true

  const tile = add([
    rect(GAME.TILE_RENDER_SIZE, GAME.TILE_RENDER_SIZE, {
      radius: GAME.TILE_RADIUS,
    }),
    color(
      ...(isBlocker
        ? GAME.BLOCKER_TILE_COLOR
        : tileData
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

  const labelText = isBlocker
    ? ''
    : tileData
      ? GAME.OPERATION_SYMBOLS[tileData.operation] + String(tileData.value)
      : ''

  const labelSize = getTextSizeForLength(labelText.length)

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
    if (isBlocker) return
    if (!tile.paused) {
      onClick()
    }
  })

  tile.onHover(() => {
    if (isBlocker || !canClick()) return
    setCursor('pointer')
    if (tileData) {
      playSound(AUDIO.SOUND_KEYS.hoverTile)
    }
    tween(
      tile.scale,
      vec2(GAME.HOVER_SCALE),
      GAME.HOVER_DURATION,
      (value) => {
        tile.scale = value
        if (label) {
          label.scale = value
        }
      },
      easings.easeOutQuad,
    )
  })

  tile.onHoverEnd(() => {
    if (isBlocker || !canClick()) return
    setCursor('default')
    tween(
      tile.scale,
      vec2(1),
      GAME.HOVER_DURATION,
      (value) => {
        tile.scale = value
        if (label) {
          label.scale = value
        }
      },
      easings.easeOutQuad,
    )
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
        tile.color = rgb(...GAME.BLANK_TILE_COLOR)
        tile.scale = vec2(1)
        tile.paused = false
      })
    },
  })
}
