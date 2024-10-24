/**
 * Module: Book Action Module
 * Info: Book module management related functions
 **/

// Import Module dependencies.
const ObjectId = require("mongoose").Types.ObjectId;
const ApiError = require("../helpers/errors/apiError");
const { prepareModelData } = require("../helpers/modelUtil");
const BookModel = require("../models/book.model");
const validator = require("../helpers/validator");

/**
 * Add Book Record
 */
const addRecord = async (payload) => {
  let modelSchema = {},
    book;
  //Set  Fields
  modelSchema = await prepareModelData(payload, BookModel.fillableFields);
  book = new BookModel(payload);
  await book.save();
  return book;
};

/**
 * Update Book Record by id
 */
const updateRecord = async (id, payload) => {
  let modelSchema = {},
    book;

  if (!ObjectId.isValid(id)) {
    return null;
  }
  //Set  Fields
  modelSchema = await prepareModelData(payload, BookModel.fillableFields);
  return await BookModel.findByIdAndUpdate(id, modelSchema, {
    returnOriginal: false,
  }).exec();
};

/**
 * Update Book Status by id
 */
const updateRecordStatus = async (id, payload) => {
  let modelSchema = {},
    book,
    errors;

  if (!ObjectId.isValid(id)) {
    return null;
  }

  await validateBookStatus(payload);
  //Set  Fields
  return await BookModel.findByIdAndUpdate(id, payload, {
    returnOriginal: false,
  }).exec();
};

/**
 * Validate Book status
 */
const validateBookStatus = async (payload) => {
  errors = validator(payload, {
    status: {
      presence: { allowEmpty: false, message: "can't be blank" },
      inclusion: {
        within: BookModel.status,
        message: "^Invalid status : %{value}",
      },
    },
  });

  if (errors) {
    throw new ApiError(
      "There are errors in your inputs. Please review and fix them.",
      422,
      errors,
      true,
      true
    );
  }
  return null;
};
/**
 * Delete Book Record by id
 */
const deleteRecord = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return await BookModel.findByIdAndDelete(id).exec();
};

/**
 * Get  Book Record by id
 */
const fetchRecord = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return await BookModel.findById(id).exec();
};

/**
 * Get  All Book Records with pagination and filters
 */
const listRecord = async (queryParams) => {
  //Add Count

  //Build Query
  const filterQuery = BookModel.filterQuery(queryParams);
  const count = await BookModel.countDocuments(filterQuery).exec();
  BookModel.params.count = count;

  const Query = BookModel.find(filterQuery, "-__v");

  Query.paginate(queryParams);
  Query.sortBy(queryParams);

  //Get Records
  const books = await Query.lean().exec();
  return {
    metadata: {
      params: BookModel.params,
      filters: BookModel.filters,
    },
    data: books,
    resource: "books",
    message: "All book records listed successfully.",
  };
};

/**
 * Handle bulk book insertions
 */
const insertManyBook = async (payload) => {
  await BookModel.insertMany(payload);
};

/**
 * Handle bulk book deletions
 */
const deleteAllBook = async () => {
  await BookModel.deleteMany();
};
module.exports = {
  addRecord,
  updateRecord,
  updateRecordStatus,
  deleteRecord,
  fetchRecord,
  listRecord,
  insertManyBook,
  deleteAllBook,
};
