import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/clerk-react";

function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div>
      <h2>Welcome to Smart Helmet landing Page</h2>
      <header>
        {!isSignedIn ? (
          <>
            <SignInButton />
            <SignUpButton />
          </>
        ) : (
          <Navigate to="/dashboard" />
        )}
      </header>
    </div>
  );
}

export default Home;
