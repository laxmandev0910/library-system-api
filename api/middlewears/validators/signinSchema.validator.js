/**
 * Module: Signup Validator Middlewear
 * Info: Validate data for signup
 **/

// Import Module dependencies.
const validaor = require("../../helpers/validator");
const ApiError = require("../../helpers/errors/apiError");

const rules = {
  username: {
    presence: { allowEmpty: false },
  },
  password: {
    presence: { allowEmpty: false },
  },
};

const signinSchemaValidator = async (req, res, next) => {
  try {
    //Perform validation
    let errors = validaor(req.body, rules);
    if (errors) {
      throw new ApiError(
        "There are errors in your inputs. Please review and fix them.",
        422,
        errors,
        true,
        true
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = signinSchemaValidator;
