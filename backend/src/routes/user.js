const express = require("express");
const User = require("../model/user");
const router = express.Router();
const authMiddleWare = require("../middlewares/authMiddleware");
const authorizeMiddleware = require("../middlewares/authorizeMiddleware");

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
  getProfile,
  getHelmetData,
} = require("../controllers/user");

router.post("/createUser", createUser);

router.get("/allUsers", authMiddleWare, authorizeMiddleware, getAllUsers);

router.get("/login", login);

router.patch("/updateUser", authMiddleWare, updateUser);

router.delete("/deleteUser", authMiddleWare, deleteUser);

router.get("/profile", authMiddleWare, getProfile);

router.get("/helmetData", authMiddleWare, getHelmetData);

module.exports = router;
