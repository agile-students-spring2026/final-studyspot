import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterBottomSheet from '../components/FilterBottomSheet';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import styles from './SpotListPage.module.css';

const FILTER_OPTIONS = [
  { key: 'quiet', label: 'Quiet' },
  { key: 'outlets', label: 'Has outlets' },
  { key: 'groupFriendly', label: 'Group-friendly' },
];

export default function SpotListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [savedSpots, setSavedSpots] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ noiseLevel: '', outlets: '', wifi: '', busyness: '' });

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/users/me/saved', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : { savedSpots: [] })
      .then(data => setSavedSpots((data.savedSpots || []).map(s => s._id || s.id)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    if (activeFilters.includes('quiet')) params.set('quiet', 'true');
    if (activeFilters.includes('outlets')) params.set('outlets', 'true');
    if (activeFilters.includes('groupFriendly')) params.set('groupFriendly', 'true');

    if (filters.noiseLevel) params.set('noiseLevel', filters.noiseLevel);
    if (filters.outlets) params.set('outlets', filters.outlets === 'Yes' ? 'true' : 'false');
    if (filters.wifi) params.set('wifi', filters.wifi === 'Yes' ? 'true' : 'false');
    if (filters.busyness) params.set('busyness', filters.busyness);

    setLoading(true);
    fetch(`/api/studyspots?${params}`, { signal: controller.signal, cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setSpots(data);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, activeFilters, filters]);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  async function toggleSave(spotId) {
    const token = localStorage.getItem('token');
    const isSaved = savedSpots.includes(spotId);
    setSavedSpots(prev =>
      isSaved ? prev.filter(id => id !== spotId) : [...prev, spotId]
    );
    try {
      await fetch(`/api/users/me/saved/${spotId}`, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }

  function toggleFilter(filterKey) {
    setActiveFilters(prev =>
      prev.includes(filterKey)
        ? prev.filter(key => key !== filterKey)
        : [...prev, filterKey]
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFilterClick={() => setFilterOpen(true)}
        filterActive={hasActiveFilters}
      />

      <FilterBottomSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
        initialFilters={filters}
      />

      <div className={styles.filtersSection}>
        <div className={styles.filtersHeader}>
          <p className={styles.filtersTitle}>What do you need right now?</p>
          {activeFilters.length > 0 && (
            <button
              className={styles.clearFiltersBtn}
              onClick={() => setActiveFilters([])}
            >
              Clear
            </button>
          )}
        </div>

        <div className={styles.filterChips}>
          {FILTER_OPTIONS.map(filter => (
            <button
              key={filter.key}
              className={`${styles.filterChip} ${
                activeFilters.includes(filter.key) ? styles.filterChipActive : ''
              }`}
              onClick={() => toggleFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {loading && <p className={styles.empty}>Loading study spots…</p>}
        {error && !loading && (
          <p className={styles.empty}>Could not load study spots: {error}</p>
        )}
        {!loading && !error && spots.length === 0 && (
          <p className={styles.empty}>No spots match your search or filters.</p>
        )}
        {!loading && !error && spots.map(spot => (
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
