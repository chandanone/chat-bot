const express = require("express");
const router = express.Router();
const workingHoursController = require("../controllers/workingHoursController");

router.post("/working-hours", workingHoursController.addWorkingHours);
router.get("/working-hours", workingHoursController.getWorkingHours);

module.exports = router;
