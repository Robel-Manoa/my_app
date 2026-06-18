import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Mockannouncements } from "../data/announcement";

function CardAnnouncement(props) {
  return (
    <div className="cardAnnoucement" data-aos="fade-up">
      <div className="card-head">
        <h2>{props.announcement.title}</h2>
      </div>
      <div className="card-body">
        <p>{props.announcement.content}</p>
      </div>
      <div className="card-footer">
        <ul>
          <li>Author: {props.announcement.author}</li>
          <li>Department: {props.announcement.department}</li>
          <li>Date: {props.announcement.date}</li>
        </ul>
      </div>
    </div>
  );
}

export default function Announcement() {
  const [searchQuery, setSearchQuery] = useState("");
  const announcements = Mockannouncements;

  const searchAnnouncements = (query) => {
    return announcements.filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(query.toLowerCase()) ||
        announcement.content.toLowerCase().includes(query.toLowerCase()),
    );
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi
        laborum nemo nam ducimus voluptatum accusamus molestiae alias magnam
        facere veritatis repudiandae quod praesentium, aut officia. Iure eum
        repudiandae dolor. Ratione!
      </p>
      {searchAnnouncements(searchQuery).map((announcement) => (
        <CardAnnouncement
          key={announcement.id}
          announcement={announcement}
        ></CardAnnouncement>
      ))}
    </div>
  );
}
