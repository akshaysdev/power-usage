const { response } = require('../../../error/response');
const { powerUsageService, userService } = require('../../../service/service');

const create = async (req, res) => {
  try {
    req.body.userId = req.user.userId;
    const response = await powerUsageService.create(req.body);

    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

const fetchUsage = async (req, res) => {
  try {
    const startDate = new Date(req?.query?.startDate);
    const endDate = new Date(req?.query?.endDate);

    const response = await powerUsageService.fetchUsage(req.user.userId, startDate, endDate);

    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

const fetchUsageDayWise = async (req, res) => {
  try {
    const startDate = new Date(req?.query?.startDate);
    const endDate = new Date(req?.query?.endDate);

    const response = await powerUsageService.fetchUsagesDayWise(req.user.userId, startDate, endDate);

    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

const getStreak = async (req, res) => {
  try {
    const response = await userService.getStreak(req.user.userId);

    res.status(200).send({ success: true, data: response });
  } catch (error) {
    res.status(error.status || 500).send(response(error));
  }
};

module.exports = { create, fetchUsage, fetchUsageDayWise, getStreak };
