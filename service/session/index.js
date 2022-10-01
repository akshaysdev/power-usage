const { v4: uuidv4 } = require('uuid');

module.exports = class SessionService {
  constructor({ sessionRepository }) {
    this.sessionRepository = sessionRepository;
  }

  async createSession(userId, accessToken, userAgent) {
    try {
      const sessionObject = {
        id: uuidv4(),
        accessToken,
        userId,
        userAgent,
      };
      await this.sessionRepository.create(sessionObject);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.createSession': { accessToken, userAgent } };
      throw error;
    }
  }

  async fetchSessionByUserIdAndAgent(userId, userAgent) {
    try {
      const session = await this.sessionRepository.fetchSessionByUserIdAndAgent(userId, userAgent);

      return session;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.fetchSessionByUserIdAndAgent': { userId, userAgent } };
      throw error;
    }
  }

  async remove(userId, accessToken) {
    try {
      await this.sessionRepository.deleteSessionByUserIdAndToken(userId, accessToken);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SessionService.createSession': { userId, accessToken } };
      throw error;
    }
  }
};
