const Review = require("../models/reviewModel");

// const catchAsync = require("../utils/catchAsync");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllReviews = getAll(Review);

exports.getReview = getOne(Review);

exports.createNewReview = createOne(Review);

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
