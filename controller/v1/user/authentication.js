const { response } = require('../../../error/response');
const { userService } = require('../../../service/service');

const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

const login = async (req, res) => {
  try {
    const user = await userService.login(req.body);

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

module.exports = { register, login };
