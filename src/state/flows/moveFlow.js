// Plays out a single move: message, attacker lunge, hit effect + HP drop, outcome messages, and fainting.

import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { getActivePokemon, resolveMoveAction } from '../../logic/battleEngine'
import { animateSprite, faint, showEffect, showHit, syncLowHpAlarm } from './stagingSteps'

async function stageImpact(ctx, event, nextBattle) {
  if (event.isStatus && !event.missed && event.statTargetSide) {
    await showEffect(ctx, event.statTargetSide, event.move.type, { isStatus: true, onImpact: () => ctx.dispatch({ type: 'SET_BATTLE', battle: nextBattle }) })
    return
  }
  if (event.isStatus || event.missed || event.damage === 0) {
    ctx.dispatch({ type: 'SET_BATTLE', battle: nextBattle })
    return
  }
  await showHit(ctx, event, nextBattle)
}

/** Returns the battle snapshot after the move. */
export async function performMove(ctx, battle, action) {
  const { battle: nextBattle, event, messages } = resolveMoveAction(battle, action)
  if (!event) return battle

  const usedSpoken = ctx.say(messages.used)
  await animateSprite(ctx, event.side, 'attack', BATTLE_TIMINGS.lunge)
  await stageImpact(ctx, event, nextBattle)
  await usedSpoken

  for (const line of messages.outcome) await ctx.say(line)
  syncLowHpAlarm(ctx, nextBattle)

  if (event.fainted) {
    await faint(ctx, event.targetSide, getActivePokemon(nextBattle, event.targetSide))
    await ctx.say(messages.fainted)
  }
  return nextBattle
}
