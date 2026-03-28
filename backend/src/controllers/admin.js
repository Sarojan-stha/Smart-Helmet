require("dotenv").config();
const User = require("../model/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({});
    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No users registerd in yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Succesfully fetched all users",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
module.exports = {
  getUsers,
};
