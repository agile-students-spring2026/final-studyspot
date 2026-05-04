import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import styles from './ProfilePage.module.css';

if (localStorage.getItem('hasUnreadNotifications') === null) {
    localStorage.setItem('hasUnreadNotifications', 'true');
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [hasUnread, setHasUnread] = useState(
        localStorage.getItem('hasUnreadNotifications') === 'true'
    );
    const [user, setUser] = useState({
        name: localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User',
        email: localStorage.getItem('userEmail') || '',
        image: 'https://picsum.photos/seed/user1/150/150',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.user) {
                    setUser(prev => ({
                        ...prev,
                        name: data.user.name || prev.name,
                        email: data.user.email || prev.email,
                        image: data.user.profileImage || prev.image,
                    }));
                }
            })
            .catch(() => {});

        fetch('/api/users/me/notifications', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.ok ? res.json() : { notifications: [] })
            .then(data => {
                const anyUnread = (data.notifications || []).some(n => !n.read);
                setHasUnread(anyUnread);
                localStorage.setItem('hasUnreadNotifications', anyUnread ? 'true' : 'false');
            })
            .catch(() => {});
    }, []);

    function handleDeleteAccount() {
        const token = localStorage.getItem('token');
        fetch('/api/users/me', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }).finally(() => {
            localStorage.clear();
            setShowConfirm(false);
            navigate('/login');
        });
    }

    function handleLogout() {
        const token = localStorage.getItem('token');
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        }).finally(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            navigate('/login');
        });
    }

    return (
        <div className={styles.page}>
        <header className={styles.header}>
            <h1 className={styles.logo}>StudySpot</h1>
        </header>

        <h2 className={styles.title}>My Profile</h2>

        <div className={styles.profileSection}>
            <img src={user.image} alt="Profile" className={styles.profileImage} />
            <h3 className={styles.userName}>{user.name}</h3>
            <p className={styles.userEmail}>{user.email}</p>
        </div>

        <nav className={styles.menu}>
            <Link to="/profile/edit" className={styles.menuItem}>Edit Profile</Link>
            <Link to="/saved" className={styles.menuItem}>Saved Spots</Link>
            <Link to="/notifications" className={styles.menuItem}>
                Notifications {hasUnread && <span className={styles.badge}>●</span>}
            </Link>
            <Link to="/about-help" className={styles.menuItem}>About / Help</Link>
            <button className={styles.menuItem} onClick={handleLogout}>Log Out</button>
            <button className={`${styles.menuItem} ${styles.danger}`} onClick={() => setShowConfirm(true)}>
              Delete Account
            </button>
        </nav>

        {showConfirm && (
            <div className={styles.overlay}>
              <div className={styles.modal}>
                <p className={styles.modalText}>
                  Are you sure you want to delete your account? This cannot be undone.
                </p>
                <Button onClick={handleDeleteAccount}>Confirm</Button>
                <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
        )}

        <BottomNav />
        </div>
    );
}
