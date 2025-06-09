const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  saveFcmToken,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");

// Save FCM Token
router.post("/token", authMiddleware, saveFcmToken);

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile (GET /me)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
