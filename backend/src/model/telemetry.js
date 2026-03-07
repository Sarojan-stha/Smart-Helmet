// const mongoose = require("mongoose");

// const telemetrySchema = new mongoose.Schema(
//   {
//     // helmet: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "Helmet",
//     //   required: true, // links log to a specific helmet
//     // },
//     speed: {
//       type: Number,
//       required: true, // speed recorded at this timestamp
//     },
//     gps: {
//       lat: { type: Number, required: true },
//       lng: { type: Number, required: true },
//     },
//     accidentDetected: {
//       type: Boolean,
//       default: false, // true if accident detected at this timestamp
//     },
//     ridingStyle: {
//       aggressive: { type: Number, default: 0 }, // e.g., % of aggressive behavior
//       safe: { type: Number, default: 100 }, // e.g., % of safe riding
//     },
//   },
//   { timestamps: true },
// ); // adds createdAt and updatedAt automatically

// module.exports = mongoose.model("Telemetry", telemetrySchema);
