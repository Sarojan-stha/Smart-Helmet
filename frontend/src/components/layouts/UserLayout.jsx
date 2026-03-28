import { Outlet } from "react-router-dom";
import UserNavbar from "../navbar/UserNavbar";

const UserLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <UserNavbar />
      <main style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
