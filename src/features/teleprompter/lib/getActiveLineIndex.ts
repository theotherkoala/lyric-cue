import type { LyricLine } from '../types'

/**
 * Return the index of the lyric line that is "active" at `currentTime`.
 *
 * A line is active from its own timestamp until the next line's timestamp,
 * so the active line is the LAST line whose `time` is <= currentTime.
 *
 * @param lines        Lyric lines, assumed sorted ascending by time
 *                     (parseLrc guarantees this).
 * @param currentTime  Current playback position, in seconds.
 * @returns            Index into `lines`, or -1 if currentTime is before the
 *                     first line (nothing active yet).
 *
 * TODO — YOUR implementation. Cases to get right:
 *   - empty `lines`                          -> -1
 *   - currentTime before the first line      -> -1
 *   - currentTime exactly on a line's time   -> that line
 *   - currentTime after the last line        -> last index
 *
 * A linear scan is perfectly fine for a song's worth of lines. A binary
 * search is the O(log n) answer a senior reviewer will look for — your call
 * which you write (be ready to justify it either way).
 */
export function getActiveLineIndex(
  lines: LyricLine[],
  currentTime: number,
): number {
  let activeIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line === undefined) break
    // Lines are sorted ascending, so the first future line means every line
    // after it is future too — stop scanning.
    if (line.time > currentTime) break
    activeIndex = i
  }
  return activeIndex
}
