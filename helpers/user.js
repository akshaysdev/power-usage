const createError = require('http-errors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { hash, tokenExpiration } = require('../constants');

/**
 * Password must contain minimum 6 characters, one uppercase letter, one lowercase letter, one number
 * and one special character
 * @param password - The password to validate.
 */
const validatePassword = (password) => {
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  if (!regex.test(password)) {
    throw createError(
      422,
      'Password must contain minimum 6 characters, one uppercase letter, one lowercase letter, one number and one special character',
      { meta: { password } }
    );
  }
};

/**
 * It checks if the email is a valid email address
 * @param email - The email address to validate
 */
const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    throw createError(422, 'Email must be valid email address', { meta: { email } });
  }
};

/**
 * It takes a password, and returns a hashed version of that password
 * @param password - The password to hash.
 * @returns A hashed password.
 */
const hashPassword = (password) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, hash.SALT, hash.ITERATIONS, hash.KEY_LEN, hash.DIGEST)
    .toString(`hex`);

  return hashedPassword;
};

/**
 * It takes a user object as an argument, and returns a signed JWT token
 * @param user - user details
 * @returns A token that is signed with the user's id and the time the user was created.
 */
const signToken = (user) => {
  const accessToken = jwt.sign(
    { user: { userId: user.id, timeStamp: user.createdAt } },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: tokenExpiration,
    }
  );

  return accessToken;
};

module.exports = { validateEmail, validatePassword, hashPassword, signToken };
