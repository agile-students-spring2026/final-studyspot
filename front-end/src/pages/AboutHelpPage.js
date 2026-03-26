import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import styles from './AboutHelpPage.module.css';

export default function AboutHelpPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profile')}>
          ← Back
        </button>
        <h1 className={styles.headerTitle}>About / Help</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What is StudySpot?</h2>
          <p className={styles.sectionText}>
            StudySpot is a community-driven app that helps students find the best places to study on campus. Browse study spaces, read reviews from fellow students, and save your favorite spots all in one place.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to Use</h2>
          <p className={styles.sectionText}>
            Browse study spaces from the Spots tab, filter by noise level, outlets, and more. Tap any spot to see details and reviews. Save spots you like so you can find them quickly later.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact & Support</h2>
          <p className={styles.sectionText}>
            Have a question or found an issue? Reach out to us and we will get back to you as soon as possible.
          </p>
          <a href="mailto:support@studyspot.app" className={styles.email}>
            support@studyspot.app
          </a>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Version</h2>
          <p className={styles.sectionText}>StudySpot v1.0.0</p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
