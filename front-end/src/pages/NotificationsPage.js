import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    fetch('/api/users/me/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : { notifications: [] })
      .then(data => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));

    // Mark all as read
    fetch('/api/users/me/notifications/read-all', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});

    localStorage.setItem('hasUnreadNotifications', 'false');
  }, []);

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profile')}>
          ← Back
        </button>
        <h1 className={styles.headerTitle}>Notifications</h1>
      </header>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
          No notifications yet.
        </p>
      )}

      <div className={styles.list}>
        {notifications.map(notif => (
          <div key={notif._id} className={notif.read ? styles.item : styles.itemUnread}>
            <p className={styles.text}>{notif.text}</p>
            <p className={styles.time}>{timeAgo(notif.createdAt)}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
