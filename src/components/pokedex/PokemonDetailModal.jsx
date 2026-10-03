// Pokédex entry dialog: artwork, types, cry button, base stats, and matchups (computed by the page).

import { formatId, titleCase } from '../../utils/format'
import CloseButton from '../common/CloseButton'
import Modal from '../common/Modal'
import PokemonAvatar from '../common/PokemonAvatar'
import TypeBadgeList from '../common/TypeBadgeList'
import MatchupList from './MatchupList'
import StatList from './StatList'

export default function PokemonDetailModal({ pokemon, matchups, onClose, onCry }) {
  const name = titleCase(pokemon.name)
  return <Modal label={`${name} details`} className="detail-modal" onClose={onClose}>
    <CloseButton label="Close Pokémon details" onClick={onClose} />
    <div className="detail-hero">
      <div>
        <span className="eyebrow">POKÉDEX ENTRY {formatId(pokemon.id)}</span>
        <h2>{name}</h2>
        <TypeBadgeList types={pokemon.types} />
        <button className="cry-button" type="button" onClick={() => onCry(pokemon)}>♫ Hear cry</button>
      </div>
      <PokemonAvatar pokemon={pokemon} className="detail-sprite" />
    </div>
    <div className="detail-grid">
      <div><h3>Base stats</h3><StatList stats={pokemon.stats} /></div>
      <MatchupList matchups={matchups} />
    </div>
  </Modal>
}
