const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get(
  "/appointments/available-slots",
  appointmentController.getAvailableSlots
);
router.post("/appointments", appointmentController.bookAppointment);

module.exports = router;
