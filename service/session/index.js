const { jobType } = require('../../constants');

module.exports = class SessionService {
  constructor({ sessionRepository, cacheService, queueBackgroundJob }) {
    this.sessionRepository = sessionRepository;
    this.cacheService = cacheService;
    this.queueBackgroundJob = queueBackgroundJob;
  }

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

  async fetchSessionByAgent(userId, userAgent) {
    try {
      const session = await this.sessionRepository.fetchSessionByAgent(userId, userAgent);

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.fetchSessionByAgent': { userId, userAgent } };
      throw error;
    }
  }

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
