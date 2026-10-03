// Pokédex search form. Emits onQueryChange and onSubmit; the hook does the fetching.

export default function SearchBar({ query, searching, status, onQueryChange, onSubmit }) {
  return <>
    <form className="search-box" onSubmit={onSubmit} role="search">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search a Pokémon by name or number…" aria-label="Search the Pokédex" />
      <button type="submit" disabled={searching}>{searching ? 'Finding…' : 'Search'}</button>
    </form>
    <p className="search-status" aria-live="polite">{status}</p>
  </>
}
