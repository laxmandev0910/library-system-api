/**
 * Module: Server
 * Info: Api main entry point
 **/

// Import Module dependencies.
const app = require("./bootstrap/app");
const database = require("./bootstrap/database");
const http = require("http");
const logger = require("./services/logger.service");
const { APP_PORT, APP_GRACEFUL_TIMEOUT } = require("./config/api.config");
const Redis = require("./bootstrap/redis");
const { apiConfig, checkApiKeys } = require("./helpers/apiConfig");

// Create HTTP server
const server = http.createServer(app);

// Graceful Shutdown of Server handling
const shutdownServer = async (signal) => {
  try {
    await checkApiKeys();
    logger.error(signal + " detected. Shutdown server process started.");
    // Prevent new requests
    await server.close();
    await database.disconnectService();
    await redis.close();
    // Set a timeout for graceful shutdown
    setTimeout(() => {
      logger.error(
        `Graceful shutdown timed out after  ${APP_GRACEFUL_TIMEOUT}ms, forcing exit`
      );
      process.exit(1);
    }, APP_GRACEFUL_TIMEOUT);
  } catch (error) {}
};

//Init express ap
const startServer = async () => {
  try {
    await server.listen(APP_PORT);
    logger.info("Server started on port : " + server.address().port);
  } catch (error) {
    logger.error("Server Error:: " + error.message);
    throw error;
  }
};

//Start all reuired services
const initServer = async () => {
  try {
    //Check Api Reuired Keys
    //await checkApiKeys();

    // Start Mongo DB
    await database.connectService();

    // Start Redis
    await Redis.connectService();
    //Start Server App
    await startServer();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

// Event listeners for graceful shutdown
process.on("SIGINT", () => {
  shutdownServer("SIGINT");
});
process.on("SIGTERM", () => {
  shutdownServer("SIGTERM");
});

// Start HTTP server
initServer();

module.exports = app;
