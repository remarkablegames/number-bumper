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
export const MAX_TILE_VALUE_BONUS = 5
export const MAX_MULTIPLY_DIVIDE_TILES = 2

export const MAX_VALUE = 1000

export const EMPTY_TILE_LEVEL = 8
export const EMPTY_TILE_MIN_CHANCE = 0.1
export const EMPTY_TILE_MAX_CHANCE = 0.3

export const BLOCKER_TILE_LEVEL = 12
export const BLOCKER_TILE_MIN_COUNT = 1
export const BLOCKER_TILE_MAX_CHANCE = 0.2

export const NEGATIVE_TARGET_LEVEL = 15

export const MOVE_DURATION = 0.15
export const POP_DURATION = 0.35
export const POP_SCALE = 1.2
export const HOVER_SCALE = 1.05
export const HOVER_DURATION = 0.1

export const TEXT_SIZE = 24
export const TEXT_SIZE_SMALL = 18
export const TEXT_COLOR = WHITE
export const MODAL_TITLE_SIZE = 40
export const MODAL_SUBTITLE_SIZE = 32

export const BACKGROUND_COLOR: [number, number, number] = [225, 235, 250]
export const BLANK_TILE_COLOR: [number, number, number] = [245, 250, 255]
export const BLOCKER_TILE_COLOR: [number, number, number] = [100, 100, 105]

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

export const PLAYER_COLOR: [number, number, number] = [240, 240, 245]
export const PLAYER_TEXT_COLOR: [number, number, number] = [60, 60, 70]

export const UI_PADDING = 12
export const UI_TEXT_SIZE = 22
export const UI_TEXT_COLOR: [number, number, number] = [60, 60, 70]
export const UI_HINT_COLOR: [number, number, number] = [100, 100, 110]

export const DEFAULT_BUTTON_COLOR: [number, number, number] = [59, 130, 246]
export const RESTART_BUTTON_COLOR: [number, number, number] = [120, 130, 140]
export const WIN_SECONDARY_TEXT_COLOR: [number, number, number] = [
  200, 210, 225,
]

export const RANDOM_HINTS = [
  'Think before you move',
  'Think carefully',
  'Take your time',
  'Every move counts',
  'Make it count',
  'Plan your path wisely',
  'Plan your next move',
  'Failing to plan is planning to fail',
  'The goal is closer than you think',
  'Numbers dont lie',
  'One step at a time',
  'Find the right sequence',
  'No move is wasted',
  'Move with intent',
  'Move with purpose',
  'Start with purpose',
  'Operate with purpose',
  'The answer is in the numbers',
  'Strategy is choosing what not to do',
  'Deliberate moves',
  'You can do it',
  'Believe in yourself',
  'You got this',
  'Don’t give up',
  'Life finds a way',
  'Make it happen',
  'Find your own way',
  'Find your own path',
  'Follow your intuition',
  'Listen to your heart',
  'Trust your instincts',
  'Trust your gut',
  'Trust your intuition',
  'Trust your path',
  'Trust your journey',
  'Trust the process',
  'The right path may not be the easiest',
  'Create your own path',
  'Carve your own path',
  'The path is yours to create',
  'Make your mark',
  'Leave your mark',
  'Create your opportunity',
  'Create your moment',
  'Make your moment',
]

export const LEVEL_CONFIGS = [
  {
    level: 1,
    width: 3,
    height: 3,
    operations: ['+'] as const,
    hint: 'Every journey starts with a single step',
  },
  {
    level: 2,
    width: 3,
    height: 3,
    operations: ['+'] as const,
    hint: 'Add it up',
  },
  {
    level: 3,
    width: 3,
    height: 3,
    operations: ['+'] as const,
    hint: 'Plus one more time',
  },
  {
    level: 4,
    width: 3,
    height: 3,
    operations: ['+', '-'] as const,
    hint: 'Subtract your way out',
  },
  {
    level: 5,
    width: 3,
    height: 3,
    operations: ['+', '-'] as const,
    hint: 'Mind the minuses',
  },
  {
    level: 6,
    width: 3,
    height: 3,
    operations: ['+', '-'] as const,
    hint: 'Up and down we go',
  },
  {
    level: 7,
    width: 4,
    height: 4,
    operations: ['+', '-'] as const,
    hint: 'Room to roam',
    empty: { chance: 0.3, min: 1, max: 2 },
  },
  {
    level: 8,
    width: 4,
    height: 4,
    operations: ['+', '-', '*'] as const,
    hint: 'Times are changing',
    empty: { chance: 0.25, min: 1, max: 2 },
  },
  {
    level: 9,
    width: 4,
    height: 4,
    operations: ['+', '-', '*'] as const,
    hint: 'Multiply your options',
    empty: { chance: 0.2, min: 1, max: 1 },
  },
  {
    level: 10,
    width: 4,
    height: 4,
    operations: ['+', '-', '*'] as const,
    hint: 'Product of your choices',
    empty: { chance: 0.15, min: 1, max: 1 },
  },
  {
    level: 11,
    width: 5,
    height: 5,
    operations: ['+', '-', '*'] as const,
    hint: 'Bigger board, bigger numbers',
  },
  {
    level: 12,
    width: 5,
    height: 5,
    operations: ['+', '-', '*'] as const,
    hint: 'Factor it in',
  },
  {
    level: 13,
    width: 5,
    height: 5,
    operations: ['+', '-', '*'] as const,
    hint: 'Watch the gaps',
  },
  {
    level: 14,
    width: 5,
    height: 5,
    operations: ['+', '-', '*'] as const,
    hint: 'Three operations, one target',
  },
  {
    level: 15,
    width: 5,
    height: 5,
    operations: ['+', '-', '*'] as const,
    hint: 'Last stop before division',
  },
  {
    level: 16,
    width: 5,
    height: 5,
    operations: ['+', '-', '*', '/'] as const,
    hint: 'Divide and conquer',
  },
  {
    level: 17,
    width: 6,
    height: 6,
    operations: ['+', '-', '*', '/'] as const,
    hint: 'All four operations — good luck!',
  },
]
