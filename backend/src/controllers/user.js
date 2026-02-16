require("dotenv").config();
const User = require("../model/user");
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

const updateUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findOneAndUpdate({ email }, { username });
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

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
