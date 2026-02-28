require("dotenv").config();
const User = require("../model/user");
const Helmet = require("../model/helmet");
const Telemetry = require("../model/telemetry");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    //check for existing User
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //generate hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    //generate jwt
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    console.log("User created successfully");

    res.cookie("token", token, {
      httpOnly: true, // cannot access via JS (security)
      secure: false, // true in production (HTTPS)
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.send(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    //  Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    //  Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send response (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateUser = async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { username, password, role },
    );
    res.json(user);
  } catch (error) {
    res.send(error);
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndDelete({ email });
    res.json({
      User: user,
      message: "User Deleted",
    });
  } catch (error) {
    res.send(error);
  }
};

const getProfile = async (req, res) => {
  const { id, email, role } = req.user;

  try {
    let users;

    if (role === "admin") {
      users = await User.find().select("-password"); // all users except passwords
    } else {
      users = await User.findOne({ email }).select("-password"); // only current user
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHelmetData = async (req, res) => {
  const { id, role } = req.user;
  const helmetId = req.params.id;

  try {
    const helmet = await Helmet.findById(helmetId).populate(
      "rider",
      "name email role",
    );

    if (!helmet) {
      return res.status(404).json({ message: "Helmet not found" });
    }

    // Ownership check for regular users
    if (role !== "admin" && helmet.rider._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ helmet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTelemetryLogs = async (req, res) => {
  const { id, role } = req.user;
  const helmetId = req.params.helmetId;

  try {
    const helmet = await Helmet.findById(helmetId);

    if (!helmet) {
      return res.status(404).json({ message: "Helmet not found" });
    }

    // Ownership check for regular users
    if (role !== "admin" && helmet.rider.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch telemetry logs
    const logs = await Telemetry.find({ helmet: helmetId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkCompleteProfile = async (req, res) => {
  console.log("req:", req.auth);

  const user = await db.users.findOne({ sub: req.auth.sub });
  // sub is unique Auth0 ID

  if (!user) {
    res.json({ message: "User doesnt exits" });
  }
  const complete = user && user.phone && user.helmetId; // all required fields filled
  res.json({ complete: true });
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
  getProfile,
  getHelmetData,
  getTelemetryLogs,
  checkCompleteProfile,
};
