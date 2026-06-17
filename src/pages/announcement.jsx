import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Announcement() {
    const [searchQuery, setSearchQuery] = useState("");
    const announcements = [
        {
            id: 1,
            status: "Published",
            title: "Announcement Title",
            content: "Announcement content goes here. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            author: "John Doe",
            department: "Marketing",
            date: "June 10, 2024"
        },
        {
            id: 2,
            status: "Draft",
            title: "Another Announcement",
            content: "This is another announcement content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            author: "Jane Smith",
            department: "Sales",
            date: "June 15, 2024"
        },
        {
            id: 3,
            status: "Published",
            title: "Important Update",
            content: "Important update content goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            author: "John Doe",
            department: "Marketing",
            date: "June 20, 2024"
        }
    ];

    const searchAnnouncements = (query) => {
        return announcements.filter((announcement) =>
            announcement.title.toLowerCase().includes(query.toLowerCase()) ||
            announcement.content.toLowerCase().includes(query.toLowerCase())
        );
    }

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
            <p style={{marginBottom: "50px", marginTop: "10px"}} data-aos="fade-left">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi laborum nemo nam ducimus voluptatum accusamus molestiae alias magnam facere veritatis repudiandae quod praesentium, aut officia. Iure eum repudiandae dolor. Ratione!
            </p>
            {searchAnnouncements(searchQuery).map((announcement) => (
                <div className="cardAnnoucement" key={announcement.id} data-aos="fade-up">
                    <div className="card-head">
                        <h2>{announcement.title}</h2>
                    </div>
                    <div className="card-body">
                        <p>{announcement.content}</p>
                    </div>
                    <div className="card-footer">
                        <ul>
                            <li>Author: {announcement.author}</li>
                            <li>Department: {announcement.department}</li>
                            <li>Date: {announcement.date}</li>
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}