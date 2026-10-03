// App shell: header, simple view routing, and the app-wide state hooks (Pokédex, team, battle).

import { useState } from 'react'
import TopBar from './components/layout/TopBar'
import { useBattleController } from './hooks/useBattleController'
import { usePokedex } from './hooks/usePokedex'
import { useTeam } from './hooks/useTeam'
import BattlePage from './pages/BattlePage'
import HomePage from './pages/HomePage'
import PokedexPage from './pages/PokedexPage'

export default function App() {
  const [view, setView] = useState('landing')
  const pokedex = usePokedex()
  const team = useTeam()
  const battle = useBattleController()

  const navigate = (next) => { setView(next); window.scrollTo({ top: 0 }) }
  const startBattle = () => {
    if (!team.isFull) return
    navigate('battle')
    battle.startBattle(team.members)
  }

  return <main className="app-shell">
    <TopBar view={view} teamCount={team.members.length} onNavigate={navigate} />
    {view === 'landing' && <HomePage pokedex={pokedex.entries} onNavigate={navigate} />}
    {view === 'pokedex' && <PokedexPage pokedex={pokedex} team={team} onStartBattle={startBattle} />}
    {view === 'battle' && <BattlePage controller={battle} teamCount={team.members.length} onFindOpponent={startBattle} onNavigate={navigate} />}
  </main>
}
