import { Link } from "react-router-dom";

export default function Navbar() {
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
      <Link to="/announcemements" className="navbar-link">
        Announcements
      </Link>
      <Link to="/feedback" className="navbar-link">
        Feedback
      </Link>
      <Link to="/contact" className="navbar-link">
        Contact
      </Link>
    </nav>
  );
}
