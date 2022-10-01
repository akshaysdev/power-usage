const express = require('express');
const userRouter = express.Router();

const user = require('./authentication');
const { verifyToken } = require('./authorization');

userRouter.post('/register', user.register);

userRouter.post('/login', user.login);

userRouter.get('/logout', verifyToken, user.logout);

userRouter.get('/sessions', verifyToken, user.fetchAllSessions);

module.exports = { userRouter };
