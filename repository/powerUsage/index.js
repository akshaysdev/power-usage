const { Op } = require('sequelize');
const { PowerUsageModel } = require('./model');

module.exports = class PowerUsageRepository {
  constructor({ sequelize }) {
    PowerUsageModel(sequelize);
    this.repository = sequelize.models.PowerUsage;
  }

  async create(powerUsageObject) {
    try {
      const powerUsage = await this.repository.create(powerUsageObject);

      return powerUsage;
    } catch (error) {
      error.meta = { ...error.meta, 'PowerUsageRepository.create': { powerUsageObject } };
      throw error;
    }
  }

  async findUsage(userId, startDate, endDate) {
    try {
      const powerUsages = await this.repository.findAll({
        raw: true,
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
