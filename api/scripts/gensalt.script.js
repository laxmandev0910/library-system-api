const crypto = require("crypto");
const logger = require("../services/logger.service");

const salt = crypto.randomBytes(64).toString("hex");
logger.info(salt);
return salt;
