const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { WebSocket } = require("ws");
const Helmet = require("../model/helmet");
const { saveTelemetryData } = require("../controllers/trip");

const { verifyToken } = require("@clerk/backend");
const app = express();
const server = createServer(app);
const ACCIDENT_DEDUP_MS = Number(process.env.ACCIDENT_DEDUP_MS || 15000);
const ESP_SHARED_API_KEY = process.env.ESP_SHARED_API_KEY;

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

    // socket.join(helmet.helmetId);
    // console.log("Joined a room", helmet.helmetId);

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);
    next(new Error("Authentication failed"));
  }
});

// Track active trips per helmet:
// { helmetId: { tripId, lastSaveTime, lastAccidentEventAt, userId } }
let activeTrips = {};

//Server for socket connection with frontend
io.on("connection", async (socket) => {
  console.log("a user connected with socketId:", socket.id);
  const helmet = await Helmet.findOne({ riderId: socket.userId });

  socket.join(helmet.helmetId);
  console.log("Frontend joined a room", helmet.helmetId);

  // io.to("helmet101").emit("message", "hello frontend 101"); //hardcoded room name for testing
  // io.to("helmet504").emit("message", "hello frontend 504"); //hardcoded room name for testing

  console.log("Message sent to the room");

  socket.on("disconnect", () => {
    console.log("user has been disconnected");
  });

  // Handle Trip Start (from frontend)
  socket.on("tripStart", (tripData) => {
    activeTrips[helmet.helmetId] = {
      tripId: tripData.tripId,
      lastSaveTime: Date.now(),
      lastAccidentEventAt: 0,
      userId: helmet.riderId,
    };
    console.log(
      `🚀 Trip started: ${tripData.tripId} on helmet ${helmet.helmetId}`,
    );
  });

  // Handle Trip End (from frontend)
  socket.on("tripEnd", (tripData) => {
    if (activeTrips[helmet.helmetId]) {
      delete activeTrips[helmet.helmetId];
      console.log(
        `🛑 Trip ended: ${tripData.tripId} on helmet ${helmet.helmetId}`,
      );
    }
  });
});

//Server for websocket connection with ESP32
const wss = new WebSocket.Server({ server: server, path: "/ws" });
console.log("WebSocket server started on ws://localhost:5000/ws");

wss.on("connection", async (ws, req) => {
  try {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const helmetId = params.get("helmetId");
    const apiKey = params.get("apiKey");

    const clientIP = req.socket.remoteAddress;
    console.log(
      `ESP32 connection attempt - Helmet: ${helmetId}, IP: ${clientIP}`,
    );

    // Validate helmet is registered
    if (!helmetId) {
      console.error("Missing helmetId in WebSocket connection");
      ws.close(1008, "Missing helmetId");
      return;
    }

    // Validate shared device api key only when configured.
    if (ESP_SHARED_API_KEY && apiKey !== ESP_SHARED_API_KEY) {
      console.error(`Invalid apiKey for helmet: ${helmetId}`);
      ws.close(1008, "Invalid apiKey");
      return;
    }

    const registeredHelmet = await Helmet.findOne({ helmetId });
    if (!registeredHelmet) {
      console.error(`Helmet not registered: ${helmetId}`);
      ws.close(1008, "Helmet not registered");
      return;
    }

    console.log(`ESP32 connected successfully: ${helmetId} (${clientIP})`);

    // Send welcome message
    ws.send(
      JSON.stringify({
        success: true,
        message: "Connected to Smart Helmet Server",
        helmetId: helmetId,
      }),
    );

    // Handle incoming telemetry data
    ws.on("message", async (rawData) => {
      let data;
      try {
        data = JSON.parse(rawData);
      } catch (parseError) {
        console.error(
          `Invalid telemetry JSON from ${helmetId}: ${parseError.message}`,
        );
        return;
      }

      console.log("Received telemetry data:", data);

      // ALWAYS emit helmet status (battery, signal, location)
      io.to(helmetId).emit("helmetStatus", {
        helmetId,
        latitude: data.latitude, // ← Always send
        longitude: data.longitude, // ← Always send
        battery: data.battery || 0,
        signal: data.signal || 0,
        timestamp: new Date(),
      });

      io.emit("tempMsg", data);

      // Only save detailed telemetry if trip active
      const tripData = activeTrips[helmetId];
      if (!tripData && data.accident) {
        io.to(helmetId).emit("accidentAlert", {
          message: "ACCIDENT DETECTED",
          timestamp: new Date(),
          location: { latitude: data.latitude, longitude: data.longitude },
        });

        console.log(`⚠️ ACCIDENT DETECTED (NO ACTIVE TRIP) - Helmet: ${helmetId}`);
      }

      if (!tripData) {
        return;
      }

      const { tripId, lastSaveTime, userId } = tripData;
      const now = Date.now();

      // 1. EMIT TO FRONTEND IN REAL-TIME (always)
      io.to(helmetId).emit("liveData", {
        helmetId,
        speed: data.speed || 0,
        latitude: data.latitude,
        longitude: data.longitude,
        battery: data.battery || 0,
        signal: data.signal || 0,
        aggressiveness: data.aggressiveness || 0,
        gforce: data.gforce || 0,
        timestamp: new Date(),
      });

      // 2. SAVE TO DATABASE EVERY 30 SECONDS (time-based sampling)
      if (now - lastSaveTime > 30000) {
        try {
          await saveTelemetryData(tripId, helmetId, userId, {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            speed: data.speed || 0,
            accelX: data.accelX,
            accelY: data.accelY,
            accelZ: data.accelZ,
            gforce: data.gforce || 0,
            aggressiveness: data.aggressiveness || 0,
            accident: data.accident || false,
            battery: data.battery || 0,
            signal: data.signal || 0,
          });

          activeTrips[helmetId].lastSaveTime = now;
          console.log(`📊 Telemetry saved for trip ${tripId}`);
        } catch (dbError) {
          console.error(`Error saving telemetry: ${dbError.message}`);
        }
      }

      // 3. SAVE IMMEDIATELY IF ACCIDENT DETECTED (event-based)
      if (data.accident) {
        const lastAccidentEventAt = tripData.lastAccidentEventAt || 0;
        const withinDedupWindow = now - lastAccidentEventAt < ACCIDENT_DEDUP_MS;

        if (withinDedupWindow) {
          return;
        }

        try {
          await saveTelemetryData(tripId, helmetId, userId, {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            speed: data.speed || 0,
            accelX: data.accelX,
            accelY: data.accelY,
            accelZ: data.accelZ,
            gforce: data.gforce || 0,
            aggressiveness: data.aggressiveness || 0,
            accident: true,
            battery: data.battery || 0,
            signal: data.signal || 0,
          });

          // Alert frontend about accident
          io.to(helmetId).emit("accidentAlert", {
            message: "ACCIDENT DETECTED",
            timestamp: new Date(),
            location: { latitude: data.latitude, longitude: data.longitude },
          });

          if (activeTrips[helmetId]) {
            activeTrips[helmetId].lastAccidentEventAt = now;
          }

          console.log(`⚠️ ACCIDENT DETECTED - Helmet: ${helmetId}`);
        } catch (dbError) {
          console.error(`Error saving accident data: ${dbError.message}`);
        }
      }
    });

    // Handle connection close
    ws.on("close", () => {
      // Keep activeTrips intact here; lifecycle is controlled by tripStart/tripEnd.
      console.log(`❌ ESP32 disconnected: ${helmetId} (${clientIP})`);
    });

    // Handle errors
    ws.on("error", (err) => {
      console.error(`⚠️ WebSocket error (${helmetId}): ${err.message}`);
    });
  } catch (error) {
    console.error(`Fatal error in WebSocket handler: ${error.message}`);
    ws.close(1011, "Internal server error");
  }
});

module.exports = {
  app,
  server,
  io,
  activeTrips,
};
