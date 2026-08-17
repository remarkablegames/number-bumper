# Game Modes: Classic, Timed, Limited Moves

Add three selectable game modes to Number Bumper, with mode buttons on the Title screen and mode-aware logic in the Game scene.

## Modes

| Mode              | Key            | Mechanic                                                                                               |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| **Classic**       | `classic`      | Current behavior — no constraints, unlimited retries                                                   |
| **Timed**         | `timed`        | Per-level countdown timer; running out = lose that level; leftover time carries to next level (capped) |
| **Limited Moves** | `limitedMoves` | Per-level move limit with carryover — leftover moves from each level carry as bonus to the next        |

## Changes

### 1. Types — `src/types/mode.ts` (new)

```ts
export type GameMode = 'classic' | 'timed' | 'limitedMoves'
```

Export from `src/types/index.ts`.

### 2. Constants — `src/constants/game.ts`

Add mode configuration constants:

```ts
export const MODE_TIME_LIMIT = (level: number) => 30 + level * 5 // seconds per level
export const MODE_MOVE_LIMIT = (level: number) => Math.max(5, level + 3) // base moves per level
export const MODE_TIME_CARRYOVER_RATIO = 0.1 // 10% of remaining time carries over
export const MODE_MOVE_CARRYOVER_TIERS = [
  { min: 0, max: 1, bonus: 0 },
  { min: 2, max: 3, bonus: 1 },
  { min: 4, max: 6, bonus: 2 },
  { min: 7, max: 10, bonus: 3 },
  { min: 11, max: 14, bonus: 4 },
  { min: 15, max: Infinity, bonus: 5 },
] as const // bonus moves based on remaining moves at level completion
```

### 3. Title scene — `src/scenes/title.ts`

Replace the single "Play" button with three buttons: **Classic**, **Timed**, **Limited Moves**. Each calls `go(SCENE.GAME, { mode: <mode> })`. Keep the existing press-any-key behavior as Classic mode (key: `classic`).

### 4. Game scene — `src/scenes/game.ts`

**Scene signature**: Accept `{ level?: number; mode?: GameMode; bonusMoves?: number; bonusTime?: number }`.

**GameState additions**:

- `mode: GameMode`
- `timeLeft?: number` — for timed mode (base + carryover)
- `initialBonusTime?: number` — bonus time received at level start (for retry)
- `moveLimit?: number` — for limited moves mode (base + carryover)
- `movesRemaining?: number` — remaining moves in limited moves mode
- `initialBonusMoves?: number` — bonus moves received at level start (for retry)
- `timerLabel?: GameObj` — UI label for timer/moves limit

**createGameUI**: Replace the hint text (below the Goal panel) with the constraint label in timed/limited modes. In Classic mode, keep the hint as-is.

- Timed: shows countdown `⏱ 45s`
- Limited Moves: shows `Moves: 3/8` (used/limit)
- Classic: keep existing hint

**setupScene**: Initialize mode-specific state:

- Timed: `timeLeft = MODE_TIME_LIMIT(level) + (bonusTime ?? 0)`, `initialBonusTime = bonusTime ?? 0`, start `onUpdate` countdown
- Limited Moves: `moveLimit = MODE_MOVE_LIMIT(level) + (bonusMoves ?? 0)`, `movesRemaining = moveLimit`, `initialBonusMoves = bonusMoves ?? 0`

**tryMoveTo**: After incrementing `state.moves`:

- Limited Moves: decrement `movesRemaining`; if it hits 0 and target not reached → `handleLose()`

**onUpdate loop**: For timed mode, decrement `timeLeft` by `dt()`; if ≤ 0 → `handleLose()`.

**handleWin**: Pass carryover bonuses to next level:

- Timed: `bonusTime = Math.ceil(timeLeft * MODE_TIME_CARRYOVER_RATIO)`
- Limited Moves: `bonusMoves = MODE_MOVE_CARRYOVER_TIERS.find(t => movesRemaining >= t.min && movesRemaining <= t.max)?.bonus ?? 0`
- Via `go(SCENE.GAME, { level: level + 1, mode, bonusTime, bonusMoves })`

**handleWin modal**: Show earned bonus on the level complete screen (below moves text), only when bonus > 0:

- Timed: `Time bonus: +3s`
- Limited Moves: `Move bonus: +2`
- Classic: no bonus line

**handleLose**:

- Timed: title "Time's Up ⏰"
- Limited Moves: title "Out of Moves 🚫"
- Classic: keep existing "No Moves Left 😵"
- All modes: Retry button restarts same level with same mode and same initial bonuses (`initialBonusTime` / `initialBonusMoves` — stored in state).

**goNext**: Pass mode, bonusTime, and bonusMoves through to next level.

**restartLevel**: Pass mode and initial bonuses through (`initialBonusTime` / `initialBonusMoves`).

### 5. Preload scene — `src/scenes/preload.ts`

Support `mode` query param for debugging: `?mode=timed&level=5`.

### 6. UI layout adjustments

The constraint label reuses the existing hint position (below the Goal panel). In timed/limited modes, the hint is replaced by the constraint; in Classic mode, the hint stays. Use `GAME.UI_TEXT_SIZE` and `GAME.UI_TEXT_COLOR`. Animate in with the same `easeOutBack` tween.

For timed mode, change label color to red when `timeLeft <= 10`. For limited moves mode, change label color to red when `movesRemaining <= 3`.

### 7. Animations

**Pulse on update**: The constraint label briefly scales up (1.0 → 1.15 → 1.0) with a quick tween (~0.15s, `easeOutQuad`) whenever its value changes:

- Timed: pulse each second as the countdown ticks
- Limited Moves: pulse each time `movesRemaining` decrements

**Bonus pop-in on win modal**: The bonus text ("Time bonus: +3s" / "Move bonus: +2") animates in with a scale-up bounce (`easeOutBack`, ~0.4s, starting from scale 0). Appears after the moves text with a slight delay (~0.2s) for a staggered reveal.

## File Summary

| File                    | Action                                                |
| ----------------------- | ----------------------------------------------------- |
| `src/types/mode.ts`     | New — `GameMode` type                                 |
| `src/types/index.ts`    | Export mode types                                     |
| `src/constants/game.ts` | Add mode config constants                             |
| `src/scenes/title.ts`   | Three mode buttons instead of single Play             |
| `src/scenes/game.ts`    | Mode-aware state, UI, win/lose, and level transitions |
| `src/scenes/preload.ts` | Support `mode` query param                            |

## Non-goals

- Roguelike mode (deferred)
- High score / leaderboard tracking per mode
- Mode-specific level generation (same generator for all modes)
- localStorage persistence of selected mode
