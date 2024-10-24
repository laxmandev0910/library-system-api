/**
 * Module: Borrowed Book Controller
 * Info: Manage all Borrowed Book resource's route handling methods
 **/

// Import Module dependencies.
const { ApiResponse, ApiSearchResponse } = require("../helpers/apiResponse");
const reportApiError = require("../helpers/reportApiError");
const BorrowedBookAction = require("../actions/borrowedBook.action");
const ApiCacheService = require("../services/apiCache.service");
const BorrowedBookModel = require("../models/borrowedBook.model");

/**
 * Handle add new book request
 */
const newBorrowedBook = async (req, res, next) => {
  try {
    let data = await BorrowedBookAction.borrowedRecord(
      req.params.id,
      req.user.userID,
      req.body
    );
    ApiCacheService.deleteKeysWithPrefix(BorrowedBookModel.cachePrefix);
    await ApiResponse(res, "Book borrowed successfully.", 201, data);
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Update Existing BorrowedBook details
 */
const returnedBorrowedBook = async (req, res, next) => {
  try {
    let data = await BorrowedBookAction.returnRecord(
      req.params.id,
      req.user.userID
    );

    if (data) {
      ApiCacheService.deleteKeysWithPrefix(BorrowedBookModel.cachePrefix);
      await ApiResponse(res, "Book returned successfully.", 200, data);
    } else {
      await ApiResponse(
        res,
        "No borrowed book found for return. Please check the book ID or contact us for assistance.",
        404
      );
    }
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Update Existing BorrowedBook details
 */
const fetchBorrowedBook = async (req, res, next) => {
  try {
    let data = await BorrowedBookAction.fetchRecord(req.params.id);

    if (data) {
      // if (req.user.role === "USER") {
      //   req.query.hasuser = req.user.userID;
      // }
      await ApiCacheService.storeData(req, BorrowedBookModel.cachePrefix, data);
      await ApiResponse(res, "Book returned successfully.", 200, data);
    } else {
      await ApiResponse(res, "Book not found.", 404);
    }
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * List Book Records based on query's filters, sorting and pagination
 */
const listBorrowedBook = async (req, res, next) => {
  try {
    let collection = await BorrowedBookAction.listRecord(req.query, req.user);
    await ApiCacheService.storeData(
      req,
      BorrowedBookModel.cachePrefix,
      collection,
      true
    );
    await ApiSearchResponse(res, "All book's record listed.", collection);
  } catch (error) {
    next(reportApiError(error));
  }
};

module.exports = {
  newBorrowedBook,
  returnedBorrowedBook,
  listBorrowedBook,
  fetchBorrowedBook,
};
