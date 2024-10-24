/**
 * Module: ApiError
 * Info:  Custom error class for generate api error
 **/

class ApiError extends Error {
  constructor(
    message,
    code = 500,
    data = null,
    operational = false,
    reported = false
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.errors = data;
    this.operational = operational;
    this.reported = reported;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
