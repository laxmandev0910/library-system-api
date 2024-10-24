/**
 * Module: Redis Database
 * Info: Provide database service related handler
 **/

// Import Module dependencies.
const redis = require("redis");
const logger = require("../services/logger.service");
const { REDIS } = require("../config/api.config");

//Define Database Class
class RedisClient {
  constructor() {
    this.client = null;
    this.connected = false;
  }
  async connectService() {
    try {
      if (!this.connected) {
        const Options = await this.getConnectionOptions();
        const redisClient = redis.createClient(Options);
        redisClient.on("ready", (error) =>
          logger.info("Redis connection established")
        );
        await redisClient.connect();
        this.client = redisClient;
        this.connected = true;
      }

      return this.client;
    } catch (error) {
      if (error.code == "ECONNREFUSED") {
        logger.error("Redis Error:: Unable to connect.");
      }

      throw error;
    }
  }
  async getConnectionOptions() {
    let Options;
    if (REDIS.USE_CONN === true) {
      Options = {
        url: REDIS.URI,
        db: REDIS.DB_INDEX,
      };
    } else {
      Options = {
        socket: {
          host: REDIS.HOST,
          port: REDIS.PORT,
        },
        username: "default",
        password: REDIS.PASSWORD,
        db: REDIS.DB_INDEX,
      };
    }
    return Options;
  }

  async disconnectService() {
    try {
      if (!this.connected) {
        return;
      }
      this.connected = false;
      await this.client.quit();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RedisClient();
