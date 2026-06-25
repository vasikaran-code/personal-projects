import { motion } from 'motion/react'
import { config } from '../config'

export default function Hero({ onOpen }: { onOpen: () => void }) {
  const { title, subtitle, cta } = config.hero

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center"
    >
      {/* Greeting chip */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass mb-8 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-rose"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
        </span>
        A little surprise, just for you
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-7xl md:text-8xl"
      >
        <span className="text-gradient">{title}</span>{' '}
        <motion.span
          className="inline-block"
          animate={{ rotate: [0, 14, -8, 14, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
        >
          ❤️
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl"
      >
        {subtitle}
      </motion.p>

      <motion.button
        type="button"
        onClick={onOpen}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="group relative mt-10 overflow-hidden rounded-full bg-gradient-to-r from-rose via-pink-deep to-lavender-deep px-9 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-12px_rgba(247,86,124,0.7)]"
        style={{ animation: 'pulse-glow 2.6s ease-out infinite' }}
      >
        <span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          aria-hidden="true"
        />
        <span className="relative flex items-center gap-2">
          {cta}
          <span className="transition-transform duration-300 group-hover:translate-y-1">🎁</span>
        </span>
      </motion.button>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-rose/50 p-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-rose/70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
