// src/infrastructure/database/seed.ts
import { Department } from '../../domain/entities/Department';
import { seedUsers } from './seeds/users.seed';
import { seedEmployees } from './seeds/employees.seed';

export async function runAllSeeds(repository: any) {
  console.log('Starting database seeding...\n');

  await new Department(repository);
  await seedUsers(repository);
  await seedEmployees(repository);

  console.log('\n All seeds completed successfully!');
}

// Pour exécuter directement (optionnel)
if (require.main === module) {
  // runAllSeeds(yourRepository);
}