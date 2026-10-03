// Accessible modal shell: dimmed backdrop, dialog semantics, Escape/backdrop to close, and focus on open.

import { useEffect, useRef } from 'react'

export default function Modal({ label, className = '', backdropClassName = '', onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.focus()
    if (!onClose) return undefined
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return <div className={`modal-backdrop ${backdropClassName}`.trim()} role="presentation" onMouseDown={onClose}>
    <section ref={dialogRef} tabIndex={-1} className={className} role="dialog" aria-modal="true" aria-label={label} onMouseDown={(event) => event.stopPropagation()}>
      {children}
    </section>
  </div>
}
