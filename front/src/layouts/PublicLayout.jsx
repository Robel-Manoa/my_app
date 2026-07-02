import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../assets/navbar";
import Home from "../pages/home";
import About from "../pages/about";
import Contact from "../pages/contact";
import Feedback from "../pages/feedback";
import Announcements from "../pages/announcement";
import Login from "../pages/login";

function RequireAuth({ children }) {
  const location = useLocation();
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

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function PublicLayout() {
  return (
    <div className="App">
      <Navbar />
      <div className="public-content">
        <RequireAuth>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </RequireAuth>
      </div>
    </div>
  );
}
