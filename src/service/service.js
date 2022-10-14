const { container } = require('../externalService/dependencyInjection');

const powerUsageService = container.resolve('powerUsageService');
const sessionService = container.resolve('sessionService');
const userService = container.resolve('userService');

module.exports = { userService, sessionService, powerUsageService };