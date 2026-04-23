import { useState, useEffect } from 'react';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';
import styles from './SavedSpotsPage.module.css';

export default function SavedSpotsPage() {
    const [savedSpots, setSavedSpots] = useState([]);
    const [showConfirm, setShowConfirm] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        fetch('/api/users/me/saved', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.ok ? res.json() : { savedSpots: [] })
            .then(data => setSavedSpots(data.savedSpots || []))
            .catch(() => setSavedSpots([]))
            .finally(() => setLoading(false));
    }, []);

    async function handleRemove(spotId) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`/api/users/me/saved/${spotId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // continue regardless
        }
        setSavedSpots(prev => prev.filter(spot => (spot._id || spot.id) !== spotId));
        setShowConfirm(null);
        setShowSuccess(true);
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
            <h1 className={styles.logo}>StudySpot</h1>
            </header>

            <h2 className={styles.title}>Saved Spots</h2>

            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

            {!loading && savedSpots.length === 0 && (
                <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                    No saved spots yet. Save a spot from its details page!
                </p>
            )}

            <div className={styles.spotsList}>
            {savedSpots.map(spot => {
                const id = spot._id || spot.id;
                return (
                    <div key={id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.spotName}>{spot.name}</h3>
                        <p className={styles.spotMeta}>
                            {spot.rating ? `Rating ${spot.rating}/5` : ''}
                            {spot.reviewCount ? ` - ${spot.reviewCount} reviews` : ''}
                        </p>
                    </div>
                    {spot.image && <img src={spot.image} alt={spot.name} className={styles.spotImage} />}
                    {spot.description && <p className={styles.spotDescription}>{spot.description}</p>}
                    <Button variant="secondary" onClick={() => setShowConfirm(id)}>
                        Remove from Saved Spots
                    </Button>
                    </div>
                );
            })}
            </div>

            <BottomNav />

            {showConfirm && (
            <div className={styles.overlay}>
              <div className={styles.modal}>
                <p className={styles.modalText}>
                  Are you sure you want to remove this spot?
                </p>
                <Button onClick={() => handleRemove(showConfirm)}>Remove</Button>
                <button className={styles.cancelBtn} onClick={() => setShowConfirm(null)}>
                  Cancel
                </button>
              </div>
            </div>
            )}
        </div>
    );
}
