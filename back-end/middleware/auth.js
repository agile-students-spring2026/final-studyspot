/**
 * middleware/auth.js
 *
 * Authentication middleware for protected routes.
 *
 * Teammates: add this middleware to any route that requires a logged-in user.
 *
 * Usage:
 *   import authMiddleware from '../middleware/auth.js';
 *   router.get('/protected-route', authMiddleware, (req, res) => {
 *     // req.userId is available here
 *     res.json({ userId: req.userId });
 *   });
 *
 * Expects the request to include an Authorization header:
 *   Authorization: Bearer <token>
 */

import { getSessionUser } from '../utils/session.js';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const userId = getSessionUser(token);
  if (!userId) {
    return res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
  }

  // Attach userId to request so route handlers can use it
  req.userId = userId;
  next();
}

export default authMiddleware;