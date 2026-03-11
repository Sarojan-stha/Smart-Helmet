import { Link } from "react-router-dom";
import {
  useAuth,
  UserButton,
  useUser,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/clerk-react";

function LandingNavbar() {
  const { signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <nav
      style={{
        background: "#333",
        color: "#fff",
        padding: "10px",
      }}
    >
      <Link to="/contacts" style={{ margin: "0 10px", color: "#fff" }}>
        Contacts
      </Link>
      <Link to="/aboutUs" style={{ margin: "0 10px", color: "#fff" }}>
        About Us
      </Link>

      <SignInButton />
      <SignUpButton />
      {isSignedIn ? <button onClick={signOut}>Logout</button> : null}

      {isSignedIn ? <UserButton /> : null}
    </nav>
  );
}

export default LandingNavbar;
