const logger = require('../utils/logger');

const notFound = (req, res, _next) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
};

const errorHandler = (err, req, res, _next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  const statusCode = err.status || 500;
  res.status(statusCode).render('errors/500', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message,
  });
};

module.exports = { notFound, errorHandler };
