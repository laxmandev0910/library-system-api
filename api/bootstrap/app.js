/**
 * Module: App
 * Info: Setup express app
 **/

// Import Module dependencies.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const logger = require("../services/logger.service");
const apiRateLimit = require("../middlewears/apiRateLimit.middlewear");
const reportApiError = require("../helpers/reportApiError");
const registerApiRoutes = require("../routes/api.route");
const { ApiErrorResponse } = require("../helpers/apiResponse");
const ApiError = require("../helpers/errors/apiError");
// Init express app
const app = express();

// Setup express app
app.disable("x-powered-by");
app.enable("trust proxy");
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

app.use(apiRateLimit);
//Register API routes
registerApiRoutes(app);

// Handle 404 Route Error
app.use((req, res) => {
  throw new ApiError("No Route Found", 404, null, true, true);
});

// Error handling middleware
app.use(async (error, req, res, next) => {
  let status = 500,
    message = "Something went wrong. Please try again.",
    data = null;

  //Report and Handle global known errors if not done earlier
  error = reportApiError(error);

  if (error instanceof ApiError && error.operational) {
    status = error.code;
    message = error.message;
    data = error.errors;
  }

  // Send Api error response to client
  return await ApiErrorResponse(res, message, status, data);
});
// Export module
module.exports = app;
