// Pure HP helpers: ratio, color tone classification, and low-HP detection.

import { HP_THRESHOLDS } from '../constants/battleConfig'

export const getHpRatio = (current, max) => (max > 0 ? Math.max(0, Math.min(1, current / max)) : 0)

/** green above 50%, yellow 20–50%, red below 20%. */
export function getHpTone(ratio) {
  if (ratio < HP_THRESHOLDS.danger) return 'danger'
  if (ratio <= HP_THRESHOLDS.warning) return 'warning'
  return 'healthy'
}

export function isLowHp(pokemon) {
  if (!pokemon || pokemon.currentHp <= 0) return false
  return getHpRatio(pokemon.currentHp, pokemon.maxHp) < HP_THRESHOLDS.danger
}
