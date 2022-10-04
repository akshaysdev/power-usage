const express = require('express');
const powerUsageRouter = express.Router();

const powerUsage = require('./powerUsage');
const { verifyToken } = require('../user/authorization');

powerUsageRouter.post('/create', verifyToken, powerUsage.create);

powerUsageRouter.get('/list', verifyToken, powerUsage.fetchUsage);

powerUsageRouter.get('/day-wise', verifyToken, powerUsage.fetchUsageDayWise);

powerUsageRouter.get('/streak', verifyToken, powerUsage.getStreak);

module.exports = { powerUsageRouter };
