const { response } = require('../../../error/response');
const { userService, sessionService } = require('../../../service/service');

/**
 * It registers a new user
 * @param req - The request object.
 * @param res - The response object.
 */
const register = async (req, res) => {
  try {
    const response = await userService.register(req.body);

    res.status(200).send({ success: true, message: response.message });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

/**
 * It takes the user's credentials, logs them in, and returns a cookie with the access token
 * @param req - The request object.
 * @param res - The response object.
 */
const login = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] + req.socket.remoteAddress;
    const response = await userService.login(req.body, userAgent);

    res
      .cookie('accessToken', response.accessToken, { httpOnly: true })
      .status(200)
      .send({ success: true, message: response.message });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

/**
 * It logs out the user and deletes the access token from the cookie
 * @param req - The request object.
 * @param res - The response object.
 */
const logout = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] + req.socket.remoteAddress;
    const response = await userService.logout(req.user.userId, userAgent);

    res.cookie('accessToken', '', { httpOnly: true }).status(200).send({ success: true, message: response.message });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

/**
 * It fetches all the sessions for a user
 * @param req - The request object.
 * @param res - The response object.
 */
const fetchSessions = async (req, res) => {
  try {
    const response = await sessionService.fetchSessions(req.user.userId);

    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

module.exports = { register, login, logout, fetchSessions };
