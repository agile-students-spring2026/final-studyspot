/**
 * data/mockUsers.js
 *
 * Mock user store and authentication helper functions.
 *
 * This file will be replaced by real database queries during the database sprint.
 * Teammates: import findUserByEmail and validatePassword into your auth routes.
 */

export const MOCK_USERS = [
  {
    id: '1',
    name: 'Aayan Mathur',
    email: 'am12611@nyu.edu',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Leia Yun',
    email: 'sy3544@nyu.edu',
    password: 'password123',
  },
  {
    id: '3',
    name: 'Layan Alyas',
    email: 'laa9624@nyu.edu',
    password: 'password123',
  },
  {
    id: '4',
    name: 'Tianlang Qin',
    email: 'tq2098@nyu.edu',
    password: 'password123',
  },
  {
    id: '5',
    name: 'Max Wu',
    email: 'mw5608@nyu.edu',
    password: 'password123',
  },
];

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {object|undefined} user object, or undefined if not found
 */
export function findUserByEmail(email) {
  return MOCK_USERS.find(user => user.email === email);
}

/**
 * Validate that a plain-text password matches the user's stored password.
 * NOTE: Passwords are plain text only for this sprint.
 * Teammates - Can consider hashing with bcrypt if anyone prefers, otherwise can be done in database sprint.
 * @param {object} user - user object returned by findUserByEmail
 * @param {string} password - plain-text password to check
 * @returns {boolean}
 */
export function validatePassword(user, password) {
  if (!user || !password) return false;
  return user.password === password;
}