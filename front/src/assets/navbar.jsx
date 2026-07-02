import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("portalToken")),
  );

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("portalToken")));
    };

    syncAuth();
    window.addEventListener("authchange", syncAuth);
    return () => window.removeEventListener("authchange", syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("portalToken");
    localStorage.removeItem("portalUser");
    window.dispatchEvent(new Event("authchange"));
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="head-navbar">
        <h2>Nexus Portal Group</h2>
      </div>
      <Link to="/" className="navbar-link">
        Home
      </Link>
      <Link to="/about" className="navbar-link">
        About
      </Link>
      <Link to="/announcements" className="navbar-link">
        Announcements
      </Link>
      <Link to="/feedback" className="navbar-link">
        Feedback
      </Link>
      <Link to="/contact" className="navbar-link">
        Contact
      </Link>
      {isAuthenticated ? (
        <button type="button" id="navbar-link" className="navbar-link" onClick={handleLogout}>
          Logout
        </button>
      ) : null}
    </nav>
  );
}
