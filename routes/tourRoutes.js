// Require the Express module
const express = require("express");

// Require review router
const reviewRouter = require("../routes/reviewRoutes");

// Import controller functions for the tour routes
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  // checkID,
} = require("./../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");

// Create an Express router for tours
const router = express.Router();

// Example of middleware that runs only when the route contains the "id" parameter
// router.param("id", checkID);

// GET /tour/5c88fa8cf4afda39709c296c/reviews
// GET /tour/5c88fa8cf4afda39709c296c/reviews/689597edfb79e8c7f196fc9f

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router
  .route("/mounthly-plan/:year")
  .get(protect, restrictTo("admin", "guide", "lead-guide"), getMonthlyPlan);

// Define the main routes
router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// Export the router
module.exports = router;
