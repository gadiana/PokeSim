// Per-type hit effect overlay (flash, particles, ripples…). Variant styles live in styles/battle-effects.css.

import { EFFECT_PARTICLE_COUNT } from '../../constants/battleConfig'

const PARTICLES = Array.from({ length: EFFECT_PARTICLE_COUNT }, (_, index) => index)

export default function MoveEffect({ effect }) {
  return <div className={`move-effect effect-${effect.variant}`} style={{ '--fx': effect.color, '--count': EFFECT_PARTICLE_COUNT }} aria-hidden="true">
    <span className="fx-flash" />
    <span className="fx-ring" />
    {PARTICLES.map((index) => <i key={index} className="fx-particle" style={{ '--i': index }} />)}
  </div>
}
