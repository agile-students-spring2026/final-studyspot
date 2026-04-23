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
import SavedSpot from '../models/SavedSpot.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me/saved — return all saved spots for the current user
router.get('/me/saved', authMiddleware, async (req, res) => {
  try {
    const savedDocs = await SavedSpot.find({ userId: req.userId });
    const savedIds = savedDocs.map(doc => doc.spotId);
    const spots = MOCK_SPOTS.filter(spot => savedIds.includes(spot.id));
    res.json({ savedSpots: spots });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/users/me/saved/:spotId — save a spot for the current user
router.post('/me/saved/:spotId', authMiddleware, async (req, res) => {
  try {
    const { spotId } = req.params;
    const spot = MOCK_SPOTS.find(s => s.id === spotId);
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found.' });
    }
    const already = await SavedSpot.findOne({ userId: req.userId, spotId });
    if (already) {
      return res.status(409).json({ error: 'Spot already saved.' });
    }
    await SavedSpot.create({ userId: req.userId, spotId });
    res.json({ message: 'Spot saved.', spot });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/users/me/saved/:spotId — remove a saved spot
router.delete('/me/saved/:spotId', authMiddleware, async (req, res) => {
  try {
    const { spotId } = req.params;
    const result = await SavedSpot.findOneAndDelete({ userId: req.userId, spotId });
    if (!result) {
      return res.status(404).json({ error: 'Saved spot not found.' });
    }
    res.json({ message: 'Spot removed from saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
