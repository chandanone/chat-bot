const Appointment = require("../models/Appointment");
const WorkingHours = require("../models/WorkingHours");

// Get available slots
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.query; // e.g., 2024-12-30
  try {
    const workingHours = await WorkingHours.find();
    const appointments = await Appointment.find({ date });

    const availableSlots = [];

    workingHours.forEach((dayHours) => {
      let startTime = parseInt(dayHours.startTime.replace(":", ""));
      const endTime = parseInt(dayHours.endTime.replace(":", ""));

      while (startTime < endTime) {
        const slot = `${String(startTime)
          .padStart(4, "0")
          .replace(/^(\d{2})(\d{2})$/, "$1:$2")}`;
        const isBooked = appointments.some((appt) => appt.timeSlot === slot);

        if (!isBooked) availableSlots.push(slot);

        startTime += 100; // Increment by 1 hour
      }
    });

    res.status(200).json({ date, availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
