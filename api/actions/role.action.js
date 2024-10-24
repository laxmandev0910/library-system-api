/**
 * Module: Role Action
 * Info: Provide handlers to manage Role's related actions
 **/

// Import Module dependencies.
const RoleModel = require("../models/role.model");

/**
 * Handle bulk role insertions
 */
const insertManyRole = async (payload) => {
  await RoleModel.insertMany(payload);
};

/**
 * Handle bulk role deletions
 */
const deleteAllRole = async () => {
  await RoleModel.deleteMany();
};

module.exports = {
  insertManyRole,
  deleteAllRole,
};
