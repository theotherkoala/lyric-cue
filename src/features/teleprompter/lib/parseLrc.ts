import type { LyricLine } from '../types'

/**
 * Matches one LRC time tag, e.g. `[01:05.10]`.
 *   Group 1 = minutes, Group 2 = seconds (with an optional `.fraction`).
 * Requiring a digit right after `[` is what makes metadata tags such as
 * `[ti:Title]` or `[offset:0]` never match — their first char is a letter.
 * The `g` (global) flag lets a single line contain more than one tag.
 */
const TIME_TAG = /\[(\d+):(\d+(?:\.\d+)?)\]/g

/**
 * Parse the raw text of an .lrc file into timed lyric lines.
 *
 * @param raw  The full contents of a .lrc file.
 * @returns    Lyric lines sorted ascending by `time` (total seconds).
 *             Metadata tags ([ti:], [ar:], [offset:], …) and blank lines
 *             are ignored. Empty-text lines (instrumental gaps) are kept
 *             as `text: ""`, since the timing is still meaningful.
 */
export function parseLrc(raw: string): LyricLine[] {
  const lines: LyricLine[] = []

  for (const rawLine of raw.split('\n')) {
    // The lyric is the line with every time tag stripped away. For a blank
    // or metadata line there are no tags, so the inner loop never runs and
    // nothing is added.
    const text = rawLine.replace(TIME_TAG, '').trim()

    for (const match of rawLine.matchAll(TIME_TAG)) {
      const minutes = Number(match[1])
      const seconds = Number(match[2])
      lines.push({ time: minutes * 60 + seconds, text })
    }
  }

  return lines.sort((a, b) => a.time - b.time)
}
