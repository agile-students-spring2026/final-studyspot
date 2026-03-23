import { Link, useNavigate } from 'react-router-dom';
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
            <Link to="/edit-profile" className={styles.menuItem}>Edit Profile</Link>
            <Link to="/saved" className={styles.menuItem}>Saved Spots</Link>
            <Link to="/notifications" className={styles.menuItem}>Notifications</Link>
            <Link to="/about" className={styles.menuItem}>About / Help</Link>
            <button className={styles.menuItem} onClick={handleLogout}>Log Out</button>
        </nav>

        <nav className={styles.bottomNav}>
            <Link to="/spots" className={styles.navItem}>Spots</Link>
            <Link to="/saved" className={styles.navItem}>Saved</Link>
            <Link to="/add" className={styles.navItem}>Add</Link>
            <Link to="/profile" className={`${styles.navItem} ${styles.active}`}>Profile</Link>
        </nav>
        </div>
    );
}