import confetti from 'canvas-confetti'

const COLORS = ['#ff8fb3', '#f7567c', '#c5aef7', '#ffb38a', '#fff6ec', '#b07bf0']

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** A gentle confetti shower from the top — used on page load. */
export function softRain(durationMs = 2600) {
  if (prefersReducedMotion()) return
  const end = Date.now() + durationMs
  const frame = () => {
    confetti({
      particleCount: 3,
      startVelocity: 0,
      ticks: 320,
      gravity: 0.55,
      origin: { x: Math.random(), y: -0.05 },
      colors: COLORS,
      scalar: 1.1,
      shapes: ['circle'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

/** A celebratory burst — used when the gift box opens. */
export function burst(origin: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
  if (prefersReducedMotion()) return
  const base = { origin, colors: COLORS, disableForReducedMotion: true }
  confetti({ ...base, particleCount: 120, spread: 70, startVelocity: 45, scalar: 1.1 })
  confetti({ ...base, particleCount: 60, spread: 120, startVelocity: 30, decay: 0.92 })
  setTimeout(
    () => confetti({ ...base, particleCount: 50, spread: 100, startVelocity: 55, scalar: 0.9 }),
    180,
  )
}

/** Two side cannons — used for the big finish. */
export function sideCannons() {
  if (prefersReducedMotion()) return
  const end = Date.now() + 900
  const fire = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
    })
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
    })
    if (Date.now() < end) requestAnimationFrame(fire)
  }
  fire()
}
