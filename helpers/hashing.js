const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * Async function to hash a password.
 *
 * @param {string} password - The password to be hashed
 * @return {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

/**
 * Compares a password with a hashed password using bcrypt.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @return {boolean} Returns true if the password matches the hashed password, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword
}