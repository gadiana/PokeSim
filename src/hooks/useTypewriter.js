// Reveals text one character at a time. Remount (via `key`) to restart for a new message.

import { useEffect, useState } from 'react'

export function useTypewriter(text, stepMs) {
  const [count, setCount] = useState(0)
  const done = count >= text.length

  useEffect(() => {
    if (done) return undefined
    const timer = window.setTimeout(() => setCount((current) => current + 1), stepMs)
    return () => window.clearTimeout(timer)
  }, [count, done, stepMs])

  return { visibleText: text.slice(0, count), done, complete: () => setCount(text.length) }
}
