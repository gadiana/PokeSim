// Renders a row of type badges for a list of types.

import TypeBadge from './TypeBadge'

export default function TypeBadgeList({ types, className = '' }) {
  return <div className={`type-row ${className}`.trim()}>{types.map((type) => <TypeBadge type={type} key={type} />)}</div>
}
