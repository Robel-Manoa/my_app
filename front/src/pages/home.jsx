import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiGet, getCurrentUser } from "../api";

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
        {props.user.department && <li>Department: {props.user.department}</li>}
        {props.user.jobTitle && <li>Position: {props.user.jobTitle}</li>}
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
        Role : <span className="posteuser">{props.user.poste}</span>
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
  const [user, setUser] = useState({
    name: "Employee",
    poste: "Employee",
    department: "",
    email: "",
    jobTitle: "",
  });
  const [departmentGroups, setDepartmentGroups] = useState([]);
  const [department, setDepartment] = useState({
    name: "",
    manager: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init();

    const loadDashboard = async () => {
      try {
        const [departmentsResponse, meResponse] = await Promise.all([
          apiGet("/departments"),
          apiGet("/auth/me"),
        ]);

        const storedUser = meResponse?.user || getCurrentUser();
        const normalizedUser = {
          name: storedUser
            ? `${storedUser.firstName ?? ""} ${storedUser.lastName ?? ""}`.trim() ||
              storedUser.email ||
              "Employee"
            : "Employee",
          poste: storedUser?.role || "Employee",
          email: storedUser?.email || "",
          department: storedUser?.department || "",
          jobTitle: storedUser?.jobTitle || "",
        };

        setUser(normalizedUser);

        const mappedGroups = (departmentsResponse || []).map((item) => ({
          id: item.id,
          name: item.name,
          lead: item.code || "Team Lead",
          members: [item.code || "Team"],
          description: item.description,
        }));

        setDepartmentGroups(mappedGroups);

        const selectedDepartment = departmentsResponse?.[0] || null;
        if (selectedDepartment) {
          setDepartment({
            name: selectedDepartment.name,
            manager: selectedDepartment.code || "Manager pending",
            location: "Office",
            description: selectedDepartment.description,
          });
        }
      } catch (err) {
        setError(err.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const toggleDetailTeamGroup = (group) => {
    setDetailTeamGroup((current) => (current?.id === group.id ? null : group));
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

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Loading your dashboard…</p> : null}

      <PersonnalUser user={user} />
      <DepartmentInformation department={department} />
      <DepartmentGroup
        selectedTeamId={detailTeamGroup?.id}
        onSelectGroup={toggleDetailTeamGroup}
        departmentGroups={departmentGroups}
      />
      <PersonalInformation user={user} />
    </div>
  );
}
