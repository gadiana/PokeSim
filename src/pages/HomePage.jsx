// Landing page: pitch, calls to action, and the featured-Pokémon illustration.

import HeroVisual from '../components/home/HeroVisual'
import PokeBallMark from '../components/common/PokeBallMark'

const HERO_IDS = [4, 25, 7]
const STATS = [['1,025', 'Pokédex entries'], ['6 v 6', 'Turn-based battles'], ['∞', 'Team strategies']]

export default function HomePage({ pokedex, onNavigate }) {
  const heroes = HERO_IDS.map((id) => pokedex.find((pokemon) => pokemon.id === id)).filter(Boolean)
  return <section className="landing-page">
    <div className="landing-copy">
      <span className="eyebrow">POKÉLAB / BATTLE STUDIO</span>
      <p className="landing-kicker">A strategic Pokémon playground</p>
      <h1>Make every<br /><i>move</i> count.</h1>
      <p className="landing-summary">Build a one-of-a-kind six Pokémon party, study real Pokédex data, and take a lively tactical battle into the arena.</p>
      <div className="landing-actions">
        <button className="landing-cta" type="button" onClick={() => onNavigate('pokedex')}><PokeBallMark />Build your party <span aria-hidden="true">→</span></button>
        <button className="landing-ghost" type="button" onClick={() => onNavigate('battle')}>Enter arena</button>
      </div>
      <div className="landing-stats">{STATS.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div>
    </div>
    <HeroVisual pokemon={heroes} />
    <div className="landing-rules"><span>Battle with purpose</span><p>TYPE MATCHUPS <i>•</i> MOVE PP <i>•</i> SWITCHING <i>•</i> LIVE EFFECTS</p></div>
  </section>
}
