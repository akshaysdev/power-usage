const express = require('express');
const userRouter = express.Router();

const user = require('./authentication');
const { verifyToken } = require('./authorization');

userRouter.post('/register', user.register);

userRouter.post('/login', user.login);

// TODO: to be removed
userRouter.get('/all', verifyToken, user.getAllUsers);

module.exports = { userRouter };
