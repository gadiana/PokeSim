// Battle page: composes the battle components and wires them to the battle controller. No game logic here.

import { useState } from 'react'
import { audioManager } from '../audio/AudioManager'
import BattleArena from '../components/battle/BattleArena'
import BattleResultModal from '../components/battle/BattleResultModal'
import Button from '../components/common/Button'
import BattleStatusScreen from '../components/battle/BattleStatusScreen'
import DialogueBox from '../components/battle/DialogueBox'
import EncounterTransition from '../components/battle/EncounterTransition'
import MovePanel from '../components/battle/MovePanel'
import PartyModal from '../components/battle/PartyModal'
import PartyToggle from '../components/battle/PartyToggle'
import { timingCssVars } from '../constants/battleConfig'
import { ACTIVE_PHASES, selectActive, selectAliveCount, selectCanAct, selectMoveOptions, selectMustReplace, selectPrompt } from '../state/battleSelectors'

const HEADINGS = { won: 'Victory is yours.', lost: 'A hard-fought battle.' }

function playCry(pokemon) {
  audioManager.unlock()
  audioManager.playCry(pokemon.cryUrl)
}

export default function BattlePage({ controller, teamCount, onFindOpponent, onNavigate }) {
  const { state, advanceMessage, selectMove, choosePokemon, endBattle } = controller
  const [partyOpen, setPartyOpen] = useState(false)
  const canAct = selectCanAct(state)
  const mustReplace = selectMustReplace(state)
  const inBattle = state.battle && ACTIVE_PHASES.includes(state.phase)

  const onChoose = (index) => { setPartyOpen(false); choosePokemon(index) }
  const onCloseResult = () => { endBattle(); onNavigate('pokedex') }

  return <section className="battle-page" style={timingCssVars()}>
    {state.phase === 'encounter' && <EncounterTransition />}
    {!inBattle && <BattleStatusScreen phase={state.phase} error={state.error} teamCount={teamCount} onFindOpponent={onFindOpponent} onBuildTeam={() => onNavigate('pokedex')} />}

    {inBattle && <>
      <div className="battle-heading">
        <div><span className="eyebrow">LIVE BATTLE / TURN-BASED</span><h1>{HEADINGS[state.result] || 'The arena is set.'}</h1></div>
        <Button variant="outline" onClick={() => onNavigate('pokedex')}>← Back to roster</Button>
      </div>

      <div className="battle-screen">
        <BattleArena player={selectActive(state, 'player')} opponent={selectActive(state, 'opponent')} sprites={state.sprites}
          effect={state.effect} shaking={state.shaking} onCry={playCry} />
        <DialogueBox message={state.message} idleText={selectPrompt(state)} onAdvance={advanceMessage} />
        <div className="battle-actions">
          <MovePanel moves={selectMoveOptions(state)} disabled={!canAct} onSelect={selectMove} />
          <PartyToggle aliveCount={selectAliveCount(state)} total={state.battle.player.length} open={partyOpen}
            disabled={!canAct} onToggle={() => setPartyOpen((open) => !open)} />
        </div>
      </div>

      <p className="battle-note">Tap a Pokémon to hear its cry. Hover or long-press a move to see how effective it will be.</p>
    </>}

    {inBattle && (mustReplace || (partyOpen && canAct)) && <PartyModal party={state.battle.player} activeIndex={state.battle.activePlayerIndex}
      forced={mustReplace} onSelect={onChoose} onClose={() => setPartyOpen(false)} />}
    {state.phase === 'finished' && !state.message && <BattleResultModal result={state.result} onClose={onCloseResult} />}
  </section>
}
