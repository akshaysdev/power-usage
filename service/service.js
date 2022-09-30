const { container } = require('../externalService/dependencyInjection');

const userService = container.resolve('userService');

module.exports = { userService };
