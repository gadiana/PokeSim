// Connects the battle store to the async battle flows and exposes simple actions to the UI.

import { useCallback, useLayoutEffect, useRef } from 'react'
import { audioManager } from '../audio/AudioManager'
import { useBattleStore } from '../state/battleStore'
import { selectCanAct, selectMustReplace } from '../state/battleSelectors'
import { runEncounter } from '../state/flows/encounterFlow'
import { runMoveTurn, runSwitchTurn } from '../state/flows/turnFlow'
import { wait } from '../utils/wait'

export function useBattleController() {
  const [state, dispatch] = useBattleStore()
  const stateRef = useRef(state)
  const resolvers = useRef(new Map())
  const messageId = useRef(0)
  const busy = useRef(false)
  const generation = useRef(0)
  const replacementResolver = useRef(null)

  useLayoutEffect(() => { stateRef.current = state }, [state])

  /** Builds the context a flow runs with. Actions from a flow of an older battle are ignored. */
  const createCtx = useCallback(() => {
    const runId = generation.current
    const live = () => runId === generation.current
    const guardedDispatch = (action) => { if (live()) dispatch(action) }
    return {
      dispatch: guardedDispatch,
      wait,
      audio: audioManager,
      getBattle: () => stateRef.current.battle,
      /** Shows one dialogue message; resolves once the player (or the auto-advance timer) dismisses it. */
      say: (text) => new Promise((resolve) => {
        if (!live()) return
        messageId.current += 1
        resolvers.current.set(messageId.current, resolve)
        dispatch({ type: 'SHOW_MESSAGE', message: { id: messageId.current, text } })
      }),
      /** Resolves with the party index the player picks in the forced replacement modal. */
      requestReplacement: () => new Promise((resolve) => {
        if (live()) replacementResolver.current = resolve
      }),
    }
  }, [dispatch])

  const invalidateFlows = useCallback(() => {
    generation.current += 1
    resolvers.current.clear()
    replacementResolver.current = null
    busy.current = false
  }, [])

  const runExclusive = useCallback(async (flow) => {
    if (busy.current) return
    busy.current = true
    const runId = generation.current
    try { await flow() } finally { if (runId === generation.current) busy.current = false }
  }, [])

  const advanceMessage = useCallback((id) => {
    dispatch({ type: 'CLEAR_MESSAGE', id })
    resolvers.current.get(id)?.()
    resolvers.current.delete(id)
  }, [dispatch])

  const startBattle = useCallback((team) => {
    invalidateFlows()
    return runExclusive(() => runEncounter(createCtx(), team))
  }, [createCtx, invalidateFlows, runExclusive])

  const selectMove = useCallback((index) => {
    if (selectCanAct(stateRef.current)) runExclusive(() => runMoveTurn(createCtx(), index))
  }, [createCtx, runExclusive])

  /** Party modal pick: answers a forced replacement after a faint, otherwise starts a voluntary switch turn. */
  const choosePokemon = useCallback((index) => {
    if (selectMustReplace(stateRef.current) && replacementResolver.current) {
      const resolve = replacementResolver.current
      replacementResolver.current = null
      resolve(index)
      return
    }
    if (selectCanAct(stateRef.current)) runExclusive(() => runSwitchTurn(createCtx(), index))
  }, [createCtx, runExclusive])

  const endBattle = useCallback(() => {
    invalidateFlows()
    audioManager.stopAll()
    dispatch({ type: 'RESET' })
  }, [dispatch, invalidateFlows])

  return { state, advanceMessage, startBattle, selectMove, choosePokemon, endBattle }
}
