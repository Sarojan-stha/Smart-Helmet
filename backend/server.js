require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routes/user");
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
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Send a welcome message immediately after connection
//   socket.emit("welcome", {
//     message: "Hello this message is sent from backend to frontend",
//   });
//   let lat = 27.7172;
//   let lng = 85.324;
//   //Simulate sending helmet data from server to the client every  2 seconds
//   const interval = setInterval(() => {
//     lat = lat + 0.0001;
//     const helmetData = {
//       speed: Math.floor(Math.random() * 100), // km/h
//       acceleration: Math.random().toFixed(2),
//       alert: false,
//       lat: lat,
//       lng: lng,
//     };
//     socket.emit("helmetData", helmetData);
//   }, 2000);

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//     clearInterval(interval);
//   });
// });

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", userRouter);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

server.listen(5000, () => {
  console.log("server running on port 5000");
});
