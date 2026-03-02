import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>; // prevent premature redirect isSigned takes longer to load 
  }

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
