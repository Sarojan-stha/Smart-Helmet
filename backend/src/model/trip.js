const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      unique: true,
      required: true,
      index: true,
      default: () =>
        `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    },
    helmetId: {
      type: String,
      required: true,
      index: true,
    },
    riderId: {
      type: String, // Clerk ID
      required: true,
      index: true,
    },
    riderUsername: String,

    // Trip Status
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },

    // Trip Timing
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: Date,
    duration: Number, // in seconds

    // Trip Statistics
    stats: {
      distance: { type: Number, default: 0 }, // in meters
      avgSpeed: { type: Number, default: 0 },
      maxSpeed: { type: Number, default: 0 },
      totalTelemetryLogs: { type: Number, default: 0 },
    },

    // Safety Metrics
    safety: {
      accidentDetected: { type: Boolean, default: false },
      harshBrakingCount: { type: Number, default: 0 },
      harshAccelerationCount: { type: Number, default: 0 },
      aggressiveScore: { type: Number, default: 0 }, // 0-100
      safetyScore: { type: Number, default: 100 }, // 0-100
    },

    // Location Tracking
    startLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    endLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
    },

    // Route
    route: [
      {
        latitude: Number,
        longitude: Number,
        timestamp: Date,
      },
    ],

    // Notes/Comments about trip
    notes: String,
  },
  { timestamps: true },
);

// Indexes for efficient queries
tripSchema.index({ riderId: 1, startTime: -1 });
tripSchema.index({ helmetId: 1, startTime: -1 });
tripSchema.index({ status: 1 });

module.exports = mongoose.model("Trip", tripSchema);
