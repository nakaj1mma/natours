const express = require("express");

const {
  createNewReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// POST /tours/5c88fa8cf4afda39709c296c/reviews
// GET /tours/5c88fa8cf4afda39709c296c/reviews
// POST /reviews

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createNewReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
