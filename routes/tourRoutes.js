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

// Create an Express router for tours
const router = express.Router();

// Example of middleware that runs only when the route contains the "id" parameter
// router.param("id", checkID);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/mounthly-plan/:year").get(getMonthlyPlan);

// Define the main routes
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

// Export the router
module.exports = router;
