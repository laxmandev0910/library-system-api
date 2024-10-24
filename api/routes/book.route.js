/**
 * Module: Book Route
 * Info: Manage Book resource related routes
 **/

// Import Module dependencies.
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book.controller");
const BorrowedBookController = require("../controllers/borrowedBook.controller");
const BookModel = require("../models/book.model");
const {
  authenticate,
  authorizeAccess,
  bookSchemaValidator,
  borrowedBookSchemaValidator,
  apiCacheResponse,
} = require("../middlewears/api.middlewear");

/**
 * Add New Book
 */
router.post(
  "/",
  [authenticate, authorizeAccess(["ADMIN"]), bookSchemaValidator],
  BookController.addBookRecord
);

/**
 * Update Book Record
 */
router.put(
  "/:id",
  [authenticate, authorizeAccess(["ADMIN"]), bookSchemaValidator],
  BookController.updateBookRecord
);

/**
 * Update Book status
 */
router.patch(
  "/:id/status",
  [authenticate, authorizeAccess(["ADMIN"])],
  BookController.updateBookRecordStatus
);

/**
 * Delete Book Record
 */
router.delete(
  "/:id",
  [authenticate, authorizeAccess(["ADMIN"])],
  BookController.deleteBookRecord
);

/**
 * Get Book Record
 */
router.get(
  "/:id",
  [authenticate, apiCacheResponse(BookModel.cachePrefix)],
  BookController.fetchBookRecord
);

/**
 * List Book Record
 */
router.get(
  "/",
  [authenticate, apiCacheResponse(BookModel.cachePrefix, true)],
  BookController.listBookRecord
);

/**
 * Add New Book
 */
router.post(
  "/:id/borrow",
  [authenticate, authorizeAccess(["USER"]), borrowedBookSchemaValidator],
  BorrowedBookController.newBorrowedBook
);

/**
 * Update Book Record
 */
router.patch(
  "/:id/return",
  [authenticate, authorizeAccess(["USER"])],
  BorrowedBookController.returnedBorrowedBook
);

module.exports = router;
