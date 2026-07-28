/** Format seconds as `m:ss`, e.g. 65.4 -> "1:05". Negatives clamp to 0. */
export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(total / 60)
  const secs = total % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
