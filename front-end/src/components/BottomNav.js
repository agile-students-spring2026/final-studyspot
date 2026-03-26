import { Link, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

/**
 * BottomNav
 * Props:
 *   (none — reads current route via useLocation to highlight active tab)
 */

const NAV_ITEMS = [
  { path: '/spots',    label: 'Spots',   icon: SpotsIcon },
  { path: '/saved',    label: 'Saved',   icon: BookmarkIcon },
  { path: '/add-spot', label: 'Add',     icon: PlusIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <Icon />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Inline icon components ── */
function SpotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
