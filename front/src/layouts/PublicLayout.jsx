import { Routes, Route } from "react-router-dom";
import Navbar from "../assets/navbar";
import Home from "../pages/home";
import About from "../pages/about";
import Contact from "../pages/contact";
import Feedback from "../pages/feedback";
import Announcements from "../pages/announcement";

export default function PublicLayout() {
  return (
    <div className="App">
      <Navbar />
      <div className="public-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/announcemements" element={<Announcements />} />
        </Routes>
      </div>
    </div>
  );
}
