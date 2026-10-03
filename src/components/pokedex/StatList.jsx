// Base stat bars for the Pokédex detail view.

const STATS = [['hp', 'HP'], ['attack', 'Attack'], ['defense', 'Defense'], ['special-attack', 'Sp. Atk'], ['special-defense', 'Sp. Def'], ['speed', 'Speed']]
const STAT_BAR_MAX = 160

export default function StatList({ stats }) {
  return <div className="stat-list">
    {STATS.map(([key, label]) => <div key={key}>
      <span>{label}</span>
      <i role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={255} aria-valuenow={stats[key]}><b style={{ width: `${Math.min(100, (stats[key] / STAT_BAR_MAX) * 100)}%` }} /></i>
      <strong>{stats[key]}</strong>
    </div>)}
  </div>
}
