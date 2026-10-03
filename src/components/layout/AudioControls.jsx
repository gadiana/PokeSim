// Mute toggle (the "Music on" button) plus a small popover with separate music and SFX volume sliders.

import { useState } from 'react'
import { audioManager } from '../../audio/AudioManager'
import { useAudioSettings } from '../../hooks/useAudioSettings'

const SLIDERS = [['music', 'Music'], ['sfx', 'Sound effects']]
const PERCENT = 100

export default function AudioControls() {
  const settings = useAudioSettings()
  const [open, setOpen] = useState(false)
  const toggleMute = () => { audioManager.unlock(); audioManager.toggleMute() }

  return <div className="audio-controls">
    <button className={`music-button ${settings.muted ? 'muted' : ''}`} type="button" onClick={toggleMute} aria-pressed={!settings.muted}>
      {settings.muted ? '♫ Music off' : '♫ Music on'}
    </button>
    <button className="audio-settings-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="audio-settings" aria-label="Volume settings">
      <span aria-hidden="true">⚙</span>
    </button>
    {open && <div className="audio-settings" id="audio-settings" role="group" aria-label="Volume settings">
      {SLIDERS.map(([kind, label]) => <label key={kind}>
        <span>{label}<b>{Math.round(settings[kind] * PERCENT)}%</b></span>
        <input type="range" min="0" max={PERCENT} value={Math.round(settings[kind] * PERCENT)} onChange={(event) => audioManager.setVolume(kind, event.target.value / PERCENT)} />
      </label>)}
    </div>}
  </div>
}
