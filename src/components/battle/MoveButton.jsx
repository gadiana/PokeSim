// One move: type-tinted button with name, type, PP, and an effectiveness hint on hover/focus/long-press.

import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { getTypeColor } from '../../constants/typeColors'
import { useLongPress } from '../../hooks/useLongPress'
import { titleCase } from '../../utils/format'
import TypeBadge from '../common/TypeBadge'

function hintTone(move) {
  if (move.damageClass === 'status') return 'status'
  if (move.effectiveness === 0) return 'none'
  if (move.effectiveness > 1) return 'super'
  if (move.effectiveness < 1) return 'weak'
  return 'neutral'
}

export default function MoveButton({ move, disabled, onSelect }) {
  const { pressed, handlers, consumeLongPress } = useLongPress(BATTLE_TIMINGS.longPress)
  const outOfPp = move.remainingPp <= 0
  const hintId = `move-hint-${move.index}`
  const onClick = () => { if (!consumeLongPress()) onSelect(move.index) }

  return <button type="button" className={`move-button ${outOfPp ? 'is-empty' : ''} ${pressed ? 'show-hint' : ''}`}
    style={{ '--type': getTypeColor(move.type) }} disabled={disabled || outOfPp} onClick={onClick}
    aria-describedby={hintId} {...handlers}>
    <span className="move-name">{titleCase(move.name)}</span>
    <span className="move-meta">
      <TypeBadge type={move.type} solid />
      <span className="move-pp" aria-label={`${move.remainingPp} of ${move.pp} PP`}>PP {move.remainingPp}/{move.pp}</span>
    </span>
    <span className={`move-hint hint-${hintTone(move)}`} id={hintId} role="tooltip">{outOfPp ? 'No PP left' : move.hint}</span>
  </button>
}
