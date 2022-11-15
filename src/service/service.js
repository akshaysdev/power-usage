const { container } = require('../utils/dependencyInjection');

const powerUsageService = container.resolve('powerUsageService');
const sessionService = container.resolve('sessionService');
const userService = container.resolve('userService');

module.exports = { userService, sessionService, powerUsageService };