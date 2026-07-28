import songsData from '../data/songs.json'
import type { Song } from '../features/songs/types'

/*
 * Data-access seam.
 *
 * Today songs live in a local JSON file. The rest of the app only ever calls
 * these functions — never imports the JSON directly. If the source ever changes
 * (an API, IndexedDB, etc.) only this file changes.
 */

/** Reject malformed rows so a bad JSON entry can't render a blank card or
 *  point playback at a missing file. */
function isValidSong(value: unknown): value is Song {
  const song = value as Record<string, unknown> | null
  return (
    song !== null &&
    typeof song.id === 'string' &&
    song.id.trim() !== '' &&
    typeof song.title === 'string' &&
    song.title.trim() !== '' &&
    typeof song.artist === 'string' &&
    typeof song.lrcFile === 'string' &&
    song.lrcFile.trim() !== ''
  )
}

const songs = (songsData as unknown[]).filter(isValidSong)

export function getSongs(): Song[] {
  return songs
}

export function getSongById(id: string): Song | undefined {
  return songs.find((song) => song.id === id)
}

/**
 * The song `direction` steps away from `id` in setlist order, wrapping around
 * the ends. Returns undefined only if `id` isn't in the setlist.
 */
export function getAdjacentSong(id: string, direction: number): Song | undefined {
  const index = songs.findIndex((song) => song.id === id)
  if (index === -1) return undefined
  const nextIndex = (index + direction + songs.length) % songs.length
  return songs[nextIndex]
}
