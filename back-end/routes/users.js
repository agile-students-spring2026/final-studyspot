/**
 * routes/users.js
 *
 * Profile routes for the current logged-in user.
 *
 * Routes:
 *   GET  /api/users/me              — get current user's profile
 *   PUT  /api/users/me              — update current user's profile
 *   DELETE /api/users/me            — delete current user's account
 *   POST /api/auth/signout          — log out
 *
 * All routes are protected by authMiddleware.
 */

import express from 'express';
import { MOCK_USERS } from '../data/mockUsers.js';
import { destroySession } from '../utils/session.js';
import authMiddleware from '../middleware/auth.js';

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
router.put('/me', authMiddleware, (req, res) => {
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

// DELETE /api/users/me — delete current user's account
router.delete('/me', authMiddleware, (req, res) => {
  const index = MOCK_USERS.findIndex(u => u.id === req.userId);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }
  MOCK_USERS.splice(index, 1);
  res.json({ message: 'Account deleted.' });
});

export default router;
