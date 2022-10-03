const createError = require('http-errors');

const { applianceTypeEnum } = require('../../constants');
const { isValidDate, compareTime, groupByDayWisePowerConsumed } = require('../../helpers/powerUsage');

module.exports = class PowerUsageService {
  constructor({ powerUsageRepository }) {
    this.powerUsageRepository = powerUsageRepository;
  }

  async validate({ fromTime, toTime, duration, unitConsumed, applianceType }) {
    try {
      if (!fromTime) {
        throw createError(422, 'From-Time is required');
      }

      if (!toTime) {
        throw createError(422, 'To-Time is required');
      }

      if (!duration) {
        throw createError(422, 'Duration is required');
      }

      if (!unitConsumed) {
        throw createError(422, 'Unit Consumed is required');
      }

      if (!applianceType) {
        throw createError(422, 'Appliance Type is required');
      }

      if (!isValidDate(fromTime)) {
        throw createError(400, 'From-Time should be a valid date or format');
      }

      if (!isValidDate(toTime)) {
        throw createError(400, 'To-Time should be a valid date or format');
      }

      if (!compareTime(fromTime, toTime)) {
        throw createError(417, 'From-Time should be less that To-Time');
      }

      if (!applianceTypeEnum.includes(applianceType)) {
        throw createError(422, 'Appliance Type should be any of these types low-power, mid-power or high-power');
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageService.validate': { fromTime, toTime, duration, applianceType } };
      throw error;
    }
  }

  async create(powerUsageObject) {
    try {
      await this.validate(powerUsageObject);

      const powerUsage = await this.powerUsageRepository.create(powerUsageObject);

      return powerUsage;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageService.create': { powerUsageObject } };
      throw error;
    }
  }

  async fetchUsage(userId, startDate, endDate) {
    try {
      const powerUsages = await this.powerUsageRepository.findUsage(userId, startDate, endDate);

      return powerUsages;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageService.fetchUsage': { userId, startDate, endDate } };
      throw error;
    }
  }

  async fetchUsagesDayWise(userId, startDate, endDate) {
    try {
      const powerUsages = await this.powerUsageRepository.findUsage(userId, startDate, endDate);

      const dayWisePowerConsumed = groupByDayWisePowerConsumed(powerUsages);

      return { dayWisePowerConsumed };
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageService.fetchUsagesDayWise': { userId, startDate, endDate } };
      throw error;
    }
  }
};
