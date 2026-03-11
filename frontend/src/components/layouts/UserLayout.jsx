import { Outlet } from "react-router-dom";
import UserNavbar from "../navbar/UserNavbar";

const UserLayout = () => {
  return (
    <>
      <h1>User layout</h1>
      <UserNavbar />
      <div style={{ display: "flex" }}>
        {/* Main content area */}
        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet /> {/* Renders the matched route component */}
        </main>
      </div>
    </>
  );
};

export default UserLayout;
