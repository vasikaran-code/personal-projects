import { useEffect, useRef, useState } from 'react'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Types out an array of lines one character at a time.
 * Pass `start = false` to hold until the element scrolls into view.
 */
export function useTypewriter(lines: string[], start: boolean, speed = 38) {
  const [output, setOutput] = useState<string[]>(() => lines.map(() => ''))
  const [done, setDone] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!start || startedRef.current) return
    startedRef.current = true

    let line = 0
    let char = 0
    let timer: ReturnType<typeof setTimeout>

    if (reduceMotion()) {
      timer = setTimeout(() => {
        setOutput(lines)
        setDone(true)
      }, 0)
      return () => clearTimeout(timer)
    }

    const tick = () => {
      if (line >= lines.length) {
        setDone(true)
        return
      }
      const current = lines[line]
      char += 1
      setOutput((prev) => {
        const next = [...prev]
        next[line] = current.slice(0, char)
        return next
      })
      if (char >= current.length) {
        line += 1
        char = 0
        timer = setTimeout(tick, 360) // pause between lines
      } else {
        timer = setTimeout(tick, speed)
      }
    }

    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  return { output, done }
}
