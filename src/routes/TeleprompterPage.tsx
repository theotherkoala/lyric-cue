import { Link, useParams } from 'react-router-dom'
import { getSongById } from '../lib/songs'
import { Teleprompter } from '../features/teleprompter/components/Teleprompter'

/**
 * Full-height teleprompter screen, locked to the mobile viewport: only the
 * lyric area inside <Teleprompter> scrolls. The header is a Back button (to the
 * song list) plus the centered song title. Leaving the page unmounts the
 * teleprompter, which stops playback.
 */
export function TeleprompterPage() {
  const { songId } = useParams<{ songId: string }>()
  const song = songId ? getSongById(songId) : undefined

  return (
    <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden">
      <header className="relative flex shrink-0 items-center justify-center px-2 py-2">
        <Link
          to="/"
          viewTransition
          aria-label="Back to songs"
          className="absolute left-1 px-4 py-2 text-2xl leading-none text-muted transition-colors active:text-text"
        >
          ‹
        </Link>
        <p className="max-w-[70%] truncate text-sm font-medium">
          {song ? song.title : 'Song not found'}
        </p>
      </header>

      {song ? (
        <Teleprompter key={song.id} song={song} />
      ) : (
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="text-muted">Song not found.</p>
        </div>
      )}
    </div>
  )
}
