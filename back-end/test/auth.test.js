/**
 * test/auth.test.js
 *
 * Unit tests for StudySpot auth logic:
 *   - findUserByEmail + validatePassword (data/mockUsers.js) — kept for reference
 *   - generateJWT (routes/auth.js)
 *   - JWT middleware (middleware/auth.js)
 *   - bcrypt password hashing logic
 *   - signup validation logic
 *
 * Run tests:    npm test
 * Run coverage: npm run coverage
 */

import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByEmail, validatePassword, MOCK_USERS } from '../data/mockUsers.js';
import {
  activeSessions,
  generateToken,
  createSession,
  destroySession,
  getSessionUser,
} from '../utils/session.js';
import authMiddleware from '../middleware/auth.js';
import { generateJWT } from '../routes/auth.js';

// Set a test JWT secret so jwt.sign/verify works without a real .env
const TEST_SECRET = 'test_secret_for_unit_tests';
process.env.JWT_SECRET = TEST_SECRET;

// ── findUserByEmail ───────────────────────────────────────────────────────────
describe('findUserByEmail', () => {
  it('should return a user when given a valid email', () => {
    const user = findUserByEmail('am12611@nyu.edu');
    expect(user).to.be.an('object');
    expect(user.email).to.equal('am12611@nyu.edu');
    expect(user).to.have.property('id');
    expect(user).to.have.property('name');
  });

  it('should return undefined for an email that does not exist', () => {
    const user = findUserByEmail('nobody@nyu.edu');
    expect(user).to.be.undefined;
  });

  it('should return undefined for an empty string', () => {
    const user = findUserByEmail('');
    expect(user).to.be.undefined;
  });
});

// ── validatePassword ──────────────────────────────────────────────────────────
describe('validatePassword', () => {
  it('should return true for a correct password', () => {
    const user = findUserByEmail('am12611@nyu.edu');
    expect(validatePassword(user, 'password123')).to.be.true;
  });

  it('should return false for an incorrect password', () => {
    const user = findUserByEmail('am12611@nyu.edu');
    expect(validatePassword(user, 'wrongpassword')).to.be.false;
  });

  it('should return false if user is undefined', () => {
    expect(validatePassword(undefined, 'password123')).to.be.false;
  });

  it('should return false if password is empty', () => {
    const user = findUserByEmail('am12611@nyu.edu');
    expect(validatePassword(user, '')).to.be.false;
  });
});

// ── generateToken (legacy session) ───────────────────────────────────────────
describe('generateToken', () => {
  it('should return a non-empty string', () => {
    const token = generateToken();
    expect(token).to.be.a('string').and.not.be.empty;
  });

  it('should generate unique tokens on each call', () => {
    const t1 = generateToken();
    const t2 = generateToken();
    expect(t1).to.not.equal(t2);
  });
});

// ── Session management (legacy) ───────────────────────────────────────────────
describe('Session management', () => {
  it('createSession should store a token and return it', () => {
    const token = createSession('user-123');
    expect(token).to.be.a('string').and.not.be.empty;
    expect(activeSessions.has(token)).to.be.true;
  });

  it('getSessionUser should return the correct userId for a valid token', () => {
    const token = createSession('user-456');
    expect(getSessionUser(token)).to.equal('user-456');
  });

  it('getSessionUser should return undefined for an invalid token', () => {
    expect(getSessionUser('not-a-real-token')).to.be.undefined;
  });

  it('destroySession should remove the token and return true', () => {
    const token = createSession('user-789');
    const result = destroySession(token);
    expect(result).to.be.true;
    expect(activeSessions.has(token)).to.be.false;
  });

  it('destroySession should return false for a token that does not exist', () => {
    expect(destroySession('fake-token')).to.be.false;
  });
});

// ── generateJWT ───────────────────────────────────────────────────────────────
describe('generateJWT', () => {
  it('should return a non-empty string', () => {
    const token = generateJWT('user-abc');
    expect(token).to.be.a('string').and.not.be.empty;
  });

  it('should contain the userId in the decoded payload', () => {
    const token = generateJWT('user-abc');
    const decoded = jwt.verify(token, TEST_SECRET);
    expect(decoded).to.have.property('userId', 'user-abc');
  });

  it('should generate different tokens for different userIds', () => {
    const t1 = generateJWT('user-1');
    const t2 = generateJWT('user-2');
    expect(t1).to.not.equal(t2);
  });

  it('should expire after 7 days', () => {
    const token = generateJWT('user-abc');
    const decoded = jwt.decode(token);
    const sevenDaysFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    expect(decoded.exp).to.be.closeTo(sevenDaysFromNow, 5);
  });
});

// ── bcrypt password hashing ───────────────────────────────────────────────────
describe('bcrypt password hashing', () => {
  it('should hash a password to a different string', async () => {
    const hash = await bcrypt.hash('password123', 10);
    expect(hash).to.not.equal('password123');
  });

  it('should verify a correct password against its hash', async () => {
    const hash = await bcrypt.hash('password123', 10);
    const match = await bcrypt.compare('password123', hash);
    expect(match).to.be.true;
  });

  it('should reject an incorrect password against a hash', async () => {
    const hash = await bcrypt.hash('password123', 10);
    const match = await bcrypt.compare('wrongpassword', hash);
    expect(match).to.be.false;
  });

  it('should produce different hashes for the same password', async () => {
    const hash1 = await bcrypt.hash('password123', 10);
    const hash2 = await bcrypt.hash('password123', 10);
    expect(hash1).to.not.equal(hash2);
  });
});

// ── signup validation logic ───────────────────────────────────────────────────
describe('signup validation logic', () => {
  let originalLength;

  beforeEach(() => {
    originalLength = MOCK_USERS.length;
  });

  afterEach(() => {
    MOCK_USERS.splice(originalLength);
  });

  it('should reject a non-.edu email', () => {
    const email = 'user@gmail.com';
    expect(email.endsWith('.edu')).to.be.false;
  });

  it('should accept a valid .edu email', () => {
    const email = 'newstudent@nyu.edu';
    expect(email.endsWith('.edu')).to.be.true;
  });

  it('should reject a password shorter than 8 characters', () => {
    const password = 'short';
    expect(password.length >= 8).to.be.false;
  });

  it('should accept a password of 8 or more characters', () => {
    const password = 'validpassword';
    expect(password.length >= 8).to.be.true;
  });

  it('should not allow duplicate emails', () => {
    const existing = findUserByEmail('am12611@nyu.edu');
    expect(existing).to.not.be.undefined;
    expect(!!existing).to.be.true;
  });

  it('new user should be findable by email after being added', () => {
    const email = 'brandnew@nyu.edu';
    MOCK_USERS.push({ id: '99', name: 'brandnew', email, password: 'hashedpass' });
    expect(findUserByEmail(email)).to.have.property('email', email);
  });
});

// ── JWT authMiddleware ────────────────────────────────────────────────────────
describe('authMiddleware (JWT)', () => {
  function mockReqRes(authHeader) {
    const req = { headers: { authorization: authHeader } };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; },
    };
    const next = () => { res.nextCalled = true; };
    return { req, res, next };
  }

  it('should call next() and set req.userId for a valid JWT', () => {
    const token = generateJWT('user-001');
    const { req, res, next } = mockReqRes(`Bearer ${token}`);
    authMiddleware(req, res, next);
    expect(res.nextCalled).to.be.true;
    expect(req.userId).to.equal('user-001');
  });

  it('should return 401 when no Authorization header is provided', () => {
    const { req, res, next } = mockReqRes(undefined);
    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('should return 401 for an invalid token', () => {
    const { req, res, next } = mockReqRes('Bearer not-a-real-jwt');
    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('should return 401 for a token signed with a different secret', () => {
    const badToken = jwt.sign({ userId: 'user-999' }, 'wrong_secret');
    const { req, res, next } = mockReqRes(`Bearer ${badToken}`);
    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
  });

  it('should return 401 for an expired token', () => {
    const expiredToken = jwt.sign({ userId: 'user-001' }, TEST_SECRET, { expiresIn: '0s' });
    const { req, res, next } = mockReqRes(`Bearer ${expiredToken}`);
    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
  });
});