import { parseLrc } from './parseLrc'
import type { LyricLine } from '../types'

/**
 * Fetch an .lrc file from `public/lyrics/` and parse it into timed lines.
 * This is the only place that touches the network — the parser stays pure.
 *
 * @param lrcFile  Public path to the .lrc file, e.g. "/lyrics/after-hours.lrc"
 * @param signal   Optional AbortSignal so callers can cancel the request.
 */
export async function loadLyrics(
  lrcFile: string,
  signal?: AbortSignal,
): Promise<LyricLine[]> {
  const response = await fetch(lrcFile, { signal })
  if (!response.ok) {
    throw new Error(`Could not load lyrics (${response.status})`)
  }
  const raw = await response.text()
  return parseLrc(raw)
}
