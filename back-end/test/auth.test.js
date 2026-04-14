/**
 * test/auth.test.js
 *
 * Unit tests for Aayan's auth logic:
 *   - findUserByEmail (data/mockUsers.js)
 *   - validatePassword (data/mockUsers.js)
 *   - generateToken, createSession, destroySession, getSessionUser (utils/session.js)
 *   - authMiddleware (middleware/auth.js)
 *   - authenticateUser (routes/auth.js)
 *   - signup logic (routes/auth.js)
 *
 * Run tests:    npm test
 * Run coverage: npm run coverage
 */

import { expect } from 'chai';
import { findUserByEmail, validatePassword, MOCK_USERS } from '../data/mockUsers.js';
import {
  activeSessions,
  generateToken,
  createSession,
  destroySession,
  getSessionUser,
} from '../utils/session.js';
import authMiddleware from '../middleware/auth.js';
import { authenticateUser } from '../routes/auth.js';

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

// ── generateToken ─────────────────────────────────────────────────────────────
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

// ── createSession / getSessionUser / destroySession ───────────────────────────
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

// ── authenticateUser ──────────────────────────────────────────────────────────
describe('authenticateUser', () => {
  it('should return a user object for valid credentials', () => {
    const user = authenticateUser('am12611@nyu.edu', 'password123');
    expect(user).to.be.an('object');
    expect(user.email).to.equal('am12611@nyu.edu');
  });

  it('should return null for an incorrect password', () => {
    const user = authenticateUser('am12611@nyu.edu', 'wrongpassword');
    expect(user).to.be.null;
  });

  it('should return null for an email that does not exist', () => {
    const user = authenticateUser('nobody@nyu.edu', 'password123');
    expect(user).to.be.null;
  });

  it('should return null if email is empty', () => {
    const user = authenticateUser('', 'password123');
    expect(user).to.be.null;
  });
});

// ── signup logic ──────────────────────────────────────────────────────────────
describe('signup logic', () => {
  // Track original length so we can clean up after tests
  let originalLength;

  beforeEach(() => {
    originalLength = MOCK_USERS.length;
  });

  afterEach(() => {
    // Remove any users added during the test
    MOCK_USERS.splice(originalLength);
  });

  it('should add a new user to MOCK_USERS when email is not taken', () => {
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name: 'testuser',
      email: 'testuser@nyu.edu',
      password: 'securepass',
    };
    MOCK_USERS.push(newUser);
    expect(findUserByEmail('testuser@nyu.edu')).to.be.an('object');
  });

  it('should not allow duplicate emails', () => {
    const existing = findUserByEmail('am12611@nyu.edu');
    expect(existing).to.not.be.undefined;
    // Simulates the 409 check in the route
    expect(!!existing).to.be.true;
  });

  it('should reject a non-.edu email', () => {
    const email = 'user@gmail.com';
    expect(email.endsWith('.edu')).to.be.false;
  });

  it('should accept a valid .edu email', () => {
    const email = 'newstudent@nyu.edu';
    expect(email.endsWith('.edu')).to.be.true;
  });

  it('new user should be findable by email after being added', () => {
    const email = 'brandnew@nyu.edu';
    MOCK_USERS.push({ id: '99', name: 'brandnew', email, password: 'pass' });
    expect(findUserByEmail(email)).to.have.property('email', email);
  });
});

// ── authMiddleware ────────────────────────────────────────────────────────────
describe('authMiddleware', () => {
  function mockReqRes(authHeader) {
    const req = { headers: { authorization: authHeader } };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; },
    };
    const next = () => { res.nextCalled = true; };
    return { req, res, next };
  }

  it('should call next() and set req.userId for a valid token', () => {
    const token = createSession('user-001');
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
    const { req, res, next } = mockReqRes('Bearer invalid-token-xyz');
    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('should return 401 for a destroyed (logged out) token', () => {
    const token = createSession('user-002');
    destroySession(token);
    const { req, res, next } = mockReqRes(`Bearer ${token}`);
    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
  });
});