const express = require('express');

const v1Routes = express.Router();

const { powerUsageRouter } = require('./powerUsage/routes');
const { userRouter } = require('./user/routes');

v1Routes.use('/auth', userRouter);

v1Routes.use('/power-usage', powerUsageRouter);

module.exports = v1Routes;
