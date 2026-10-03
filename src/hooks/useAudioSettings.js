// Subscribes a component to the AudioManager's volume/mute settings.

import { useSyncExternalStore } from 'react'
import { audioManager } from '../audio/AudioManager'

let snapshot = audioManager.getSettings()
audioManager.subscribe((settings) => { snapshot = settings })

const subscribe = (listener) => audioManager.subscribe(listener)
const getSnapshot = () => snapshot

export function useAudioSettings() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
