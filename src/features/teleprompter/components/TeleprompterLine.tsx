import { Fragment, type Ref } from 'react'

/** How much emphasis a lyric line gets, based on the playback position. */
export type LineEmphasis = 'past' | 'current' | 'future'

interface TeleprompterLineProps {
  text: string
  emphasis: LineEmphasis
  /** Jump playback to this line. */
  onSelect: () => void
  /** 0..1 fill progress through the line. Only supplied for the active line. */
  progress?: number
  /** Transition length (ms): slower for natural advance, faster for seeks. */
  durationMs: number
  /** Attached only to the active line so the view can center it. */
  ref?: Ref<HTMLButtonElement>
}

/**
 * Emphasis is expressed ONLY through transform / opacity / colour — never
 * font-size — so the layout box stays the same size in every state. That keeps
 * the column from reflowing during a transition and lets the centering scroll
 * target stay accurate.
 */
const EMPHASIS_CLASSES: Record<LineEmphasis, string> = {
  past: 'text-muted opacity-30 -translate-y-1 scale-[0.96]',
  current: 'opacity-100 translate-y-0 scale-100',
  future: 'text-muted opacity-40 translate-y-1 scale-[0.97]',
}

/**
 * A single word rendered as two stacked copies: muted base + bright overlay
 * clipped from the right by `fill` (0..1). Because the clip is scoped to ONE
 * word (which never wraps), it always reveals left-to-right correctly.
 */
function FillWord({ word, fill }: { word: string; fill: number }) {
  const insetFromRight = (1 - fill) * 100
  return (
    <span className="relative inline-block">
      <span className="text-muted">{word}</span>
      <span
        aria-hidden
        className="absolute inset-0 text-text"
        style={{ clipPath: `inset(0 ${insetFromRight}% 0 0)` }}
      >
        {word}
      </span>
    </span>
  )
}

/**
 * Continuous karaoke fill for the active line, per word. Each word gets an
 * equal slice of the line's progress: completed words are fully bright, the
 * one active word fills partially left-to-right, and future words stay muted.
 * The words are normal inline elements separated by real spaces, so the browser
 * wraps them naturally — and the fill therefore follows reading order across
 * wrapped rows.
 */
function LyricFill({ text, progress }: { text: string; progress: number }) {
  const words = text.trim().split(/\s+/)
  const filledUnits = Math.min(1, Math.max(0, progress)) * words.length

  return (
    <>
      {words.map((word, index) => {
        const fill = Math.min(1, Math.max(0, filledUnits - index))
        return (
          <Fragment key={index}>
            <FillWord word={word} fill={fill} />
            {index < words.length - 1 ? ' ' : ''}
          </Fragment>
        )
      })}
    </>
  )
}

/**
 * One centered, tappable lyric line. All lines share font-size and weight; only
 * transform/opacity/colour change between states, animated with a soft ease so
 * lines glide between past → current → future.
 */
export function TeleprompterLine({
  text,
  emphasis,
  onSelect,
  progress,
  durationMs,
  ref,
}: TeleprompterLineProps) {
  const isInstrumental = text.trim() === ''

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      style={{ transitionDuration: `${durationMs}ms` }}
      aria-label={isInstrumental ? 'Instrumental — jump here' : `Jump to: ${text}`}
      className={`block w-full text-center text-3xl font-medium leading-snug outline-none will-change-transform transition-[transform,opacity,color] ease-[cubic-bezier(0.22,1,0.36,1)] ${EMPHASIS_CLASSES[emphasis]}`}
    >
      {isInstrumental ? (
        <span aria-hidden className="text-muted">
          ♪
        </span>
      ) : emphasis === 'current' && progress !== undefined ? (
        <LyricFill text={text} progress={progress} />
      ) : (
        text
      )}
    </button>
  )
}
