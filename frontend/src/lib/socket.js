import { io } from "socket.io-client";
import { useModalStore } from "../store/useModelStore";
import useGlobalStore from "../zustandStore/useGlobalStore";

const URL = "http://localhost:5000";
const socket = io(URL, {
  autoConnect: false,
});

const normalizeHelmetPayload = (data = {}) => {
  const lat = data.lat ?? data.latitude ?? data?.gps?.latitude ?? null;
  const lng = data.lng ?? data.longitude ?? data?.gps?.longitude ?? null;

  return {
    ...data,
    lat,
    lng,
  };
};

const socketConnect = async (token, isSignedIn) => {
  if (!isSignedIn) {
    socket.disconnect();
    return;
  }
  console.log("token passed");
  try {
    socket.auth = { token }; //attach JWT token to the socket authentication payload
    socket.connect();

    socket.off("connect").on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.off("helmetStatus").on("helmetStatus", (data) => {
      useGlobalStore.getState().setHelmetData(normalizeHelmetPayload(data));
    });

    socket.off("liveData").on("liveData", (data) => {
      useGlobalStore.getState().setHelmetData(normalizeHelmetPayload(data));
    });

    socket.off("accidentAlert").on("accidentAlert", (data) => {
      console.log("Alert from server:", data);
      // Trigger modal using Zustand .getState() (works outside React components)
      useModalStore.getState().openModal({
        type: "error",
        message: data.message,
      });
    });
  } catch (error) {
    console.error("Socket connection failed:", error);
    // optionally show UI message
  }
};

socket.on("connect_error", (err) => {
  console.log("Connection failed:", err.message);
});

export { socket, socketConnect };
