// Owns the player's six-Pokémon party and the status notice shown in the roster.

import { useMemo, useState } from 'react'
import { TEAM_SIZE } from '../constants/battleConfig'
import { titleCase } from '../utils/format'

export function useTeam() {
  const [members, setMembers] = useState([])
  const [notice, setNotice] = useState(`Build a ${TEAM_SIZE}-Pokémon squad to begin.`)
  const selectedIds = useMemo(() => new Set(members.map((pokemon) => pokemon.id)), [members])

  function add(pokemon) {
    if (selectedIds.has(pokemon.id)) return
    if (members.length >= TEAM_SIZE) { setNotice('Your team is full — remove a Pokémon to make a change.'); return }
    setMembers((current) => [...current, pokemon])
    setNotice(`${titleCase(pokemon.name)} joined your team.`)
  }

  function remove(id) {
    setMembers((current) => current.filter((pokemon) => pokemon.id !== id))
    setNotice('Team updated.')
  }

  return { members, selectedIds, notice, isFull: members.length === TEAM_SIZE, add, remove }
}
