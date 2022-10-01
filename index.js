require('dotenv').config();

const express = require('express');
const app = express();

const router = require('./controller/router');
const { removeExpiredSessionsJob } = require('./helpers/cronJob');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

removeExpiredSessionsJob.start();
