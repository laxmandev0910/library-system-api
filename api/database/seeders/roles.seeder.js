/**
 * Module: Role Model Seeder
 **/

// Import Module dependencies.
const RoleAction = require("../../actions/role.action");
const logger = require("../../services/logger.service");

// Set data
const collection = [
  { _id: "super", name: "Super Admin" },
  { _id: "admin", name: "Admin" },
  { _id: "user", name: "User" },
];

// Define script
const seedRoles = async () => {
  try {
    await RoleAction.deleteAllRole();
    await RoleAction.insertManyRole(collection);
    logger.info("Roles seeded successfully!");
  } catch (error) {
    logger.error("Error seeding data:", error);
  }
};

module.exports = seedRoles;
