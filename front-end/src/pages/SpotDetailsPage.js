import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import styles from './SpotDetailsPage.module.css';

/* ─────────────────────────────────────────────────────────────────────────────
 * SpotDetailsPage
 *
 * Expects location.state.spot (passed from SpotListPage via <Link state=...>).
 * Falls back to MOCK_SPOT so the page works standalone during development.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MOCK_SPOT = {
  id: '1',
  name: 'Bobst Library — 3rd Floor',
  building: 'Bobst Library',
  address: '70 Washington Square S',
  rating: 4.3,
  reviewCount: 84,
  busyness: 65,          // percent 0–100
  busynessLabel: 'Moderate',
  description:
    'Bright, open floor with plenty of table seating and individual carrels. ' +
    'Great natural light from the atrium. Gets busy around midterms but the ' +
    'upper mezzanine usually has open spots.',
  amenities: ['Outlets', 'Strong WiFi', 'Quiet Zone', 'Accessible'],
  hours: [
    { day: 'Mon – Thu', time: '8:00 AM – 2:00 AM' },
    { day: 'Friday',    time: '8:00 AM – 10:00 PM' },
    { day: 'Saturday',  time: '10:00 AM – 10:00 PM' },
    { day: 'Sunday',    time: '10:00 AM – 2:00 AM' },
  ],
  imageUrl: null,   // replace with real URL or import when images are available
};

const BUSYNESS_LEVELS = ['Empty', 'Light', 'Moderate', 'Packed'];

export default function SpotDetailsPage() {
  const navigate           = useNavigate();
  const location           = useLocation();
  const spot               = location.state?.spot ?? MOCK_SPOT;

  const [saved, setSaved]               = useState(false);
  const [busyness, setBusyness]         = useState(spot.busyness);
  const [showBusyness, setShowBusyness] = useState(false);
  const [showRate, setShowRate]         = useState(false);

  // Busyness overlay state
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Rate overlay state
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewText, setReviewText]   = useState('');

  /* ── Helpers ── */
  function handleBusynessSubmit() {
    if (selectedLevel === null) return;
    const newPct = [5, 35, 65, 95][selectedLevel];   // map label → %
    setBusyness(newPct);
    // TODO: call API to update busyness
    setShowBusyness(false);
    setSelectedLevel(null);
  }

  function handleRateSubmit() {
    if (!selectedStar) return;
    // TODO: call API to submit review
    console.log('Review submitted', { stars: selectedStar, text: reviewText });
    setShowRate(false);
    setSelectedStar(0);
    setReviewText('');
  }

  /* ── Render ── */
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        {spot.imageUrl
          ? <img src={spot.imageUrl} alt={spot.name} className={styles.heroImg} />
          : <div className={styles.heroPlaceholder}>No photo yet</div>
        }
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeftIcon />
        </button>
      </div>

      {/* Main content */}
      <div className={styles.content}>

        {/* Title + Save */}
        <div className={styles.titleRow}>
          <h1 className={styles.spotName}>{spot.name}</h1>
          <button
            className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
            onClick={() => {
              setSaved(v => !v);
              // TODO: call API to save/unsave
            }}
          >
            <BookmarkIcon filled={saved} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Location + hours preview */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}><PinIcon /> {spot.address}</span>
          <span className={styles.metaItem}><ClockIcon /> {spot.hours[0].time}</span>
        </div>

        {/* Rating row */}
        <div className={styles.ratingRow}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(n => (
                <StarIcon key={n} filled={n <= Math.round(spot.rating)} />
              ))}
            </div>
            <span className={styles.ratingText}>
              {spot.rating.toFixed(1)} · {spot.reviewCount} reviews
            </span>
          </div>
          <button className={styles.rateBtn} onClick={() => setShowRate(true)}>
            Rate Spot
          </button>
        </div>

        {/* Busyness */}
        <div className={styles.busynessSection}>
          <div className={styles.busynessHeader}>
            <span className={styles.sectionLabel}>Current Busyness</span>
            <button className={styles.updateBtn} onClick={() => setShowBusyness(true)}>
              Update
            </button>
          </div>
          <div className={styles.busynessTrack}>
            <div className={styles.busynessFill} style={{ width: `${busyness}%` }} />
          </div>
          <span className={styles.busynessNote}>
            {busyness < 30 ? 'Very quiet right now'
              : busyness < 55 ? 'A few people around'
              : busyness < 80 ? 'Moderate traffic'
              : 'Very busy — hard to find a seat'}
          </span>
        </div>

        {/* Amenities */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <p className={styles.sectionLabel}>Amenities</p>
          <div className={styles.amenities}>
            {spot.amenities.map(a => (
              <span key={a} className={styles.chip}>{a}</span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className={styles.descSection}>
          <p className={styles.sectionLabel}>About</p>
          <p className={styles.desc}>{spot.description}</p>
        </div>

        {/* Hours */}
        <div className={styles.hoursSection}>
          <p className={styles.sectionLabel}>Hours</p>
          <div className={styles.hoursGrid}>
            {spot.hours.map(h => (
              <>
                <span key={h.day + '-day'} className={styles.hoursDay}>{h.day}</span>
                <span key={h.day + '-time'} className={styles.hoursTime}>{h.time}</span>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* ── Busyness overlay ── */}
      {showBusyness && (
        <div className={styles.overlay} onClick={() => setShowBusyness(false)}>
          <div className={styles.overlayCard} onClick={e => e.stopPropagation()}>
            <h2 className={styles.overlayTitle}>How busy is it right now?</h2>
            <div className={styles.levelGrid}>
              {BUSYNESS_LEVELS.map((label, i) => (
                <button
                  key={label}
                  className={`${styles.levelBtn} ${selectedLevel === i ? styles.levelBtnActive : ''}`}
                  onClick={() => setSelectedLevel(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={styles.overlayActions}>
              <Button variant="secondary" onClick={() => setShowBusyness(false)}>Cancel</Button>
              <Button disabled={selectedLevel === null} onClick={handleBusynessSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rate overlay ── */}
      {showRate && (
        <div className={styles.overlay} onClick={() => setShowRate(false)}>
          <div className={styles.overlayCard} onClick={e => e.stopPropagation()}>
            <h2 className={styles.overlayTitle}>Rate this spot</h2>

            {/* Star picker */}
            <div className={styles.starPicker}>
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  style={{ opacity: n <= (hoveredStar || selectedStar) ? 1 : 0.25, transition: 'opacity 0.1s' }}
                  onMouseEnter={() => setHoveredStar(n)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedStar(n)}
                >★</span>
              ))}
            </div>

            <textarea
              className={styles.reviewTextarea}
              placeholder="Share what you liked or didn't like (optional)"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              maxLength={500}
            />

            <div className={styles.overlayActions}>
              <Button variant="secondary" onClick={() => setShowRate(false)}>Cancel</Button>
              <Button disabled={!selectedStar} onClick={handleRateSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Inline icon components ── */
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}