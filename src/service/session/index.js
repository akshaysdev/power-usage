const { jobType } = require('../../constants');

module.exports = class SessionService {
  constructor({ sessionRepository, cacheService, queueBackgroundJob }) {
    this.sessionRepository = sessionRepository;
    this.cacheService = cacheService;
    this.queueBackgroundJob = queueBackgroundJob;
  }

  /**
   * It creates a session object, saves it to the database, and then queues a background job to cache
   * the session
   * @returns A boolean value
   */
  async create({ userId, accessToken, userAgent }) {
    try {
      const sessionObject = { accessToken, userId, userAgent };

      await this.sessionRepository.create(sessionObject);

      const sessions = await this.sessionRepository.findSessions(userId);

      this.queueBackgroundJob({
        name: jobType.cacheSession.name,
        meta: { userId, userSessions: sessions },
        className: this.cacheService,
        functionName: this.cacheService.setSession,
      });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.create': { userId, accessToken, userAgent } };
      throw error;
    }
  }

  /**
   * Fetch a session by userId and userAgent
   * @param userId - The user's id
   * @param userAgent - The user agent of the browser that the user is using.
   * @returns The session object
   */
  async fetchSessionByAgent(userId, userAgent) {
    try {
      const session = await this.sessionRepository.fetchSessionByAgent(userId, userAgent);

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.fetchSessionByAgent': { userId, userAgent } };
      throw error;
    }
  }

  /**
   * It removes a session from the database and then queues a background job to update the cache
   * @returns A boolean value
   */
  async remove({ userId, userAgent }) {
    try {
      await this.sessionRepository.deleteSession(userId, userAgent);

      const sessions = await this.sessionRepository.findSessions(userId);

      this.queueBackgroundJob({
        name: jobType.cacheSession.name,
        meta: { userId, userSessions: sessions },
        className: this.cacheService,
        functionName: this.cacheService.setSession,
      });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.remove': { userId, userAgent } };
      throw error;
    }
  }

  /**
   * It removes expired sessions from the database, then queues a background job to cache the remaining
   * sessions
   * @returns The sessions that are not expired.
   */
  async removeExpiredSessions() {
    try {
      await this.sessionRepository.deleteExpiredSessions();

      const sessions = await this.sessionRepository.findAllSessions();
      this.queueBackgroundJob({
        name: jobType.cacheSessions.name,
        meta: { allSessions: sessions },
        className: this.cacheService,
        functionName: this.cacheService.setSessions,
      });

      return sessions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the sessions for a given userId from the cache
   * @param userId - The userId of the user whose sessions we want to fetch.
   * @returns An array of sessions
   */
  async fetchSessions(userId) {
    try {
      const sessions = await this.cacheService.getSession(userId);

      return sessions;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.fetchSessions': { userId } };
      throw error;
    }
  }
};
