# LyricCue

A minimal, mobile-first **concert teleprompter**. Pick a song, and the lyrics
scroll and highlight in time so you can follow along at a live show — with a
smooth, Apple-Music-style karaoke fill. No login, no backend, no tracking; it's
a static site that reads local `.lrc` files.

## Features

- Song list → tap to open the teleprompter
- Timed lyrics parsed from standard `.lrc` files (line-level timestamps)
- Active line centered, previous faded, next visible
- Continuous per-word "karaoke" fill (estimated from line timing)
- Seek: draggable progress bar, tap any line, ±5s
- Play / pause with a drift-free `requestAnimationFrame` clock
- Dark, one-handed, safe-area-aware layout

## Tech stack

React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · React Router. No state
library, no backend, no database.

## Project structure

```
src/
  routes/                     # SongListPage, TeleprompterPage
  features/
    songs/                    # song types + list UI
    teleprompter/
      components/             # Teleprompter, TeleprompterLine, ProgressBar, PlaybackControls
      hooks/                  # useLyrics, usePlayback, useCenteredScroll
      lib/                    # parseLrc, getActiveLineIndex, loadLyrics, formatTime
  lib/songs.ts                # data-access seam over data/songs.json
  data/songs.json             # the setlist
public/lyrics/*.lrc           # one file per song
```

## Develop

```bash
npm install
npm run dev        # http://localhost:5173  (add -- --host to open on a phone)
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Adding a song

1. Drop `your-song.lrc` into `public/lyrics/`.
2. Add an entry to `src/data/songs.json`:
   ```json
   { "id": "your-song", "title": "…", "artist": "…", "lrcFile": "your-song.lrc" }
   ```
3. Rebuild / redeploy.

## Deployment

Static SPA on Vercel. `vercel.json` sets the build command, output directory,
and a catch-all rewrite to `index.html` so client-side routes (e.g.
`/play/:songId`) work on refresh and deep links.

## A note on lyrics & copyright

The bundled `amazing-grace.lrc` is public domain and used only to validate the
engine. Add your own legally-obtained `.lrc` files for other songs.
