const express = require("express");
const User = require("../model/user");
const router = express.Router();
const authMiddleWare = require("../middlewares/authMiddleware");

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user");

router.post("/createUser", createUser);

router.get("/allUsers", authMiddleWare, getAllUsers);

router.patch("/updateUser", authMiddleWare, updateUser);

router.delete("/deleteUser", authMiddleWare, deleteUser);

module.exports = router;
