// Pure battle state transformations: setup, turn order, move resolution, switching, and replacements. No UI or DOM code.

import { titleCase } from '../utils/format'
import { applyStatChanges, calculateDamage, getModifiedStat } from './damage'
import { getTypeEffectiveness } from './typeChart'

const BASE_HP_BONUS = 60
const MIN_MAX_HP = 90

export function createCombatant(pokemon) {
  const maxHp = Math.max(MIN_MAX_HP, pokemon.stats.hp * 2 + BASE_HP_BONUS)
  return { ...pokemon, maxHp, currentHp: maxHp, statStages: {}, moves: pokemon.moves.map((move) => ({ ...move, remainingPp: move.pp })) }
}

export function createBattle(playerTeam, opponentTeam) {
  return { player: playerTeam.map(createCombatant), opponent: opponentTeam.map(createCombatant), activePlayerIndex: 0, activeOpponentIndex: 0, state: 'active' }
}

export function getActivePokemon(battle, side) {
  const index = side === 'player' ? battle.activePlayerIndex : battle.activeOpponentIndex
  return battle[side][index]
}

export const getOpposingSide = (side) => (side === 'player' ? 'opponent' : 'player')

export function getEncounterMessages(battle) {
  return {
    appeared: `A wild ${titleCase(getActivePokemon(battle, 'opponent').name)} appeared!`,
    sendOut: `Go! ${titleCase(getActivePokemon(battle, 'player').name)}!`,
  }
}

export function getMoveHint(move, opponent) {
  if (move.damageClass === 'status') return move.statChanges.some(({ change }) => change > 0) ? 'Boosts stats' : 'Status move'
  const effectiveness = getTypeEffectiveness(move.type, opponent.types)
  if (effectiveness === 0) return 'No effect'
  if (effectiveness > 1) return 'Super effective'
  if (effectiveness < 1) return 'Not very effective'
  return 'Normal damage'
}

export function chooseOpponentMove(combatant, random = Math.random) {
  const choices = combatant.moves.filter((move) => move.remainingPp > 0)
  return choices.length ? combatant.moves.indexOf(choices[Math.floor(random() * choices.length)]) : 0
}

export function getTurnOrder(battle, playerMoveIndex, random = Math.random) {
  const player = getActivePokemon(battle, 'player')
  const opponent = getActivePokemon(battle, 'opponent')
  const opponentMoveIndex = chooseOpponentMove(opponent, random)
  const playerMove = player.moves[playerMoveIndex]
  const opponentMove = opponent.moves[opponentMoveIndex]
  const playerFirst = playerMove.priority !== opponentMove.priority
    ? playerMove.priority > opponentMove.priority
    : getModifiedStat(player, 'speed') >= getModifiedStat(opponent, 'speed')
  const playerAction = { side: 'player', moveIndex: playerMoveIndex }
  const opponentAction = { side: 'opponent', moveIndex: opponentMoveIndex }
  return playerFirst ? [playerAction, opponentAction] : [opponentAction, playerAction]
}

function resolveStatusMove(nextBattle, action, move, random) {
  const defendingSide = getOpposingSide(action.side)
  if (move.accuracy && random() * 100 > move.accuracy) return { missed: true, messages: ['But it missed!'], statTargetSide: null }
  if (!move.statChanges.length) return { missed: false, messages: [`${titleCase(move.name)} changed the battle field.`], statTargetSide: null }
  const targetSide = move.target.includes('user') || move.target.includes('ally') ? action.side : defendingSide
  const targetIndex = targetSide === 'player' ? nextBattle.activePlayerIndex : nextBattle.activeOpponentIndex
  const changed = applyStatChanges(nextBattle[targetSide][targetIndex], move.statChanges)
  nextBattle[targetSide][targetIndex] = changed.pokemon
  return { missed: false, messages: [`${titleCase(changed.pokemon.name)}'s ${changed.summaries.join(' and ')}!`], statTargetSide: targetSide }
}

function describeDamage(outcome, defender) {
  if (outcome.missed) return ['But it missed!']
  if (outcome.effectiveness === 0) return [`It doesn't affect ${titleCase(defender.name)}…`]
  const messages = []
  if (outcome.critical) messages.push('A critical hit!')
  if (outcome.effectiveness > 1) messages.push("It's super effective!")
  if (outcome.effectiveness > 0 && outcome.effectiveness < 1) messages.push("It's not very effective…")
  return messages
}

/**
 * Resolves one attacker's move. Returns the next battle snapshot, an event describing what happened
 * (for animations/audio), and messages split into `used`, `outcome`, and an optional `fainted` line.
 */
export function resolveMoveAction(battle, action, random = Math.random) {
  const nextBattle = structuredClone(battle)
  const attacker = getActivePokemon(nextBattle, action.side)
  const targetSide = getOpposingSide(action.side)
  const defender = getActivePokemon(nextBattle, targetSide)
  const move = attacker.moves[action.moveIndex]
  if (!move || move.remainingPp <= 0 || attacker.currentHp <= 0 || defender.currentHp <= 0) return { battle, event: null, messages: null }

  move.remainingPp -= 1
  const used = `${titleCase(attacker.name)} used ${titleCase(move.name)}!`
  const event = { side: action.side, targetSide, move, effectiveness: 1, critical: false, missed: false, damage: 0, isStatus: move.damageClass === 'status', statTargetSide: null, fainted: false }

  if (event.isStatus) {
    const status = resolveStatusMove(nextBattle, action, move, random)
    return { battle: nextBattle, event: { ...event, missed: status.missed, statTargetSide: status.statTargetSide }, messages: { used, outcome: status.messages, fainted: null } }
  }

  const outcome = calculateDamage(attacker, defender, move, random)
  defender.currentHp = Math.max(0, defender.currentHp - outcome.damage)
  const fainted = defender.currentHp === 0
  return {
    battle: nextBattle,
    event: { ...event, ...outcome, fainted },
    messages: { used, outcome: describeDamage(outcome, defender), fainted: fainted ? `${titleCase(defender.name)} fainted!` : null },
  }
}

export const hasActiveFaint = (battle) => getActivePokemon(battle, 'player').currentHp === 0 || getActivePokemon(battle, 'opponent').currentHp === 0

const nextAliveIndex = (team, currentIndex) => team.findIndex((pokemon, index) => index !== currentIndex && pokemon.currentHp > 0)

/**
 * After a turn: decides the outcome, auto-sends the opponent's next Pokémon, and reports whether the
 * player must pick a replacement (the player always chooses their own — see `sendInReplacement`).
 */
export function resolveReplacements(battle) {
  const nextBattle = structuredClone(battle)
  const entrants = []
  const playerFainted = getActivePokemon(nextBattle, 'player').currentHp === 0

  if (getActivePokemon(nextBattle, 'opponent').currentHp === 0) {
    const index = nextAliveIndex(nextBattle.opponent, nextBattle.activeOpponentIndex)
    if (index === -1) return { battle: { ...nextBattle, state: 'won' }, entrants, outcome: 'won', message: 'You won the battle!', playerMustChoose: false }
    nextBattle.activeOpponentIndex = index
    entrants.push({ side: 'opponent', pokemon: nextBattle.opponent[index], message: `A wild ${titleCase(nextBattle.opponent[index].name)} appeared!` })
  }
  if (playerFainted && nextAliveIndex(nextBattle.player, nextBattle.activePlayerIndex) === -1) {
    return { battle: { ...nextBattle, state: 'lost' }, entrants, outcome: 'lost', message: 'Your team has no Pokémon left.', playerMustChoose: false }
  }
  return { battle: nextBattle, entrants, outcome: null, message: null, playerMustChoose: playerFainted }
}

export const canSendIn = (battle, index) => index !== battle.activePlayerIndex && battle.player[index]?.currentHp > 0

/** Sends the player's chosen Pokémon in to replace a fainted one. Returns null for an invalid choice. */
export function sendInReplacement(battle, index) {
  if (!canSendIn(battle, index)) return null
  const nextBattle = structuredClone(battle)
  nextBattle.activePlayerIndex = index
  const pokemon = nextBattle.player[index]
  return { battle: nextBattle, pokemon, message: `Go! ${titleCase(pokemon.name)}!` }
}

export function switchActivePokemon(battle, index) {
  if (!canSendIn(battle, index)) return null
  const outgoing = getActivePokemon(battle, 'player')
  const nextBattle = structuredClone(battle)
  nextBattle.activePlayerIndex = index
  const incoming = nextBattle.player[index]
  return { battle: nextBattle, pokemon: incoming, recallMessage: `Come back, ${titleCase(outgoing.name)}!`, sendOutMessage: `Go! ${titleCase(incoming.name)}!` }
}
