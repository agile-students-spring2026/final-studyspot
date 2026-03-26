import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import styles from './ProfilePage.module.css';

// Mock user data (will be added in backend sprint)
const mockUser = {
    name: 'Name',
    email: 'yourname@university.edu',
    image: 'https://picsum.photos/seed/user1/150/150',
};

export default function ProfilePage() {
    const navigate = useNavigate();
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
            <span className={styles.menuItem}>Edit Profile</span>
            <Link to="/saved" className={styles.menuItem}>Saved Spots</Link>
            <span className={styles.menuItem}>Notifications</span>
            <span className={styles.menuItem}>About / Help</span>
            <button className={styles.menuItem} onClick={handleLogout}>Log Out</button>
        </nav>

        <BottomNav />
        </div>
    );
}