import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { config } from '../config'
import Section from './Section'
import { sideCannons } from '../lib/confetti'

const { year, month, day, hour, minute } = config.birthday
// Start of the birthday in the visitor's local time.
const start = new Date(year, month - 1, day, hour, minute).getTime()
// The birthday "lasts" until the end of that calendar day.
const end = new Date(year, month - 1, day, 23, 59, 59).getTime()

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function diff(target: number): Remaining {
  const ms = Math.max(0, target - Date.now())
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  }
}

function Unit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="glass relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-2xl sm:h-28 sm:w-24">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={padded}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display absolute text-3xl font-bold text-ink sm:text-5xl"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs font-semibold tracking-[0.18em] text-ink-soft uppercase sm:text-sm">
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  const celebrated = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const isBirthday = now >= start && now <= end
  const isPast = now > end

  // Fire side cannons once when the day arrives.
  useEffect(() => {
    if (isBirthday && !celebrated.current) {
      celebrated.current = true
      sideCannons()
    }
  }, [isBirthday])

  const r = diff(start)

  return (
    <Section id="countdown">
      <div className="glass relative mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] px-6 py-14 text-center sm:px-12">
        <div className="absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-lavender/50 blur-3xl" />

        <AnimatePresence mode="wait">
          {isBirthday ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="text-6xl sm:text-7xl"
              >
                🎉
              </motion.div>
              <h2 className="font-display mt-4 text-4xl font-extrabold sm:text-6xl">
                <span className="text-gradient">It's Your Birthday Today!</span>
              </h2>
              <p className="mt-4 text-lg text-ink-soft">
                The wait is over — let the celebration begin! 🥳
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="counting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <span className="mb-2 inline-block rounded-full bg-white/60 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-rose uppercase">
                {isPast ? 'Hope it was wonderful' : 'Counting down'}
              </span>
              <h2 className="font-display mb-9 text-3xl font-bold text-ink sm:text-4xl">
                {isPast ? (
                  <span className="text-gradient">Until Next Year 🎈</span>
                ) : (
                  <span className="text-gradient">The Big Day Is Almost Here</span>
                )}
              </h2>
              {!isPast && (
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  <Unit value={r.days} label="Days" />
                  <Unit value={r.hours} label="Hours" />
                  <Unit value={r.minutes} label="Mins" />
                  <Unit value={r.seconds} label="Secs" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}
