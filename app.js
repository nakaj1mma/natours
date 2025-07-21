// Core modules
const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");

// Importing route handlers
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// Creating the Express app
const app = express();

// Enable logging only in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware to parse incoming JSON data
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(`${__dirname}/public`));

// Mounting route handlers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// Exporting the app
module.exports = app;
