// Full-screen encounter wipe: white flash, then black bars sweep across, then the screen opens up.

import { ENCOUNTER_BAR_COUNT } from '../../constants/battleConfig'

const BARS = Array.from({ length: ENCOUNTER_BAR_COUNT }, (_, index) => index)

export default function EncounterTransition() {
  return <div className="encounter-transition" aria-hidden="true">
    <span className="encounter-flash" />
    <div className="encounter-bars">{BARS.map((index) => <i key={index} style={{ '--i': index }} />)}</div>
  </div>
}
