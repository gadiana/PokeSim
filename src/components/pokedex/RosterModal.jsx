// Battle roster dialog: shows the party slots and the "Challenge a trainer" button that starts the opponent search.

import { TEAM_SIZE } from '../../constants/battleConfig'
import CloseButton from '../common/CloseButton'
import Modal from '../common/Modal'
import PokeBallMark from '../common/PokeBallMark'
import TeamSlot from './TeamSlot'

const SLOTS = Array.from({ length: TEAM_SIZE }, (_, index) => index)

export default function RosterModal({ team, notice, onClose, onRemove, onStart }) {
  const missing = TEAM_SIZE - team.length
  return <Modal label="Your battle roster" className="roster-modal" backdropClassName="roster-backdrop" onClose={onClose}>
    <div className="roster-modal-head">
      <div><span className="eyebrow">YOUR PARTY</span><h2>Battle roster</h2><p>Choose a complete party, then take it into a six-on-six match.</p></div>
      <div><span className="roster-count">{team.length} / {TEAM_SIZE}</span><CloseButton label="Close battle roster" onClick={onClose} /></div>
    </div>
    <div className="team-slots">{SLOTS.map((index) => <TeamSlot key={index} pokemon={team[index]} index={index} onRemove={onRemove} />)}</div>
    <div className="rule-note"><b>Battle rules</b><span>Level 50 · 4 unique moves · Move PP · Type effectiveness · Boosts · Speed</span></div>
    <button className="challenge-button" type="button" onClick={onStart} disabled={missing > 0}>
      <PokeBallMark />{missing > 0 ? `Choose ${missing} more Pokémon` : 'Challenge a trainer'}
    </button>
    <p className="notice" aria-live="polite">{notice}</p>
  </Modal>
}
