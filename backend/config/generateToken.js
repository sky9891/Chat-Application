const jwt = require("jsonwebtoken");

/**
 * Generate JWT token for a user
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token expires in 30 days
  });
};

module.exports = generateToken;
