// Pokémon image with a letter fallback. `variant`: artwork (default) or icon (small pixel sprite).

import { titleCase } from '../../utils/format'

export default function PokemonAvatar({ pokemon, variant = 'artwork', className = '' }) {
  const source = variant === 'icon' ? pokemon.iconSprite || pokemon.frontSprite : pokemon.frontSprite
  const pixelClass = variant === 'icon' ? 'is-pixel' : ''
  if (!source) return <div className={`sprite-fallback ${className}`} aria-hidden="true">{pokemon.name[0]}</div>
  return <img className={`${className} ${pixelClass}`.trim()} src={source} alt={titleCase(pokemon.name)} loading="lazy" />
}
