/**
 * @description Error response
 * @param {Error} error
 * @returns {Object} { success, message }
 */
const response = (error) => {
  if (error.status === 500) {
    return {
      success: false,
      message: 'Internal Server Error',
    };
  }
  return {
    success: false,
    message: error.message,
  };
};

/**
 * If the error status is 500, return a 500 status code with a message. Otherwise, return a 403 status
 * code with a message
 * @param error - The error object that was thrown.
 * @param req - The request object.
 * @param res - The response object
 * @param next - This is a function that will be called if the middleware function doesn't end the
 * request-response cycle.
 * @returns A response object
 */
const authError = (error, req, res, next) => {
  if (error.status === 500) {
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
  return res.status(403).send({ success: false, message: 'Session expired. Log-In required' });
};

module.exports = { response, authError };
