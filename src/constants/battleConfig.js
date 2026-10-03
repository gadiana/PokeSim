// Single home for battle tuning values: animation timings, HP thresholds, sprite scaling, and audio defaults.

/** All durations are in milliseconds. CSS reads the visual ones through `timingCssVars()`. */
export const BATTLE_TIMINGS = {
  encounterTransition: 1500,
  entrance: 650,
  lunge: 320,
  hitEffect: 650,
  blink: 480,
  shake: 420,
  faint: 700,
  recall: 450,
  hpAnimation: 600,
  betweenActions: 200,
  typewriterStep: 22,
  dialogueAdvance: 1200,
  longPress: 450,
  idleBob: 1600,
  musicCrossfade: 600,
  musicFadeOut: 800,
  musicStop: 150,
  spritePreloadTimeout: 4000,
}

/** HP ratio boundaries: above `warning` is green, between is yellow, below `danger` is red. */
export const HP_THRESHOLDS = {
  warning: 0.5,
  danger: 0.2,
}

/** Whole-number pixel scaling caps. The sprite picks the largest scale <= cap that fits its zone. */
export const SPRITE_SCALE = {
  player: 3,
  opponent: 2,
  min: 1,
}

export const BATTLE_LEVEL = 50
export const TEAM_SIZE = 6
export const EFFECT_PARTICLE_COUNT = 8
export const ENCOUNTER_BAR_COUNT = 6

/** Default volumes (0–1) and per-sound mix multipliers applied on top of the SFX volume. */
export const AUDIO_DEFAULTS = {
  music: 0.5,
  sfx: 0.7,
  muted: false,
}

export const AUDIO_MIX = {
  cry: 0.8,
  lowHp: 0.35,
  click: 0.6,
}

export const AUDIO_STORAGE_KEY = 'pokelab-audio-settings'
export const CRY_CACHE_LIMIT = 24

/** Exposes the visual timings as CSS custom properties so stylesheets never hard-code durations. */
export function timingCssVars() {
  return {
    '--t-encounter': `${BATTLE_TIMINGS.encounterTransition}ms`,
    '--t-entrance': `${BATTLE_TIMINGS.entrance}ms`,
    '--t-lunge': `${BATTLE_TIMINGS.lunge}ms`,
    '--t-hit': `${BATTLE_TIMINGS.hitEffect}ms`,
    '--t-blink': `${BATTLE_TIMINGS.blink / 3}ms`,
    '--t-shake': `${BATTLE_TIMINGS.shake}ms`,
    '--t-faint': `${BATTLE_TIMINGS.faint}ms`,
    '--t-recall': `${BATTLE_TIMINGS.recall}ms`,
    '--t-bob': `${BATTLE_TIMINGS.idleBob}ms`,
  }
}
