// Shared text formatting helpers for Pokémon, move, and stat names.

export const titleCase = (value = '') => value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())

export const formatId = (id) => `#${String(id).padStart(3, '0')}`
