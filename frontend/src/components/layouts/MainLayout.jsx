import React from "react";
import { Outlet } from "react-router-dom";
import LandingNavbar from "../navbar/LandingNavbar";

const MainLayout = () => {
  return (
    <div>
      <h1>Main Layout</h1>
      <LandingNavbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
