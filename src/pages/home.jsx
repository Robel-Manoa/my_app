import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [detailTeamGroup, setDetailTeamGroup] = React.useState(null);
  const user = {
    name: "John Doe",
    poste: "Software Engineer",
    department: "Engineering",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, Cityville",
    employeeId: "EMP01",
    hireDate: "January 1, 2020",
    status: "Active",
  };

  const department = {
    name: "Engineering",
    manager: "Jane Smithe",
    location: "Building A, Floor 3",
    description:
      "Description of the department lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };

  const departmentGroups = [
    {
      name: "Team Alpha",
      lead: "Alice Johnson",
      members: ["Bob Brown", "Charlie Davis", "David Wilson"],
    },
    {
      name: "Team Beta",
      lead: "Emily Clark",
      members: ["Frank Miller", "Grace Lee", "Henry Taylor"],
    },
  ];

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="body-page">
      {detailTeamGroup && (
        <div className="department-overlay">
          <h2>{detailTeamGroup.name}</h2>
          <p>Team Lead: {detailTeamGroup.lead}</p>
          <p>Members: {detailTeamGroup.members.join(", ")}</p>
          <p>{detailTeamGroup.description}</p>
        </div>
      )}
      <div className="Personnal-User" data-aos="fade-left">
        <h1>
          Welcome <span className="nameUser">John Doe</span>
        </h1>
        <p>
          Poste : <span className="posteuser">Software Engineer</span>
        </p>
        <p>
          Department : <span className="departmentuser">Engineering</span>
        </p>
      </div>
      <div className="department-info" data-aos="fade-up">
        <h2>Department Information</h2>
        <p>Department Name: {department.name}</p>
        <p>Manager: {department.manager}</p>
        <p>Location: {department.location}</p>
        <p className="home-desc-department">
          <span>Description :</span>
          {department.description}
        </p>
      </div>
      <div className="department-group" data-aos="fade-up">
        <h2>Department Group</h2>
        {departmentGroups.map((group, index) => (
          <div className="card-department-group" key={index} data-aos="fade-up">
            <h3>{group.name}</h3>
            <p>Team Lead: {group.lead}</p>
            <p>Members: {group.members.join(", ")}</p>
            <button onClick={() => detailTeamGroup(group)}>View Details</button>
          </div>
        ))}
      </div>

      <div className="personnal-info" data-aos="fade-up">
        <h2>Personal Information</h2>
        <ul>
          {user.name && <li>Full Name: {user.name}</li>}
          {user.poste && <li>Role: {user.poste}</li>}
          {user.email && <li>Email: {user.email}</li>}
          {user.phone && <li>Phone: {user.phone}</li>}
          {user.address && <li>Address: {user.address}</li>}
          {user.employeeId && <li>Employee ID: {user.employeeId}</li>}
          {user.department && <li>Department: {user.department}</li>}
          {user.poste && <li>Position: {user.poste}</li>}
          {user.hireDate && <li>Hire Date: {user.hireDate}</li>}
          {user.status && <li>Status: {user.status}</li>}
        </ul>
      </div>
    </div>
  );
}
