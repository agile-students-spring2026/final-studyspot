/**
 * test/users.test.js
 *
 * Unit tests for profile and saved spots routes.
 *
 * Run tests:    npm test
 * Run coverage: npm run coverage
 */

import { expect } from 'chai';
import { MOCK_USERS, findUserByEmail } from '../data/mockUsers.js';
import { MOCK_SPOTS } from '../data/mockSpots.js';
import { createSession, destroySession } from '../utils/session.js';

// ── Profile helpers ───────────────────────────────────────────────────────────
describe('MOCK_USERS data', () => {
  it('should contain at least one user', () => {
    expect(MOCK_USERS).to.be.an('array').with.length.above(0);
  });

  it('each user should have id, name, email, and password', () => {
    MOCK_USERS.forEach(user => {
      expect(user).to.have.all.keys('id', 'name', 'email', 'password');
    });
  });

  it('findUserByEmail should find Max Wu', () => {
    const user = findUserByEmail('mw5608@nyu.edu');
    expect(user).to.be.an('object');
    expect(user.name).to.equal('Max Wu');
  });
});

// ── MOCK_SPOTS data ───────────────────────────────────────────────────────────
describe('MOCK_SPOTS data', () => {
  it('should contain at least one spot', () => {
    expect(MOCK_SPOTS).to.be.an('array').with.length.above(0);
  });

  it('each spot should have id, name, and rating', () => {
    MOCK_SPOTS.forEach(spot => {
      expect(spot).to.have.property('id');
      expect(spot).to.have.property('name');
      expect(spot).to.have.property('rating');
    });
  });

  it('spot ids should be unique', () => {
    const ids = MOCK_SPOTS.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).to.equal(ids.length);
  });
});

// ── Session flow ──────────────────────────────────────────────────────────────
describe('Session flow for profile routes', () => {
  it('should create a session and destroy it on signout', () => {
    const token = createSession('5');
    expect(token).to.be.a('string').and.not.be.empty;
    const result = destroySession(token);
    expect(result).to.be.true;
  });

  it('should return false when destroying a non-existent session', () => {
    expect(destroySession('fake-token-xyz')).to.be.false;
  });
});
