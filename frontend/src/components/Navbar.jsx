import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Employee Performance Analytics</h2>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/ai-recommendations">AI Insights</Link>
        <span style={{ opacity: 0.9, fontSize: "0.9rem" }}>
          {user.name ? `Hi, ${user.name}` : ""}
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
