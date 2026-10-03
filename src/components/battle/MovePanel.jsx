// 2×2 grid of move buttons. Emits onSelect(moveIndex); never computes battle results itself.

import MoveButton from './MoveButton'

export default function MovePanel({ moves, disabled, onSelect }) {
  return <section className="move-panel" aria-label="Moves">
    <div className="move-grid">
      {moves.map((move) => <MoveButton key={move.name} move={move} disabled={disabled} onSelect={onSelect} />)}
    </div>
  </section>
}
