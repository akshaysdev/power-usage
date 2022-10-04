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

  async fetchSessionByAgent(userId, userAgent) {
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
        'SessionRepository.fetchSessionByAgent': { userId, userAgent },
      };
      throw error;
    }
  }

  async deleteSession(userId, userAgent) {
    try {
      const session = await this.repository.destroy({
        where: {
          userId,
          userAgent,
        },
      });

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.deleteSession': { userId, userAgent } };
      throw error;
    }
  }

  async findSessions(userId) {
    try {
      const session = await this.repository.findAll({
        raw: true,
        where: {
          userId,
        },
        attributes: ['userAgent', ['createdAt', 'loggedInTime']],
      });

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.findSessions': { userId } };
      throw error;
    }
  }

  async findAllSessions() {
    try {
      const sessions = await this.repository.findAll({
        raw: true,
        attributes: ['userId', 'userAgent', ['createdAt', 'loggedInTime']],
      });

      return sessions;
    } catch (error) {
      throw error;
    }
  }

  async deleteExpiredSessions() {
    try {
      await this.repository.destroy({
        where: {
          createdAt: {
            [Op.lte]: new Date(new Date() - tokenExpiration * 1000),
          },
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
};
