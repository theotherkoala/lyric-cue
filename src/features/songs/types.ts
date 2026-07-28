/** A single song entry as stored in `src/data/songs.json`. */
export interface Song {
  /** Stable URL-safe id, used as the route param: /play/:songId */
  id: string
  title: string
  artist: string
  /** File name inside `public/lyrics/`, e.g. "amazing-grace.lrc" */
  lrcFile: string
}
