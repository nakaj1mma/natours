const AppError = require("../utils/appError");

// Handle DB errors
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};
const handleDublicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(.*?)\1/);
  const message = `Dublicate fields value: ${value[0]}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
//

// Sending errors
const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};
const sendErrorProd = (error, res) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });

    // Programming or other unknow error: don't leak error details
  } else {
    // 1) Log error
    console.error("❌ERROR❌\n", error);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message:
        "Something went wrong in server side, please try again later or contact technical support",
    });
  }
};
//

// Global error handler
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = Object.create(error);

    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.code === 11000) err = handleDublicateFieldsDB(err);

    sendErrorProd(err, res);
  }
};
//
