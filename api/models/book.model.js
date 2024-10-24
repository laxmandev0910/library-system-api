/**
 * Module: Book Model
 * Info: Define book schema
 **/

// Import Module dependencies.
const mongoose = require("mongoose");
const { Schema } = mongoose;
const ApiError = require("../helpers/errors/apiError");
const ActiveModel = "Book";
const { checkBookUser } = require("../actions/user.action");
const validator = require("../helpers/validator");
const logger = require("../services/logger.service");
const escapeRegex = require("escape-string-regexp-node");

// Model Properties for Schema
const bookStatus = ["available", "unavailable", "reserved"];
const sortFields = ["_id", "isbn", "author", "title"];

// Define Book Schema
const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Input must be no longer than 100 characers"],
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [10, "Input must be atleast 10 characers long"],
      maxlength: [20, "Input must be no longer than 20 characers"],
    },
    genre: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: [20, "Input must be no longer than 30 characers"],
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: [20, "Input must be no longer than 20 characers"],
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Input must be no longer than 100 characers"],
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      cast: "{VALUE} is not a number",
      required: true,
    },
    pages: {
      type: Number,
      cast: "{VALUE} is not a number",
      required: true,
    },
    copies: {
      type: Number,
      cast: "{VALUE} is not a number",
      required: true,
    },
    borrowedCopies: {
      type: Number,
      cast: "{VALUE} is not a number",
      default: 0,
    },
    status: {
      type: String,
      lowercase: true,
      trim: true,
      enum: {
        values: bookStatus,
        message: "{VALUE} is not supported",
      },
      default: "available",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);

// Validate User exists or not
BookSchema.path("user").validate(async (value) => {
  return await checkBookUser(value);
}, "User not exists");

/**
 * Define Static model proprties for api sharing
 */
BookSchema.statics.fillableFields = [
  "title",
  "isbn",
  "genre",
  "language",
  "author",
  "publisher",
  "publicationYear",
  "pages",
  "copies",
];
BookSchema.statics.status = bookStatus;
BookSchema.statics.cachePrefix = "books";

BookSchema.statics.filters = {
  search: "Filter by Title",
  isbn: "Filter by start with ISBN No",
  author: "Filter by author",
  language: "Filter by language",
  genre: "Filter by genre",
  status: bookStatus,
};

BookSchema.statics.params = {};

/**
 * @method Filter Query for Book's Collection
 * @param {*} params // Query parmas
 */

BookSchema.statics.filterQuery = function (params) {
  let query = {};
  // Return current instance for chaining
  if (params.search) {
    query.title = new RegExp(escapeRegex(params.search));
  }
  if (params.isbn) {
    query.isbn = new RegExp("^" + escapeRegex(params.isbn));
  }
  if (params.author) {
    query.author = new RegExp(escapeRegex(params.author));
  }
  if (params.language) {
    query.language = params.language;
  }
  if (params.genre) {
    query.genre = params.genre;
  }
  if (params.status) {
    query.status = params.status;
  }
  return query;
};

/**
 * @method Sort Query for Book's Collection
 * @param {*} params // Query parmas
 */
BookSchema.query.sortBy = function (params) {
  let query = {},
    sortKey = "_id",
    sortOrder = "asc",
    sortKeys = new Set(sortFields);

  if (params) {
    if (params.sortKey && sortKeys.has(params.sortKey)) {
      sortKey = params.sortKey;
    }
    if (params.sortOrder && params.sortOrder === "desc") {
      sortOrder = "desc";
    }
  }

  // Set properties
  BookSchema.statics.params["sortKey"] = sortKey;
  BookSchema.statics.params["sortOrder"] = sortOrder;
  BookSchema.statics.params["sortFields"] = sortFields;

  query[sortKey] = sortOrder;

  // Return current instance for chaining
  return this.sort(query);
};

/**
 * @method Pagination Query for Book's Collection
 * @param {*} params // Query parmas
 * @returns
 */
BookSchema.query.paginate = function (params) {
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
  BookSchema.statics.params["page"] = page;
  BookSchema.statics.params["limit"] = currentLimit;
  BookSchema.statics.params["skip"] = skip;

  return this.skip(skip).limit(currentLimit);
};

// `Book` model represents `books` collection in db
module.exports = mongoose.model(ActiveModel, BookSchema);
