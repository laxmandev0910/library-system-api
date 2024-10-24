/**
 * Module: Api Response Module
 * Info: Provide handler for all api response
 **/

// Import Module dependencies.

const ApiResponse = async (res, msg, code = 200, data = null) => {
  const response = {
    status: code,
    message: msg,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(code).json(response);
};

const ApiSearchResponse = async (res, msg, collection = {}) => {
  let response = {
    status: 200,
    message: msg,
    metadata: collection.metadata,
  };
  response[`${collection.resource}`] = collection.data || [];
  return res.status(200).json(response);
};

const ApiErrorResponse = async (res, msg, code = 500, errors = null) => {
  const response = {
    status: code,
    message: msg,
  };
  if (errors !== null) {
    response.errors = errors;
  }
  return res.status(code).json(response);
};

module.exports = {
  ApiResponse,
  ApiErrorResponse,
  ApiSearchResponse,
};
