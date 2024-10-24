/**
 * Module: Api Route
 * Info: Register all api routes for handle requests
 **/

// Import Module dependencies.
const { API } = require("../config/api.config");
const baseRoutes = require("./base.route");
const authRoutes = require("./auth.route");
const bookRoutes = require("./book.route");
const borrowedBookRoutes = require("./borrowedBook.route");

// Registe routes
const registerApiRoutes = (server) => {
  server.use(`${API.PREFIX}`, baseRoutes);
  server.use(`${API.PREFIX}/auth`, authRoutes);
  server.use(`${API.PREFIX}/books`, bookRoutes);
  server.use(`${API.PREFIX}/borrowed-books`, borrowedBookRoutes);
};

module.exports = registerApiRoutes;
