require('dotenv').config();

const express = require('express');
const app = express();

const router = require('./controller/router');

const { removeExpiredSessionsJob, updateStreakToZeroJob } = require('./helpers/cronJob');

/* Used to parse the incoming request bodies in a middleware before your handlers, available under the
req.body property. */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Calling the router function and passing the app object to it. */
router(app);

/* This is the port that the server is listening to. */
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Cron job that runs every 5th minute to remove expired sessions
removeExpiredSessionsJob.start();

// Cron job that runs every day at 12 am to update the streak
// if there is no activity on the previous day
updateStreakToZeroJob.start();