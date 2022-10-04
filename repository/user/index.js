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

  async findById(userId) {
    try {
      const user = (
        await this.repository.findAll({
          raw: true,
          where: {
            id: userId,
          },
          attributes: ['id', 'lastStreak', 'streak', 'createdAt'],
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
      const user = (
        await this.repository.update(updateData, {
          where: {
            id: userId,
          },
          returning: true,
          raw: true,
          plain: true,
        })
      )[1];

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.updateUser': { userId, updateData } };
      throw error;
    }
  }

  async updateStreakToZero() {
    try {
      const users = (
        await this.repository.update(
          { streak: 0 },
          {
            where: {
              [Op.and]: {
                streak: { [Op.gt]: 0 },
                lastStreak: { [Op.gte]: moment().utc().startOf('day').subtract(1, 'day') },
              },
            },
            attributes: ['id', 'lastStreak', 'streak'],
            returning: true,
            raw: true,
          }
        )
      )[1];

      return users;
    } catch (error) {
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
          attributes: ['id', 'email', 'password'],
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
          attributes: ['id', 'mobile', 'password'],
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
          attributes: ['id', 'userName', 'password'],
        })
      )[0];

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { userName } };
      throw error;
    }
  }
};
