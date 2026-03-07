import { io } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";

const URL = "http://localhost:5000";
const socket = io(URL, {
  autoConnect: false,
});

const socketConnect = async (token, isSignedIn) => {
  if (!isSignedIn) {
    socket.disconnect();
    return;
  }
  console.log("token passed");
  try {
    socket.auth = { token }; //attach JWT token to the socket authentication payload
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("alert", (data) => {
      console.log("Alert from server:", data);
    });
  } catch (error) {
    console.error("Socket connection failed:", error);
    // optionally show UI message
  }
};

socket.on("message", (data) => {
  console.log("data recieved from backend", data);
});

socket.on("connect_error", (err) => {
  console.log("Connection failed:", err.message);
});

export { socket, socketConnect };
