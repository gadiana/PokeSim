// Accessible HP meter: tweens width and numbers toward the current HP and colors by threshold.

import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import { getHpRatio, getHpTone } from '../../logic/hp'

export default function HpBar({ current, max, label, showNumbers = true, compact = false }) {
  const shownHp = useAnimatedNumber(current, BATTLE_TIMINGS.hpAnimation)
  const ratio = getHpRatio(shownHp, max)
  const percent = Math.round(getHpRatio(current, max) * 100)
  const displayHp = Math.ceil(shownHp)

  return <div className={`hp-bar ${compact ? 'hp-bar-compact' : ''}`}>
    <div className="hp-bar-row">
      <span className="hp-bar-tag" aria-hidden="true">HP</span>
      <div className="hp-track" role="progressbar" aria-label={`${label} HP`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={current}
        aria-valuetext={showNumbers ? `${current} of ${max} HP` : `${percent}% HP`}>
        <div className={`hp-fill hp-${getHpTone(ratio)}`} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
    {showNumbers && <div className="hp-numbers" aria-hidden="true">{displayHp}<em> / {max}</em></div>}
  </div>
}
