// Static admin dashboard data.
// These arrays are easy to replace with backend data later.

export const adminSummaryCards = [
  {
    id: "summary-departments",
    iconName: "building",
    label: "Number of Department",
    value: 1,
  },
  {
    id: "summary-announcements",
    iconName: "bullhorn",
    label: "Number of Announcement",
    value: 12,
  },
  {
    id: "summary-feedback",
    iconName: "comments",
    label: "Number of Feedback",
    value: 12,
  },
  {
    id: "summary-employees",
    iconName: "users",
    label: "Number of Employees",
    value: 12,
  },
];

export const adminChartData = {
  labels: ["HR", "IT", "Finance", "Marketing"],
  datasets: [
    {
      label: "Employees",
      data: [25, 40, 18, 17],
    },
  ],
};

export const employeeStatusOptions = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export const employeeDepartmentOptions = [
  { id: "it", label: "IT" },
  { id: "hr", label: "HR" },
  { id: "finance", label: "Finance" },
  { id: "marketing", label: "Marketing" },
];

export const employeeRows = [
  {
    id: "001",
    lastName: "Doe",
    firstName: "John",
    position: "Software Engineer",
    department: "IT",
    status: "Active",
  },
  {
    id: "002",
    lastName: "Smith",
    firstName: "Jane",
    position: "Product Manager",
    department: "IT",
    status: "Active",
  },
  {
    id: "003",
    lastName: "Taylor",
    firstName: "Anna",
    position: "UX Designer",
    department: "IT",
    status: "Active",
  },
  {
    id: "004",
    lastName: "Brown",
    firstName: "Michael",
    position: "HR Coordinator",
    department: "HR",
    status: "Active",
  },
  {
    id: "005",
    lastName: "Wilson",
    firstName: "Emily",
    position: "Accountant",
    department: "Finance",
    status: "Inactive",
  },
  {
    id: "006",
    lastName: "Garcia",
    firstName: "Carlos",
    position: "Marketing Specialist",
    department: "Marketing",
    status: "Active",
  },
  {
    id: "007",
    lastName: "Lee",
    firstName: "Sophie",
    position: "Sales Executive",
    department: "Marketing",
    status: "Active",
  },
  {
    id: "008",
    lastName: "Martin",
    firstName: "Louis",
    position: "Financial Analyst",
    department: "Finance",
    status: "Active",
  },
  {
    id: "009",
    lastName: "Nguyen",
    firstName: "Huy",
    position: "DevOps Engineer",
    department: "IT",
    status: "Inactive",
  },
  {
    id: "010",
    lastName: "Khan",
    firstName: "Aisha",
    position: "Recruiter",
    department: "HR",
    status: "Active",
  },
  {
    id: "011",
    lastName: "Dubois",
    firstName: "Claire",
    position: "UX Researcher",
    department: "Marketing",
    status: "Active",
  },
  {
    id: "012",
    lastName: "Petrov",
    firstName: "Ivan",
    position: "IT Support",
    department: "IT",
    status: "Active",
  },
];
