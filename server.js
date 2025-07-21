// Require modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import shutting down function
const { shuttingDownServer, setServer } = require("./utils/shutdown");

// Catch unexpected errors not handled by try/catch
process.on("uncaughtException", (err) => {
  shuttingDownServer("⛔ Uncaught Exception ⛔", err);
});

// Configure environment variables
dotenv.config({ path: "./.env" });

// Import the Express app
const app = require("./app");

// Define the port
const port = process.env.PORT || 3000;

// Prepare the database connection string
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

let server;

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(DB);
    console.log("Connected to MongoDB database");

    // Start the server
    server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
      setServer(server);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Start the server
startServer();

// Catching unhandled rejections
process.on("unhandledRejection", (err) => {
  shuttingDownServer("⛔ Unhandled Promise Rejection ⛔", err);
});
