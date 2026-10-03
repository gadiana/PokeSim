// Battle info card: name, level, types, and HP. Opponent cards hide HP numbers, like the original games.

import { BATTLE_LEVEL } from '../../constants/battleConfig'
import { titleCase } from '../../utils/format'
import TypeBadgeList from '../common/TypeBadgeList'
import HpBar from './HpBar'

export default function InfoCard({ pokemon, side }) {
  const isPlayer = side === 'player'
  const name = titleCase(pokemon.name)
  return <section className={`info-card info-card-${side}`} aria-label={`${isPlayer ? 'Your' : 'Opposing'} Pokémon: ${name}`}>
    <div className="info-card-head">
      <span className="info-card-side">{isPlayer ? 'YOU' : 'FOE'}</span>
      <strong className="info-card-name">{name}</strong>
      <small className="info-card-level">Lv.{BATTLE_LEVEL}</small>
    </div>
    <TypeBadgeList types={pokemon.types} className="info-card-types" />
    <HpBar current={pokemon.currentHp} max={pokemon.maxHp} label={name} showNumbers={isPlayer} />
  </section>
}
