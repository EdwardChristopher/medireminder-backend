const express = require("express");
const router = express.Router();

const {
  addReminder,
  getUserReminders,
  updateReminder,
  deleteReminder,
  updateReminderStatus, // ✅ for History tab
  updateReminderTimeStatus, // ✅ for Dashboard per-time
  updateReminderTime, // ✅ for updating specific time
} = require("../controllers/reminderController");

const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware, addReminder);
router.get("/", authMiddleware, getUserReminders);
router.put("/:id", authMiddleware, updateReminder);
router.delete("/:id", authMiddleware, deleteReminder);

// ✅ PATCH global actionStatus
router.patch("/:id/status", authMiddleware, updateReminderStatus);

// ✅ PATCH per-time timeStatus
router.patch("/:id/time-status", authMiddleware, updateReminderTimeStatus);

// ✅ PATCH update specific time
router.patch("/:id/update-time", authMiddleware, updateReminderTime);

module.exports = router;
