/**
 * Module: Book Route
 * Info: Manage Book resource related routes
 **/

// Import Module dependencies.
const express = require("express");
const router = express.Router();
const BorrowedBookController = require("../controllers/borrowedBook.controller");
const BorrowedBookModel = require("../models/borrowedBook.model");
const {
  authenticate,
  authorizeAccess,
  apiCacheResponse,
} = require("../middlewears/api.middlewear");

/**
 * Get Book Record
 */
router.get(
  "/:id",
  [
    authenticate,
    authorizeAccess(["USER"]),
    apiCacheResponse(BorrowedBookModel.cachePrefix),
  ],
  BorrowedBookController.fetchBorrowedBook
);

/**
 * List Book Record
 */
router.get(
  "/",
  [authenticate, apiCacheResponse(BorrowedBookModel.cachePrefix, true)],
  BorrowedBookController.listBorrowedBook
);

module.exports = router;
