export type Operation = '+' | '-' | '*' | '/'

export interface TileData {
  x: number
  y: number
  operation: Operation
  value: number
}

export interface LevelData {
  level: number
  width: number
  height: number
  startX: number
  startY: number
  startValue: number
  target: number
  tiles: TileData[]
}

export interface LevelConfig {
  level: number
  width: number
  height: number
  operations: Operation[]
}
