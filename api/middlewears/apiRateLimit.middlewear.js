/**
 * Module: Api Rate Limit Middlewear
 * Info: Verify authorization token
 **/

// Import Module dependencies.
const ApiRateLimiter = require("../services/apiRateLimiter.service");
const { RATE_LIMITER } = require("../config/api.config");
const { API_REQUEST_LIMIT, API_REQUEST_WINDOW } = RATE_LIMITER;
const ApiError = require("../helpers/errors/apiError");

const apiRateLimit = async (req, res, next) => {
  try {
    const rateLimiter = await ApiRateLimiter.getInstance(req);
    const consumeKey = await ApiRateLimiter.getConsumeKey(req);

    //If rate limit exceed , set headers and throw error
    const consumeStatus = await rateLimiter.get(consumeKey);
    if (consumeStatus && consumeStatus.remainingPoints < 1) {
      req.logger.warn(consumeStatus, "check");
      const retrySecs = Math.round(consumeStatus.msBeforeNext / 1000) || 1;
      res.setHeader("Retry-After", retrySecs);
      res.setHeader(
        "X-Api-Rate-Limit",
        `${consumeStatus.remainingPoints}/${
          consumeStatus.remainingPoints + consumeStatus.consumedPoints
        }`
      );
      throw new ApiError("Too Many Requests", 429, null, true, true);
    }

    //If rate limit consumed , set headers
    const limiterStatus = await rateLimiter.consume(consumeKey);
    const retrySecs = Math.round(limiterStatus.msBeforeNext / 1000) || 1;

    const apiRateLimit = `${limiterStatus.remainingPoints}/${
      limiterStatus.remainingPoints + limiterStatus.consumedPoints
    }`;
    res.setHeader("Retry-After", retrySecs);
    res.setHeader("X-Api-Rate-Limit", apiRateLimit);
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = apiRateLimit;
