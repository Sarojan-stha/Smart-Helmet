const express = require("express");
const router = express.Router();
const { verifyWebhook } = require("@clerk/express/webhooks");
const User = require("../model/user");

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

router.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const evt = await verifyWebhook(req);
      const { id, first_name, last_name, username } = evt.data;

      const user = await User.findOne({ clerkId: id });
      if (!user) {
        await User.create({
          clerkId: id,
          firstName: first_name,
          lastName: last_name,
          username: username,
        });
      }

      // Do something with payload
      // For this guide, log payload to console
      const eventType = evt.type;
      console.log(
        `Received webhook with ID ${id} and event type of ${eventType}`,
      );
      console.log("Webhook payload:", evt.data);

      return res.send("Webhook received");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).send("Error verifying webhook");
    }
  },
);
