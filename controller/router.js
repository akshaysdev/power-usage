const express = require('express');
const { authError } = require('../error/response');

const v1Routes = require('./v1/v1Routes');

const router = (app) => {
  const apiRoutes = express.Router();

  apiRoutes.use('/v1', v1Routes);

  apiRoutes.use(authError);

  app.use('/api', apiRoutes);
};

module.exports = router;
