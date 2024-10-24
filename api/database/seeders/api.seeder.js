/**
 * Module: Api Seeder Module
 * Info: Run all api seed's data
 **/

// Import Module dependencies.
const database = require("../../bootstrap/database");
const logger = require("../../services/logger.service");

// Import All Seeding
const seedRoles = require("../seeders/roles.seeder");
const seedBooks = require("../seeders/book.seeder");

// Script for seeding all collections
const runApiSeeders = async () => {
  try {
    // Start Database Connection
    await database.connectService();

    logger.info("Database seeding started.");

    // Run All Seeders
    await seedRoles();

    //await seedBooks();

    logger.info("Database seeding finished.");

    // Close Database Connection
    await database.disconnectService();
  } catch (error) {
    logger.error("Database seeding failed due to some error");
    logger.error(error);
  }
};

//Run Script
runApiSeeders();
