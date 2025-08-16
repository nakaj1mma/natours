// const mongoose = require("mongoose");
// Importing the Tour model
const Tour = require("./../models/tourModel");
// Importing utils
const catchAsync = require("../utils/catchAsync");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, { path: "reviews" });

exports.createTour = createOne(Tour);

exports.updateTour = updateOne(Tour);

exports.deleteTour = deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  res.status(200).json({
    status: "success",
    message: "ok",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseInt(req.params.year);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: "$name",
        },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    // {
    //   $project: {
    //     _id: 0,
    //   },
    // },
    // {
    //   $limit: 12,
    // },
  ]);

  const formattedPlan = plan.map((item) => ({
    month: months[item._id - 1],
    numTourStarts: item.numTourStarts,
    tours: item.tours,
  }));

  res.status(200).json({
    status: "success",
    message: "ok",
    data: {
      plan: formattedPlan,
    },
  });
});
