// Battle start: opponent search → encounter sting + screen transition → entrances → battle music.

import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { createBattle, getActivePokemon, getEncounterMessages } from '../../logic/battleEngine'
import { loadBattleTeams } from '../../services/pokeapi'
import { sayWhile, sendOut } from './stagingSteps'

export async function runEncounter(ctx, team) {
  ctx.audio.unlock()
  ctx.audio.playClick()
  ctx.dispatch({ type: 'LOAD_START' })

  let battle
  try {
    const teams = await loadBattleTeams(team)
    battle = createBattle(teams.player, teams.opponent)
  } catch {
    ctx.dispatch({ type: 'LOAD_FAILED', error: 'The battle data could not load. Check your connection and try again.' })
    return
  }

  ctx.audio.stopAll()
  ctx.audio.playMusic('encounter', BATTLE_TIMINGS.musicStop)
  ctx.dispatch({ type: 'ENCOUNTER_START', battle })
  await ctx.wait(BATTLE_TIMINGS.encounterTransition)

  ctx.dispatch({ type: 'SET_PHASE', phase: 'intro' })
  const messages = getEncounterMessages(battle)
  const appeared = ctx.say(messages.appeared)
  ctx.audio.playMusic('battle')
  await sendOut(ctx, 'opponent', getActivePokemon(battle, 'opponent'))
  await appeared
  await sayWhile(ctx, messages.sendOut, sendOut(ctx, 'player', getActivePokemon(battle, 'player')))
  ctx.dispatch({ type: 'SET_PHASE', phase: 'choosing' })
}
