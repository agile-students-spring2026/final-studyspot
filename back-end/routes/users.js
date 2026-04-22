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
import { MOCK_USERS } from '../data/mockUsers.js';
import { destroySession } from '../utils/session.js';
import authMiddleware from '../middleware/auth.js';
import Review from '../models/Review.js';
import SavedSpot from '../models/SavedSpot.js';

const router = express.Router();

// GET /api/users/me — return current user's profile
router.get('/me', authMiddleware, (req, res) => {
  const user = MOCK_USERS.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
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

router.put('/me', authMiddleware, updateValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = MOCK_USERS.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

// DELETE /api/users/me — delete current user's account and all related data
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const index = MOCK_USERS.findIndex(u => u.id === req.userId);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Data cleanup — remove all data associated with this user
    await Review.deleteMany({ userId: req.userId });
    await SavedSpot.deleteMany({ userId: req.userId });

    // Remove user from mock store
    // TODO: replace with User.findByIdAndDelete(req.userId) in JWT sprint
    MOCK_USERS.splice(index, 1);

    res.json({ message: 'Account and all associated data deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

export default router;