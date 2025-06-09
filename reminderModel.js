const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicationName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  times: [
    {
      time: { type: String, required: true },
      status: { type: String, default: "pending" },
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  notify: {
    type: Boolean,
    default: true,
  },
  actionStatus: {
    type: String,
    enum: ["none", "taken", "snoozed", "missed"],
    default: "none",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photoUrl: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Reminder", reminderSchema);
