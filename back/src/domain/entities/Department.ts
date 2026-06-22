// src/domain/entities/Department.ts
import { v4 as uuidv4 } from "uuid";
import { DomainException } from '../exceptions/DomainException';

export class Department {
  public readonly id: string;
  public name: string;
  public code: string;
  public description: string | undefined;
  public headOfDepartmentId: string | undefined;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: {
    id?: string;
    name: string;
    code: string;
    description?: string;
    headOfDepartmentId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.code = data.code;
    this.description = data.description;
    this.headOfDepartmentId = data.headOfDepartmentId;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new DomainException(
        "Department name must be at least 2 characters long",
      );
    }

    if (!this.code || this.code.trim().length < 2) {
      throw new DomainException(
        "Department code must be at least 2 characters long",
      );
    }

    // Code should be uppercase
    if (this.code !== this.code.toUpperCase()) {
      throw new DomainException("Department code must be in uppercase");
    }
  }

  /**
   * Assigne un responsable de département
   */
  public assignHeadOfDepartment(userId: string): void {
    if (!userId) {
      throw new DomainException("Head of Department ID cannot be empty");
    }
    this.headOfDepartmentId = userId;
    this.updatedAt = new Date();
  }

  /**
   * Supprime le responsable de département
   */
  public removeHeadOfDepartment(): void {
    this.headOfDepartmentId = undefined;
    this.updatedAt = new Date();
  }

  public update(data: {
    name?: string;
    code?: string;
    description?: string;
  }): void {
    if (data.name) this.name = data.name;
    if (data.code) this.code = data.code;
    if (data.description !== undefined) this.description = data.description;

    this.updatedAt = new Date();
    this.validate();
  }
}
