// Reusable animation + audio steps shared by battle flows. Each step dispatches store actions and awaits timings.

import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { getMoveEffect } from '../../constants/moveEffects'
import { getActivePokemon } from '../../logic/battleEngine'
import { isLowHp } from '../../logic/hp'

let effectKey = 0

export async function animateSprite(ctx, side, anim, duration, settleTo = 'idle') {
  ctx.dispatch({ type: 'SET_SPRITE', side, anim })
  await ctx.wait(duration)
  if (settleTo) ctx.dispatch({ type: 'SET_SPRITE', side, anim: settleTo })
}

export async function sendOut(ctx, side, pokemon) {
  ctx.audio.playCry(pokemon.cryUrl)
  await animateSprite(ctx, side, 'enter', BATTLE_TIMINGS.entrance)
}

export async function faint(ctx, side, pokemon) {
  ctx.audio.playCry(pokemon.cryUrl)
  ctx.audio.playSfx('faint')
  await animateSprite(ctx, side, 'faint', BATTLE_TIMINGS.faint, null)
}

export async function recall(ctx, side) {
  await animateSprite(ctx, side, 'recall', BATTLE_TIMINGS.recall, 'hidden')
}

/** Shows the type effect on `side`, then clears it. `onImpact` runs at the moment of impact. */
export async function showEffect(ctx, side, type, { isStatus = false, onImpact } = {}) {
  effectKey += 1
  ctx.dispatch({ type: 'SHOW_EFFECT', effect: { side, type, key: effectKey, ...getMoveEffect(type, isStatus) } })
  onImpact?.()
  await ctx.wait(BATTLE_TIMINGS.hitEffect)
  ctx.dispatch({ type: 'CLEAR_EFFECT' })
}

/** Damage impact: effect + blink + optional shake + hit sound. HP updates (and animates) at impact. */
export async function showHit(ctx, event, nextBattle) {
  const strong = event.effectiveness > 1 || event.critical
  ctx.audio.playHit(event.move.type, event.effectiveness)
  ctx.dispatch({ type: 'SET_SPRITE', side: event.targetSide, anim: 'hit' })
  if (strong) ctx.dispatch({ type: 'SET_SHAKE', shaking: true })
  await Promise.all([
    showEffect(ctx, event.targetSide, event.move.type, { onImpact: () => ctx.dispatch({ type: 'SET_BATTLE', battle: nextBattle }) }),
    ctx.wait(Math.max(BATTLE_TIMINGS.blink, BATTLE_TIMINGS.hpAnimation)),
  ])
  ctx.dispatch({ type: 'SET_SHAKE', shaking: false })
  ctx.dispatch({ type: 'SET_SPRITE', side: event.targetSide, anim: 'idle' })
}

export function syncLowHpAlarm(ctx, battle) {
  ctx.audio.setLowHpAlarm(isLowHp(getActivePokemon(battle, 'player')))
}

/** Runs a message alongside an animation and resolves after both finish. */
export async function sayWhile(ctx, text, animation) {
  const spoken = ctx.say(text)
  await animation
  await spoken
}
