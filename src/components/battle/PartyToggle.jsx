// Separate "Pokémon / Switch" button that opens the party drawer.

import PokeBallMark from '../common/PokeBallMark'

export default function PartyToggle({ aliveCount, total, open, disabled, onToggle }) {
  return <div className="party-access">
    <span>TEAM <b>{aliveCount}/{total}</b></span>
    <button type="button" onClick={onToggle} disabled={disabled} aria-haspopup="dialog" aria-expanded={open}>
      <PokeBallMark />Pokémon <small>Switch</small>
    </button>
  </div>
}
