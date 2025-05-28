const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const importData = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Connected to MongoDB database from import dev data file");

    const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8");
    const data = JSON.parse(tours);

    await Tour.create(data);
    console.log("Data successfully loaded!");
  } catch (error) {
    console.error("Error loading data:", error.message);
  }
};

const deleteData = async () => {
  await mongoose.connect(DB);
  console.log("Connected to MongoDB database from import dev data file");

  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (error) {
    console.error("Error deleting data:", error.message);
  }
};

if (process.argv[2] === "--import") {
  importData().then(() => mongoose.connection.close());
} else if (process.argv[2] === "--delete") {
  deleteData().then(() => mongoose.connection.close());
}
