module.exports = class SessionService {
  constructor({ sessionRepository }) {
    this.sessionRepository = sessionRepository;
  }

  async create(userId, accessToken, userAgent) {
    try {
      const sessionObject = { accessToken, userId, userAgent };
      
      await this.sessionRepository.create(sessionObject);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.create': { accessToken, userAgent } };
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

  async remove(userId, userAgent) {
    try {
      await this.sessionRepository.deleteSession(userId, userAgent);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.remove': { userId, userAgent } };
      throw error;
    }
  }

  async removeExpiredSessions() {
    try {
      const sessions = await this.sessionRepository.deleteExpiredSessions();

      return sessions;
    } catch (error) {
      throw error;
    }
  }

  async fetchSessions(userId) {
    try {
      const sessions = await this.sessionRepository.findSessions(userId);

      return sessions;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.fetchSessions': { userId } };
      throw error;
    }
  }
};
