// Pokédex grid card: sprite, number, name, types, and add/remove-from-team action.

import { formatId, titleCase } from '../../utils/format'
import PokeBallMark from '../common/PokeBallMark'
import PokemonAvatar from '../common/PokemonAvatar'
import TypeBadgeList from '../common/TypeBadgeList'

export default function PokemonCard({ pokemon, selected, onAdd, onRemove, onInspect }) {
  const name = titleCase(pokemon.name)
  return <article className={`pokemon-card ${selected ? 'is-selected' : ''}`}>
    <div className="card-topline"><span>{formatId(pokemon.id)}</span><span className="card-ball"><PokeBallMark /></span></div>
    <button className="pokemon-inspect" type="button" onClick={() => onInspect(pokemon)} aria-label={`Inspect ${name}`}>
      <PokemonAvatar pokemon={pokemon} className="dex-sprite" />
      <div className="card-copy"><h3>{name}</h3><TypeBadgeList types={pokemon.types} /></div>
    </button>
    {selected
      ? <button className="card-action remove" type="button" onClick={() => onRemove(pokemon.id)}>− Remove</button>
      : <button className="card-action" type="button" onClick={() => onAdd(pokemon)}>+ Add to team</button>}
  </article>
}
