/**
 * middleware/auth.js
 *
 * Authentication middleware for protected routes.
 * Verifies JWT tokens instead of checking an in-memory session store.
 *
 * Usage:
 *   import authMiddleware from '../middleware/auth.js';
 *   router.get('/protected-route', authMiddleware, (req, res) => {
 *     // req.userId is available here (MongoDB ObjectId string)
 *     res.json({ userId: req.userId });
 *   });
 *
 * Expects the request to include an Authorization header:
 *   Authorization: Bearer <jwt_token>
 */

import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
  }
}

export default authMiddleware;