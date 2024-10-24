/**
 * Module: BorrowedBook Model
 * Info: Define borrowed book schema
 **/

// Import Module dependencies.
const mongoose = require("mongoose");
const leanVirtuals = require("mongoose-lean-virtuals");
const { Schema } = mongoose;
const ObjectId = require("mongoose").Types.ObjectId;
const ApiError = require("../helpers/errors/apiError");
const { checkBookBorrower } = require("../actions/user.action");
const validator = require("../helpers/validator");
const logger = require("../services/logger.service");
const escapeRegex = require("escape-string-regexp-node");
const moment = require("moment");
const ActiveModel = "BorrowedBook";

// Model Properties for Schema
const borrowStatus = ["borrowed", "returned", "overdue"];
const sortFields = ["book_id", "status", "book"];

const BorrowedBookSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "No user found"],
    },
    borrowAt: {
      type: Date,
      required: true,
    },
    dueAt: {
      type: Date,
      required: true,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    overdueDays: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: borrowStatus,
        message: "{VALUE} is not supported",
      },
      default: "borrowed",
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);

// Validate User exists or not
BorrowedBookSchema.path("user").validate(async (value) => {
  return await checkBookBorrower(value);
}, "User does not exist");

BorrowedBookSchema.virtual("borrowDate").get(function () {
  return moment(this.borrowAt).format("d-M-Y");
});
BorrowedBookSchema.virtual("dueDate").get(function () {
  return moment(this.borrowAt).format("d-M-Y");
});

/**
 * Define Static model proprties for api sharing
 */
BorrowedBookSchema.statics.fillableFields = ["dueAt"];
BorrowedBookSchema.statics.status = borrowStatus;
BorrowedBookSchema.statics.cachePrefix = "borrowedbooks";

BorrowedBookSchema.statics.filters = {
  bookID: "Filter by book's id",
  userID: "Filter by user's id",
  status: `Filter by status : ${borrowStatus.join("|")}`,
};

BorrowedBookSchema.statics.params = {};

/**
 * @method Filter Query for Book's Collection
 * @param {*} params // Query parmas
 */

BorrowedBookSchema.statics.filterQuery = function (params, isUser, user) {
  let query = {};
  // Return current instance for chaining

  //Default condition for User role to access only his records

  if (isUser) {
    delete BorrowedBookSchema.statics.filters.userID;
    query["user"] = new ObjectId(user);
  }
  if (!isUser && query.userID && ObjectId.isValid(query.userID)) {
    query["user"] = new ObjectId(query.userID);
  }
  if (query.bookID && ObjectId.isValid(query.bookID)) {
    query["book"] = new ObjectId(bookID);
  }
  return query;
};

/**
 * @method Pagination Query for Book's Collection
 * @param {*} params // Query parmas
 * @returns
 */
BorrowedBookSchema.query.paginate = function (params) {
  let page = 1,
    currentLimit = 10,
    maxLimit = 20,
    skip = 0;

  if (params) {
    let { limit, page } = params;
    if (limit && validator.isInteger(+limit)) {
      limit = +limit;
      currentLimit = limit > 0 && limit < maxLimit + 1 ? limit : limit;
    }
    if (page && validator.isInteger(+page)) {
      page = +page;
      skip = page > 1 ? (page - 1) * currentLimit : 0;
    }
  }

  // Set properties
  BorrowedBookSchema.statics.params["page"] = page;
  BorrowedBookSchema.statics.params["limit"] = currentLimit;
  BorrowedBookSchema.statics.params["skip"] = skip;

  return this.skip(skip).limit(currentLimit);
};

/**
 * @method Sort Query for Book's Collection
 * @param {*} params // Query parmas
 */
BorrowedBookSchema.query.sortBy = function (params) {
  let query = {},
    sortKey = "_id",
    sortOrder = "asc",
    sortKeys = new Set(sortFields);

  if (params) {
    if (params.sortKey && sortKeys.has(params.sortKey)) {
      sortKey = params.sortKey;
    }
    if (params.sortOrder === "desc") {
      sortOrder = "desc";
    }
  }

  // Set properties
  BorrowedBookSchema.statics.params["sortKey"] = sortKey;
  BorrowedBookSchema.statics.params["sortOrder"] = sortOrder;
  BorrowedBookSchema.statics.params["sortFields"] = sortFields;

  query[sortKey] = sortOrder;

  // Return current instance for chaining
  return this.sort(query);
};

BorrowedBookSchema.plugin(leanVirtuals);
// `Book` model represents `books` collection in db
module.exports = mongoose.model(ActiveModel, BorrowedBookSchema);
