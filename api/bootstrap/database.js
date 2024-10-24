/**
 * Module: Database
 * Info: Provide database service related handler
 **/

// Import Module dependencies.
const mongoose = require("mongoose");
const logger = require("../services/logger.service");
const { MONGO_DB, NODE_ENV } = require("../config/api.config");

//Define Database Class
class Database {
  async connectService() {
    try {
      const MONGO_DB_URI = this.getConnectionString();
      await mongoose.connect(MONGO_DB_URI, {
        dbName: MONGO_DB.NAME,
        maxPoolSize: 10,
      });
      logger.info("Database connection established ::" + MONGO_DB.NAME);
    } catch (error) {
      logger.error("Mongodb Error :: " + error.message);
      throw error;
    }
  }

  getConnectionString() {
    let URI = MONGO_DB.URI;
    if (MONGO_DB.USE_CONN === true) {
      URI = MONGO_DB.URI;
    } else {
      URI = `mongodb://${MONGO_DB.USERNAME}:${MONGO_DB.PASSWORD}@${MONGO_DB.HOST}:${MONGO_DB.PORT}`;
    }
    return URI;
  }

  async disconnectService() {
    try {
      await mongoose.connection.close();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Database();
