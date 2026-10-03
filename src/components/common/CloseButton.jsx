// Small square "×" button used to dismiss modals.

export default function CloseButton({ label, onClick, className = '' }) {
  return <button className={`modal-close ${className}`.trim()} type="button" onClick={onClick} aria-label={label}>×</button>
}
