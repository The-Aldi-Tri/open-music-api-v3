const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    refresh_token_key: process.env.REFRESH_TOKEN_KEY,
    access_token_age: process.env.ACCESS_TOKEN_AGE,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

/*
Database Postgresql config are in .env file.
This app use node-postgres that can directly access .env file
so it is not need to programmatically configured.
*/

module.exports = config;
