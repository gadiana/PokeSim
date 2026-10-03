// Detects a touch long-press: exposes `pressed` while held past the delay and swallows the click that follows.

import { useCallback, useRef, useState } from 'react'

export function useLongPress(delayMs) {
  const [pressed, setPressed] = useState(false)
  const timer = useRef(0)
  const triggered = useRef(false)

  const cancel = useCallback(() => {
    window.clearTimeout(timer.current)
    setPressed(false)
  }, [])

  const handlers = {
    onPointerDown: (event) => {
      if (event.pointerType === 'mouse') return
      triggered.current = false
      timer.current = window.setTimeout(() => { triggered.current = true; setPressed(true) }, delayMs)
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (event) => { if (triggered.current) event.preventDefault() },
  }

  /** Returns true (once) if the current click is the tail of a long-press and should be ignored. */
  const consumeLongPress = () => {
    const wasLongPress = triggered.current
    triggered.current = false
    return wasLongPress
  }

  return { pressed, handlers, consumeLongPress }
}
