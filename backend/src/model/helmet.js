const mongoose = require("mongoose");

const helmetSchema = new mongoose.Schema(
  {
    helmetId: {
      type: String,
      unique: true, // every helmet has a unique device ID
      required: true,
    },
    riderId: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      ref: "User", // links helmet to a rider
      required: true,
      unique: true,
    },
    riderUsername: {
      type: String,
    },
    helmetModel: {
      type: String,
      required: true,
    },
    firmwareVersion: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "inactive",
    },
    lastLocation: {
      lat: Number,
      lng: Number,
    },
    lastSpeed: {
      type: Number,
      default: 0,
    },
    accidentDetected: {
      type: Boolean,
      default: false,
    },
    ridingStyle: {
      aggressive: { type: Number, default: 0 },
      safe: { type: Number, default: 100 },
    },
  },
  { timestamps: true },
);

const Helmet = mongoose.model("helmet", helmetSchema);
module.exports = Helmet;
