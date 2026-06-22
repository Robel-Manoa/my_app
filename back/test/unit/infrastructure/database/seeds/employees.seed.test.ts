// tests/unit/infrastructure/database/seeds/employees.seed.test.ts
import {
  seedEmployees,
  employeesData,
} from "../../../../../src/infrastructure/database/seeds/employees.seed";
import { Employee } from "../../../../../src/domain/entities/Employee";

describe("Employees Seed", () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue({}),
    };
  });

  it("should seed all employees", async () => {
    await seedEmployees(mockRepository);

    expect(mockRepository.save).toHaveBeenCalledTimes(employeesData.length);
  });

  it("should create valid Employee entities with correct relationships", async () => {
    await seedEmployees(mockRepository);

    employeesData.forEach((data, index) => {
      const call = mockRepository.save.mock.calls[index][0];
      expect(call).toBeInstanceOf(Employee);
      expect(call.userId).toBe(data.userId);
      expect(call.departmentId).toBe(data.departmentId);
      expect(call.employeeNumber).toBe(data.employeeNumber);
      expect(call.status).toBe(data.status);
    });
  });

  it("should have all employees linked to a department", () => {
    employeesData.forEach((emp) => {
      expect(emp.departmentId).toBeDefined();
    });
  });
});
