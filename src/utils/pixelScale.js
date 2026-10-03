// Picks the largest whole-number scale that fits a sprite inside its zone, so pixel art stays crisp.

import { SPRITE_SCALE } from '../constants/battleConfig'

export function getPixelScale(natural, available, maxScale) {
  if (!natural.width || !natural.height || !available.width || !available.height) return SPRITE_SCALE.min
  const fit = Math.floor(Math.min(available.width / natural.width, available.height / natural.height))
  return Math.max(SPRITE_SCALE.min, Math.min(maxScale, fit))
}
