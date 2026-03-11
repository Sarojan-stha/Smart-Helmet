import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const { isSignedIn, isLoaded } = useAuth();

  const { user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>; // prevent premature redirect isSigned takes longer to load
  } //later keep a loader component

  console.log("Role:", role);

  if (user.publicMetadata?.role !== role)
    return <Navigate to="/unauthorized" />;

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
