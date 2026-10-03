// Catalog of audio file paths in /public/audio. Replace the files there to change the sounds; names must match.

const AUDIO_BASE = '/audio/'
const path = (file) => `${AUDIO_BASE}${file}`

export const MUSIC_TRACKS = {
  encounter: { src: path('encounter.mp3'), loop: false },
  battle: { src: path('battle-loop.mp3'), loop: true },
  victory: { src: path('victory.mp3'), loop: false },
}

export const HIT_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

export const SFX_FILES = {
  click: path('button-click.mp3'),
  superEffective: path('hit-super-effective.mp3'),
  notVeryEffective: path('hit-not-very-effective.mp3'),
  faint: path('faint.mp3'),
  lowHp: path('low-hp.mp3'),
  ...Object.fromEntries(HIT_TYPES.map((type) => [`hit-${type}`, path(`hit-${type}.mp3`)])),
}

export const hitSfxKey = (type) => (HIT_TYPES.includes(type) ? `hit-${type}` : 'hit-normal')
