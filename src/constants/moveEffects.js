// Maps each move type to a visual hit-effect variant (styled in styles/battle-effects.css) and its colors.

export const MOVE_EFFECTS = {
  normal: { variant: 'impact', color: '#ffffff' },
  fire: { variant: 'burst', color: '#ff7a2f' },
  water: { variant: 'ripple', color: '#3fa6e8' },
  electric: { variant: 'flicker', color: '#ffe14d' },
  grass: { variant: 'leaves', color: '#56c26a' },
  psychic: { variant: 'wave', color: '#b05cff' },
  ice: { variant: 'shards', color: '#aef3ff' },
  fighting: { variant: 'impact', color: '#ffb08a' },
  poison: { variant: 'burst', color: '#b06ad6' },
  ground: { variant: 'shards', color: '#c49a5a' },
  rock: { variant: 'shards', color: '#a88a55' },
  flying: { variant: 'ripple', color: '#e6f3ff' },
  bug: { variant: 'leaves', color: '#9cbf3b' },
  ghost: { variant: 'wave', color: '#7d62b8' },
  dragon: { variant: 'burst', color: '#7f7cf0' },
  dark: { variant: 'wave', color: '#4a3d57' },
  steel: { variant: 'shards', color: '#d6e2ea' },
  fairy: { variant: 'sparkle', color: '#ff9fd0' },
}

/** Status moves (boosts/debuffs) always use the sparkle variant tinted by the move's type. */
export const STATUS_EFFECT_VARIANT = 'sparkle'

export function getMoveEffect(type, isStatus = false) {
  const effect = MOVE_EFFECTS[type] || MOVE_EFFECTS.normal
  return isStatus ? { ...effect, variant: STATUS_EFFECT_VARIANT } : effect
}
