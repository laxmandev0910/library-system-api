/**
 * Module: Config
 * Info: Api related config options
 **/

module.exports = {
  APP_PORT: parseInt(process.env.APP_PORT, 10),

  NODE_ENV: process.env.NODE_ENV,

  APP_LOG: {
    LOG: process.env.APP_LOG_LEVEL || "info",
    SYNC: process.env.APP_LOG_LEVEL || false,
  },

  APP_GRACEFUL_TIMEOUT: 10000,

  BORROWED_BOOK_MAX_DAYS: process.env.BORROWED_BOOK_MAX_DAYS || 7,

  MONGO_DB: {
    USE_URI: process.env.MONGO_DB_USE_URI || false,
    URI: process.env.MONGO_DB_USE_URI,
    NAME: process.env.MONGO_DB_NAME,
    HOST: process.env.MONGO_DB_HOST || "localhost",
    PORT: process.env.MONGO_DB_PORT,
    USERNAME: process.env.MONGO_DB_USERNAME,
    PASSWORD: process.env.MONGO_DB_PASSWORD,
  },
  REDIS: {
    USE_URI: process.env.REDIS_DB_USE_URI || false,
    URI: process.env.REDIS_DB_URI,
    HOST: process.env.REDIS_HOST || "localhost",
    PORT: process.env.REDIS_PORT,
    PASSWORD: process.env.REDIS_PASSWORD,
    DB_INDEX: process.env.REDIS_DB_INDEX || 0,
  },
  RATE_LIMITER: {
    API_REQUEST_WINDOW: process.env.API_REQUEST_WINDOW || 60, // 40 request per minute by default
    API_REQUEST_LIMIT: process.env.API_REQUEST_LIMIT || 40,
  },
  API: {
    PREFIX: "/api/v1",
  },

  JWT: {
    TOKEN_SECRET: process.env.APP_JWT_TOKEN_SECRET,
    TOKEN_EXPIRE: process.env.APP_JWT_TOKEN_EXPIRE || 36000, // i hr default
    REFRESH_SECRET: process.env.APP_JWT_REFRESH_SECRET,
    REFRESH_EXPIRE: process.env.APP_JWT_REFRESH_EXPIRE || 86400, // 7 day default
  },
};
