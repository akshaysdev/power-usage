const express = require('express');
const powerUsageRouter = express.Router();

const powerUsage = require('./powerUsage');
const { verifyToken } = require('../user/authorization');
const { authError } = require('../../../error/response');

powerUsageRouter.post('/create', verifyToken, powerUsage.create, authError);

powerUsageRouter.get('/list', verifyToken, powerUsage.fetchUsage, authError);

powerUsageRouter.get('/day-wise', verifyToken, powerUsage.fetchUsageDayWise, authError);

powerUsageRouter.get('/streak', verifyToken, powerUsage.getStreak, authError);

module.exports = { powerUsageRouter };
