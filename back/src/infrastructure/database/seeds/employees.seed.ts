// src/infrastructure/database/seeds/employees.seed.ts
import { Employee } from '../../../domain/entities/Employee';
import { EmployeeStatus } from '../../../domain/enums/EmployeeStatus';

export const employeesData = [
  {
    id: 'emp-1',
    userId: 'user-hr-1',
    employeeNumber: 'BT-1001',
    departmentId: 'dep-hr',
    position: 'Chief Technology Officer',
    joinDate: new Date('2022-01-15'),
    status: EmployeeStatus.ACTIVE,
  },
  {
    id: 'emp-2',
    userId: 'user-da-it',
    employeeNumber: 'BT-1002',
    departmentId: 'dep-it',
    position: 'IT Manager',
    joinDate: new Date('2023-03-01'),
    status: EmployeeStatus.ACTIVE,
  },
  {
    id: 'emp-3',
    userId: 'user-emp-1',
    employeeNumber: 'BT-1003',
    departmentId: 'dep-audit',
    position: 'Senior Auditor',
    joinDate: new Date('2024-01-10'),
    status: EmployeeStatus.ACTIVE,
  },
];

export async function seedEmployees(repository: any) {
  console.log('Seeding Employees...');
  for (const data of employeesData) {
    const employee = new Employee(data);
    await repository.save(employee);
  }
  console.log('Employees seeded');
}