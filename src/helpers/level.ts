import { GAME } from '../constants'
import type { LevelConfig, LevelData, Operation, TileData } from '../types'

interface Point {
  x: number
  y: number
}

export function applyOperation(
  current: number,
  operation: Operation,
  value: number,
): number {
  switch (operation) {
    case '+':
      return current + value
    case '-':
      return current - value
    case '*':
      return current * value
    case '/':
      return Math.floor(current / value)
  }
}

function getNeighbors(point: Point, width: number, height: number): Point[] {
  const neighbors: Point[] = []
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ]

  for (const direction of directions) {
    const x = point.x + direction.x
    const y = point.y + direction.y
    if (x >= 0 && x < width && y >= 0 && y < height) {
      neighbors.push({ x, y })
    }
  }

  return neighbors
}

function generatePath(
  width: number,
  height: number,
  startX: number,
  startY: number,
  length: number,
): Point[] {
  const path: Point[] = [{ x: startX, y: startY }]
  const visited = new Set<string>()
  visited.add(String(startX) + ',' + String(startY))
  let current = { x: startX, y: startY }

  for (let index = 0; index < length; index++) {
    const neighbors = getNeighbors(current, width, height).filter(
      (neighbor) => !visited.has(String(neighbor.x) + ',' + String(neighbor.y)),
    )
    if (!neighbors.length) break
    current = choose(neighbors)
    path.push(current)
    visited.add(String(current.x) + ',' + String(current.y))
  }

  return path
}

function isValidOperation(
  current: number,
  operation: Operation,
  value: number,
): boolean {
  switch (operation) {
    case '+':
      return current + value <= GAME.MAX_VALUE
    case '-':
      return value <= current
    case '*':
      return current * value <= GAME.MAX_VALUE
    case '/':
      return value > 0 && current > 0
  }
}

function randomTileValue(level: number): number {
  const max = GAME.MAX_TILE_VALUE + Math.min(level, GAME.MAX_TILE_VALUE_BONUS)
  return randi(GAME.MIN_TILE_VALUE, max)
}

function chooseOperation(
  current: number,
  operations: readonly Operation[],
  level: number,
  required?: Operation,
): Operation {
  if (required && isValidOperation(current, required, randomTileValue(level))) {
    return required
  }

  const valid = operations.filter((operation) =>
    isValidOperation(current, operation, randomTileValue(level)),
  )
  if (!valid.length) return operations[0]
  return choose(valid)
}

function clampValueForOperation(
  current: number,
  operation: Operation,
  value: number,
): number {
  switch (operation) {
    case '+':
      return Math.min(value, GAME.MAX_VALUE - current)
    case '-':
      return Math.min(value, current)
    case '*':
      if (current === 0) return value
      return Math.min(value, Math.floor(GAME.MAX_VALUE / current))
    case '/':
      return Math.max(1, Math.min(value, current))
  }
}

function generatePathOperations(
  startValue: number,
  path: Point[],
  operations: readonly Operation[],
  level: number,
  required?: Operation,
): TileData[] {
  let current = startValue
  const tiles: TileData[] = []
  const requiredIndex = required === undefined ? -1 : randi(0, path.length - 2)
  let mulDivCount = 0

  const safeOperations = operations.filter((op) => op === '+' || op === '-')

  for (let index = 1; index < path.length; index++) {
    const point = path[index]
    const canMulDiv = mulDivCount < GAME.MAX_MULTIPLY_DIVIDE_TILES
    const availableOps = canMulDiv ? operations : safeOperations
    const operation =
      index - 1 === requiredIndex
        ? chooseOperation(current, availableOps, level, required)
        : chooseOperation(current, availableOps, level)
    if (operation === '*' || operation === '/') mulDivCount++
    let value = randomTileValue(level)
    value = clampValueForOperation(current, operation, value)
    current = applyOperation(current, operation, value)
    tiles.push({ x: point.x, y: point.y, operation, value })
  }

  return tiles
}

function getRequiredOperation(level: number): Operation | undefined {
  switch (level) {
    case 4:
      return '-'
    case 8:
      return '*'
    case 16:
      return '/'
    default:
      return undefined
  }
}

function generateRandomTile(
  operations: readonly Operation[],
  level: number,
): TileData {
  const operation = choose([...operations])
  let value = randomTileValue(level)
  if (operation === '/') {
    value = Math.max(2, value)
  }
  return {
    x: -1,
    y: -1,
    operation,
    value,
  }
}

function fillRemainingTiles(
  width: number,
  height: number,
  startX: number,
  startY: number,
  pathTiles: TileData[],
  operations: readonly Operation[],
  level: number,
): TileData[] {
  const tiles = [...pathTiles]
  const occupied = new Set(
    pathTiles.map((tile) => String(tile.x) + ',' + String(tile.y)),
  )

  // Reserve the player's starting cell.
  occupied.add(String(startX) + ',' + String(startY))

  const allowEmpty = level >= GAME.EMPTY_TILE_LEVEL

  const emptyChance = allowEmpty
    ? Math.min(
        GAME.EMPTY_TILE_MIN_CHANCE + (level - GAME.EMPTY_TILE_LEVEL) * 0.02,
        GAME.EMPTY_TILE_MAX_CHANCE,
      )
    : 0

  const pathMulDiv = pathTiles.filter(
    (tile) => tile.operation === '*' || tile.operation === '/',
  ).length
  let mulDivCount = pathMulDiv
  const safeOperations = operations.filter((op) => op === '+' || op === '-')

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (occupied.has(String(x) + ',' + String(y))) continue
      if (Math.random() < emptyChance) continue
      const availableOps =
        mulDivCount < GAME.MAX_MULTIPLY_DIVIDE_TILES
          ? operations
          : safeOperations
      const tile = generateRandomTile(availableOps, level)
      if (tile.operation === '*' || tile.operation === '/') mulDivCount++
      tile.x = x
      tile.y = y
      tiles.push(tile)
    }
  }

  return tiles
}

export function generateLevel(level: number): LevelData {
  const { width, height, operations } = getLevelConfig(level)
  const startValue = randi(GAME.MIN_START_VALUE, GAME.MAX_START_VALUE)
  const startX = randi(0, width - 1)
  const startY = randi(0, height - 1)

  const pathLength = Math.min(
    Math.max(2, level + 1),
    Math.floor((width * height) / 2),
  )

  let attempts = 0
  const MAX_ATTEMPTS = 100

  while (attempts < MAX_ATTEMPTS) {
    attempts++
    const path = generatePath(
      width,
      height,
      startX,
      startY,
      pathLength + (attempts % 3),
    )
    if (path.length < 2) continue

    const required = getRequiredOperation(level)
    const pathTiles = generatePathOperations(
      startValue,
      path,
      operations,
      level,
      required,
    )

    if (pathTiles.length < Math.min(pathLength, level)) continue

    const target = applyOperationValue(
      startValue,
      pathTiles.map((tile) => ({
        operation: tile.operation,
        value: tile.value,
      })),
    )

    if (target < 1) continue
    if (target < level) continue

    const allTiles = fillRemainingTiles(
      width,
      height,
      startX,
      startY,
      pathTiles,
      operations,
      level,
    )
    return {
      level,
      width,
      height,
      startX,
      startY,
      startValue,
      target,
      tiles: allTiles,
    }
  }

  // Fallback level with simple addition
  return {
    level,
    width,
    height,
    startX,
    startY,
    startValue,
    target: startValue + 2,
    tiles: fillRemainingTiles(
      width,
      height,
      startX,
      startY,
      [
        {
          x: Math.min(startX + 1, width - 1),
          y: startY,
          operation: '+',
          value: 2,
        },
      ],
      ['+'],
      level,
    ),
  }
}

function applyOperationValue(
  current: number,
  operations: { operation: Operation; value: number }[],
): number {
  return operations.reduce(
    (value, tile) => applyOperation(value, tile.operation, tile.value),
    current,
  )
}

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
    hint: GAME.LEVEL_CONFIGS[GAME.LEVEL_CONFIGS.length - 1].hint,
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
