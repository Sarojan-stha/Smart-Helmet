import { Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Dashboard from "./pages/user/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { socketConnect } from "./lib/socket";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import Helmet from "./pages/user/Helmet";
import NotFound from "./pages/errors/NotFound";
import AdminLayout from "./components/layouts/AdminLayout";
import UserLayout from "./components/layouts/UserLayout";
import MainLayout from "./components/layouts/MainLayout";
import { Login } from "./pages/clerkAuth/Login";
import { Signup } from "./pages/clerkAuth/Signup";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { Profile } from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Helmets from "./pages/admin/Helmets";

function App() {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const initSocket = async () => {
      if (isSignedIn) {
        const token = await getToken({ skipCache: true });
        socketConnect(token, isSignedIn);
      } else {
        socketConnect(null, isSignedIn);
      }
    };
    initSocket();
  }, [isSignedIn, getToken]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/contacts" element={<Contacts />} /> */}
        {/* <Route path="/aboutUs" element={<AboutUs />} /> */}
      </Route>

      <Route element={<ProtectedRoute role="user" />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/helmet" element={<Helmet />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/alerts" element={<Alerts />} /> */}
          {/* <Route path="/ride-history" element={<RideHistory />} /> */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/admin/users" element={<Users />} />x */}
          <Route path="/admin/helmets" element={<Helmets />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          {/* <Route path="/admin/telemetry" element={<Telemetry />} /> */}
          {/* <Route path="/admin/analytics" element={<Analytics />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<NotFound />} />
    </Routes>
  );
}

export default App;
