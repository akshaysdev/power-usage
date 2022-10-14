const hash = {
  SALT: process.env.SALT_PASSWORD,
  ITERATIONS: 2000,
  KEY_LEN: 64,
  DIGEST: 'sha512',
};

const tokenExpiration = 60 * 5;

const applianceTypeEnum = ['low-power', 'mid-power', 'high-power'];

const jobType = {
  // Session
  removeSession: { name: 'removeSession', concurrency: 1 },
  createSession: { name: 'createSession', concurrency: 1 },
  removeExpiredSessions: { name: 'removeExpiredSessions', concurrency: 1 },
  // Streak
  updateStreak: { name: 'updateStreak', concurrency: 1 },
  updateStreakToZero: { name: 'updateStreakToZero', concurrency: 1 },
  // Cache Streak
  cacheStreak: { name: 'cacheStreak', concurrency: 1 },
  cacheStreaks: { name: 'cacheStreaks', concurrency: 1 },
  // Cache Session
  cacheSession: { name: 'cacheSession', concurrency: 1 },
  cacheSessions: { name: 'cacheSessions', concurrency: 1 },
};

const redisKey = {
  SESSIONS: 'SESSIONS',
  STREAKS: 'STREAKS',
};

module.exports = { hash, tokenExpiration, applianceTypeEnum, jobType, redisKey };
