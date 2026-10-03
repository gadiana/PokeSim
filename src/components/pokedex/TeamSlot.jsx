// One of the six party slots in the roster modal.

import { titleCase } from '../../utils/format'
import PokemonAvatar from '../common/PokemonAvatar'

export default function TeamSlot({ pokemon, index, onRemove }) {
  return <div className={`team-slot ${pokemon ? 'filled' : ''}`}>
    {pokemon ? <PokemonAvatar pokemon={pokemon} variant="icon" className="slot-sprite" /> : <span className="slot-number">{String(index + 1).padStart(2, '0')}</span>}
    <div className="slot-detail">
      <strong>{pokemon ? titleCase(pokemon.name) : 'Open slot'}</strong>
      <small>{pokemon ? pokemon.types.map(titleCase).join(' / ') : 'Choose a Pokémon'}</small>
    </div>
    {pokemon && <button className="slot-remove" type="button" onClick={() => onRemove(pokemon.id)} aria-label={`Remove ${titleCase(pokemon.name)}`}>×</button>}
  </div>
}
