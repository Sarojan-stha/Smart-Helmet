import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  useUser,
  SignIn,
} from "@clerk/clerk-react";

function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  console.log("user:", user);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (isSignedIn) {
    const role = user.publicMetadata?.role;
    switch (role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      //replace avoids adding the landing page to browser history (so the user can’t go back to it using back button).
      case "user":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }
  return (
    <div>
      <h2>Welcome to Smart Helmet landing Page</h2>
      <header></header>
    </div>
  );
}

export default Home;
