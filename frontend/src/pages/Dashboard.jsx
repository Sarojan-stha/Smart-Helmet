import { UserButton, useUser, useAuth } from "@clerk/clerk-react";

function Dashboard() {
  const { user } = useUser();
  const { userId, sessionId, getToken, isLoaded, isSignedIn, signOut } =
    useAuth();

  const fetchData = async () => {
    const token = await getToken();
    console.log(token);

    try {
      const response = await fetch("http://localhost:5000/profileStatus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("response:", response);
      console.log("data:", data);
    } catch (error) {
      console.log("cannot fetch the data error:", error);
    }
  };
  const updateRole = async () => {
    const token = await getToken();
    console.log(token);
    try {
      const response = await fetch("http://localhost:5000/updateRole", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });
      const data = await response.json();
      console.log("response:", response);
      console.log("data:", data);
    } catch (error) {
      console.log("cannot fetch the data error:", error);
    }
  };

  return (
    <div>
      <UserButton />
      <h2>Dashboard</h2>
      <button onClick={updateRole}>Update role</button>
      <hr />
      <h2>Welcome</h2>
      <p>{user?.fullName}</p>
      {console.log("metadata:", user.publicMetadata)}

      <button onClick={signOut}>Logout</button>
      {/* Show the user button when the user is signed in */}

      <hr />

      <p>Helmet Data & Map will appear here</p>
      <button onClick={fetchData}>Fetch from backend</button>
    </div>
  );
}

export default Dashboard;
