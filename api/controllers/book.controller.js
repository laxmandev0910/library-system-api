/**
 * Module: Book Controller
 * Info: Manage all Book resource's route handling methods
 **/

// Import Module dependencies.
const { ApiResponse, ApiSearchResponse } = require("../helpers/apiResponse");
const reportApiError = require("../helpers/reportApiError");
const BookAction = require("../actions/book.action");
const ApiCacheService = require("../services/apiCache.service");
const BookModel = require("../models/book.model");

/**
 * Handle add new book request
 */
const addBookRecord = async (req, res, next) => {
  try {
    let data = await BookAction.addRecord(req.body);
    ApiCacheService.deleteKeysWithPrefix(BookModel.cachePrefix);
    await ApiResponse(res, "New book record created.", 201, data);
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Update Existing Book details
 */
const updateBookRecord = async (req, res, next) => {
  try {
    let data = await BookAction.updateRecord(req.params.id, req.body);

    if (data) {
      ApiCacheService.deleteKeysWithPrefix(BookModel.cachePrefix);
      await ApiResponse(res, "Book record updated.", 200, data);
    } else {
      await ApiResponse(res, "Book not found.", 404);
    }
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Update Existing Book details
 */
const updateBookRecordStatus = async (req, res, next) => {
  try {
    let data = await BookAction.updateRecordStatus(req.params.id, req.body);
    if (data) {
      ApiCacheService.deleteKeysWithPrefix(BookModel.cachePrefix);
      await ApiResponse(res, "Book record updated.", 200, data);
    } else {
      await ApiResponse(res, "Book not found.", 404);
    }
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Delete Existing Book which is available
 */
const deleteBookRecord = async (req, res, next) => {
  try {
    let data = await BookAction.deleteRecord(req.params.id);
    if (data) {
      ApiCacheService.deleteKeysWithPrefix(BookModel.cachePrefix);
      await ApiResponse(res, "Book record deleted.", 204, data);
    } else {
      await ApiResponse(res, "Book not found.", 404);
    }
  } catch (error) {
    next(reportApiError(error));
  }
};

/**
 * Fetch Existing Book details
 */
const fetchBookRecord = async (req, res, next) => {
  try {
    let data = await BookAction.fetchRecord(req.params.id);
    if (data) {
      await ApiCacheService.storeData(req, "books", data);
      await ApiResponse(res, "Book record retrieved.", 200, data);
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
const listBookRecord = async (req, res, next) => {
  try {
    let collection = await BookAction.listRecord(req.query);
    await ApiCacheService.storeData(req, "books", collection, true);
    await ApiSearchResponse(res, collection.message, collection);
  } catch (error) {
    next(reportApiError(error));
  }
};

module.exports = {
  addBookRecord,
  updateBookRecord,
  updateBookRecordStatus,
  deleteBookRecord,
  fetchBookRecord,
  listBookRecord,
};
