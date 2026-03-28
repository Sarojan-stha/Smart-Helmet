import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../navbar/AdminNavbar";

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <AdminNavbar />
      <main style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
