/**
 * Module: Book Schema Validator
 * Info: Validate data for book post request
 **/

// Import Module dependencies.
const validaor = require("../../helpers/validator");
const ApiError = require("../../helpers/errors/apiError");

const rules = {
  title: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 1,
      maximum: 100,
      message: "can not be longer then 100 characters",
    },
  },
  isbn: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 10,
      maximum: 20,
      message: "must be 10-20 characters long",
    },
    format: {
      pattern: /^[0-9-]{10,}/,
      message: "can only contain 0-9 and -",
    },
  },
  genre: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      maximum: 20,
      message: "must not be longer than 20 characters",
    },
  },
  language: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      maximum: 20,
      message: "must not be longer than 20 characters",
    },
  },
  author: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 1,
      maximum: 100,
      message: "can not be longer then 100 characters",
    },
  },
  publisher: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 1,
      maximum: 100,
      message: "can not be longer then 100 characters",
    },
  },
  publicationYear: {
    presence: { allowEmpty: false, message: "can't be blank" },
    validYear: {},
  },
  pages: {
    presence: { allowEmpty: false, message: "can't be blank" },
    numericality: {
      noStrings: true,
      onlyInteger: true,
    },
  },
  copies: {
    presence: { allowEmpty: false, message: "can't be blank" },
    numericality: {
      noStrings: true,
      onlyInteger: true,
    },
  },
};

const bookSchemaValidator = async (req, res, next) => {
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

module.exports = bookSchemaValidator;
