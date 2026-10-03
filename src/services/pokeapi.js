// All PokeAPI requests and Pokémon/move normalization live here. Nothing else calls fetch().

import { TEAM_SIZE, BATTLE_TIMINGS } from '../constants/battleConfig'
import { pickBattleMoves } from './movePicker'

const API = 'https://pokeapi.co/api/v2'
const MAX_POKEMON_ID = 1025
const MOVE_SAMPLE_SIZE = 30
const moveCache = new Map()

export const FEATURED_IDS = [1, 4, 7, 25, 39, 52, 63, 92, 133, 143, 147, 150]
export const SIGNATURE_MOVES = ['flamethrower', 'thunderbolt', 'ice-beam', 'surf', 'psychic', 'shadow-ball', 'dragon-claw', 'leaf-blade']

export function normalizePokemon(data) {
  const stats = Object.fromEntries(data.stats.map((stat) => [stat.stat.name, stat.base_stat]))
  const showdown = data.sprites.other?.showdown || {}
  const artwork = data.sprites.other?.['official-artwork']?.front_default
  return {
    id: data.id,
    name: data.name,
    types: [...data.types].sort((a, b) => a.slot - b.slot).map((type) => type.type.name),
    stats,
    frontSprite: artwork || data.sprites.front_default,
    iconSprite: data.sprites.front_default || artwork,
    battleFrontSprite: showdown.front_default || data.sprites.front_default || artwork,
    battleBackSprite: showdown.back_default || data.sprites.back_default || data.sprites.front_default,
    cryUrl: data.cries?.latest || data.cries?.legacy || '',
    moveRefs: data.moves,
  }
}

export async function getPokemon(query) {
  const response = await fetch(`${API}/pokemon/${encodeURIComponent(String(query).trim().toLowerCase())}`)
  if (!response.ok) throw new Error('Pokémon not found')
  return normalizePokemon(await response.json())
}

export const getFeaturedPokemon = () => Promise.all(FEATURED_IDS.map(getPokemon))

function usefulMoveRefs(moveRefs) {
  const valid = moveRefs.filter((entry) => entry.version_group_details.some((detail) => ['level-up', 'machine'].includes(detail.move_learn_method.name)))
  return [...new Map((valid.length ? valid : moveRefs).map((entry) => [entry.move.name, entry])).values()]
}

async function getMove(url) {
  if (moveCache.has(url)) return moveCache.get(url)
  const response = await fetch(url)
  if (!response.ok) throw new Error('Move not found')
  const move = await response.json()
  moveCache.set(url, move)
  return move
}

function normalizeMove(move) {
  return {
    name: move.name, type: move.type.name, power: move.power, pp: move.pp,
    accuracy: move.accuracy || 100, priority: move.priority, damageClass: move.damage_class.name,
    statChanges: move.stat_changes.map((change) => ({ stat: change.stat.name, change: change.change })), target: move.target.name,
  }
}

function sampleEvenly(list, size) {
  if (list.length <= size) return list
  return Array.from({ length: size }, (_, index) => list[Math.floor((index * (list.length - 1)) / (size - 1))])
}

export async function hydrateBattlePokemon(basicPokemon) {
  const pokemon = await getPokemon(basicPokemon.id)
  const candidates = usefulMoveRefs(pokemon.moveRefs)
  const signature = candidates.filter((entry) => SIGNATURE_MOVES.includes(entry.move.name))
  const refs = [...new Map([...signature, ...sampleEvenly(candidates, MOVE_SAMPLE_SIZE)].map((entry) => [entry.move.name, entry])).values()]
  const moves = (await Promise.all(refs.map((entry) => getMove(entry.move.url)))).map(normalizeMove)
  return { ...pokemon, moves: pickBattleMoves(moves, pokemon.types) }
}

export function createRandomOpponentIds(excludedIds, count = TEAM_SIZE) {
  const ids = new Set()
  while (ids.size < count) {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1
    if (!excludedIds.has(id)) ids.add(id)
  }
  return [...ids]
}

/** Warms the browser cache so sprites have their natural size ready the moment they enter. */
export function preloadImages(urls) {
  const loads = urls.filter(Boolean).map((url) => new Promise((resolve) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = resolve
    image.src = url
  }))
  const timeout = new Promise((resolve) => window.setTimeout(resolve, BATTLE_TIMINGS.spritePreloadTimeout))
  return Promise.race([Promise.all(loads), timeout])
}

/** Searches for an opponent party and hydrates both teams with battle-ready moves. */
export async function loadBattleTeams(team) {
  const excluded = new Set(team.map((pokemon) => pokemon.id))
  const [player, opponent] = await Promise.all([
    Promise.all(team.map(hydrateBattlePokemon)),
    Promise.all(createRandomOpponentIds(excluded).map((id) => hydrateBattlePokemon({ id }))),
  ])
  await preloadImages([...player.map((pokemon) => pokemon.battleBackSprite), ...opponent.map((pokemon) => pokemon.battleFrontSprite)])
  return { player, opponent }
}
