// Chooses four varied, battle-ready moves from a Pokémon's normalized move pool (pure, no fetching).

const FALLBACK_MOVES = [
  { name: 'tackle', type: 'normal', power: 40, pp: 35, accuracy: 100, priority: 0, damageClass: 'physical', statChanges: [], target: 'selected-pokemon' },
  { name: 'quick-attack', type: 'normal', power: 40, pp: 30, accuracy: 100, priority: 1, damageClass: 'physical', statChanges: [], target: 'selected-pokemon' },
  { name: 'swift', type: 'normal', power: 60, pp: 20, accuracy: 100, priority: 0, damageClass: 'special', statChanges: [], target: 'all-opponents' },
  { name: 'struggle', type: 'normal', power: 50, pp: 1, accuracy: 100, priority: 0, damageClass: 'physical', statChanges: [], target: 'random-opponent' },
]
const MOVES_PER_POKEMON = 4

export function pickBattleMoves(moves, types) {
  const damaging = moves.filter((move) => move.power && move.damageClass !== 'status')
  const typed = damaging.filter((move) => types.includes(move.type))
  const status = moves.filter((move) => move.damageClass === 'status')
  const boost = status.filter((move) => move.statChanges.some((change) => change.change > 0))
  const lead = typed.find((move) => move.name === 'flamethrower') || typed[0]
  const ordered = [lead, damaging.find((move) => move.name !== lead?.name), boost[0] || status[0], typed.find((move) => move.name !== lead?.name), ...damaging, ...status, ...FALLBACK_MOVES]
  const selected = []
  ordered.forEach((move) => {
    if (move && selected.length < MOVES_PER_POKEMON && !selected.some((choice) => choice.name === move.name)) selected.push(move)
  })
  return selected
}
