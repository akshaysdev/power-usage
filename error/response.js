/**
 * @description Error response
 * @param {Error} error
 * @returns {Object} { success, message }
 */
const response = (error) => {
  // TODO: console log need to be removed
  console.log(`🚀 ~ file: response.js ~ line 7 ~ response ~ error`, error);

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

const authError = (error, req, res, next) => {
  // TODO: console log need to be removed
  console.log(`🚀 ~ file: response.js ~ line 23 ~ authError ~ error`, error);

  if (error.status === 500) {
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
  return res.status(403).send({ success: false, message: 'Session expired. Log-In required' });
};

module.exports = { response, authError };
