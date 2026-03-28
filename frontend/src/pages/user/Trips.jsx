import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const Trips = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        setIsLoading(true);
        setError("");
        const token = await getToken();

        const response = await fetch(
          "http://localhost:5000/trip/history?limit=20&skip=0",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Failed to fetch trips");
        }

        setTrips(result?.data || []);
      } catch (err) {
        setError(err?.message || "Failed to fetch trips");
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [getToken, isLoaded, isSignedIn]);

  const summary = useMemo(() => {
    const total = trips.length;
    const accidentTrips = trips.filter(
      (trip) => trip?.safety?.accidentDetected,
    ).length;
    const avgSafety =
      total > 0
        ? Math.round(
            trips.reduce(
              (acc, trip) => acc + (trip?.safety?.safetyScore || 0),
              0,
            ) / total,
          )
        : 0;

    return { total, accidentTrips, avgSafety };
  }, [trips]);

  if (!isLoaded) {
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-8 text-muted-foreground">
        Please sign in to view trips.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trips</h1>
          <p className="text-muted-foreground mt-1">
            Your recent rides and safety summary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Trips</p>
            <p className="text-2xl font-semibold text-foreground">
              {summary.total}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Avg Safety</p>
            <p className="text-2xl font-semibold text-foreground">
              {summary.avgSafety}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Accident Trips</p>
            <p className="text-2xl font-semibold text-foreground">
              {summary.accidentTrips}
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Trip ID</th>
                  <th className="px-4 py-3 text-left font-medium">Start</th>
                  <th className="px-4 py-3 text-left font-medium">Duration</th>
                  <th className="px-4 py-3 text-left font-medium">Safety</th>
                  <th className="px-4 py-3 text-left font-medium">Accident</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                      Loading trips...
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                      No trips found.
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr
                      key={trip._id || trip.tripId}
                      className="border-t border-border"
                    >
                      <td className="px-4 py-3 text-foreground font-medium">
                        {trip.tripId || "--"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDateTime(trip.startTime)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDuration(trip.duration)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {trip?.safety?.safetyScore ?? 0}%
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {trip?.safety?.accidentDetected ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/trips/${trip.tripId}`}
                          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
