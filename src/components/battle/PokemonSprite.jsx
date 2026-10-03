// Battle sprite: whole-number pixel scaling, a foot shadow that scales with it, idle bob, and animation states.

import { useRef, useState } from 'react'
import { SPRITE_SCALE } from '../../constants/battleConfig'
import { useElementSize } from '../../hooks/useElementSize'
import { titleCase } from '../../utils/format'
import { getPixelScale } from '../../utils/pixelScale'

export default function PokemonSprite({ pokemon, side, anim, onCry, children }) {
  const slotRef = useRef(null)
  const available = useElementSize(slotRef)
  const source = side === 'player' ? pokemon.battleBackSprite : pokemon.battleFrontSprite
  const [natural, setNatural] = useState({ src: '', width: 0, height: 0 })
  const isLoaded = natural.src === source
  const scale = getPixelScale(natural, available, SPRITE_SCALE[side])
  const width = natural.width * scale
  const height = natural.height * scale
  const name = titleCase(pokemon.name)

  const onLoad = (event) => setNatural({ src: source, width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })

  return <div ref={slotRef} className={`sprite-slot sprite-slot-${side} anim-${anim} ${isLoaded ? 'is-loaded' : ''}`}
    style={{ '--sprite-w': `${width}px`, '--sprite-h': `${height}px` }}>
    <span className="sprite-platform" aria-hidden="true" />
    <span className="sprite-shadow" aria-hidden="true" />
    <div className="sprite-motion">
      <button className="sprite-button" type="button" onClick={() => onCry(pokemon)} aria-label={`${name}. Play cry`}>
        <span className="sprite-bob">
          <img className="sprite-img" src={source} alt="" width={isLoaded ? width : undefined} height={isLoaded ? height : undefined} onLoad={onLoad} draggable="false" />
        </span>
      </button>
      {children}
    </div>
  </div>
}
