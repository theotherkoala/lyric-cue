import { Link } from 'react-router-dom'
import type { Song } from '../types'

interface SongRowProps {
  song: Song
}

/**
 * One tappable card in the song list. Presentational only — it knows nothing
 * about where songs come from.
 *
 * The whole card is the touch target (the <Link> fills it), so a thumb never
 * has to aim. Press feedback (background + slight scale) lives on `:active`;
 * the scale is gated behind `motion-safe:` to respect reduced-motion users.
 */
export function SongRow({ song }: SongRowProps) {
  return (
    <li>
      <Link
        to={`/play/${song.id}`}
        viewTransition
        className="group flex min-h-[60px] items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-[color,background-color,transform] duration-200 ease-out hover:bg-surface-hover active:bg-surface-hover motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text"
      >
        <span className="text-lg font-medium">{song.title}</span>

        {/* Native-style disclosure chevron; nudges right on hover/press. */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-active:translate-x-0.5"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </Link>
    </li>
  )
}
