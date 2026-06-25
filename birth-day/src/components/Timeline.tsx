import { motion } from 'motion/react'
import { config } from '../config'
import Section, { SectionHeading } from './Section'

export default function Timeline() {
  return (
    <Section id="timeline">
      <SectionHeading
        eyebrow="Our Story"
        title="Moments to Remember"
        subtitle="A few of the memories, conversations and milestones worth celebrating."
      />

      <div className="relative mx-auto max-w-3xl">
        {/* The vertical line */}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b from-pink-deep via-lavender-deep to-peach-deep sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-10">
          {config.timeline.map((item, i) => {
            const left = i % 2 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: left ? -40 : 40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-start gap-5 pl-12 sm:w-1/2 sm:pl-0 ${
                  left
                    ? 'sm:mr-auto sm:pr-12 sm:text-right'
                    : 'sm:ml-auto sm:flex-row-reverse sm:pl-12 sm:text-left'
                }`}
              >
                {/* Node dot */}
                <span
                  className={`absolute top-1.5 left-4 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white text-lg shadow-md ring-4 ring-pink/50 sm:left-auto ${
                    left ? 'sm:-right-[1.125rem] sm:left-auto' : 'sm:-left-[1.125rem]'
                  }`}
                >
                  {item.emoji}
                </span>

                <div className="glass w-full rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
                  <span className="text-xs font-semibold tracking-wide text-rose uppercase">
                    {item.date}
                  </span>
                  <h3 className="font-display mt-1 text-xl font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
