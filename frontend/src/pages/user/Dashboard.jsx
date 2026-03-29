import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import HelmetMap from "../../components/HelmetMap";
import { socket } from "../../lib/socket";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useGlobalStore from "../../zustandStore/useGlobalStore";

import {
  Gauge,
  User,
  MapPin,
  Activity,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Siren,
} from "lucide-react";
function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const helmetData = useGlobalStore((state) => state.helmetData);
  const [tripStarted, setTripStarted] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [tripError, setTripError] = useState("");

  const getCurrentLocation = () => {
    const latitude =
      helmetData?.lat ?? helmetData?.latitude ?? helmetData?.gps?.latitude ?? 0;
    const longitude =
      helmetData?.lng ??
      helmetData?.longitude ??
      helmetData?.gps?.longitude ??
      0;

    return { latitude, longitude };
  };

  const fetchData = async () => {
    const token = await getToken();
    console.log(token);

    try {
      const response = await fetch("http://localhost:5000/profileStatus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("response:", response);
      console.log("data:", data);
    } catch (error) {
      console.log("cannot fetch the data error:", error);
    }
  };

  const startTrip = async () => {
    try {
      setTripError("");
      const token = await getToken();
      const startLocation = getCurrentLocation();

      const response = await fetch("http://localhost:5000/trip/start", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          startLocation,
        }),
      });

      const data = await response.json();
      console.log("response:", response);
      console.log("data:", data);

      if (!response.ok || !data?.success || !data?.data?.tripId) {
        throw new Error(data?.message || "Failed to start trip");
      }

      setTripId(data.data.tripId);
      socket.emit("tripStart", {
        tripId: data.data.tripId,
        helmetId: data.data.helmetId,
      });
      setTripStarted(true);
    } catch (error) {
      setTripStarted(false);
      setTripError(error?.message || "Cannot start trip");
      console.log("cannot fetch the data error:", error);
    }
  };

  const endTrip = async () => {
    try {
      setTripError("");
      const token = await getToken();
      const endLocation = getCurrentLocation();

      const response = await fetch("http://localhost:5000/trip/end", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          tripId: tripId,
          endLocation,
        }),
      });

      const data = await response.json();
      console.log("response:", response);
      console.log("data:", data);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to end trip");
      }

      socket.emit("tripEnd", {
        tripId: data.data.tripId,
        helmetId: data.data.helmetId,
      });
      setTripStarted(false);
      setTripId(null);
    } catch (error) {
      setTripError(error?.message || "Cannot end trip");
      console.log("cannot fetch the data error:", error);
    }
  };

  const updateRole = async () => {
    const token = await getToken();
    console.log(token);
    try {
      const response = await fetch("http://localhost:5000/updateRole", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });
      const data = await response.json();
      console.log("response:", response);
      console.log("data:", data);
    } catch (error) {
      console.log("cannot fetch the data error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Rider Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Smart Helmet • Real-time Monitoring
          </p>
        </div>

        <button
          onClick={updateRole}
          className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-4 py-2 rounded-lg border border-border hover:scale-[1.02] transition"
        >
          <User size={16} />
          Update Role
        </button>
      </div>

      {tripError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {tripError}
        </div>
      ) : null}

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Speed */}
        <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Speed</p>
            <Gauge className="text-primary" size={18} />
          </div>
          <h2 className="text-3xl font-bold mt-2 text-primary">
            {helmetData ? `${helmetData.speed} km/h` : "12Km/h"}
          </h2>
        </div>

        {/* Status */}
        <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Status</p>
            <Activity className="text-success" size={18} />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="h-3 w-3 rounded-full bg-success animate-pulse"></span>
            <span className="font-medium">Active</span>
          </div>
        </div>

        {/* User */}
        <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Rider</p>
            <User size={18} />
          </div>
          <h2 className="text-lg font-semibold mt-2">{user?.fullName}</h2>
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== MAP ===== */}
        <div className="lg:col-span-2 bg-card/70 backdrop-blur border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-primary" />
            <h2 className="text-lg font-medium">Live Location</h2>
          </div>

          <div className="h-105 w-full rounded-lg overflow-hidden border border-border">
            <HelmetMap
              helmetData={helmetData || { lat: 27.747888, lng: 85.316345 }}
            />
          </div>
        </div>

        {/* ===== SIDE PANEL ===== */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Controls</h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={fetchData}
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:scale-[1.02] transition"
              >
                <RefreshCw size={16} />
                Sync Data
              </button>

              {!tripStarted ? (
                <button
                  onClick={startTrip}
                  className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:scale-[1.02] transition"
                >
                  <Play size={16} />
                  Start Trip
                </button>
              ) : (
                <button
                  onClick={endTrip}
                  className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:scale-[1.02] transition"
                >
                  <Square size={16} />
                  End Trip
                </button>
              )}

              <button className="flex items-center justify-center gap-2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg hover:scale-[1.02] transition">
                <Siren size={16} />
                SOS Emergency
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-accent" size={18} />
              <h2 className="text-lg font-medium">Alerts</h2>
            </div>

            <p className="text-sm text-muted-foreground">No active alerts 🚀</p>
          </div>
        </div>
      </div>

      {/* ===== TELEMETRY ===== */}
      <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Activity size={18} />
          Telemetry
        </h2>

        <p className="text-muted-foreground text-sm">
          Speed trends, trip analytics, and ride insights will appear here
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
