const createError = require('http-errors');
const express = require('express');

const v1Routes = require('./v1/v1Routes');

const router = (app) => {
  const apiRoutes = express.Router();

  apiRoutes.use('/v1', v1Routes);

  apiRoutes.use((req, res, next) => {
    if (!req.route) {
      const error = createError(404, 'No route matched');
      return next(error);
    }
    return next();
  });

  app.use('/api', apiRoutes);
};

module.exports = router;
