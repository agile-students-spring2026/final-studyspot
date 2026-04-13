// Routes for study spot search, filtering, detail retrieval,
// and micro-location busyness updates.
import express from 'express';
import { MOCK_SPOTS } from '../data/mockSpots.js';

const router = express.Router();

function matchesQuietFilter(spot) {
  return (
    spot.noiseLevel?.toLowerCase() === 'quiet' ||
    spot.amenities?.includes('Quiet Zone')
  );
}

function matchesGroupFriendlyFilter(spot) {
  return (
    spot.groupFriendly === true ||
    spot.amenities?.includes('Group Tables')
  );
}

function parseBusynessValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

export function filterSpots(spots, query = {}) {
  let results = [...spots];

  const search = (query.search || '').trim().toLowerCase();
  if (search) {
    results = results.filter(spot => spot.name.toLowerCase().includes(search));
  }

  if (query.quiet === 'true') {
    results = results.filter(matchesQuietFilter);
  }

  if (query.outlets === 'true') {
    results = results.filter(spot => spot.hasOutlets === true);
  }

  if (query.groupFriendly === 'true') {
    results = results.filter(matchesGroupFriendlyFilter);
  }

  return results;
}

// GET /api/studyspots
router.get('/', (req, res) => {
  res.json(filterSpots(MOCK_SPOTS, req.query));
});

// GET /api/studyspots/:spotId
router.get('/:spotId', (req, res) => {
  const spot = MOCK_SPOTS.find(s => s.id === req.params.spotId);

  if (!spot) {
    return res.status(404).json({ error: 'Spot not found.' });
  }

  res.json(spot);
});

// PATCH /api/studyspots/:spotId/micro-locations/:microLocationId/busyness
router.patch('/:spotId/micro-locations/:microLocationId/busyness', (req, res) => {
  const { spotId, microLocationId } = req.params;
  const { busyness, busynessLabel } = req.body;
  const parsedBusyness = parseBusynessValue(busyness);

  const spot = MOCK_SPOTS.find(s => s.id === spotId);
  if (!spot) {
    return res.status(404).json({ error: 'Spot not found.' });
  }

  if (!spot.microLocations) {
    return res.status(404).json({ error: 'No micro-locations found for this spot.' });
  }

  const microLocation = spot.microLocations.find(m => m.id === microLocationId);
  if (!microLocation) {
    return res.status(404).json({ error: 'Micro-location not found.' });
  }

  if (parsedBusyness !== null) {
    microLocation.busyness = parsedBusyness;
  }

  if (parsedBusyness === null && !busynessLabel) {
    return res.status(400).json({
      error: 'Provide a valid busyness value or busyness label.',
    });
  }

  if (busynessLabel) {
    microLocation.busynessLabel = busynessLabel;
  }

  res.json({
    message: 'Micro-location busyness updated.',
    microLocation,
  });
});

export default router;
