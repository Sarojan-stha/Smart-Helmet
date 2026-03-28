require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routes/user");
const adminRouter = require("./src/routes/admin");
const tripRouter = require("./src/routes/trip");
const connectDB = require("./src/config/db");
const cors = require("cors");
const { app, server, io } = require("./src/config/socket");
const bodyParser = require("body-parser");

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/", tripRouter);

server.listen(5000, () => {
  console.log("server running on port 5000");
});
