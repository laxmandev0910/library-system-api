/**
 * Module: User Model
 * Info: Define user common schema for platform and web users
 **/

// Import Module dependencies.
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const Role = require("./role.model");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [100, "Input must be no longer than 100 characers"],
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: [50, "Input must be no longer than 50 characers"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Input must be no longer than 100 characers"],
    },
    password: {
      type: String,
      unique: true,
      select: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["verify", "active", "inactive", "banned"],
        message: "{VALUE} is not supported",
      },
      default: "active",
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      ref: "Role",
      required: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);

//Static property for api response
UserSchema.statics.fillableFields = ["name", "username", "email", "password"];

// Validate Role exists or not
UserSchema.path("role").validate(async (value) => {
  return await Role.findById(value);
}, "Role does not exist");

// Hash user password before save to database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// `User` model represents `users` collection in db
module.exports = mongoose.model("User", UserSchema);
