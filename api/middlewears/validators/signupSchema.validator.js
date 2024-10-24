/**
 * Module: Signup Validator Middlewear
 * Info: Validate data for signup
 **/

// Import Module dependencies.
const validaor = require("../../helpers/validator");
const ApiError = require("../../helpers/errors/apiError");
const logger = require("../../services/logger.service");

const rules = {
  name: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 1,
      maximum: 100,
      message: "can not be longer then 100 characters",
    },
  },
  username: {
    presence: { allowEmpty: false },
    length: {
      minimum: 1,
      maximum: 50,
      message: "can not be longer then 50 characters",
    },
    format: {
      pattern: /^[a-zA-Z0-9-]{3,}/,
      message: "can only have allowed characters: `a-z`, `A-Z`, `0-9` and `-`",
    },
  },
  email: {
    presence: { allowEmpty: false },
    email: true,
  },
  password: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&-_])[A-Za-z\d@$#!%*?&-_]{8,50}$/,
      message:
        "must be strong one. It must contains atlease one uppercase and lowercase letter, one digit and one allowed special charcters from @$#!%*?&-_",
    },
  },
};

const signupSchemaValidator = async (req, res, next) => {
  try {
    //Perform validation
    logger.info("Sign Up Error");
    let errors = validaor(req.body, rules);

    if (errors) {
      throw new ApiError(
        "There are errors in your inputs. Please review and fix them.",
        422,
        errors,
        true
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = signupSchemaValidator;
