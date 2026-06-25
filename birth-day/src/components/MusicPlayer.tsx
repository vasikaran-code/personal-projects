import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { config } from '../config'
import Section, { SectionHeading } from './Section'

export default function MusicPlayer() {
  const { title, artist, src, cover } = config.music
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () =>
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  // Try to autoplay once. Browsers block this until a user gesture, so if the
  // first attempt is rejected we start on the very first tap/scroll/keypress.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return

    let started = false
    const start = () => {
      if (started) return
      started = true
      audio.play().then(() => setPlaying(true)).catch(() => { started = false })
    }

    audio.play().then(
      () => setPlaying(true),
      () => {
        // Autoplay blocked — wait for the first interaction, then play once.
        const onGesture = () => {
          start()
          remove()
        }
        const remove = () => {
          window.removeEventListener('pointerdown', onGesture)
          window.removeEventListener('keydown', onGesture)
          window.removeEventListener('scroll', onGesture)
          window.removeEventListener('touchstart', onGesture)
        }
        window.addEventListener('pointerdown', onGesture, { once: true })
        window.addEventListener('keydown', onGesture, { once: true })
        window.addEventListener('scroll', onGesture, { once: true, passive: true })
        window.addEventListener('touchstart', onGesture, { once: true, passive: true })
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio || !src) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  return (
    <Section id="music">
      <SectionHeading
        eyebrow="Press Play"
        title="A Song For You"
        subtitle="Something to set the mood."
      />

      <div className="glass mx-auto flex max-w-md flex-col items-center gap-6 rounded-[2rem] p-8 sm:flex-row sm:items-center sm:gap-7">
        {/* Spinning album art */}
        <motion.div
          className="relative h-32 w-32 shrink-0"
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            playing
              ? { duration: 8, repeat: Infinity, ease: 'linear' }
              : { duration: 0.6 }
          }
        >
          <img
            src={cover}
            alt="Album cover"
            className="h-full w-full rounded-full object-cover shadow-lg ring-4 ring-white/70"
          />
          <span className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 ring-2 ring-pink-deep/40" />
        </motion.div>

        <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
            <p className="text-sm text-ink-soft">{artist}</p>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose to-lavender-deep transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={toggle}
              disabled={!src}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.06 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose to-pink-deep text-2xl text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? '❚❚' : '►'}
            </motion.button>

            {/* Equalizer bars */}
            <div className="flex items-end gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-rose/70"
                  animate={
                    playing ? { height: ['6px', '20px', '10px', '18px', '6px'] } : { height: '6px' }
                  }
                  transition={
                    playing
                      ? { duration: 0.9, repeat: Infinity, delay: i * 0.12 }
                      : { duration: 0.3 }
                  }
                />
              ))}
            </div>
          </div>

          {!src && (
            <p className="text-xs text-ink-soft/80">
              Add a song path in <code className="rounded bg-white/60 px-1">config.ts</code> to enable.
            </p>
          )}
        </div>

        {src && <audio ref={audioRef} src={src} preload="none" />}
      </div>
    </Section>
  )
}
