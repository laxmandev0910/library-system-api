/**
 * Module: Auth Route
 * Info: Manage Auth related routes
 **/

// Import Module dependencies.
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const {
  signupSchemaValidator,
  signinSchemaValidator,
} = require("../middlewears/api.middlewear");
const apiRateLimit = require("../middlewears/apiRateLimit.middlewear");

/**
 * Signup Route for Admin users
 */
router.post(
  "/panel/signup",
  signupSchemaValidator,
  AuthController.authAdminSignUp
);

/**
 * Signup Route for users
 */
router.post("/signup", signupSchemaValidator, AuthController.authUserSignUp);

/**
 * Signin Route for all users
 */
router.post("/signin", [signinSchemaValidator], AuthController.authSignIn);

module.exports = router;
