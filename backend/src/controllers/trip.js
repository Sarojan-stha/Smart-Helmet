require("dotenv").config();
const Trip = require("../model/trip");
const Telemetry = require("../model/telemetry");
const Helmet = require("../model/helmet");
const { getAuth } = require("@clerk/express");

// 1. START A TRIP
const startTrip = async (req, res) => {
  try {
    const { userId } = getAuth(req); // Clerk ID
    const { startLocation } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find helmet for this rider
    const helmet = await Helmet.findOne({ riderId: userId });
    if (!helmet) {
      return res.status(404).json({
        success: false,
        message: "Helmet not registered",
      });
    }

    // Create new trip
    const trip = await Trip.create({
      helmetId: helmet.helmetId,
      riderId: userId,
      riderUsername: helmet.riderUsername,
      status: "active",
      startLocation: startLocation || {
        latitude: 0,
        longitude: 0,
      },
    });

    console.log("Trip started:", trip.tripId);

    return res.status(200).json({
      success: true,
      message: "Trip started successfully",
      data: {
        tripId: trip.tripId,
        helmetId: trip.helmetId,
        startTime: trip.startTime,
      },
    });
  } catch (error) {
    console.error("Error starting trip:", error);
    return res.status(500).json({
      success: false,
      message: "Error starting trip",
      error: error.message,
    });
  }
};

// 2. END A TRIP
const endTrip = async (req, res) => {
  try {
    const { tripId, endLocation } = req.body || {};
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const trip = await Trip.findOne({ tripId });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Authorization check - only the rider can end their trip
    if (trip.riderId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - not your trip",
      });
    }

    // Fetch all telemetry logs for this trip
    const telemetryLogs = await Telemetry.find({ tripId }).sort({
      createdAt: 1,
    });

    if (telemetryLogs.length > 0) {
      const speeds = telemetryLogs.map((log) => log.speed.current);
      const maxSpeed = Math.max(...speeds);
      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

      const aggressiveCount = telemetryLogs.filter(
        (log) => log.ridingStyle.aggressive > 50,
      ).length;

      const harshBrakingCount = telemetryLogs.filter(
        (log) => log.acceleration?.magnitude > 8,
      ).length;

      const harshAccelerationCount = telemetryLogs.filter(
        (log) => log.acceleration?.magnitude > 7 && log.speed.current > 20,
      ).length;

      // Update trip with calculated statistics
      trip.endTime = new Date();
      trip.duration = Math.floor((trip.endTime - trip.startTime) / 1000); // in seconds
      trip.stats.maxSpeed = Math.round(maxSpeed);
      trip.stats.avgSpeed = Math.round(avgSpeed);
      trip.stats.totalTelemetryLogs = telemetryLogs.length;
      trip.safety.aggressiveScore = Math.round(
        (aggressiveCount / telemetryLogs.length) * 100,
      );
      trip.safety.safetyScore = 100 - trip.safety.aggressiveScore;
      trip.safety.harshBrakingCount = harshBrakingCount;
      trip.safety.harshAccelerationCount = harshAccelerationCount;

      // Create route from GPS data
      trip.route = telemetryLogs.map((log) => ({
        latitude: log.gps.latitude,
        longitude: log.gps.longitude,
        timestamp: log.createdAt,
      }));

      if (endLocation) {
        trip.endLocation = endLocation;
      }

      // Check for accident
      const accidentLog = telemetryLogs.find((log) => log.accident.detected);
      if (accidentLog) {
        trip.safety.accidentDetected = true;
      }
    }

    trip.status = "completed";
    await trip.save();

    console.log("Trip ended:", trip.tripId);

    return res.status(200).json({
      success: true,
      message: "Trip ended successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Error ending trip:", error);
    return res.status(500).json({
      success: false,
      message: "Error ending trip",
      error: error.message,
    });
  }
};

// 3. GET TRIP HISTORY FOR A RIDER
const getTripHistory = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { limit = 20, skip = 0 } = req.query;

    const trips = await Trip.find({ riderId: userId })
      .sort({ startTime: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalTrips = await Trip.countDocuments({ riderId: userId });

    return res.status(200).json({
      success: true,
      data: trips,
      pagination: {
        total: totalTrips,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching trips",
      error: error.message,
    });
  }
};

// 4. GET SINGLE TRIP DETAILS WITH TELEMETRY
const getTripDetails = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get trip info
    const trip = await Trip.findOne({ tripId });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Authorization check - only rider or admin can view
    if (trip.riderId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - cannot view this trip",
      });
    }

    // Get all telemetry logs for this trip
    const telemetryLogs = await Telemetry.find({ tripId }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      data: {
        trip,
        telemetryLogs,
      },
    });
  } catch (error) {
    console.error("Error fetching trip details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching trip details",
      error: error.message,
    });
  }
};

// 5. GET CURRENT ACTIVE TRIP FOR A RIDER
const getCurrentTrip = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const trip = await Trip.findOne({
      riderId: userId,
      status: "active",
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "No active trip",
      });
    }

    return res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error fetching current trip:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching current trip",
      error: error.message,
    });
  }
};

// 6. SAVE TELEMETRY DATA (HELPER FUNCTION)
const saveTelemetryData = async (tripId, helmetId, riderId, data) => {
  try {
    const telemetry = await Telemetry.create({
      tripId,
      helmetId,
      riderId,
      gps: {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
      },
      speed: {
        current: data.speed,
      },
      acceleration: {
        x: data.accelX,
        y: data.accelY,
        z: data.accelZ,
        magnitude: data.gforce,
      },
      ridingStyle: {
        aggressive: data.aggressiveness || 0,
        safe: 100 - (data.aggressiveness || 0),
      },
      accident: {
        detected: data.accident || false,
      },
      batteryLevel: data.battery,
      signalStrength: data.signal,
      connectionStatus: data.signal > 50 ? "connected" : "weak",
    });

    return telemetry;
  } catch (error) {
    console.error("Error saving telemetry:", error);
    throw error;
  }
};

module.exports = {
  startTrip,
  endTrip,
  getTripHistory,
  getTripDetails,
  getCurrentTrip,
  saveTelemetryData,
};
