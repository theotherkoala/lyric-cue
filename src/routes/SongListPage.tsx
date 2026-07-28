import { getSongs } from '../lib/songs'
import { SongRow } from '../features/songs/components/SongRow'

/**
 * Home page: shows every song as a tappable card. No search, no filters.
 * Tapping a card goes straight to the teleprompter for that song.
 */
export function SongListPage() {
  const songs = getSongs()

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col px-6 pt-16 pb-10">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">The Weeknd</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-muted">
          After Hours Til Dawn Tour
        </p>
        <p className="mt-5 text-[15px] text-muted">
          Select the song currently being performed.
        </p>
      </header>

      {songs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-muted">
          No songs available yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {songs.map((song) => (
            <SongRow key={song.id} song={song} />
          ))}
        </ul>
      )}
    </main>
  )
}
