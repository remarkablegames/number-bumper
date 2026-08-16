import { GAME } from '../constants'

const MOBILE_WIDTH = 450

export function isMobile() {
  return width() < MOBILE_WIDTH
}

export function isTouchscreen() {
  return window.matchMedia('(pointer: coarse)').matches
}

export function getTextSizeForLength(length: number): number {
  if (length > 5) return GAME.TEXT_SIZE_SMALL - 4
  if (length > 4) return GAME.TEXT_SIZE_SMALL
  if (length > 3) return GAME.TEXT_SIZE - 2
  return GAME.TEXT_SIZE
}
