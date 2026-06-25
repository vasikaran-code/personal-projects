import { useMemo } from 'react'

type Floaty = {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  spin: number
  opacity: number
  char: string
}

function build(count: number, chars: string[], sizeRange: [number, number]): Floaty[] {
  return Array.from({ length: count }, (_, i) => {
    // Deterministic pseudo-random so layout is stable across renders.
    const r = (n: number) => {
      const x = Math.sin((i + 1) * 99.13 + n * 7.7) * 10000
      return x - Math.floor(x)
    }
    return {
      left: r(1) * 100,
      size: sizeRange[0] + r(2) * (sizeRange[1] - sizeRange[0]),
      duration: 14 + r(3) * 16,
      delay: r(4) * -30,
      drift: (r(5) - 0.5) * 160,
      spin: (r(6) - 0.5) * 90,
      opacity: 0.35 + r(7) * 0.5,
      char: chars[Math.floor(r(8) * chars.length)],
    }
  })
}

/** Full-page fixed layer of drifting hearts, sparkles, petals and balloons. */
export default function Background() {
  const hearts = useMemo(() => build(14, ['❤️', '💕', '💗', '🩷'], [14, 30]), [])
  const sparkles = useMemo(() => build(16, ['✨', '⭐', '🌟', '·'], [10, 22]), [])
  const petals = useMemo(() => build(10, ['🌸', '🌷', '🍃'], [14, 26]), [])
  const balloons = useMemo(() => build(6, ['🎈'], [28, 46]), [])

  const all = [...sparkles, ...petals, ...hearts, ...balloons]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft glowing blobs */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink/50 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-lavender/50 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-peach/40 blur-3xl" />

      {all.map((f, i) => (
        <span
          key={i}
          className="absolute bottom-[-12vh] select-none will-change-transform"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animation: `float-up ${f.duration}s linear ${f.delay}s infinite`,
            // CSS custom props consumed by the float-up keyframes
            ['--drift' as string]: `${f.drift}px`,
            ['--spin' as string]: `${f.spin}deg`,
            ['--peak-opacity' as string]: f.opacity,
            filter: 'drop-shadow(0 4px 6px rgba(186,120,175,0.18))',
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  )
}
