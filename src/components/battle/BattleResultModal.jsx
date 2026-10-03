// End-of-battle dialog for a win or a loss.

import Modal from '../common/Modal'
import PokeBallMark from '../common/PokeBallMark'

const COPY = {
  won: { title: 'Victory!', body: 'Your strategy carried the day. The opposing trainer is out of Pokémon.', action: 'Return to Pokédex' },
  lost: { title: 'You gave it everything.', body: 'Your team needs a breather. Build a new plan and challenge another trainer.', action: 'Regroup in Pokédex' },
}

export default function BattleResultModal({ result, onClose }) {
  const copy = COPY[result] || COPY.lost
  return <Modal label="Battle result" className={`result-modal ${result}`} backdropClassName="result-backdrop">
    <PokeBallMark />
    <span className="eyebrow">BATTLE COMPLETE</span>
    <h2>{copy.title}</h2>
    <p>{copy.body}</p>
    <button type="button" onClick={onClose}>{copy.action} <span aria-hidden="true">→</span></button>
  </Modal>
}
