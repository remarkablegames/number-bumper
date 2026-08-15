import type { AudioPlay } from 'kaplay'

import { AUDIO } from '../constants'
import type { Operation } from '../types'

let muted = getData<boolean>(AUDIO.MUTED_KEY, false) ?? false
let musicHandle: AudioPlay | null = null

let muteIcon: ((muted: boolean) => void) | null = null

export function isMuted() {
  return muted
}

export function setMuteIconUpdater(updater: (muted: boolean) => void) {
  muteIcon = updater
}

export function toggleMute() {
  muted = !muted
  setData(AUDIO.MUTED_KEY, muted)

  if (muted) {
    if (musicHandle) {
      musicHandle.paused = true
    }
  } else {
    if (musicHandle) {
      musicHandle.paused = false
    } else {
      playMusic()
    }
  }

  muteIcon?.(muted)
}

export function playSound(name: string) {
  if (muted) return
  play(name, { volume: AUDIO.SOUND_VOLUME })
}

export function playMusic() {
  if (muted) return
  if (musicHandle) {
    musicHandle.paused = false
    return
  }
  musicHandle = play(AUDIO.MUSIC_KEY, { loop: true })
  musicHandle.volume = AUDIO.MUSIC_VOLUME
}

export function stopMusic() {
  if (musicHandle) {
    musicHandle.stop()
    musicHandle = null
  }
}

const OPERATION_SOUND_MAP: Record<Operation, string> = {
  '+': AUDIO.SOUND_KEYS.add,
  '-': AUDIO.SOUND_KEYS.subtract,
  '*': AUDIO.SOUND_KEYS.multiply,
  '/': AUDIO.SOUND_KEYS.divide,
}

export function playOperationSound(operation: Operation) {
  playSound(OPERATION_SOUND_MAP[operation])
}
