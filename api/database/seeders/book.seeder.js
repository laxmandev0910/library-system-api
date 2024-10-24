/**
 * Module: Book Model Seeder
 **/

// Import Module dependencies.
const { getAdminIds } = require("../../actions/user.action");
const { deleteAllBook, insertManyBook } = require("../../actions/book.action");
const logger = require("../../services/logger.service");
const bookCollection = require("../fakers/book.faker");

// Set data

// Define script
const seedBooks = async () => {
  try {
    const adminIDS = await getAdminIds();
    if (!adminIDS && !Array.isArray(adminIDS)) {
      throw new Error("No admin users found");
    }
    const collection = await bookCollection(adminIDS);
    await deleteAllBook();
    await insertManyBook(collection);
    logger.info("Books seeded successfully!");
  } catch (error) {
    logger.error("Error seeding data:");
    logger.error(error);
  }
};

module.exports = seedBooks;
