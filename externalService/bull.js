const Queue = require('bull');

const redisOptions = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST, db: process.env.REDIS_DB };

const { jobType } = require('../constants');

const jobOptions = { redis: redisOptions, settings: { lockDuration: 120000 } };

Queue.prototype.setHandler = async function (name, handler) {
  if (!this.handlers[name]) {
    this.handlers[name] = handler;
  }
};

const QueueBackgroundJob = new Queue('backgroundJobs', jobOptions);

/**
 * It takes in a name, meta, className, and functionName, and then adds a job to the queue with the
 * name and meta, and then processes the job with the name, concurrency, and functionName
 */
const queueBackgroundJobs = async ({ name, meta, className, functionName }) => {    
  QueueBackgroundJob.add(name, meta);
  QueueBackgroundJob.process(name, jobType[name].concurrency, async (job) => {
    await setImmediate(() => functionName.bind(className).call(this, job.data));
    return Promise.resolve();
  });
};

module.exports = { queueBackgroundJobs };
