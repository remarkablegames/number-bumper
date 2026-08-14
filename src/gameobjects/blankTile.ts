import { GAME } from '../constants'
import type { LevelData } from '../types'
import { gridToWorld } from '../utils'

export function addBlankTile(
  x: number,
  y: number,
  levelData: LevelData,
  onClick: () => void,
) {
  const position = gridToWorld(x, y, levelData.width, levelData.height)

  const blankTile = add([
    rect(GAME.TILE_SIZE, GAME.TILE_SIZE, { radius: GAME.TILE_RADIUS }),
    pos(position),
    anchor('center'),
    area(),
    opacity(0),
    {
      x,
      y,
    },
  ])

  blankTile.onClick(() => {
    onClick()
  })

  return blankTile
}
