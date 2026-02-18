const mongoose = require("mongoose");

const helmetSchema = new mongoose.Schema(
  {
    helemtId: {
      type: String,
      required: true,
      unique: true, // every helmet has a unique device ID
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links helmet to a rider
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
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
