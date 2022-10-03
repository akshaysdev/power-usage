const { Sequelize } = require('sequelize');

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const database = process.env.POSTGRES_DATABASE;
const password = process.env.POSTGRES_PASSWORD;
const port = process.env.POSTGRES_PORT;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the Database has been established successfully...');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = { sequelize };
