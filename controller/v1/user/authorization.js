const jwt = require('jsonwebtoken');
const { tokenExpiration } = require('../../../constants');
const { sessionService } = require('../../../service/service');

const verifyToken = async (req, res, next) => {
  let token;
  try {
    token = req.headers.cookie.split('=')[1];
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (verified) {
      req.user = verified.user;
      next();
    }
  } catch (error) {
    const decode = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);

    const currentTimeStamp = new Date().getTime() + 1;
    const timeStamp = new Date(decode?.user?.timeStamp).getTime();

    if ((currentTimeStamp - timeStamp) / 1000 > tokenExpiration) {
      await sessionService.remove(decode.user.userId, token);
    }
    next(error);
  }
};

module.exports = { verifyToken };
