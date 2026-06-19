import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { mockDepartment } from "../data/department";

function MissionSection() {
  return (
    <div className="missionSection" data-aos="fade-right">
      <h2>Our Mission</h2>
      <p>
        At Nexus Portal Group, we are committed to providing innovative
        solutions that empower businesses and individuals to achieve their
        goals. Our mission is to create seamless experiences that bridge the gap
        between technology and human interaction.
      </p>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="aboutSection" data-aos="fade-left">
      <h2>About Us</h2>
      <p>
        This is the about page of our website. Lorem ipsum, dolor sit amet
        consectetur adipisicing elit. Quaerat amet, natus delectus distinctio
        numquam, dicta quia ea modi eius rerum officia commodi alias velit!
        Tempore labore deserunt expedita ducimus odit.
      </p>
    </div>
  );
}

function SepartmentSection(props) {
  return (
    <div className="departmentSection" data-aos="fade-up">
      <h2>Departments</h2>
      <p>
        We have several departments that work together to provide comprehensive
        solutions for our clients.
      </p>
      <ul>
        {mockDepartment.map((dept, index) => (
          <li
            key={index}
            onClick={() => props.handleDepartmentClick(dept.name)}
          >
            <strong>{dept.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DepartmentOverlay(props) {
  return (
    <div
      className="department-overlay"
      onClick={() => props.setSelectedDepartment(null)}
    >
      <div className="department-card" onClick={(e) => e.stopPropagation()}>
        <h2>{props.selectedDepartment.name}</h2>

        <p>
          <strong>Manager :</strong> {props.selectedDepartment.manager}
        </p>

        <p>
          <strong>Description :</strong> {props.selectedDepartment.description}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleDepartmentClick = (departmentName) => {
    const department = mockDepartment.find(
      (dept) => dept.name === departmentName,
    );

    setSelectedDepartment(department);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="body-page">
      {selectedDepartment && (
        <DepartmentOverlay
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        ></DepartmentOverlay>
      )}
      <h1 style={{ textAlign: "center" }}>About Nexus Portal Group</h1>
      <AboutSection></AboutSection>
      <MissionSection></MissionSection>
      <SepartmentSection
        handleDepartmentClick={handleDepartmentClick}
      ></SepartmentSection>
    </div>
  );
}
