/**
 * routes/auth.js
 *
 * Authentication routes for StudySpot.
 * Uses MongoDB for user storage, bcrypt for password hashing, and JWT for tokens.
 *
 * Endpoints:
 *   POST /api/auth/signin  — find user in DB, verify bcrypt password, return JWT
 *   POST /api/auth/signup  — validate input, hash password, save to DB, return JWT
 *   POST /api/auth/logout  — client-side token removal (JWT is stateless)
 */

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();
const SALT_ROUNDS = 10;

/**
 * Generate a JWT for a given userId.
 * @param {string} userId
 * @returns {string} signed JWT
 */
export function generateJWT(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ── Validation rules ──────────────────────────────────────────────────────────
const signinValidation = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

const signupValidation = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail()
    .custom(value => {
      if (!value.endsWith('.edu')) {
        throw new Error('A valid university (.edu) email is required.');
      }
      return true;
    }),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

/* ─────────────────────────────────────────────────────────────────────────────
 * POST /api/auth/signin
 * Body: { email, password }
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.post('/signin', signinValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password with bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = generateJWT(user._id.toString());

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
 * POST /api/auth/signup
 * Body: { email, password }
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.post('/signup', signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Save user to MongoDB
    const newUser = await User.create({
      name: email.split('@')[0],
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateJWT(newUser._id.toString());

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
 * POST /api/auth/logout
 * JWT is stateless — logout is handled client-side by removing the token.
 * This endpoint exists for a clean API contract.
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully.' });
});

export default router;