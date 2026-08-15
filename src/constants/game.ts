import type { Operation } from '../types'

export const TILE_SIZE = 64
export const TILE_GAP = 8
export const TILE_RENDER_SIZE = TILE_SIZE - TILE_GAP
export const TILE_RADIUS = 8

export const GRID_MIN_WIDTH = 3
export const GRID_MIN_HEIGHT = 3
export const GRID_MAX_WIDTH = 6
export const GRID_MAX_HEIGHT = 6

export const MIN_START_VALUE = 1
export const MAX_START_VALUE = 3

export const MIN_TILE_VALUE = 1
export const MAX_TILE_VALUE = 5

export const MAX_VALUE = 1000

export const MOVE_DURATION = 0.15
export const POP_DURATION = 0.2
export const POP_SCALE = 1.4

export const TEXT_SIZE = 24
export const TEXT_COLOR = WHITE

export const BACKGROUND_COLOR: [number, number, number] = [225, 235, 250]
export const BLANK_TILE_COLOR: [number, number, number] = [245, 250, 255]

export const OPERATIONS = ['+', '-', '*', '/'] as const

export const OPERATION_COLORS: Record<Operation, [number, number, number]> = {
  '+': [255, 175, 100],
  '-': [195, 145, 255],
  '*': [95, 220, 140],
  '/': [95, 175, 255],
}

export const OPERATION_SYMBOLS: Record<Operation, string> = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
}

export const PLAYER_COLOR: [number, number, number] = [80, 80, 80]

export const UI_PADDING = 12
export const UI_TEXT_SIZE = 20
export const UI_TEXT_COLOR: [number, number, number] = [60, 60, 70]
export const UI_HINT_COLOR: [number, number, number] = [100, 100, 110]

export const NEXT_BUTTON_COLOR: [number, number, number] = [59, 130, 246]

export const LEVEL_CONFIGS = [
  { level: 1, width: 3, height: 3, operations: ['+'] as Operation[] },
  { level: 2, width: 4, height: 4, operations: ['+', '-'] as Operation[] },
  { level: 3, width: 5, height: 5, operations: ['+', '-', '*'] as Operation[] },
  {
    level: 4,
    width: 6,
    height: 6,
    operations: ['+', '-', '*', '/'] as Operation[],
  },
]
