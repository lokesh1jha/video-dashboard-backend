const winston = require('winston');

// A logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default logging level to 'info'
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to log messages
    winston.format.json() // Format log messages as JSON
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    // new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
    // new winston.transports.File({ filename: 'combined.log' }) // Log all messages to another file
  ]
});

// Function to log an error message
function logError(message, error) {
  logger.error(message, { error: serializeError(error) });
}

// Function to log debug information
function logDebug(message) {
  logger.debug(message);
}

// Function to log general information
function logInfo(message) {
  logger.info(message);
}

// Function to serialize error object to make it serializable
function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return error;
}

module.exports = {
  logError,
  logDebug,
  logInfo
};
