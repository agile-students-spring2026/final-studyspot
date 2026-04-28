/**
 * routes/notifications.js
 *
 * Routes:
 *   GET  /api/users/me/notifications          — get all notifications for current user
 *   PUT  /api/users/me/notifications/read-all — mark all as read
 */

import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET /api/users/me/notifications
router.get('/me/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/users/me/notifications/read-all
router.put('/me/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
