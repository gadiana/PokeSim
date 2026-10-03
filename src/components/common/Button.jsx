// Reusable semantic button; `variant` maps to a style in styles/base.css.

export default function Button({ className = '', variant = 'default', type = 'button', children, ...props }) {
  return <button className={`button button-${variant} ${className}`.trim()} type={type} {...props}>{children}</button>
}
