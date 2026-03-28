import React from "react";
import { Outlet } from "react-router-dom";
import LandingNavbar from "../navbar/LandingNavbar";

const MainLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <LandingNavbar />
      <main style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
