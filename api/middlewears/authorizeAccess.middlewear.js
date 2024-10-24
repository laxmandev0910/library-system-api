/**
 * Module: authorizeAccess Middlewear
 * Info: Verify authorization based on user role
 **/

// Import Module dependencies.
const ApiError = require("../helpers/errors/apiError");
const reportApiError = require("../helpers/reportApiError");
const validator = require("../helpers/validator");

const authorizeAccess = (authorizeRoles) => {
  return async (req, res, next) => {
    try {
      //Perform validation
      const user = req.user;
      if (
        validator.isEmpty(authorizeRoles) ||
        !validator.isArray(authorizeRoles) ||
        validator.isEmpty(user)
      ) {
        throw new ApiError(
          "No access for requested resource.",
          403,
          null,
          true
        );
      }

      //Check Access
      if (!authorizeRoles.includes(user.role)) {
        throw new ApiError(
          "No access for requested resource.",
          403,
          null,
          true
        );
      }
      next();
    } catch (error) {
      next(reportApiError(error));
    }
  };
};

module.exports = authorizeAccess;
