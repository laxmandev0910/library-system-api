/**
 * Module: Auth Action
 * Info: Provide handlers to manage Auth's related actions
 **/

// Import Module dependencies.
const bcrypt = require("bcrypt");
const validator = require("../helpers/validator");
const JwtService = require("../services/jwt.service");
const ApiError = require("../helpers/errors/apiError");
const { prepareModelData } = require("../helpers/modelUtil");
const { createUser, fetchUser } = require("./user.action");
const Role = require("../models/role.model");
const logger = require("../services/logger.service");

/**
 * Handle new admin signup process
 */
const signupAdmin = async (payload) => {
  try {
    let fields = ["name", "username", "email", "password"],
      modelSchema = {};

    //Set  Fields

    modelSchema = await prepareModelData(payload, fields);
    modelSchema.role = await Role.provideRole("ADMIN");

    //Create User
    return await createUser(modelSchema);
  } catch (error) {
    throw error;
  }
};

/**
 * Handle new user signup process
 */
const signupUser = async (payload) => {
  try {
    let fields = ["name", "username", "email", "password"],
      modelSchema = {},
      data;

    //Set  Fields
    modelSchema = await prepareModelData(payload, fields);
    modelSchema.role = "USER";

    data = await createUser(modelSchema);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle signin process for all users
 */
const signin = async (payload) => {
  try {
    let whereQuery = {},
      data,
      user,
      accessToken,
      refreshToken;

    // Handle signup for username or email
    if (!validator.single(payload.username, { email: true })) {
      whereQuery.email = payload.username;
    } else {
      whereQuery.username = payload.username;
    }

    //Check user exists
    user = await fetchUser(whereQuery, false, true);

    if (!user) {
      throw new ApiError("Invalid Auth Credentials", 401, null, true);
    }

    //Check password is valid
    await matchPassword(payload.password, user.password);

    //Set token payload
    data = {
      userID: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    // Generate JWT's tokens
    accessToken = await JwtService.signAccessToken(data);
    refreshToken = await JwtService.signAccessToken(data);

    //Set response data
    data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Method: Compare user password
 */
const matchPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new ApiError("Invalid Auth Credentials", 401, null, true);
    }
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signupAdmin,
  signupUser,
  signin,
};
