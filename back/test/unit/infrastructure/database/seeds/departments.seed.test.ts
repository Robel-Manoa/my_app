/// <reference types="jest" />
import {
  seedDepartments,
  departmentsData,
} from "../../../../../src/infrastructure/database/seeds/departments.seed";
import { Department } from "../../../../../src/domain/entities/Department";

describe("Departments Seed", () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue({}),
    };
  });

  it("should call save for each department in the data", async () => {
    await seedDepartments(mockRepository);

    expect(mockRepository.save).toHaveBeenCalledTimes(departmentsData.length);
  });

  it("should create valid Department entities", async () => {
    await seedDepartments(mockRepository);

    departmentsData.forEach((data, index) => {
      const call = mockRepository.save.mock.calls[index][0];
      expect(call).toBeInstanceOf(Department);
      expect(call.name).toBe(data.name);
      expect(call.code).toBe(data.code);
      expect(call.description).toBe(data.description);
    });
  });

  it("should have all departments with uppercase codes", () => {
    departmentsData.forEach((dept) => {
      expect(dept.code).toBe(dept.code.toUpperCase());
    });
  });
});
