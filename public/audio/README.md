# PokéLab audio

Every sound the battle screen plays is loaded from this folder by `src/audio/AudioManager.js`
(file list: `src/audio/audioFiles.js`). The files shipped here are **synthesized chiptune placeholders**
so the app works out of the box. Drop in your own files with the **exact same names** to replace them.
MP3 is recommended; keep effects short (under 1 s).

## Music

| File | Plays when | Loops |
| --- | --- | --- |
| `encounter.mp3` | Opponent found — during the white flash / black bar transition (~1.5 s) | no |
| `battle-loop.mp3` | From "A wild … appeared!" until the battle ends (crossfades in) | **yes** — make it loop cleanly |
| `victory.mp3` | After you win (battle music fades out first) | no |

## Sound effects

| File | Plays when |
| --- | --- |
| `button-click.mp3` | Choosing a move, switching, or challenging a trainer |
| `hit-normal.mp3` | Normal-type hit, and fallback for any missing type file |
| `hit-fire.mp3`, `hit-water.mp3`, `hit-electric.mp3`, `hit-grass.mp3`, `hit-ice.mp3`, `hit-fighting.mp3`, `hit-poison.mp3`, `hit-ground.mp3`, `hit-flying.mp3`, `hit-psychic.mp3`, `hit-bug.mp3`, `hit-rock.mp3`, `hit-ghost.mp3`, `hit-dragon.mp3`, `hit-dark.mp3`, `hit-steel.mp3`, `hit-fairy.mp3` | A damaging move of that type lands |
| `hit-super-effective.mp3` | Layered on top of the type hit when it's super effective |
| `hit-not-very-effective.mp3` | Layered on top of the type hit when it's not very effective |
| `faint.mp3` | A Pokémon faints (the "falling" sound, played with its cry) |
| `low-hp.mp3` | Loops while your active Pokémon is below 20% HP — leave silence at the end for spacing |

## Pokémon cries

Cries are streamed from PokeAPI (`cries.latest`, falling back to `cries.legacy`). They play when a
Pokémon enters battle, when it faints, and when you click its sprite or the Pokédex "Hear cry" button.

## Notes

- Audio only starts after a user click (browser autoplay rules). "Challenge a trainer" counts.
- Music and SFX volumes and the mute toggle live in the header (♫ button + ⚙ menu) and are saved in
  `localStorage` under `pokelab-audio-settings`.
- A missing or broken file is skipped silently; it never breaks the battle.
- Only use audio you have the rights to.
