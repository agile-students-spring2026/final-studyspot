import express from 'express';
import { findUserByEmail, validatePassword } from '../data/mockUsers.js';
import { createSession } from '../utils/session.js';
const router = express.Router();

// Exported for unit tests
export function authenticateUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || !validatePassword(user, password)) return null;
  return user;
}

// POST /api/auth/signin — sign in with email and password
router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = createSession(user.id);
  res.json({ token, userId: user.id });
});
export default router;