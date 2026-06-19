import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getRelativePosition } from "chart.js/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faBullhorn,
  faComments,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  adminSummaryCards,
  adminChartData,
  employeeStatusOptions,
  employeeDepartmentOptions,
  employeeRows,
} from "../data/adminData";

const summaryIconMap = {
  building: faBuilding,
  bullhorn: faBullhorn,
  comments: faComments,
  users: faUsers,
};

function PaginationContent({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <ul className="pagination">
      <li>
        <a href="#">&laquo;</a>
      </li>
      <li>
        <a href="#">1</a>
      </li>
      <li>
        <a href="#">2</a>
      </li>
      <li>
        <a href="#">3</a>
      </li>
      <li>
        <a href="#">4</a>
      </li>
      <li>
        <a href="#">5</a>
      </li>
      <li>
        <a href="#">&raquo;</a>
      </li>
    </ul>
  );
}

export default function HomeAdmin() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return employeeRows.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          employee.id,
          employee.lastName,
          employee.firstName,
          employee.position,
          employee.department,
          employee.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        !departmentFilter ||
        employee.department.toLowerCase() === departmentFilter;

      const matchesStatus =
        !statusFilter || employee.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, departmentFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const visibleRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "doughnut", // ou "pie", "bar", "line"
      data: adminChartData,
      options: {
        responsive: true,

        onClick: (e) => {
          const canvasPosition = getRelativePosition(e, chartInstance.current);

          const dataX = chartInstance.current.scales?.x?.getValueForPixel(
            canvasPosition.x,
          );

          const dataY = chartInstance.current.scales?.y?.getValueForPixel(
            canvasPosition.y,
          );

          console.log(dataX, dataY);
        },
      },
    });

    return () => {
      chartInstance.current.destroy();
    };
  }, []);
  return (
    <>
      <div className="headers">
        <h2>Summary</h2>
        {adminSummaryCards.map((card) => (
          <div key={card.id} className="card-content">
            <FontAwesomeIcon
              icon={summaryIconMap[card.iconName]}
              className="home-icone"
            />
            <p>{card.label}</p>
            <span>{card.value}</span>
          </div>
        ))}
      </div>
      <div className="section-stat">
        <div className="circle-stat">
          <h3>Employee List</h3>
          <input
            type="search"
            name="searchemployee"
            id="searchemployee"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search employee"
          />
          <label htmlFor="department-filter">Filter : Department</label>
          <select
            name="department-filter"
            id="department-filter"
            value={departmentFilter}
            onChange={(event) => {
              setDepartmentFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            {employeeDepartmentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <label htmlFor="status-filter">Status </label>
          <select
            name="status-filter"
            id="status-filter"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            {employeeStatusOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <table className="employee-table">
            <thead>
              <tr>
                <td>ID</td>
                <td>Last Name</td>
                <td>First name</td>
                <td>Position</td>
                <td>Department</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.status}</td>
                  <td>
                    <button>Detail</button>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan="7">Aucun résultat trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationContent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <div className="employee-stat">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </>
  );
}
