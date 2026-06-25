import { motion } from 'motion/react'
import { config } from '../config'
import Section, { SectionHeading } from './Section'

export default function Reasons() {
  return (
    <Section id="reasons">
      <SectionHeading
        eyebrow="Just Because"
        title="Reasons You're Special"
        subtitle="And honestly, this is only the short list."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {config.reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass group relative overflow-hidden rounded-3xl p-7 text-center"
          >
            <div className="absolute inset-x-0 -top-12 mx-auto h-24 w-24 rounded-full bg-pink/40 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <motion.div
              className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-sm"
              whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              {r.emoji}
            </motion.div>
            <h3 className="font-display relative text-xl font-bold text-ink">{r.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">{r.text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
