// Importing the Tour model
const Tour = require("./../models/tourModel");
// Importing error handler
const handleError = require("./../utils/errorHandler");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Filtering
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Build query
    let query = Tour.find(JSON.parse(queryStr));

    // -------- Sorting --------
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }
    // ------------------------

    // -------- Field limiting --------
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // --------------------------------

    // -------- Pagination --------
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 100;

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid 'page' parameter. It must be a positive number.",
      });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid 'limit' parameter. It must be a positive number.",
      });
    }

    const skip = (page - 1) * limit;

    const total = await Tour.countDocuments(JSON.parse(queryStr));
    if (skip >= total) {
      return res.status(404).json({
        status: "fail",
        message: "Page number is too high, no results available.",
      });
    }

    query = query.skip(skip).limit(limit);
    // --------------------------------

    // Execute query
    const tours = await query;

    // Send response
    res.status(200).json({
      status: "success",
      message: "ok",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    tour
      ? res.status(200).json({
          status: "success",
          message: "ok",
          data: {
            tour,
          },
        })
      : res.status(404).json({
          status: "fail",
          message: "Can not find tour",
        });
  } catch (error) {
    handleError(res, error);
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: { tour: newTour },
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    tour
      ? res.status(200).json({
          status: "success",
          message: "ok",
          data: {
            tour,
          },
        })
      : res.status(404).json({
          status: "fail",
          message: "Can not find tour",
        });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    tour
      ? res.status(204).json({
          status: "success",
          message: "Tour deleted successfully",
        })
      : res.status(404).json({
          status: "fail",
          message: "Can not find a tour",
        });
  } catch (error) {
    handleError(res, error);
  }
};
