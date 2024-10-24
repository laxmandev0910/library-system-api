/**
 * Module: Api Middlewear
 * Info: List All Middlewears
 **/

// Import Api Middlewears
const authenticate = require("./authenticate.middlewear");
const authorizeAccess = require("./authorizeAccess.middlewear");

// Import Schema Validator Middlewears.
const signupSchemaValidator = require("./validators/signinSchema.validator");
const signinSchemaValidator = require("./validators/signinSchema.validator");
const bookSchemaValidator = require("./validators/bookSchema.validator");
const borrowedBookSchemaValidator = require("./validators/borrowedSchema.validator");
const apiCacheResponse = require("./apiCacheResponse.middlewear");

module.exports = {
  signupSchemaValidator,
  signinSchemaValidator,
  authenticate,
  authorizeAccess,
  bookSchemaValidator,
  borrowedBookSchemaValidator,
  apiCacheResponse,
};
