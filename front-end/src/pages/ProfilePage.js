import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import styles from './ProfilePage.module.css';

// Mock user data (will be added in backend sprint)
const mockUser = {
    name: 'Name',
    email: 'yourname@university.edu',
    image: 'https://picsum.photos/seed/user1/150/150',
};

export default function ProfilePage() {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    function handleDeleteAccount() {
        // TODO: call delete API
        console.log('Account deleted');
        setShowConfirm(false);
        navigate('/login');
    }

    function handleLogout() {
        // TODO: clear auth and redirect to login
        console.log('Logging out user...');
        navigate('/login');
    }

    return (
        <div className={styles.page}>
        <header className={styles.header}>
            <h1 className={styles.logo}>StudySpot</h1>
        </header>

        <h2 className={styles.title}>My Profile</h2>

        <div className={styles.profileSection}>
            <img src={mockUser.image} alt="Profile" className={styles.profileImage} />
            <h3 className={styles.userName}>{mockUser.name}</h3>
            <p className={styles.userEmail}>{mockUser.email}</p>
        </div>

        <nav className={styles.menu}>
            <Link to="/profile/edit" className={styles.menuItem}>Edit Profile</Link>
            <Link to="/saved" className={styles.menuItem}>Saved Spots</Link>
            <span className={styles.menuItem}>Notifications</span>
            <span className={styles.menuItem}>About / Help</span>
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