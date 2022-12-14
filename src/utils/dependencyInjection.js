const { Lifetime, createContainer, asValue, asClass } = require('awilix');

const { sequelize } = require('./sequelize');
const { queueBackgroundJobs } = require('./bull');
const { redis } = require('./redis');

/**
 * It creates a container, registers the sequelize instance, the queueBackgroundJobs function, and the
 * redis client, and then loads all the files in the repository and service directories
 * @returns A function that returns a container.
 */
const Container = () => {
  const container = createContainer();

  container.register('sequelize', asValue(sequelize));
  container.register('queueBackgroundJob', asValue(queueBackgroundJobs));
  container.register('redisClient', asValue(redis));

  const options = {
    cwd: __dirname,
    formatName: (_, descriptor) => {
      const path = descriptor.path.split('/');
      const className = path[path.length - 2];
      let classType = path[path.length - 3];
      classType = classType.charAt(0).toUpperCase() + classType.substring(1);
      return className + classType;
    },
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SINGLETON,
    },
  };

  container.loadModules(['../repository/*/index.js', '../service/*/index.js'], options);

  return container;
};

module.exports = { container: Container() };
