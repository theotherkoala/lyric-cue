import { Routes, Route, Navigate } from 'react-router-dom'
import { SongListPage } from './routes/SongListPage'
import { TeleprompterPage } from './routes/TeleprompterPage'

/**
 * Route map for the whole app.
 *  /                -> browse & search songs
 *  /play/:songId    -> teleprompter for one song
 * Any unknown path falls back to the song list.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<SongListPage />} />
      <Route path="/play/:songId" element={<TeleprompterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
