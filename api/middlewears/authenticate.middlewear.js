/**
 * Module: verifyAuthAccess Middlewear
 * Info: Verify authorization token
 **/

// Import Module dependencies.
const ApiError = require("../helpers/errors/apiError");
const JwtService = require("../services/jwt.service");
const reportApiError = require("../helpers/reportApiError");
const jwtCodes = new Set(["JsonWebTokenError", "TokenExpiredError"]);
const authenticate = async (req, res, next) => {
  try {
    //Perform validation
    if (!req.headers.authorization) {
      throw new ApiError(
        "Authorization header not provided.",
        400,
        null,
        true,
        true
      );
    }
    const authHeader = req.headers.authorization;

    //Extracting token from authorization header
    const token = authHeader && authHeader.split(" ")[1];

    //Checking if the token is null
    if (!token) {
      throw new ApiError(
        "Authentication required. No valid token is provided.",
        401,
        null,
        true
      );
    }

    //Decode token

    const user = await JwtService.verifyAccessToken(token);

    req.user = user;
    next();
  } catch (error) {
    if (jwtCodes.has(error.name)) {
      req.logger.warn("JWT Error captured");
      error = new ApiError(
        "Authentication required. Token is no longer valid.",
        401,
        null,
        true
      );
    }
    next(reportApiError(error));
  }
};

module.exports = authenticate;
