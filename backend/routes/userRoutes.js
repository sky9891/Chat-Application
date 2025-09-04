const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ❌ Old version:
// router.route("/").get(protect, allUsers);
// router.route("/").post(registerUser);
// router.post("/login", authUser);

// ✅ Updated version with comments and separate routes:
router.get("/", protect, allUsers); // GET /api/user?search= - Get all users (protected)
router.post("/", registerUser); // POST /api/user - Register new user
router.post("/login", authUser); // POST /api/user/login - Login user

module.exports = router;
