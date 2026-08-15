import { GAME, SCENE } from '../constants'
import { addPlayer, addTile } from '../gameobjects'
import { applyOperation, generateLevel, getLevelConfig } from '../helpers'
import type { LevelData, Operation, Player, Tile } from '../types'

type GameUI = ReturnType<typeof createGameUI>

interface OperationStep {
  operation: Operation
  value: number
  result: number
}

interface GameState {
  level: number
  levelData: LevelData
  player: Player
  tiles: Map<string, Tile>
  moves: number
  isComplete: boolean
  operationHistory: OperationStep[]
  targetLabel: GameUI['targetLabel']
  levelLabel: GameUI['levelLabel']
  movesLabel: GameUI['movesLabel']
}

let state: GameState

function createGameUI(levelData: LevelData) {
  const screenWidth = width()
  const screenHeight = height()
  const padding = GAME.UI_PADDING
  const panelHeight = 44
  const panelPadding = 24

  const targetLabel = make([
    text('Goal: ' + String(levelData.target), {
      size: 24,
      align: 'center',
    }),
    color(WHITE),
    pos(),
    anchor('center'),
  ])

  const targetPanel = add([
    rect(targetLabel.width + panelPadding * 2, panelHeight, { radius: 12 }),
    color(...GAME.OPERATION_COLORS['*']),
    pos(screenWidth / 2, padding + panelHeight / 2),
    anchor('center'),
    fixed(),
  ])
  targetPanel.add(targetLabel)

  add([
    text(getLevelConfig(levelData.level).hint, { size: 20, align: 'center' }),
    pos(screenWidth / 2, padding + panelHeight + 12),
    anchor('top'),
    color(...GAME.UI_HINT_COLOR),
    fixed(),
  ])

  const levelLabel = add([
    text('Level: ' + String(levelData.level), { size: GAME.UI_TEXT_SIZE }),
    pos(screenWidth - padding, screenHeight - padding - 30),
    anchor('botright'),
    color(...GAME.UI_TEXT_COLOR),
    fixed(),
  ])

  const movesLabel = add([
    text('Moves: 0', { size: GAME.UI_TEXT_SIZE }),
    pos(screenWidth - padding, screenHeight - padding),
    anchor('botright'),
    color(...GAME.UI_TEXT_COLOR),
    fixed(),
  ])

  add([
    text('R: Restart', { size: GAME.UI_TEXT_SIZE }),
    pos(padding, screenHeight - padding),
    anchor('botleft'),
    color(...GAME.UI_HINT_COLOR),
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
  state.targetLabel.text = 'Goal: ' + String(state.levelData.target)
  state.levelLabel.text = 'Level: ' + String(state.levelData.level)
  state.movesLabel.text = 'Moves: ' + String(state.moves)
}

function buildEquation(): string {
  const startValue = state.levelData.startValue
  const steps = state.operationHistory

  if (!steps.length) {
    return String(startValue)
  }

  let equation = String(startValue)
  for (const step of steps) {
    equation +=
      ' ' + GAME.OPERATION_SYMBOLS[step.operation] + ' ' + String(step.value)
  }
  equation += ' = ' + String(steps[steps.length - 1].result)
  return equation
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

  const title = add([
    text('Level Complete ✅', {
      size: 40,
      align: 'center',
    }),
    pos(width() / 2, height() / 2 - 80),
    anchor('center'),
    color(WHITE),
    fixed(),
  ])

  const movesText = add([
    text('Moves: ' + String(state.moves), {
      size: 32,
      align: 'center',
    }),
    pos(width() / 2, height() / 2 - 30),
    anchor('center'),
    color(...GAME.WIN_SECONDARY_TEXT_COLOR),
    fixed(),
  ])

  const equationLabel = make([
    text(buildEquation(), {
      size: 22,
      align: 'center',
    }),
    color(...GAME.WIN_SECONDARY_TEXT_COLOR),
    pos(),
    anchor('center'),
  ])

  const equationPanelPadding = 20
  const equationPanel = add([
    rect(equationLabel.width + equationPanelPadding * 2, 44, { radius: 10 }),
    color(BLACK),
    opacity(0.4),
    pos(width() / 2, height() / 2 + 30),
    anchor('center'),
    fixed(),
  ])
  equationPanel.add(equationLabel)

  const nextButton = add([
    rect(200, 50, { radius: 8 }),
    color(...GAME.NEXT_BUTTON_COLOR),
    pos(width() / 2, height() / 2 + 100),
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
    destroy(title)
    destroy(movesText)
    destroy(equationPanel)
    destroy(nextButton)
    destroy(nextLabel)
    go(SCENE.GAME, { level: state.level + 1 })
  })
}

function tryMoveTo(gridX: number, gridY: number) {
  if (state.player.isMoving || state.isComplete) return

  const dx = Math.abs(gridX - state.player.gridX)
  const dy = Math.abs(gridY - state.player.gridY)
  if (dx + dy !== 1) return

  const tileKey = String(gridX) + ',' + String(gridY)
  const tile = state.tiles.get(tileKey)
  if (!tile) return

  state.player.goToTile(gridX, gridY, () => {
    state.moves += 1

    if (tile.tileData) {
      const newValue = applyOperation(
        state.player.value,
        tile.tileData.operation,
        tile.tileData.value,
      )
      state.operationHistory.push({
        operation: tile.tileData.operation,
        value: tile.tileData.value,
        result: newValue,
      })
      state.player.setValue(newValue)
      tile.consume()

      if (state.player.value === state.levelData.target) {
        handleWin()
      }
    }

    updateUI()
  })
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
  setBackground(...GAME.BACKGROUND_COLOR)

  const levelData = generateLevel(level)
  const ui = createGameUI(levelData)

  const tiles = new Map<string, Tile>()

  const tileDataMap = new Map(
    levelData.tiles.map((tile) => [
      String(tile.x) + ',' + String(tile.y),
      tile,
    ]),
  )

  for (let y = 0; y < levelData.height; y++) {
    for (let x = 0; x < levelData.width; x++) {
      const gridX = x
      const gridY = y
      const tileData = tileDataMap.get(String(gridX) + ',' + String(gridY))
      const tile = addTile(
        gridX,
        gridY,
        levelData,
        () => {
          tryMoveTo(gridX, gridY)
        },
        tileData ?? null,
      )
      tiles.set(String(gridX) + ',' + String(gridY), tile)
    }
  }

  const player = addPlayer(levelData)

  state = {
    level,
    levelData,
    player,
    tiles,
    moves: 0,
    isComplete: false,
    operationHistory: [],
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
