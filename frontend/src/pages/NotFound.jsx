import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>
        This route is not available. <br />
        Check the URL or return to the dashboard.
      </p>
      <Link to="/" style={styles.button}>
        Go to Dashboard
      </Link>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    color: "#333",
    textAlign: "center",
  },
  code: {
    fontSize: "5rem",
    margin: "0",
  },
  title: {
    fontSize: "1.8rem",
    margin: "10px 0",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "20px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0d6efd",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default NotFound;
