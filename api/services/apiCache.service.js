/**
 * Module: ApiCache
 * Info: Use for handling Cache related methods
 **/

// Import Module dependencies.
const redis = require("../bootstrap/redis");
const objectHash = require("object-hash");
const zlib = require("node:zlib");
const { Buffer } = require("node:buffer");
const logger = require("../services/logger.service");

class ApiCacheService {
  static cacheOptions = {};
  static async getRedisClient() {
    return await redis.connectService();
  }
  static async getKey(req, prefix = "api", hasQuery = false) {
    const cacheKeys = [prefix];
    let temp;
    temp = req.baseUrl || req.path;
    cacheKeys.push(`path:${temp}`);
    if ((temp = await ApiCacheService.addLogicQueryOption(req))) {
      cacheKeys.push(temp);
    }
    if (hasQuery) {
      cacheKeys.push("query");
      cacheKeys.push(objectHash.sha1(req.query));
    }
    return cacheKeys.join(":").toLowerCase();
  }

  static async storeData(req, prefix = "api", data, hasQuery = false) {
    const redisClient = await ApiCacheService.getRedisClient();
    const cacheKey = await ApiCacheService.getKey(req, prefix, hasQuery);
    const cacheValue = zlib
      .deflateSync(JSON.stringify(data))
      .toString("base64");
    return await redisClient.set(
      cacheKey,
      cacheValue,
      ApiCacheService.cacheOptions
    );
  }

  static async getData(req, prefix = "api", hasQuery = false) {
    const redisClient = await ApiCacheService.getRedisClient();

    const cacheKey = await ApiCacheService.getKey(req, prefix, hasQuery);
    let cacheValue = await redisClient.get(cacheKey);
    if (cacheValue) {
      cacheValue = zlib
        .inflateSync(Buffer.from(cacheValue, "base64"))
        .toString();
      try {
        cacheValue = JSON.parse(cacheValue);
      } catch (error) {
        return;
      }
    }

    return cacheValue;
  }

  static async deleteKeysWithPrefix(prefix = "api") {
    const redisClient = await ApiCacheService.getRedisClient();
    for await (const key of redisClient.scanIterator({
      TYPE: "string", // `SCAN` only
      MATCH: `${prefix}:*`,
      COUNT: 100,
    })) {
      redisClient.del(key);
    }
    return;
  }

  static async addLogicQueryOption(req) {
    const WebRoles = new Set(["USER"]);
    const WebLogicRoutes = new Set(["/api/v1/borrowed-books"]);
    if (!req.user) {
      return;
    }
    if (WebRoles.has(req.user.role) && WebLogicRoutes.has(req.baseUrl)) {
      return `logical:${req.user.userID}`;
    }

    return;
  }
}

module.exports = ApiCacheService;
