import { useEffect, useRef } from 'react'

/** Ignore auto-centering for this long (ms) after the user scrolls manually. */
const MANUAL_SCROLL_GRACE_MS = 1500

/**
 * Keeps the "active" element vertically centered inside a scroll container,
 * animating smoothly whenever `activeIndex` (or `centerKey`) changes.
 *
 * - Centers using the SCROLL CONTAINER's own `clientHeight` — never the window
 *   — so the target is correct even though a fixed panel sits below it.
 * - `centerKey` lets callers force a re-center on events that don't change the
 *   index (e.g. lyrics finishing loading for a newly-selected song).
 * - Fires only on those changes, never per animation frame.
 * - Backs off briefly after manual wheel/touch scrolling so it doesn't fight
 *   the user.
 *
 * Relies on a STABLE layout: lines must not change box size when active (use
 * transform/opacity, not font-size), or the offsetTop read here is mid-reflow.
 */
export function useCenteredScroll<T extends HTMLElement = HTMLElement>(
  activeIndex: number,
  centerKey: string,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<T | null>(null)
  const suppressUntilRef = useRef(0)

  // Note recent manual scrolling so we can back off from auto-centering.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const markManual = () => {
      suppressUntilRef.current = performance.now() + MANUAL_SCROLL_GRACE_MS
    }
    container.addEventListener('wheel', markManual, { passive: true })
    container.addEventListener('touchmove', markManual, { passive: true })
    return () => {
      container.removeEventListener('wheel', markManual)
      container.removeEventListener('touchmove', markManual)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const active = activeRef.current
    if (!container || !active) return
    if (performance.now() < suppressUntilRef.current) return // user is scrolling

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

    // Center within the container's visible height, then clamp to the range.
    const rawTarget =
      active.offsetTop - container.clientHeight / 2 + active.offsetHeight / 2
    const maxScroll = container.scrollHeight - container.clientHeight
    const target = Math.max(0, Math.min(rawTarget, maxScroll))
    container.scrollTo({ top: target, behavior })
  }, [activeIndex, centerKey])

  return { containerRef, activeRef }
}
