// Party list for switching. Emits onSwitch(index); fainted and active Pokémon are disabled.

import { titleCase } from '../../utils/format'
import PokemonAvatar from '../common/PokemonAvatar'
import HpBar from './HpBar'

export default function PartyDrawer({ party, activeIndex, disabled, onSwitch }) {
  return <section className="party-drawer" id="party-drawer" aria-label="Choose a Pokémon to switch in">
    <div className="drawer-heading">
      <span className="eyebrow">YOUR PARTY</span>
      <p>Switching uses your turn — the foe gets to act.</p>
    </div>
    <div className="drawer-grid">
      {party.map((pokemon, index) => {
        const fainted = pokemon.currentHp <= 0
        const current = index === activeIndex
        return <button key={pokemon.id} type="button" className={`${current ? 'current' : ''} ${fainted ? 'fainted' : ''}`}
          onClick={() => onSwitch(index)} disabled={disabled || fainted || current}>
          <PokemonAvatar pokemon={pokemon} variant="icon" className="drawer-sprite" />
          <span>
            <b>{titleCase(pokemon.name)}{current ? ' · Active' : ''}</b>
            <HpBar current={pokemon.currentHp} max={pokemon.maxHp} label={titleCase(pokemon.name)} compact />
          </span>
        </button>
      })}
    </div>
  </section>
}
