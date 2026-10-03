// Weaknesses / resistances / immunities listing for the Pokédex detail view.

import TypeBadgeList from '../common/TypeBadgeList'

const GROUPS = [['weaknesses', 'Weak to'], ['resistances', 'Resists'], ['immunities', 'Immune to']]

export default function MatchupList({ matchups }) {
  return <div className="matchup-list">
    <h3>Battle matchups</h3>
    {GROUPS.filter(([key]) => matchups[key].length).map(([key, label]) => <div key={key}><span>{label}</span><TypeBadgeList types={matchups[key]} /></div>)}
  </div>
}
