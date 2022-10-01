const { response } = require('../../../error/response');
const { userService, sessionService } = require('../../../service/service');

const register = async (req, res) => {
  try {
    const response = await userService.register(req.body);

    res.status(200).send({ success: true, message: response.message });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

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

const logout = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] + req.socket.remoteAddress;
    const response = await userService.logout(req.user, userAgent);

    res.cookie('accessToken', '', { httpOnly: true }).status(200).send({ success: true, message: response.message });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

const fetchAllSessions = async (req, res) => {
  try {
    const response = await sessionService.findAllSessionsByUserId(req.user.userId);

    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

module.exports = { register, login, logout, fetchAllSessions };
