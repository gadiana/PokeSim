# PokéLab — Pokémon battle simulator

React + Vite. Data from [PokeAPI](https://pokeapi.co). Audio via [Howler.js](https://howlerjs.com).

```bash
npm install
npm run dev
```

## Project structure

```
src/
  App.jsx                 app shell: header + view routing + app-wide hooks
  pages/                  HomePage, PokedexPage, BattlePage — compose components, no logic
  components/
    layout/               TopBar, AudioControls (mute + volume sliders)
    common/               Button, TypeBadge(List), PokeBallMark, PokemonAvatar, Modal, CloseButton
    home/                 HeroVisual
    pokedex/              PokemonCard, SearchBar, TeamSlot, RosterModal, PokemonDetailModal, StatList, MatchupList
    battle/               BattleArena, PokemonSprite, InfoCard, HpBar, DialogueBox, MovePanel, MoveButton,
                          MoveEffect, EncounterTransition, PartyToggle, PartyDrawer, BattleResultModal, BattleStatusScreen
  logic/                  pure battle rules — battleEngine, damage, typeChart, hp (no UI, no DOM)
  state/
    battleStore.js        reducer: the single source of truth for a battle
    battleSelectors.js    derived read-only views for the UI
    flows/                async sequencing of a battle (encounter, turns, moves, animation steps)
  hooks/                  useBattleController (connects store + flows), usePokedex, useTeam, small UI hooks
  services/               pokeapi.js (all fetches), movePicker.js
  audio/                  AudioManager.js (the only code that creates sounds), audioFiles.js
  constants/              battleConfig (timings, thresholds, volumes), typeColors, moveEffects
  styles/                 one stylesheet per area, bundled by styles/index.css
public/audio/             music + SFX — see public/audio/README.md to swap in your own files
```

Tuning lives in `src/constants/battleConfig.js`: animation durations (also exposed to CSS as
`--t-*` variables), HP color thresholds, sprite scale caps, and default volumes.
