const Redis = require('ioredis');

const options = { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST, db: process.env.REDIS_DB };

const redis = new Redis(options);

/**
 * It creates a new Redis client, and returns it
 * @returns A function that returns a redis client.
 */
const RedisClient = () => {
  const client = redis;

  client.on('connect', () => {
    console.log('Connected to Redis...');
  });

  client.on('error', (error) => {
    console.log(error);
  });

  return client;
};

module.exports = { redis: RedisClient(), redisOptions: options };
