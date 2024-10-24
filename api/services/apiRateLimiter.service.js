/**
 * Module: Api Rate Limit Middlewear
 * Info: Verify authorization token
 **/

// Import Module dependencies.
const { RateLimiterRedis } = require("rate-limiter-flexible");
const { RATE_LIMITER } = require("../config/api.config");
const { API_REQUEST_LIMIT, API_REQUEST_WINDOW } = RATE_LIMITER;
const redis = require("../bootstrap/redis");
const limiterTypes = new Set(["api", "login"]);

class ApiRateLimiter {
  static async getOptions(type) {
    let options = {};
    //Check type
    if (!limiterTypes.has(type)) {
      throw new TypeError(
        `Invalid arguments: type ${type} is not supported for rate limiter.`,
        400
      );
    }

    // Default rate
    const redisClient = await redis.connectService();

    if (type === "login") {
      options = {
        storeClient: redisClient,
        duration: 60, // Per minute
        points: 3,
        inMemoryBlockOnConsumed: 4,
        keyPrefix: "x-api-login-ratelimit-",
      };
    } else {
      // Define default api all endpoints rate limiter
      options = {
        storeClient: redisClient,
        duration: API_REQUEST_WINDOW, // Per minute
        points: API_REQUEST_LIMIT,
        inMemoryBlockOnConsumed: API_REQUEST_LIMIT + 1,
        keyPrefix: "x-api-ratelimit-",
      };
    }
    return options;
  } //end fn

  static async getInstance(req) {
    const options = await ApiRateLimiter.getOptions(
      ApiRateLimiter.getType(req.path)
    );
    return new RateLimiterRedis(options);
  } //end fn

  static async getConsumeKey(req) {
    let consumeKey = req.ip;
    return consumeKey;
  }

  static async resetRateLimit(req) {
    const consumeKey = await ApiRateLimiter.getConsumeKey(req);
    const rateLimiter = await ApiRateLimiter.getInstance(req);
    rateLimiter.delete(consumeKey);
  }
  static getType(url) {
    let type = "api";
    if (url && url.includes("signin")) {
      type = "login";
    }
    return type;
  }
}

module.exports = ApiRateLimiter;
