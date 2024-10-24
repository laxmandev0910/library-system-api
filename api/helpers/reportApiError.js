/**
 * Module: Report Error
 * Info: Log the error if not reported once
 **/

// Import Module dependencies.
const logger = require("../services/logger.service");
const ApiError = require("../helpers/errors/apiError");
const validaor = require("./validator");

/**
 * Global API error hnadler o report error annd set errors for response
 */
const reportApiError = (error) => {
  let data = {},
    code = 422,
    message = "There are errors in your inputs. Please review and fix them.";

  //Return repoted ApiError
  if (!error.reported && process.env.NODE_ENV !== "test") {
    logger.error(error);
    error.reported = true;
  }
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Unique Database Constraint Error
  if (error.code && error.code === 11000) {
    let field = Object.keys(error.keyValue)[0];
    data[field] = `${field} is already taken. Please try wih another.`;
    error = new ApiError(message, code, data, true, true);
    return error;
  }

  // Handle mongoose validaion error
  let msg = "";
  if (error.name && error.name === "ValidationError" && error.errors) {
    if (error.errors.user) {
      data = null;
      message = error.errors.user.message;
      if (error.errors.user.reason) {
        code = error.errors.user.reason.code;
      } else {
        code = 401;
      }
    } else {
      data = {};
      Object.keys(error.errors).forEach(function (key, index) {
        data[key] = error.errors[key].message;
      });
    }
    error = new ApiError(message, code, data, true, true);

    return error;
  }

  return error;
};
module.exports = reportApiError;
