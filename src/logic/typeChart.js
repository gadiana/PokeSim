// Pokémon type matchup table and pure effectiveness helpers.

export const TYPE_CHART = {
  normal: { half: ['rock', 'steel'], zero: ['ghost'] },
  fire: { double: ['grass', 'ice', 'bug', 'steel'], half: ['fire', 'water', 'rock', 'dragon'] },
  water: { double: ['fire', 'ground', 'rock'], half: ['water', 'grass', 'dragon'] },
  electric: { double: ['water', 'flying'], half: ['electric', 'grass', 'dragon'], zero: ['ground'] },
  grass: { double: ['water', 'ground', 'rock'], half: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'] },
  ice: { double: ['grass', 'ground', 'flying', 'dragon'], half: ['fire', 'water', 'ice', 'steel'] },
  fighting: { double: ['normal', 'ice', 'rock', 'dark', 'steel'], half: ['poison', 'flying', 'psychic', 'bug', 'fairy'], zero: ['ghost'] },
  poison: { double: ['grass', 'fairy'], half: ['poison', 'ground', 'rock', 'ghost'], zero: ['steel'] },
  ground: { double: ['fire', 'electric', 'poison', 'rock', 'steel'], half: ['grass', 'bug'], zero: ['flying'] },
  flying: { double: ['grass', 'fighting', 'bug'], half: ['electric', 'rock', 'steel'] },
  psychic: { double: ['fighting', 'poison'], half: ['psychic', 'steel'], zero: ['dark'] },
  bug: { double: ['grass', 'psychic', 'dark'], half: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'] },
  rock: { double: ['fire', 'ice', 'flying', 'bug'], half: ['fighting', 'ground', 'steel'] },
  ghost: { double: ['psychic', 'ghost'], half: ['dark'], zero: ['normal'] },
  dragon: { double: ['dragon'], half: ['steel'], zero: ['fairy'] },
  dark: { double: ['psychic', 'ghost'], half: ['fighting', 'dark', 'fairy'] },
  steel: { double: ['ice', 'rock', 'fairy'], half: ['fire', 'water', 'electric', 'steel'] },
  fairy: { double: ['fighting', 'dragon', 'dark'], half: ['fire', 'poison', 'steel'] },
}

export function getTypeEffectiveness(moveType, defendingTypes) {
  const chart = TYPE_CHART[moveType] || {}
  return defendingTypes.reduce((multiplier, type) => {
    if (chart.zero?.includes(type)) return 0
    if (chart.double?.includes(type)) return multiplier * 2
    if (chart.half?.includes(type)) return multiplier * 0.5
    return multiplier
  }, 1)
}

export function getDefensiveMatchups(defendingTypes) {
  return Object.keys(TYPE_CHART).reduce((matchups, attackType) => {
    const multiplier = getTypeEffectiveness(attackType, defendingTypes)
    if (multiplier > 1) matchups.weaknesses.push(attackType)
    if (multiplier === 0) matchups.immunities.push(attackType)
    if (multiplier > 0 && multiplier < 1) matchups.resistances.push(attackType)
    return matchups
  }, { weaknesses: [], resistances: [], immunities: [] })
}
