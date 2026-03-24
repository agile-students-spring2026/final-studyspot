import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import styles from './SpotListPage.module.css';

const FILTER_OPTIONS = [
  { key: 'quiet', label: 'Quiet' },
  { key: 'outlets', label: 'Has outlets' },
  { key: 'group', label: 'Group-friendly' },
];

const MOCK_SPOTS = [
  {
    id: '1',
    name: 'Bobst Library — 3rd Floor',
    building: 'Bobst Library',
    address: '70 Washington Square S',
    rating: 4.3,
    reviewCount: 84,
    busyness: 65,
    busynessLabel: 'Moderate',
    description:
      'Bright, open floor with plenty of table seating and individual carrels. Great natural light from the atrium.',
    amenities: ['Outlets', 'Strong WiFi', 'Quiet Zone', 'Accessible'],
    hours: [
      { day: 'Mon – Thu', time: '8:00 AM – 2:00 AM' },
      { day: 'Friday', time: '8:00 AM – 10:00 PM' },
      { day: 'Saturday', time: '10:00 AM – 10:00 PM' },
      { day: 'Sunday', time: '10:00 AM – 2:00 AM' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot1/600/300',
  },
  {
    id: '2',
    name: 'Kimmel Center — 4th Floor Lounge',
    building: 'Kimmel Center',
    address: '60 Washington Square S',
    rating: 3.8,
    reviewCount: 42,
    busyness: 40,
    busynessLabel: 'Light',
    description:
      'Comfortable lounge seating with a quieter vibe. Good for group work or solo reading between classes.',
    amenities: ['Outlets', 'WiFi', 'Group Tables'],
    hours: [
      { day: 'Mon – Fri', time: '7:00 AM – 11:00 PM' },
      { day: 'Sat – Sun', time: '9:00 AM – 9:00 PM' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot2/600/300',
  },
  {
    id: '3',
    name: 'Tandon MakerSpace',
    building: 'Dibner Library',
    address: '5 MetroTech Center',
    rating: 4.6,
    reviewCount: 61,
    busyness: 80,
    busynessLabel: 'Packed',
    description:
      'Open workspace with 3D printers and whiteboards. Great for engineering projects, but it can get loud.',
    amenities: ['Outlets', 'Strong WiFi', 'Whiteboards', '3D Printers'],
    hours: [
      { day: 'Mon – Fri', time: '9:00 AM – 10:00 PM' },
      { day: 'Saturday', time: '10:00 AM – 6:00 PM' },
      { day: 'Sunday', time: 'Closed' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot3/600/300',
  },
  {
    id: '4',
    name: 'Weinstein Study Room',
    building: 'Weinstein Hall',
    address: '5 University Pl',
    rating: 3.5,
    reviewCount: 23,
    busyness: 20,
    busynessLabel: 'Empty',
    description:
      'Small, quiet study room in the residence hall basement. Often overlooked — a hidden gem during exams.',
    amenities: ['Outlets', 'WiFi', 'Quiet Zone'],
    hours: [
      { day: 'Mon – Sun', time: '24 Hours' },
    ],
    imageUrl: 'https://picsum.photos/seed/spot4/600/300',
  },
];


export default function SpotListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [savedSpots, setSavedSpots] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  function toggleSave(spotId) {
    setSavedSpots(prev =>
      prev.includes(spotId) ? prev.filter(id => id !== spotId) : [...prev, spotId]
    );
  }
function toggleFilter(filterKey) {
  setActiveFilters(prev =>
    prev.includes(filterKey)
      ? prev.filter(key => key !== filterKey)
      : [...prev, filterKey]
  );
}

function matchesFilter(spot, filterKey) {
  switch (filterKey) {
    case 'quiet':
      return spot.amenities.includes('Quiet Zone') || spot.busyness <= 40;
    case 'outlets':
      return spot.amenities.includes('Outlets');
    case 'group':
      return (
        spot.amenities.includes('Group Tables') ||
        spot.amenities.includes('Whiteboards')
      );
    default:
      return true;
  }
}


  const filtered = MOCK_SPOTS.filter(spot => {
  const matchesSearch =
    spot.name.toLowerCase().includes(search.toLowerCase()) ||
    spot.building.toLowerCase().includes(search.toLowerCase());

  const matchesActiveFilters = activeFilters.every(filterKey =>
    matchesFilter(spot, filterKey)
  );

  return matchesSearch && matchesActiveFilters;
});

  return (
    <div className={styles.page}>
      <Header />

      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
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
        {filtered.length === 0 && (
          <p className={styles.empty}>No spots match your search or filters.</p>
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
