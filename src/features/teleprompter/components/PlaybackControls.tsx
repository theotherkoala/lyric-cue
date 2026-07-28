interface PlaybackControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  /** Relative jump in seconds, e.g. -5 or +5. */
  onSkip: (deltaSeconds: number) => void
}

/**
 * Transport controls: −5s · Start/Pause · +5s. Large touch targets for
 * one-handed use during a show. Purely presentational — state lives in the
 * playback hook above. (Reset stays in the hook but is no longer a UI row;
 * switching songs resets playback automatically.)
 */
export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onSkip,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onSkip(-5)}
        className="h-14 shrink-0 rounded-2xl border border-border bg-surface px-5 text-sm font-medium text-muted transition-colors duration-150 ease-out active:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        −5s
      </button>
      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        className="h-14 flex-1 rounded-2xl bg-text text-base font-semibold text-bg transition-transform duration-150 ease-out motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {isPlaying ? 'Pause' : 'Start'}
      </button>
      <button
        type="button"
        onClick={() => onSkip(5)}
        className="h-14 shrink-0 rounded-2xl border border-border bg-surface px-5 text-sm font-medium text-muted transition-colors duration-150 ease-out active:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        +5s
      </button>
    </div>
  )
}
