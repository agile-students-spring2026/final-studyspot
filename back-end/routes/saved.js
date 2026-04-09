/**
 * routes/saved.js
 *
 * Saved spots routes for the current logged-in user.
 *
 * Routes:
 *   GET    /api/users/me/saved          — get all saved spots for the user
 *   POST   /api/users/me/saved/:spotId  — save a spot
 *   DELETE /api/users/me/saved/:spotId  — remove a saved spot
 *
 * All routes are protected by authMiddleware.
 */

import express from 'express';
import { MOCK_SPOTS } from '../data/mockSpots.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// In-memory saved spots store: { userId -> Set of spotIds }
const savedSpotsStore = new Map();

// GET /api/users/me/saved — return all saved spots for the current user
router.get('/me/saved', authMiddleware, (req, res) => {
  const spotIds = savedSpotsStore.get(req.userId) || new Set();
  const spots = MOCK_SPOTS.filter(spot => spotIds.has(spot.id));
  res.json({ savedSpots: spots });
});

// POST /api/users/me/saved/:spotId — save a spot for the current user
router.post('/me/saved/:spotId', authMiddleware, (req, res) => {
  const { spotId } = req.params;
  const spot = MOCK_SPOTS.find(s => s.id === spotId);
  if (!spot) {
    return res.status(404).json({ error: 'Spot not found.' });
  }
  if (!savedSpotsStore.has(req.userId)) {
    savedSpotsStore.set(req.userId, new Set());
  }
  savedSpotsStore.get(req.userId).add(spotId);
  res.json({ message: 'Spot saved.', spot });
});

// DELETE /api/users/me/saved/:spotId — remove a saved spot
router.delete('/me/saved/:spotId', authMiddleware, (req, res) => {
  const { spotId } = req.params;
  const spotIds = savedSpotsStore.get(req.userId);
  if (!spotIds || !spotIds.has(spotId)) {
    return res.status(404).json({ error: 'Saved spot not found.' });
  }
  spotIds.delete(spotId);
  res.json({ message: 'Spot removed from saved.' });
});

export default router;
