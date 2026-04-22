require('dotenv').config();
const env = require('./config/env');
const sequelize = require('./config/database');
const app = require('./app');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    app.listen(env.PORT, () => {
      console.log(` Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();


