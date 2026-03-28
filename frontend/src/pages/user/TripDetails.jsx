import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const TripDetails = () => {
  const { tripId } = useParams();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!isLoaded || !isSignedIn || !tripId) return;

      try {
        setIsLoading(true);
        setError("");

        const token = await getToken();
        const response = await fetch(`http://localhost:5000/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Failed to fetch trip details");
        }

        setTripData(result?.data || null);
      } catch (err) {
        setError(err?.message || "Failed to fetch trip details");
        setTripData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetails();
  }, [getToken, isLoaded, isSignedIn, tripId]);

  if (!isLoaded) {
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-8 text-muted-foreground">
        Please sign in to view trip details.
      </div>
    );
  }

  const trip = tripData?.trip;
  const logs = tripData?.telemetryLogs || [];

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trip Details</h1>
            <p className="text-muted-foreground mt-1">Trip ID: {tripId}</p>
          </div>
          <Link
            to="/trips"
            className="inline-flex items-center rounded-md border border-border bg-card px-3 py-2 text-foreground hover:bg-muted"
          >
            Back to Trips
          </Link>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-border bg-card px-4 py-6 text-muted-foreground">
            Loading trip details...
          </div>
        ) : !trip ? (
          <div className="rounded-lg border border-border bg-card px-4 py-6 text-muted-foreground">
            Trip details not found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatDuration(trip.duration)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Avg / Max Speed</p>
                <p className="text-xl font-semibold text-foreground">
                  {trip?.stats?.avgSpeed ?? 0} / {trip?.stats?.maxSpeed ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Safety Score</p>
                <p className="text-xl font-semibold text-foreground">
                  {trip?.safety?.safetyScore ?? 0}%
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Trip Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Time</p>
                  <p className="text-foreground font-medium">
                    {formatDateTime(trip.startTime)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Time</p>
                  <p className="text-foreground font-medium">
                    {formatDateTime(trip.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="text-foreground font-medium">
                    {trip.status || "--"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Accident Detected</p>
                  <p className="text-foreground font-medium">
                    {trip?.safety?.accidentDetected ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Harsh Braking Count</p>
                  <p className="text-foreground font-medium">
                    {trip?.safety?.harshBrakingCount ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Harsh Acceleration Count
                  </p>
                  <p className="text-foreground font-medium">
                    {trip?.safety?.harshAccelerationCount ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telemetry Logs</p>
                  <p className="text-foreground font-medium">
                    {trip?.stats?.totalTelemetryLogs ?? logs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Latest Telemetry Logs
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing latest 10 records.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Time</th>
                      <th className="px-4 py-3 text-left font-medium">Speed</th>
                      <th className="px-4 py-3 text-left font-medium">
                        G-Force
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Accident
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs
                      .slice(-10)
                      .reverse()
                      .map((log) => (
                        <tr key={log._id} className="border-t border-border">
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDateTime(log.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {log?.speed?.current ?? 0}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {log?.acceleration?.magnitude ?? 0}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {log?.accident?.detected ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    {logs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-muted-foreground"
                        >
                          No telemetry logs found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
