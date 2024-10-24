/**
 * Module: Model Util
 * Info: Provide handler for Model Schema format
 **/

// Import Module dependencies.
const ApiError = require("./errors/apiError");
const prepareModelData = async (payload, fields) => {
  try {
    // Ensure originalObject and desiredKeys are valid
    let error = null,
      modelObj = {};
    if (!payload || typeof payload !== "object") {
      error = "Invalid arguments: payload must be an object.";
    }

    if (!fields || !Array.isArray(fields)) {
      error = "Invalid arguments:  fields must be an array.";
    }

    if (error) {
      throw new BadError(error, 400);
    }
    // Iterate over desired keys and extract values
    for (const field of fields) {
      if (payload.hasOwnProperty(field)) {
        modelObj[field] = payload[field];
      } else {
        throw new TypeError(
          `Invalid arguments: field ${field} not present in payload`,
          400
        );
      }
    }

    return modelObj;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  prepareModelData,
};
