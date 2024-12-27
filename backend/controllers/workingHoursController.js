const WorkingHours = require("../models/WorkingHours");

// Add working hours
exports.addWorkingHours = async (req, res) => {
  try {
    const hours = new WorkingHours(req.body);
    await hours.save();
    res.status(201).json(hours);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all working hours
exports.getWorkingHours = async (req, res) => {
  try {
    const hours = await WorkingHours.find();
    res.status(200).json(hours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
