// tests/unit/infrastructure/database/seed.test.ts
import { runAllSeeds } from "../../../../src/infrastructure/database/seed";
import * as departmentSeed from "../../../../src/infrastructure/database/seeds/departments.seed";
import * as userSeed from "../../../../src/infrastructure/database/seeds/users.seed";
import * as employeeSeed from "../../../../src/infrastructure/database/seeds/employees.seed";

describe("Database Seeder", () => {
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { save: jest.fn() };

    // Mock complet pour éviter les appels réels
    jest
      .spyOn(departmentSeed, "seedDepartments")
      .mockImplementation(async () => {});
    jest.spyOn(userSeed, "seedUsers").mockImplementation(async () => {});
    jest
      .spyOn(employeeSeed, "seedEmployees")
      .mockImplementation(async () => {});
  });

  it("should execute seeds in correct order", async () => {
    await runAllSeeds(mockRepo);

    const deptCallOrder = (departmentSeed.seedDepartments as jest.Mock).mock
      .invocationCallOrder[0];
    const userCallOrder = (userSeed.seedUsers as jest.Mock).mock
      .invocationCallOrder[0];
    const empCallOrder = (employeeSeed.seedEmployees as jest.Mock).mock
      .invocationCallOrder[0];

    // Vérification de sécurité
    expect(deptCallOrder).toBeDefined();
    expect(userCallOrder).toBeDefined();
    expect(empCallOrder).toBeDefined();

    // Comparaison des ordres d'appel
    expect(deptCallOrder!).toBeLessThan(userCallOrder!);
    expect(userCallOrder!).toBeLessThan(empCallOrder!);
  });

  it("should call all seed functions", async () => {
    await runAllSeeds(mockRepo);

    expect(departmentSeed.seedDepartments).toHaveBeenCalled();
    expect(userSeed.seedUsers).toHaveBeenCalled();
    expect(employeeSeed.seedEmployees).toHaveBeenCalled();
  });
});
