const CronJob = require('cron').CronJob;

const { sessionService } = require('../service/service');

/**
 *  @description This is a cron job that runs every 5 minutes to remove expired sessions
 */
const removeExpiredSessionsJob = new CronJob('*/5 * * * *', async function () {
  try {
    await sessionService.removeExpiredSessions();
  } catch (error) {
    console.log(error);
  }
});

module.exports = { removeExpiredSessionsJob };
