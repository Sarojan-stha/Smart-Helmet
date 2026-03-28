import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Trophy,
} from "lucide-react";

const Profile = () => {
  const { openUserProfile } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="py-10 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="py-10 flex justify-center px-4">
        <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full text-center text-foreground">
          <p className="font-medium">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const stats = {
    trips: 24,
    accidents: 0,
    rideDistance: "156.5 km",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">
          Rider Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, view your personal info and riding statistics
        </p>
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto bg-card rounded-xl shadow overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-primary relative">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-card shadow-lg absolute -bottom-14 left-8 object-cover"
            />
          ) : (
            <div className="w-28 h-28 bg-primary-foreground rounded-full border-4 border-card shadow-lg absolute -bottom-14 left-8 flex items-center justify-center text-card text-3xl font-bold">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>
          )}
        </div>

        <div className="px-8 pt-20 pb-8">
          {/* Name and Username */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {user.fullName}
              </h2>
              <p className="text-muted-foreground text-sm">
                @{user.username || user.firstName?.toLowerCase()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button
                type="button"
                onClick={() => openUserProfile()}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sky-800 shadow-sm transition hover:bg-sky-100 hover:border-sky-300"
              >
                <User className="w-4 h-4" />
                Manage Profile
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg shadow text-center">
              <Trophy className="w-5 h-5 text-sky-700 mx-auto mb-2" />
              <p className="text-sm text-sky-700/80">Trips</p>
              <p className="text-xl font-bold text-sky-800">{stats.trips}</p>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg shadow text-center">
              <Clock className="w-5 h-5 text-rose-700 mx-auto mb-2" />
              <p className="text-sm text-rose-700/80">Accidents</p>
              <p className="text-xl font-bold text-rose-800">
                {stats.accidents}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg shadow text-center">
              <MapPin className="w-5 h-5 text-emerald-700 mx-auto mb-2" />
              <p className="text-sm text-emerald-700/80">Distance</p>
              <p className="text-xl font-bold text-emerald-800">
                {stats.rideDistance}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: User, label: "Full Name", value: user.fullName },
                {
                  icon: Mail,
                  label: "Email Address",
                  value: user.primaryEmailAddress?.emailAddress,
                },
                {
                  icon: Phone,
                  label: "Phone Number",
                  value: user.phoneNumber || "Not Provided",
                },
                { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
                {
                  icon: Calendar,
                  label: "Member Since",
                  value: "February 17, 2026",
                },
                {
                  icon: Clock,
                  label: "Last Sign In",
                  value: "Mar 28, 2026 16:09",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-card p-4 rounded-lg shadow-sm text-foreground"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {item.label}
                    </p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-muted p-4 rounded-lg shadow text-foreground">
            <p className="text-sm">
              Keep your profile updated for better tracking and notifications.
              Ensure your helmet device is registered and paired with the mobile
              app for live telemetry and accident alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Profile };
