import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import { MOCK_SPOTS } from '../data/mockSpots';
import styles from './SpotListPage.module.css';

export default function SpotListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [savedSpots, setSavedSpots] = useState([]);

  function toggleSave(spotId) {
    setSavedSpots(prev =>
      prev.includes(spotId) ? prev.filter(id => id !== spotId) : [...prev, spotId]
    );
  }

  const filtered = MOCK_SPOTS.filter(spot =>
    spot.name.toLowerCase().includes(search.toLowerCase()) ||
    spot.building.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <Header />

      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className={styles.list}>
        {filtered.length === 0 && (
          <p className={styles.empty}>No spots match your search.</p>
        )}
        {filtered.map(spot => (
          <div key={spot.id} className={styles.card}>
            <div className={styles.cardTop}>
              <h2 className={styles.cardTitle}>{spot.name}</h2>
              <p className={styles.cardSubtitle}>{spot.building} · {spot.address}</p>
            </div>
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className={styles.cardImg}
            />
            <div className={styles.cardBody}>
              <p className={styles.cardDesc}>{spot.description}</p>
              <div className={styles.cardActions}>
                <Button
                  variant="compactOutline"
                  onClick={() => toggleSave(spot.id)}
                >
                  <BookmarkIcon filled={savedSpots.includes(spot.id)} />
                  {savedSpots.includes(spot.id) ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="compact"
                  onClick={() => navigate(`/spots/${spot.id}`, { state: { spot } })}
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

/* ── Inline icon components ── */
function BookmarkIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
