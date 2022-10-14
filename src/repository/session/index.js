const { Op } = require('sequelize');
const { tokenExpiration } = require('../../constants');
const { SessionModel } = require('./model');

module.exports = class SessionRepository {
  constructor({ sequelize }) {
    SessionModel(sequelize);
    this.repository = sequelize.models.Session;
  }

  /**
   * It creates a session
   * @param sessionObject - The object that will be used to create the session.
   * @returns A session object
   */
  async create(sessionObject) {
    try {
      const session = await this.repository.create(sessionObject);

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionRepository.create': { sessionObject } };
      throw error;
    }
  }

  /**
   * Find all sessions for a given userId
   * @param userId - The userId of the user whose sessions we want to find.
   * @returns An array of sessions
   */
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

  /**
   * Fetch a session by userId and userAgent
   * @param userId - The userId of the user who's session we're fetching.
   * @param userAgent - The user agent of the browser that the user is using.
   * @returns The session object
   */
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

  /**
   * Delete a session from the database
   * The first thing we do is try to delete the session from the database. If it succeeds, we return
   * the session. If it fails, we throw an error
   * @param userId - The user's id
   * @param userAgent - The user agent of the browser that the user is using.
   * @returns The session is being returned.
   */
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

  /**
   * It finds all sessions for a given user
   * @param userId - The userId of the user whose sessions you want to find.
   * @returns An array of objects with the userAgent and loggedInTime.
   */
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

  /**
   * It returns a list of all the sessions in the database
   * @returns An array of objects with the following properties:
   *   userId: The id of the user who is logged in
   *   userAgent: The user agent of the user who is logged in
   *   loggedInTime: The time the user logged in
   */
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

 /**
  * It deletes all sessions that were created before the current time minus the token expiration time
  * @returns A boolean value.
  */
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
