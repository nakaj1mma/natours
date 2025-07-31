// Require the Express module
const express = require("express");

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

router.route("/top-5-cheap").get(protect, aliasTopTours, getAllTours);

router.route("/tour-stats").get(protect, getTourStats);
router
  .route("/mounthly-plan/:year")
  .get(protect, restrictTo("admin", "guide", "lead-guide"), getMonthlyPlan);

// Define the main routes
router
  .route("/")
  .get(protect, getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(protect, getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// Export the router
module.exports = router;
