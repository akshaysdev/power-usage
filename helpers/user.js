const createError = require('http-errors');

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

module.exports = { validateEmail, validatePassword };
