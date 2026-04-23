/**
 * routes/users.js
 *
 * Profile routes for the current logged-in user.
 *
 * Routes:
 *   GET    /api/users/me  — get current user's profile
 *   PUT    /api/users/me  — update current user's profile
 *   DELETE /api/users/me  — delete current user's account + all related data
 *
 * All routes are protected by authMiddleware.
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import Review from '../models/Review.js';
import SavedSpot from '../models/SavedSpot.js';

const router = express.Router();

// GET /api/users/me — return current user's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/users/me — update current user's name and email
const updateValidation = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string.')
    .trim()
    .notEmpty().withMessage('Name cannot be empty.'),
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),
];

router.put('/me', authMiddleware, updateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/users/me — delete current user's account and all related data
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Clean up all data associated with this user
    await Review.deleteMany({ userId: req.userId });
    await SavedSpot.deleteMany({ userId: req.userId });

    res.json({ message: 'Account and all associated data deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
