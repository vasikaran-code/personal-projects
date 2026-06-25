import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { config } from '../config'
import { useTypewriter } from '../hooks/useTypewriter'
import Section from './Section'

export default function MessageCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [show, setShow] = useState(false)
  const { output, done } = useTypewriter(config.message.lines, inView, 20)

  // Reveal the caret only while typing.
  const activeLine = output.findIndex((l, i) => l.length < config.message.lines[i].length)

  return (
    <Section id="message">
      <div ref={ref} className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass relative overflow-hidden rounded-[2rem] px-7 py-12 sm:px-12"
          onAnimationComplete={() => setShow(true)}
        >
          {/* Decorative corner glow */}
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-pink/60 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-lavender/60 blur-2xl" />

          <div className="relative text-center">
            <span className="text-5xl">💌</span>
            <h2 className="font-display mt-4 text-3xl font-bold text-ink sm:text-4xl">
              <span className="text-gradient">{config.message.heading}</span>
            </h2>

            <div className="mt-7 space-y-4 text-left text-base leading-relaxed text-ink sm:text-lg">
              {output.map((line, i) => (
                <p
                  key={i}
                  className={
                    i === activeLine && show && !done ? 'caret min-h-[1.6em]' : 'min-h-[1.6em]'
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: done ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8 text-2xl"
            >
              🎂 🥳 🎉
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
