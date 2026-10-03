// Derived, read-only views of battle state for the UI (active Pokémon, move options, prompts).

import { getActivePokemon, getMoveHint } from '../logic/battleEngine'
import { getTypeEffectiveness } from '../logic/typeChart'
import { titleCase } from '../utils/format'

export const ACTIVE_PHASES = ['encounter', 'intro', 'choosing', 'resolving', 'replacing', 'finished']

export const selectActive = (state, side) => (state.battle ? getActivePokemon(state.battle, side) : null)

export const selectCanAct = (state) => state.phase === 'choosing' && !state.message

/** True while the battle is paused waiting for the player to replace a fainted Pokémon. */
export const selectMustReplace = (state) => state.phase === 'replacing' && !state.message

export function selectMoveOptions(state) {
  const player = selectActive(state, 'player')
  const opponent = selectActive(state, 'opponent')
  if (!player || !opponent) return []
  return player.moves.map((move, index) => ({
    ...move,
    index,
    hint: getMoveHint(move, opponent),
    effectiveness: move.damageClass === 'status' ? 1 : getTypeEffectiveness(move.type, opponent.types),
  }))
}

export function selectPrompt(state) {
  const player = selectActive(state, 'player')
  if (state.phase === 'choosing' && player) return `What will ${titleCase(player.name)} do?`
  if (state.phase === 'replacing') return 'Choose your next Pokémon!'
  if (state.phase === 'finished') return state.result === 'won' ? 'Victory! Your team is triumphant.' : 'The battle is over.'
  return ''
}

export const selectAliveCount = (state) => state.battle?.player.filter((pokemon) => pokemon.currentHp > 0).length ?? 0
