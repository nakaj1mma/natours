const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require("./../controllers/userController");
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.patch("/update-my-password", updatePassword);

router.get("/me", getMe, getUser);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
