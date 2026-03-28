const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    // Device Reference
    helmetId: {
      type: String,
      required: true,
      index: true, // for quick queries
    },
    riderId: {
      type: String, // Clerk ID
      required: true,
      index: true,
    },

    // Location Data (Real-time GPS)
    gps: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      accuracy: { type: Number }, // GPS accuracy in meters
    },

    // Speed & Movement
    speed: {
      current: { type: Number, required: true }, // km/h
    },

    // Acceleration (G-force)
    acceleration: {
      x: { type: Number }, // G-force
      y: { type: Number },
      z: { type: Number },
      magnitude: { type: Number }, // total G-force
    },

    // Riding Behavior Analytics
    ridingStyle: {
      aggressive: { type: Number, default: 0 }, // 0-100%
      safe: { type: Number, default: 100 }, // 0-100%
    },

    // Safety Alerts
    accident: {
      detected: { type: Boolean, default: false },
    },

    // Communication Status
    signalStrength: {
      type: Number,
      min: 0,
      max: 100, // signal strength %
    },
    connectionStatus: {
      type: String,
      enum: ["connected", "disconnected", "weak"],
      default: "connected",
    },

    // Battery
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100, // battery percentage
    },

    // Trip/Session Info
    tripId: {
      type: String,
      required: true,
      index: true, // link to a specific trip/journey
    },

    // Timestamp
  },
  { timestamps: true }, // adds createdAt and updatedAt automatically
);

// Create indexes for efficient time-series queries
telemetrySchema.index({ helmetId: 1, createdAt: -1 });
telemetrySchema.index({ riderId: 1, createdAt: -1 });
telemetrySchema.index({ tripId: 1, createdAt: -1 });
telemetrySchema.index({ tripId: 1, helmetId: 1 });

module.exports = mongoose.model("Telemetry", telemetrySchema);
