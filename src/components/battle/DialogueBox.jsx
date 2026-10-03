// Game-style text box. Shows one message with a typewriter effect; tap/click or wait to advance.

import { useEffect } from 'react'
import { BATTLE_TIMINGS } from '../../constants/battleConfig'
import { useTypewriter } from '../../hooks/useTypewriter'

function DialogueLine({ message, onAdvance }) {
  const { visibleText, done, complete } = useTypewriter(message.text, BATTLE_TIMINGS.typewriterStep)

  useEffect(() => {
    if (!done) return undefined
    const timer = window.setTimeout(() => onAdvance(message.id), BATTLE_TIMINGS.dialogueAdvance)
    return () => window.clearTimeout(timer)
  }, [done, message.id, onAdvance])

  const onClick = () => (done ? onAdvance(message.id) : complete())

  return <button className="dialogue-box is-message" type="button" onClick={onClick} aria-label={`${message.text} Continue`}>
    <span className="dialogue-text" aria-hidden="true">{visibleText}</span>
    {done && <span className="dialogue-next" aria-hidden="true">▼</span>}
  </button>
}

export default function DialogueBox({ message, idleText, onAdvance }) {
  return <div className="dialogue-wrap">
    <p className="visually-hidden" aria-live="polite">{message?.text || idleText}</p>
    {message
      ? <DialogueLine key={message.id} message={message} onAdvance={onAdvance} />
      : <div className="dialogue-box is-idle" aria-hidden="true"><span className="dialogue-text">{idleText}</span></div>}
  </div>
}
