import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { config } from '../config'
import Section, { SectionHeading } from './Section'

export default function Gallery() {
  const photos = config.gallery
  const [active, setActive] = useState<number | null>(null)

  const close = () => setActive(null)
  const go = (dir: number) =>
    setActive((cur) => (cur === null ? null : (cur + dir + photos.length) % photos.length))

  // Keyboard controls + scroll-lock while the lightbox is open.
  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Picture Perfect"
        title="A Little Gallery"
        subtitle="Tap any photo to take a closer look. (Swap these out for your own!)"
      />

      {/* Masonry via CSS columns */}
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {photos.map((photo, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="group block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-[0_12px_30px_-14px_rgba(186,120,175,0.6)] focus:outline-none focus-visible:ring-4 focus-visible:ring-rose/40"
          >
            <div className="relative overflow-hidden">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute right-3 bottom-3 translate-y-2 text-xl opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                🔍
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl text-ink shadow-lg transition hover:scale-110"
            >
              ✕
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              aria-label="Previous"
              className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl text-ink shadow-lg transition hover:scale-110 sm:left-8"
            >
              ‹
            </button>

            <motion.img
              key={active}
              src={photos[active].src}
              alt={photos[active].alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(1) }}
              aria-label="Next"
              className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl text-ink shadow-lg transition hover:scale-110 sm:right-8"
            >
              ›
            </button>

            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-ink shadow">
              {active + 1} / {photos.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
