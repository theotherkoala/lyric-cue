import type { CSSProperties } from 'react'
import { formatTime } from '../lib/formatTime'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

/**
 * Seekable progress bar: current-time / total-duration labels above a styled
 * native range input. Using a real <input type="range"> gives drag, tap,
 * keyboard, and screen-reader support for free; all default chrome is removed
 * in CSS (see `.lc-range`). Seeking just calls the hook's seek(), so the
 * play/pause state is preserved.
 */
export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const safeDuration = duration > 0 ? duration : 0
  const value = Math.min(Math.max(0, currentTime), safeDuration)
  const pct = safeDuration > 0 ? (value / safeDuration) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between font-mono text-xs text-muted">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(safeDuration)}</span>
      </div>

      <input
        type="range"
        min={0}
        max={safeDuration || 1}
        step={0.1}
        value={value}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label="Seek"
        className="lc-range w-full"
        style={{ '--pct': `${pct}%` } as CSSProperties}
      />
    </div>
  )
}
