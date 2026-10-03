// Displays a Pokémon type as a tinted badge using the shared type color tokens.

import { getTypeColor } from '../../constants/typeColors'
import { titleCase } from '../../utils/format'

export default function TypeBadge({ type, solid = false }) {
  return <span className={`type-tag ${solid ? 'type-tag-solid' : ''}`} style={{ '--type': getTypeColor(type) }}>{titleCase(type)}</span>
}
