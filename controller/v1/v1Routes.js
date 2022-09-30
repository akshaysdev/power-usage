const express = require('express');

const v1Routes = express.Router();

const { userRouter } = require('./user/routes');

v1Routes.use('/auth', userRouter);

module.exports = v1Routes;
