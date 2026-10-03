// Party picker modal. Voluntary switch (closable) or forced replacement after a faint (must pick). Emits onSelect(index).

import { titleCase } from '../../utils/format'
import CloseButton from '../common/CloseButton'
import Modal from '../common/Modal'
import PokemonAvatar from '../common/PokemonAvatar'
import TypeBadgeList from '../common/TypeBadgeList'
import HpBar from './HpBar'

const COPY = {
  forced: { eyebrow: 'YOUR POKÉMON FAINTED', title: 'Choose your next Pokémon', note: 'Pick a healthy Pokémon to send into battle.' },
  switch: { eyebrow: 'YOUR PARTY', title: 'Switch Pokémon', note: 'Switching uses your turn — the foe gets to act.' },
}

function statusLabel(pokemon, current) {
  if (pokemon.currentHp <= 0) return 'Fainted'
  if (current) return 'In battle'
  return null
}

export default function PartyModal({ party, activeIndex, forced, onSelect, onClose }) {
  const copy = forced ? COPY.forced : COPY.switch
  return <Modal label={copy.title} className="party-modal" backdropClassName="party-backdrop" onClose={forced ? undefined : onClose}>
    <div className="party-modal-head">
      <div><span className="eyebrow">{copy.eyebrow}</span><h2>{copy.title}</h2><p>{copy.note}</p></div>
      {!forced && <CloseButton label="Close party" onClick={onClose} />}
    </div>
    <div className="party-grid">
      {party.map((pokemon, index) => {
        const name = titleCase(pokemon.name)
        const current = index === activeIndex
        const fainted = pokemon.currentHp <= 0
        const label = statusLabel(pokemon, current)
        return <button key={pokemon.id} type="button" className={`party-option ${current ? 'current' : ''} ${fainted ? 'fainted' : ''}`}
          onClick={() => onSelect(index)} disabled={fainted || current} aria-label={`${name}${label ? `, ${label}` : ''}`}>
          <PokemonAvatar pokemon={pokemon} variant="icon" className="party-sprite" />
          <span className="party-info">
            <span className="party-name"><b>{name}</b>{label && <small>{label}</small>}</span>
            <TypeBadgeList types={pokemon.types} />
            <HpBar current={pokemon.currentHp} max={pokemon.maxHp} label={name} compact />
          </span>
        </button>
      })}
    </div>
  </Modal>
}
