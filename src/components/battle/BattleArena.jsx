// Classic arena on a fixed CSS grid: foe card top-left, foe sprite top-right, player sprite bottom-left, player card bottom-right.

import InfoCard from './InfoCard'
import MoveEffect from './MoveEffect'
import PokemonSprite from './PokemonSprite'

const SIDES = ['opponent', 'player']

export default function BattleArena({ player, opponent, sprites, effect, shaking, onCry }) {
  const combatants = { player, opponent }
  return <section className={`battle-arena ${shaking ? 'is-shaking' : ''}`} aria-label="Battle arena">
    <div className="arena-sky" aria-hidden="true" />
    {SIDES.map((side) => <div className={`arena-zone arena-card-${side}`} key={`card-${side}`}>
      {sprites[side] !== 'hidden' && <InfoCard key={combatants[side].id} pokemon={combatants[side]} side={side} />}
    </div>)}
    {SIDES.map((side) => <div className={`arena-zone arena-sprite-${side}`} key={`sprite-${side}`}>
      <PokemonSprite key={combatants[side].id} pokemon={combatants[side]} side={side} anim={sprites[side]} onCry={onCry}>
        {effect?.side === side && <MoveEffect key={effect.key} effect={effect} />}
      </PokemonSprite>
    </div>)}
  </section>
}
