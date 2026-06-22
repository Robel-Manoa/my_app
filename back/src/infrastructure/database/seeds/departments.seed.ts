// src/infrastructure/database/seeds/departments.seed.ts
import { Department } from '../../../domain/entities/Department';

export const departmentsData = [
  {
    id: 'dep-it',
    name: 'IT & Innovation',
    code: 'IT',
    description: 'Département chargé des solutions numériques et innovation',
  },
  {
    id: 'dep-audit',
    name: 'Audit & Assurance',
    code: 'AUD',
    description: 'Audit financier et certification',
  },
  {
    id: 'dep-finance',
    name: 'Finance & Tax',
    code: 'FIN',
    description: 'Gestion financière et fiscalité',
  },
  {
    id: 'dep-hr',
    name: 'Human Resources',
    code: 'HR',
    description: 'Gestion des ressources humaines',
  },
  {
    id: 'dep-advisory',
    name: 'Advisory & Consulting',
    code: 'ADV',
    description: 'Conseil et accompagnement stratégique',
  },
];

export async function seedDepartments(repository: any) {
  console.log('Seeding Departments...');
  for (const data of departmentsData) {
    const department = new Department(data);
    await repository.save(department);
  }
  console.log('✅ Departments seeded');
}