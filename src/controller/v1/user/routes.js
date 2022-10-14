const express = require('express');
const userRouter = express.Router();

const user = require('./authentication');
const { verifyToken } = require('./authorization');
const { authError } = require('../../../error/response');

userRouter.post('/register', user.register, authError);

userRouter.post('/login', user.login, authError);

userRouter.get('/logout', verifyToken, user.logout, authError);

userRouter.get('/sessions', verifyToken, user.fetchSessions, authError);

module.exports = { userRouter };
