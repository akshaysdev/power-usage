const createError = require('http-errors');

const { applianceTypeEnum, jobType } = require('../../constants');
const { isValidDate, compareTime, groupByDayWisePowerConsumed } = require('../../helpers/powerUsage');

module.exports = class PowerUsageService {
  constructor({ powerUsageRepository, userService, queueBackgroundJob }) {
    this.powerUsageRepository = powerUsageRepository;
    this.userService = userService;
    this.queueBackgroundJob = queueBackgroundJob;
  }

  /**
   * It validates the input parameters and throws an error if any of the parameters are invalid
   * @returns a boolean value.
   */
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

  /**
   * It creates a new power usage object and then queues a background job to update the user's streak
   * @param powerUsageObject - The object that you want to create.
   * @returns The powerUsage object
   */
  async create(powerUsageObject) {
    try {
      await this.validate(powerUsageObject);

      const powerUsage = await this.powerUsageRepository.create(powerUsageObject);

      this.queueBackgroundJob({
        name: jobType.updateStreak.name,
        meta: { userId: powerUsage.userId, date: powerUsage.fromTime },
        className: this.userService,
        functionName: this.userService.updateStreak,
      });

      return powerUsage;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageService.create': { powerUsageObject } };
      throw error;
    }
  }

  /**
   * It fetches power usage data for a given user, between a given start and end date
   * @param userId - The userId of the user whose power usage we want to fetch.
   * @param startDate - The start date of the period you want to fetch the power usage for.
   * @param endDate - The end date of the period for which you want to fetch the power usage.
   * @returns An array of power usage objects
   */
  async fetchUsage(userId, startDate, endDate) {
    try {
      const powerUsages = await this.powerUsageRepository.findUsage(userId, startDate, endDate);

      return powerUsages;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageService.fetchUsage': { userId, startDate, endDate } };
      throw error;
    }
  }

  /**
   * It fetches power usages for a user between a start date and an end date and groups them by day
   * @param userId - The userId of the user whose power usage is to be fetched.
   * @param startDate - The start date of the period for which you want to fetch the power usage.
   * @param endDate - The end date of the period for which the power usage is to be fetched.
   */
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
