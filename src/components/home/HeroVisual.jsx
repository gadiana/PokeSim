// Decorative landing illustration: sun, orbits, and three featured Pokémon.

import PokeBallMark from '../common/PokeBallMark'
import PokemonAvatar from '../common/PokemonAvatar'

export default function HeroVisual({ pokemon }) {
  return <div className="landing-visual" aria-hidden={!pokemon.length}>
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="landing-sun" />
    <div className="landing-ball"><PokeBallMark /></div>
    {pokemon.length
      ? pokemon.map((entry, index) => <div className={`landing-mon mon-${index}`} key={entry.id}><PokemonAvatar pokemon={entry} className="landing-sprite" /></div>)
      : <div className="landing-loading">Loading<br />champions…</div>}
    <div className="visual-caption"><span>READY WHEN YOU ARE</span><b>PokéAPI powered</b></div>
  </div>
}
