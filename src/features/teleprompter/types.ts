/**
 * One timed line of lyrics, produced by the LRC parser (Sprint 2).
 * This is the core contract between the parser and the teleprompter.
 */
export interface LyricLine {
  /** Timestamp in seconds from the start of the song. */
  time: number
  /** The lyric text for this line. */
  text: string
}
