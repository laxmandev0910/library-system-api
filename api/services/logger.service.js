/**
 * Module: Logger
 * Info: Use for logging
 **/

// Import Module dependencies.
const pino = require("pino");
const pretty = require("pino-pretty");
const moment = require("moment");
const { APP_LOG } = require("../config/api.config");

// Configure logging options
const config = pretty({
  colorize: true,
  sync: APP_LOG.SYNC,
  mkdir: true,
  customPrettifiers: {
    time: (timestamp) => `TIME:: ${moment().format("Do, MM YYYY, h:mm A")}`,
  },
});

// const logger = pino({
//   level: APP_LOG_LEVEL,
//   formatters: {
//     level: (label) => {
//       return {
//         level: label.toUpperCase(),
//       };
//     },
//   },
//   timestamp: () =>
//     `,"timestamp":"${moment().format("MMM Do YYYY, h:mm:ss a")}"`,
// });
const logger = pino(config);
module.exports = logger;
