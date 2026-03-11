import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../navbar/UserNavbar";
import AdminNavbar from "../navbar/AdminNavbar";

const AdminLayout = () => {
  return (
    <>
      <h1>Admin Layout</h1>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        {/* Main content area */}
        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet /> {/* Renders the matched route component */}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
