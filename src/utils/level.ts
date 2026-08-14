import { GAME } from '../constants'
import type { LevelConfig } from '../types'

export function getLevelConfig(level: number): LevelConfig {
  if (level <= GAME.LEVEL_CONFIGS.length) {
    return GAME.LEVEL_CONFIGS[level - 1]
  }

  return {
    level,
    width: Math.min(
      GAME.GRID_MAX_WIDTH + (level - GAME.LEVEL_CONFIGS.length),
      8,
    ),
    height: Math.min(
      GAME.GRID_MAX_HEIGHT + (level - GAME.LEVEL_CONFIGS.length),
      8,
    ),
    operations: GAME.LEVEL_CONFIGS[GAME.LEVEL_CONFIGS.length - 1].operations,
  }
}

export function gridToWorld(
  gridX: number,
  gridY: number,
  gridWidth: number,
  gridHeight: number,
) {
  return vec2(
    (gridX - (gridWidth - 1) / 2) * GAME.TILE_SIZE,
    (gridY - (gridHeight - 1) / 2) * GAME.TILE_SIZE,
  )
}
