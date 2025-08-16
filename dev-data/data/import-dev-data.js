const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
const User = require("./../../models/userModel");
const Review = require("./../../models/reviewModel");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const importData = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Connected to MongoDB database from import dev data file");

    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
    );
    const users = JSON.parse(
      fs.readFileSync(`${__dirname}/users.json`, "utf-8")
    );
    const reviews = JSON.parse(
      fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
    );

    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
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
    await User.deleteMany();
    await Review.deleteMany();
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
