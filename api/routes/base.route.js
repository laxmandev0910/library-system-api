/**
 * Module: Base Route
 * Info: Manage All Api Base Routes
 **/

// Import Module dependencies.
const express = require("express");
const router = express.Router();

const { ApiResponse } = require("../helpers/apiResponse");

/**
 * Welcome Route of Api
 */
router.get("/", async (req, res, next) => {
  try {
    await ApiResponse(res, "Welcome to Library Management App");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
