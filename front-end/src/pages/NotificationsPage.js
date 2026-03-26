import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import styles from './NotificationsPage.module.css';

// Mock notifications (will come from back-end later)
const mockNotifications = [
  {
    id: 1,
    text: 'Someone left a review on Bobst Library 3rd Floor.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    text: 'A spot you saved, Kimmel Center Lounge, has a new review.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 3,
    text: 'Welcome to StudySpot! Start exploring study spaces near you.',
    time: '3 days ago',
    read: true,
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();

  // Mark notifications as read when this page is opened
  useEffect(() => {
    localStorage.setItem('hasUnreadNotifications', 'false');
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profile')}>
          ← Back
        </button>
        <h1 className={styles.headerTitle}>Notifications</h1>
      </header>

      <div className={styles.list}>
        {mockNotifications.map(notif => (
          <div key={notif.id} className={notif.read ? styles.item : styles.itemUnread}>
            <p className={styles.text}>{notif.text}</p>
            <p className={styles.time}>{notif.time}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
