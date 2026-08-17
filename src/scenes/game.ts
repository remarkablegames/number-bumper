import { AUDIO, GAME, SCENE } from '../constants'
import { addButton, addEquation, addPlayer, addTile } from '../gameobjects'
import {
  addFloatingSymbols,
  applyOperation,
  generateLevel,
  getLevelConfig,
  isMobile,
  isMuted,
  isTouchscreen,
  playMusic,
  playOperationSound,
  playSound,
  setMuteIconUpdater,
  toggleMute,
} from '../helpers'
import type { GameMode, LevelData, Operation, Player, Tile } from '../types'

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
  mode: GameMode
  timeLeft?: number
  initialBonusTime?: number
  moveLimit?: number
  movesRemaining?: number
  initialBonusMoves?: number
  lastConstraintValue?: number
  targetLabel: GameUI['targetLabel']
  levelLabel: GameUI['levelLabel']
  movesLabel: GameUI['movesLabel']
  constraintLabel: GameUI['constraintLabel']
}

let state: GameState

function createGameUI(levelData: LevelData, mode: GameMode) {
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
    color(GAME.OPERATION_COLORS['*']),
    pos(screenWidth / 2, padding + panelHeight / 2),
    anchor('center'),
    fixed(),
    scale(0),
  ])
  targetPanel.add(targetLabel)

  const isClassic = mode === 'classic'
  const showHint = !(isMobile() && levelData.width >= 8)

  const constraintLabel = !isClassic
    ? add([
        text('', {
          size: 20,
          align: 'center',
          width: screenWidth - padding * 2,
        }),
        pos(screenWidth / 2, padding + panelHeight + 12),
        anchor('top'),
        color(GAME.UI_TEXT_COLOR),
        fixed(),
        scale(0),
      ])
    : null

  const hint =
    isClassic && showHint
      ? add([
          text(getLevelConfig(levelData.level).hint, {
            size: 20,
            align: 'center',
            width: screenWidth - padding * 2,
          }),
          pos(screenWidth / 2, padding + panelHeight + 12),
          anchor('top'),
          color(GAME.UI_HINT_COLOR),
          fixed(),
          scale(0),
        ])
      : null

  const touchscreen = isTouchscreen()

  const levelLabel = add([
    text('Level: ' + String(levelData.level), { size: GAME.UI_TEXT_SIZE }),
    pos(screenWidth - padding, screenHeight - padding - 30),
    anchor('botright'),
    color(GAME.UI_TEXT_COLOR),
    fixed(),
    scale(0),
  ])

  const movesLabel = add([
    text('Moves: 0', { size: GAME.UI_TEXT_SIZE }),
    pos(screenWidth - padding, screenHeight - padding),
    anchor('botright'),
    color(GAME.UI_TEXT_COLOR),
    fixed(),
    scale(0),
  ])

  const restartText = touchscreen
    ? null
    : add([
        text('R: Restart', { size: GAME.UI_TEXT_SIZE }),
        pos(padding, screenHeight - padding),
        anchor('botleft'),
        color(GAME.UI_HINT_COLOR),
        fixed(),
        scale(0),
      ])

  const restartHint = addButton(
    '↻',
    {
      pos: vec2(padding + (touchscreen ? 0 : 110), screenHeight - padding),
      anchor: 'botleft',
      textSize: 28,
      padding: 12,
      radius: 8,
      color: GAME.RESTART_BUTTON_COLOR,
    },
    restartLevel,
  )

  const muteHint = touchscreen
    ? null
    : add([
        text('M: Mute', { size: GAME.UI_TEXT_SIZE }),
        pos(padding, screenHeight - padding - 30),
        anchor('botleft'),
        color(GAME.UI_HINT_COLOR),
        fixed(),
        scale(0),
      ])

  const uiElements = [
    targetPanel,
    levelLabel,
    movesLabel,
    restartHint,
    ...(restartText ? [restartText] : []),
    ...(muteHint ? [muteHint] : []),
    ...(hint ? [hint] : []),
    ...(constraintLabel ? [constraintLabel] : []),
  ]

  for (const el of uiElements) {
    tween(
      el.scale,
      vec2(1),
      0.5,
      (value) => (el.scale = value),
      easings.easeOutBack,
    )
  }

  return { targetLabel, levelLabel, movesLabel, constraintLabel }
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

  if (state.mode === 'limitedMoves') {
    updateConstraintLabel()
  }
}

function updateConstraintLabel() {
  const label = state.constraintLabel
  if (!label) return

  if (state.mode === 'timed' && state.timeLeft !== undefined) {
    const seconds = Math.max(0, Math.ceil(state.timeLeft))
    label.text = '⏱ ' + String(seconds) + 's'
    if (state.timeLeft <= GAME.MODE_TIME_WARNING_THRESHOLD) {
      label.color = rgb(...GAME.MODE_WARNING_COLOR)
    } else {
      label.color = rgb(...GAME.UI_TEXT_COLOR)
    }
  } else if (
    state.mode === 'limitedMoves' &&
    state.movesRemaining !== undefined &&
    state.moveLimit !== undefined
  ) {
    label.text = 'Moves: ' + String(state.moves) + '/' + String(state.moveLimit)
    if (state.movesRemaining <= GAME.MODE_MOVE_WARNING_THRESHOLD) {
      label.color = rgb(...GAME.MODE_WARNING_COLOR)
    } else {
      label.color = rgb(...GAME.UI_TEXT_COLOR)
    }
  }
}

function pulseConstraintLabel() {
  const label = state.constraintLabel
  if (!label) return
  tween(
    label.scale,
    vec2(1.15),
    0.075,
    (value) => {
      label.scale = value
    },
    easings.easeOutQuad,
  ).onEnd(() => {
    tween(
      label.scale,
      vec2(1),
      0.075,
      (value) => {
        label.scale = value
      },
      easings.easeOutQuad,
    )
  })
}

function calculateTimeBonus(): number {
  if (state.timeLeft === undefined || state.timeLeft <= 0) return 0
  return Math.ceil(state.timeLeft * GAME.MODE_TIME_CARRYOVER_RATIO)
}

function calculateMoveBonus(): number {
  const remaining = state.movesRemaining
  if (remaining === undefined) return 0
  const tier = GAME.MODE_MOVE_CARRYOVER_TIERS.find(
    (t) => remaining >= t.min && remaining <= t.max,
  )
  return tier?.bonus ?? 0
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
  playSound(AUDIO.SOUND_KEYS.win)

  const timeBonus = calculateTimeBonus()
  const moveBonus = calculateMoveBonus()
  const bonusText =
    state.mode === 'timed' && timeBonus > 0
      ? 'Time bonus: +' + String(timeBonus) + 's'
      : state.mode === 'limitedMoves' && moveBonus > 0
        ? 'Move bonus: +' + String(moveBonus)
        : null

  for (const tile of state.tiles.values()) {
    tile.paused = true
  }

  const overlay = add([
    rect(width(), height()),
    color(BLACK),
    opacity(0.7),
    pos(),
    anchor('topleft'),
    fixed(),
  ])

  const modalWidth = width() - 80

  const title = make([
    text('Level Complete ✅', {
      size: GAME.MODAL_TITLE_SIZE,
      align: 'center',
      width: modalWidth,
    }),
    pos(),
    anchor('center'),
    color(WHITE),
    fixed(),
  ])

  const movesText = make([
    text('Moves: ' + String(state.moves), {
      size: GAME.MODAL_SUBTITLE_SIZE,
      align: 'center',
      width: modalWidth,
    }),
    pos(),
    anchor('center'),
    color(GAME.WIN_SECONDARY_TEXT_COLOR),
    fixed(),
  ])

  const bonusTextLabel = bonusText
    ? make([
        text(bonusText, {
          size: GAME.MODAL_SUBTITLE_SIZE,
          align: 'center',
          width: modalWidth,
        }),
        pos(),
        anchor('center'),
        color(GAME.OPERATION_COLORS['+']),
        fixed(),
        scale(0),
      ])
    : null

  const equationPanel = addEquation(buildEquation())

  const gap = 16
  const bonusHeight = bonusTextLabel ? bonusTextLabel.height + gap : 0
  const totalHeight =
    title.height +
    gap +
    movesText.height +
    gap +
    bonusHeight +
    gap +
    equationPanel.height +
    gap +
    60
  const startY = height() / 2 - totalHeight / 2

  title.pos = vec2(width() / 2, startY + title.height / 2)
  add(title)

  movesText.pos = vec2(
    width() / 2,
    startY + title.height + gap + movesText.height / 2,
  )
  add(movesText)

  let afterBonusY = startY + title.height + gap + movesText.height + gap

  if (bonusTextLabel) {
    bonusTextLabel.pos = vec2(
      width() / 2,
      afterBonusY + bonusTextLabel.height / 2,
    )
    add(bonusTextLabel)
    afterBonusY += bonusTextLabel.height + gap
    wait(0.2, () => {
      tween(
        bonusTextLabel.scale,
        vec2(1),
        0.4,
        (value) => {
          bonusTextLabel.scale = value
        },
        easings.easeOutBack,
      )
    })
  }

  equationPanel.pos = vec2(
    width() / 2,
    afterBonusY + gap + equationPanel.height / 2,
  )

  function goNext() {
    destroy(overlay)
    destroy(title)
    destroy(movesText)
    if (bonusTextLabel) destroy(bonusTextLabel)
    destroy(equationPanel)
    destroy(nextButton)
    go(SCENE.GAME, {
      level: state.level + 1,
      mode: state.mode,
      bonusTime: timeBonus > 0 ? timeBonus : undefined,
      bonusMoves: moveBonus > 0 ? moveBonus : undefined,
    })
  }

  const nextButton = addButton(
    'Next Level',
    {
      pos: vec2(
        width() / 2,
        afterBonusY + gap + equationPanel.height + gap + 30,
      ),
      textSize: 24,
      padding: 32,
      radius: 8,
    },
    goNext,
  )

  onKeyPress(['space', 'enter'], goNext)

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
}

function tryMoveTo(gridX: number, gridY: number) {
  if (state.player.isMoving || state.isComplete) return

  const dx = Math.abs(gridX - state.player.gridX)
  const dy = Math.abs(gridY - state.player.gridY)
  if (dx + dy !== 1) return

  const tileKey = String(gridX) + ',' + String(gridY)
  const tile = state.tiles.get(tileKey)
  if (!tile) return
  if (tile.tileData?.blocker) return

  playSound(AUDIO.SOUND_KEYS.move)

  state.player.goToTile(gridX, gridY, () => {
    state.moves += 1

    if (state.mode === 'limitedMoves' && state.movesRemaining !== undefined) {
      state.movesRemaining -= 1
      pulseConstraintLabel()
      if (
        state.movesRemaining <= 0 &&
        state.player.value !== state.levelData.target
      ) {
        updateUI()
        handleLose()
        return
      }
    }

    if (tile.tileData) {
      const { operation, value } = tile.tileData
      const newValue = applyOperation(state.player.value, operation, value)
      state.operationHistory.push({
        operation,
        value,
        result: newValue,
      })
      state.player.setValue(newValue)
      tile.consume()
      playOperationSound(operation)

      if (state.player.value === state.levelData.target) {
        handleWin()
      } else {
        const hasTilesLeft = Array.from(state.tiles.values()).some(
          (tile) =>
            !tile.paused && tile.tileData !== null && !tile.tileData.blocker,
        )
        if (!hasTilesLeft) {
          handleLose()
        }
      }
    }

    updateUI()
  })
}

function handleLose() {
  state.isComplete = true

  for (const tile of state.tiles.values()) {
    tile.paused = true
  }

  const overlay = add([
    rect(width(), height()),
    color(BLACK),
    opacity(0.7),
    pos(),
    anchor('topleft'),
    fixed(),
  ])

  const loseTitle =
    state.mode === 'timed'
      ? "Time's Up ⏰"
      : state.mode === 'limitedMoves'
        ? 'Out of Moves 🚫'
        : 'No Moves Left 😵'

  const title = add([
    text(loseTitle, {
      size: GAME.MODAL_TITLE_SIZE,
      align: 'center',
    }),
    pos(width() / 2, height() / 2 - 70),
    anchor('center'),
    color(WHITE),
    fixed(),
  ])

  const targetText = add([
    text(
      `Goal: ${String(state.levelData.target)}\nCurrent: ${String(state.player.value)}`,
      {
        size: GAME.MODAL_SUBTITLE_SIZE,
        align: 'center',
      },
    ),
    pos(width() / 2, height() / 2),
    anchor('center'),
    color(GAME.WIN_SECONDARY_TEXT_COLOR),
    fixed(),
  ])

  function retry() {
    destroy(overlay)
    destroy(title)
    destroy(targetText)
    destroy(retryButton)
    restartLevel()
  }

  const retryButton = addButton(
    'Retry',
    {
      pos: vec2(width() / 2, height() / 2 + 80),
      textSize: 24,
      padding: 32,
      radius: 8,
    },
    retry,
  )

  onKeyPress(['space', 'enter'], retry)
}

function restartLevel() {
  go(SCENE.GAME, {
    level: state.level,
    mode: state.mode,
    bonusTime: state.initialBonusTime,
    bonusMoves: state.initialBonusMoves,
  })
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
      case 'm':
        toggleMute()
        break
    }
  })
}

function createMuteIcon() {
  const padding = GAME.UI_PADDING
  const icon = add([
    text(isMuted() ? '🔇' : '🔊', { size: 36 }),
    pos(padding),
    anchor('topleft'),
    area(),
    scale(),
    fixed(),
  ])

  icon.onHover(() => {
    setCursor('pointer')
    playSound(AUDIO.SOUND_KEYS.hoverButton)
    tween(
      icon.scale,
      vec2(GAME.HOVER_SCALE),
      GAME.HOVER_DURATION,
      (value) => {
        icon.scale = value
      },
      easings.easeOutQuad,
    )
  })

  icon.onHoverEnd(() => {
    setCursor('default')
    tween(
      icon.scale,
      vec2(1),
      GAME.HOVER_DURATION,
      (value) => {
        icon.scale = value
      },
      easings.easeOutQuad,
    )
  })

  icon.onClick(() => {
    playSound(AUDIO.SOUND_KEYS.click)
    toggleMute()
  })

  setMuteIconUpdater((muted) => {
    icon.text = muted ? '🔇' : '🔊'
  })
}

function setupScene(
  level: number,
  mode: GameMode,
  bonusTime?: number,
  bonusMoves?: number,
) {
  setBackground(...GAME.BACKGROUND_COLOR)

  addFloatingSymbols(0.15)

  playMusic()
  createMuteIcon()

  const levelData = generateLevel(level)
  const ui = createGameUI(levelData, mode)

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
        () => {
          if (state.player.isMoving || state.isComplete) return false
          if (tileData?.blocker) return false
          const dx = Math.abs(gridX - state.player.gridX)
          const dy = Math.abs(gridY - state.player.gridY)
          return dx + dy === 1
        },
        tileData ?? null,
      )
      tiles.set(String(gridX) + ',' + String(gridY), tile)
    }
  }

  const centerX = (levelData.width - 1) / 2
  const centerY = (levelData.height - 1) / 2

  for (const [key, tile] of tiles) {
    const [gx, gy] = key.split(',').map(Number)
    const dist = Math.sqrt((gx - centerX) ** 2 + (gy - centerY) ** 2)
    const delay = dist * 0.04

    tile.scale = vec2(0)
    wait(delay, () => {
      tween(
        tile.scale,
        vec2(1),
        0.3,
        (value) => (tile.scale = value),
        easings.easeOutBack,
      )
    })
  }

  const player = addPlayer(levelData)

  const timeLeft =
    mode === 'timed'
      ? GAME.MODE_TIME_LIMIT(level) + (bonusTime ?? 0)
      : undefined
  const moveLimit =
    mode === 'limitedMoves'
      ? GAME.MODE_MOVE_LIMIT(level) + (bonusMoves ?? 0)
      : undefined

  state = {
    level,
    levelData,
    player,
    tiles,
    moves: 0,
    isComplete: false,
    operationHistory: [],
    mode,
    timeLeft,
    initialBonusTime: bonusTime,
    moveLimit,
    movesRemaining: moveLimit,
    initialBonusMoves: bonusMoves,
    ...ui,
  }

  if (mode === 'timed') {
    updateConstraintLabel()
  } else if (mode === 'limitedMoves') {
    updateConstraintLabel()
  }

  handleInput()

  onUpdate(() => {
    updateCamera()

    if (
      state.mode === 'timed' &&
      state.timeLeft !== undefined &&
      !state.isComplete
    ) {
      const prevSeconds = Math.ceil(state.timeLeft)
      state.timeLeft -= dt()
      const newSeconds = Math.ceil(state.timeLeft)
      if (newSeconds !== prevSeconds) {
        updateConstraintLabel()
        pulseConstraintLabel()
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0
        handleLose()
      }
    }
  })
}

scene(
  SCENE.GAME,
  (args?: {
    level?: number
    mode?: GameMode
    bonusTime?: number
    bonusMoves?: number
  }) => {
    const level = args?.level ?? 1
    const mode = args?.mode ?? 'classic'
    setupScene(level, mode, args?.bonusTime, args?.bonusMoves)
  },
)
