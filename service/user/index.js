const createError = require('http-errors');
const moment = require('moment');
const { jobType } = require('../../constants');

const { validateEmail, validatePassword, hashPassword, signToken } = require('../../helpers/user');

module.exports = class UserService {
  constructor({ userRepository, sessionService, cacheService, queueBackgroundJob }) {
    this.userRepository = userRepository;
    this.sessionService = sessionService;
    this.cacheService = cacheService;
    this.queueBackgroundJob = queueBackgroundJob;
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

        this.queueBackgroundJob({
          name: jobType.createSession.name,
          meta: { userId: user.id, accessToken, userAgent },
          className: this.sessionService,
          functionName: this.sessionService.create,
        });
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
      this.queueBackgroundJob({
        name: jobType.removeSession.name,
        meta: { userId, userAgent },
        className: this.sessionService,
        functionName: this.sessionService.remove,
      });

      return { message: 'Logged-Out Successfully!' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.logout': { userId, userAgent } };
      throw error;
    }
  }

  async updateStreak({ userId, date }) {
    try {
      const user = await this.userRepository.findById(userId);
      const updateData = { streak: user.streak, lastStreak: user.lastStreak };

      const lastStreak = moment(user.lastStreak).utc().startOf('day').add(1, 'day');
      const currentstreak = moment(date).utc().startOf('day');

      if (lastStreak.isSame(currentstreak)) updateData.streak += 1;
      else updateData.streak = 1;

      updateData.lastStreak = currentstreak;
      const updatedUser = await this.userRepository.updateUser(userId, updateData);

      this.queueBackgroundJob({
        name: jobType.cacheStreak.name,
        meta: { userId: updatedUser.id, streak: { lastStreak: updatedUser.lastStreak, streak: updatedUser.streak } },
        className: this.cacheService,
        functionName: this.cacheService.setStreak,
      });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.updateStreak': { userId, date } };
      throw error;
    }
  }

  async getStreak(userId) {
    try {
      const streak = await this.cacheService.getStreak(userId);

      return streak;
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.getStreak': { userId } };
      throw error;
    }
  }

  async updateStreakToZero() {
    try {
      const users = await this.userRepository.updateStreakToZero();

      this.queueBackgroundJob({
        name: jobType.cacheStreaks.name,
        meta: { allUsers: users },
        className: this.cacheService,
        functionName: this.cacheService.setStreaks,
      });

      return users;
    } catch (error) {
      throw error;
    }
  }
};
