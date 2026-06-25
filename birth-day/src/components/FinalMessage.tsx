import { motion } from 'motion/react'
import { config } from '../config'

export default function FinalMessage() {
  return (
    <section
      id="final"
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-5 py-24"
    >
      {/* Layered soft glow backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-pink/50 blur-3xl" />
        <div className="absolute right-1/4 bottom-10 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
      </div>

      <div className="max-w-3xl text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          className="mb-8 text-6xl"
        >
          ❤️
        </motion.div>

        {config.final.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.25 }}
            className={
              i === config.final.lines.length - 1
                ? 'font-display mt-5 text-3xl font-bold sm:text-4xl'
                : 'font-display mt-3 text-2xl leading-relaxed font-medium text-ink sm:text-3xl'
            }
          >
            {i === config.final.lines.length - 1 ? (
              <span className="text-gradient">{line}</span>
            ) : (
              line
            )}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
