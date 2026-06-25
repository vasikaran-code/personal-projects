import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { config } from '../config'
import Section, { SectionHeading } from './Section'
import { burst } from '../lib/confetti'

export default function GiftBox() {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleOpen = () => {
    if (open) return
    setOpen(true)
    // Burst from the gift box's position on screen.
    const rect = btnRef.current?.getBoundingClientRect()
    const origin = rect
      ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
      : { x: 0.5, y: 0.5 }
    burst(origin)
  }

  return (
    <Section id="gift">
      <SectionHeading
        eyebrow="For You"
        title="Your Surprise Gift"
        subtitle="Go on — you know you want to open it."
      />

      <div className="flex flex-col items-center">
        <button
          ref={btnRef}
          type="button"
          onClick={handleOpen}
          aria-label={open ? 'Gift opened' : 'Open your gift'}
          className="relative flex h-52 w-52 items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-rose/40 sm:h-60 sm:w-60"
        >
          {/* Glow */}
          <div className="absolute h-40 w-40 rounded-full bg-pink-deep/40 blur-3xl" />

          <AnimatePresence mode="wait">
            {!open ? (
              <motion.div
                key="closed"
                className="relative cursor-pointer text-[8rem] sm:text-[9rem]"
                animate={{ y: [0, -12, 0], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92, rotate: -8 }}
                exit={{ scale: 1.3, opacity: 0, rotate: 12 }}
              >
                🎁
              </motion.div>
            ) : (
              <motion.div
                key="opened"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="text-[8rem] sm:text-[9rem]"
              >
                🎉
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {!open ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 animate-bob text-sm font-medium tracking-wide text-rose"
            >
              👆 {config.gift.closedHint}
            </motion.p>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass mt-8 max-w-lg rounded-3xl px-7 py-8 text-center"
            >
              <h3 className="font-display text-2xl font-bold">
                <span className="text-gradient">{config.gift.title}</span>
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink">{config.gift.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}
