import { useEffect, useState } from 'react'
import { loadLyrics } from '../lib/loadLyrics'
import type { LyricLine } from '../types'

/**
 * Async state for a lyrics load, modelled as a discriminated union so the UI
 * is forced to handle every case and impossible states can't be represented.
 */
export type LyricsState =
  | { status: 'loading' }
  | { status: 'ready'; lines: LyricLine[] }
  | { status: 'error'; message: string }

/**
 * Load and parse the lyrics for one .lrc file. Re-runs if `lrcFile` changes,
 * and aborts the in-flight request on unmount / change so we never set state
 * on an unmounted component.
 */
export function useLyrics(lrcFile: string): LyricsState {
  const [state, setState] = useState<LyricsState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })

    loadLyrics(lrcFile, controller.signal)
      .then((lines) => setState({ status: 'ready', lines }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Unknown error'
        setState({ status: 'error', message })
      })

    return () => controller.abort()
  }, [lrcFile])

  return state
}
