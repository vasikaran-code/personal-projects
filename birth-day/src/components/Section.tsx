import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
}

/** A page section with a gentle fade-up reveal when it scrolls into view. */
export default function Section({ id, children, className = '' }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28 ${className}`}
    >
      {children}
    </motion.section>
  )
}

type HeadingProps = {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function SectionHeading({ eyebrow, title, subtitle }: HeadingProps) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-white/60 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-rose uppercase shadow-sm backdrop-blur">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl font-bold text-ink sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
