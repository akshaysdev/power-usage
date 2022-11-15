const CronJob = require('cron').CronJob;

const { jobType } = require('../constants');
const { queueBackgroundJobs } = require('../utils/bull');
const { sessionService, userService } = require('../service/service');

/**
 *  @description This is a cron job that runs every 5th minute to remove expired sessions
 */
const removeExpiredSessionsJob = new CronJob('*/5 * * * *', async function () {
  try {
    queueBackgroundJobs({
      name: jobType.removeExpiredSessions.name,
      meta: {},
      className: sessionService,
      functionName: sessionService.removeExpiredSessions,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 *  @description This is a cron job that runs everyday at 12:00 AM to update streak
 */
const updateStreakToZeroJob = new CronJob('0 0 * * *', async function () {
  try {
    queueBackgroundJobs({
      name: jobType.updateStreakToZero.name,
      meta: {},
      className: userService,
      functionName: userService.updateStreakToZero,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { removeExpiredSessionsJob, updateStreakToZeroJob };
