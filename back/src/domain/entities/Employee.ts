// src/domain/entities/Employee.ts
import { v4 as uuidv4 } from "uuid";
import { DomainException } from "../exceptions/DomainException";

export class Employee {
  public readonly id: string;
  public readonly userId: string;
  public employeeNumber: string;
  public departmentId: string;
  public position: string;
  public joinDate: Date;
  public status: EmployeeStatus;
  public phone: string | undefined;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: {
    id?: string;
    userId: string;
    employeeNumber: string;
    departmentId: string;
    position: string;
    joinDate: Date;
    status?: EmployeeStatus;
    phone?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.employeeNumber = data.employeeNumber;
    this.departmentId = data.departmentId;
    this.position = data.position;
    this.joinDate = data.joinDate;
    this.status = data.status || EmployeeStatus.ACTIVE;
    this.phone = data.phone;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.userId) {
      throw new DomainException("Employee must be linked to a User");
    }

    if (!this.employeeNumber || this.employeeNumber.trim().length < 3) {
      throw new DomainException(
        "Employee number must be at least 3 characters long",
      );
    }

    if (!this.departmentId) {
      throw new DomainException("Employee must belong to a Department");
    }

    if (!this.position || this.position.trim().length < 2) {
      throw new DomainException("Position must be at least 2 characters long");
    }

    if (!this.joinDate) {
      throw new DomainException("Join date is required");
    }
  }

  /**
   * Change le statut de l'employé
   */
  public changeStatus(newStatus: EmployeeStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  /**
   * Met à jour les informations de l'employé
   */
  public update(data: {
    position?: string;
    departmentId?: string;
    phone?: string;
  }): void {
    if (data.position) this.position = data.position;
    if (data.departmentId) this.departmentId = data.departmentId;
    if (data.phone !== undefined) this.phone = data.phone;

    this.updatedAt = new Date();
    this.validate();
  }
}

// Value Object - Status
export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
}
