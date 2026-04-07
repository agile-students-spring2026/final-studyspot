// GET /api/studyspots[?search=<keyword>]
// Name-only, case-insensitive partial match. Empty/missing search → all spots.

import express from 'express';
import { MOCK_SPOTS } from '../data/mockSpots.js';

const router = express.Router();

// Exported for unit tests
export function filterSpotsBySearch(spots, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return spots;
  return spots.filter(spot => spot.name.toLowerCase().includes(q));
}

router.get('/', (req, res) => {
  res.json(filterSpotsBySearch(MOCK_SPOTS, req.query.search));
});

export default router;
