// Centralized Error Handler Middleware

const errorHandler = (err, req, res, next) => {
  console.error(err); // log error
  const statusCode = err.statusCode || 500; // code from err or default or 500
  const message = err.message || "An error occurred on the server"; // message from err or default

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
