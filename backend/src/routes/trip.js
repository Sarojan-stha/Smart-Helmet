const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const {
  startTrip,
  endTrip,
  getTripHistory,
  getTripDetails,
  getCurrentTrip,
} = require("../controllers/trip");

// All trip routes require authentication
router.use(requireAuth());

// Start a new trip
router.post("/trip/start", startTrip);

// End an active trip
router.post("/trip/end", endTrip);

// Get trip history for the current rider (with pagination)
router.get("/trip/history", getTripHistory);

// Get current active trip
router.get("/trip/current", getCurrentTrip);

// Get specific trip details with all telemetry logs
router.get("/trip/:tripId", getTripDetails);

module.exports = router;
