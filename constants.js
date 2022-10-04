const hash = {
  SALT: 'e-commerce-app-salt',
  ITERATIONS: 2000,
  KEY_LEN: 64,
  DIGEST: 'sha512',
};

const tokenExpiration = 60 * 5;

const applianceTypeEnum = ['low-power', 'mid-power', 'high-power'];

const jobType = {
  removeSession: { name: 'removeSession', concurrency: 1 },
  createSession: { name: 'createSession', concurrency: 1 },
  removeExpiredSessions: { name: 'removeExpiredSessions', concurrency: 1 },
  updateStreak: { name: 'updateStreak', concurrency: 1 },
  updateStreakToZero: { name: 'updateStreakToZero', concurrency: 1 },
};

module.exports = { hash, tokenExpiration, applianceTypeEnum, jobType };
