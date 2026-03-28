const express = require("express");
const router = express.Router();
const app = express();
const {
  requireAuth,
  getAuth,
  clerkMiddleware,
  clerkClient,
} = require("@clerk/express");

const { getUsers } = require("../controllers/admin");

router.use(clerkMiddleware());

router.get("/users", getUsers);

module.exports = router;
