const { container } = require('../externalService/dependencyInjection');

const userService = container.resolve('userService');

const sessionService = container.resolve('sessionService');

module.exports = { userService, sessionService };
