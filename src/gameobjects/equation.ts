import { GAME } from '../constants'
import { isMobile } from '../helpers'

const EQUATION_TEXT_SIZE = 22
const PANEL_PADDING = 20
const PANEL_RADIUS = 10
const MIN_PANEL_HEIGHT = 44
const MAX_DESKTOP_WIDTH = 600

export function addEquation(equationText: string) {
  const maxWidth = Math.min(
    width() - 80,
    isMobile() ? width() - 80 : MAX_DESKTOP_WIDTH,
  )

  const label = make([
    text(equationText, {
      size: EQUATION_TEXT_SIZE,
      align: 'center',
    }),
    color(GAME.WIN_SECONDARY_TEXT_COLOR),
    pos(),
    anchor('center'),
  ])

  if (label.width > maxWidth) {
    label.width = maxWidth
  }

  const panelHeight = Math.max(
    MIN_PANEL_HEIGHT,
    label.height + PANEL_PADDING * 2,
  )

  const panel = add([
    rect(label.width + PANEL_PADDING * 2, panelHeight, {
      radius: PANEL_RADIUS,
    }),
    color(BLACK),
    opacity(0.4),
    pos(),
    anchor('center'),
    fixed(),
  ])

  panel.add(label)

  return Object.assign(panel, {
    height: panelHeight,
  })
}
