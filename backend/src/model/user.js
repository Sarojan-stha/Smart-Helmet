const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    // username: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, unique: true },
    role: { type: String, default: "user" },
    // helmetId: { type: String, required: true, unique: true },
  },

  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
