import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';
import styles from './SavedSpotsPage.module.css';

// Mock data (will be added in backend sprint)
const mockSavedSpots = [
{
    id: 1,
    name: 'Study Location 1',
    rating: 3.5,
    reviews: 23,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/seed/spot1/400/200',
},
{
    id: 2,
    name: 'Study Location 2',
    rating: 4.8,
    reviews: 58,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    image: 'https://picsum.photos/seed/spot2/400/200',
},
];

export default function SavedSpotsPage() {
const [savedSpots, setSavedSpots] = useState(mockSavedSpots);
const [showConfirm, setShowConfirm] = useState(null);  // holds spot id
const [showSuccess, setShowSuccess] = useState(false);

function handleRemove(spotId) {
    setSavedSpots(savedSpots.filter(spot => spot.id !== spotId));
    setShowConfirm(null);
    setShowSuccess(true);
}

return (
<div className={styles.page}>
    <header className={styles.header}>
    <h1 className={styles.logo}>StudySpot</h1>
    </header>

    <h2 className={styles.title}>Saved Spots</h2>

    <div className={styles.spotsList}>
    {savedSpots.map(spot => (
        <div key={spot.id} className={styles.card}>
        <div className={styles.cardHeader}>
            <h3 className={styles.spotName}>{spot.name}</h3>
            <p className={styles.spotMeta}>Rating {spot.rating}/5 - {spot.reviews} reviews</p>
        </div>
        <img src={spot.image} alt={spot.name} className={styles.spotImage} />
        <p className={styles.spotDescription}>{spot.description}</p>
        <Button variant="secondary" onClick={() => setShowConfirm(spot.id)}>
            Remove from Saved Spots
        </Button>
        </div>
    ))}
    </div>

    {/* Bottom Navigation */}
    <BottomNav />

    {/* Remove Confirmation Overlay */}
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