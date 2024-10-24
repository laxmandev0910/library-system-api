/**
 * Module: Auth Controller
 * Info: Manage all Auth route's handling methods
 **/

// Import Module dependencies.
const { ApiResponse } = require("../helpers/apiResponse");
const reportApiError = require("../helpers/reportApiError");
const { signupAdmin, signupUser, signin } = require("../actions/auth.action");
const ApiRateLimiter = require("../services/apiRateLimiter.service");

/**
 * Handle new admin user signup process
 */
const authAdminSignUp = async (req, res, next) => {
  try {
    let data = await signupAdmin(req.body);

    await ApiResponse(
      res,
      "Thank you for signing up. You can now log in.",
      201,
      data
    );
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Handle new app user signup process
 */
const authUserSignUp = async (req, res, next) => {
  try {
    let data = await signupUser(req.body);

    await ApiResponse(
      res,
      "Thank you for signing up. You can now log in.",
      201,
      data
    );
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Handle new app user signup process
 */
const authSignIn = async (req, res, next) => {
  try {
    let data = await signin(req.body);

    await ApiRateLimiter.resetRateLimit(req);
    await ApiResponse(
      res,
      "SignIn into your account is successful.",
      200,
      data
    );
  } catch (error) {
    next(reportApiError(error));
  }
};

// exports.authSignOut = async (res, req, next) => {};

module.exports = {
  authAdminSignUp,
  authUserSignUp,
  authSignIn,
};
