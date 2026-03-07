const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { WebSocket } = require("ws");
const Helmet = require("../model/helmet");

const { verifyToken } = require("@clerk/backend");
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Middleware to validate the user coming from the frontend
io.use(async (socket, next) => {
  try {
    const { token } = socket.handshake.auth;
    console.log("token from handshake:", token);

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // attaching userId with socket payload for joining room later
    socket.userId = payload.sub;
    console.log("user id:", socket.userId);

    const helmet = await Helmet.findOne({ riderId: socket.userId });

    if (!helmet) {
      console.log("No helmet registered under this user");
      return next(new Error("Helmet not registered"));
    }

    console.log("middleware helmetDetails:", helmet);

    socket.join(helmet.helmetId);

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);
    next(new Error("Authentication failed"));
  }
});

//Server for socket connection with frontend
io.on("connection", async (socket) => {
  console.log("a user connected with socketId:", socket.id);
  const helmet = await Helmet.findOne({ riderId: socket.userId });

  socket.join("helmet504");
  // socket.join(socket.helmetId);
  console.log("Frontend joined a room");

  io.to("helmet504").emit("message", "hello frontend");
  console.log("Message sent to the room");

  socket.on("disconnect", () => {
    console.log("user has been disconnected");
  });
});

//Server for websocket connection with ESP
const wss = new WebSocket.Server({ server: server, path: "/ws" });

wss.on("connection", async (ws, req) => {
  const params = new URLSearchParams(req.url.split("?")[1]);

  const helmetId = params.get("helmetId");
  const apiKey = params.get("apiKey");

  console.log("ESP32 connected to the server:", ws.id);
  const registeredHelmet = await Helmet.findOne({ helmetId });
  if (!registeredHelmet) {
    ws.close();
  }
  const userId = registeredHelmet.riderId;

  ws.on("message", (data) => {
    console.log("Helmet Data:", data);
    io.to(helmetId).emit("message", data);
  });

  ws.on("close", () => {
    console.log("ESP32 has been disconnected");
  });
});

module.exports = {
  app,
  server,
  io,
};
