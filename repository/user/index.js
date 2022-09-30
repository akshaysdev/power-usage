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
      const users = await this.repository.findAll();

      return users;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = (await this.repository.findAll({
        where: {
          email,
        },
      }))[0]?.dataValues;
      console.log(`🚀 ~ file: index.js ~ line 37 ~ UserRepository ~ findByEmail ~ user`, user)

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { email } };
      throw error;
    }
  }

  async findByMobile(mobile) {
    try {
      const user = await this.repository.findAll({
        where: {
          mobile,
        },
      });

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByMobile': { mobile } };
      throw error;
    }
  }

  async findByUserName(userName) {
    try {
      const user = await this.repository.findAll({
        where: {
          userName,
        },
      });

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { userName } };
      throw error;
    }
  }
};
