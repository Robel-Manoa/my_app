import { Routes, Route, Link } from "react-router-dom";
import HomeAdmin from "../pages/home-admin";
import "../styles/admin-layout.css";

export default function AdminLayout() {
  return (
    <div className="admin-root">
      <nav className="admin-navbar">
        <div className="admin-head-navbar">
          <h2>Admin Portal</h2>
        </div>
        <Link to="/admin/home-admin" className="navbar-link">
          Home
        </Link>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="home-admin" element={<HomeAdmin />} />
        </Routes>
      </div>
    </div>
  );
}
