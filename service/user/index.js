const createError = require('http-errors');
const crypto = require('crypto');

const { validateEmail, validatePassword } = require('../../helpers/user');
const { hash } = require('../../constants');

module.exports = class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async validate({ name, email, password, userName, mobile }) {
    try {
      if (!name) {
        throw createError(422, 'Name is required');
      }

      if (!email) {
        throw createError(422, 'Email is required');
      }

      validateEmail(email);

      if (!password) {
        throw createError(422, 'Password is required');
      }
      validatePassword(password);

      if (!userName) {
        throw createError(422, 'UserName is required');
      }

      if (!mobile) {
        throw createError(422, 'Mobile is required');
      }

      const existingEmail = await this.userRepository.findByEmail(email);
      if (existingEmail.length) {
        throw createError(401, 'User already exists');
      }

      const existingMobile = await this.userRepository.findByMobile(mobile);
      if (existingMobile.length) {
        throw createError(401, 'Mobile number already exists');
      }

      const existingUserName = await this.userRepository.findByUserName(userName);
      if (existingUserName.length) {
        throw createError(401, 'UserName already exists');
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.validate': { name, email, password, userName } };
      throw error;
    }
  }

  async register(userObject) {
    try {
      await this.validate(userObject);

      const token = crypto.randomBytes(32).toString('hex');
      userObject.token = token;

      const hashedPassword = crypto
        .pbkdf2Sync(userObject.password, hash.SALT, hash.ITERATIONS, hash.KEY_LEN, hash.DIGEST)
        .toString(`hex`);
      userObject.password = hashedPassword;

      await this.userRepository.create(userObject);

      return { message: 'Registered Successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.register': { userObject } };
      throw error;
    }
  }

  async login(credentials) {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        throw createError(422, 'Invalid email or password!');
      }

      const hashedPassword = crypto
        .pbkdf2Sync(credentials.password, hash.SALT, hash.ITERATIONS, hash.KEY_LEN, hash.DIGEST)
        .toString(`hex`);
      if (hashedPassword !== user.password) {
        throw createError(422, 'Invalid email or password!');
      }

      return { message: 'Logged-In Successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.login': { credentials } };
      throw error;
    }
  }

  async findAllUsers() {
    try {
      const users = await this.userRepository.findAll();

      return users;
    } catch (error) {
      throw error;
    }
  }
};
