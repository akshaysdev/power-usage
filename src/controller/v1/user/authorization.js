const jwt = require('jsonwebtoken');
const { tokenExpiration, jobType } = require('../../../constants');
const { queueBackgroundJobs } = require('../../../utils/bull');
const { sessionService } = require('../../../service/service');

/**
 * It verifies the token and if it's valid, it adds the user to the request object and
 * calls the next middleware
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
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
    try {
      if ((currentTimeStamp - timeStamp) / 1000 > tokenExpiration) {
        const userAgent = req.headers['user-agent'] + req.socket.remoteAddress;
        queueBackgroundJobs({
          name: jobType.removeSession.name,
          meta: { userId: decode.user.userId, userAgent },
          className: sessionService,
          functionName: sessionService.remove,
        });
      }
    } catch (error) {
      next(error);
    }
    next(error);
  }
};

module.exports = { verifyToken };
