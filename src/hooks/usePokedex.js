// Loads the featured Pokédex and handles search, keeping fetches inside the services layer.

import { useEffect, useState } from 'react'
import { getFeaturedPokemon, getPokemon } from '../services/pokeapi'
import { titleCase } from '../utils/format'

export function usePokedex() {
  const [entries, setEntries] = useState([])
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    getFeaturedPokemon()
      .then((pokemon) => { if (!cancelled) setEntries(pokemon) })
      .catch(() => { if (!cancelled) setStatus('PokéAPI could not be reached. Check your connection and try again.') })
    return () => { cancelled = true }
  }, [])

  async function search(event) {
    event.preventDefault()
    const cleanQuery = query.trim().toLowerCase()
    if (!cleanQuery) return
    setSearching(true)
    try {
      const pokemon = await getPokemon(cleanQuery)
      setEntries((current) => [pokemon, ...current.filter((item) => item.id !== pokemon.id)])
      setStatus(`${titleCase(pokemon.name)} is ready to review.`)
    } catch {
      setStatus(`No Pokédex record found for “${cleanQuery}”.`)
    } finally {
      setSearching(false)
    }
  }

  return { entries, query, setQuery, searching, status, search }
}
