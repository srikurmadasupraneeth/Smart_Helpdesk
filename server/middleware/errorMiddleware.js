// Generic error handler to catch unhandled errors
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Avoid leaking stack trace in production environment
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

module.exports = {
  errorHandler,
};
