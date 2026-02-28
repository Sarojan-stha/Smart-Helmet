const express = require("express");
const router = express.Router();

const {
  requireAuth,
  getAuth,
  clerkMiddleware,
  clerkClient,
} = require("@clerk/express");

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
  getProfile,
  getHelmetData,
  checkCompleteProfile,
} = require("../controllers/user");

router.use(clerkMiddleware());

// router.post("/signup", createUser);

// router.get("/allUsers", authMiddleWare, authorizeMiddleware, getAllUsers);

// router.get("/login", login);

// router.patch("/updateUser", authMiddleWare, updateUser);

// router.delete("/deleteUser", authMiddleWare, deleteUser);

// router.get("/profile", authMiddleWare, getProfile);

// router.get("/helmetData", authMiddleWare, getHelmetData);

router.get("/profileStatus", async (req, res) => {
  const auth = getAuth(req);
  const { userId } = getAuth(req);

  console.log("auth:", auth.has);

  const user = req.auth();
  try {
    console.log("req.auth:", user); // decoded token
  } catch (error) {
    console.log(error);
  }

  res.json({ message: "Hi from backend" });
});

router.post("/updateRole", async (req, res) => {
  const { userId } = getAuth(req);

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "admin",
    },
  });
  res.status(200).json({ success: true });
});
module.exports = router;
