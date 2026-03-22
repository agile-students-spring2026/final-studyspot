import styles from './Button.module.css';

/**
 * Button
 * Props:
 *   variant  – 'primary' (default) | 'secondary' | 'compact' | 'compactOutline'
 *   disabled – boolean
 *   onClick  – handler
 *   type     – 'button' (default) | 'submit'
 *   children – label text / content
 */
export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  style,
}) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}