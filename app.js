// Core modules
const express = require("express");
const morgan = require("morgan");

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

// Exporting the app
module.exports = app;
