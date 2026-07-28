import { useEffect, useRef } from 'react'

/**
 * Hold a screen wake lock while `active` is true (e.g. during playback), so the
 * phone doesn't dim or sleep mid-song. The lock is released when `active`
 * becomes false or the component unmounts, and re-acquired when the tab becomes
 * visible again (browsers automatically drop the lock while hidden).
 *
 * A no-op on browsers without the Screen Wake Lock API, and any request failure
 * (e.g. low battery, page not focused) is swallowed — the user never sees an
 * error for a best-effort convenience.
 */
export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!('wakeLock' in navigator)) return // unsupported -> silently skip

    let disposed = false

    const acquire = async () => {
      if (!active || document.visibilityState !== 'visible' || sentinelRef.current) {
        return
      }
      try {
        const sentinel = await navigator.wakeLock.request('screen')
        if (disposed) {
          void sentinel.release().catch(() => {})
          return
        }
        sentinelRef.current = sentinel
        sentinel.addEventListener('release', () => {
          if (sentinelRef.current === sentinel) sentinelRef.current = null
        })
      } catch {
        // Denied/failed — ignore; keeping the screen on is best-effort.
      }
    }

    const release = () => {
      const sentinel = sentinelRef.current
      sentinelRef.current = null
      if (sentinel) void sentinel.release().catch(() => {})
    }

    // Re-acquire when returning to a visible tab (the OS drops it when hidden).
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    if (active) void acquire()
    else release()

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      disposed = true
      document.removeEventListener('visibilitychange', handleVisibility)
      release()
    }
  }, [active])
}
