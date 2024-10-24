/**
 * Module: Api Cache Middlewear
 * Info: Send Cached response
 **/

// Import Module dependencies.
const reportApiError = require("../helpers/reportApiError");
const ApiCacheService = require("../services/apiCache.service");
const { ApiResponse, ApiSearchResponse } = require("../helpers/apiResponse");

const apiCacheResponse = (prefix = "api", hasQuery = false) => {
  return async (req, res, next) => {
    try {
      //Perform validation
      const cachedValue = await ApiCacheService.getData(req, prefix, hasQuery);
      if (cachedValue) {
        let collection = cachedValue;
        res.setHeader("X-API-CACHE", true);
        if (cachedValue && cachedValue.resource) {
          return await ApiSearchResponse(res, collection.message, collection);
        }
        return await ApiResponse(res, "Success", 200, cachedValue);
      }
      res.setHeader("X-API-CACHE", false);
      next();
    } catch (error) {
      next(reportApiError(error));
    }
  };
};
module.exports = apiCacheResponse;
