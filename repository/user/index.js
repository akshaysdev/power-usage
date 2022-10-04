const moment = require('moment');
const { Op } = require('sequelize');

const { UserModel } = require('./model');

module.exports = class UserRepository {
  constructor({ sequelize }) {
    UserModel(sequelize);
    this.repository = sequelize.models.User;
  }

  async create(userObject) {
    try {
      const user = await this.repository.create(userObject);

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.create': { userObject } };
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.repository.findAll({ raw: true });

      return users;
    } catch (error) {
      throw error;
    }
  }

  async findById(userId) {
    try {
      const user = (
        await this.repository.findAll({
          raw: true,
          where: {
            id: userId,
          },
        })
      )[0];

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findById': { userId } };
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      await this.repository.update(updateData, {
        where: {
          id: userId,
        },
      });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.updateUser': { userId, updateData } };
      throw error;
    }
  }

  async updateStreakToZero() {
    try {
      await this.repository.update(
        { streak: 0 },
        {
          raw: true,
          where: {
            [Op.and]: {
              streak: { [Op.gt]: 0 },
              lastStreak: { [Op.gte]: moment().utc().startOf('day').subtract(1, 'day') },
            },
          },
        }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getStreak(userId) {
    try {
      const streakData = (
        await this.repository.findAll({
          raw: true,
          where: {
            id: userId,
          },
          attributes: ['lastStreak', 'streak'],
        })
      )[0];

      return streakData;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.getStreak': { userId } };
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = (
        await this.repository.findAll({
          raw: true,
          where: {
            email,
          },
        })
      )[0];

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { email } };
      throw error;
    }
  }

  async findByMobile(mobile) {
    try {
      const user = (
        await this.repository.findAll({
          raw: true,
          where: {
            mobile,
          },
        })
      )[0];

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByMobile': { mobile } };
      throw error;
    }
  }

  async findByUserName(userName) {
    try {
      const user = (
        await this.repository.findAll({
          raw: true,
          where: {
            userName,
          },
        })
      )[0];

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { userName } };
      throw error;
    }
  }
};
