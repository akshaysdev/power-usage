require('dotenv').config();

const express = require('express');
const app = express();

const router = require('./controller/router');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
