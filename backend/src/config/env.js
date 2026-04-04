const { cleanEnv, str, port, num } = require('envalid');

const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  DB_HOST: str({ default: 'localhost' }),
  DB_PORT: port({ default: 3306 }),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '24h' }),
  CORS_ORIGIN: str({ default: 'http://localhost:5173' }),
});

module.exports = env;
