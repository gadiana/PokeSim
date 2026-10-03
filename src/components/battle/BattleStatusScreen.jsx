// Battle page screen shown outside a battle: ready to search, team incomplete, searching, or load error.

import { TEAM_SIZE } from '../../constants/battleConfig'
import Button from '../common/Button'
import PokeBallMark from '../common/PokeBallMark'

function getCopy(phase, teamCount) {
  if (phase === 'loading') return { title: 'Searching for an opponent…', body: 'A challenger is assembling a squad. Get ready!' }
  if (phase === 'error') return { title: 'The search came up empty.', body: '' }
  if (teamCount >= TEAM_SIZE) return { title: 'Your team is ready.', body: 'Six Pokémon, one rival. Search for an opponent and start a six-on-six battle.' }
  return { title: 'Your arena is waiting.', body: `Your party has ${teamCount}/${TEAM_SIZE} Pokémon. Add ${TEAM_SIZE - teamCount} more in the Pokédex, then return here to battle.` }
}

export default function BattleStatusScreen({ phase, error, teamCount, onFindOpponent, onBuildTeam }) {
  const copy = getCopy(phase, teamCount)
  const teamReady = teamCount >= TEAM_SIZE
  return <div className={`empty-battle status-${phase}`} aria-busy={phase === 'loading'}>
    <PokeBallMark />
    <h1>{copy.title}</h1>
    <p role={phase === 'error' ? 'alert' : undefined}>{error || copy.body}</p>
    {phase !== 'loading' && <div className="empty-actions">
      {teamReady && <Button variant="primary" onClick={onFindOpponent}><PokeBallMark />{phase === 'error' ? 'Try again' : 'Find an opponent'}</Button>}
      <Button variant="outline" onClick={onBuildTeam}>{teamReady ? 'Edit team' : 'Build a team'}</Button>
    </div>}
  </div>
}
