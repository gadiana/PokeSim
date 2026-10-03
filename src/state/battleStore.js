// Single source of truth for a battle: phase, battle snapshot, current message, sprite animations, and effects.

import { useReducer } from 'react'

/**
 * phase: idle → loading → encounter → intro → choosing ⇄ resolving (⇄ replacing after a faint) → finished  (or error)
 * sprites[side]: hidden | enter | idle | attack | hit | faint | recall
 */
export const initialBattleState = {
  phase: 'idle',
  battle: null,
  message: null,
  sprites: { player: 'hidden', opponent: 'hidden' },
  effect: null,
  shaking: false,
  result: null,
  error: '',
}

export function battleReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START': return { ...initialBattleState, phase: 'loading' }
    case 'LOAD_FAILED': return { ...initialBattleState, phase: 'error', error: action.error }
    case 'ENCOUNTER_START': return { ...state, phase: 'encounter', battle: action.battle }
    case 'SET_PHASE': return { ...state, phase: action.phase }
    case 'SET_BATTLE': return { ...state, battle: action.battle }
    case 'SHOW_MESSAGE': return { ...state, message: action.message }
    case 'CLEAR_MESSAGE': return state.message?.id === action.id ? { ...state, message: null } : state
    case 'SET_SPRITE': return { ...state, sprites: { ...state.sprites, [action.side]: action.anim } }
    case 'SHOW_EFFECT': return { ...state, effect: action.effect }
    case 'CLEAR_EFFECT': return { ...state, effect: null }
    case 'SET_SHAKE': return { ...state, shaking: action.shaking }
    case 'FINISH': return { ...state, phase: 'finished', result: action.result, effect: null, shaking: false }
    case 'RESET': return initialBattleState
    default: return state
  }
}

export const useBattleStore = () => useReducer(battleReducer, initialBattleState)
