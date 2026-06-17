import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const departments = [
    {
      name: "IT",
      manager: "John Doe",
      description: "Responsible for software development and infrastructure.",
    },
    {
      name: "HR",
      manager: "Jane Smith",
      description: "Manages recruitment and employee relations.",
    },
    {
      name: "Finance",
      manager: "Robert Brown",
      description: "Handles budgeting, accounting and financial reporting.",
    },
  ];

  const handleDepartmentClick = (departmentName) => {
    const department = departments.find((dept) => dept.name === departmentName);

    setSelectedDepartment(department);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="body-page">
      {selectedDepartment && (
        <div
          className="department-overlay"
          onClick={() => setSelectedDepartment(null)}
        >
          <div className="department-card" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedDepartment.name}</h2>

            <p>
              <strong>Manager :</strong> {selectedDepartment.manager}
            </p>

            <p>
              <strong>Description :</strong> {selectedDepartment.description}
            </p>
          </div>
        </div>
      )}
      <h1 style={{ textAlign: "center" }}>About Nexus Portal Group</h1>
      <div className="aboutSection" data-aos="fade-left">
        <h2>About Us</h2>
        <p>
          This is the about page of our website. Lorem ipsum, dolor sit amet
          consectetur adipisicing elit. Quaerat amet, natus delectus distinctio
          numquam, dicta quia ea modi eius rerum officia commodi alias velit!
          Tempore labore deserunt expedita ducimus odit.
        </p>
      </div>
      <div className="missionSection" data-aos="fade-right">
        <h2>Our Mission</h2>
        <p>
          At Nexus Portal Group, we are committed to providing innovative
          solutions that empower businesses and individuals to achieve their
          goals. Our mission is to create seamless experiences that bridge the
          gap between technology and human interaction.
        </p>
      </div>
      <div className="departmentSection" data-aos="fade-up">
        <h2>Departments</h2>
        <p>
          We have several departments that work together to provide
          comprehensive solutions for our clients.
        </p>
        <ul>
          {departments.map((dept, index) => (
            <li key={index} onClick={() => handleDepartmentClick(dept.name)}>
              <strong>{dept.name}:</strong> {dept.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
