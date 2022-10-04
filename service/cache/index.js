const { redisKey } = require('../../constants');

module.exports = class CacheService {
  constructor({ redisClient }) {
    this.redisService = redisClient;
  }

  /**
   * It takes a userId and userSessions as input, and returns true if the userSessions are successfully
   * set in the redis
   * @returns A boolean value
   */
  async setSession({ userId, userSessions }) {
    try {
      let sessions = await this.redisService.hget(redisKey.SESSIONS, redisKey.SESSIONS);
      sessions = JSON.parse(sessions) || {};

      sessions[userId] = userSessions;
      sessions = JSON.stringify(sessions);

      await this.redisService.hset(redisKey.SESSIONS, redisKey.SESSIONS, sessions);

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setSession': { userId, userSessions } };
      throw error;
    }
  }

  /**
   * It takes an array of users, and for each user, it checks if the user's id is already in the
   * sessions object. If it is, it updates the user's session. If it isn't, it adds the user's id and
   * session to the sessions object
   * @returns A boolean value
   */
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

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setSessions': { allSessions } };
      throw error;
    }
  }

  /**
   * It gets the sessions from the redis and returns the sessions for the userId
   * @param userId - The userId of the user whose session you want to retrieve.
   * @returns An array of sessions for a user.
   */
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

  /**
   * It gets the streaks from redis, updates the streak for the user, and then sets the streaks back to
   * redis
   * @returns A boolean value
   */
  async setStreak({ userId, streak }) {
    try {
      let streaks = await this.redisService.hget(redisKey.STREAKS, redisKey.STREAKS);
      streaks = JSON.parse(streaks) || {};

      streaks[userId] = streak;

      await this.redisService.hset(redisKey.STREAKS, redisKey.STREAKS, JSON.stringify(streaks));

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setStreak': { userId, streak } };
      throw error;
    }
  }

  /**
   * It takes an array of users, and for each user, it checks if the user's id is already in the
   * streaks object. If it is, it updates the user's streak. If it isn't, it adds the user's id and
   * streak to the streaks object
   * @returns A boolean value
   */
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

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'CacheService.setStreaks': { allUsers } };
      throw error;
    }
  }

  /**
   * It gets the streaks from redis, parses it, and returns the value of the userId key
   * @param userId - The userId of the user you want to get the streak for.
   * @returns The value of the userId key in the streaks object.
   */
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
