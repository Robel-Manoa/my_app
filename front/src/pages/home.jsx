import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { mockUser } from "../data/user";
import { mockDepartmentGroups } from "../data/departmentGroups";
import { mockDepartment } from "../data/department";

function DepartmentGroup({ departmentGroups, selectedTeamId, onSelectGroup }) {
  return (
    <div className="department-group">
      <h2>Department Group</h2>

      {departmentGroups.map((group) => (
        <div className="card-department-group" key={group.id}>
          <h3>{group.name}</h3>

          <p>Team Lead: {group.lead}</p>

          <p>Members: {group.members.join(", ")}</p>

          <button onClick={() => onSelectGroup(group)}>
            {group.id === selectedTeamId ? "Hide Details" : "View Details"}
          </button>
        </div>
      ))}
    </div>
  );
}

function PersonalInformation(props) {
  return (
    <div className="personnal-info" data-aos="fade-up">
      <h2>Personal Information</h2>
      <ul>
        {props.user.name && <li>Full Name: {props.user.name}</li>}
        {props.user.poste && <li>Role: {props.user.poste}</li>}
        {props.user.email && <li>Email: {props.user.email}</li>}
        {props.user.phone && <li>Phone: {props.user.phone}</li>}
        {props.user.address && <li>Address: {props.user.address}</li>}
        {props.user.employeeId && <li>Employee ID: {props.user.employeeId}</li>}
        {props.user.department && <li>Department: {props.user.department}</li>}
        {props.user.poste && <li>Position: {props.user.poste}</li>}
        {props.user.hireDate && <li>Hire Date: {props.user.hireDate}</li>}
        {props.user.status && <li>Status: {props.user.status}</li>}
      </ul>
    </div>
  );
}

function DepartmentInformation(props) {
  return (
    <div className="department-info" data-aos="fade-up">
      <h2>Department Information</h2>
      <p>Department Name: {props.department.name}</p>
      <p>Manager: {props.department.manager}</p>
      <p>Location: {props.department.location}</p>
      <p className="home-desc-department">
        <span>Description :</span>
        {props.department.description}
      </p>
    </div>
  );
}

function PersonnalUser(props) {
  return (
    <div className="Personnal-User" data-aos="fade-left">
      <h1>
        Welcome <span className="nameUser">{props.user.name}</span>
      </h1>
      <p>
        Poste : <span className="posteuser">{props.user.jobTitle}</span>
      </p>
      <p>
        Department :{" "}
        <span className="departmentuser">{props.user.department}</span>
      </p>
    </div>
  );
}

export default function Home() {
  const [detailTeamGroup, setDetailTeamGroup] = useState(null);
  const user = mockUser;
  const departmentGroups = mockDepartmentGroups;
  const department = mockDepartment;

  useEffect(() => {
    AOS.init();
  }, []);

  const toggleDetailTeamGroup = (group) => {
    setDetailTeamGroup((current) =>
      current?.id === group.id ? null : group
    );
  };

  return (
    <div className="body-page">
      {detailTeamGroup && (
        <div
          className="department-overlay"
          onClick={() => setDetailTeamGroup(null)}
        >
          <div className="department-card" onClick={(e) => e.stopPropagation()}>
            <h2>{detailTeamGroup.name}</h2>
            <p>{detailTeamGroup.description}</p>
            <p>Team Lead: {detailTeamGroup.lead}</p>
            <p>Members: {detailTeamGroup.members.join(", ")}</p>
          </div>
        </div>
      )}
      <PersonnalUser user={user}></PersonnalUser>
      <DepartmentInformation department={department}></DepartmentInformation>
      <DepartmentGroup
        selectedTeamId={detailTeamGroup?.id}
        onSelectGroup={toggleDetailTeamGroup}
        departmentGroups={departmentGroups}
      ></DepartmentGroup>

      <PersonalInformation user={user}></PersonalInformation>
    </div>
  );
}
