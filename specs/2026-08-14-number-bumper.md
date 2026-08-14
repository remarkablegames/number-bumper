# Number Bumper: Grid Math Puzzle Game

Build a grid-based math puzzle where the player controls a number tile with mouse or keyboard, bumps into operation tiles to apply `+`, `-`, `×`, or `÷`, and tries to reach a procedurally generated target value exactly.

## Scope

MVP for the first playable version:

- Grid-based board that starts small (e.g. 3×3 for level 1) and grows with difficulty (up to 6×6 or larger in later levels), with one player tile and several operation tiles.
- Player starts with a small integer (e.g. `1`) and a target is generated (e.g. `10`).
- Operation tiles show an operator and a value (e.g. `+3`, `-2`, `×4`, `÷2`). The first level uses only `+`; later levels progressively unlock `-`, `×`, and `÷`.
- Player can move to an adjacent tile in the four cardinal directions (up, down, left, right — no diagonals) with either:
  - **Keyboard:** WASD / arrow keys move one grid cell at a time.
  - **Mouse:** clicking an orthogonally adjacent operation tile moves the player there.
- On contact, the operation is applied to the player's current value, the operation tile disappears, and the move is snapped to the grid.
- Win when the player's current value equals the target value after any move.
- Simple reset/restart to generate a new puzzle.

## Key Mechanics

- **Turn-based grid movement:** each key press or valid click moves the player exactly one cell in a cardinal direction (no diagonal moves).
- **Level progression:** 4 tutorial levels introduce one new operation each (`+`, `-`, `×`, `÷`); after that, levels scale grid size and tile values procedurally with all operations available.
- **Operation resolution:** `+`, `-`, `×`, `÷` are applied in order. Division uses integer division or only appears when it divides evenly, keeping values as integers.
- **Tile consumption:** operation tiles are removed after one use.
- **Target check:** evaluated after every operation application; win if `current === target`.
- **Win state:** show a "Level Complete" overlay, the number of moves taken, and a simple confetti/particle burst. Offer a "Next Level" button.
- **Value display:** the player's current value is shown on the player tile, the target value is shown in a fixed UI overlay, and each operation tile shows its operator and value.
- **Color coding:** the player tile has a distinct color, and each operation (`+`, `-`, `×`, `÷`) has its own tile color for quick recognition.
- **Animations:** player tweens between grid cells; consumed operation tiles briefly flash/scale before disappearing; the player's value text pops — scales up and eases back to default size — whenever the value changes.

## Technical Implementation

- Render the grid with Kaplay `rect` and `text` components; no new sprite assets needed.
- Tile size is fixed; larger grids can extend beyond the viewport, and the camera follows the player. The player stays centered, with the view clamped to the board edges so the camera never shows empty space outside the grid.
- Touch input uses the same click handler as mouse input.
- Represent the board as a 2D array plus a list of operation tiles with their grid positions.
- Move the player GameObject by tweening to the target grid cell, then apply the operation. Animate tile removal and value text pop (scale up, ease back).
- Use a single `Game` scene that generates the level and manages input.
- Keep constants (grid size, tile size, colors, speed) in `src/constants/`.
- Add operation tile and grid logic in `src/gameobjects/`; replace the current placeholder `enemy.ts` and free-movement `player.ts`.
- Minimal UI in the bottom-right of the screen showing the target value, current level, and a reset hint; the player's current value is also drawn on the player tile.
- Track move count; display it on the win overlay.

## Files to Create / Modify

- `src/scenes/game.ts` — level generation, input handling, win state.
- `src/gameobjects/player.ts` — player number tile, movement logic, value component.
- `src/gameobjects/operationTile.ts` (new) — operation tile object with display and value.
- `src/gameobjects/index.ts` — export new game objects.
- `src/constants/` — add grid, operation, and game-rule constants.
- `src/events/cursors.ts` — switch to grid-based keyboard movement and add mouse input.

## Assumptions

- Board size starts small (3×3) and scales up (e.g. 4×4, 5×5, 6×6) as levels introduce new operations.
- Starting value: a small integer (e.g. `1`–`3`).
- Level 1 uses only `+` tiles; later levels add `-`, `×`, `÷`.
- Target: generated within a range and verified solvable via a small pathfinding/solver that explores tile sequences. If no solution is found, the level is regenerated.
- Solvability: every generated level is checked by a solver before being shown to the player.
- Tile values: small positive integers.
- Visuals: colored rectangles with text; asset-free for the MVP.
- Color palette: player tile and each operation type have distinct colors defined in constants.
- UI layout: target and level in the bottom-right corner.
- Camera: follows the player and keeps the player centered. View is clamped to the board bounds; for small grids the whole board is visible.
- Mobile: tap-to-move on adjacent tiles handles input; the camera follows the player as it moves through the board.

## Future Extensions

- Additional operations (`^2`, `negate`, `set to N`).
- Timed mode, move-limited mode, undo button.
- Pre-defined level packs and difficulty ramp.
- Sound and animation polish.
