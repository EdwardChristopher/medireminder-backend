const Reminder = require("../models/reminderModel");
const admin = require("../config/firebase");

// ✅ Add Reminder
exports.addReminder = async (req, res) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      userId: req.user.id,
    });

    const saved = await reminder.save();

    res.status(201).json({
      msg: "Reminder created successfully",
      reminder: saved,
    });
  } catch (error) {
    console.error("Error creating reminder:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get User Reminders
exports.getUserReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error getting reminders:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update Reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReminder = await Reminder.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    res.status(200).json({
      msg: "Reminder updated successfully",
      reminder: updatedReminder,
    });
  } catch (error) {
    console.error("Error updating reminder:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Delete Reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReminder = await Reminder.findByIdAndDelete(id);

    if (!deletedReminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    res.status(200).json({ msg: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update ActionStatus → global → for History tab
exports.updateReminderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionStatus } = req.body;

    if (!["taken", "missed", "snoozed", "none"].includes(actionStatus)) {
      return res.status(400).json({ msg: "Invalid actionStatus" });
    }

    const updated = await Reminder.findByIdAndUpdate(
      id,
      { actionStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    res.status(200).json({
      msg: "ActionStatus updated",
      reminder: updated,
    });
  } catch (error) {
    console.error("Error updating actionStatus:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update TimeStatus → per-time → untuk Dashboard button PER JAM
exports.updateReminderTimeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, status, photoUrl } = req.body;

    if (!time || !status) {
      return res.status(400).json({ msg: "Missing time or status" });
    }

    if (!["taken", "missed", "snoozed", "none"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    // Update hanya entry time yang sesuai, simpan photoUrl jika ada
    const updatedTimes = reminder.times.map((entry) => {
      if (entry.time === time) {
        return {
          ...entry,
          status,
          photoUrl: photoUrl || entry.photoUrl || "",
        };
      }
      return entry;
    });

    reminder.times = updatedTimes;
    await reminder.save();

    res.status(200).json({
      msg: "Time status updated",
      reminder,
    });
  } catch (error) {
    console.error("Error updating time status:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update Reminder Time (change time for a specific entry)
exports.updateReminderTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldTime, newTime } = req.body;

    if (!oldTime || !newTime) {
      return res.status(400).json({ msg: "Missing oldTime or newTime" });
    }

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    const updatedTimes = reminder.times.map((entry) => {
      if (entry.time === oldTime) {
        return { time: newTime, status: "snoozed" };
      }
      return entry;
    });

    reminder.times = updatedTimes;
    await reminder.save();

    res.status(200).json({
      msg: "Time updated successfully",
      reminder,
    });
  } catch (error) {
    console.error("Error updating time:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
