/**
 * Module: Api Config
 * Info: Provide handler for all api response
 **/

// Import Module dependencies.
const apiConfig = require("nconf");
const validator = require("../helpers/validator");
const logger = require("../services/logger.service");
const ApiError = require("../helpers/errors/apiError");

apiConfig.argv().env();
apiConfig.env.readOnly = true;

const requiredKeys = [
  "APP_PORT",
  "APP_JWT_REFRESH_SECRET",
  "APP_JWT_REFRESH_SECRET",
  "REDIS_URI",
  "MONGO_DB_URI",
];

const checkApiKeys = async () => {
  try {
    const rules = {
      APP_PORT: {
        presence: {
          allowEmpty: false,
          message: "^must be provided as environment variable.",
        },
      },
      APP_JWT_TOKEN_SECRET: {
        presence: {
          allowEmpty: false,
          message: "^must be provided as environment variable.",
        },
      },
      APP_JWT_REFRESH_SECRET: {
        presence: {
          allowEmpty: false,
          message: "^must be provided as environment variable.",
        },
      },
      MONGO_DB_URI: {
        presence: {
          allowEmpty: false,
          message: "^must be provided as environment variable.",
        },
      },
      REDIS_URI: {
        presence: {
          allowEmpty: false,
          message: "^must be provided as environment variable.",
        },
      },
    };
    let errors = validator(process.env, rules, { format: "apiJson" });
    if (errors) {
      logger.error(errors);
      throw new ApiError(
        "App environment keys: are not provided.",
        400,
        errors,
        false,
        false
      );
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  checkApiKeys: checkApiKeys,
  apiConfig: apiConfig,
};
