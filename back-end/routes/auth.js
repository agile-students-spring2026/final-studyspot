import express from 'express';
import { findUserByEmail, validatePassword, MOCK_USERS } from '../data/mockUsers.js';
import { createSession, destroySession } from '../utils/session.js';
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

// POST /api/auth/signup — register a new user
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!email.endsWith('.edu')) {
    return res.status(400).json({ error: 'A valid university (.edu) email is required.' });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: String(MOCK_USERS.length + 1),
    name: email.split('@')[0],
    email,
    password, // plain text for now — can be hashed with bcrypt if needed
  };

  MOCK_USERS.push(newUser);
  const token = createSession(newUser.id);

  return res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

// POST /api/auth/logout — log out and invalidate session
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const removed = destroySession(token);

  if (!removed) {
    return res.status(401).json({ error: 'Invalid or already expired token.' });
  }

  return res.status(200).json({ message: 'Logged out successfully.' });
});

export default router;