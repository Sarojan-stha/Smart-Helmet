import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { socketConnect } from "./lib/socket";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import Helmet from "./pages/Helmet";
import NotFound from "./pages/NotFound";

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helmet"
          element={
            <ProtectedRoute>
              <Helmet />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
