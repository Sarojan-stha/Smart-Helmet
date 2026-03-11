import { Link } from "react-router-dom";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";

function UserNavbar() {
  const { signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  const role = user?.publicMetadata?.role;
  console.log("role:", role);

  return (
    <nav
      style={{
        background: "#333",
        color: "#fff",
        padding: "10px",
      }}
    >
      <Link to="/dashboard" style={{ margin: "0 10px", color: "#fff" }}>
        Dashboard
      </Link>
      <Link to="/helmet" style={{ margin: "0 10px", color: "#fff" }}>
        Helmet
      </Link>
      <Link to="telemetry" style={{ margin: "0 10px", color: "#fff" }}>
        Telemetry
      </Link>
      <Link to="/profile" style={{ margin: "0 10px", color: "#fff" }}>
        Profile
      </Link>
      {isSignedIn ? <button onClick={signOut}>Logout</button> : null}
      <UserButton />
    </nav>
  );
}

export default UserNavbar;
