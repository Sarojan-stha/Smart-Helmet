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
  registerHelmet,
} = require("../controllers/user");

router.use(clerkMiddleware());

// router.post("/signup", createUser);

// router.get("/allUsers", authMiddleWare, authorizeMiddleware, getAllUsers);

// router.get("/login", login);

// router.patch("/updateUser", authMiddleWare, updateUser);

// router.delete("/deleteUser", authMiddleWare, deleteUser);

// router.get("/profile", authMiddleWare, getProfile);

// router.get("/helmetData", authMiddleWare, getHelmetData);

router.post("/registerHelmet", requireAuth(), registerHelmet);

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

router.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const evt = await verifyWebhook(req);
      const eventType = evt.type;
      const {
        id,
        first_name,
        last_name,
        phone_numbers,
        public_metadata,
        username,
        email_addresses,
        primary_email_address_id,
      } = evt.data;

      const primaryEmailObj = email_addresses?.find(
        (e) => e.id === primary_email_address_id,
      );

      const email = primaryEmailObj?.email_address || null;

      const role = public_metadata?.role;
      const existingUser = await User.findOne({ clerkId: id });

      const data = {
        name: first_name,
        public_metadata: public_metadata,
        username: username,
        email: email,
      };

      if (!existingUser && eventType === "user.created") {
        console.log("user data :", data);

        await User.create({
          clerkId: id,
          email,
          firstName: first_name,
          lastName: last_name,
          username,
          role,
        });

        console.log("A user has been created in DB");
      }

      if (existingUser) {
        switch (eventType) {
          case "user.updated":
            console.log("user data :", data);

            await User.findOneAndUpdate(
              { clerkId: id },
              {
                clerkId: id,
                email,
                firstName: first_name,
                lastName: last_name,
                username,
                role,
              },
            );
            console.log("A user has been updated in DB");

            break;
          case "user.deleted":
            console.log("user data :", id);

            await User.deleteOne({ clerkId: id });
            console.log("A user has been deleted from DB");

            break;

          default:
            break;
        }
      }

      // Do something with payload
      // For this guide, log payload to console
      // console.log(
      //   `Received webhook with ID ${id} and event type of ${eventType}`,
      // );
      // console.log("Webhook payload:", evt.data);

      return res.send("Webhook received");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).send("Error verifying webhook");
    }
  },
);
module.exports = router;
