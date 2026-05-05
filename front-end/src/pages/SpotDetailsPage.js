import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Button from '../components/Button';
import { BUSYNESS_LEVELS } from '../data/mockSpots';
import styles from './SpotDetailsPage.module.css';


/* ─────────────────────────────────────────────────────────────────────────────
 * SpotDetailsPage
 *
 * Uses location.state.spot when available, but also fetches the real spot
 * from the backend so the page stays in sync after refresh and persists
 * Mongo-backed updates correctly.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const INITIAL_BOBST_AREAS = [
  {
    name: '1st Floor',
    description: 'More social and better for quick meetups or short study blocks.',
    tags: ['Social', 'Quick stop'],
    current: 'Busy',
  },
  {
    name: '3rd–4th Floors',
    description: 'Usually quieter and better for solo focus.',
    tags: ['Quiet', 'Deep focus'],
    current: 'Moderate',
  },
  {
    name: 'LL1',
    description: 'Better for longer sessions, especially if you need outlets nearby.',
    tags: ['Outlets', 'Long session'],
    current: 'Quiet',
  },
  {
    name: 'LL2',
    description: 'More tucked away and quieter for focused work.',
    tags: ['Very quiet', 'Solo study'],
    current: 'Quiet',
  },
  {
    name: 'Group Study Areas',
    description: 'Better for collaborative work and discussion-based studying.',
    tags: ['Group work', 'Collaborative'],
    current: 'Moderate',
  },
];

function mapMicroLocationsToAreas(microLocations = []) {
  if (!Array.isArray(microLocations) || microLocations.length === 0) {
    return INITIAL_BOBST_AREAS;
  }

  return microLocations.map(area => ({
    id: area._id || area.id || area.name,
    name: area.name,
    description: area.description,
    tags: area.tags || [],
    current: area.busynessLabel || area.current || 'Quiet',
  }));
}

export default function SpotDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: spotId } = useParams();

  const initialSpot = location.state?.spot ?? null;
  const [spotData, setSpotData] = useState(initialSpot);
  const spot = spotData;
  const isBobst = (spot?.name || '').toLowerCase().includes('bobst');

  const [saved, setSaved] = useState(false);
  const [busyness, setBusyness] = useState(initialSpot?.busyness ?? 0);
  const [showBusyness, setShowBusyness] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [showSavedOverlay, setShowSavedOverlay] = useState(false);
  const [bobstAreas, setBobstAreas] = useState(mapMicroLocationsToAreas(initialSpot?.microLocations));
  const [showAreaUpdate, setShowAreaUpdate] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedAreaName, setSelectedAreaName] = useState('');
  const [selectedAreaStatus, setSelectedAreaStatus] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [displayRating, setDisplayRating] = useState(initialSpot?.rating ?? 0);
  const [displayReviewCount, setDisplayReviewCount] = useState(initialSpot?.reviewCount ?? 0);

  useEffect(() => {
    const resolvedSpotId = spotId || initialSpot?._id || initialSpot?.id;
    if (!resolvedSpotId) return;

    let ignore = false;

    async function loadSpot() {
      try {
        const response = await fetch(`/api/studyspots/${resolvedSpotId}`);
        if (!response.ok) {
          throw new Error('Failed to load study spot');
        }

        const data = await response.json();
        if (ignore) return;

        setSpotData(data);
        setBusyness(data.busyness ?? 0);
        setDisplayRating(data.rating ?? 0);
        setDisplayReviewCount(data.reviewCount ?? 0);
        setBobstAreas(mapMicroLocationsToAreas(data.microLocations));
      } catch (err) {
        console.warn('Could not load study spot from server:', err);
      }
    }

    loadSpot();

    return () => {
      ignore = true;
    };
  }, [spotId, initialSpot?._id, initialSpot?.id]);

  /* ── Helpers ── */
  async function handleBusynessSubmit() {
    if (selectedLevel === null || !spot) return;

    const newPct = [5, 35, 65, 95][selectedLevel];
    const newLabel = BUSYNESS_LEVELS[selectedLevel];

    try {
      await fetch(`/api/studyspots/${spot._id || spot.id}/busyness`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busyness: newPct, busynessLabel: newLabel }),
      });

      setSpotData(prev => prev ? { ...prev, busyness: newPct, busynessLabel: newLabel } : prev);
    } catch (err) {
      console.warn('Could not update busyness on server:', err);
    }

    setBusyness(newPct);
    setShowBusyness(false);
    setSelectedLevel(null);
  }

  async function handleRateSubmit() {
    if (!selectedStar || !spot) return;

    try {
      await fetch(`/api/studyspots/${spot._id || spot.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedStar, text: reviewText }),
      });

      const updatedSpot = await fetch(`/api/studyspots/${spot._id || spot.id}`).then(r => r.json());
      if (updatedSpot.rating !== undefined) {
        setSpotData(updatedSpot);
        setDisplayRating(updatedSpot.rating);
        setDisplayReviewCount(updatedSpot.reviewCount);
        setBobstAreas(mapMicroLocationsToAreas(updatedSpot.microLocations));
      }
    } catch (err) {
      console.warn('Could not submit review:', err);
    }

    setShowRate(false);
    setSelectedStar(0);
    setReviewText('');
  }

  function handleOpenMaps() {
    if (!spot) return;

    const query = `${spot.name} ${spot.address}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }

  function openAreaUpdate(area) {
    setSelectedAreaId(area.id || '');
    setSelectedAreaName(area.name);
    setSelectedAreaStatus(area.current);
    setShowAreaUpdate(true);
  }

  async function handleAreaUpdateSubmit() {
    if (!selectedAreaStatus || !spot) return;

    try {
      if (selectedAreaId) {
        const response = await fetch(
          `/api/studyspots/${spot._id || spot.id}/micro-locations/${selectedAreaId}/busyness`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ busynessLabel: selectedAreaStatus }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to persist micro-location update');
        }

        const refreshedSpot = await fetch(`/api/studyspots/${spot._id || spot.id}`).then(r => r.json());
        setSpotData(refreshedSpot);
        setBobstAreas(mapMicroLocationsToAreas(refreshedSpot.microLocations));
      } else {
        setBobstAreas(prev =>
          prev.map(area =>
            area.id === selectedAreaId || area.name === selectedAreaName
              ? { ...area, current: selectedAreaStatus }
              : area
          )
        );
      }
    } catch (err) {
      console.warn('Could not update micro-location on server:', err);
    }

    setShowAreaUpdate(false);
    setSelectedAreaId('');
    setSelectedAreaName('');
    setSelectedAreaStatus(null);
  }

  if (!spot) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Loading study spot...</p>
        </div>
      </div>
    );
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
              if (!saved) {
                setSaved(true);
                setShowSavedOverlay(true);
              } else {
                setSaved(false);
              }
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
          <span className={styles.metaItem}><ClockIcon /> {spot.hours[0]?.time}</span>
        </div>

        <div className={styles.directionsRow}>
          <button className={styles.directionsBtn} onClick={handleOpenMaps}>
            <PinIcon /> Get Directions
          </button>
        </div>

        {/* Rating row */}
        <div className={styles.ratingRow}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map(n => (
                <StarIcon key={n} filled={n <= Math.round(displayRating)} />
              ))}
            </div>
            <span className={styles.ratingText}>
              {displayRating.toFixed(1)} · {displayReviewCount} reviews
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

        {isBobst && (
          <div className={styles.microSection}>
            <div className={styles.microHeaderRow}>
              <div>
                <p className={styles.sectionLabel}>Inside Bobst</p>
                <h3 className={styles.microTitle}>Best areas based on how you want to study</h3>
              </div>
              <span className={styles.microBadge}>Pilot</span>
            </div>

            <div className={styles.microCards}>
              {bobstAreas.map(area => (
                <div key={area.id || area.name} className={styles.microCard}>
                  <div className={styles.microTopRow}>
                    <h4 className={styles.microCardTitle}>{area.name}</h4>
                    <div className={styles.microRightSide}>
                      <span className={styles.microStatus}>{area.current}</span>
                      <button
                        className={styles.microUpdateBtn}
                        onClick={() => openAreaUpdate(area)}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <p className={styles.microDesc}>{area.description}</p>
                  <div className={styles.microTags}>
                    {area.tags.map(tag => (
                      <span key={tag} className={styles.microTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAreaUpdate && (
          <div className={styles.overlay} onClick={() => setShowAreaUpdate(false)}>
            <div className={styles.overlayCard} onClick={e => e.stopPropagation()}>
              <h2 className={styles.overlayTitle}>
                How busy is {selectedAreaName} right now?
              </h2>
              <div className={styles.areaStatusGrid}>
                {['Quiet', 'Moderate', 'Busy'].map(status => (
                  <button
                    key={status}
                    className={`${styles.levelBtn} ${selectedAreaStatus === status ? styles.levelBtnActive : ''}`}
                    onClick={() => setSelectedAreaStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className={styles.overlayActions}>
                <Button variant="secondary" onClick={() => setShowAreaUpdate(false)}>Cancel</Button>
                <Button disabled={!selectedAreaStatus} onClick={handleAreaUpdateSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        )}

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
              <div key={h.day} style={{ display: 'contents' }}>
                <span className={styles.hoursDay}>{h.day}</span>
                <span className={styles.hoursTime}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Saved confirmation overlay ── */}
      {showSavedOverlay && (
        <div className={styles.overlay} onClick={() => setShowSavedOverlay(false)}>
          <div className={styles.overlayCard} onClick={e => e.stopPropagation()}>
            <h2 className={styles.overlayTitle}>Saved!</h2>
            <p className={styles.savedMessage}>Added to Saved Spots</p>
            <div className={styles.overlayActions}>
              <Button onClick={() => setShowSavedOverlay(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}

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
            <div className={styles.starPicker}>
              {[1, 2, 3, 4, 5].map(n => (
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
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}