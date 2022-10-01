const { Op } = require('sequelize');
const { tokenExpiration } = require('../../constants');
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
        raw: true,
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
          raw: true,
          where: {
            userId,
            userAgent,
          },
        })
      )[0];

      return session;
    } catch (error) {
      error.meta = {
        ...error.meta,
        'SessionRepository.fetchSessionByUserIdAndAgent': { userId, userAgent },
      };
      throw error;
    }
  }

  async deleteSessionByUserIdAndAgent(userId, userAgent) {
    try {
      const session = await this.repository.destroy({
        where: {
          userId,
          userAgent,
        },
      });

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.deleteSessionByUserIdAndAgent': { userId, userAgent } };
      throw error;
    }
  }

  async findAllSessionsByUserId(userId) {
    try {
      const session = await this.repository.findAll({
        raw: true,
        where: {
          userId,
        },
        attributes: ['userId', 'userAgent', ['createdAt', 'loggedInTime']],
      });

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.findAllSessionsByUserId': { userId } };
      throw error;
    }
  }

  async deleteExpiredSessions() {
    try {
      const sessions = await this.repository.destroy({
        where: {
          createdAt: {
            [Op.lt]: new Date(new Date() - tokenExpiration * 1000),
          },
        },
      });

      return sessions;
    } catch (error) {
      throw error;
    }
  }
};
