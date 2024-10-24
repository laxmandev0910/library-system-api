/**
 * Module: User Action
 * Info: Provide handlers to manage User's related actions
 **/

// Import Module dependencies.
const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;
const ApiError = require("../helpers/errors/apiError");
const logger = require("../services/logger.service");

/**
 * Create new user
 */
const createUser = async (modelSchema) => {
  const user = new UserModel(modelSchema);
  await user.save();
  return user;
};

/**
 * Check user exists based on where query given
 */
const fetchUser = async (
  whereOptions,
  populateRole = false,
  includePass = false
) => {
  const query = UserModel.findOne(whereOptions);

  // Build query
  if (includePass) {
    query.select("+password");
  }
  if (populateRole) {
    query.populate("role");
  }

  const user = await query.exec();
  return user;
};

const checkBookUser = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const user = await UserModel.findById(id).exec();
  if (!user) {
    throw new ApiError("User not exists", 404, null, true, true);
  }
  if (user && user.role && !["SUPER", "ADMIN"].includes(user.role)) {
    throw new ApiError(
      "No access for requested resource.",
      403,
      null,
      true,
      true
    );
  }
  return user;
};

const checkBookBorrower = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const user = await UserModel.findById(id).exec();
  if (!user) {
    throw new ApiError("User not exists", 404, null, true, true);
  }
  if (user && user.role && !["USER"].includes(user.role)) {
    throw new ApiError(
      "No access for requested resource.",
      403,
      null,
      true,
      true
    );
  }
  return user;
};

const getAdminIds = async () => {
  let data = await UserModel.find({ role: "ADMIN" })
    .select({
      _id: 1, // By default
    })
    .limit(5)
    .lean()
    .exec();
  const ids = data.map((user) => user._id);
  if (!ids || !(ids && Array.isArray(ids))) {
    throw new ApiError("No admin users found.", 404, null, true, true);
  }
  return ids;
};

module.exports = {
  createUser,
  fetchUser,
  checkBookUser,
  checkBookBorrower,
  getAdminIds,
};
