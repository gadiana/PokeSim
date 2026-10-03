// Sticky site header: brand, page navigation, audio controls, and team counter.

import { TEAM_SIZE } from '../../constants/battleConfig'
import PokeBallMark from '../common/PokeBallMark'
import AudioControls from './AudioControls'

const PAGES = [['landing', 'Home'], ['pokedex', 'Pokédex'], ['battle', 'Battle']]

export default function TopBar({ view, teamCount, onNavigate }) {
  return <header className="topbar">
    <button className="brand" type="button" onClick={() => onNavigate('landing')}><PokeBallMark /><span>POKÉ<span>LAB</span></span></button>
    <nav aria-label="Main navigation">
      {PAGES.map(([key, label]) => <button key={key} className={view === key ? 'active' : ''} type="button" onClick={() => onNavigate(key)} aria-current={view === key ? 'page' : undefined}>{label}</button>)}
    </nav>
    <div className="top-actions">
      <AudioControls />
      <div className="team-count"><span>TEAM</span><strong>{teamCount}<em>/{TEAM_SIZE}</em></strong></div>
    </div>
  </header>
}
