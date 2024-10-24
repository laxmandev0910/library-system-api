/**
 * Module: Borrow Book Action Module
 * Info: Borrow Book module management related functions
 **/

// Import Module dependencies.
const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment");
const ApiError = require("../helpers/errors/apiError");
const { prepareModelData } = require("../helpers/modelUtil");
const BookModel = require("../models/book.model");
const BorrowedBookModel = require("../models/borrowedBook.model");
const validator = require("../helpers/validator");
const BookAction = require("../actions/book.action");
const logger = require("../services/logger.service");

const checkBookForBorrow = async (bookID) => {
  const book = await BookAction.fetchRecord(bookID);
  if (!book) {
    throw new ApiError("Book not exists", 404, null, true, true);
  }
  if (
    book.status !== "available" ||
    (book.status === "available" && book.borrowedCopies === book.copies)
  ) {
    throw new ApiError(
      "Book is not available for borrow. Please try later when available",
      419,
      book,
      true,
      true
    );
  }
  return book;
};
/**
 * Add Book Record
 */
const borrowedRecord = async (bookID, userID, payload) => {
  let book, borrowedBook, modelSchema;

  //Check book available or not
  book = await checkBookForBorrow(bookID);

  // check book already borrowed by user or not
  borrowedBook = await fetchRecord(bookID, userID);
  if (borrowedBook) {
    throw new ApiError(
      "You have already borrowed this book. Please return it first to borrow again.",
      419,
      borrowedBook,
      true,
      true
    );
  }

  //Set  Fields
  modelSchema = {
    book: bookID,
    user: userID,
    borrowAt: moment(),
    dueAt: moment.utc(payload.dueAt),
  };

  borrowedBook = new BorrowedBookModel(modelSchema);
  book = await BookModel.findByIdAndUpdate(
    book._id,
    {
      borrowedCopies: ++book.borrowedCopies,
    },
    {
      returnOriginal: false,
    }
  ).exec();
  await borrowedBook.save();
  return borrowedBook;
};

/**
 * Update Book Record by id
 */
const returnRecord = async (bookID, userID) => {
  let borrowedBook, modelSchema, book;

  //Set  Fields
  borrowedBook = await fetchRecord(bookID, userID);
  if (!borrowedBook) {
    return null;
  }

  book = borrowedBook.book;
  //Return book
  let format = "DD-MMM-YYYY",
    status = "returned",
    dueAt = moment(borrowedBook.dueAt),
    returnedAt = moment(),
    overdue,
    overdueDays = 0;

  // Check overdue
  if (returnedAt.isAfter(dueAt)) {
    status = "overdue";
    overdueDays = returnedAt.diff(dueAt, "days");
  }

  modelSchema = {
    returnedAt: returnedAt,
    overdueDays: overdueDays,
    status: status,
  };

  borrowedBook = await BorrowedBookModel.findByIdAndUpdate(
    borrowedBook._id,
    modelSchema,
    {
      returnOriginal: false,
    }
  ).exec();

  data = await BookModel.findByIdAndUpdate(
    book._id,
    {
      borrowedCopies: --book.borrowedCopies,
    },
    {
      returnOriginal: false,
    }
  ).exec();
  return borrowedBook;
};

/**
 * List Borrowed Books
 */
const listRecord = async (queryParams, user) => {
  //Find user type for relative query filters and conditions
  let borrowedBooks = [];
  const isUser = user.role !== "USER" ? false : true;
  //Get filter uery based on supported params
  const filterQuery = BorrowedBookModel.filterQuery(
    queryParams,
    isUser,
    user.userID
  );
  //Get count of filtered docs
  BorrowedBookModel.params.count = await BorrowedBookModel.countDocuments(
    filterQuery
  ).exec();

  //Build find query to retrieve docs
  const Query = BorrowedBookModel.find(filterQuery, "-__v");

  // Apply pagination
  Query.paginate(queryParams);
  Query.sortBy(queryParams);
  if (!isUser) {
    Query.populate("user", "name role");
  }

  Query.populate("book", "title author isbn borrowedCopies");
  //Get Records
  borrowedBooks = await Query.lean().exec();

  return {
    metadata: {
      params: BorrowedBookModel.params,
      filters: BorrowedBookModel.filters,
    },
    data: borrowedBooks,
    resource: "borrowedbooks",
    message: "All borrowed book records listed successfully.",
  };
};

/**
 * Update Book Record by id
 */
const fetchRecord = async (bookID, userID) => {
  let borrowedBook, query;

  if (!ObjectId.isValid(bookID)) {
    return null;
  }

  //Set  Fields
  query = {
    book: bookID,
    user: userID,
    returnedAt: null,
  };
  return await BorrowedBookModel.findOne(query).populate("book").exec();
};

module.exports = {
  borrowedRecord,
  returnRecord,
  listRecord,
  fetchRecord,
};
