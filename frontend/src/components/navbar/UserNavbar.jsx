import { Link } from "react-router-dom";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { useModalStore } from "../../store/useModelStore";
import { Home, Activity, AlertTriangle, User, HardHat } from "lucide-react";

function UserNavbar() {
  const { signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded)
    return <div className="p-4 text-muted-foreground">Loading...</div>;

  const role = user?.publicMetadata?.role;
  console.log("role:", role);

  return (
    <nav className="bg-navbar text-navbar-foreground flex items-center justify-between px-6 py-3 shadow-md backdrop-blur-md sticky top-0 z-50">
      {/* Left: Logo / Brand */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold hover:text-primary transition"
        >
          <Home size={20} /> Smart Helmet
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <Home size={16} /> Dashboard
        </Link>
        <Link
          to="/helmet"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <HardHat size={16} /> Helmet
        </Link>
        <Link
          to="/trips"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <Activity size={16} /> Trips
        </Link>
        <button
          onClick={() =>
            useModalStore.getState().openModal({
              type: "error",
              message: "Test accident alert from navbar",
              extraData: {
                timestamp: new Date().toISOString(),
                location: {
                  latitude: 28.6139,
                  longitude: 77.209,
                },
              },
            })
          }
          className="flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-lg hover:opacity-90 transition"
        >
          <AlertTriangle size={16} /> Alert
        </button>
      </div>

      {/* Right: Profile / Logout */}
      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <User size={16} /> Profile
        </Link>
        {isSignedIn && (
          <button
            onClick={signOut}
            className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg hover:opacity-90 transition"
          >
            Logout
          </button>
        )}
        <UserButton />
      </div>
    </nav>
  );
}

export default UserNavbar;
