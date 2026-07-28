import { useCallback, useEffect, useRef, useState } from 'react'
import { useLyrics } from '../hooks/useLyrics'
import { usePlayback } from '../hooks/usePlayback'
import { useCenteredScroll } from '../hooks/useCenteredScroll'
import { getActiveLineIndex } from '../lib/getActiveLineIndex'
import { TeleprompterLine, type LineEmphasis } from './TeleprompterLine'
import { PlaybackControls } from './PlaybackControls'
import { ProgressBar } from './ProgressBar'
import type { Song } from '../../songs/types'

/** Fallback line length (seconds) used for the last line, which has no next. */
const FALLBACK_LINE_DURATION = 4

/** Line transition timings (ms): calmer for natural advance, snappier for seeks. */
const ADVANCE_TRANSITION_MS = 550
const SEEK_TRANSITION_MS = 300

interface TeleprompterProps {
  song: Song
}

/** Centered status message for the loading / error / empty states. */
function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <p className="text-muted">{children}</p>
    </div>
  )
}

function emphasisFor(index: number, activeIndex: number): LineEmphasis {
  if (index === activeIndex) return 'current'
  return index < activeIndex ? 'past' : 'future'
}

/**
 * Estimate how far playback has progressed through the active line (0..1),
 * from this line's timestamp to the next line's (or a fallback for the last).
 */
function lineProgressAt(
  lines: { time: number }[],
  activeIndex: number,
  currentTime: number,
): number {
  const active = lines[activeIndex]
  if (!active) return 0
  const nextTime = lines[activeIndex + 1]?.time ?? active.time + FALLBACK_LINE_DURATION
  const span = nextTime - active.time
  if (span <= 0) return 1 // identical timestamps -> treat as complete
  const raw = (currentTime - active.time) / span
  return Math.min(1, Math.max(0, raw))
}

/**
 * The teleprompter for one song. Mounted with `key={song.id}` by the page, so a
 * new song remounts this component — a clean paused/zeroed clock and a fresh
 * lyrics load. Reads the clock, keeps the active lyric centered, fills it
 * karaoke-style, and supports seeking (progress bar, ±5s, tap-a-line).
 */
export function Teleprompter({ song }: TeleprompterProps) {
  const lyrics = useLyrics(song.lrcFile)
  const { currentTime, isPlaying, play, pause, seek } = usePlayback()

  // Computed with a fallback so all hooks run before any early return.
  const lines = lyrics.status === 'ready' ? lyrics.lines : []
  const activeIndex = getActiveLineIndex(lines, currentTime)
  // Before the first line nothing is "current"; still center line 0 so the
  // first lyric sits mid-screen on load. `centerKey` re-centers once lyrics
  // arrive (length 0 -> N) even if the index didn't change.
  const centeredIndex = activeIndex < 0 ? 0 : activeIndex
  const { containerRef, activeRef } = useCenteredScroll<HTMLButtonElement>(
    activeIndex,
    String(lines.length),
  )

  // A seek should transition faster than a natural line advance.
  const [isSeeking, setIsSeeking] = useState(false)
  const seekResetRef = useRef<number | null>(null)

  const seekTo = useCallback(
    (time: number) => {
      setIsSeeking(true)
      seek(time)
      if (seekResetRef.current !== null) window.clearTimeout(seekResetRef.current)
      seekResetRef.current = window.setTimeout(() => setIsSeeking(false), 400)
    },
    [seek],
  )

  useEffect(
    () => () => {
      if (seekResetRef.current !== null) window.clearTimeout(seekResetRef.current)
    },
    [],
  )

  if (lyrics.status === 'loading') {
    return <StatusMessage>Loading lyrics…</StatusMessage>
  }
  if (lyrics.status === 'error') {
    return <StatusMessage>Couldn’t load lyrics: {lyrics.message}</StatusMessage>
  }
  if (lines.length === 0) {
    return <StatusMessage>No lyrics available for this song.</StatusMessage>
  }

  const duration = lines[lines.length - 1]?.time ?? 0
  const activeProgress = lineProgressAt(lines, activeIndex, currentTime)
  const lineDurationMs = isSeeking ? SEEK_TRANSITION_MS : ADVANCE_TRANSITION_MS

  const handleSkip = (deltaSeconds: number) => {
    seekTo(Math.min(duration, Math.max(0, currentTime + deltaSeconds)))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Lyric viewport — the only scroller. Sits between header and panel. */}
      <div
        ref={containerRef}
        className="no-scrollbar lyrics-fade min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="flex flex-col gap-6 px-5 py-[45vh]">
          {lines.map((line, index) => (
            <TeleprompterLine
              key={index}
              text={line.text}
              emphasis={emphasisFor(index, activeIndex)}
              progress={index === activeIndex ? activeProgress : undefined}
              durationMs={lineDurationMs}
              onSelect={() => seekTo(line.time)}
              ref={index === centeredIndex ? activeRef : undefined}
            />
          ))}
        </div>
      </div>

      {/* Fixed-height control panel below the lyrics — never overlaps them. */}
      <footer className="shrink-0 space-y-3 border-t border-border/50 bg-bg px-5 pb-2 pt-3">
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seekTo} />
        <PlaybackControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onSkip={handleSkip}
        />
      </footer>
    </div>
  )
}
