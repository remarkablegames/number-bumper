import { GAME } from '../constants'

export function getTextSizeForLength(length: number): number {
  if (length > 5) return GAME.TEXT_SIZE_SMALL - 4
  if (length > 4) return GAME.TEXT_SIZE_SMALL
  if (length > 3) return GAME.TEXT_SIZE - 2
  return GAME.TEXT_SIZE
}
