// Smoothly tweens a displayed number toward a target value over a fixed duration (used by HP bars).

import { useEffect, useRef, useState } from 'react'

const easeOut = (progress) => 1 - (1 - progress) ** 2

export function useAnimatedNumber(target, duration) {
  const [value, setValue] = useState(target)
  const valueRef = useRef(target)

  useEffect(() => {
    const start = valueRef.current
    if (start === target) return undefined
    const startTime = performance.now()
    let frame = 0
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const next = start + (target - start) * easeOut(progress)
      valueRef.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
