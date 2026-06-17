import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/home';
import About from '../pages/about';
import Contact from '../pages/contact';
import Feedback from '../pages/feedback';
import Announcements from '../pages/announcement';

export default function Navbar() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <div className="head-navbar">
                    <h2>Nexus Portal Group</h2>
                </div>
                <Link to="/" className="navbar-link">Home</Link>
                <Link to="/about" className="navbar-link">About</Link>
                <Link to="/announcemements" className="navbar-link">Announcements</Link>
                <Link to="/feedback" className="navbar-link">Feedback</Link>
                <Link to="/contact" className="navbar-link">Contact</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/announcemements" element={<Announcements />} />
            </Routes>
        </BrowserRouter>
    );
}