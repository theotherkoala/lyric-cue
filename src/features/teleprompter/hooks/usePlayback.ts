import { useCallback, useEffect, useRef, useState } from 'react'

/** Public API of the playback clock. */
export interface Playback {
  /** Seconds since the song started; advances only while playing. */
  currentTime: number
  isPlaying: boolean
  play: () => void
  pause: () => void
  reset: () => void
  /** Jump to an absolute time (seconds); preserves play/pause state. */
  seek: (time: number) => void
}

/**
 * A drift-free playback clock driven by requestAnimationFrame.
 *
 *  - `currentTime` / `isPlaying` are STATE — they drive re-renders.
 *  - The rAF id, the start anchor, and a mirror of currentTime are REFS —
 *    mutable bookkeeping the loop and callbacks read without re-rendering.
 *  - Time is computed from an anchor, never accumulated:
 *        startRef    = performance.now() - currentTime * 1000   // instant of t=0
 *        currentTime = (performance.now() - startRef) / 1000
 *    which is immune to dropped frames and floating-point drift.
 *  - Pause stops the loop and keeps currentTime; resume re-anchors from the
 *    frozen currentTime so time continues seamlessly.
 */
export function usePlayback(): Playback {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const frameRef = useRef<number | null>(null)
  const startRef = useRef(0)
  const currentTimeRef = useRef(0)

  // Keep the ref mirror and state in lockstep so callbacks can read the
  // latest time without depending on a (possibly stale) state closure.
  const setTime = useCallback((seconds: number) => {
    currentTimeRef.current = seconds
    setCurrentTime(seconds)
  }, [])

  const loop = useCallback(() => {
    setTime((performance.now() - startRef.current) / 1000)
    frameRef.current = requestAnimationFrame(loop)
  }, [setTime])

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (frameRef.current !== null) return // already playing — no second loop
    startRef.current = performance.now() - currentTimeRef.current * 1000
    setIsPlaying(true)
    frameRef.current = requestAnimationFrame(loop)
  }, [loop])

  const pause = useCallback(() => {
    stopLoop()
    setIsPlaying(false)
  }, [stopLoop])

  const reset = useCallback(() => {
    stopLoop()
    setTime(0)
    setIsPlaying(false)
  }, [stopLoop, setTime])

  const seek = useCallback(
    (time: number) => {
      const clamped = Math.max(0, time)
      setTime(clamped)
      // If a loop is running, re-anchor so it keeps counting from the new
      // position. If paused, the ref mirror we just set is enough — the next
      // play() will resume from here.
      if (frameRef.current !== null) {
        startRef.current = performance.now() - clamped * 1000
      }
    },
    [setTime],
  )

  // Cancel any pending frame when the hook unmounts.
  useEffect(() => stopLoop, [stopLoop])

  return { currentTime, isPlaying, play, pause, reset, seek }
}
