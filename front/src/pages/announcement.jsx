import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiGet } from "../api";

function CardAnnouncement(props) {
  return (
    <div className="cardAnnoucement" data-aos="fade-up">
      <div className="card-head">
        <h2>{props.announcement.title}</h2>
      </div>
      <div className="card-body">
        <p>{props.announcement.body || props.announcement.content}</p>
      </div>
      <div className="card-footer">
        <ul>
          <li>
            Author:{" "}
            {props.announcement.author || props.announcement.authorId || "Team"}
          </li>
          <li>
            Department:{" "}
            {props.announcement.department ||
              props.announcement.departmentId ||
              "General"}
          </li>
          <li>
            Date:{" "}
            {new Date(
              props.announcement.publishedAt ||
                props.announcement.createdAt ||
                Date.now(),
            ).toLocaleDateString()}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Announcement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await apiGet("/announcements");
        setAnnouncements(data || []);
      } catch (err) {
        setError(err.message || "Unable to load announcements");
      } finally {
        setLoading(false);
      }
    };

    AOS.init({ duration: 1000 });
    loadAnnouncements();
  }, []);

  const searchAnnouncements = (query) => {
    const normalizedQuery = query.toLowerCase();
    return announcements.filter(
      (announcement) =>
        (announcement.title || "").toLowerCase().includes(normalizedQuery) ||
        (announcement.body || announcement.content || "")
          .toLowerCase()
          .includes(normalizedQuery),
    );
  };

  return (
    <div className="body-page">
      <h1>Announcements Lists</h1>
      <div className="searcher-bar" data-aos="fade-down">
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <p
        style={{ marginBottom: "50px", marginTop: "10px" }}
        data-aos="fade-left"
      >
        Latest updates from your organization are listed here.
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Loading announcements…</p> : null}
      {searchAnnouncements(searchQuery).map((announcement) => (
        <CardAnnouncement key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
