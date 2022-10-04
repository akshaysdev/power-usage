const { redisKey } = require('../../constants');

module.exports = class CacheService {
  constructor({ redisClient }) {
    this.redisService = redisClient;
  }

  async setSession({ userId, userSessions }) {
    try {
      let sessions = await this.redisService.hget(redisKey.SESSIONS, redisKey.SESSIONS);
      sessions = JSON.parse(sessions) || {};

      sessions[userId] = userSessions;
      sessions = JSON.stringify(sessions);

      await this.redisService.hset(redisKey.SESSIONS, redisKey.SESSIONS, sessions);

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setSession': { userId, userSessions } };
      throw error;
    }
  }

  async setSessions({ allSessions }) {
    try {
      const sessions = {};

      for (let session of allSessions) {
        const { userId, userAgent, loggedInTime } = session;

        const cachedSession = sessions[userId] ?? [];
        const currentSession = { userAgent, loggedInTime };
        cachedSession.push(currentSession);

        sessions[userId] = cachedSession;
      }

      await this.redisService.hset(redisKey.SESSIONS, redisKey.SESSIONS, JSON.stringify(sessions));

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setSessions': { allSessions } };
      throw error;
    }
  }

  async getSession(userId) {
    try {
      let sessions = await this.redisService.hget(redisKey.SESSIONS, redisKey.SESSIONS);
      sessions = JSON.parse(sessions) || {};

      const value = sessions[userId];

      return value || [];
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.getSession': { userId } };
      throw error;
    }
  }

  async setStreak({ userId, streak }) {
    try {
      let streaks = await this.redisService.hget(redisKey.STREAKS, redisKey.STREAKS);
      streaks = JSON.parse(streaks) || {};

      streaks[userId] = streak;

      await this.redisService.hset(redisKey.STREAKS, redisKey.STREAKS, JSON.stringify(streaks));

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setStreak': { userId, streak } };
      throw error;
    }
  }

  async setStreaks({ allUsers }) {
    try {
      let streaks = await this.redisService.hget(redisKey.STREAKS, redisKey.STREAKS);
      streaks = JSON.parse(streaks) || {};

      for (let user of allUsers) {
        const { id, lastStreak, streak } = user;
        const currentStreak = { lastStreak, streak };

        if (streaks[id]) streaks[id] = currentStreak;
        else streaks = { [id]: currentStreak };
      }

      await this.redisService.hset(redisKey.STREAKS, redisKey.STREAKS, JSON.stringify(streaks));

      return { success: true };
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setStreaks': { allUsers } };
      throw error;
    }
  }

  async getStreak(userId) {
    try {
      let streaks = await this.redisService.hget(redisKey.STREAKS, redisKey.STREAKS);
      streaks = JSON.parse(streaks) || {};

      const value = streaks[userId];

      return value || {};
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.getStreak': { userId } };
      throw error;
    }
  }
};
