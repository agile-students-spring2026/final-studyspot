/**
 * utils/session.js
 *
 * In-memory session store and token utilities.
 *
 * Teammates: import { activeSessions, generateToken, createSession, destroySession }
 * into your auth routes (signin, signup, logout).
 *
 * This will be replaced by a proper session/JWT solution during the database sprint.
 */

// In-memory token → userId map.
// Resets on server restart — intentional for this sprint.
export const activeSessions = new Map();

/**
 * Generate a random session token.
 * @returns {string}
 */
export function generateToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Create a new session for a user and return the token.
 * @param {string} userId
 * @returns {string} token
 */
export function createSession(userId) {
  const token = generateToken();
  activeSessions.set(token, userId);
  return token;
}

/**
 * Destroy a session by token.
 * @param {string} token
 * @returns {boolean} true if session existed and was removed, false otherwise
 */
export function destroySession(token) {
  return activeSessions.delete(token);
}

/**
 * Look up the userId associated with a token.
 * @param {string} token
 * @returns {string|undefined} userId or undefined if token is invalid
 */
export function getSessionUser(token) {
  return activeSessions.get(token);
}