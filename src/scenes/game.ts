import { GAME, SCENE } from '../constants'
import type { OperationTile, Player } from '../gameobjects'
import { addOperationTile, addPlayer } from '../gameobjects'
import { applyOperation, generateLevel } from '../helpers/level'
import type { LevelData, TileData } from '../types'

type GameUI = ReturnType<typeof createGameUI>

interface GameState {
  level: number
  levelData: LevelData
  player: Player
  tiles: Map<string, OperationTile>
  moves: number
  isComplete: boolean
  targetLabel: GameUI['targetLabel']
  levelLabel: GameUI['levelLabel']
  movesLabel: GameUI['movesLabel']
}

let state: GameState

function createGameUI(levelData: LevelData) {
  const screenWidth = width()
  const screenHeight = height()
  const padding = 12

  const targetLabel = add([
    text('Target: ' + String(levelData.target), { size: 20 }),
    pos(screenWidth - padding, screenHeight - padding - 60),
    anchor('botright'),
    color(WHITE),
    fixed(),
  ])

  const levelLabel = add([
    text('Level: ' + String(levelData.level), { size: 20 }),
    pos(screenWidth - padding, screenHeight - padding - 30),
    anchor('botright'),
    color(WHITE),
    fixed(),
  ])

  const movesLabel = add([
    text('Moves: 0', { size: 20 }),
    pos(screenWidth - padding, screenHeight - padding),
    anchor('botright'),
    color(WHITE),
    fixed(),
  ])

  add([
    text('R: Restart', { size: 16 }),
    pos(padding, screenHeight - padding),
    anchor('botleft'),
    color(200, 200, 200),
    fixed(),
  ])

  return { targetLabel, levelLabel, movesLabel }
}

function updateCamera() {
  const boardWidth = state.levelData.width * GAME.TILE_SIZE
  const boardHeight = state.levelData.height * GAME.TILE_SIZE
  const viewWidth = width()
  const viewHeight = height()

  const halfBoardWidth = boardWidth / 2
  const halfBoardHeight = boardHeight / 2
  const halfViewWidth = viewWidth / 2
  const halfViewHeight = viewHeight / 2

  const minX = -halfBoardWidth + halfViewWidth
  const maxX = halfBoardWidth - halfViewWidth
  const minY = -halfBoardHeight + halfViewHeight
  const maxY = halfBoardHeight - halfViewHeight

  let targetX = state.player.pos.x
  let targetY = state.player.pos.y

  if (minX <= maxX) {
    targetX = clamp(targetX, minX, maxX)
  } else {
    targetX = 0
  }

  if (minY <= maxY) {
    targetY = clamp(targetY, minY, maxY)
  } else {
    targetY = 0
  }

  setCamPos(targetX, targetY)
}

function updateUI() {
  state.targetLabel.text = 'Target: ' + String(state.levelData.target)
  state.levelLabel.text = 'Level: ' + String(state.levelData.level)
  state.movesLabel.text = 'Moves: ' + String(state.moves)
}

function handleWin() {
  state.isComplete = true

  const overlay = add([
    rect(width(), height()),
    color(BLACK),
    opacity(0.7),
    pos(),
    anchor('topleft'),
    fixed(),
  ])

  const message = add([
    text('Level Complete!\nMoves: ' + String(state.moves), {
      size: 36,
      align: 'center',
    }),
    pos(width() / 2, height() / 2 - 40),
    anchor('center'),
    color(WHITE),
    fixed(),
  ])

  const nextButton = add([
    rect(200, 50, { radius: 8 }),
    color(59, 130, 246),
    pos(width() / 2, height() / 2 + 50),
    anchor('center'),
    area(),
    fixed(),
  ])

  const nextLabel = nextButton.add([
    text('Next Level', { size: 24, align: 'center' }),
    color(WHITE),
    pos(),
    anchor('center'),
  ])

  for (let index = 0; index < 30; index++) {
    const confetti = add([
      rect(8, 8),
      color(randi(100, 255), randi(100, 255), randi(100, 255)),
      pos(width() / 2, height() / 2),
      anchor('center'),
      scale(),
      rotate(),
      opacity(),
      fixed(),
    ])

    const angle = randi(0, 360)
    const speed = rand(100, 300)
    const velocity = vec2(
      Math.cos(deg2rad(angle)) * speed,
      Math.sin(deg2rad(angle)) * speed,
    )

    confetti.onUpdate(() => {
      confetti.pos = confetti.pos.add(velocity.scale(dt()))
      confetti.angle += 120 * dt()
      confetti.opacity -= dt()
      if (confetti.opacity <= 0) {
        destroy(confetti)
      }
    })
  }

  nextButton.onClick(() => {
    destroy(overlay)
    destroy(message)
    destroy(nextButton)
    destroy(nextLabel)
    go(SCENE.GAME, { level: state.level + 1 })
  })
}

function tryMove(tile: TileData) {
  if (state.player.isMoving || state.isComplete) return

  const dx = Math.abs(tile.x - state.player.gridX)
  const dy = Math.abs(tile.y - state.player.gridY)
  if (dx + dy !== 1) return

  const tileKey = String(tile.x) + ',' + String(tile.y)
  const operationTile = state.tiles.get(tileKey)
  if (!operationTile) return

  state.player.goToTile(tile, () => {
    const newValue = applyOperation(
      state.player.value,
      tile.operation,
      tile.value,
    )
    state.player.setValue(newValue)
    state.moves += 1
    updateUI()

    operationTile.consume()
    state.tiles.delete(tileKey)

    if (state.player.value === state.levelData.target) {
      handleWin()
    }
  })
}

function tryMoveTo(gridX: number, gridY: number) {
  const tile = state.levelData.tiles.find(
    (tile) => tile.x === gridX && tile.y === gridY,
  )
  if (tile) {
    tryMove(tile)
  }
}

function restartLevel() {
  go(SCENE.GAME, { level: state.level })
}

function handleInput() {
  onKeyPress((key) => {
    if (state.isComplete) return

    switch (key) {
      case 'left':
      case 'a':
        tryMoveTo(state.player.gridX - 1, state.player.gridY)
        break
      case 'right':
      case 'd':
        tryMoveTo(state.player.gridX + 1, state.player.gridY)
        break
      case 'up':
      case 'w':
        tryMoveTo(state.player.gridX, state.player.gridY - 1)
        break
      case 'down':
      case 's':
        tryMoveTo(state.player.gridX, state.player.gridY + 1)
        break
      case 'r':
        restartLevel()
        break
    }
  })
}

function setupScene(level: number) {
  setBackground(24, 24, 27)

  const levelData = generateLevel(level)
  const ui = createGameUI(levelData)

  const tiles = new Map<string, OperationTile>()

  for (const tile of levelData.tiles) {
    const operationTile = addOperationTile(tile, levelData, () => {
      tryMove(tile)
    })
    tiles.set(String(tile.x) + ',' + String(tile.y), operationTile)
  }

  const player = addPlayer(levelData)

  state = {
    level,
    levelData,
    player,
    tiles,
    moves: 0,
    isComplete: false,
    ...ui,
  }

  handleInput()

  onUpdate(() => {
    updateCamera()
  })
}

scene(SCENE.GAME, (args?: { level?: number }) => {
  const level = args?.level ?? 1
  setupScene(level)
})
