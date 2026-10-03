// The only place audio is created: music (with crossfades), SFX, Pokémon cries, volumes, mute, and saved settings.

import { Howl, Howler } from 'howler'
import { AUDIO_DEFAULTS, AUDIO_MIX, AUDIO_STORAGE_KEY, BATTLE_TIMINGS, CRY_CACHE_LIMIT } from '../constants/battleConfig'
import { MUSIC_TRACKS, SFX_FILES, hitSfxKey } from './audioFiles'

const clampVolume = (value) => Math.min(1, Math.max(0, Number(value) || 0))

function loadSettings() {
  try {
    return { ...AUDIO_DEFAULTS, ...JSON.parse(window.localStorage.getItem(AUDIO_STORAGE_KEY) || '{}') }
  } catch {
    return { ...AUDIO_DEFAULTS }
  }
}

class AudioManager {
  #settings = loadSettings()
  #listeners = new Set()
  #unlocked = false
  #sounds = new Map()
  #failed = new Set()
  #cries = new Map()
  #music = { key: null, howl: null }
  #lowHpActive = false

  constructor() {
    Howler.mute(Boolean(this.#settings.muted))
  }

  /** Call from a user click handler. Browsers block audio until the page has had a user gesture. */
  unlock() {
    if (this.#unlocked) return
    this.#unlocked = true
    Howler.ctx?.resume?.()
  }

  // ---- settings -------------------------------------------------------------
  getSettings() { return { ...this.#settings } }

  subscribe(listener) {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  setVolume(kind, value) {
    this.#settings = { ...this.#settings, [kind]: clampVolume(value) }
    if (kind === 'music') this.#music.howl?.volume(this.#settings.music)
    if (kind === 'sfx' && this.#lowHpActive) this.#sound('lowHp').volume(this.#settings.sfx * AUDIO_MIX.lowHp)
    this.#commit()
  }

  setMuted(muted) {
    this.#settings = { ...this.#settings, muted: Boolean(muted) }
    Howler.mute(this.#settings.muted)
    this.#commit()
  }

  toggleMute() { this.setMuted(!this.#settings.muted) }

  #commit() {
    try { window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(this.#settings)) } catch { /* storage unavailable */ }
    this.#listeners.forEach((listener) => listener(this.getSettings()))
  }

  // ---- music ----------------------------------------------------------------
  playMusic(key, fadeMs = BATTLE_TIMINGS.musicCrossfade) {
    const track = MUSIC_TRACKS[key]
    if (!this.#unlocked || !track || (this.#music.key === key && this.#music.howl?.playing())) return
    this.stopMusic(fadeMs)
    const howl = new Howl({ src: [track.src], loop: track.loop, volume: 0, onloaderror: () => this.#failed.add(track.src) })
    howl.play()
    howl.fade(0, this.#settings.music, fadeMs)
    this.#music = { key, howl }
  }

  stopMusic(fadeMs = BATTLE_TIMINGS.musicStop) {
    const { howl } = this.#music
    this.#music = { key: null, howl: null }
    if (!howl) return
    howl.fade(howl.volume(), 0, fadeMs)
    window.setTimeout(() => howl.unload(), fadeMs)
  }

  // ---- sound effects --------------------------------------------------------
  #sound(key) {
    if (!this.#sounds.has(key)) {
      const src = SFX_FILES[key]
      this.#sounds.set(key, new Howl({ src: [src], loop: key === 'lowHp', onloaderror: () => this.#failed.add(src) }))
    }
    return this.#sounds.get(key)
  }

  playSfx(key, mix = 1) {
    if (!this.#unlocked || !SFX_FILES[key] || this.#failed.has(SFX_FILES[key])) return
    const sound = this.#sound(key)
    sound.volume(this.#settings.sfx * mix)
    sound.play()
  }

  playClick() { this.playSfx('click', AUDIO_MIX.click) }

  playHit(type, effectiveness) {
    const typeKey = hitSfxKey(type)
    this.playSfx(this.#failed.has(SFX_FILES[typeKey]) ? 'hit-normal' : typeKey)
    if (effectiveness > 1) this.playSfx('superEffective')
    else if (effectiveness > 0 && effectiveness < 1) this.playSfx('notVeryEffective')
  }

  /** Loops the low-HP beep while `active` is true. */
  setLowHpAlarm(active) {
    if (active === this.#lowHpActive) return
    this.#lowHpActive = active
    if (!active) { this.#sounds.get('lowHp')?.stop(); return }
    this.playSfx('lowHp', AUDIO_MIX.lowHp)
  }

  // ---- cries ----------------------------------------------------------------
  playCry(url) {
    if (!this.#unlocked || !url || this.#failed.has(url)) return
    if (!this.#cries.has(url)) {
      if (this.#cries.size >= CRY_CACHE_LIMIT) {
        const [oldestUrl, oldest] = this.#cries.entries().next().value
        oldest.unload()
        this.#cries.delete(oldestUrl)
      }
      this.#cries.set(url, new Howl({ src: [url], format: ['ogg', 'mp3'], onloaderror: () => this.#failed.add(url) }))
    }
    const cry = this.#cries.get(url)
    cry.volume(this.#settings.sfx * AUDIO_MIX.cry)
    cry.play()
  }

  /** Silences every battle sound at once (used when a battle ends or is left). */
  stopAll() {
    this.setLowHpAlarm(false)
    this.stopMusic()
  }
}

export const audioManager = new AudioManager()
