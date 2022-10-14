const { Op } = require('sequelize');
const { PowerUsageModel } = require('./model');

module.exports = class PowerUsageRepository {
  constructor({ sequelize }) {
    PowerUsageModel(sequelize);
    this.repository = sequelize.models.PowerUsage;
  }

  /**
   * It creates a new power usage object in the database
   * @param powerUsageObject - This is the object that will be created in the database.
   * @returns The powerUsage object
   */
  async create(powerUsageObject) {
    try {
      const powerUsage = await this.repository.create(powerUsageObject);

      return powerUsage;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageRepository.create': { powerUsageObject } };
      throw error;
    }
  }

 /**
  * It returns an array of power usage objects for a given userId, startDate and endDate
  * @param userId - The userId of the user whose power usage is to be fetched.
  * @param startDate - The start date of the period for which you want to find the power usage.
  * @param endDate - The end date of the usage period.
  * @returns An array of power usage objects.
  */
  async findUsage(userId, startDate, endDate) {
    try {
      const powerUsages = await this.repository.findAll({
        raw: true,
        attributes: ['fromTime', 'toTime', 'duration', 'unitConsumed', 'applianceType'],
        where: {
          [Op.and]: {
            userId,
            fromTime: {
              [Op.gte]: new Date(startDate),
            },
            toTime: {
              [Op.lte]: new Date(endDate),
            },
          },
        },
        order: [['createdAt', 'ASC']],
      });

      return powerUsages;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageRepository.findUsage': { startDate, endDate } };
      throw error;
    }
  }
};
