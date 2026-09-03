const winston = require('winston');
const morgan = require('morgan');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'app.log') }),
    new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log'), level: 'error' }),
  ],
});

// Morgan stream that writes to winston
const morganStream = {
  write: (message) => logger.info(message.trim()),
};

// Morgan middleware for HTTP request logging
const morganMiddleware = morgan('short', { stream: morganStream });

module.exports = logger;
module.exports.morganMiddleware = morganMiddleware;
