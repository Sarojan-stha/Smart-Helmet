require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleWare = require("./src/middlewares/authMiddleware");
const userRouter = require("./src/routes/user");
const app = express();
const connectDB = require("./src/config/db");


connectDB();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", userRouter);

console.log("JWT_SECRET:", process.env.JWT_SECRET);


app.get("/", (req, res) => {
  res.send("hey from backend");
});

app.listen(5000);
