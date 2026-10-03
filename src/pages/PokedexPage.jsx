// Pokédex page: search, featured grid, detail dialog, and the roster dialog that launches a battle.

import { useState } from 'react'
import { audioManager } from '../audio/AudioManager'
import PokemonCard from '../components/pokedex/PokemonCard'
import PokemonDetailModal from '../components/pokedex/PokemonDetailModal'
import RosterModal from '../components/pokedex/RosterModal'
import SearchBar from '../components/pokedex/SearchBar'
import { TEAM_SIZE } from '../constants/battleConfig'
import { getDefensiveMatchups } from '../logic/typeChart'

function playCry(pokemon) {
  audioManager.unlock()
  audioManager.playCry(pokemon.cryUrl)
}

export default function PokedexPage({ pokedex, team, onStartBattle }) {
  const [rosterOpen, setRosterOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const inspect = (pokemon) => { setDetail(pokemon); playCry(pokemon) }

  return <section className="pokedex-layout">
    <div className="pokedex-main">
      <div className="page-heading">
        <div>
          <span className="eyebrow">POKÉDEX / BATTLE PREP</span>
          <h1>Choose your <i>champions.</i></h1>
          <p>Every trainer begins with a great team. Select six Pokémon, then take on a randomized rival.</p>
        </div>
        <div className="heading-actions">
          <div className="generation-badge"><span>GEN</span><b>I–IX</b><small>All Pokémon</small></div>
          {/* <button className="show-roster" type="button" onClick={() => setRosterOpen(true)}>Battle roster <b>{team.members.length}/{TEAM_SIZE}</b></button> */}
        </div>
      </div>
      <SearchBar query={pokedex.query} searching={pokedex.searching} status={pokedex.status} onQueryChange={pokedex.setQuery} onSubmit={pokedex.search} />
      <div className="section-line"><span>Featured Pokémon</span><small>CLICK A POKÉMON FOR STATS · LIVE DATA FROM POKÉAPI</small></div>
      <div className="dex-grid">
        {pokedex.entries.length
          ? pokedex.entries.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} selected={team.selectedIds.has(pokemon.id)} onAdd={team.add} onRemove={team.remove} onInspect={inspect} />)
          : <div className="loading-cards">Loading Pokédex records<span>···</span></div>}
      </div>
    </div>
    {team.members.length > 0 && !rosterOpen && <button className="roster-fab" type="button" onClick={() => setRosterOpen(true)}>
      Battle roster <b>{team.members.length}/{TEAM_SIZE}</b>
    </button>}
    {rosterOpen && <RosterModal team={team.members} notice={team.notice} onClose={() => setRosterOpen(false)} onRemove={team.remove} onStart={() => { setRosterOpen(false); onStartBattle() }} />}
    {detail && <PokemonDetailModal pokemon={detail} matchups={getDefensiveMatchups(detail.types)} onClose={() => setDetail(null)} onCry={playCry} />}
  </section>
}
