const createError = require('http-errors');

const { validateEmail, validatePassword, hashPassword, signToken } = require('../../helpers/user');

module.exports = class UserService {
  constructor({ userRepository, sessionService }) {
    this.userRepository = userRepository;
    this.sessionService = sessionService;
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
      if (existingEmail) {
        throw createError(400, 'Email already exists');
      }

      const existingMobile = await this.userRepository.findByMobile(mobile);
      if (existingMobile) {
        throw createError(400, 'Mobile number already exists');
      }

      const existingUserName = await this.userRepository.findByUserName(userName);
      if (existingUserName) {
        throw createError(400, 'UserName already exists');
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

      userObject.password = hashPassword(userObject.password);

      await this.userRepository.create(userObject);

      return { message: 'Registered Successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.register': { userObject } };
      throw error;
    }
  }

  async extractUserCredentials(credentials) {
    try {
      const [email, mobile, userName] = await Promise.all([
        this.userRepository.findByEmail(credentials.email || ''),
        this.userRepository.findByMobile(credentials.mobile || 0),
        this.userRepository.findByUserName(credentials.userName || ''),
      ]);

      const user = email || mobile || userName;

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.extractUserCredentials': { credentials } };
      throw error;
    }
  }

  async login(credentials, userAgent) {
    try {
      const user = await this.extractUserCredentials(credentials);
      if (!user) {
        throw createError(422, 'Invalid credentials');
      }

      const hashedPassword = hashPassword(credentials.password);
      if (hashedPassword !== user.password) {
        throw createError(422, 'Invalid credentials');
      }

      let accessToken;
      const session = await this.sessionService.fetchSessionByAgent(user.id, userAgent);
      if (!session) {
        accessToken = signToken(user);

        await this.sessionService.create(user.id, accessToken, userAgent);
      } else {
        accessToken = session.accessToken;
      }

      return { message: 'Logged-In Successfully!', accessToken };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.login': { credentials, userAgent } };
      throw error;
    }
  }

  async logout(userId, userAgent) {
    try {
      await this.sessionService.remove(userId, userAgent);

      return { message: 'Logged-Out Successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.logout': { userId, userAgent } };
      throw error;
    }
  }
};
