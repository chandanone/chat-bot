const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., Monday, Tuesday
  startTime: { type: String, required: true }, // e.g., 09:00
  endTime: { type: String, required: true }, // e.g., 17:00
});

module.exports = mongoose.model("WorkingHours", workingHoursSchema);
