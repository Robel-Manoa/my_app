// src/infrastructure/database/seeds/users.seed.ts
import { User } from '../../../domain/entities/User';

export const usersData = [
  {
    id: 'user-hr-1',
    azureId: 'azure-hr-001',
    email: 'rahul.thakoor@company.com',
    firstName: 'Rahul',
    lastName: 'Thakoor',
    role: 'HR_ADMIN' as const,
    isActive: true,
  },
  {
    id: 'user-da-it',
    azureId: 'azure-da-001',
    email: 'alice.martin@company.com',
    firstName: 'Alice',
    lastName: 'Martin',
    role: 'DEPT_ADMIN' as const,
    isActive: true,
  },
  {
    id: 'user-emp-1',
    azureId: 'azure-emp-001',
    email: 'john.doe@company.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'EMPLOYEE' as const,
    isActive: true,
  },
  {
    id: 'user-emp-2',
    azureId: 'azure-emp-002',
    email: 'sophie.dupont@company.com',
    firstName: 'Sophie',
    lastName: 'Dupont',
    role: 'EMPLOYEE' as const,
    isActive: true,
  },
];

export async function seedUsers(repository: any) {
  console.log('Seeding Users...');
  for (const data of usersData) {
    const user = new User(data);
    await repository.save(user);
  }
  console.log('Users seeded');
}