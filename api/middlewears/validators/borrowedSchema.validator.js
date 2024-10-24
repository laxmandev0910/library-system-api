/**
 * Module: Borrowed Book Schema Validator
 * Info: Validate data for borrowed book post request
 **/

// Import Module dependencies.
const validaor = require("../../helpers/validator");
const ApiError = require("../../helpers/errors/apiError");
const moment = require("moment");
const { BORROWED_BOOK_MAX_DAYS } = require("../../config/api.config");

const rules = {
  dueAt: {
    presence: { allowEmpty: false, message: "can't be blank" },
    datetime: {
      dateOnly: false,
      earliest: moment().utc().add(1, "days").format("YYYY-MM-DD"),
      latest: moment().add(BORROWED_BOOK_MAX_DAYS, "days").format("YYYY-MM-DD"),
      tooEarly: "^dueAt must be 1 day longer atleast from today",
      tooLate: `^dueAt must not be ${BORROWED_BOOK_MAX_DAYS} days longer from today`,
    },
  },
};

const borrowedBookSchemaValidator = async (req, res, next) => {
  try {
    //Perform validation
    req.body.user = req.user.userID;
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

module.exports = borrowedBookSchemaValidator;
