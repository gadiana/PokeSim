// Pure damage, accuracy, and stat-stage calculations (simplified Gen V+ formula at a fixed level).

import { BATTLE_LEVEL } from '../constants/battleConfig'
import { titleCase } from '../utils/format'
import { getTypeEffectiveness } from './typeChart'

const LEVEL_FACTOR = (2 * BATTLE_LEVEL) / 5 + 2
const CRITICAL_CHANCE = 1 / 24
const CRITICAL_MULTIPLIER = 1.5
const STAB_MULTIPLIER = 1.5
const RANDOM_MIN = 0.85
const RANDOM_SPREAD = 0.15
const MAX_STAGE = 6

export function getModifiedStat(pokemon, stat) {
  const stage = pokemon.statStages?.[stat] || 0
  const multiplier = stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage)
  return (pokemon.stats[stat] || 1) * multiplier
}

export function calculateDamage(attacker, defender, move, random = Math.random) {
  const effectiveness = getTypeEffectiveness(move.type, defender.types)
  if (move.accuracy && random() * 100 > move.accuracy) return { damage: 0, effectiveness, missed: true, critical: false }
  if (effectiveness === 0) return { damage: 0, effectiveness, missed: false, critical: false }
  const special = move.damageClass === 'special'
  const attack = getModifiedStat(attacker, special ? 'special-attack' : 'attack')
  const defense = Math.max(1, getModifiedStat(defender, special ? 'special-defense' : 'defense'))
  const base = Math.floor(((LEVEL_FACTOR * move.power * attack) / defense) / 50 + 2)
  const critical = random() < CRITICAL_CHANCE
  const stab = attacker.types.includes(move.type) ? STAB_MULTIPLIER : 1
  const variance = RANDOM_MIN + random() * RANDOM_SPREAD
  const damage = Math.max(1, Math.floor(base * stab * effectiveness * (critical ? CRITICAL_MULTIPLIER : 1) * variance))
  return { damage, effectiveness, missed: false, critical }
}

export function applyStatChanges(pokemon, statChanges) {
  const nextPokemon = structuredClone(pokemon)
  const summaries = statChanges.map(({ stat, change }) => {
    nextPokemon.statStages[stat] = Math.max(-MAX_STAGE, Math.min(MAX_STAGE, (nextPokemon.statStages[stat] || 0) + change))
    return `${titleCase(stat)} ${change > 0 ? 'rose' : 'fell'}`
  })
  return { pokemon: nextPokemon, summaries }
}
