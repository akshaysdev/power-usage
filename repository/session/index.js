const { SessionModel } = require('./model');

module.exports = class SessionRepository {
  constructor({ sequelize }) {
    SessionModel(sequelize);
    this.repository = sequelize.models.Session;
  }

  async create(sessionObject) {
    try {
      const session = await this.repository.create(sessionObject);

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.create': { sessionObject } };
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const sessions = await this.repository.findAll({
        where: {
          userId,
        },
      });

      return sessions;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.findByUserId': { userId } };
      throw error;
    }
  }

  async fetchSessionByUserIdAndAgent(userId, userAgent) {
    try {
      const session = (
        await this.repository.findAll({
          where: {
            userId,
            userAgent,
          },
        })
      )[0]?.dataValues;

      return session;
    } catch (error) {
      error.meta = {
        ...error.meta,
        'SessionRepository.fetchSessionByUserIdAndAgent': { userId, userAgent },
      };
      throw error;
    }
  }

  async deleteSessionByUserIdAndToken(userId, token) {
    try {
      const session = await this.repository.destroy({
        where: {
          userId,
          accessToken: token,
        },
      });

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.deleteSessionByUserIdAndToken': { userId, token } };
      throw error;
    }
  }
};
