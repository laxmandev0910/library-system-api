/**
 * Module: User Model
 * Info: Define user schema
 **/

// Import Module dependencies.
const mongoose = require("mongoose");
const { Schema } = mongoose;
const ApiError = require("../helpers/errors/apiError");
const ActiveModel = "Role";
const RoleSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      uppercase: true,
      maxlength: 10,
      trim: true,
      match: [/^[a-zA-Z]+$/, "It allows only characters: a-zA-Z"],
    },
    name: {
      type: String,
      required: true,
      maxlength: [20, "Input must be no longer than 20 characers"],
    },
    info: {
      type: String,
      default: null,
      maxlength: [70, "Input must be no longer than 70 characers"],
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);

//Define Static properties
RoleSchema.statics.provideRole = async (role) => {
  role = await mongoose.model(ActiveModel).findOne({ _id: role });
  if (!role) {
    throw new ApiError("Role not found.", 409, null, true);
  }
  return role._id;
};
// `Role` model represents `roles` collection in db
module.exports = mongoose.model(ActiveModel, RoleSchema);
