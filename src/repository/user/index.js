const moment = require('moment');
const { Op } = require('sequelize');

const { UserModel } = require('./model');

module.exports = class UserRepository {
  constructor({ sequelize }) {
    UserModel(sequelize);
    this.repository = sequelize.models.User;
  }

  /**
   * It creates a user
   * @param userObject - The object that will be used to create the user.
   * @returns The user object
   */
  async create(userObject) {
    try {
      const user = await this.repository.create(userObject);

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.create': { userObject } };
      throw error;
    }
  }

  /**
   * It finds a user by their id
   * @param userId - The id of the user we want to find.
   * @returns The user object with the id, lastStreak, streak, and createdAt attributes.
   */
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

  /**
   * It updates a user in the database
   * @param userId - The id of the user to update
   * @param updateData - The data to update the user with.
   * @returns The user object
   */
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

  /**
   * It updates the streak of all users who have a streak greater than zero and whose lastStreak is less
   * than yesterday's date to zero
   * @returns An array of users with their id, lastStreak, and streak.
   */
  async updateStreakToZero() {
    try {
      const users = (
        await this.repository.update(
          { streak: 0 },
          {
            where: {
              [Op.and]: {
                streak: { [Op.gt]: 0 },
                lastStreak: { [Op.lt]: moment().utc().startOf('day').subtract(1, 'day') },
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

  /**
   * It finds a user by email
   * @param email - The email address of the user to find.
   * @returns The user object with the id, email, and password.
   */
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

  /**
   * It finds a user by their mobile number
   * @param mobile - The mobile number of the user.
   * @returns The user object with the id, mobile, and password.
   */
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

  /**
   * It finds a user by their userName
   * @param userName - The userName of the user we want to find.
   * @returns The user object with the id, userName, and password.
   */
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
