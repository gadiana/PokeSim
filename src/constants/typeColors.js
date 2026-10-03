// Type color tokens shared by type badges, move buttons, and move effects.

export const TYPE_COLORS = {
  normal: '#8b8a78', fire: '#db643f', water: '#408fca', electric: '#c99d13',
  grass: '#539a67', ice: '#54a4b8', fighting: '#bd5546', poison: '#9a68b0',
  ground: '#b0834c', flying: '#7495ca', psychic: '#cf5d84', bug: '#819a40',
  rock: '#a08752', ghost: '#7a689b', dragon: '#7373c9', dark: '#6c5d53',
  steel: '#7a929e', fairy: '#c9769c',
}

export const DEFAULT_TYPE_COLOR = '#7c8790'

export function getTypeColor(type) {
  return TYPE_COLORS[type] || DEFAULT_TYPE_COLOR
}
