/** A single song entry as stored in `src/data/songs.json`. */
export interface Song {
  /** Stable URL-safe id, used as the route param: /play/:songId */
  id: string
  title: string
  artist: string
  /** Public path to the .lrc file, e.g. "/lyrics/after-hours.lrc" */
  lrcFile: string
}
