import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Zap, Plus, Trash2, HardHat } from "lucide-react";

export default function HelmetManagement() {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [helmet, setHelmet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    deviceId: "",
    model: "",
    firmwareVersion: "",
  });

  useEffect(() => {
    const fetchMyHelmet = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) return;

      try {
        setIsLoading(true);
        setMessage("");

        const token = await getToken();
        const response = await fetch("http://localhost:5000/helmet/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Failed to fetch helmets");
        }

        const fetchedHelmet = result?.data || null;
        if (fetchedHelmet && fetchedHelmet.riderId !== user.id) {
          setHelmet(null);
          return;
        }

        setHelmet(fetchedHelmet);
      } catch (error) {
        setMessage(error?.message || "Failed to fetch helmets");
        setHelmet(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyHelmet();
  }, [getToken, isLoaded, isSignedIn, user?.id]);

  const handleRegisterHelmet = async (e) => {
    e.preventDefault();
    setMessage("");
    if (
      !formData.deviceId.trim() ||
      !formData.model.trim() ||
      !formData.firmwareVersion.trim()
    ) {
      setMessage("Device ID, model and firmware version are required.");
      return;
    }

    try {
      setIsRegistering(true);
      const token = await getToken();
      const response = await fetch("http://localhost:5000/registerHelmet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          helmetData: {
            helmetId: formData.deviceId.trim(),
            helmetModel: formData.model.trim(),
            firmwareVersion: formData.firmwareVersion.trim(),
          },
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to register helmet");
      }

      setHelmet(result.data);
      setFormData({ deviceId: "", model: "", firmwareVersion: "" });
      setIsDialogOpen(false);
      setMessage("Helmet registered successfully.");
    } catch (error) {
      setMessage(error?.message || "Failed to register helmet");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteHelmet = async () => {
    setMessage("");
    if (!confirm("Are you sure you want to delete this helmet?")) return;

    try {
      setIsDeleting(true);
      const token = await getToken();
      const response = await fetch("http://localhost:5000/helmet/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to delete helmet");
      }

      setHelmet(null);
      setMessage("Helmet deleted successfully.");
    } catch (error) {
      setMessage(error?.message || "Failed to delete helmet");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isLoaded)
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  if (!isSignedIn) {
    return (
      <div className="p-8 text-muted-foreground">
        Please sign in to manage helmets.
      </div>
    );
  }

  const hasHelmet = Boolean(helmet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <HardHat className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Helmet Management
            </h1>
            <p className="text-muted-foreground">
              Register and manage your helmet devices for safer rides
            </p>
          </div>
        </div>

        {message ? (
          <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground">
            {message}
          </div>
        ) : null}

        {/* Helmet Status */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading helmets...
          </div>
        ) : hasHelmet ? (
          <div className="w-full max-w-md mr-auto">
            <div className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
              <div className="pb-3 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {helmet.helmetModel ||
                        `Helmet ${helmet.helmetId?.slice(-4) || "----"}`}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      {helmet.helmetId}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(helmet.status || "active")}`}
                >
                  {helmet.status || "active"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Battery
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="h-2 rounded-full transition-all bg-green-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Firmware</p>
                    <p className="font-mono text-xs mt-1">
                      {helmet.firmwareVersion || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Registered</p>
                    <p className="text-xs mt-1">
                      {helmet.createdAt
                        ? format(new Date(helmet.createdAt), "MMM d, yyyy")
                        : "--"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Last Communication
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {helmet.updatedAt
                      ? format(new Date(helmet.updatedAt), "MMM d, HH:mm:ss")
                      : "Never connected"}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleDeleteHelmet}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card pt-12 pb-12 text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              No helmet registered.
            </h3>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>
        )}

        {!hasHelmet && isDialogOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">
                Register Helmet
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter helmet details to register it to your account.
              </p>

              <form onSubmit={handleRegisterHelmet} className="space-y-4 mt-4">
                <div>
                  <label
                    htmlFor="deviceId"
                    className="text-sm font-medium text-foreground"
                  >
                    Device ID *
                  </label>
                  <input
                    id="deviceId"
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., HELMET-001-ABC123"
                    value={formData.deviceId}
                    onChange={(e) =>
                      setFormData({ ...formData, deviceId: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="model"
                    className="text-sm font-medium text-foreground"
                  >
                    Model *
                  </label>
                  <input
                    id="model"
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., SafeHelmet Pro X1"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="firmware"
                    className="text-sm font-medium text-foreground"
                  >
                    Firmware Version *
                  </label>
                  <input
                    id="firmware"
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 2.1.0"
                    value={formData.firmwareVersion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firmwareVersion: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isRegistering}>
                    {isRegistering ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
