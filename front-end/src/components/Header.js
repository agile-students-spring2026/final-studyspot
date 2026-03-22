import styles from './Header.module.css';

/**
 * Header
 * Props:
 *   (none — static app header with StudySpot logo)
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoBlock}>
        <span className={styles.logoMark}>S</span>
        <h1 className={styles.logoText}>StudySpot</h1>
      </div>
    </header>
  );
}
