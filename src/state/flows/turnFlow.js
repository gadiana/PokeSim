// Turn-level flows: using a move, switching Pokémon, sending in replacements, and ending the battle.

import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { chooseOpponentMove, getActivePokemon, getTurnOrder, hasActiveFaint, resolveReplacements, sendInReplacement, switchActivePokemon } from '../../logic/battleEngine'
import { performMove } from './moveFlow'
import { recall, sayWhile, sendOut, syncLowHpAlarm } from './stagingSteps'

async function finishBattle(ctx, battle, outcome, message) {
  ctx.audio.setLowHpAlarm(false)
  ctx.dispatch({ type: 'SET_BATTLE', battle })
  const spoken = ctx.say(message)
  ctx.audio.stopMusic(BATTLE_TIMINGS.musicFadeOut)
  if (outcome === 'won') {
    await ctx.wait(BATTLE_TIMINGS.musicFadeOut)
    ctx.audio.playMusic('victory', BATTLE_TIMINGS.musicStop)
  }
  await spoken
  ctx.dispatch({ type: 'FINISH', result: outcome })
}

/** Opens the party modal and waits until the player picks a valid Pokémon to send in. */
async function choosePlayerReplacement(ctx, battle) {
  for (;;) {
    ctx.dispatch({ type: 'SET_PHASE', phase: 'replacing' })
    const sent = sendInReplacement(battle, await ctx.requestReplacement())
    if (sent) {
      ctx.audio.playClick()
      ctx.dispatch({ type: 'SET_PHASE', phase: 'resolving' })
      ctx.dispatch({ type: 'SET_SPRITE', side: 'player', anim: 'hidden' })
      ctx.dispatch({ type: 'SET_BATTLE', battle: sent.battle })
      await sayWhile(ctx, sent.message, sendOut(ctx, 'player', sent.pokemon))
      return sent.battle
    }
  }
}

/** Sends in replacements for fainted Pokémon. Returns true when the battle is over. */
async function sendReplacements(ctx, battle) {
  const { battle: afterOpponent, entrants, outcome, message, playerMustChoose } = resolveReplacements(battle)
  if (outcome) {
    await finishBattle(ctx, afterOpponent, outcome, message)
    return true
  }
  entrants.forEach(({ side }) => ctx.dispatch({ type: 'SET_SPRITE', side, anim: 'hidden' }))
  ctx.dispatch({ type: 'SET_BATTLE', battle: afterOpponent })
  for (const entrant of entrants) await sayWhile(ctx, entrant.message, sendOut(ctx, entrant.side, entrant.pokemon))
  const finalBattle = playerMustChoose ? await choosePlayerReplacement(ctx, afterOpponent) : afterOpponent
  syncLowHpAlarm(ctx, finalBattle)
  return false
}

async function endTurn(ctx, battle) {
  const over = await sendReplacements(ctx, battle)
  if (!over) ctx.dispatch({ type: 'SET_PHASE', phase: 'choosing' })
}

export async function runMoveTurn(ctx, moveIndex) {
  let battle = ctx.getBattle()
  const move = getActivePokemon(battle, 'player').moves[moveIndex]
  if (!move || move.remainingPp <= 0) return
  ctx.audio.playClick()
  ctx.dispatch({ type: 'SET_PHASE', phase: 'resolving' })
  for (const action of getTurnOrder(battle, moveIndex)) {
    battle = await performMove(ctx, battle, action)
    if (hasActiveFaint(battle)) break
    await ctx.wait(BATTLE_TIMINGS.betweenActions)
  }
  await endTurn(ctx, battle)
}

export async function runSwitchTurn(ctx, partyIndex) {
  const switched = switchActivePokemon(ctx.getBattle(), partyIndex)
  if (!switched) return
  ctx.audio.playClick()
  ctx.dispatch({ type: 'SET_PHASE', phase: 'resolving' })
  await sayWhile(ctx, switched.recallMessage, recall(ctx, 'player'))
  ctx.dispatch({ type: 'SET_BATTLE', battle: switched.battle })
  await sayWhile(ctx, switched.sendOutMessage, sendOut(ctx, 'player', switched.pokemon))
  syncLowHpAlarm(ctx, switched.battle)
  const opponent = getActivePokemon(switched.battle, 'opponent')
  const battle = await performMove(ctx, switched.battle, { side: 'opponent', moveIndex: chooseOpponentMove(opponent) })
  await endTurn(ctx, battle)
}
