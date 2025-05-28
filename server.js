// Require modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Configure environment variables
dotenv.config({ path: "./config.env" });

// Import the Express app
const app = require("./app");

// Define the port
const port = process.env.PORT || 3000;

// Prepare the database connection string
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(DB);
    console.log("Connected to MongoDB database");

    // Start the server
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Start the server
startServer();
