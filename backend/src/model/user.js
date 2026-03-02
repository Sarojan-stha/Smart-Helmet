const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, require: true, unique: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    username: { type: String, require: true },
    role: { type: String, default: "user" },
  },

  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
